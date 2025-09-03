package com.healthcare.controller;

import com.healthcare.model.Provider;
import com.healthcare.security.JwtUtil;
import com.healthcare.service.ProviderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/providers")
@CrossOrigin(origins = "http://localhost:3000")
public class ProviderController {

    private final ProviderService providerService;
    private final JwtUtil jwtUtil;

    public ProviderController(ProviderService providerService, JwtUtil jwtUtil) {
        this.providerService = providerService;
        this.jwtUtil = jwtUtil;
    }

    // Public registration for providers
    @PostMapping("/register")
    public ResponseEntity<Provider> register(@RequestBody Provider provider) {
        return ResponseEntity.ok(providerService.register(provider));
    }

    // Provider (or Admin) can fetch their own profile using token
    @GetMapping("/me")
    public ResponseEntity<Provider> me(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractUsername(token);
        Provider p = providerService.getByEmail(email);
        if (p == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(p);
    }

    // Admin can list all providers (this is secured in SecurityConfig by path rules if you put it under /api/admin)
    @GetMapping
    public ResponseEntity<List<Provider>> all() {
        return ResponseEntity.ok(providerService.getAllProviders());
    }
}
