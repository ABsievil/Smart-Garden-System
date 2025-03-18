import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { default as Switch } from '@mui/material/Switch';
import React, { useEffect, useState } from "react";
import { BsMoisture } from "react-icons/bs";
import { CiLight, CiTempHigh } from "react-icons/ci";
import { RiWaterPercentLine } from "react-icons/ri";
import api from './../../../api';
import './ControlDevice.css';

const ControlDevice = () => {
  const [data, setData] = useState({
    // default data
    temperature: 0,
    humidity: 0,
    light: 0,
    soilMoisture: 0,
    fan: false,
    led: false,
    pump: false,
    pumpSpeed: 50,
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

  const sendDeviceState = async (updatedData) => {
    setData(updatedData);
    try {
      // await fetch("YOUR_API_ENDPOINT", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(updatedData),
      // });
    } catch (error) {
      console.error("Error updating device state:", error);
    }
  };

  // Toggle các thiết bị
  const toggleDevice = (device) => {
    if (data.mode === "manual") {
      const updatedData = { ...data, [device]: !data[device] };
      sendDeviceState(updatedData);
    }
  };

  const handlePumpSpeedChange = (event, newValue) => {
    if (data.mode === "manual") {
      const updatedData = { ...data, pumpSpeed: newValue };
      sendDeviceState(updatedData);
    }
  };

  return (
    <div className="control-device-content">
    <h2> Dữ liệu thiết bị </h2>

      <Box sx={{ width: "100%" }}>
      <div className="device-grid">
  <div className="device-card">
    <h3>TEMPERATURE</h3>
    <div className="content-grid">
    <CiTempHigh  className='icon1'/>
    <p>{data.temperature}°C</p> </div>
   
      <span >Fan
      <Switch className='toggle' checked={data.fan} onChange={() => toggleDevice("fan")} disabled={data.mode !== "manual"} />
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
    <p>{data.light} Lux</p> 
    </div>
    <span> Led
    <Switch className='toggle' checked={data.led} onChange={() => toggleDevice("led")} disabled={data.mode !== "manual"} />
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
      <span>Speed</span>
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
        <Switch className='device-control' checked={data.mode === "manual"} onChange={() => sendDeviceState({ ...data, mode: data.mode === "auto" ? "manual" : "auto" })} />
        Manual</span>
      </div>
      </Box>
    </div>
    
  );
};

export default ControlDevice;
