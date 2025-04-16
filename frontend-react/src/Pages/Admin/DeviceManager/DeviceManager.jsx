import React, { useEffect, useState } from 'react';
import Navbar from '../../../Components/NavBar/NavBar';
import './DeviceManager.css';

const DeviceManager = () => {
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentDeviceId, setCurrentDeviceId] = useState(null);
  const [newDevice, setNewDevice] = useState({
    name: '',
    deviceId: '',
    status: '',
    state: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null); // Track which menu is open
  const devicesPerPage = 5;

  // Fake data (used since no API is available)
  useEffect(() => {
    const mockDevices = [
      { id: 1, name: "Samanta William", deviceId: "#123456789", status: "Active", state: "On", createdAt: "2021-03-25T10:00:00Z" },
      { id: 2, name: "Samanta William", deviceId: "#123456789", status: "Active", state: "On", createdAt: "2021-03-25T12:00:00Z" },
      { id: 3, name: "Samanta William", deviceId: "#123456789", status: "Active", state: "On", createdAt: "2021-03-25T14:00:00Z" },
      { id: 4, name: "Samanta William", deviceId: "#123456789", status: "Being repaired", state: "Off", createdAt: "2021-03-25T16:00:00Z" },
      { id: 5, name: "Samanta William", deviceId: "#123456789", status: "Broken", state: "Off", createdAt: "2021-03-25T18:00:00Z" },
    ];
    setDevices(mockDevices);
    setFilteredDevices(mockDevices);
  }, []);

  // Handle search
  useEffect(() => {
    let updatedDevices = [...devices];

    // Search by name
    if (searchTerm) {
      updatedDevices = updatedDevices.filter((device) =>
        device.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDevices(updatedDevices);
  }, [searchTerm, devices]);

  // Commented API fetch logic
  /*
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/api/v1/device/getAllDevices`);
        if (response.data.status === "OK") {
          setDevices(response.data.data);
          setFilteredDevices(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    fetchData();
  }, []);
  */

  // Pagination logic
  const indexOfLastDevice = currentPage * devicesPerPage;
  const indexOfFirstDevice = indexOfLastDevice - devicesPerPage;
  const currentDevices = filteredDevices.slice(indexOfFirstDevice, indexOfLastDevice);
  const totalPages = Math.ceil(filteredDevices.length / devicesPerPage);

  const toggleModal = (mode = 'add', device = null) => {
    setIsModalOpen(!isModalOpen);
    setModalMode(mode);
    if (mode === 'edit' && device) {
      setCurrentDeviceId(device.id);
      setNewDevice({
        name: device.name,
        deviceId: device.deviceId,
        status: device.status,
        state: device.state,
      });
    } else {
      setCurrentDeviceId(null);
      setNewDevice({ name: '', deviceId: '', status: '', state: '' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDevice({ ...newDevice, [name]: value });
  };

  const handleSaveDevice = () => {
    // Local state update (used since no API is available)
    if (modalMode === 'add') {
      const newId = devices.length + 1;
      const addedDevice = {
        id: newId,
        name: newDevice.name,
        deviceId: newDevice.deviceId,
        status: newDevice.status,
        state: newDevice.state,
        createdAt: new Date().toISOString(),
      };
      setDevices([...devices, addedDevice]);
    } else {
      const updatedDevice = {
        id: currentDeviceId,
        name: newDevice.name,
        deviceId: newDevice.deviceId,
        status: newDevice.status,
        state: newDevice.state,
        createdAt: devices.find((device) => device.id === currentDeviceId).createdAt,
      };
      setDevices(devices.map((device) => (device.id === currentDeviceId ? updatedDevice : device)));
    }
    toggleModal();

    // Commented API save logic
    /*
    try {
      if (modalMode === 'add') {
        const response = await api.post('/api/v1/device/addDevice', {
          name: newDevice.name,
          deviceId: newDevice.deviceId,
          status: newDevice.status,
          state: newDevice.state,
        });
        if (response.data.status === "OK") {
          setDevices([...devices, response.data.data]);
        }
      } else {
        const response = await api.put(`/api/v1/device/updateDevice/${currentDeviceId}`, {
          name: newDevice.name,
          deviceId: newDevice.deviceId,
          status: newDevice.status,
          state: newDevice.state,
        });
        if (response.data.status === "OK") {
          setDevices(devices.map((device) =>
            device.id === currentDeviceId ? response.data.data : device
          ));
        }
      }
      toggleModal();
    } catch (error) {
      console.error("Error saving device:", error);
    }
    */
  };

  const handleDeleteDevice = (id) => {
    // Local state update (used since no API is available)
    setDevices(devices.filter((device) => device.id !== id));
    setOpenMenuId(null); // Close the menu after deleting

    // Commented API delete logic
    /*
    try {
      const response = await api.delete(`/api/v1/device/deleteDevice/${id}`);
      if (response.data.status === "OK") {
        setDevices(devices.filter((device) => device.id !== id));
        setOpenMenuId(null); // Close the menu after deleting
      }
    } catch (error) {
      console.error("Error deleting device:", error);
    }
    */
  };

  const handleEditDevice = (device) => {
    toggleModal('edit', device);
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
    <div className="device-list">
      <div className="header">
      <h7>Quản Lý Thiết Bị</h7>
      <Navbar />
      </div>
      <div className="header">
        <div className="actions1">
          <input
            type="text"
            placeholder="Search here..."
            className="search-bar"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button className="add-button" onClick={() => toggleModal('add')}>
            + Thêm thiết bị
          </button>
        </div>
      </div>
      <table className="device-table">
        <thead>
          <tr>
            <th>Tên thiết bị</th>
            <th>Khu vực</th>
            <th>Tình trạng</th>
            <th>Trạng thái</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentDevices.map((device) => (
            <tr key={device.id}>
              <td>
                <span className="device-icon"></span>
                {device.name}
              </td>
              <td>{device.deviceId}</td>
              <td>{device.status}</td>
              <td>{device.state}</td>
              <td>
                <div className="action-menu" style={{ position: 'relative' }}>
                  <button
                    className="menu-toggle"
                    onClick={() => toggleMenu(device.id)}
                  >
                    ⋯
                  </button>
                  {openMenuId === device.id && (
                    <div className="action-menu-content">
                      <button className="edit" onClick={() => handleEditDevice(device)}>
                        Sửa
                      </button>
                      <button className="delete" onClick={() => handleDeleteDevice(device.id)}>
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
        <span>SHOWING {indexOfFirstDevice + 1}-{Math.min(indexOfLastDevice, filteredDevices.length)} OF {filteredDevices.length} DATA</span>
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
            <h3>{modalMode === 'add' ? 'Thêm thiết bị' : 'Chỉnh sửa thiết bị'}</h3>
            <div className="modal-content">
              <label>Tên thiết bị</label>
              <input
                type="text"
                name="name"
                value={newDevice.name}
                onChange={handleInputChange}
                placeholder="Nhập tên thiết bị"
              />
              <label>Khu vực</label>
              <input
                type="text"
                name="deviceId"
                value={newDevice.deviceId}
                onChange={handleInputChange}
                placeholder="Nhập khu vực"
              />
              <label>Tình trạng</label>
              <input
                type="text"
                name="status"
                value={newDevice.status}
                onChange={handleInputChange}
                placeholder="Nhập tình trạng"
              />
              <label>Trạng thái</label>
              <input
                type="text"
                name="state"
                value={newDevice.state}
                onChange={handleInputChange}
                placeholder="Nhập trạng thái"
              />
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={() => toggleModal()}>
                Hủy
              </button>
              <button className="add-button" onClick={handleSaveDevice}>
                {modalMode === 'add' ? 'Thêm' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceManager;