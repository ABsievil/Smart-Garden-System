import React, { useEffect, useState } from 'react';
import Navbar from '../../../Components/NavBar/NavBar';
import api from '../../../api'; // Import the axios instance
import './StaffManager.css';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    username: '',
    password: '',
    email: '',
    fname: '',
    lname: '',
    ssn: '',
    jobName: '',
    jobArea: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null); // For API errors
  const staffPerPage = 12;

  // Fetch staff from API
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await api.get('/api/v1/staff-manage/user-list');
        if (response.data.status === 'OK') {
          // Map API response to local state
          const staffList = response.data.data.userList.map((user, index) => ({
            id: index + 1, // Local id for rendering
            name: user.name || 'Không có tên', // Fallback if name is null
            memberId: user.ssn || 'N/A', // Map ssn to memberId
            role: user.jobName || 'N/A', // Map jobName to role
          }));
          setStaff(staffList);
          setFilteredStaff(staffList);
          setError(null);
        } else {
          console.error('Lỗi khi lấy danh sách nhân viên:', response.data.message);
          setError('Lỗi khi lấy danh sách nhân viên');
        }
      } catch (error) {
        console.error('Lỗi API:', error.response?.data?.message || error.message);
        setError('Lỗi khi lấy danh sách nhân viên');
      }
    };
    fetchStaff();
  }, []);

  // Handle search
  useEffect(() => {
    let updatedStaff = [...staff];

    if (searchTerm) {
      updatedStaff = updatedStaff.filter((member) =>
        (member.name && member.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (member.memberId && member.memberId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (member.role && member.role.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredStaff(updatedStaff);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [searchTerm, staff]);

  // Pagination logic
  const indexOfLastStaff = currentPage * staffPerPage;
  const indexOfFirstStaff = indexOfLastStaff - staffPerPage;
  const currentStaff = filteredStaff.slice(indexOfFirstStaff, indexOfLastStaff);
  const totalPages = Math.ceil(filteredStaff.length / staffPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Open/close modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (isModalOpen) {
      setNewStaff({
        username: '',
        password: '',
        email: '',
        fname: '',
        lname: '',
        ssn: '',
        jobName: '',
        jobArea: '',
      }); // Reset form when closing modal
      setError(null); // Clear errors when closing
    }
  };

  // Handle input changes in modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff({ ...newStaff, [name]: value });
  };

  // Add new staff via API
  const handleAddStaff = async () => {
    // Basic validation
    if (!newStaff.username || !newStaff.password || !newStaff.fname || !newStaff.lname || !newStaff.jobArea) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập, mật khẩu, họ, tên và khu vực làm việc');
      return;
    }

    try {
      const response = await api.post('/api/v1/staff-manage/add-user', {
        username: newStaff.username,
        password: newStaff.password,
        email: newStaff.email || null, // Optional
        information: {
          fname: newStaff.fname,
          lname: newStaff.lname,
          ssn: newStaff.ssn || null, // Optional
          jobName: newStaff.jobName || null, // Optional
          jobArea: parseInt(newStaff.jobArea), // Convert to integer
        },
      });
      if (response.data.status === 'OK') {
        // Map the saved user to local state
        const savedUser = response.data.data;
        const newStaffMember = {
          id: staff.length + 1, // Local id for rendering
          name: `${savedUser.information.lname} ${savedUser.information.fname}`,
          memberId: savedUser.information.ssn || 'N/A',
          role: savedUser.information.jobName || 'N/A',
        };
        setStaff([...staff, newStaffMember]);
        toggleModal();
        setError(null);
      } else {
        console.error('Lỗi khi thêm nhân viên:', response.data.message);
        setError('Lỗi khi thêm nhân viên: ' + response.data.message);
      }
    } catch (error) {
      console.error('Lỗi API:', error.response?.data?.message || error.message);
      setError('Lỗi khi thêm nhân viên: ' + (error.response?.data?.message || error.message));
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="staff-management">
      <div className="header">
        <h7>Quản lý nhân viên</h7>
        <Navbar />
      </div>
      <div className="actions3">
        <input
          type="text"
          placeholder="Search here..."
          className="search-bar"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className="add-button" onClick={toggleModal}>
          Thêm nhân viên
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="staff-grid">
        {currentStaff.length > 0 ? (
          currentStaff.map((member) => (
            <div key={member.id} className="staff-card">
              <div className="avatar"></div>
              <h11>{member.name}</h11>
              <h12 className="member-id">{member.memberId}</h12>
              <h12>{member.role}</h12>
            </div>
          ))
        ) : (
          <div>Không có nhân viên nào để hiển thị</div>
        )}
      </div>
      <div className="pagination" style={{ backgroundColor: "transparent" }}>
        <span style={{ backgroundColor: "transparent", width: "100%" }}>
          SHOWING {indexOfFirstStaff + 1}-{Math.min(indexOfLastStaff, filteredStaff.length)} OF {filteredStaff.length} DATA
        </span>
        <div className="pagination-controls">
          <button
            className="page-button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              className={`page-button ${currentPage === page ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="page-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal-overlay1">
          <div className="modal1">
            <h3>Thêm nhân viên</h3>
            <div className="modal-content1">
              <label>Tên đăng nhập</label>
              <input
                type="text"
                name="username"
                value={newStaff.username}
                onChange={handleInputChange}
                placeholder="Nhập tên đăng nhập"
                required
              />
              <label>Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={newStaff.password}
                onChange={handleInputChange}
                placeholder="Nhập mật khẩu"
                required
              />
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={newStaff.email}
                onChange={handleInputChange}
                placeholder="Nhập email (tuỳ chọn)"
              />
              <label>Họ và tên đệm</label>
              <input
                type="text"
                name="lname"
                value={newStaff.lname}
                onChange={handleInputChange}
                placeholder="Nhập họ"
                required
              />
              <label>Tên</label>
              <input
                type="text"
                name="fname"
                value={newStaff.fname}
                onChange={handleInputChange}
                placeholder="Nhập tên"
                required
              />
              <label>Mã số nhân viên (SSN)</label>
              <input
                type="text"
                name="ssn"
                value={newStaff.ssn}
                onChange={handleInputChange}
                placeholder="Nhập mã số nhân viên (tuỳ chọn)"
              />
              <label>Chức vụ</label>
              <input
                type="text"
                name="jobName"
                value={newStaff.jobName}
                onChange={handleInputChange}
                placeholder="Nhập chức vụ (tuỳ chọn)"
              />
              <label>Khu vực làm việc</label>
              <input
                type="number"
                name="jobArea"
                value={newStaff.jobArea}
                onChange={handleInputChange}
                placeholder="Nhập khu vực làm việc (số)"
                required
              />
            </div>
            <div className="modal-actions1">
              <button className="cancel-button" onClick={toggleModal}>
                Hủy
              </button>
              <button className="add-button" onClick={handleAddStaff}>
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;