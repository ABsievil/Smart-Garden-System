import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { default as Switch } from '@mui/material/Switch';
import React, { useEffect, useState } from "react";
import { BsMoisture } from "react-icons/bs";
import { CiLight, CiTempHigh } from "react-icons/ci";
import { RiWaterPercentLine } from "react-icons/ri";
import Navbar from "../../../Components/NavBar/NavBar";
import api from './../../../api';
import './ControlDevice.css';

const ControlDevice = () => {
  const [areaId, setAreaId] = useState();
  
  useEffect(() => {
    // Fetch user profile to determine areaId
    const fetchUserProfile = async () => {
      try {
        // Assume username is stored in localStorage
        const username = localStorage.getItem('username'); 
        if (!username) {
          console.error("Username not found!");
          // Handle error, maybe redirect to login or show a message
          return; 
        }

        const response = await api.post('/api/v1/users/profile', { username });
        
        if (response.data.status === "OK" && response.data.data?.information?.jobArea) {
          const jobArea = response.data.data.information.jobArea;
          console.log("User jobArea:", jobArea);
          setAreaId(jobArea.toString()); // Ensure areaId is a string if needed later
        } else {
          console.error("Error fetching user profile or jobArea missing:", response.data.message || "No jobArea found");
          // Handle error appropriately
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Handle API call error
      }
    };

    fetchUserProfile();
    
    // No dependencies needed if username comes from localStorage and doesn't change reactively
  }, []); 

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
      // Only fetch if areaId is set
      if (areaId) { 
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
      }
    };

    // Only run the interval if areaId is set
    let intervalId = null;
    if (areaId) {
      fetchData(); // Fetch immediately when areaId is available
      // Setup call fetch data every 1 seconds
      intervalId = setInterval(fetchData, 1000);
    }
    
    // Clean up interval on component unmount or when areaId changes
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [areaId]); // Depend on areaId

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