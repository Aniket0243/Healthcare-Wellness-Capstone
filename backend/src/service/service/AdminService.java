package com.healthcare.service;

import com.healthcare.model.Appointment;
import com.healthcare.model.Enrollment;
import com.healthcare.model.Patient;
import com.healthcare.model.Provider;
import com.healthcare.model.WellnessService;
import com.healthcare.repository.AppointmentRepository;
import com.healthcare.repository.EnrollmentRepository;
import com.healthcare.repository.PatientRepository;
import com.healthcare.repository.ProviderRepository;
import com.healthcare.repository.WellnessServiceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final PatientRepository patientRepo;
    private final ProviderRepository providerRepo;
    private final AppointmentRepository appointmentRepo;
    private final EnrollmentRepository enrollmentRepo;
    private final WellnessServiceRepository wellnessRepo;

    public AdminService(PatientRepository patientRepo,
                        ProviderRepository providerRepo,
                        AppointmentRepository appointmentRepo,
                        EnrollmentRepository enrollmentRepo,
                        WellnessServiceRepository wellnessRepo) {
        this.patientRepo = patientRepo;
        this.providerRepo = providerRepo;
        this.appointmentRepo = appointmentRepo;
        this.enrollmentRepo = enrollmentRepo;
        this.wellnessRepo = wellnessRepo;
    }

    // ----- Manage lists -----
    public List<Patient> allPatients() { return patientRepo.findAll(); }
    public List<Provider> allProviders() { return providerRepo.findAll(); }
    public List<Appointment> allAppointments() { return appointmentRepo.findAll(); }
    public List<Enrollment> allEnrollments() { return enrollmentRepo.findAll(); }

    // ----- Wellness services CRUD (admin) -----
    public WellnessService createService(WellnessService s) {
        return wellnessRepo.save(s);
    }

    public WellnessService updateService(Integer id, WellnessService s) {
        return wellnessRepo.findById(id).map(existing -> {
            existing.setName(s.getName());
            existing.setDescription(s.getDescription());
            existing.setDuration(s.getDuration());
            existing.setFee(s.getFee());
            return wellnessRepo.save(existing);
        }).orElse(null);
    }

    public boolean deleteService(Integer id) {
        if (!wellnessRepo.existsById(id)) return false;
        wellnessRepo.deleteById(id);
        return true;
    }

    // ----- Reports (very simple) -----
    public Map<String, Object> appointmentSummary(LocalDate from, LocalDate to) {
        List<Appointment> all = appointmentRepo.findAll();
        if (from != null || to != null) {
            Date fromDate = from == null ? new Date(0)
                    : Date.from(from.atStartOfDay(ZoneId.systemDefault()).toInstant());
            Date toDate = to == null ? new Date(Long.MAX_VALUE)
                    : Date.from(to.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
            all = all.stream()
                    .filter(a -> a.getAppointmentDate() != null
                            && !a.getAppointmentDate().before(fromDate)
                            && a.getAppointmentDate().before(toDate))
                    .collect(Collectors.toList());
        }

        Map<String, Long> byStatus = all.stream()
                .collect(Collectors.groupingBy(
                        a -> (a.getStatus() == null ? "UNKNOWN" : a.getStatus()),
                        Collectors.counting()
                ));




        Map<String, Object> out = new LinkedHashMap<>();
        out.put("total", all.size());
        out.put("byStatus", byStatus);
        return out;
    }

    // Service utilization (enrollments per service)
    public List<Map<String, Object>> serviceUsage() {
        List<Enrollment> enrollments = enrollmentRepo.findAll();
        Map<Integer, Long> counts = enrollments.stream()
                .filter(e -> e.getService() != null && e.getService().getId() != null)
                .collect(Collectors.groupingBy(e -> e.getService().getId(), Collectors.counting()));

        // join with service names
        List<WellnessService> services = wellnessRepo.findAll();
        Map<Integer, String> names = services.stream()
                .filter(s -> s.getId() != null)
                .collect(Collectors.toMap(WellnessService::getId, WellnessService::getName));

        List<Map<String, Object>> result = new ArrayList<>();
        counts.forEach((svcId, cnt) -> {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("serviceId", svcId);
            row.put("serviceName", names.getOrDefault(svcId, "Unknown"));
            row.put("enrollments", cnt);
            result.add(row);
        });

        // sort desc by enrollments
        result.sort((a, b) -> Long.compare(
                (Long) b.get("enrollments"),
                (Long) a.get("enrollments")
        ));
        return result;
    }
}
