import React, { useState, useEffect } from 'react';
import './UserProfile.css';

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
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

  // Dữ liệu giả lập
    useEffect(() => {
        const mockProfile = {
        name: 'Nguyen Van A',
        role: 'Farmer',
        dob: 'Họ Chí Minh, Việt Nam',
        phone: '0123 456789 0',
        email: 'Historia@email.com',
        gender: 'Male',
        };
        setProfile(mockProfile);
        setEditProfile(mockProfile); // Điền sẵn dữ liệu vào form chỉnh sửa
    }, []);


    /*
    useEffect(() => {
        const fetchProfile = async () => {
        try {
            // Gọi API để lấy thông tin cá nhân
            const response = await axios.get('/api/profile');
            setProfile(response.data);
            setEditProfile(response.data);
        } catch (err) {
            console.error('Lỗi khi lấy thông tin cá nhân:', err);
        }
        };
        fetchProfile();
    }, []);

    // Hàm cập nhật thông tin cá nhân qua API
    const updateProfile = async () => {
        try {
        const response = await axios.put('/api/profile', editProfile);
        setProfile(response.data);
        setIsEditModalOpen(false);
        } catch (err) {
        console.error('Lỗi khi cập nhật thông tin cá nhân:', err);
        }
    };

    // Hàm đổi mật khẩu qua API
    const changePassword = async () => {
        try {
        await axios.post('/api/change-password', passwordData);
        setIsPasswordModalOpen(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
        console.error('Lỗi khi đổi mật khẩu:', err);
        }
    };
    */

    // Hàm mở/đóng modal chỉnh sửa
    const toggleEditModal = () => {
        setIsEditModalOpen(!isEditModalOpen);
        if (isEditModalOpen) {
        setEditProfile(profile); // Reset form khi đóng modal
        }
    };

    // Hàm mở/đóng modal đổi mật khẩu
    const togglePasswordModal = () => {
        setIsPasswordModalOpen(!isPasswordModalOpen);
        if (isPasswordModalOpen) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); // Reset form khi đóng modal
        }
    };

    // Hàm xử lý thay đổi input trong modal chỉnh sửa
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditProfile({ ...editProfile, [name]: value });
    };

    // Hàm xử lý thay đổi input trong modal đổi mật khẩu
    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    // Hàm lưu thông tin chỉnh sửa (giả lập)
    const handleSaveProfile = () => {
        setProfile({ ...editProfile });
        toggleEditModal();
    };

    // Hàm đổi mật khẩu (giả lập)
    const handleChangePassword = () => {
        // Giả lập kiểm tra mật khẩu
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
        <div className="profile">
        <h2>Thông tin cá nhân</h2>
        <div className="profile-container">
            <div className="avatar-section">
            <div className="avatar"></div>
            <h3>{profile.name}</h3>
            <p>{profile.role}</p>
            <div className="actions">
                <button className="edit-button" onClick={toggleEditModal}>
                Chỉnh sửa thông tin
                </button>
                <button className="password-button" onClick={togglePasswordModal}>
                Đổi mật khẩu
                </button>
            </div>
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
                <button className="cancel-button" onClick={toggleEditModal}>
                    Hủy
                </button>
                <button className="save-button" onClick={handleSaveProfile}>
                    Lưu
                </button>
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
                <button className="cancel-button" onClick={togglePasswordModal}>
                    Hủy
                </button>
                <button className="save-button" onClick={handleChangePassword}>
                    Lưu
                </button>
                </div>
            </div>
            </div>
        )}
        </div>
    );
    };

    export default UserProfile;