import Box from '@mui/material/Box';
import React, { useEffect, useState } from "react";
import { BsMoisture } from "react-icons/bs";
import { CiLight, CiTempHigh } from "react-icons/ci";
import { RiWaterPercentLine } from "react-icons/ri";
import Navbar from "../../../Components/NavBar/NavBar";
import api from './../../../api'; // Import the API module
import './DeviceRecord.css';
import axios from 'axios'; // Thêm import axios

const DeviceRecord = () => {
  const [data, setData] = useState({
    temperature: 0,
    humidity: 0,
    light: 0,
    soilMoisture: 0,
    Fan1: false,
    Led1: false,
    Pump1: 50,
    mode: "manual",
  });
  const [gardens, setGardens] = useState([]);
  const [selectedGarden, setSelectedGarden] = useState(null);
  const [showGardenDropdown, setShowGardenDropdown] = useState(false);

  useEffect(() => {
    // Fetch garden/area data from API
    const fetchGardens = async () => {
      try {
        const response = await api.get('/api/v1/dashboard/areas');
        if (response.data.status === "OK") {
          const areas = response.data.data.map(area => ({
            id: area.area,
            name: area.name,
          }));
          setGardens(areas);
          if (areas.length > 0) {
            setSelectedGarden(areas[0]);
          }
        } else {
          console.error("Error fetching gardens:", response.data.message);
          // Fallback to mock data
          setGardens([
            { id: 1, name: 'Khu vực 1' },
            { id: 2, name: 'Khu vực 2' },
          ]);
          setSelectedGarden({ id: 1, name: 'Khu vực 1' });
        }
      } catch (error) {
        console.error("Error fetching gardens:", error);
        // Fallback to mock data
        setGardens([
          { id: 1, name: 'Khu vực 1' },
          { id: 2, name: 'Khu vực 2' },
        ]);
        setSelectedGarden({ id: 1, name: 'Khu vực 1' });
      }
    };

    fetchGardens();
  }, []);

  useEffect(() => {
    if (!selectedGarden) return;

    const areaId = selectedGarden.id;

    const fetchData = async () => {
      try {
        const response = await api.get(`/api/v1/record/getCurrentRecord/${areaId}`);
        if (response.data.status === "OK") {
          const sensorData = response.data.data;
          setData(prevData => ({
            ...prevData,
            temperature: sensorData.temperature || 0,
            humidity: sensorData.humidity || 0,
            light: sensorData.light || 0,
            soilMoisture: sensorData.soilMoisture || 0,
          }));
        } else {
          console.error("Error fetching sensor data:", response.data.message);
          // Fallback to mock data
          setData(prevData => ({
            ...prevData,
            temperature: areaId === 1 ? 32.50 : 30.00,
            humidity: areaId === 1 ? 85 : 90,
            light: areaId === 1 ? 60 : 55,
            soilMoisture: areaId === 1 ? 60 : 65,
          }));
        }
      } catch (error) {
        console.error("Error fetching sensor data:", error);
        // Fallback to mock data
        setData(prevData => ({
          ...prevData,
          temperature: areaId === 1 ? 32.50 : 30.00,
          humidity: areaId === 1 ? 85 : 90,
          light: areaId === 1 ? 60 : 55,
          soilMoisture: areaId === 1 ? 60 : 65,
        }));
      }
    };

    fetchData();

    // Poll data every 1 second
    const intervalId = setInterval(fetchData, 1000);
    return () => clearInterval(intervalId);
  }, [selectedGarden]);

  const handleGardenSelect = (garden) => {
    setSelectedGarden(garden);
    setShowGardenDropdown(false);
  };

  const toggleGardenDropdown = () => {
    setShowGardenDropdown(!showGardenDropdown);
  };

  const handleViewMore = async () => {
    // Kiểm tra xem đã chọn khu vực chưa
    if (!selectedGarden) {
      alert('Vui lòng chọn một khu vực để xem báo cáo.');
      return;
    }

    const areaId = selectedGarden.id;
    const areaName = selectedGarden.name;

    try {
      // Gọi API để lấy 50 bản ghi gần nhất cho khu vực đã chọn
      const response = await api.get(`/api/v1/record/getRecentRecords/${areaId}`);

      if (response.data.status === 'OK' && response.data.data && response.data.data.length > 0) {
        const reportData = response.data.data;
        // const selectedGardenName = selectedGarden ? selectedGarden.name : 'Tất cả khu vực'; // Không cần nữa vì đã lấy areaName

        // Lấy thời gian của bản ghi đầu tiên và cuối cùng
        const firstRecordTime = new Date(reportData[reportData.length - 1].datetime).toLocaleString();
        const lastRecordTime = new Date(reportData[0].datetime).toLocaleString();

        // Generate report content using fetched data
        const reportContent = `
          <h3>Báo cáo ${reportData.length} dữ liệu gần nhất cho ${areaName} (Khu vực ${areaId})</h3>
          <p>Thời gian: Từ ${firstRecordTime} đến ${lastRecordTime}</p>
          <table border="1" style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Nhiệt độ (°C)</th>
                <th>Độ ẩm không khí (%)</th>
                <th>Độ ẩm đất (%)</th>
                <th>Ánh sáng (Lux)</th>
                <!-- <th>Khu vực</th> Không cần hiển thị cột khu vực nữa vì đã lọc theo khu vực -->
              </tr>
            </thead>
            <tbody>
              ${reportData.map(record => `
                <tr>
                  <td>${new Date(record.datetime).toLocaleString()}</td>
                  <td>${record.temperature !== null ? record.temperature.toFixed(2) : 'N/A'}</td>
                  <td>${record.humidity !== null ? record.humidity.toFixed(0) : 'N/A'}</td>
                  <td>${record.soilMoisture !== null ? record.soilMoisture.toFixed(0) : 'N/A'}</td>
                  <td>${record.light !== null ? record.light.toFixed(0) : 'N/A'}</td>
                  <!-- <td>${record.area}</td> -->
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;

        // Open and print the report
        const reportWindow = window.open('', '_blank');
        reportWindow.document.write(`
          <html>
            <head>
              <title>Báo cáo dữ liệu gần nhất</title>
              <style>
                body { font-family: 'Roboto', sans-serif; padding: 20px; }
                h3 { color: #34772e; }
                p { font-size: 16px; color: #333; }
                table { margin-top: 20px; }
                th, td { padding: 8px; text-align: center; border: 1px solid #ddd; }
                th { background-color: #f0f8e7; }
              </style>
            </head>
            <body>
              ${reportContent}
            </body>
          </html>
        `);
        reportWindow.document.close();
        reportWindow.print();
      } else {
        alert(`Không có dữ liệu gần đây để hiển thị cho ${areaName} (Khu vực ${areaId}).`);
        console.log("Không có dữ liệu hoặc lỗi API:", response.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu báo cáo:", error);
      alert('Đã xảy ra lỗi khi tạo báo cáo. Vui lòng thử lại.');
    }
  };

  return (
    <div className="control-device-content">
      <div className="header">
        <h2>Dữ liệu thiết bị</h2>
        <div className="header-right">
          <div className="garden-dropdown">
            <button onClick={toggleGardenDropdown} className="garden-button">
              {selectedGarden ? 'Khu vực ' + selectedGarden.id : 'Chọn khu vực'} ▼
            </button>
            {showGardenDropdown && (
              <div className="garden-dropdown-menu">
                {gardens.map((garden) => (
                  <div
                    key={garden.id}
                    className="garden-dropdown-item"
                    onClick={() => handleGardenSelect(garden)}
                  >
                    Khu vực {garden.id}:{garden.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <Navbar />
      </div>
      {selectedGarden && (
        <Box className='device-content' sx={{ width: "100%" }}>
          <div className="device-grid">
            <div className="device-card">
              <h3>TEMPERATURE</h3>
              <div className="content-grid">
                <CiTempHigh className='icon1' />
                <p>{data.temperature}°C</p>
              </div>
            </div>

            <div className="device-card">
              <h3>HUMIDITY</h3>
              <div className="content-grid">
                <RiWaterPercentLine className='icon1' />
                <p>{data.humidity}%</p>
              </div>
            </div>

            <div className="device-card">
              <h3>LIGHT</h3>
              <div className="content-grid">
                <CiLight className='icon1' />
                <p>{data.light}%</p>
              </div>
            </div>

            <div className="device-card">
              <h3>SOIL MOISTURE</h3>
              <div className="content-grid">
                <BsMoisture className='icon1' />
                <p>{data.soilMoisture}%</p>
              </div>
            </div>
          </div>
          <div className="view-more-container">
            <button onClick={handleViewMore} className="view-more-button">
              XEM BÁO CÁO GẦN NHẤT
            </button>
          </div>
        </Box>
      )}
    </div>
  );
};

export default DeviceRecord;