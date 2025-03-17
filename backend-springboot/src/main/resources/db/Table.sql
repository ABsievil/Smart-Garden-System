-- DROP SCHEMA "DADN_draft";

CREATE SCHEMA "DADN_draft" AUTHORIZATION "lemonHV";

COMMENT ON SCHEMA "DADN_draft" IS 'standard public schema';
-- "DADN_draft".area definition

-- Drop table

-- DROP TABLE "DADN_draft".area;

CREATE TABLE "DADN_draft".area (
	"position" varchar NOT NULL,
	CONSTRAINT area_pk PRIMARY KEY ("position")
);


-- "DADN_draft".tree definition

-- Drop table

-- DROP TABLE "DADN_draft".tree;

CREATE TABLE "DADN_draft".tree (
	nameoftypetree varchar NOT NULL,
	amount float8 NOT NULL,
	growthtime daterange NOT NULL,
	season varchar NOT NULL,
	CONSTRAINT tree_pk PRIMARY KEY (nameoftypetree)
);


-- "DADN_draft".users definition

-- Drop table

-- DROP TABLE "DADN_draft".users;

CREATE TABLE "DADN_draft".users (
	email varchar NULL,
	ssn varchar NOT NULL,
	sex varchar NOT NULL,
	id varchar NOT NULL,
	username varchar NOT NULL,
	"password" varchar NOT NULL,
	fname varchar NULL,
	lname varchar NOT NULL,
	dob date NOT NULL,
	salary int4 NULL,
	numsofdevice int4 NULL,
	numofschedules int4 NULL,
	"role" varchar NULL,
	CONSTRAINT users_pk PRIMARY KEY (id),
	CONSTRAINT users_unique UNIQUE (username),
	CONSTRAINT users_unique_1 UNIQUE (password)
);


-- "DADN_draft"."ADMIN" definition

-- Drop table

-- DROP TABLE "DADN_draft"."ADMIN";

CREATE TABLE "DADN_draft"."ADMIN" (
	id varchar NOT NULL,
	"role" varchar DEFAULT 'admin'::character varying NOT NULL,
	CONSTRAINT admin_pk PRIMARY KEY (id),
	CONSTRAINT admin_users_fk FOREIGN KEY (id) REFERENCES "DADN_draft".users(id)
);


-- "DADN_draft".address_user definition

-- Drop table

-- DROP TABLE "DADN_draft".address_user;

CREATE TABLE "DADN_draft".address_user (
	id varchar NOT NULL,
	address varchar NOT NULL,
	CONSTRAINT address_user_pk PRIMARY KEY (id),
	CONSTRAINT address_user_users_fk FOREIGN KEY (id) REFERENCES "DADN_draft".users(id)
);


-- "DADN_draft".device definition

-- Drop table

-- DROP TABLE "DADN_draft".device;

CREATE TABLE "DADN_draft".device (
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
	CONSTRAINT device_users_fk FOREIGN KEY (id_user) REFERENCES "DADN_draft".users(id)
);


-- "DADN_draft".otp definition

-- Drop table

-- DROP TABLE "DADN_draft".otp;

CREATE TABLE "DADN_draft".otp (
	code varchar NOT NULL,
	id_user varchar NOT NULL,
	CONSTRAINT otp_pk PRIMARY KEY (code),
	CONSTRAINT otp_unique UNIQUE (id_user),
	CONSTRAINT otp_users_fk FOREIGN KEY (id_user) REFERENCES "DADN_draft".users(id)
);


-- "DADN_draft".record definition

-- Drop table

-- DROP TABLE "DADN_draft".record;

CREATE TABLE "DADN_draft".record (
	priodoftime daterange NOT NULL,
	temperature numeric NOT NULL,
	humidity numeric NOT NULL,
	lightindensity float4 NOT NULL,
	soilmoisture numeric NOT NULL,
	id_record varchar NOT NULL,
	CONSTRAINT newtable_pk PRIMARY KEY (priodoftime),
	CONSTRAINT record_users_fk FOREIGN KEY (id_record) REFERENCES "DADN_draft".users(id)
);


-- "DADN_draft".schedule definition

-- Drop table

-- DROP TABLE "DADN_draft".schedule;

CREATE TABLE "DADN_draft".schedule (
	datetime date NOT NULL,
	id varchar NOT NULL,
	id_user varchar NOT NULL,
	periodoftime_schedule daterange NOT NULL,
	CONSTRAINT schedule_pk PRIMARY KEY (id),
	CONSTRAINT schedule_record_fk FOREIGN KEY (periodoftime_schedule) REFERENCES "DADN_draft".record(priodoftime),
	CONSTRAINT schedule_users_fk FOREIGN KEY (id_user) REFERENCES "DADN_draft".users(id)
);


-- "DADN_draft".staff definition

-- Drop table

-- DROP TABLE "DADN_draft".staff;

CREATE TABLE "DADN_draft".staff (
	id varchar NOT NULL,
	id_admin varchar NOT NULL,
	"role" varchar DEFAULT 'staff'::character varying NOT NULL,
	CONSTRAINT staff_pk PRIMARY KEY (id),
	CONSTRAINT staff_admin_fk FOREIGN KEY (id_admin) REFERENCES "DADN_draft"."ADMIN"(id),
	CONSTRAINT staff_users_fk FOREIGN KEY (id) REFERENCES "DADN_draft".users(id)
);


-- "DADN_draft".stay_in definition

-- Drop table

-- DROP TABLE "DADN_draft".stay_in;

CREATE TABLE "DADN_draft".stay_in (
	id_staff varchar NOT NULL,
	id_device varchar NOT NULL,
	position_area varchar NOT NULL,
	CONSTRAINT stay_in_pk PRIMARY KEY (id_staff),
	CONSTRAINT stay_in_unique UNIQUE (id_device),
	CONSTRAINT stay_in_unique_1 UNIQUE (position_area),
	CONSTRAINT stay_in_area_fk FOREIGN KEY (position_area) REFERENCES "DADN_draft".area("position"),
	CONSTRAINT stay_in_device_fk FOREIGN KEY (id_device) REFERENCES "DADN_draft".device(id),
	CONSTRAINT stay_in_staff_fk FOREIGN KEY (id_staff) REFERENCES "DADN_draft".staff(id)
);


-- "DADN_draft".content_schedule definition

-- Drop table

-- DROP TABLE "DADN_draft".content_schedule;

CREATE TABLE "DADN_draft".content_schedule (
	id varchar NOT NULL,
	"content" text NULL,
	CONSTRAINT content_schedule_pk PRIMARY KEY (id),
	CONSTRAINT content_schedule_schedule_fk FOREIGN KEY (id) REFERENCES "DADN_draft".schedule(id)
);


-- "DADN_draft".notification_supervisor definition

-- Drop table

-- DROP TABLE "DADN_draft".notification_supervisor;

CREATE TABLE "DADN_draft".notification_supervisor (
	id varchar NOT NULL,
	id_admin varchar NOT NULL,
	notification text NULL,
	CONSTRAINT notification_supervisor_pk PRIMARY KEY (id_admin),
	CONSTRAINT notification_supervisor_unique UNIQUE (id),
	CONSTRAINT notification_supervisor_admin_fk FOREIGN KEY (id_admin) REFERENCES "DADN_draft"."ADMIN"(id),
	CONSTRAINT notification_supervisor_staff_fk FOREIGN KEY (id) REFERENCES "DADN_draft".staff(id)
);


ALTER TABLE "DADN_draft".users
DROP CONSTRAINT users_unique_1;