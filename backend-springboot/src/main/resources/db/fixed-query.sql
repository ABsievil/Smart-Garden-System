CREATE OR REPLACE FUNCTION get_current_record(p_area INTEGER)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'area', r.area,
        'temperature', r.temperature,
        'humidity', r.humidity,
        'light', r.light,
        'soilMoisture', r.soil_moisture
    )
    INTO result
    FROM record r
    WHERE r.datetime = (SELECT MAX(datetime) FROM record WHERE area = p_area)
    AND r.area = p_area;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE save_record(
    area_input INT,
    temperature_input DOUBLE PRECISION,
    humidity_input DOUBLE PRECISION,
    light_input DOUBLE PRECISION,
    soil_moisture_input DOUBLE PRECISION,
    datetime_input VARCHAR
)
LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO record (area, temperature, humidity, light, soil_moisture, datetime)
    VALUES (
        area_input,
        temperature_input,
        humidity_input,
        light_input,
        soil_moisture_input,
        datetime_input::TIMESTAMP
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
    value_input INTEGER
)
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE device
    SET speed = value_input
    WHERE nameofdevices = device_name_input;
END;
$$;


--28--Lưu otp
CREATE OR REPLACE PROCEDURE add_otp_by_email(email_input VARCHAR, otp_code_input VARCHAR)
LANGUAGE plpgsql AS $$ 
DECLARE
    user_exists BOOLEAN;
BEGIN
    -- Kiểm tra xem email có tồn tại trong bảng users không
    SELECT EXISTS (SELECT 1 FROM users WHERE email = email_input) INTO user_exists;

    -- Nếu email không tồn tại, báo lỗi
    IF NOT user_exists THEN
        RAISE EXCEPTION 'Email not found: %', email_input;
    END IF;

    -- Nếu email tồn tại, thêm OTP
    INSERT INTO OTP (email, otp)
    VALUES (email_input, otp_code_input);
END;
$$;
--CALL add_otp_by_email('tinhquach@hcmut.edu.vn','1234m5')

--29--Xóa otp
CREATE OR REPLACE PROCEDURE delete_otp_by_email(email_input VARCHAR)
LANGUAGE plpgsql AS $$
BEGIN
    DELETE FROM OTP
	WHERE email = email_input;
END;
$$;
-- CALL delete_otp_by_email('vumakhmtk22@hcmut.edu.vn')

--30--Lấy thông tin otp
CREATE OR REPLACE FUNCTION get_otp_by_email(email_input VARCHAR)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
			'otp', otp
       		)
    INTO result
    FROM OTP
	WHERE email = email_input;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;