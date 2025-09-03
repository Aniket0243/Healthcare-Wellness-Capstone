package com.healthcare.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relation with Patient
    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    // Relation with Provider
    @ManyToOne
    @JoinColumn(name = "provider_id", nullable = false)
    private Provider provider;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date appointmentDate;

    @Column(length = 20, nullable = false)
    private String status;   // e.g. SCHEDULED, COMPLETED, CANCELLED

    private String notes;

    // --- Constructors ---
    public Appointment() {}

    public Appointment(Patient patient, Provider provider, Date appointmentDate, String status, String notes) {
        this.patient = patient;
        this.provider = provider;
        this.appointmentDate = appointmentDate;
        this.status = status;
        this.notes = notes;
    }

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public Provider getProvider() { return provider; }
    public void setProvider(Provider provider) { this.provider = provider; }

    public Date getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(Date appointmentDate) { this.appointmentDate = appointmentDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
