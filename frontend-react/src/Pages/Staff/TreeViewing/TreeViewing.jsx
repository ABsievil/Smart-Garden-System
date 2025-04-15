import React, { useEffect, useState } from 'react';
import Navbar from '../../../Components/NavBar/NavBar';
// import './TreeView.css';

const TreeView = () => {
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const plantsPerPage = 5;

  // Fake data
  useEffect(() => {
    const mockPlants = [
      { id: 1, name: "Samanta William", humidity: "#123456789", season: "March 25, 2021", growthTime: "March 25, 2021", quantity: 20 },
      { id: 2, name: "Samanta William", humidity: "#123456789", season: "March 25, 2021", growthTime: "March 25, 2021", quantity: 20 },
      { id: 3, name: "Samanta William", humidity: "#123456789", season: "March 25, 2021", growthTime: "March 25, 2021", quantity: 20 },
      { id: 4, name: "Samanta William", humidity: "#123456789", season: "March 25, 2021", growthTime: "March 25, 2021", quantity: 20 },
      { id: 5, name: "Samanta William", humidity: "#123456789", season: "March 25, 2021", growthTime: "March 25, 2021", quantity: 20 },
    ];
    setPlants(mockPlants);
    setFilteredPlants(mockPlants);
  }, []);

  // Handle search
  useEffect(() => {
    let updatedPlants = [...plants];

    // Search by name
    if (searchTerm) {
      updatedPlants = updatedPlants.filter((plant) =>
        plant.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPlants(updatedPlants);
  }, [searchTerm, plants]);

  // Commented API fetch logic
  /*
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await api.get(`/api/v1/plant/getAllPlants`);
        if (response.data.status === "OK") {
          setPlants(response.data.data);
          setFilteredPlants(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching plants:', error);
      }
    };
    fetchPlants();
  }, []);
  */

  // Pagination logic
  const indexOfLastPlant = currentPage * plantsPerPage;
  const indexOfFirstPlant = indexOfLastPlant - plantsPerPage;
  const currentPlants = filteredPlants.slice(indexOfFirstPlant, indexOfLastPlant);
  const totalPages = Math.ceil(filteredPlants.length / plantsPerPage);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
            <th>Thời gian sinh trưởng</th>
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
              <td>{plant.growthTime}</td>
              <td>{plant.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <span>SHOWING {indexOfFirstPlant + 1}-{Math.min(indexOfLastPlant, filteredPlants.length)} OF {filteredPlants.length} DATA</span>
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
    </div>
  );
};

export default TreeView;