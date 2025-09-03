package com.healthcare.security;

import com.healthcare.model.Patient;
import com.healthcare.model.Provider;
import com.healthcare.repository.PatientRepository;
import com.healthcare.repository.ProviderRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final PatientRepository patientRepository;
    private final ProviderRepository providerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // comma-separated admin emails in application.properties
    @Value("${admin.emails:}")
    private String adminEmailsCsv;

    private Set<String> adminEmails;

    @PostConstruct
    void initAdmins() {
        adminEmails = Arrays.stream(adminEmailsCsv.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(String::toLowerCase)
                .collect(Collectors.toSet());
    }

    public AuthService(PatientRepository patientRepository,
                       ProviderRepository providerRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.patientRepository = patientRepository;
        this.providerRepository = providerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public String login(String email, String password) {
        // Patient login
        Patient patient = patientRepository.findByEmail(email).orElse(null);
        if (patient != null && passwordEncoder.matches(password, patient.getPassword())) {
            return jwtUtil.generateToken(patient.getEmail(), "PATIENT");
        }

        // Provider (or Admin via whitelist)
        Provider provider = providerRepository.findByEmail(email).orElse(null);
        if (provider != null && passwordEncoder.matches(password, provider.getPassword())) {
            String role = adminEmails.contains(provider.getEmail().toLowerCase())
                    ? "ADMIN"
                    : provider.getRole().name(); // DOCTOR or WELLNESS_PROVIDER
            return jwtUtil.generateToken(provider.getEmail(), role);
        }

        throw new RuntimeException("Invalid email or password");
    }
    
    
}
