package com.healthcare.repository;

import com.healthcare.model.WellnessService;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WellnessServiceRepository extends JpaRepository<WellnessService, Integer> {
}
