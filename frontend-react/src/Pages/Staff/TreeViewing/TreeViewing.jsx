import React, { useEffect, useState } from 'react';
import Navbar from '../../../Components/NavBar/NavBar';
import api from '../../../api'; // Kết nối API thật

// Format thời gian từ backend
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

const TreeView = () => {
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const plantsPerPage = 5;

  // Gọi API lấy danh sách cây
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await api.get('/api/v1/trees');
        if (response.data.status === 'OK') {
          const fetchedPlants = response.data.data.plants.map(plant => ({
            id: plant.area, // map lại ID cho phù hợp
            name: plant.name,
            humidity: plant.soldMoistureRecommend,
            season: plant.season,
            growthTime: plant.growthTime,
            quantity: plant.amount
          }));
          setPlants(fetchedPlants);
          setFilteredPlants(fetchedPlants);
        } else {
          console.error('Lỗi khi lấy danh sách cây:', response.data.message);
        }
      } catch (error) {
        console.error('Lỗi API:', error.response?.data?.message || error.message);
      }
    };

    fetchPlants();
  }, []);

  // Tìm kiếm
  useEffect(() => {
    let updatedPlants = [...plants];
    if (searchTerm) {
      updatedPlants = updatedPlants.filter((plant) =>
        plant.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredPlants(updatedPlants);
  }, [searchTerm, plants]);

  // Phân trang
  const indexOfLastPlant = currentPage * plantsPerPage;
  const indexOfFirstPlant = indexOfLastPlant - plantsPerPage;
  const currentPlants = filteredPlants.slice(indexOfFirstPlant, indexOfLastPlant);
  const totalPages = Math.ceil(filteredPlants.length / plantsPerPage);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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
        </div>
      </div>
      <table className="plant-table">
        <thead>
          <tr>
            <th>Tên cây</th>
            <th>Độ ẩm đầu cuối</th>
            <th>Mùa vụ</th>
            <th>Ngày thu hoạch dự kiến</th>
            <th>Số lượng</th>
          </tr>
        </thead>
        <tbody>
          {currentPlants.map((plant) => (
            <tr key={plant.id}>
              <td>
                <span className="plant-icon"></span>
                {plant.name}
              </td>
              <td>{plant.humidity}</td>
              <td>{plant.season}</td>
              <td>{formatDateTime(plant.growthTime)}</td>
              <td>{plant.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <span>
          SHOWING {indexOfFirstPlant + 1}-{Math.min(indexOfLastPlant, filteredPlants.length)} OF {filteredPlants.length} DATA
        </span>
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
    </div>
  );
};

export default TreeView;
