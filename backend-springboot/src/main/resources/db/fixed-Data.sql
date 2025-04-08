-- Bảng OTP
INSERT INTO otp (otp, user_id, get_OTP) VALUES
('123456', 1, 'SMS'),
('333445', 2, 'Email'),
('224336', 3, 'App');

-- Bảng Notification
INSERT INTO notification (user_id, content) VALUES
(1, 'Cây ở khu vực 1 cần tưới nước'),
(2, 'Nhiệt độ khu vực 2 quá cao'),
(3, 'Lịch trình bảo trì thiết bị đã được cập nhật');

-- Bảng Schedule
INSERT INTO schedule (content, area, user_id, date_time) VALUES
('Tưới nước cho cây', 1, 1, '2025-04-09 08:00:00'),
('Kiểm tra thiết bị', 2, 2, '2025-04-10 14:30:00'),
('Thu hoạch quả', 3, 3, '2025-04-11 09:15:00');

-- Bảng Tree
INSERT INTO tree (name, area, season, growth_time, amount) VALUES
('Cây cam', 1, 'Xuân', '2024-03-01 00:00:00', 50),
('Cây táo', 2, 'Hè', '2024-06-15 00:00:00', 30),
('Cây xoài', 3, 'Thu', '2024-09-10 00:00:00', 20);

-- Bảng Record
INSERT INTO record (area, temperature, humidity, light, soil_moisture, datetime) VALUES
(1, 25.5, 60.0, 500.0, 45.0, '2025-04-08 10:00:00'),
(2, 30.2, 55.0, 700.0, 50.0, '2025-04-08 12:00:00'),
(3, 22.8, 70.0, 400.0, 60.0, '2025-04-08 14:00:00');

-- Bảng Device
INSERT INTO device (device_id, area, warranty, drive, input_voltage, output_voltage, state, status, nameofdevices, speed) VALUES
(1, 1, '2 năm', 'Điện', '220V', '24V', TRUE, TRUE, 'Máy bơm nước', 100),
(2, 2, '1 năm', 'Điện', '110V', '12V', FALSE, TRUE, 'Đèn chiếu sáng', 0),
(3, 3, '3 năm', 'Pin', '5V', '5V', TRUE, FALSE, 'Cảm biến độ ẩm', 0);

-- Bảng user_schedule
INSERT INTO user_schedule (username, schedule_id) VALUES
('user', 1),
('user2', 2),
('admin', 3);

-- Bảng staff_schedule
INSERT INTO staff_schedule (username, schedule_id) VALUES
('user', 1),
('user2', 2),
('admin', 3);

-- Bảng tree_record
INSERT INTO tree_record (tree_name, tree_area, record_id) VALUES
('Cây cam', 1, 1),
('Cây táo', 2, 2),
('Cây xoài', 3, 3);

-- Bảng device_area
INSERT INTO device_area (device_id, area) VALUES
(1, 1),
(2, 2),
(3, 3);