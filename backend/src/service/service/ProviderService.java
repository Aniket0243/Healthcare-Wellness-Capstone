package com.healthcare.service;

import com.healthcare.model.Provider;
import com.healthcare.repository.ProviderRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProviderService {

    private final ProviderRepository providerRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public ProviderService(ProviderRepository providerRepository) {
        this.providerRepository = providerRepository;
    }

    public Provider register(Provider provider) {
        if (provider.getEmail() == null || provider.getPassword() == null || provider.getName() == null) {
            throw new IllegalArgumentException("name, email, password are required");
        }
        if (providerRepository.findByEmail(provider.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }
        // default role if null
        if (provider.getRole() == null) {
            provider.setRole(Provider.Role.DOCTOR); // assuming enum has PROVIDER
        }
        provider.setPassword(encoder.encode(provider.getPassword()));
        return providerRepository.save(provider);
    }

    public List<Provider> getAllProviders() {
        return providerRepository.findAll();
    }

    public Provider getProviderById(Integer id) {
        return providerRepository.findById(id).orElse(null);
    }

    public Provider getByEmail(String email) {
        return providerRepository.findByEmail(email).orElse(null);
    }
}
