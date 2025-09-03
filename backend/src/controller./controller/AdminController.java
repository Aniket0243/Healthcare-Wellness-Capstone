package com.healthcare.controller;

import com.healthcare.model.Appointment;
import com.healthcare.model.Enrollment;
import com.healthcare.model.Patient;
import com.healthcare.model.Provider;
import com.healthcare.model.WellnessService;
import com.healthcare.service.AdminService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final AdminService adminService;
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ------- Manage patients/providers/appointments/enrollments -------
    @GetMapping("/patients")
    public ResponseEntity<List<Patient>> patients() {
        return ResponseEntity.ok(adminService.allPatients());
    }

    @GetMapping("/providers")
    public ResponseEntity<List<Provider>> providers() {
        return ResponseEntity.ok(adminService.allProviders());
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> appointments() {
        return ResponseEntity.ok(adminService.allAppointments());
    }

    @GetMapping("/enrollments")
    public ResponseEntity<List<Enrollment>> enrollments() {
        return ResponseEntity.ok(adminService.allEnrollments());
    }

    // ------- Wellness services CRUD (admin) -------
    @PostMapping("/services")
    public ResponseEntity<WellnessService> createService(@RequestBody WellnessService s) {
        return ResponseEntity.ok(adminService.createService(s));
    }

    @PutMapping("/services/{id}")
    public ResponseEntity<WellnessService> updateService(@PathVariable Integer id,
                                                         @RequestBody WellnessService s) {
        WellnessService updated = adminService.updateService(id, s);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Integer id) {
        boolean ok = adminService.deleteService(id);
        return ok ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // ------- Reports -------
    @GetMapping("/reports/appointments")
    public ResponseEntity<Map<String, Object>> reportAppointments(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        return ResponseEntity.ok(adminService.appointmentSummary(from, to));
    }

    @GetMapping("/reports/service-usage")
    public ResponseEntity<List<Map<String, Object>>> reportServiceUsage() {
        return ResponseEntity.ok(adminService.serviceUsage());
    }
}
