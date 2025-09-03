package com.healthcare.controller;

import com.healthcare.model.Payment;
import com.healthcare.model.Patient;
import com.healthcare.security.JwtUtil;
import com.healthcare.service.PatientService;
import com.healthcare.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    private final PaymentService paymentService;
    private final PatientService patientService;
    private final JwtUtil jwtUtil;

    public PaymentController(PaymentService paymentService,
                             PatientService patientService,
                             JwtUtil jwtUtil) {
        this.paymentService = paymentService;
        this.patientService = patientService;
        this.jwtUtil = jwtUtil;
    }

    // PATIENT: create a manual payment for appointment or service
    @PostMapping
    public ResponseEntity<?> makePayment(@RequestHeader("Authorization") String authHeader,
                                         @RequestBody Map<String, Object> body) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractUsername(token);
        String role  = jwtUtil.extractRole(token);

        if (!"PATIENT".equals(role)) {
            return ResponseEntity.status(403).body("Only PATIENT can make payments.");
        }

        Patient patient = patientService.getPatientByEmail(email);
        if (patient == null) {
            return ResponseEntity.status(404).body("Patient not found for email " + email);
        }

        Integer appointmentId = null;
        Integer serviceId = null;
        String status = "SUCCESS"; // default

        if (body.get("appointmentId") != null) {
            appointmentId = ((Number) body.get("appointmentId")).intValue();
        }
        if (body.get("serviceId") != null) {
            serviceId = ((Number) body.get("serviceId")).intValue();
        }
        if (body.get("status") != null) {
            status = body.get("status").toString().toUpperCase(); // SUCCESS / FAILED / PENDING
        }

        if (appointmentId == null && serviceId == null) {
            return ResponseEntity.badRequest().body("Either appointmentId or serviceId is required.");
        }

        Payment payment = paymentService.makePayment(patient.getId(), appointmentId, serviceId, status);
        return ResponseEntity.ok(payment);
    }

    // PATIENT: view my payments
    @GetMapping("/my")
    public ResponseEntity<?> myPayments(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractUsername(token);
        String role  = jwtUtil.extractRole(token);

        if (!"PATIENT".equals(role)) {
            return ResponseEntity.status(403).body("Only PATIENT can view own payments.");
        }

        Patient patient = patientService.getPatientByEmail(email);
        if (patient == null) {
            return ResponseEntity.status(404).body("Patient not found for email " + email);
        }

        List<Payment> list = paymentService.getPaymentsForPatient(patient.getId());
        return ResponseEntity.ok(list);
    }

    // ADMIN: all payments
    @GetMapping("/all")
    public ResponseEntity<List<Payment>> allPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    // ADMIN: find by transaction id
    @GetMapping("/tx/{txId}")
    public ResponseEntity<?> byTransaction(@PathVariable String txId) {
        Payment p = paymentService.getByTransactionId(txId);
        if (p == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(p);
    }
}
