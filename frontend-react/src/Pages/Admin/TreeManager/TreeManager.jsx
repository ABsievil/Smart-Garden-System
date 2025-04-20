import React, { useEffect, useState } from 'react';
import Navbar from '../../../Components/NavBar/NavBar';
import api from '../../../api'; // Import the configured api instance
import './TreeManager.css';

// Utility function to format LocalDateTime to a readable string
const formatDateTime = (dateTime) => {
  if (!dateTime) return '';
  const date = new Date(dateTime);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Utility function to parse string to LocalDateTime format (compatible with backend)
const parseDateTime = (dateString) => {
  if (!dateString) return null;
  const [datePart, timePart] = dateString.split(' ');
  if (!datePart || !timePart) {
    throw new Error('Định dạng thời gian không hợp lệ. Vui lòng nhập theo dạng DD/MM/YYYY HH:mm.');
  }
  const [day, month, year] = datePart.split('/').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hour) || isNaN(minute)) {
    throw new Error('Ngày hoặc giờ không hợp lệ. Vui lòng kiểm tra lại.');
  }
  const date = new Date(year, month - 1, day, hour, minute);
  if (isNaN(date.getTime())) {
    throw new Error('Ngày giờ không hợp lệ. Vui lòng kiểm tra lại.');
  }
  // Format to "yyyy-MM-dd'T'HH:mm:ss" (e.g., "2021-03-25T10:00:00")
  const formattedDate = date.toISOString().split('.')[0]; // Remove milliseconds and timezone
  return formattedDate;
};

// Popup component for notifications
const Popup = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 10000); // Close after 10 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`popup ${type}`}>
      <div className="popup-content">
        <p>{message}</p>
        <button onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
};

