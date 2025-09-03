package com.healthcare.service;

import com.healthcare.model.Enrollment;
import com.healthcare.model.WellnessService;
import com.healthcare.repository.EnrollmentRepository;
import com.healthcare.repository.WellnessServiceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WellnessServiceService {

    private final WellnessServiceRepository wellnessRepo;
    private final EnrollmentRepository enrollmentRepo;

    public WellnessServiceService(WellnessServiceRepository wellnessRepo, EnrollmentRepository enrollmentRepo) {
        this.wellnessRepo = wellnessRepo;
        this.enrollmentRepo = enrollmentRepo;
    }

    // Browse all wellness services
    public List<WellnessService> getAllServices() {
        return wellnessRepo.findAll();
    }

    // Enroll patient into a service
    public Enrollment enroll(Enrollment enrollment) {
        return enrollmentRepo.save(enrollment);
    }

    // Get enrollments for a patient
    public List<Enrollment> getEnrollmentsForPatient(Integer patientId) {
        return enrollmentRepo.findByPatientId(patientId);
    }

    // Update progress
    public Enrollment updateProgress(Integer enrollmentId, Integer progress) {
        Enrollment enrollment = enrollmentRepo.findById(enrollmentId).orElse(null);
        if (enrollment != null) {
            enrollment.setProgress(progress);
            return enrollmentRepo.save(enrollment);
        }
        return null;
    }
}
