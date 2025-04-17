import React, { useEffect, useState } from 'react';
import Navbar from '../../../Components/NavBar/NavBar';
import './UserProfile.css';
import api from '../../../api'; // Assuming api is your configured axios instance

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [editProfile, setEditProfile] = useState({
        name: '',
        dob: '',
        phone: '',
        email: '',
        gender: '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const username = localStorage.getItem("username");
            if (!username) {
                console.error("Username not found");
                // Handle missing username, maybe redirect to login
                return;
            }
            try {
                console.log('[fetchProfile] Sending username:', username);
                const response = await api.post('/api/v1/users/profile', { username });
                console.log('[fetchProfile] Raw response:', response);

                if (response && response.data) {
                    console.log('[fetchProfile] Response data:', response.data);
                    if (response.data.status === "OK") {
                        const profileData = response.data.data;
                        console.log('[fetchProfile] Profile data from API:', profileData);
                        // Map backend fields to frontend state if needed
                        const mappedProfile = {
                            name: profileData.information.lname + " " + profileData.information.fname || '',
                            role: profileData.information.jobName || 'N/A', // Adjust based on actual data
                            dob: profileData.information.address || '', // Map address to dob field based on modal label
                            phone: profileData.information.phoneNumber || '',
                            email: profileData.email || '',
                            gender: profileData.information.sex || '',
                            // ssn: profileData.information.ssn || '',
                            // salary: profileData.information.salary || '',
                            // jobArea: profileData.information.jobArea || ''
                        };
                        setProfile(mappedProfile);
                        // Initialize edit form with fetched data
                        setEditProfile(mappedProfile);
                    } else {
                        console.error("[fetchProfile] Error fetching profile - API status not OK:", response.data.message);
                        alert(`Lỗi lấy thông tin: ${response.data.message}`);
                    }
                } else {
                     console.error("[fetchProfile] Error fetching profile - Invalid response structure:", response);
                     alert('Lỗi lấy thông tin: Phản hồi không hợp lệ từ máy chủ.');
                }
            } catch (error) {
                console.error("[fetchProfile] Error fetching profile - Exception caught:", error);
                 // Log detailed Axios error information if available
                 if (error.response) {
                    console.error('[fetchProfile] Axios error response data:', error.response.data);
                    console.error('[fetchProfile] Axios error response status:', error.response.status);
                    console.error('[fetchProfile] Axios error response headers:', error.response.headers);
                 } else if (error.request) {
                    // The request was made but no response was received
                    console.error('[fetchProfile] Axios error request:', error.request);
                 } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error('[fetchProfile] Axios error message:', error.message);
                 }
                 alert('Đã xảy ra lỗi khi tải thông tin cá nhân. Vui lòng thử lại.');
                 // Fallback mock data for development if needed
                 // const mockProfile = {
                //     name: 'Nguyen Van A',
                //     role: 'Farmer',
                //     dob: 'Ho Chi Minh, Viet Nam', // Label is Địa chỉ, using dob field
                //     phone: '+123456 6789 0',
                //     email: 'Historia@email.com',
                //     gender: 'Male',
                // };
                // setProfile(mockProfile);
                // setEditProfile(mockProfile);
            }
        };

        fetchProfile();
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleEditModal = () => {
        setIsEditModalOpen(!isEditModalOpen);
        setIsDropdownOpen(false);
        if (isEditModalOpen) {
            setEditProfile(profile);
        }
    };

    const togglePasswordModal = () => {
        setIsPasswordModalOpen(!isPasswordModalOpen);
        setIsDropdownOpen(false);
        if (isPasswordModalOpen) {
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        }
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditProfile({ ...editProfile, [name]: value });
    };

    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handleSaveProfile = () => {
        // Add API call for updating profile if available
        /*
        const updateProfile = async () => {
            const username = localStorage.getItem("username");
             if (!username) {
                 console.error("Username not found");
                 return;
             }
            try {
                 // Assuming an endpoint like /api/v1/users/update-profile exists
                 // And expects data similar to editProfile + username
                 const payload = { ...editProfile, username };
                 const response = await api.put('/api/v1/users/update-profile', payload);
                 if (response.data.status === "OK") {
                     setProfile({ ...editProfile }); // Update profile state locally
                     console.log("Profile updated successfully:", response.data.data);
                 } else {
                     console.error("Error updating profile:", response.data.message);
                 }
            } catch (error) {
                console.error("Error updating profile:", error);
            }
        };
        updateProfile();
        */
        // Local update for now
        setProfile({ ...editProfile });
        toggleEditModal();
    };

    const handleChangePassword = () => {
        const username = localStorage.getItem("username");
        if (!username) {
            console.error("Username not found");
            alert('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Mật khẩu mới và xác nhận mật khẩu không khớp!');
            return;
        }

        const changePassword = async () => {
            try {
                const response = await api.post('/api/v1/users/change-password', {
                    username: username,
                    oldPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                });
                if (response.data.status === "OK") {
                    console.log("Password changed successfully:", response.data.message); // Or handle data if needed
                    alert('Đổi mật khẩu thành công!');
                    togglePasswordModal(); // Close modal on success
                } else {
                    console.error("Error changing password:", response.data.message);
                    alert(`Đổi mật khẩu thất bại: ${response.data.message}`);
                }
            } catch (error) {
                console.error("Error changing password:", error);
                alert('Đã xảy ra lỗi khi đổi mật khẩu.');
            }
        };
        changePassword();

        // Remove local console log after implementing API call
        // console.log('Đổi mật khẩu thành công:', passwordData);
        // togglePasswordModal();
    };

    if (!profile) {
        return <div className="usr-loading">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="usr-profile">
            <div className="header">
                <h13>Thông tin cá nhân</h13>
                    <Navbar />
                
            </div>
            <div className="usr-profile-container">
                <div className="usr-decor">
                    {/* <div className="usr-decor-oval"></div>
                    <div className="usr-decor-circle"></div> */}
                </div>
                <div className="usr-content">
                    <div className="usr-avatar-section">
                        <div className="usr-avatar-wrapper">
                            <div className="usr-avatar"></div>
                            <button className="usr-dropdown-button" onClick={toggleDropdown}>...</button>
                            {isDropdownOpen && (
                                <div className="usr-dropdown-menu">
                                    <div className="usr-dropdown-item" onClick={toggleEditModal}>Chỉnh sửa thông tin</div>
                                    <div className="usr-dropdown-item" onClick={togglePasswordModal}>Đổi mật khẩu</div>
                                </div>
                            )}
                        </div>
                        <h16>{profile.name}</h16>
                        <div className="usr-role">{profile.role}</div>
                    </div>
                    <div className="usr-info-section">
                            <div className="usr-info-item">
                                <span className="usr-icon usr-dob-icon"></span>
                                <span>{profile.dob}</span>
                            </div>
                            <div className="usr-info-item">
                                <span className="usr-icon usr-phone-icon"></span>
                                <span>{profile.phone}</span>
                            </div>
                            <div className="usr-info-item">
                                <span className="usr-icon usr-email-icon"></span>
                                <span>{profile.email}</span>
                            </div>
                            <div className="usr-info-item">
                                <span className="usr-icon usr-gender-icon"></span>
                                <span>{profile.gender}</span>
                            </div>
                    </div>
                </div>
            </div>

            {/* Modal chỉnh sửa thông tin */}
            {isEditModalOpen && (
                <div className="usr-modal-overlay">
                    <div className="usr-modal">
                        <h16>Chỉnh sửa thông tin</h16>
                        <div className="usr-modal-content">
                            <label>Họ tên</label>
                            <input
                                type="text"
                                name="name"
                                value={editProfile.name}
                                onChange={handleEditInputChange}
                                placeholder="Nhập họ tên"
                            />
                            <label>Địa chỉ</label>
                            <input
                                type="text"
                                name="dob"
                                value={editProfile.dob}
                                onChange={handleEditInputChange}
                                placeholder="Nhập địa chỉ"
                            />
                            <label>Số điện thoại</label>
                            <input
                                type="text"
                                name="phone"
                                value={editProfile.phone}
                                onChange={handleEditInputChange}
                                placeholder="Nhập số điện thoại"
                            />
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={editProfile.email}
                                onChange={handleEditInputChange}
                                placeholder="Nhập email"
                            />
                            <label>Giới tính</label>
                            <input
                                type="text"
                                name="gender"
                                value={editProfile.gender}
                                onChange={handleEditInputChange}
                                placeholder="Nhập giới tính"
                            />
                        </div>
                        <div className="usr-modal-actions">
                            <button className="usr-cancel-button" onClick={toggleEditModal}>Hủy</button>
                            <button className="usr-save-button" onClick={handleSaveProfile}>Lưu</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal đổi mật khẩu */}
            {isPasswordModalOpen && (
                <div className="usr-modal-overlay">
                    <div className="usr-modal">
                        <h16>Đổi mật khẩu</h16>
                        <div className="usr-modal-content">
                            <label>Mật khẩu hiện tại</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordInputChange}
                                placeholder="Nhập mật khẩu hiện tại"
                            />
                            <label>Mật khẩu mới</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordInputChange}
                                placeholder="Nhập mật khẩu mới"
                            />
                            <label>Xác nhận mật khẩu mới</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordInputChange}
                                placeholder="Xác nhận mật khẩu mới"
                            />
                        </div>
                        <div className="usr-modal-actions">
                            <button className="usr-cancel-button" onClick={togglePasswordModal}>Hủy</button>
                            <button className="usr-save-button" onClick={handleChangePassword}>Lưu</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;

// Ensure you have an 'api' instance configured, e.g., using Axios:
// import axios from 'axios';
// const api = axios.create({
//   baseURL: 'http://localhost:8080', // Your backend URL
//   headers: {
//     'Content-Type': 'application/json',
//     // Add Authorization header if needed:
//     // 'Authorization': `Bearer ${localStorage.getItem('token')}`
//   }
// });
// export default api;