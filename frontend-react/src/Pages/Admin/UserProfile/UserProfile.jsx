import React, { useEffect, useState } from 'react';
import Navbar from '../../../Components/NavBar/NavBar';
import './UserProfile.css';

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
            /*
            try {
                const response = await api.get('/api/v1/user/profile');
                if (response.data.status === "OK") {
                    const profileData = response.data.data;
                    setProfile(profileData);
                    setEditProfile(profileData);
                } else {
                    console.error("Error fetching profile:", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
            */
            // Fake data since API call is commented out
            const mockProfile = {
                name: 'Nguyen Van A',
                role: 'Farmer',
                dob: 'Ho Chi Minh, Viet Nam',
                phone: '+123456 6789 0',
                email: 'Historia@email.com',
                gender: 'Male',
            };
            setProfile(mockProfile);
            setEditProfile(mockProfile);
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
        /*
        const updateProfile = async () => {
            try {
                const response = await api.put('/api/v1/user/updateProfile', editProfile);
                if (response.data.status === "OK") {
                    setProfile({ ...editProfile });
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
        setProfile({ ...editProfile });
        toggleEditModal();
    };

    const handleChangePassword = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Mật khẩu mới và xác nhận mật khẩu không khớp!');
            return;
        }

        /*
        const changePassword = async () => {
            try {
                const response = await api.put('/api/v1/user/changePassword', {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                });
                if (response.data.status === "OK") {
                    console.log("Password changed successfully:", response.data.data);
                } else {
                    console.error("Error changing password:", response.data.message);
                }
            } catch (error) {
                console.error("Error changing password:", error);
            }
        };
        changePassword();
        */
        console.log('Đổi mật khẩu thành công:', passwordData);
        togglePasswordModal();
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