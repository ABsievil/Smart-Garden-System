-- Insert fake data into users
INSERT INTO users (email, ssn, sex, id, username, "password", fname, lname, dob, salary, numsofdevice, numofschedules, "role", "address", phonenumber) VALUES
('john.doe@example.com', '123-45-6789', 'Male', 'U001', 'admin', '$2a$10$AsShgXxC.4RtUbL0hFnOPebJHSek4QUAQ7/Jhj8OcwXlZ7y34ZPx2', 'John', 'Doe', '1990-05-15', 50000, 3, 5, 'ADMIN', '123 Green Street, Springfield', '123-45-6789'),
('jane.smith@example.com', '987-65-4321', 'Female', 'U002', 'user', '$2a$10$AsShgXxC.4RtUbL0hFnOPebJHSek4QUAQ7/Jhj8OcwXlZ7y34ZPx2', 'Jane', 'Smith', '1985-10-20', 55000, 2, 3, 'USER', '456 Oak Avenue, Maple Town', '987-65-4321'),
('alice.johnson@example.com', '567-89-0123', 'Female', 'U003', 'user2', '$2a$10$AsShgXxC.4RtUbL0hFnOPebJHSek4QUAQ7/Jhj8OcwXlZ7y34ZPx2', 'Alice', 'Johnson', '1992-07-25', 48000, 4, 2, 'USER', '789 Pine Street, Woodland', '567-89-0123'),
('bob.williams@example.com', '345-67-8901', 'Male', 'U004', 'admin', '$2a$10$AsShgXxC.4RtUbL0hFnOPebJHSek4QUAQ7/Jhj8OcwXlZ7y34ZPx2', 'Bob', 'Williams', '1988-03-12', 53000, 3, 4, 'ADMIN', '321 Birch Lane, Rivertown', '345-67-8901');

-- Insert fake data into ADMIN
INSERT INTO "ADMIN" (id, "role") VALUES
('U001', 'ADMIN'),
('U004', 'ADMIN');

-- Insert fake data into staff
INSERT INTO staff (id, id_admin, "role") VALUES
('U002', 'U001', 'USER'),
('U003', 'U004', 'USER');

-- Insert fake data into area
INSERT INTO area ("position") VALUES
('North Zone'),
('South Zone'),
('East Zone'),
('West Zone');

-- Insert fake data into device
INSERT INTO device (guaranteetime, id, outputvoltage, inputvoltage, driver, state, status, nameofdevices, id_user) VALUES
('[2023-01-01,2025-01-01]', 'D001', 220, 220, 'ACME Driver', true, false, 'Smart Irrigation', 'U001'),
('[2022-06-01,2024-06-01]', 'D002', 220, 220, 'XYZ Driver', false, true, 'Soil Moisture Sensor', 'U002'),
('[2023-05-01,2026-05-01]', 'D003', 220, 220, 'TechPower Driver', true, true, 'Temperature Sensor', 'U003'),
('[2021-09-01,2024-09-01]', 'D004', 220, 220, 'Mega Driver', false, false, 'Humidity Monitor', 'U004');

-- Insert fake data into tree
INSERT INTO tree (nameoftypetree, amount, growthtime, season) VALUES
('Oak', 50, '[2020-01-01,2025-01-01]', 'Spring'),
('Pine', 30, '[2019-01-01,2024-01-01]', 'Winter'),
('Maple', 20, '[2021-02-01,2026-02-01]', 'Autumn'),
('Birch', 15, '[2022-03-01,2027-03-01]', 'Summer');

-- Insert fake data into record
INSERT INTO record (priodoftime, temperature, humidity, lightindensity, soilmoisture, id_record) VALUES
('[2024-03-01,2024-03-31]', 22.5, 55.4, 1000, 40.2, 'U001'),
('[2024-02-01,2024-02-28]', 18.3, 60.7, 950, 45.5, 'U002'),
('[2024-04-01,2024-04-30]', 25.0, 50.3, 1100, 38.7, 'U003'),
('[2024-05-01,2024-05-31]', 27.8, 45.9, 1200, 36.9, 'U004');

-- Insert fake data into schedule
INSERT INTO schedule (datetime, id, id_user, periodoftime_schedule) VALUES
('2024-03-10', 'S001', 'U001', '[2024-03-01,2024-03-31]'),
('2024-02-15', 'S002', 'U002', '[2024-02-01,2024-02-28]'),
('2024-04-05', 'S003', 'U003', '[2024-04-01,2024-04-30]'),
('2024-05-12', 'S004', 'U004', '[2024-05-01,2024-05-31]');

-- Insert fake data into content_schedule
INSERT INTO content_schedule (id, "content") VALUES
('S001', 'Watering trees in the morning'),
('S002', 'Fertilizing soil in the evening'),
('S003', 'Monitoring temperature sensors'),
('S004', 'Checking humidity levels');

-- Insert fake data into otp
INSERT INTO otp (code, id_user) VALUES
('123456', 'U001'),
('123457', 'U002'),
('123458', 'U003'),
('123459', 'U004');

--Insert fake data into stay_in
INSERT INTO stay_in (id_staff, id_device, position_area) VALUES
('U002', 'D002', 'North Zone'),
('U003', 'D003', 'East Zone');
--('U004', 'D004', 'West Zone');

-- Insert fake data into notification_supervisor
INSERT INTO notification_supervisor (id, id_admin, notification) VALUES
('U002', 'U001', 'Device D002 requires maintenance.'),
('U003', 'U004', 'Sensor D003 reported abnormal readings.');
--('U004', 'U001', 'Device D004 needs recalibration.');




