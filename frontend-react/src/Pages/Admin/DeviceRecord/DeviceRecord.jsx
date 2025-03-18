import Box from '@mui/material/Box';
import React, { useEffect, useState } from "react";
import { BsMoisture } from "react-icons/bs";
import { CiLight, CiTempHigh } from "react-icons/ci";
import { RiWaterPercentLine } from "react-icons/ri";
import api from './../../../api';
import './DeviceRecord.css';

const ControlDevice = () => {
  const [data, setData] = useState({
    // default data
    temperature: 0,
    humidity: 0,
    light: 0,
    soilMoisture: 0,
    Fan1: false,
    Led1: false,
    Pump1: 50,
    mode: "manual", // manual hoặc auto
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/v1/record/getCurrentRecord/2');
        
        if (response.data.status === "OK") {
          const sensorData = response.data.data;
          
          // Update sensor values into const [data, setData]
          setData(prevData => ({
            ...prevData,
            temperature: sensorData.temperature,
            humidity: sensorData.humidity,
            light: sensorData.light,
            soilMoisture: sensorData.soilMoisture
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    
    // Setup call fetch data every 1 seconds
    const intervalId = setInterval(fetchData, 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

 
 
  return (
    <div className="control-device-content">
    <h2> Dữ liệu thiết bị </h2>

      <Box className='device-content' sx={{ width: "100%" }}>
      <div className="device-grid">
    <div className="device-card">
    <h3>TEMPERATURE</h3>
    <div className="content-grid">
    <CiTempHigh  className='icon1'/>
    <p>{data.temperature}°C</p> </div>
  </div>

  <div className="device-card">
    <h3>HUMIDITY</h3>
    <div className="content-grid">
    <RiWaterPercentLine className='icon1'/>
    <p>{data.humidity}%</p>
    </div>
  </div>

  <div className="device-card">
    <h3>LIGHT</h3>
    <div className="content-grid">
    <CiLight className='icon1'/>
    <p>{data.light} %</p> 
    </div>
    
  </div>
 

  <div className="device-card">
    <h3>SOIL MOISTURE</h3>
    <div className="content-grid">
    <BsMoisture className='icon1'/>
    <p>{data.soilMoisture}%</p>
    </div>
  </div>
</div>
      

   
   
      </Box>
    </div>
    
  );
};

export default ControlDevice;
