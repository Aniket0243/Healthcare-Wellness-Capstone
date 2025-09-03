package com.healthcare.repository;

import com.healthcare.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    List<Payment> findByPatientId(Integer patientId);
    Payment findByTransactionId(String transactionId);
}
