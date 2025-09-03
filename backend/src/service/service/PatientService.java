package com.healthcare.service;

import com.healthcare.dto.PatientResponse;
import com.healthcare.dto.RegisterPatientRequest;
import com.healthcare.exception.ResourceNotFoundException;
import com.healthcare.model.Patient;
import com.healthcare.repository.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.text.ParseException;
import java.text.SimpleDateFormat;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;   // inject from SecurityConfig
    private final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

    public PatientService(PatientRepository patientRepository, PasswordEncoder passwordEncoder) {
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public PatientResponse register(RegisterPatientRequest req) {
        if (req.getEmail() == null || req.getPassword() == null || req.getName() == null) {
            throw new IllegalArgumentException("name, email, password are required");
        }
        if (patientRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }

        Patient p = new Patient();
        p.setName(req.getName());
        p.setEmail(req.getEmail());
        p.setPassword(passwordEncoder.encode(req.getPassword()));  // ✅ encode with injected bean
        p.setPhone(req.getPhone());
        p.setAddress(req.getAddress());

        if (req.getDob() != null && !req.getDob().isEmpty()) {
            try {
                p.setDob(sdf.parse(req.getDob()));
            } catch (ParseException ignored) {}
        }

        p.setGender(req.getGender());

        Patient saved = patientRepository.save(p);
        return toResponse(saved);
    }

    public PatientResponse getById(Integer id) {
        Patient p = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + id));
        return toResponse(p);
    }

    // ✅ NEW: return Patient entity by email (used in AppointmentController)
    public Patient getPatientByEmail(String email) {
        return patientRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with email: " + email));
    }

    private PatientResponse toResponse(Patient p) {
        PatientResponse r = new PatientResponse();
        r.setId(p.getId());
        r.setName(p.getName());
        r.setEmail(p.getEmail());
        r.setPhone(p.getPhone());
        r.setAddress(p.getAddress());
        r.setGender(p.getGender());
        if (p.getDob() != null) {
            r.setDob(new SimpleDateFormat("yyyy-MM-dd").format(p.getDob()));
        }
        return r;
    }
}
