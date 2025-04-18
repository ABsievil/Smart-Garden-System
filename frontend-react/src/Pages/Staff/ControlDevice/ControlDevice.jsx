import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { default as Switch } from '@mui/material/Switch';
import React, { useEffect, useState, useRef } from "react";
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
    Pump1: 0,
    mode: "manual", // manual hoặc auto
  });
  
  // Ref for debounce timeout
  const debounceTimeoutRef = useRef(null);
  // Ref to track if it's the initial load for Pump1 to avoid initial API call
  const isInitialPumpLoad = useRef(true);

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

  // Fetch initial mode and device statuses for the area when areaId is set
  useEffect(() => {
    const fetchInitialData = async () => {
      if (areaId) {
        // Fetch Mode
        try {
          const modeResponse = await api.get(`/api/v1/device/getModeByArea?area=${areaId}`);
          if (modeResponse.data.status === "OK" && modeResponse.data.data) {
            console.log("Initial mode for area", areaId, ":", modeResponse.data.data);
            setData(prevData => ({ ...prevData, mode: modeResponse.data.data.toLowerCase() }));
          } else {
             console.error("Error fetching initial mode:", modeResponse.data.message || "Mode not found");
          }
        } catch (error) {
          console.error("Error fetching initial mode:", error);
        }

        // Fetch Device Statuses
        try {
          const devicesResponse = await api.get(`/api/v1/device/getDevicesByArea?area=${areaId}`);
          if (devicesResponse.data.status === "OK" && devicesResponse.data.data) {
            const devices = devicesResponse.data.data;
            console.log("Initial devices for area", areaId, ":", devices);
            
            const fanStatus = devices.find(d => d.name?.toLowerCase() === 'fan1')?.status;
            const ledStatus = devices.find(d => d.name?.toLowerCase() === 'led1')?.status;
            const pumpSpeed = devices.find(d => d.name?.toLowerCase() === 'pump1')?.speed; // Get pump speed

            setData(prevData => ({
              ...prevData,
              // Only update if status/speed is found (not undefined)
              ...(fanStatus !== undefined && { Fan1: fanStatus }), 
              ...(ledStatus !== undefined && { Led1: ledStatus }),
              ...(pumpSpeed !== undefined && { Pump1: pumpSpeed }) // Update Pump1 state with fetched speed
            }));

          } else {
            console.error("Error fetching initial device statuses:", devicesResponse.data.message || "Devices not found");
          }
        } catch (error) {
          console.error("Error fetching initial device statuses:", error);
        }
      }
    };

    fetchInitialData();
  }, [areaId]);

  // useEffect for debouncing pump speed API call
  useEffect(() => {
    // Skip the very first render/load for Pump1
    if (isInitialPumpLoad.current) {
      isInitialPumpLoad.current = false;
      return;
    }
    
    // Clear any existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set a new timeout to send the API request after 400ms of inactivity
    debounceTimeoutRef.current = setTimeout(() => {
      if (data.mode === "manual" && areaId) { // Only send if in manual mode and areaId is set
        console.log(`[Debounced] Sending Pump1 speed: ${data.Pump1}`);
        sendPumpSpeed(data.Pump1);
      }
    }, 400); // Changed delay to 400ms

    // Cleanup function to clear timeout if component unmounts or areaId/mode changes
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [data.Pump1, data.mode, areaId]); // Rerun effect if Pump1 value, mode, or areaId changes

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

  const handleModeChange = async () => {
    if (!areaId) return; // Don't do anything if areaId isn't set

    const currentMode = data.mode;
    const newMode = currentMode === "auto" ? "MANUAL" : "AUTO"; // API expects uppercase

    try {
      const response = await api.put(`/api/v1/device/updateModeByArea?area=${areaId}&mode=${newMode}`);
      if (response.data.status === "OK") {
        console.log(`Mode for area ${areaId} updated to ${newMode}`);
        setData(prevData => ({ ...prevData, mode: newMode.toLowerCase() })); // Update local state after successful API call
      } else {
        console.error(`Error updating mode for area ${areaId}:`, response.data.message);
        // Optionally revert the switch visually or show an error message
      }
    } catch (error) {
      // Optionally revert the switch visually or show an error message
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
    // No need for setTimeout here anymore
    if (!areaId) {
      console.error("Cannot send pump speed, areaId is not set.");
      return;
    }
    console.log(`Sending pump speed update. Device: Pump1, Value: ${newPumpSpeed}, Area: ${areaId}`);
    try {
      const response = await api.get(`/api/v1/device/controlPumpSpeed?deviceName=Pump1&value=${newPumpSpeed}&area=${areaId}`);
      if (response.data.status === "OK") {
        console.log("Pump speed updated successfully:", response.data.data);
      } else {
        console.error("Error updating pump speed:", response.data.message);
      }
    } catch (error) {
         console.error("Error calling controlPumpSpeed API:", error);
    }
  };
  
  
  // Update state immediately, debounce effect handles API call
  const handlePumpSpeedChange = (event, newValue) => {
    if (data.mode === "manual") {
      setData((prevData) => ({ ...prevData, Pump1: newValue }));
      // Removed setTimeout and direct sendPumpSpeed call from here
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
      <Switch className='toggle' checked={!!data.Fan1} onChange={() => toggleDevice("Fan1")} disabled={data.mode !== "manual"} />
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
    <Switch className='toggle' checked={!!data.Led1} onChange={() => toggleDevice("Led1")} disabled={data.mode !== "manual"} />
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
                value={data.Pump1}
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
          onChange={handleModeChange}
          disabled={!areaId}
        />
        Manual</span>
      </div>
      </Box>
    </div>
    
  );
};

export default ControlDevice;