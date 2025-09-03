package com.healthcare.service;

import com.healthcare.model.Appointment;
import com.healthcare.model.Patient;
import com.healthcare.model.Payment;
import com.healthcare.model.WellnessService;
import com.healthcare.repository.AppointmentRepository;
import com.healthcare.repository.PatientRepository;
import com.healthcare.repository.PaymentRepository;
import com.healthcare.repository.WellnessServiceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final WellnessServiceRepository wellnessServiceRepository;

    public PaymentService(PaymentRepository paymentRepository,
                          PatientRepository patientRepository,
                          AppointmentRepository appointmentRepository,
                          WellnessServiceRepository wellnessServiceRepository) {
        this.paymentRepository = paymentRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.wellnessServiceRepository = wellnessServiceRepository;
    }

    // Create new payment for appointment or service
    public Payment makePayment(Integer patientId, Integer appointmentId, Integer serviceId, String status) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Appointment appointment = null;
        if (appointmentId != null) {
            appointment = appointmentRepository.findById(appointmentId)
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));
        }

        WellnessService service = null;
        if (serviceId != null) {
            service = wellnessServiceRepository.findById(serviceId)
                    .orElseThrow(() -> new RuntimeException("Service not found"));
        }

        Payment payment = new Payment();
        payment.setPatient(patient);
        payment.setAppointment(appointment);
        payment.setService(service);
        payment.setPaymentStatus(status != null ? status : "PENDING");
        payment.setPaymentDate(LocalDateTime.now());
        payment.setTransactionId(UUID.randomUUID().toString());

        return paymentRepository.save(payment);
    }

    // Get payments for a patient
    public List<Payment> getPaymentsForPatient(Integer patientId) {
        return paymentRepository.findByPatientId(patientId);
    }

    // Admin: get all payments
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // Find by transaction
    public Payment getByTransactionId(String transactionId) {
        return paymentRepository.findByTransactionId(transactionId);
    }
}
