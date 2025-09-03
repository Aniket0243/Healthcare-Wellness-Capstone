package com.healthcare.repository;

import com.healthcare.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    List<Appointment> findByPatientId(Integer patientId);
    List<Appointment> findByProviderId(Integer providerId);
}
