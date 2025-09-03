# Healthcare-Wellness-Capstone

# 🏥Health & Wellness Management System

A full-stack **Healthcare & Wellness Platform** designed to connect **patients, providers, and administrators** in one place.  
It simplifies **appointments, payments, and wellness services** while providing a modern and user-friendly interface.  

---

## 🎯 Project Aim

Healthcare today is scattered — patients book appointments in one place, pay elsewhere, and track wellness separately.  
This project aims to **unify everything into one system**:

- ✅ Patients can manage **appointments, payments, and wellness programs** from a single dashboard.  
- ✅ Providers (Doctors/Wellness Experts) can manage **their profile, patients, and appointments** efficiently.  
- ✅ Admins can oversee **users, services, appointments, and finances** in a centralized portal.  

Ultimately, the project helps to **improve healthcare accessibility and wellness tracking** in a simple, digital way.

---

## ✨ Key Features

### 👩‍⚕️ Patient
- Register & login securely.
- Book & manage **doctor appointments**.
- Enroll in **wellness services** (Yoga, Meditation, Therapy, etc.).
- Make secure **payments** and download PDF receipts.
- Access a **dashboard** with quick actions.

### 🩺 Provider (Doctor / Wellness Provider)
- Manage profile (specialization, contact, role).
- View upcoming **appointments** with patients.
- Add **notes & track progress** for patients.
- See their assigned services.

### 🛡️ Admin
- Manage **all users** (patients, providers).
- Add/Edit/Delete **wellness services**.
- Oversee **appointments, payments, and reports**.
- Access advanced **analytics (future scope)**.

### 💳 Payments
- Patients can pay securely for services.
- Generate and download **beautiful PDF receipts** instantly.

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ React + React Router
- 🎨 Bootstrap 5 + Custom CSS
- 🎭 Lucide Icons
- 📡 Axios (API calls)
- 📄 jsPDF (receipt generation)

### Backend
- ☕ Spring Boot (Java)
- 🔐 Spring Security + JWT Authentication
- 🗄️ MySQL (via JPA/Hibernate)
- 📡 RESTful APIs

---

## 🚀 Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/yourusername/health-wellness.git
cd health-wellness

Backend run 
cd backend
mvn clean install
mvn spring-boot:run


Frontend run 

cd frontend
npm install
npm start

API endpoints :

Authentication

POST /api/auth/login

POST /api/patients/register

POST /api/providers/register

Patients

GET /api/appointments/my

POST /api/wellness/enroll/{serviceId}

GET /api/payments/my

Providers

GET /api/providers/me

GET /api/appointments/provider/my

Admin

GET /api/payments/all

POST /api/admin/services

Future Enhancements

📊 Analytics Dashboard for Admin.

📅 Calendar integration for appointments.

💬 Chat system between patient & doctor.


Developed by : ANIKET KUMAR
