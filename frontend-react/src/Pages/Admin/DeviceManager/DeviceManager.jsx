import React, { useEffect, useState } from 'react';
import Navbar from '../../../Components/NavBar/NavBar';
import api from '../../../api'; // Import the axios instance
import './DeviceManager.css';

const DeviceManager = () => {
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentDeviceId, setCurrentDeviceId] = useState(null); // Holds the backend deviceId
  const [newDevice, setNewDevice] = useState({
    name: '',
    area: '', // Area is a separate field
    status: 'ON', // Default value
    state: 'ACTIVE', // Default value
    warranty: '',
    drive: '',
    inputVoltage: '',
    outputVoltage: '',
    speed: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null); // Track which menu is open
  const [error, setError] = useState(null); // For API errors
  const devicesPerPage = 5;

  // Fetch devices from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/v1/device-manage/device-list');
        console.log('API response:', response.data.data); // Log the API response
        if (response.data.status === 'success') {
          // Sort the device list by deviceId in ascending order
          const sortedDeviceList = response.data.data.deviceList.sort((a, b) => a.deviceId - b.deviceId);
          
          // Map API response correctly: deviceId is the unique ID
          const deviceList = sortedDeviceList.map((device) => ({
            id: device.deviceId, // Use backend deviceId as the primary ID
            name: device.name,
            area: device.area, // Store area separately
            status: device.status, // Already "ON" or "OFF"
            state: device.state, // Already "ACTIVE" or "BROKEN"
            mode: device.mode,
          }));
          setDevices(deviceList);
          setFilteredDevices(deviceList);
          setError(null);
        } else {
          console.error('Lỗi khi lấy danh sách thiết bị:', response.data.message);
          setError('Lỗi khi lấy danh sách thiết bị');
        }
      } catch (error) {
        console.error('Lỗi API:', error.response?.data?.message || error.message);
        setError('Lỗi khi lấy danh sách thiết bị');
      }
    };

    fetchData();
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

  // Pagination logic
  const indexOfLastDevice = currentPage * devicesPerPage;
  const indexOfFirstDevice = indexOfLastDevice - devicesPerPage;
  const currentDevices = filteredDevices.slice(indexOfFirstDevice, indexOfLastDevice);
  const totalPages = Math.ceil(filteredDevices.length / devicesPerPage);

  const toggleModal = (mode = 'add', device = null) => {
    setIsModalOpen(!isModalOpen);
    setModalMode(mode);
    if (mode === 'edit' && device) {
      setCurrentDeviceId(device.id); // Set currentDeviceId to the backend deviceId
      setNewDevice({
        name: device.name,
        area: device.area, // Set area from the device data
        status: device.status,
        state: device.state,
        mode: device.mode,
        warranty: '', // Not fetched from API; edit locally
        drive: '',
        inputVoltage: '',
        outputVoltage: '',
        speed: '',
      });
    } else {
      setCurrentDeviceId(null);
      setNewDevice({
        name: '',
        area: '',
        status: 'ON',
        state: 'ACTIVE',
        warranty: '',
        drive: '',
        inputVoltage: '',
        outputVoltage: '',
        speed: '',
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDevice({ ...newDevice, [name]: value });
  };

  const handleSaveDevice = async () => {
    if (modalMode === 'add') {
      try {
        const response = await api.post('/api/v1/device-manage/add-device', {
          name: newDevice.name,
          area: parseInt(newDevice.area), // Convert to integer
          warranty: newDevice.warranty || 'N/A', // Default if empty
          drive: newDevice.drive || 'N/A',
          inputVoltage: parseFloat(newDevice.inputVoltage) || 0,
          outputVoltage: parseFloat(newDevice.outputVoltage) || 0,
          state: newDevice.state, // "ACTIVE" or "BROKEN"
          status: newDevice.status, // "ON" or "OFF"
          speed: parseFloat(newDevice.speed) || 0,
          mode: newDevice.mode || 'MANUAL', // Add default mode if not set
        });
        if (response.data.status === 'OK') {
          // Map the saved device to local state
          const savedDevice = {
            id: response.data.data.deviceId, // Use backend deviceId as the ID
            name: response.data.data.name,
            area: response.data.data.area.toString(), // Store area
            status: response.data.data.status ? 'ON' : 'OFF', // Convert boolean to string
            state: response.data.data.state ? 'ACTIVE' : 'BROKEN', // Convert boolean to string
            mode: response.data.data.mode,
          };
          setDevices([...devices, savedDevice]);
          setError(null);
          toggleModal();
        } else {
          console.error('Lỗi khi thêm thiết bị:', response.data.message);
          setError('Lỗi khi thêm thiết bị');
        }
      } catch (error) {
        console.error('Lỗi API:', error.response?.data?.message || error.message);
        setError('Lỗi khi thêm thiết bị');
      }
    } else {
      // Handle edit using API
      try {
        const response = await api.put(`/api/v1/device-manage/update-device/${currentDeviceId}`, {
          name: newDevice.name,
          area: parseInt(newDevice.area), // Send area in the body
          warranty: newDevice.warranty || 'N/A',
          drive: newDevice.drive || 'N/A',
          inputVoltage: parseFloat(newDevice.inputVoltage) || 0,
          outputVoltage: parseFloat(newDevice.outputVoltage) || 0,
          state: newDevice.state, // "ACTIVE" or "BROKEN"
          status: newDevice.status, // "ON" or "OFF"
          speed: parseFloat(newDevice.speed) || 0,
          mode: newDevice.mode || 'MANUAL',
        });

        if (response.data.status === 'OK') {
           // Map the updated device data from the response
          const updatedDeviceData = response.data.data;
          const updatedDevice = {
            id: updatedDeviceData.deviceId, // Keep the backend deviceId
            name: updatedDeviceData.name,
            area: updatedDeviceData.area.toString(), // Update area
            status: updatedDeviceData.status ? 'ON' : 'OFF',
            state: updatedDeviceData.state ? 'ACTIVE' : 'BROKEN',
            mode: updatedDeviceData.mode,
          };
          setDevices(devices.map((device) => (device.id === currentDeviceId ? updatedDevice : device)));
          setError(null);
          toggleModal();
        } else {
          console.error('Lỗi khi cập nhật thiết bị:', response.data.message);
          setError('Lỗi khi cập nhật thiết bị');
        }
      } catch (error) {
        console.error('Lỗi API cập nhật:', error.response?.data?.message || error.message);
        setError('Lỗi khi cập nhật thiết bị');
      }
    }
  };

  const handleDeleteDevice = async (deviceIdToDelete) => { // Parameter is the backend deviceId
    // Use API to delete
    try {
      const response = await api.delete(`/api/v1/device-manage/delete-device/${deviceIdToDelete}`);
      if (response.data.status === 'OK') {
        // Remove from local state using the backend deviceId
        setDevices(devices.filter((device) => device.id !== deviceIdToDelete));
        setError(null);
        setOpenMenuId(null); // Close the menu
      } else {
        console.error('Lỗi khi xóa thiết bị:', response.data.message);
        setError('Lỗi khi xóa thiết bị');
        setOpenMenuId(null);
      }
    } catch (error) {
      console.error('Lỗi API xóa:', error.response?.data?.message || error.message);
      setError('Lỗi khi xóa thiết bị');
      setOpenMenuId(null);
    }
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
      {error && <div className="error-message">{error}</div>}
      <table className="device-table">
        <thead>
          <tr>
            <th>Tên thiết bị</th>
            <th>Khu vực</th>
            <th>Tình trạng</th>
            {/* <th>Trạng thái</th> */}
            <th>Mode</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentDevices.length > 0 ? (
            currentDevices.map((device) => (
              <tr key={device.id}>
                <td>
                  <span className="device-icon"></span>
                  {device.name}
                </td>
                <td>{device.area}</td> {/* Display area */}
                <td>{device.state}</td>
                {/* <td>{device.status}</td> */}
                <td>{device.mode}</td>
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
                        <button className="delete" onClick={() => handleDeleteDevice(device.id)}> {/* Pass backend deviceId */}
                          Xóa
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Không có thiết bị nào để hiển thị</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        {/* <span>SHOWING {indexOfFirstDevice + 1}-{Math.min(indexOfLastDevice, filteredDevices.length)} OF {filteredDevices.length} DATA</span> */}
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
        <div className="modal-overlay4">
          <div className="modal4">
            <h3>{modalMode === 'add' ? 'Thêm thiết bị' : 'Chỉnh sửa thiết bị'}</h3>
            <div className="modal-content4">
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
                type="number"
                name="area"
                value={newDevice.area}
                onChange={handleInputChange}
                placeholder="Nhập khu vực (số)"
              />
              <label>Tình trạng</label>
              <select
                name="status"
                value={newDevice.status}
                onChange={handleInputChange}
              >
                <option value="ON">ON</option>
                <option value="OFF">OFF</option>
              </select>
              <label>Trạng thái</label>
              <select
                name="state"
                value={newDevice.state}
                onChange={handleInputChange}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="BROKEN">BROKEN</option>
              </select>
              <label>Mode</label>
              <select
                name="mode"
                value={newDevice.mode}
                onChange={handleInputChange}
              >
                <option value="AUTO">AUTO</option>
                <option value="MANUAL">MANUAL</option>
              </select>
              <label>Bảo hành</label>
              <input
                type="text"
                name="warranty"
                value={newDevice.warranty}
                onChange={handleInputChange}
                placeholder="Nhập thông tin bảo hành"
              />
              <label>Ổ đĩa</label>
              <input
                type="text"
                name="drive"
                value={newDevice.drive}
                onChange={handleInputChange}
                placeholder="Nhập loại ổ đĩa"
              />
              <label>Điện áp đầu vào</label>
              <input
                type="number"
                name="inputVoltage"
                value={newDevice.inputVoltage}
                onChange={handleInputChange}
                placeholder="Nhập điện áp đầu vào (V)"
              />
              <label>Điện áp đầu ra</label>
              <input
                type="number"
                name="outputVoltage"
                value={newDevice.outputVoltage}
                onChange={handleInputChange}
                placeholder="Nhập điện áp đầu ra (V)"
              />
              <label>Tốc độ</label>
              <input
                type="number"
                name="speed"
                value={newDevice.speed}
                onChange={handleInputChange}
                placeholder="Nhập tốc độ"
              />
            </div>
            <div className="modal-actions4">
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