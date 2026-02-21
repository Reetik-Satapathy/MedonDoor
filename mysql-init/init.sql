-- CREATE DATABASE healthcare_app;
USE healthcare_app;


CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role ENUM('user','provider') DEFAULT 'user'
);

CREATE TABLE providers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  service_type ENUM('doctor','nurse','delivery'),
  verified BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50)
);

INSERT INTO services (name) VALUES
('Doctor Consultation'),
('Nurse Home Visit'),
('Medicine Delivery');

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  provider_id INT NULL,
  service_id INT,
  status ENUM('PENDING','PAID','ACCEPTED','COMPLETED') DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT,
  transaction_id VARCHAR(100),
  amount DECIMAL(10,2),
  status VARCHAR(20)
);

CREATE TABLE ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT,
  user_id INT,
  provider_id INT,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (booking_id) REFERENCES bookings(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (provider_id) REFERENCES users(id)
);