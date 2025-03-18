-- DROP SCHEMA "DADN_draft";

-- CREATE SCHEMA "DADN_draft" AUTHORIZATION "lemonHV";

-- COMMENT ON SCHEMA "DADN_draft" IS 'standard public schema';
-- "DADN_draft".area definition

-- Drop table

-- DROP TABLE "DADN_draft".area;

CREATE TABLE area (
	"position" varchar NOT NULL,
	CONSTRAINT area_pk PRIMARY KEY ("position")
);


-- tree definition

-- Drop table

-- DROP TABLE tree;

CREATE TABLE tree (
	nameoftypetree varchar NOT NULL,
	amount float8 NOT NULL,
	growthtime daterange NOT NULL,
	season varchar NOT NULL,
	CONSTRAINT tree_pk PRIMARY KEY (nameoftypetree)
);


-- users definition

-- Drop table

-- DROP TABLE users;

CREATE TABLE users (
	email varchar NULL,
	ssn varchar NOT NULL,
	sex varchar NOT NULL,
	id varchar NOT NULL,
	username varchar NOT NULL,
	"password" varchar NULL,
	fname varchar NULL,
	lname varchar NOT NULL,
	dob date NOT NULL,
	salary int4 NULL,
	numsofdevice int4 NULL,
	numofschedules int4 NULL,
	"role" varchar NULL,
	"address" varchar NULL,
	phonenumber varchar NULL,
	CONSTRAINT users_pk PRIMARY KEY (id),
	CONSTRAINT users_unique UNIQUE (username)
);


-- "ADMIN" definition

-- Drop table

-- DROP TABLE "ADMIN";

CREATE TABLE "ADMIN" (
	id varchar NOT NULL,
	"role" varchar DEFAULT 'ADMIN'::character varying NOT NULL,
	CONSTRAINT admin_pk PRIMARY KEY (id),
	CONSTRAINT admin_users_fk FOREIGN KEY (id) REFERENCES users(id)
);


-- address_user definition

-- Drop table

-- DROP TABLE address_user;

-- device definition

-- Drop table

-- DROP TABLE device;

CREATE TABLE device (
	guaranteetime daterange NOT NULL,
	id varchar NOT NULL,
	outputvoltage int4 DEFAULT 220 NOT NULL,
	inputvoltage int4 DEFAULT 220 NOT NULL,
	driver varchar NOT NULL,
	state bool NOT NULL,
	status bool NOT NULL,
	nameofdevices varchar NOT NULL,
	id_user varchar NOT NULL,
	CONSTRAINT device_pk PRIMARY KEY (id),
	CONSTRAINT device_users_fk FOREIGN KEY (id_user) REFERENCES users(id)
);


-- otp definition

-- Drop table

-- DROP TABLE otp;

CREATE TABLE otp (
	code varchar NOT NULL,
	id_user varchar NOT NULL,
	CONSTRAINT otp_pk PRIMARY KEY (code),
	CONSTRAINT otp_unique UNIQUE (id_user),
	CONSTRAINT otp_users_fk FOREIGN KEY (id_user) REFERENCES users(id)
);


-- record definition

-- Drop table

-- DROP TABLE record;

CREATE TABLE record (
	area INT NULL,
	temperature DOUBLE PRECISION NOT NULL,
	humidity DOUBLE PRECISION NOT NULL,
	light DOUBLE PRECISION NOT NULL,
	soilMoisture DOUBLE PRECISION NOT NULL,
	"datetime" datetime NULL,
	id_record BIGSERIAL PRIMARY KEY
);


-- schedule definition

-- Drop table

-- DROP TABLE schedule;

CREATE TABLE schedule (
	datetime date NOT NULL,
	id varchar NOT NULL,
	id_user varchar NOT NULL,
	periodoftime_schedule daterange NOT NULL,
	CONSTRAINT schedule_pk PRIMARY KEY (id),
	CONSTRAINT schedule_record_fk FOREIGN KEY (periodoftime_schedule) REFERENCES record(priodoftime),
	CONSTRAINT schedule_users_fk FOREIGN KEY (id_user) REFERENCES users(id)
);


-- staff definition

-- Drop table

-- DROP TABLE staff;

CREATE TABLE staff (
	id varchar NOT NULL,
	id_admin varchar NOT NULL,
	"role" varchar DEFAULT 'USER'::character varying NOT NULL,
	CONSTRAINT staff_pk PRIMARY KEY (id),
	CONSTRAINT staff_admin_fk FOREIGN KEY (id_admin) REFERENCES "ADMIN"(id),
	CONSTRAINT staff_users_fk FOREIGN KEY (id) REFERENCES users(id)
);


-- stay_in definition

-- Drop table

-- DROP TABLE stay_in;

CREATE TABLE stay_in (
	id_staff varchar NOT NULL,
	id_device varchar NOT NULL,
	position_area varchar NOT NULL,
	CONSTRAINT stay_in_pk PRIMARY KEY (id_staff),
	CONSTRAINT stay_in_unique UNIQUE (id_device),
	CONSTRAINT stay_in_unique_1 UNIQUE (position_area),
	CONSTRAINT stay_in_area_fk FOREIGN KEY (position_area) REFERENCES area("position"),
	CONSTRAINT stay_in_device_fk FOREIGN KEY (id_device) REFERENCES device(id),
	CONSTRAINT stay_in_staff_fk FOREIGN KEY (id_staff) REFERENCES staff(id)
);


-- content_schedule definition

-- Drop table

-- DROP TABLE content_schedule;

CREATE TABLE content_schedule (
	id varchar NOT NULL,
	"content" text NULL,
	CONSTRAINT content_schedule_pk PRIMARY KEY (id),
	CONSTRAINT content_schedule_schedule_fk FOREIGN KEY (id) REFERENCES schedule(id)
);


-- notification_supervisor definition

-- Drop table

-- DROP TABLE notification_supervisor;

CREATE TABLE notification_supervisor (
	id varchar NOT NULL,
	id_admin varchar NOT NULL,
	notification text NULL,
	CONSTRAINT notification_supervisor_pk PRIMARY KEY (id_admin),
	CONSTRAINT notification_supervisor_unique UNIQUE (id),
	CONSTRAINT notification_supervisor_admin_fk FOREIGN KEY (id_admin) REFERENCES "ADMIN"(id),
	CONSTRAINT notification_supervisor_staff_fk FOREIGN KEY (id) REFERENCES staff(id)
);
