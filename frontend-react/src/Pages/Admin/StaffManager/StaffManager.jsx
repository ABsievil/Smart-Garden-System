import React, { useEffect, useState } from 'react';
import Navbar from '../../../Components/NavBar/NavBar';
import './StaffManager.css';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    memberId: '',
    role: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [isPaginationModalOpen, setIsPaginationModalOpen] = useState(false); // State for pagination modal
  const staffPerPage = 12; // Number of staff per page

  // FakeData
  useEffect(() => {
    const mockStaff = [
      { id: 1, name: 'Dimitres Viga', memberId: '#123456', role: 'Thực tập viên khu A', createdAt: '2025-01-20T10:00:00Z' },
      { id: 2, name: 'Tom Housenburg', memberId: '#234567', role: 'Nhân viên quản lý', createdAt: '2025-01-20T12:00:00Z' },
      { id: 3, name: 'Dana Benevista', memberId: '#345678', role: 'Thực tập viên khu B', createdAt: '2025-01-20T14:00:00Z' },
      { id: 4, name: 'Salvadore Morbeau', memberId: '#456789', role: 'Nhân viên quản lý', createdAt: '2025-01-22T09:00:00Z' },
      { id: 5, name: 'Maria Historia', memberId: '#567890', role: 'Thực tập viên khu A', createdAt: '2025-01-22T10:00:00Z' },
      { id: 6, name: 'Jack Sally', memberId: '#678901', role: 'Thực tập viên khu A', createdAt: '2025-01-22T11:00:00Z' },
      { id: 7, name: 'Lula Beatrice', memberId: '#789012', role: 'Thực tập viên khu A', createdAt: '2025-01-22T12:00:00Z' },
      { id: 8, name: 'Nella Vita', memberId: '#890123', role: 'Thực tập viên khu A', createdAt: '2025-01-22T13:00:00Z' },
      { id: 9, name: 'Nadia Laravela', memberId: '#901234', role: 'Thực tập viên khu A', createdAt: '2025-01-22T14:00:00Z' },
      { id: 10, name: 'Dakota Farral', memberId: '#012345', role: 'Thực tập viên khu A', createdAt: '2025-01-22T15:00:00Z' },
      { id: 11, name: 'Miranda Adila', memberId: '#112345', role: 'Thực tập viên khu A', createdAt: '2025-01-22T16:00:00Z' },
      { id: 12, name: 'Indiana Barker', memberId: '#212345', role: 'Thực tập viên khu A', createdAt: '2025-01-22T17:00:00Z' },
    ];
    setStaff(mockStaff);
    setFilteredStaff(mockStaff);
  }, []);

  // Xử lý tìm kiếm
  useEffect(() => {
    let updatedStaff = [...staff];

    // Tìm kiếm theo tên, ID, hoặc role
    if (searchTerm) {
      updatedStaff = updatedStaff.filter((member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStaff(updatedStaff);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [searchTerm, staff]);

  // Commented API fetch logic
  /*
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await api.get('/api/v1/staff/getAllStaff');
        if (response.data.status === "OK") {
          setStaff(response.data.data);
          setFilteredStaff(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching staff:', error);
      }
    };
    fetchStaff();
  }, []);
  */

  // Commented API add logic
  /*
  const addStaff = async () => {
    try {
      const response = await api.post('/api/v1/staff/addStaff', newStaff);
      if (response.data.status === "OK") {
        setStaff([...staff, response.data.data]);
        setIsModalOpen(false);
        setNewStaff({ name: '', memberId: '', role: '' });
      }
    } catch (error) {
      console.error('Error adding staff:', error);
    }
  };
  */

  // Pagination logic
  const indexOfLastStaff = currentPage * staffPerPage;
  const indexOfFirstStaff = indexOfLastStaff - staffPerPage;
  const currentStaff = filteredStaff.slice(indexOfFirstStaff, indexOfLastStaff);
  const totalPages = Math.ceil(filteredStaff.length / staffPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setIsPaginationModalOpen(false); // Close modal after selecting a page
    }
  };

  // Hàm mở/đóng modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (isModalOpen) {
      setNewStaff({ name: '', memberId: '', role: '' }); // Reset form khi đóng modal
    }
  };

  // Hàm mở/đóng modal phân trang
  const togglePaginationModal = () => {
    setIsPaginationModalOpen(!isPaginationModalOpen);
  };

  // Hàm xử lý thay đổi input trong modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff({ ...newStaff, [name]: value });
  };

  // Hàm thêm nhân viên mới (fake)
  const handleAddStaff = () => {
    const newId = staff.length + 1;
    const addedStaff = {
      id: newId,
      name: newStaff.name,
      memberId: newStaff.memberId,
      role: newStaff.role,
      createdAt: new Date().toISOString(), // Thêm thời gian hiện tại
    };
    setStaff([...staff, addedStaff]);
    toggleModal();

    // Commented API add logic
    /*
    try {
      const response = await api.post('/api/v1/staff/addStaff', newStaff);
      if (response.data.status === "OK") {
        setStaff([...staff, response.data.data]);
        setIsModalOpen(false);
        setNewStaff({ name: '', memberId: '', role: '' });
      }
    } catch (error) {
      console.error('Error adding staff:', error);
    }
    */
  };

  // Hàm xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="staff-management">
      <div className="header">
        <h7>Quản lý nhân viên</h7>
        <Navbar />
        </div>
      {/* Thanh tìm kiếm và nút thêm nhân viên */}
        
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
     

      {/* Lưới danh sách nhân viên */}
      <div className="staff-grid">
        {currentStaff.map((member) => (
          <div key={member.id} className="staff-card">
            <div className="avatar"></div>
            <h11>{member.name}</h11>
            <h12 className="member-id">{member.memberId}</h12>
            <h12>{member.role}</h12>
          </div>
        ))}
      </div>

      {/* Phân trang với modal */}
      <div className="pagination" style={{ backGroundColor: "transparent" }} >
        <span style={{ backGroundColor: "transparent", width: "100%" }}>
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
          {[1, 2, 3].map((page) => (
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

      {/* Modal thêm nhân viên */}
      {isModalOpen && (
        <div className="modal-overlay1">
          <div className="modal1">
            <h3>Thêm nhân viên</h3>
            <div className="modal-content1">
              <label>Tên nhân viên</label>
              <input
                type="text"
                name="name"
                value={newStaff.name}
                onChange={handleInputChange}
                placeholder="Nhập tên nhân viên"
              />
              <label>ID nhân viên</label>
              <input
                type="text"
                name="memberId"
                value={newStaff.memberId}
                onChange={handleInputChange}
                placeholder="Nhập ID nhân viên"
              />
              <label>Chức vụ</label>
              <input
                type="text"
                name="role"
                value={newStaff.role}
                onChange={handleInputChange}
                placeholder="Nhập chức vụ"
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