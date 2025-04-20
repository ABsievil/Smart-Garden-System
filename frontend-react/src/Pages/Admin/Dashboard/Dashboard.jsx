import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import React, { useEffect, useRef, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { FaExclamationTriangle, FaLeaf, FaMicrochip, FaPrint, FaUsers } from 'react-icons/fa';
import Navbar from '../../../Components/NavBar/NavBar';
import api from './../../../api'; // Import the API module
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [lineChartData, setLineChartData] = useState(null);
  const [barChartData, setBarChartData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [reports, setReports] = useState([]);
  const [gardens, setGardens] = useState([]);
  const [selectedGarden, setSelectedGarden] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(5); // 5 rows per page
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [monthFilter, setMonthFilter] = useState('Tháng'); // Default month filter
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showGardenDropdown, setShowGardenDropdown] = useState(false);
  const printRef = useRef(); // Ref for printing

  const fetchReports = async () => {
    try {
      const response = await api.get('/api/v1/dashboard/reports');
      if (response.data.status === 'OK') {
        setReports(response.data.data);
      } else {
        console.error('Lỗi khi lấy báo cáo:', response.data.message);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API báo cáo:', error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [monthFilter]);

  useEffect(() => {
    // Fetch the list of gardens
    const fetchGardens = async () => {
      try {
        const response = await api.get('/api/v1/dashboard/areas');
        if (response.data.status === 'OK') {
          const uniqueGardens = response.data.data.reduce((acc, area) => {
            if (!acc.find(g => g.id === area.area)) {
              acc.push({ id: area.area, name: area.name });
            }
            return acc;
          }, []);
          setGardens(uniqueGardens);
          if (uniqueGardens.length > 0) {
            setSelectedGarden(uniqueGardens[0]);
          }
        } else {
          console.error('Lỗi khi lấy danh sách khu vực:', response.data.message);
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

    // Utility function to generate dates for the last N days
    const getLastNDays = (n) => {
      const dates = [];
      const today = new Date('2025-04-15'); // Current date as specified
      for (let i = n - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
        dates.push(formattedDate);
      }
      return dates;
    };

    // Utility function to get day names for the last 7 days in Vietnamese
    const getLast7DaysWithDayNames = () => {
      const days = [];
      const today = new Date('2025-04-15');
      const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dayIndex = date.getDay();
        days.push(dayNames[dayIndex]);
      }
      return days;
    };

    // Utility function to generate mock data for a given length
    const generateMockData = (length, min, max) => {
      return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
    };

    const fetchSummaryData = async () => {
      try {
        const response = await api.get('/api/v1/dashboard/summary');
        if (response.data.status === "OK") {
          setSummaryData({
            totalPlants: response.data.data.plants,
            totalTasks: response.data.data.staff,
            totalWarnings: response.data.data.events,
            totalSensors: response.data.data.devices,
          });
        } else {
          console.error("Error fetching summary data:", response.data.message);
          // Fallback to mock data
          setSummaryData(
            areaId === 1
              ? {
                  totalPlants: 20,
                  totalTasks: 5,
                  totalWarnings: 40,
                  totalSensors: 3,
                }
              : {
                  totalPlants: 25,
                  totalTasks: 8,
                  totalWarnings: 30,
                  totalSensors: 4,
                }
          );
        }
      } catch (error) {
        console.error("Error fetching summary data:", error);
        // Fallback to mock data
        setSummaryData(
          areaId === 1
            ? {
                totalPlants: 20,
                totalTasks: 5,
                totalWarnings: 40,
                totalSensors: 3,
              }
            : {
                totalPlants: 25,
                totalTasks: 8,
                totalWarnings: 30,
                totalSensors: 4,
              }
        );
      }
    };

    const fetchLineChartData = async () => {
      try {
        const response = await api.get(`/api/v1/dashboard/temperature/${areaId}`);
        if (response.data.status === "OK") {
          const temperatureData = response.data.data;
          const sampledDates = temperatureData.dates.map(day => `${day}/04`); // Assuming April 2025
          setLineChartData({
            labels: sampledDates,
            datasets: [
              {
                label: 'Nhiệt độ tháng trước',
                data: temperatureData.lastMonth,
                borderColor: '#F4A261',
                backgroundColor: 'rgba(244, 162, 97, 0.2)',
                fill: true,
              },
              {
                label: 'Nhiệt độ tháng này',
                data: temperatureData.thisMonth,
                borderColor: '#FF6F61',
                backgroundColor: 'rgba(255, 111, 97, 0.2)',
                fill: true,
              },
            ],
          });
        } else {
          console.error("Error fetching temperature data:", response.data.message);
          // Fallback to mock data
          const allDates = getLastNDays(30);
          const sampledDates = allDates.filter((_, index) => index % 5 === 0 || index === allDates.length - 1);
          setLineChartData({
            labels: sampledDates,
            datasets: [
              {
                label: 'Nhiệt độ 30 ngày trước đó',
                data: areaId === 1
                  ? generateMockData(sampledDates.length, 60, 70)
                  : generateMockData(sampledDates.length, 55, 65),
                borderColor: '#F4A261',
                backgroundColor: 'rgba(244, 162, 97, 0.2)',
                fill: true,
              },
              {
                label: 'Nhiệt độ 30 ngày gần nhất',
                data: areaId === 1
                  ? generateMockData(sampledDates.length, 30, 35)
                  : generateMockData(sampledDates.length, 28, 33),
                borderColor: '#FF6F61',
                backgroundColor: 'rgba(255, 111, 97, 0.2)',
                fill: true,
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching temperature data:", error);
        // Fallback to mock data
        const allDates = getLastNDays(30);
        const sampledDates = allDates.filter((_, index) => index % 5 === 0 || index === allDates.length - 1);
        setLineChartData({
          labels: sampledDates,
          datasets: [
            {
              label: 'Nhiệt độ 30 ngày trước đó',
              data: areaId === 1
                ? generateMockData(sampledDates.length, 60, 70)
                : generateMockData(sampledDates.length, 55, 65),
              borderColor: '#F4A261',
              backgroundColor: 'rgba(244, 162, 97, 0.2)',
              fill: true,
            },
            {
              label: 'Nhiệt độ 30 ngày gần nhất',
              data: areaId === 1
                ? generateMockData(sampledDates.length, 30, 35)
                : generateMockData(sampledDates.length, 28, 33),
              borderColor: '#FF6F61',
              backgroundColor: 'rgba(255, 111, 97, 0.2)',
              fill: true,
            },
          ],
        });
      }
    };

    const fetchBarChartData = async () => {
      try {
        const response = await api.get(`/api/v1/dashboard/humidity/${areaId}`);
        if (response.data.status === "OK") {
          const humidityData = response.data.data;
          setBarChartData({
            labels: humidityData.daysOfWeek,
            datasets: [
              {
                label: 'Độ ẩm đất',
                data: humidityData.soilMoisture,
                backgroundColor: '#FF6F61',
              },
              {
                label: 'Độ ẩm không khí',
                data: humidityData.airHumidity,
                backgroundColor: '#F4A261',
              },
            ],
          });
        } else {
          console.error("Error fetching humidity data:", response.data.message);
          // Fallback to mock data
          const labels = getLast7DaysWithDayNames();
          setBarChartData({
            labels,
            datasets: [
              {
                label: 'Độ ẩm đất',
                data: areaId === 1
                  ? generateMockData(7, 40, 70)
                  : generateMockData(7, 50, 80),
                backgroundColor: '#FF6F61',
              },
              {
                label: 'Độ ẩm không khí',
                data: areaId === 1
                  ? generateMockData(7, 10, 30)
                  : generateMockData(7, 15, 35),
                backgroundColor: '#F4A261',
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching humidity data:", error);
        // Fallback to mock data
        const labels = getLast7DaysWithDayNames();
        setBarChartData({
          labels,
          datasets: [
            {
              label: 'Độ ẩm đất',
              data: areaId === 1
                ? generateMockData(7, 40, 70)
                : generateMockData(7, 50, 80),
              backgroundColor: '#FF6F61',
            },
            {
              label: 'Độ ẩm không khí',
              data: areaId === 1
                ? generateMockData(7, 10, 30)
                : generateMockData(7, 15, 35),
              backgroundColor: '#F4A261',
            },
          ],
        });
      }
    };

    const fetchTableData = async () => {
      try {
        // Use mock data directly, no API call
        setTableData(
          areaId === 1
            ? [
                { id: 1, name: 'Bộ đo thông tin 1', temp: 30, airHumidity: 73, soilHumidity: 80, light: 8000, month: 'Tháng 1' },
                { id: 2, name: 'Bộ đo thông tin 2', temp: 31, airHumidity: 70, soilHumidity: 78, light: 8200, month: 'Tháng 2' },
                { id: 3, name: 'Bộ đo thông tin 3', temp: 29, airHumidity: 75, soilHumidity: 82, light: 7900, month: 'Tháng 3' },
                { id: 4, name: 'Bộ đo thông tin 4', temp: 32, airHumidity: 72, soilHumidity: 79, light: 8100, month: 'Tháng 4' },
                { id: 5, name: 'Bộ đo thông tin 5', temp: 30, airHumidity: 74, soilHumidity: 81, light: 8050, month: 'Tháng 5' },
                { id: 6, name: 'Bộ đo thông tin 6', temp: 28, airHumidity: 76, soilHumidity: 83, light: 7800, month: 'Tháng 6' },
                { id: 7, name: 'Bộ đo thông tin 7', temp: 33, airHumidity: 71, soilHumidity: 77, light: 8300, month: 'Tháng 7' },
                { id: 8, name: 'Bộ đo thông tin 8', temp: 31, airHumidity: 73, soilHumidity: 80, light: 8000, month: 'Tháng 8' },
                { id: 9, name: 'Bộ đo thông tin 9', temp: 29, airHumidity: 75, soilHumidity: 82, light: 7900, month: 'Tháng 9' },
                { id: 10, name: 'Bộ đo thông tin 10', temp: 32, airHumidity: 72, soilHumidity: 79, light: 8100, month: 'Tháng 10' },
              ]
            : [
                { id: 11, name: 'Bộ đo thông tin 11', temp: 28, airHumidity: 78, soilHumidity: 85, light: 7500, month: 'Tháng 1' },
                { id: 12, name: 'Bộ đo thông tin 12', temp: 29, airHumidity: 76, soilHumidity: 83, light: 7600, month: 'Tháng 2' },
                { id: 13, name: 'Bộ đo thông tin 13', temp: 27, airHumidity: 80, soilHumidity: 87, light: 7400, month: 'Tháng 3' },
                { id: 14, name: 'Bộ đo thông tin 14', temp: 30, airHumidity: 77, soilHumidity: 84, light: 7550, month: 'Tháng 4' },
                { id: 15, name: 'Bộ đo thông tin 15', temp: 28, airHumidity: 79, soilHumidity: 86, light: 7450, month: 'Tháng 5' },
                { id: 16, name: 'Bộ đo thông tin 16', temp: 26, airHumidity: 81, soilHumidity: 88, light: 7300, month: 'Tháng 6' },
                { id: 17, name: 'Bộ đo thông tin 17', temp: 31, airHumidity: 75, soilHumidity: 82, light: 7700, month: 'Tháng 7' },
                { id: 18, name: 'Bộ đo thông tin 18', temp: 29, airHumidity: 78, soilHumidity: 85, light: 7500, month: 'Tháng 8' },
                { id: 19, name: 'Bộ đo thông tin 19', temp: 27, airHumidity: 80, soilHumidity: 87, light: 7400, month: 'Tháng 9' },
                { id: 20, name: 'Bộ đo thông tin 20', temp: 30, airHumidity: 77, soilHumidity: 84, light: 7550, month: 'Tháng 10' },
              ]
        );
      } catch (error) {
        console.error("Error setting table data:", error);
        // Fallback to mock data
        setTableData(
          areaId === 1
            ? [
                { id: 1, name: 'Bộ đo thông tin 1', temp: 30, airHumidity: 73, soilHumidity: 80, light: 8000, month: 'Tháng 1' },
                { id: 2, name: 'Bộ đo thông tin 2', temp: 31, airHumidity: 70, soilHumidity: 78, light: 8200, month: 'Tháng 2' },
                { id: 3, name: 'Bộ đo thông tin 3', temp: 29, airHumidity: 75, soilHumidity: 82, light: 7900, month: 'Tháng 3' },
                { id: 4, name: 'Bộ đo thông tin 4', temp: 32, airHumidity: 72, soilHumidity: 79, light: 8100, month: 'Tháng 4' },
                { id: 5, name: 'Bộ đo thông tin 5', temp: 30, airHumidity: 74, soilHumidity: 81, light: 8050, month: 'Tháng 5' },
                { id: 6, name: 'Bộ đo thông tin 6', temp: 28, airHumidity: 76, soilHumidity: 83, light: 7800, month: 'Tháng 6' },
                { id: 7, name: 'Bộ đo thông tin 7', temp: 33, airHumidity: 71, soilHumidity: 77, light: 8300, month: 'Tháng 7' },
                { id: 8, name: 'Bộ đo thông tin 8', temp: 31, airHumidity: 73, soilHumidity: 80, light: 8000, month: 'Tháng 8' },
                { id: 9, name: 'Bộ đo thông tin 9', temp: 29, airHumidity: 75, soilHumidity: 82, light: 7900, month: 'Tháng 9' },
                { id: 10, name: 'Bộ đo thông tin 10', temp: 32, airHumidity: 72, soilHumidity: 79, light: 8100, month: 'Tháng 10' },
              ]
            : [
                { id: 11, name: 'Bộ đo thông tin 11', temp: 28, airHumidity: 78, soilHumidity: 85, light: 7500, month: 'Tháng 1' },
                { id: 12, name: 'Bộ đo thông tin 12', temp: 29, airHumidity: 76, soilHumidity: 83, light: 7600, month: 'Tháng 2' },
                { id: 13, name: 'Bộ đo thông tin 13', temp: 27, airHumidity: 80, soilHumidity: 87, light: 7400, month: 'Tháng 3' },
                { id: 14, name: 'Bộ đo thông tin 14', temp: 30, airHumidity: 77, soilHumidity: 84, light: 7550, month: 'Tháng 4' },
                { id: 15, name: 'Bộ đo thông tin 15', temp: 28, airHumidity: 79, soilHumidity: 86, light: 7450, month: 'Tháng 5' },
                { id: 16, name: 'Bộ đo thông tin 16', temp: 26, airHumidity: 81, soilHumidity: 88, light: 7300, month: 'Tháng 6' },
                { id: 17, name: 'Bộ đo thông tin 17', temp: 31, airHumidity: 75, soilHumidity: 82, light: 7700, month: 'Tháng 7' },
                { id: 18, name: 'Bộ đo thông tin 18', temp: 29, airHumidity: 78, soilHumidity: 85, light: 7500, month: 'Tháng 8' },
                { id: 19, name: 'Bộ đo thông tin 19', temp: 27, airHumidity: 80, soilHumidity: 87, light: 7400, month: 'Tháng 9' },
                { id: 20, name: 'Bộ đo thông tin 20', temp: 30, airHumidity: 77, soilHumidity: 84, light: 7550, month: 'Tháng 10' },
              ]
        );
      }
    };

    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchSummaryData(),
          fetchLineChartData(),
          fetchBarChartData(),
          fetchTableData(),
        ]);
      } catch (error) {
        setError("Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [selectedGarden, monthFilter]);

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!summaryData || !lineChartData || !barChartData || !tableData || !selectedGarden) {
    return <div className="error">Không có dữ liệu để hiển thị.</div>;
  }

  const handleGardenSelect = (garden) => {
    setSelectedGarden(garden);
    setShowGardenDropdown(false);
  };

  const toggleGardenDropdown = () => {
    setShowGardenDropdown(!showGardenDropdown);
  };

  // Handle print functionality with detailed data
  const handlePrint = async (row) => {
    const areaId = selectedGarden.id;
    const today = new Date('2025-04-15');
    let startDate, endDate, periodLabel;

    if (monthFilter === 'Tháng') {
      endDate = today.toISOString().split('T')[0]; // 2025-04-15
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 30);
      startDate = startDate.toISOString().split('T')[0]; // 2025-03-16
      periodLabel = 'Tháng (30 ngày gần nhất)';
    } else {
      endDate = today.toISOString().split('T')[0]; // 2025-04-15
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 90);
      startDate = startDate.toISOString().split('T')[0]; // 2025-01-16
      periodLabel = 'Quý (90 ngày gần nhất)';
    }

    let detailedData = [];
    try {
      // Placeholder for a new endpoint to fetch detailed historical data
      // const response = await api.get(`/api/v1/record/getHistoricalRecords/${areaId}`, {
      //   params: {
      //     deviceId: row.id,
      //     startDate,
      //     endDate,
      //   },
      // });
      // if (response.data.status === "OK") {
      //   detailedData = response.data.data;
      // } else {
      //   console.error("Error fetching detailed data:", response.data.message);
      // }
      // Fallback to mock data since no endpoint exists
      detailedData = Array.from({ length: monthFilter === 'Tháng' ? 30 : 90 }, (_, index) => ({
        timestamp: new Date(today.getTime() - (index * 24 * 60 * 60 * 1000)).toISOString(),
        temp: areaId === 1
          ? Math.floor(Math.random() * (35 - 28 + 1)) + 28
          : Math.floor(Math.random() * (33 - 26 + 1)) + 26,
        airHumidity: areaId === 1
          ? Math.floor(Math.random() * (80 - 70 + 1)) + 70
          : Math.floor(Math.random() * (85 - 75 + 1)) + 75,
        soilHumidity: areaId === 1
          ? Math.floor(Math.random() * (85 - 75 + 1)) + 75
          : Math.floor(Math.random() * (90 - 80 + 1)) + 80,
        light: areaId === 1
          ? Math.floor(Math.random() * (8500 - 7500 + 1)) + 7500
          : Math.floor(Math.random() * (8000 - 7000 + 1)) + 7000,
      }));
    } catch (error) {
      console.error("Error fetching detailed data:", error);
      // Fallback to mock data
      detailedData = Array.from({ length: monthFilter === 'Tháng' ? 30 : 90 }, (_, index) => ({
        timestamp: new Date(today.getTime() - (index * 24 * 60 * 60 * 1000)).toISOString(),
        temp: areaId === 1
          ? Math.floor(Math.random() * (35 - 28 + 1)) + 28
          : Math.floor(Math.random() * (33 - 26 + 1)) + 26,
        airHumidity: areaId === 1
          ? Math.floor(Math.random() * (80 - 70 + 1)) + 70
          : Math.floor(Math.random() * (85 - 75 + 1)) + 75,
        soilHumidity: areaId === 1
          ? Math.floor(Math.random() * (85 - 75 + 1)) + 75
          : Math.floor(Math.random() * (90 - 80 + 1)) + 80,
        light: areaId === 1
          ? Math.floor(Math.random() * (8500 - 7500 + 1)) + 7500
          : Math.floor(Math.random() * (8000 - 7000 + 1)) + 7000,
      }));
    }

    // Generate detailed report
    const printContent = `
      <h3>Báo cáo chi tiết: ${row.name} (${periodLabel})</h3>
      <p>Khu vực: ${selectedGarden.name}</p>
      <p>Thời gian: Từ ${startDate} đến ${endDate}</p>
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Thời gian</th>
            <th>Nhiệt độ (°C)</th>
            <th>Độ ẩm không khí (%)</th>
            <th>Độ ẩm đất (%)</th>
            <th>Ánh sáng (lux)</th>
          </tr>
        </thead>
        <tbody>
          ${detailedData.map(record => `
            <tr>
              <td>${new Date(record.timestamp).toLocaleString()}</td>
              <td>${record.temp}</td>
              <td>${record.airHumidity}</td>
              <td>${record.soilHumidity}</td>
              <td>${record.light}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>In báo cáo chi tiết</title>
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
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Handle month filter change
  const handleMonthChange = (event) => {
    setMonthFilter(event.target.value);
    if (event.target.value !== 'Tháng') {
      setSortField('month');
      setSortOrder('asc');
    } else {
      setSortField(null);
      setSortOrder('asc');
    }
    setShowSortDropdown(false);
  };

  // Handle sort button click
  const handleSortClick = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setShowSortDropdown(!showSortDropdown);
  };

  // Sort the table data
  const sortedData = [...tableData].sort((a, b) => {
    if (!sortField) return 0;
    const valueA = a[sortField];
    const valueB = b[sortField];
    if (sortOrder === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(reports.length / pageSize);
  const paginatedData = reports.slice(page * pageSize, (page + 1) * pageSize);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="dashboard">
      <div className="header">
        <h6>Trang Chủ</h6>
        <div className="header-right">
          <div className="garden-dropdown">
            <button onClick={toggleGardenDropdown} className="garden-button">
              {selectedGarden ? "Khu vực " + selectedGarden.id : 'Chọn khu vực'} ▼
            </button>
            {showGardenDropdown && (
              <div className="garden-dropdown-menu">
                {gardens.map((garden) => (
                  <div
                    key={garden.id}
                    className="garden-dropdown-item"
                    onClick={() => handleGardenSelect(garden)}
                  >
                    Khu vực {garden.id} - {garden.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <Navbar className="navbar"/>
      </div>
      {/* Phần Tổng quan */}
      <div className="summary-cards">
        <div className="card">
          <div className="icon3 plants-icon">
            <FaLeaf />
          </div>
          <div>
            <h4>Plants</h4>
            <h5>{summaryData.totalPlants}</h5>
          </div>
        </div>
        <div className="card">
          <div className="icon3 tasks-icon">
            <FaUsers />
          </div>
          <div>
            <h4>Staff</h4>
            <h5>{summaryData.totalTasks}</h5>
          </div>
        </div>
        <div className="card">
          <div className="icon3 warnings-icon">
            <FaExclamationTriangle />
          </div>
          <div>
            <h4>Events</h4>
            <h5>{summaryData.totalWarnings}</h5>
          </div>
        </div>
        <div className="card">
          <div className="icon3 sensors-icon">
            <FaMicrochip />
          </div>
          <div>
            <h4>Devices</h4>
            <h5>{summaryData.totalSensors}</h5>
          </div>
        </div>
      </div>

      {/* Biểu đồ đường - Nhiệt độ trung bình */}
      <div className="chart-container">
        <h4>Nhiệt độ trung bình</h4>
        <Line data={lineChartData} options={{ responsive: true }} />
      </div>

      {/* Biểu đồ cột - Tình trạng */}
      <div className="chart-container">
        <h4>Tình trạng</h4>
        <Bar data={barChartData} options={{ responsive: true }} />
      </div>

      {/* Bảng thông tin */}
      <div className="table-container" ref={printRef}>
        <div className="table-header">
          <h4>Thống kê (Trung bình)</h4>
          {/* <div className="custom-select-wrapper">
            <select
              value={monthFilter}
              onChange={handleMonthChange}
              className="custom-select"
            >
              <option value="Tháng">Tháng</option>
              <option value="Năm">Quý</option>
            </select>
          </div> */}
        </div>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Nhiệt độ</th>
              <th>Độ ẩm không khí</th>
              <th>Độ ẩm đất</th>
              <th>Ánh sáng</th>
              {/* <th>In báo cáo</th> */}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((report, index) => (
              <tr key={index}>
                <td>{report.reportName}</td>
                <td>{report.temperature.toFixed(1)}</td>
                <td>{report.humidity.toFixed(1)}</td>
                <td>{report.soil_moisture.toFixed(1)}</td>
                <td>{report.light.toFixed(1)}</td>
                {/* <td>
                  <button
                    className="print-button"
                    onClick={() => handlePrint(report)}
                  >
                    <FaPrint />
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination1">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
            className="pagination-button1"
          >
            ◄
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index)}
              className={`pagination-button1 ${page === index ? 'active' : ''}`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages - 1}
            className="pagination-button1"
          >
            ►
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;