package com.healthcare.controller;

import com.healthcare.model.Enrollment;
import com.healthcare.model.WellnessService;
import com.healthcare.security.JwtUtil;
import com.healthcare.service.PatientService;
import com.healthcare.service.WellnessServiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/wellness")
@CrossOrigin(origins = "http://localhost:3000")
public class WellnessServiceController {

    private final WellnessServiceService wellnessServiceService;
    private final JwtUtil jwtUtil;
    private final PatientService patientService;

    public WellnessServiceController(WellnessServiceService wellnessServiceService,
                                     JwtUtil jwtUtil,
                                     PatientService patientService) {
        this.wellnessServiceService = wellnessServiceService;
        this.jwtUtil = jwtUtil;
        this.patientService = patientService;
    }

    // ✅ Browse available services
    @GetMapping("/services")
    public ResponseEntity<List<WellnessService>> getAllServices() {
        return ResponseEntity.ok(wellnessServiceService.getAllServices());
    }

    // ✅ Enroll patient in service
    @PostMapping("/enroll/{serviceId}")
    public ResponseEntity<Enrollment> enroll(@RequestHeader("Authorization") String authHeader,
                                             @PathVariable Integer serviceId) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractUsername(token);
        var patient = patientService.getPatientByEmail(email);

        if (patient == null) {
            return ResponseEntity.status(404).build();
        }

        WellnessService service = new WellnessService();
        service.setId(serviceId);

        Enrollment enrollment = new Enrollment();
        enrollment.setPatient(patient);
        enrollment.setService(service);
        enrollment.setStartDate(LocalDate.now());
        enrollment.setEndDate(LocalDate.now().plusDays(30)); // example default duration
        enrollment.setProgress(0);

        return ResponseEntity.ok(wellnessServiceService.enroll(enrollment));
    }

    // ✅ Get patient enrollments
    @GetMapping("/my-enrollments")
    public ResponseEntity<List<Enrollment>> myEnrollments(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractUsername(token);
        var patient = patientService.getPatientByEmail(email);

        if (patient == null) {
            return ResponseEntity.status(404).build();
        }

        return ResponseEntity.ok(wellnessServiceService.getEnrollmentsForPatient(patient.getId()));
    }

    // ✅ Update progress
    @PutMapping("/progress/{enrollmentId}")
    public ResponseEntity<Enrollment> updateProgress(@PathVariable Integer enrollmentId,
                                                     @RequestParam Integer progress) {
        Enrollment updated = wellnessServiceService.updateProgress(enrollmentId, progress);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }
}
