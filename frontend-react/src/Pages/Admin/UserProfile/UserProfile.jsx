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

    // Mock data
    useEffect(() => {
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
        setProfile({ ...editProfile });
        toggleEditModal();
    };

    const handleChangePassword = () => {
        if (passwordData.newPassword === passwordData.confirmPassword) {
            console.log('Đổi mật khẩu thành công:', passwordData);
            togglePasswordModal();
        } else {
            alert('Mật khẩu mới và xác nhận mật khẩu không khớp!');
        }
    };

    if (!profile) {
        return <div className="loading">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="user-profile">
        <div className="header">
        <h13>Thông tin cá nhân</h13>
        <Navbar />
    </div>
        <div className="profile">
            
            <button className="dropdown-button" onClick={toggleDropdown}>...</button>
            {isDropdownOpen && (
                <div className="dropdown-menu">
                    <div className="dropdown-item" onClick={toggleEditModal}>Chỉnh sửa thông tin</div>
                    <div className="dropdown-item" onClick={togglePasswordModal}>Đổi mật khẩu</div>
                </div>
            )}
            <div className="profile-container">
                <div className="avatar-section">
                    <div className="avatar"></div>
                    <h3>{profile.name}</h3>
                    <p>{profile.role}</p>
                </div>
                <div className="info-section">
                    <div className="info-item">
                        <span className="icon dob-icon"></span>
                        <p>{profile.dob}</p>
                    </div>
                    <div className="info-item">
                        <span className="icon phone-icon"></span>
                        <p>{profile.phone}</p>
                    </div>
                    <div className="info-item">
                        <span className="icon email-icon"></span>
                        <p>{profile.email}</p>
                    </div>
                    <div className="info-item">
                        <span className="icon gender-icon"></span>
                        <p>{profile.gender}</p>
                    </div>
                </div>
            </div>
            </div>
            {/* Modal chỉnh sửa thông tin */}
            {isEditModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Chỉnh sửa thông tin</h3>
                        <div className="modal-content">
                            <label>Họ tên</label>
                            <input
                                type="text"
                                name="name"
                                value={editProfile.name}
                                onChange={handleEditInputChange}
                                placeholder="Nhập họ tên"
                            />
                            <label>Ngày sinh</label>
                            <input
                                type="text"
                                name="dob"
                                value={editProfile.dob}
                                onChange={handleEditInputChange}
                                placeholder="Nhập ngày sinh"
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
                        <div className="modal-actions">
                            <button className="cancel-button" onClick={toggleEditModal}>Hủy</button>
                            <button className="save-button" onClick={handleSaveProfile}>Lưu</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal đổi mật khẩu */}
            {isPasswordModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Đổi mật khẩu</h3>
                        <div className="modal-content">
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
                        <div className="modal-actions">
                            <button className="cancel-button" onClick={togglePasswordModal}>Hủy</button>
                            <button className="save-button" onClick={handleChangePassword}>Lưu</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;