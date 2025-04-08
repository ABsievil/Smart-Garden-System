import React, { useEffect, useState } from 'react';
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
  const [sortOrder, setSortOrder] = useState('newest'); // Mặc định là mới nhất

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

  // Xử lý tìm kiếm và lọc khi searchTerm hoặc sortOrder thay đổi
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

    // Sắp xếp theo ngày thêm vào
    updatedStaff.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredStaff(updatedStaff);
  }, [searchTerm, sortOrder, staff]);


  /*
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        // Gọi API để lấy danh sách nhân viên
        const response = await axios.get('/api/staff');
        setStaff(response.data);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách nhân viên:', err);
      }
    };
    fetchStaff();
  }, []);

  // Hàm thêm nhân viên mới qua API
  const addStaff = async () => {
    try {
      const response = await axios.post('/api/staff', newStaff);
      setStaff([...staff, response.data]);
      setIsModalOpen(false);
      setNewStaff({ name: '', memberId: '', role: '' });
    } catch (err) {
      console.error('Lỗi khi thêm nhân viên:', err);
    }
  };
  */

  // Hàm mở/đóng modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (isModalOpen) {
      setNewStaff({ name: '', memberId: '', role: '' }); // Reset form khi đóng modal
    }
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
  };

  // Hàm xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Hàm xử lý lọc
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  return (
    <div className="staff-management">
      {/* Thanh tìm kiếm, lọc và nút thêm nhân viên */}
      <div className="header">
        <h2>Quản lý nhân viên</h2>
        <div className="actions">
          <input
            type="text"
            placeholder="Search here..."
            className="search-bar"
            value={searchTerm}
            onChange={handleSearch}
          />
          <select className="sort-dropdown" value={sortOrder} onChange={handleSortChange}>
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
          </select>
          <button className="add-button" onClick={toggleModal}>
            Thêm nhân viên
          </button>
        </div>
      </div>

      {/* Lưới danh sách nhân viên */}
      <div className="staff-grid">
        {filteredStaff.map((member) => (
          <div key={member.id} className="staff-card">
            <div className="avatar"></div>
            <h3>{member.name}</h3>
            <p className="member-id">{member.memberId}</p>
            <p>{member.role}</p>
          </div>
        ))}
      </div>

      {/* Phân trang (giả lập) */}
      <div className="pagination">
        <span>Showing 1-5 from 100 data</span>
        <div className="pagination-buttons">
          <button>1</button>
          <button>2</button>
          <button>3</button>
        </div>
      </div>

      {/* Modal thêm nhân viên */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Thêm nhân viên</h3>
            <div className="modal-content">
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
            <div className="modal-actions">
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