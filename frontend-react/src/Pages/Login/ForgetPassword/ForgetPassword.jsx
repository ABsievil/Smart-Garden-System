import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import "./ForgotPassword.css";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // New state for message type (success/error)
  const [animationClass, setAnimationClass] = useState("fade-in");
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAnimationClass("slide-in");
  }, []);

  const setErrorMessage = (msg) => {
    setMessage(msg);
    setMessageType("error");
  };

  const setSuccessMessage = (msg) => {
    setMessage(msg);
    setMessageType("success");
  };

  const handleSendEmail = async () => {

    if (!email) {
      setErrorMessage("Vui lòng nhập email.");
      return;
    }

    // Lưu email vào localStorage ngay khi user gửi yêu cầu OTP
    localStorage.setItem("resetPasswordEmail", email);

    try {
      const response = await api.get("/api/v1/Email/sendEmail", {
        params: { toGmail: email },
      });

      if (response.data.status === "OK") {
        setSuccessMessage("OTP đã được gửi đến email của bạn.");
        setShowOtpPopup(true); // Show OTP popup
      } else {
        console.log(response.data);
        setErrorMessage(response.data.message || "Không thể gửi OTP. Vui lòng thử lại.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Lỗi hệ thống, vui lòng thử lại sau."
      );
    }
  };

  const handleConfirmOtp = async () => {
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      setErrorMessage("Vui lòng nhập OTP gồm 6 số.");
      return;
    }

    try {
      // Fetch the stored OTP for the email
      const otpResponse = await api.get(`/api/v1/Email/getOTPByEmail/${email}`);
      console.log("OTP Response:", otpResponse.data.data.otp);
      if (otpResponse.data.status === "OK" && otpResponse.data.data.otp === otp) {
        // Fetch username by email
        const usernameResponse = await api.get(`/api/v1/users/getUsernameByEmail/${email}`);

        await api.put(`/api/v1/Email/deleteOTPByEmail/${email}`);
        setShowOtpPopup(false); // Close OTP popup on success
        setShowPasswordPopup(true); // Show password change popup
      } else {
        setErrorMessage("OTP không hợp lệ. Vui lòng thử lại.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Lỗi hệ thống, vui lòng thử lại sau."
      );
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setErrorMessage("Vui lòng nhập đầy đủ mật khẩu.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    // user email instead of username
    // if (!username) {
    //   setErrorMessage("Không thể xác định người dùng. Vui lòng thử lại từ đầu.");
    //   return;
    // }

    try {
      const storedEmail = localStorage.getItem("resetPasswordEmail");

      const response = await api.post("/api/v1/users/reset-password", {
        email: storedEmail,
        newPassword,
      });

      if (response.data.status === "OK") {
        setSuccessMessage("Đổi mật khẩu thành công!");
        setShowPasswordPopup(false); // Close password change popup on success
        localStorage.removeItem("resetPasswordEmail"); // Clear email from localStorage
        setTimeout(() => {
          navigate("/signin"); // Redirect to login page
        }, 1000);
      } else {
        setErrorMessage(response.data.message || "Không thể đổi mật khẩu. Vui lòng thử lại.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Lỗi hệ thống, vui lòng thử lại sau."
      );
    }
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

        {message && <p className={`message ${messageType}`}>{message}</p>}

        <div className="back-button" onClick={() => navigate("/signin")}>
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
            {message && <p className={`popup-message ${messageType}`}>{message}</p>}
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

      {showPasswordPopup && (
        <div className="otp-popup">
          <div className="otp-popup-content">
            <h2>Change Password</h2>
            <p>Enter your new password below.</p>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {message && <p className={`popup-message ${messageType}`}>{message}</p>}
            <button className="confirm-button" onClick={handleChangePassword}>
              CHANGE PASSWORD
            </button>
            <button
              className="back-button"
              onClick={() => setShowPasswordPopup(false)}
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