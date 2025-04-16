import Box from '@mui/material/Box';
import React, { useEffect, useState } from "react";
import { BsMoisture } from "react-icons/bs";
import { CiLight, CiTempHigh } from "react-icons/ci";
import { RiWaterPercentLine } from "react-icons/ri";
import Navbar from "../../../Components/NavBar/NavBar";
import './DeviceRecord.css';

const ControlDevice = () => {
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
    // Mock garden data for area selection
    const fetchGardens = async () => {
      try {
        // const response = await api.get('/api/v1/gardens');
        // if (response.data.status === "OK") {
        //   setGardens(response.data.data);
        //   if (response.data.data.length > 0) {
        //     setSelectedGarden(response.data.data[0]);
        //   }
        // } else {
        //   console.error("Error fetching gardens:", response.data.message);
          setGardens([
            { id: 1, name: 'Khu vực 1' },
            { id: 2, name: 'Khu vực 2' },
          ]);
          setSelectedGarden({ id: 1, name: 'Khu vực 1' });
        // }
      } catch (error) {
        console.error("Error fetching gardens:", error);
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
        // const response = await api.get(`/api/v1/record/getCurrentRecord/${areaId}`);
        // if (response.data.status === "OK") {
        //   const sensorData = response.data.data;
        //   setData(prevData => ({
        //     ...prevData,
        //     temperature: sensorData.temperature,
        //     humidity: sensorData.humidity,
        //     light: sensorData.light,
        //     soilMoisture: sensorData.soilMoisture
        //   }));
        // }
        // Mock data based on area
        setData(prevData => ({
          ...prevData,
          temperature: areaId === 1 ? 32.50 : 30.00, // Khu vực 1: 32.50°C, Khu vực 2: 30.00°C
          humidity: areaId === 1 ? 85 : 90, // Khu vực 1: 85%, Khu vực 2: 90%
          light: areaId === 1 ? 60 : 55, // Khu vực 1: 60 Lux, Khu vực 2: 55 Lux
          soilMoisture: areaId === 1 ? 60 : 65, // Khu vực 1: 60%, Khu vực 2: 65%
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
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

  const handleViewMore = () => {
    const areaId = selectedGarden.id;
    const now = new Date('2025-04-15T12:00:00'); // Current time for mock data
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000); // 3 hours ago

    // Generate mock data for the last 3 hours (every 15 minutes)
    const reportData = [];
    for (let time = threeHoursAgo; time <= now; time.setMinutes(time.getMinutes() + 15)) {
      reportData.push({
        timestamp: new Date(time).toISOString(),
        temperature: areaId === 1
          ? (32 + Math.random() * 1).toFixed(2) // Khu vực 1: around 32°C
          : (29 + Math.random() * 1).toFixed(2), // Khu vực 2: around 29°C
        humidity: areaId === 1
          ? Math.floor(83 + Math.random() * 4) // Khu vực 1: around 85%
          : Math.floor(88 + Math.random() * 4), // Khu vực 2: around 90%
        light: areaId === 1
          ? Math.floor(58 + Math.random() * 4) // Khu vực 1: around 60 Lux
          : Math.floor(53 + Math.random() * 4), // Khu vực 2: around 55 Lux
        soilMoisture: areaId === 1
          ? Math.floor(58 + Math.random() * 4) // Khu vực 1: around 60%
          : Math.floor(63 + Math.random() * 4), // Khu vực 2: around 65%
      });
    }

    // Generate report
    const reportContent = `
      <h3>Báo cáo dữ liệu 3 giờ gần nhất</h3>
      <p>Khu vực: ${selectedGarden.name}</p>
      <p>Thời gian: Từ ${threeHoursAgo.toLocaleString()} đến ${now.toLocaleString()}</p>
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Thời gian</th>
            <th>Nhiệt độ (°C)</th>
            <th>Độ ẩm không khí (%)</th>
            <th>Độ ẩm đất (%)</th>
            <th>Ánh sáng (Lux)</th>
          </tr>
        </thead>
        <tbody>
          ${reportData.map(record => `
            <tr>
              <td>${new Date(record.timestamp).toLocaleString()}</td>
              <td>${record.temperature}</td>
              <td>${record.humidity}</td>
              <td>${record.soilMoisture}</td>
              <td>${record.light}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    const reportWindow = window.open('', '_blank');
    reportWindow.document.write(`
      <html>
        <head>
          <title>Báo cáo dữ liệu 3 giờ</title>
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
  };

  return (
    <div className="control-device-content">
      <div className="header">
        <h2>Dữ liệu thiết bị</h2>
        <div className="header-right">
          <div className="garden-dropdown">
            <button onClick={toggleGardenDropdown} className="garden-button">
              {selectedGarden ? selectedGarden.name : 'Chọn khu vực'} ▼
            </button>
            {showGardenDropdown && (
              <div className="garden-dropdown-menu">
                {gardens.map((garden) => (
                  <div
                    key={garden.id}
                    className="garden-dropdown-item"
                    onClick={() => handleGardenSelect(garden)}
                  >
                    {garden.name}
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
                <p>{data.light} Lux</p>
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
              VIEW MORE
            </button>
          </div>
        </Box>
      )}
    </div>
  );
};

export default ControlDevice;