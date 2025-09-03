package com.healthcare.controller;

import com.healthcare.model.Appointment;
import com.healthcare.model.Patient;
import com.healthcare.model.Provider;
import com.healthcare.security.JwtUtil;
import com.healthcare.service.AppointmentService;
import com.healthcare.service.PatientService;
import com.healthcare.service.ProviderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final PatientService patientService;
    private final ProviderService providerService;
    private final JwtUtil jwtUtil;

    public AppointmentController(AppointmentService appointmentService,
                                 PatientService patientService,
                                 ProviderService providerService,
                                 JwtUtil jwtUtil) {
        this.appointmentService = appointmentService;
        this.patientService = patientService;
        this.providerService = providerService;
        this.jwtUtil = jwtUtil;
    }

    // ✅ Patient creates appointment
    @PostMapping
    public ResponseEntity<Appointment> create(@RequestHeader("Authorization") String authHeader,
                                              @RequestBody Appointment appointmentRequest) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractUsername(token);

        Patient patient = patientService.getPatientByEmail(email);
        if (patient == null) {
            return ResponseEntity.status(404).build();
        }

        // attach patient
        appointmentRequest.setPatient(patient);

        // attach provider if provided
        if (appointmentRequest.getProvider() != null && appointmentRequest.getProvider().getId() != null) {
            Provider provider = providerService.getProviderById(appointmentRequest.getProvider().getId());
            if (provider == null) {
                return ResponseEntity.badRequest().build();
            }
            appointmentRequest.setProvider(provider);
        }

        return ResponseEntity.ok(appointmentService.createAppointment(appointmentRequest));
    }

    // ✅ Patient: see own appointments
    @GetMapping("/my")
    public ResponseEntity<List<Appointment>> myAppointments(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractUsername(token);

        Patient patient = patientService.getPatientByEmail(email);
        if (patient == null) {
            return ResponseEntity.status(404).build();
        }

        return ResponseEntity.ok(appointmentService.getAppointmentsForPatient(patient.getId()));
    }

    // ✅ Provider: see own appointments
    @GetMapping("/provider/my")
    public ResponseEntity<List<Appointment>> myForProvider(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractUsername(token);

        Provider provider = providerService.getByEmail(email);
        if (provider == null) {
            return ResponseEntity.status(404).build();
        }

        return ResponseEntity.ok(appointmentService.getAppointmentsForProvider(provider.getId()));
    }

    // ✅ Admin: see all appointments
    @GetMapping
    public ResponseEntity<List<Appointment>> all() {
        // access restricted by SecurityConfig → only ADMIN
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

//✅ Cancel appointment
    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<Void> cancel(@PathVariable Integer id,
                                       @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractUsername(token);
        String role = jwtUtil.extractRole(token);

        Appointment appointment = appointmentService.getById(id);
        if (appointment == null) return ResponseEntity.notFound().build();

        // ✅ Patients can only cancel their own
        if ("PATIENT".equals(role)) {
            if (!appointment.getPatient().getEmail().equals(email)) {
                return ResponseEntity.status(403).build();
            }
        }

        // ✅ Providers can cancel their own
        if ("DOCTOR".equals(role) || "WELLNESS_PROVIDER".equals(role)) {
            if (!appointment.getProvider().getEmail().equals(email)) {
                return ResponseEntity.status(403).build();
            }
        }

        appointment.setStatus("CANCELLED");
        appointmentService.updateAppointment(appointment);

        return ResponseEntity.ok().build();
    }


//✅ Reschedule appointment
@PutMapping("/{id}/reschedule")
public ResponseEntity<Appointment> rescheduleAppointment(
     @PathVariable Integer id,
     @RequestHeader("Authorization") String authHeader,
     @RequestBody Appointment updatedRequest) {
 String token = authHeader.replace("Bearer ", "");
 String email = jwtUtil.extractUsername(token);
 String role = jwtUtil.extractRole(token);

 Appointment appointment = appointmentService.getById(id);
 if (appointment == null) return ResponseEntity.notFound().build();

 // Only patient who booked or provider/admin can reschedule
 if ("PATIENT".equals(role) && !appointment.getPatient().getEmail().equals(email)) {
     return ResponseEntity.status(403).build();
 }
 if ("PROVIDER".equals(role) && !appointment.getProvider().getEmail().equals(email)) {
     return ResponseEntity.status(403).build();
 }

 // Update appointment date/time and optional notes
 appointment.setAppointmentDate(updatedRequest.getAppointmentDate());
 if (updatedRequest.getNotes() != null) {
     appointment.setNotes(updatedRequest.getNotes());
 }
 appointment.setStatus("RESCHEDULED");

 return ResponseEntity.ok(appointmentService.updateAppointment(appointment));
}
}