const TreeManager = () => {
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentPlantId, setCurrentPlantId] = useState(null);
  const [updatedPlant, setUpdatedPlant] = useState(null);
  const [newPlant, setNewPlant] = useState({
    name: '',
    soldMoistureRecommend: '',
    season: '',
    growthTime: '',
    amount: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null); // Track which menu is open
  const [error, setError] = useState(''); // For error messages
  const [successMessage, setSuccessMessage] = useState(''); // For success messages
  const plantsPerPage = 5;

  // Fetch plants from API
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await api.get('/api/v1/trees');
        console.log('API Response:', response.data); // Debug log
        if (response.data.status === 'OK') {
          const fetchedPlants = response.data.data.plants.map(plant => ({
            ...plant,
            id: plant.area, // Map area to id for frontend usage
          }));
          console.log('Fetched Plants:', fetchedPlants); // Log to check IDs
          // Check for duplicate IDs
          const ids = fetchedPlants.map(plant => plant.id);
          const uniqueIds = new Set(ids);
          if (ids.length !== uniqueIds.size) {
            console.warn('Duplicate plant IDs detected:', ids);
            setError('Dữ liệu cây trồng có ID trùng lặp, vui lòng kiểm tra backend.');
          }
          setPlants(fetchedPlants);
          setFilteredPlants(fetchedPlants);
        } else {
          setError(response.data.message || 'Không thể tải danh sách cây.');
        }
      } catch (error) {
        console.error('Error fetching plants:', error.response || error.message); // Debug log
        setError(error.response?.data?.message || 'Lỗi hệ thống, vui lòng thử lại sau.');
      }
    };
    fetchPlants();
  }, []);

  // Handle search
  useEffect(() => {
    let updatedPlants = [...plants];
    if (searchTerm) {
      updatedPlants = updatedPlants.filter((plant) =>
        plant.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredPlants(updatedPlants);
  }, [searchTerm, plants]);

  // Pagination logic
  const indexOfLastPlant = currentPage * plantsPerPage;
  const indexOfFirstPlant = indexOfLastPlant - plantsPerPage;
  const currentPlants = filteredPlants.slice(indexOfFirstPlant, indexOfLastPlant);
  const totalPages = Math.ceil(filteredPlants.length / plantsPerPage);

  const toggleModal = (mode = 'add', plant = null) => {
    setIsModalOpen(!isModalOpen);
    setModalMode(mode);
    if (mode === 'edit' && plant) {
      setCurrentPlantId(plant.id); // Use the mapped id (area)
      setNewPlant({
        name: plant.name,
        soldMoistureRecommend: plant.soldMoistureRecommend?.toString() || '',
        season: plant.season || '',
        growthTime: formatDateTime(plant.growthTime) || '',
        amount: plant.amount?.toString() || '',
      }
    );
    } else {
      setCurrentPlantId(null);
      setNewPlant({
        name: '',
        soldMoistureRecommend: '',
        season: '',
        growthTime: '',
        amount: '',
      });
    }
    setOpenMenuId(null); // Close any open menu
    setError('');
    setSuccessMessage(''); 

  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlant({ ...newPlant, [name]: value });
  };

  const handleSavePlant = async () => {
    if (!newPlant.name || !newPlant.soldMoistureRecommend || !newPlant.season || !newPlant.growthTime || !newPlant.amount) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    // Additional validation
    const moisture = parseFloat(newPlant.soldMoistureRecommend);
    if (isNaN(moisture) || moisture <= 0) {
      setError('Độ ẩm phải là số lớn hơn 0.');
      return;
    }
    const amount = parseInt(newPlant.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Số lượng phải là số lớn hơn 0.');
      return;
    }

    let growthTime;
    try {
      growthTime = parseDateTime(newPlant.growthTime);
    } catch (parseError) {
      setError(parseError.message);
      return;
    }

    try {
      const payload = {
        name: newPlant.name,
        soldMoistureRecommend: moisture,
        season: newPlant.season,
        growthTime: growthTime,
        amount: amount,
      };
      console.log('Save Payload:', payload); // Debug log
      console.log('Current Plant ID:', currentPlantId); // Debug log

      if (modalMode === 'add') {
        const response = await api.post('/api/v1/trees', payload);
        toggleModal(); // Close modal after adding
        console.log('Add Response:', response.data); // Debug log
        if (response.status === 'OK') {
          const newPlantData = { ...response.data.data, id: response.data.data.area };
          const updatedPlants = [...plants, newPlantData];
          setPlants(updatedPlants); // Update table with new plant
          setFilteredPlants(updatedPlants); // Update filtered table
          setSuccessMessage('Bạn đã thêm cây thành công.');
          setIsModalOpen(false); // Close modal on successful add
         
        } else {
          setError(response.data.message || 'Không thể thêm cây.');
        }
      } else {
        console.log('Editing plant with ID:', currentPlantId); // Debug log
        const response = await api.put(`/api/v1/trees/${currentPlantId} `, payload);
toggleModal(); // Close modal after editing
        console.log('Edit Response:', response.data); // Debug log
        if (response.status === 'OK') {
          const updatedPlantData = { ...response.data.data, id: response.data.data.area };
          console.log('Updated Plant Data:', updatedPlantData); // Debug log
          const updatedPlants = plants.map((plant) =>
            plant.id === currentPlantId ? updatedPlantData : plant
          );
          setPlants(updatedPlants);
          setFilteredPlants(updatedPlants);
          setSuccessMessage('Bạn đã cập nhật cây thành công.');
          setIsModalOpen(false); // Close modal on successful edit
        } else {
          setError(response.data.message || 'Không thể cập nhật cây.');
        }
      }
    } catch (error) {
    }
  };

  const handleDeletePlant = async (id) => {
    try {
      const response = await api.delete(`/api/v1/trees/${id}`);
      console.log('Delete Response:', response.data); // Debug log
      if (response.data.status === 'OK') {
        const updatedPlants = plants.filter((plant) => plant.id !== id);
        setPlants(updatedPlants);
        setFilteredPlants(updatedPlants);
        setOpenMenuId(null);
        setSuccessMessage('Bạn đã xóa cây thành công.');
        if (isModalOpen) {
          toggleModal(); // Close modal if open
        }
      } else {
        setError(response.data.message || 'Không thể xóa cây.');
      }
    } catch (error) {
      console.error('Error deleting plant:', error.response || error.message); // Debug log
      setError(error.response?.data?.message || 'Lỗi hệ thống, vui lòng thử lại sau.');
    }
  };

  const handleEditPlant = (plant) => {
    toggleModal('edit', plant);
    setOpenMenuId(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const closePopup = () => {
    setSuccessMessage('');
    setError('');
  };

  return (
    <div className="plant-list">
      <div className="header">
        <h7>Danh sách cây trồng</h7>
        <Navbar />
      </div>
      <div className="header">
        <div className="actions2">
          <input
            type="text"
            placeholder="Search here..."
            className="search-bar"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button className="add-button" onClick={() => toggleModal('add')}>
            + Thêm cây (Khu vực)
          </button>
        </div>
      </div>
      {successMessage && (
        <Popup message={successMessage} type="success" onClose={closePopup} />
      )}
      {error && (
        <Popup message={error} type="error" onClose={closePopup} />
      )}
      <table className="plant-table">
        <thead>
          <tr>
            <th>Tên cây</th>
            <th>Độ ẩm đầu cuối</th>
            <th>Mùa vụ</th>
            <th>Ngày thu hoạch dự kiến</th>
            <th>Số lượng</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentPlants.map((plant, index) => (
            <tr key={plant.id || index}>
              <td>
                <span className="plant-icon"></span>
                {plant.name}
              </td>
              <td>{plant.soldMoistureRecommend}</td>
              <td>{plant.season}</td>
              <td>{formatDateTime(plant.growthTime)}</td>
              <td>{plant.amount}</td>
              <td>
                <div className="action-menu" style={{ position: 'relative' }}>
                  <button
                    className="menu-toggle"
                    onClick={() => toggleMenu(plant.id)}
                  >
                    ⋯
                  </button>
                  {openMenuId === plant.id && (
                    <div className="action-menu-content">
                      <button className="edit" onClick={() => handleEditPlant(plant)}>
                        Sửa
                      </button>
                      <button className="delete" onClick={() => handleDeletePlant(plant.id)}>
                        Xóa
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {/* <span>SHOWING {indexOfFirstPlant + 1}-{Math.min(indexOfLastPlant, filteredPlants.length)} OF {filteredPlants.length} DATA</span> */}
        <div className="pagination-controls">
          <button
            className="page-button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {[...Array(totalPages).keys()].map((page) => (
            <button
              key={`page-${page + 1}`}
              className={`page-button ${currentPage === page + 1 ? 'active' : ''}`}
              onClick={() => handlePageChange(page + 1)}
            >
              {page + 1}
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
        <div className="modal-overlay">
          <div className="modal">
            <h3>{modalMode === 'add' ? 'Thêm cây' : 'Chỉnh sửa cây'}</h3>
            <div className="modal-content">
              <label>Tên cây</label>
              <input
                type="text"
                name="name"
                value={newPlant.name}
                onChange={handleInputChange}
                placeholder="Nhập tên cây"
              />
              <label>Độ ẩm đầu cuối</label>
              <input
                type="number"
                step="0.01"
                name="soldMoistureRecommend"
                value={newPlant.soldMoistureRecommend}
                onChange={handleInputChange}
                placeholder="Nhập độ ẩm"
              />
              <label>Mùa vụ</label>
              <input
                type="text"
                name="season"
                value={newPlant.season}
                onChange={handleInputChange}
                placeholder="Nhập mùa vụ"
              />
              <label>Ngày thu hoạch dự kiến</label>
              <input
                type="text"
                name="growthTime"
                value={newPlant.growthTime}
                onChange={handleInputChange}
                placeholder="Nhập thời gian (DD/MM/YYYY HH:mm)"
              />
              <label>Số lượng</label>
              <input
                type="number"
                name="amount"
                value={newPlant.amount}
                onChange={handleInputChange}
                placeholder="Nhập số lượng"
              />
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={() => toggleModal()}>
                Hủy
              </button>
              <button className="add-button" onClick={handleSavePlant}>
                {modalMode === 'add' ? 'Thêm' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreeManager;