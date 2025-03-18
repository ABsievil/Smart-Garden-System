import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

const ForgetPassword = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [animationClass, setAnimationClass] = useState("fade-in");
  const navigate = useNavigate();

  useEffect(() => {
    setAnimationClass("slide-in");
  }, []);

  const handleConfirm = () => {
    if (!otp) {
      setMessage("Vui lòng nhập OTP.");
      return;
    }

    /*
    fetch("API_ENDPOINT_HERE", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ otp }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMessage("Xác nhận OTP thành công!");
          navigate("/reset-password");
        } else {
          setMessage("OTP không hợp lệ. Vui lòng thử lại.");
        }
      })
      .catch((error) => {
        setMessage("Lỗi hệ thống, vui lòng thử lại sau.");
      });
    */
  };

  return (
    <div className={`forget-password-container ${animationClass}`}>
      <div className="forget-password-box">
        <h1>Forget Password</h1>
        <p>Please enter the OTP sent to your email to reset your password.</p>

        <div className="input-box-otp">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>

        <button className="confirm-button" onClick={handleConfirm}>
          CONFIRM
        </button>

        {message && <p className="message">{message}</p>}

        <div className="back-button" onClick={() => navigate("/")}>
          Back to Login
        </div>
      </div>

      <div className="bottom-clip rotating"></div>
    </div>
  );
};

export default ForgetPassword;
