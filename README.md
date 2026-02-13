🚑 MedOnDoor – Community Healthcare Service Platform

MedOnDoor is a full-stack web application designed to connect users (patients) with healthcare service providers such as doctors, nurses, and medicine delivery personnel.
The platform enables secure authentication, service booking, provider job management, and a rating system, while handling real-world concurrency and race-condition problems at the backend level.

📌 Problem Statement

Accessing timely and reliable healthcare services can be difficult, especially when users need home-based medical assistance.
MedOnDoor aims to simplify this by providing a single platform where users can request medical services and qualified providers can accept and complete those requests efficiently and securely.

🧩 Features
👤 User (Patient) Features

User registration and login

Secure authentication using JWT

Ability to book healthcare services:

Doctor consultation

Nurse home visit

Medicine delivery

View booking status:

PENDING

ACCEPTED

COMPLETED

View complete booking history

Rate and review services after completion

Logout functionality

Role-based access control (users cannot access provider dashboards)

🧑‍⚕️ Service Provider Features

Provider registration with service type selection

Secure login using JWT

Provider dashboard to manage jobs

View all available user requests (PENDING)

Accept a booking (job claiming)

View only their own accepted bookings

Mark accepted bookings as completed

Logout functionality

Role-based access control (providers cannot access user pages)

⭐ Rating & Review System

Users can rate a service only after the booking is marked COMPLETED

Rating scale enforced (1–5)

Optional review/comment

Ratings are linked to:

Booking

User

Provider

Prevents invalid or premature ratings

🔐 Authentication & Security

Password hashing using bcrypt

JWT-based stateless authentication

Token verification middleware for protected routes

Role-based authorization enforced at backend

Frontend route protection using token and role checks

Unauthorized users are redirected to login

⚙️ Clever Backend Logic & Safeguards
✅ Job Claiming Logic (Marketplace Safety)

Multiple providers can initially see the same PENDING booking

Only one provider can accept a booking

Once accepted:

The booking disappears from all other providers’ dashboards

Remains visible only to the provider who accepted it

✅ Race Condition Prevention

Booking acceptance is enforced at the database level using conditional SQL:

WHERE status = 'PENDING'


Prevents two providers from accepting the same job simultaneously

Backend checks affected rows to confirm acceptance

Ensures atomic and concurrency-safe job assignment

✅ Double-Click Prevention

Accept button is disabled immediately after clicking

Button text changes to “Accepting…” for user feedback

Prevents accidental multiple requests from the same provider

Backend logic still enforces safety even if frontend is bypassed

✅ State-Based UI Rendering

Provider dashboard dynamically updates based on booking status:

PENDING → Accept button

ACCEPTED → Mark Completed button

Completed bookings are removed from provider dashboard

User booking history clearly reflects status transitions

🔄 Booking Lifecycle
PENDING → ACCEPTED → COMPLETED


Users create bookings

Providers accept and complete bookings

Status transitions are strictly controlled by backend

Users cannot manipulate booking status

Providers cannot complete unaccepted bookings
