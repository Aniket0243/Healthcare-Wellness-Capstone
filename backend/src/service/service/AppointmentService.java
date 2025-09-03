package com.healthcare.service;

import com.healthcare.model.Appointment;
import com.healthcare.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    // Patient: create new appointment
    public Appointment createAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    // Patient: see their own appointments
    public List<Appointment> getAppointmentsForPatient(Integer patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    // Provider: see their own appointments
    public List<Appointment> getAppointmentsForProvider(Integer providerId) {
        return appointmentRepository.findByProviderId(providerId);
    }

    // Admin: see all appointments
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    // Common: find one appointment by id
    public Appointment getAppointmentById(Integer id) {
        return appointmentRepository.findById(id).orElse(null);
    }
    
    public Appointment getById(Integer id) {
        return appointmentRepository.findById(id).orElse(null);
    }

    public Appointment updateAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

}
