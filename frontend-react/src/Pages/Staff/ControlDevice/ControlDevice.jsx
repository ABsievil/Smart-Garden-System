import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { default as Switch } from '@mui/material/Switch';
import React, { useEffect, useState } from "react";
import { BsMoisture } from "react-icons/bs";
import { CiLight, CiTempHigh } from "react-icons/ci";
import { RiWaterPercentLine } from "react-icons/ri";
import { useLocation } from 'react-router-dom';
import Navbar from "../../../Components/NavBar/NavBar";
import api from './../../../api';
import './ControlDevice.css';

const ControlDevice = () => {
  const location = useLocation();
  const [areaId, setAreaId] = useState();
  
  useEffect(() => {
    // Kiểm tra URL hiện tại để xác định area
    const params = new URLSearchParams(location.search);
    const area = params.get("area");
    
    if (location.pathname === "/control-device") {
      if (area === "2") {
        setAreaId("2");
      } else {
        setAreaId("1");
      }
    }
  }, [location]);

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
        const response = await api.get(`/api/v1/record/getCurrentRecord/${areaId}`);
        
        if (response.data.status === "OK") {
          const sensorData = response.data.data;
          console.log("Sensor data:", sensorData);
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
  }, [areaId]);

  const sendDeviceState = async (deviceName, updatedData) => {
    if (!updatedData || updatedData[deviceName] === undefined) {
      console.error("updatedData không hợp lệ:", updatedData);
      return;
    }
    setData(updatedData);
    try {
      const response = await api.get(`/api/v1/device/controlStatus?deviceName=${deviceName}&status=${updatedData[deviceName]}&area=${areaId}`);
      
      if (response.data.status === "OK") {
        const res = response.data.data;
        console.log("Device state updated: ", res);
      }
      else {
        console.error("Error updating device state:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating device state:", error);
    }
  };

  // Toggle các thiết bị
  const toggleDevice = (deviceName) => {
    if (data.mode === "manual") {
      const updatedData = { ...data, [deviceName]: !data[deviceName] };
      sendDeviceState(deviceName, updatedData);
    }
  };
 
  const sendPumpSpeed = async (newPumpSpeed) => {
    try {
      const response = await api.get(`/api/v1/device/controlPumpSpeed?deviceName=Pump1&value=${newPumpSpeed}&area=${areaId}`);
      
      if (response.data.status === "OK") {
        console.log("Pump speed updated successfully:", response.data.data);
      } else {
        console.error("Error updating pump speed:", response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật tốc độ bơm:", error);
    }
  };
  
  

  const handlePumpSpeedChange = (event, newValue) => {
    if (data.mode === "manual") {
      setData((prevData) => ({ ...prevData, Pump1: newValue }));
  
      setTimeout(() => {
        sendPumpSpeed(newValue); // Gửi API sau 1s
      }, 1000);
    }
  };

  return (
    <div className="control-device-content">
      <div className="header">
    <h2>Dữ liệu thiết bị-Khu vực {areaId}</h2>
      <Navbar/>
      </div>
      <Box className='device-content' sx={{ width: "100%" }}>
      <div className="device-grid">
    <div className="device-card">
    <h3>TEMPERATURE</h3>
    <div className="content-grid">
    <CiTempHigh  className='icon1'/>
    <p>{data.temperature}°C</p> </div>
   
      <span >Fan
      <Switch className='toggle' checked={data.fan} onChange={() => toggleDevice("Fan1")} disabled={data.mode !== "manual"} />
      </span>
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
    <span> Led
    <Switch className='toggle' checked={data.led} onChange={() => toggleDevice("Led1")} disabled={data.mode !== "manual"} />
    </span>
    
  </div>
 

  <div className="device-card">
    <h3>SOIL MOISTURE</h3>
    <div className="content-grid">
    <BsMoisture className='icon1'/>
    <p>{data.soilMoisture}%</p>
    </div>
    <div className="pump-control">
      <span>Pump</span>
              <Slider
                value={data.pumpSpeed}
                onChange={handlePumpSpeedChange}
                aria-labelledby="pump-speed-slider"
                valueLabelDisplay="auto"
                step={10}
                marks
                min={0}
                max={100}
                disabled={data.mode !== "manual"}
              />
    </div>
  </div>
</div>
      

      {/* Chế độ Auto/Manual */}
      <div className="device-mode">
        <span>Auto
        <Switch 
          className='device-control' 
          checked={data.mode === "manual"} 
          onChange={() => {
            const updatedData = { ...data, mode: data.mode === "auto" ? "manual" : "auto" };
            sendDeviceState("mode", updatedData);
          }} 
        />
        Manual</span>
      </div>
      </Box>
    </div>
    
  );
};

export default ControlDevice;