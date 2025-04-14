
-- Bảng Users (kết hợp thông tin User, Staff và Admin)
CREATE TABLE users (
    username VARCHAR(255) PRIMARY KEY,
    password VARCHAR NOT NULL,
    role VARCHAR(50) NOT NULL,
    user_id INTEGER,
    id VARCHAR,
    date_of_birth DATE,
    ssn VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255),
    address VARCHAR(255),
    sex VARCHAR(10),
    fname VARCHAR(255),
    lname VARCHAR(255),
    salary INTEGER,
    numsofdevice INTEGER,
    numofschedules INTEGER
);

CREATE SEQUENCE users_id_seq;

ALTER TABLE users 
ALTER COLUMN id SET DEFAULT nextval('users_id_seq');

SELECT setval('users_id_seq', 1);

-- Bảng OTP
CREATE TABLE otp (
    otp VARCHAR(255),
    user_id INTEGER,
    get_OTP VARCHAR(255),
    CONSTRAINT pk_otp PRIMARY KEY (otp, user_id)
);

-- Bảng Notification
CREATE TABLE notification (
    user_id INTEGER,
    content VARCHAR(255),
    CONSTRAINT pk_notification PRIMARY KEY (user_id, content)
);

-- Bảng Schedule
CREATE TABLE schedule (
    id SERIAL PRIMARY KEY, -- Thêm cột id làm khóa chính
    content VARCHAR(255),
    area INTEGER,
    user_id INTEGER,
    date_time TIMESTAMP
);
-- Bảng Tree
CREATE TABLE tree (
    name VARCHAR(255),
    area INTEGER,
    season VARCHAR(255),
    growth_time TIMESTAMP,
    amount INTEGER,
    CONSTRAINT pk_tree PRIMARY KEY (name, area)
);

-- Bảng Record
CREATE TABLE record (
    area INTEGER,
    temperature DOUBLE PRECISION,
    humidity DOUBLE PRECISION,
    light DOUBLE PRECISION,
    soil_moisture DOUBLE PRECISION,
    datetime TIMESTAMP,
    id SERIAL PRIMARY KEY
);

-- Bảng Device
CREATE TABLE device (
    device_id INTEGER PRIMARY KEY,
    area INTEGER,
    warranty VARCHAR(255),
    drive VARCHAR(255),
    input_voltage VARCHAR(255),
    output_voltage VARCHAR(255),
    state BOOLEAN,
    status BOOLEAN,
    nameofdevices varchar NOT NULL,
    speed INTEGER
);

-- Bảng quan hệ giữa User và Schedule
CREATE TABLE user_schedule (
    username VARCHAR(255),
    schedule_id INTEGER,
    CONSTRAINT pk_user_schedule PRIMARY KEY (username, schedule_id),
    CONSTRAINT fk_user_schedule_user FOREIGN KEY (username) REFERENCES users(username),
    CONSTRAINT fk_user_schedule_schedule FOREIGN KEY (schedule_id) REFERENCES schedule(id)
);

-- Bảng quan hệ giữa Staff và Schedule
CREATE TABLE staff_schedule (
    username VARCHAR(255),
    schedule_id INTEGER,
    CONSTRAINT pk_staff_schedule PRIMARY KEY (username, schedule_id),
    CONSTRAINT fk_staff_schedule_user FOREIGN KEY (username) REFERENCES users(username),
    CONSTRAINT fk_staff_schedule_schedule FOREIGN KEY (schedule_id) REFERENCES schedule(id)
);

-- Bảng quan hệ giữa Tree và Record
CREATE TABLE tree_record (
    tree_name VARCHAR(255),
    tree_area INTEGER,
    record_id INTEGER,
    CONSTRAINT pk_tree_record PRIMARY KEY (tree_name, tree_area, record_id),
    CONSTRAINT fk_tree_record_tree FOREIGN KEY (tree_name, tree_area) REFERENCES tree(name, area),
    CONSTRAINT fk_tree_record_record FOREIGN KEY (record_id) REFERENCES record(id)
);

-- Bảng quan hệ giữa Device và Area
CREATE TABLE device_area (
    device_id INTEGER,
    area INTEGER,
    CONSTRAINT pk_device_area PRIMARY KEY (device_id, area),
    CONSTRAINT fk_device_area_device FOREIGN KEY (device_id) REFERENCES device(device_id)
);