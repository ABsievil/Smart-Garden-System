import React, { useEffect, useState } from 'react';
import Navbar from '../../../Components/NavBar/NavBar';
import './TreeManager.css';

const TreeManager = () => {
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentPlantId, setCurrentPlantId] = useState(null);
  const [newPlant, setNewPlant] = useState({
    name: '',
    humidity: '',
    season: '',
    growthTime: '',
    quantity: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null); // Track which menu is open
  const plantsPerPage = 5;

  // Fake data
  useEffect(() => {
    const mockPlants = [
      { id: 1, name: "Samanta William", humidity: "#123456789", season: "March 25, 2021", growthTime: "March 25, 2021", quantity: 20, createdAt: "2021-03-25T10:00:00Z" },
      { id: 2, name: "Samanta William", humidity: "#123456789", season: "March 25, 2021", growthTime: "March 25, 2021", quantity: 20, createdAt: "2021-03-25T12:00:00Z" },
      { id: 3, name: "Samanta William", humidity: "#123456789", season: "March 25, 2021", growthTime: "March 25, 2021", quantity: 20, createdAt: "2021-03-25T14:00:00Z" },
      { id: 4, name: "Samanta William", humidity: "#123456789", season: "March 25, 2021", growthTime: "March 25, 2021", quantity: 20, createdAt: "2021-03-25T16:00:00Z" },
      { id: 5, name: "Samanta William", humidity: "#123456789", season: "March 25, 2021", growthTime: "March 25, 2021", quantity: 20, createdAt: "2021-03-25T18:00:00Z" },
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

  const toggleModal = (mode = 'add', plant = null) => {
    setIsModalOpen(!isModalOpen);
    setModalMode(mode);
    if (mode === 'edit' && plant) {
      setCurrentPlantId(plant.id);
      setNewPlant({
        name: plant.name,
        humidity: plant.humidity,
        season: plant.season,
        growthTime: plant.growthTime,
        quantity: plant.quantity,
      });
    } else {
      setCurrentPlantId(null);
      setNewPlant({ name: '', humidity: '', season: '', growthTime: '', quantity: '' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlant({ ...newPlant, [name]: value });
  };

  const handleSavePlant = () => {
    if (modalMode === 'add') {
      const newId = plants.length + 1;
      const addedPlant = {
        id: newId,
        name: newPlant.name,
        humidity: newPlant.humidity,
        season: newPlant.season,
        growthTime: newPlant.growthTime,
        quantity: newPlant.quantity,
        createdAt: new Date().toISOString(),
      };
      setPlants([...plants, addedPlant]);
    } else {
      const updatedPlant = {
        id: currentPlantId,
        name: newPlant.name,
        humidity: newPlant.humidity,
        season: newPlant.season,
        growthTime: newPlant.growthTime,
        quantity: newPlant.quantity,
        createdAt: plants.find((plant) => plant.id === currentPlantId).createdAt,
      };
      setPlants(plants.map((plant) => (plant.id === currentPlantId ? updatedPlant : plant)));
    }
    toggleModal();

    // Commented API save logic
    /*
    try {
      if (modalMode === 'add') {
        const response = await api.post('/api/v1/plant/addPlant', {
          name: newPlant.name,
          humidity: newPlant.humidity,
          season: newPlant.season,
          growthTime: newPlant.growthTime,
          quantity: newPlant.quantity,
        });
        if (response.data.status === "OK") {
          setPlants([...plants, response.data.data]);
        }
      } else {
        const response = await api.put(`/api/v1/plant/updatePlant/${currentPlantId}`, {
          name: newPlant.name,
          humidity: newPlant.humidity,
          season: newPlant.season,
          growthTime: newPlant.growthTime,
          quantity: newPlant.quantity,
        });
        if (response.data.status === "OK") {
          setPlants(plants.map((plant) =>
            plant.id === currentPlantId ? response.data.data : plant
          ));
        }
      }
      toggleModal();
    } catch (error) {
      console.error("Error saving plant:", error);
    }
    */
  };

  const handleDeletePlant = (id) => {
    setPlants(plants.filter((plant) => plant.id !== id));
    setOpenMenuId(null); // Close the menu after deleting

    // Commented API delete logic
    /*
    try {
      const response = await api.delete(`/api/v1/plant/deletePlant/${id}`);
      if (response.data.status === "OK") {
        setPlants(plants.filter((plant) => plant.id !== id));
        setOpenMenuId(null); // Close the menu after deleting
      }
    } catch (error) {
      console.error("Error deleting plant:", error);
    }
    */
  };

  const handleEditPlant = (plant) => {
    toggleModal('edit', plant);
    setOpenMenuId(null); // Close the menu after editing
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="plant-list">
      <div className="header">
      <h7>Danh sách cây trồng</h7>
      <Navbar/>
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
      <table className="plant-table">
        <thead>
          <tr>
            <th>Tên cây</th>
            <th>Độ ẩm đầu cuối</th>
            <th>Mùa vụ</th>
            <th>Thời gian sinh trưởng</th>
            <th>Số lượng</th>
            <th>Action</th>
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
                type="text"
                name="humidity"
                value={newPlant.humidity}
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
              <label>Thời gian sinh trưởng</label>
              <input
                type="text"
                name="growthTime"
                value={newPlant.growthTime}
                onChange={handleInputChange}
                placeholder="Nhập thời gian"
              />
              <label>Số lượng</label>
              <input
                type="text"
                name="quantity"
                value={newPlant.quantity}
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