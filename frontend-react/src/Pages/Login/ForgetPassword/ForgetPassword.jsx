import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [animationClass, setAnimationClass] = useState("fade-in");
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAnimationClass("slide-in");
  }, []);

  const handleSendEmail = () => {
    if (!email) {
      setMessage("Vui lòng nhập email.");
      return;
    }

    /*
    api.post("api/forgot-password", { email })
      .then((response) => {
        if (response.data.status === "OK") {
          setMessage("OTP đã được gửi đến email của bạn.");
          setShowOtpPopup(true);
        } else {
          setMessage(response.data.message || "Không thể gửi OTP. Vui lòng thử lại.");
        }
      })
      .catch((error) => {
        setMessage(error.response?.data?.message || "Lỗi hệ thống, vui lòng thử lại sau.");
      });
    */
  };

  const handleConfirmOtp = () => {
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      setMessage("Vui lòng nhập OTP gồm 6 số.");
      return;
    }

    /*
    api.post("api/verify-otp", { email, otp })
      .then((response) => {
        if (response.data.status === "OK") {
          setMessage("Xác nhận OTP thành công!");
          navigate("/reset-password");
        } else {
          setMessage(response.data.message || "OTP không hợp lệ. Vui lòng thử lại.");
        }
      })
      .catch((error) => {
        setMessage(error.response?.data?.message || "Lỗi hệ thống, vui lòng thử lại sau.");
      });
    */
  };

  return (
    <div className={`forget-password-container ${animationClass}`}>
      <div className="forget-password-box">
        <h15>Forgot Password</h15>
        <p>Please enter your email to receive an OTP.</p>

        <div className="input-box-otp">
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button className="confirm-button" onClick={handleSendEmail}>
          SEND OTP
        </button>

        {message && <p className="message">{message}</p>}

        <div className="back-button" onClick={() => navigate("/")}>
          Back to Login
        </div>
      </div>

      {showOtpPopup && (
        <div className="otp-popup">
          <div className="otp-popup-content">
            <h2>Enter OTP</h2>
            <p>Enter the 6-digit OTP sent to your email.</p>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
            />
            <button className="confirm-button" onClick={handleConfirmOtp}>
              CONFIRM OTP
            </button>
            <button
              className="back-button"
              onClick={() => setShowOtpPopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bottom-clip rotating"></div>
    </div>
  );
};

export default ForgetPassword;