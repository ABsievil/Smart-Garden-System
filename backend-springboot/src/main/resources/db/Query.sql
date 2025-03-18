CREATE OR REPLACE FUNCTION get_current_record(p_area VARCHAR)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
			'area', r.area,
			'temperature', r.temperature,
			'humidity', r.humidity,
			'light', r.light,
			'soilMoisture', r.soilMoisture
       		)
    INTO result
    FROM record r
	WHERE r.datetime = (SELECT MAX(datetime) FROM record WHERE area = p_area)
    AND r.area = p_area;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE add_student(
	username_input VARCHAR, 
	password_input VARCHAR, 
	last_name_input VARCHAR, 
	middle_name_input VARCHAR, 
	first_name_input VARCHAR, 
	email_input VARCHAR, 
	date_of_birth_input DATE, 
	phone_number_input VARCHAR, 
	role_input VARCHAR,
	student_id_input VARCHAR, 
	school_year_input VARCHAR, 
	faculty_input VARCHAR, 
	page_remain_input INT
)
LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO Users (username, password, last_name, middle_name, first_name, email, date_of_birth, phone_number, role, 
                        student_id, school_year, faculty, page_remain)
    VALUES (
                username_input, 
                password_input, 
                last_name_input, 
                middle_name_input, 
                first_name_input, 
                email_input, 
                date_of_birth_input, 
                phone_number_input, 
                role_input, 
                student_id_input, 
			    school_year_input, 
                faculty_input, 
                page_remain_input
            );
END;
$$;

CREATE OR REPLACE PROCEDURE save_record(
    area_input INT,
    temperature_input DOUBLE PRECISION,
    humidity_input DOUBLE PRECISION,
    light_input DOUBLE PRECISION,
    soil_moisture_input DOUBLE PRECISION,
    timestamp_input VARCHAR
)
LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO record (area, temperature, humidity, light, soil_moisture, timestamp)
    VALUES (
        area_input,
        temperature_input,
        humidity_input,
        light_input,
        soil_moisture_input,
        timestamp_input::TIMESTAMP
    );
END;
$$;

CREATE OR REPLACE PROCEDURE control_status(
    device_name_input VARCHAR,
    status_input VARCHAR
)
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE device
    SET status = (CASE 
                    WHEN status_input = 'true' THEN TRUE
                    WHEN status_input = 'false' THEN FALSE
                    ELSE status
                  END)
    WHERE nameofdevices = device_name_input;
END;
$$;

CREATE OR REPLACE PROCEDURE control_pump_speed(
    device_name_input VARCHAR,
    value_input VARCHAR
)
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE device
    SET speed = value_input
    WHERE nameofdevices = device_name_input;
END;
$$;