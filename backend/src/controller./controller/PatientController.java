package com.healthcare.controller;

import com.healthcare.dto.PatientResponse;
import com.healthcare.dto.RegisterPatientRequest;
import com.healthcare.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "http://localhost:3000") // frontend dev server (Vite)
public class PatientController {

    private final PatientService patientService;
    public PatientController(PatientService patientService) { this.patientService = patientService; }

    @PostMapping("/register")
    public ResponseEntity<PatientResponse> register(@RequestBody RegisterPatientRequest req) {
        return ResponseEntity.ok(patientService.register(req));
    }


    @GetMapping("/{id}")
    public ResponseEntity<PatientResponse> getOne(@PathVariable Integer id) {
        return ResponseEntity.ok(patientService.getById(id));
    }
}
