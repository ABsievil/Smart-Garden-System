
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

--  xóa column id
ALTER TABLE users
DROP COLUMN id;
DROP SEQUENCE users_id_seq;

-- thêm contraint cho user_id
CREATE SEQUENCE users_id_seq;

ALTER TABLE users 
ALTER COLUMN user_id SET DEFAULT nextval('users_id_seq');

SELECT setval('users_id_seq', 3);

ALTER TABLE users
DROP COLUMN id;
-- Bảng OTP
CREATE TABLE otp (
    otp VARCHAR(255),
    user_id INTEGER,
    get_OTP VARCHAR(255),
    CONSTRAINT pk_otp PRIMARY KEY (otp, user_id)
);
ALTER TABLE otp
DROP COLUMN get_OTP;


-- Drop the primary key constraint first
ALTER TABLE otp DROP CONSTRAINT pk_otp;

-- Remove the user_id column
ALTER TABLE otp DROP COLUMN user_id;

-- Add the email column
ALTER TABLE otp ADD COLUMN email VARCHAR(255) NOT NULL;

-- Create a new primary key on otp and email
ALTER TABLE otp ADD CONSTRAINT pk_otp PRIMARY KEY (otp, email);

-- Add a foreign key constraint to ensure the email exists in the users table
ALTER TABLE otp ADD CONSTRAINT fk_otp_user_email 
FOREIGN KEY (email) REFERENCES users(email);


-- Bảng Notification
CREATE TABLE notification (
    user_id INTEGER,
    content VARCHAR(255),
    CONSTRAINT pk_notification PRIMARY KEY (user_id, content)
);

ALTER TABLE notification
ADD COLUMN datetime TIMESTAMP;

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

ALTER TABLE notification
ADD COLUMN datetime TIMESTAMP;

-- thêm contraint cho user_id
CREATE SEQUENCE tree_area_seq;

ALTER TABLE tree 
ALTER COLUMN area SET DEFAULT nextval('tree_area_seq');

SELECT setval('tree_area_seq', 3);


ALTER TABLE tree
DROP CONSTRAINT pk_tree CASCADE;

-- Thêm khóa chính mới trên area
ALTER TABLE tree
ADD CONSTRAINT pk_tree PRIMARY KEY (area);


-- Step 4: Drop the composite primary key in tree_record
ALTER TABLE tree_record
DROP CONSTRAINT pk_tree_record;

-- Step 5: Add a new primary key on tree_area and record_id in tree_record
ALTER TABLE tree_record
ADD CONSTRAINT pk_tree_record PRIMARY KEY (tree_area, record_id);

-- Step 6: Recreate the foreign key in tree_record to reference tree(area)
ALTER TABLE tree_record
ADD CONSTRAINT fk_tree_record_tree
FOREIGN KEY (tree_area) REFERENCES tree(area);

-- Step 7 (Optional): Add a unique constraint on tree_name if needed
ALTER TABLE tree_record
ADD CONSTRAINT unique_tree_name UNIQUE (tree_name);

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