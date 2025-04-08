import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import React, { useEffect, useRef, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { FaExclamationTriangle, FaLeaf, FaMicrochip, FaPrint, FaUsers } from 'react-icons/fa';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [lineChartData, setLineChartData] = useState(null);
  const [barChartData, setBarChartData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(4); // 4 rows per page
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [monthFilter, setMonthFilter] = useState('Tháng'); // Default month filter
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const printRef = useRef(); // Ref for printing

  useEffect(() => {
    // Mock data for now
    const mockSummaryData = {
      totalPlants: 20,
      totalTasks: 5,
      totalWarnings: 40,
      totalSensors: 3,
    };

    const mockLineChartData = {
      labels: ['01', '05', '10', '15', '20', '25', '30'],
      datasets: [
        {
          label: 'Nhiệt độ tháng trước',
          data: [65, 60, 70, 68, 66, 62, 64],
          borderColor: '#F4A261',
          backgroundColor: 'rgba(244, 162, 97, 0.2)',
          fill: true,
        },
        {
          label: 'Nhiệt độ tháng này',
          data: [32.5, 34.8, 32.5, 34.8, 32.5, 34.8, 32.5],
          borderColor: '#FF6F61',
          backgroundColor: 'rgba(255, 111, 97, 0.2)',
          fill: true,
        },
      ],
    };

    const mockBarChartData = {
      labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'],
      datasets: [
        {
          label: 'Độ ẩm đất',
          data: [70, 50, 40, 60, 70, 50, 60],
          backgroundColor: '#FF6F61',
        },
        {
          label: 'Độ ẩm không khí',
          data: [20, 30, 20, 10, 20, 20, 10],
          backgroundColor: '#F4A261',
        },
      ],
    };

    const mockTableData = [
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
    ];

    setSummaryData(mockSummaryData);
    setLineChartData(mockLineChartData);
    setBarChartData(mockBarChartData);
    setTableData(mockTableData);
  }, []);

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!summaryData || !lineChartData || !barChartData || !tableData) {
    return <div className="error">Không có dữ liệu để hiển thị.</div>;
  }

  // Handle print functionality
  const handlePrint = (row) => {
    const printContent = `
      <h3>Thông tin bộ đo: ${row.name}</h3>
      <p>Nhiệt độ: ${row.temp} °C</p>
      <p>Độ ẩm không khí: ${row.airHumidity} %</p>
      <p>Độ ẩm đất: ${row.soilHumidity} %</p>
      <p>Ánh sáng: ${row.light} lux</p>
    `;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>In báo cáo</title>
          <style>
            body { font-family: 'Roboto', sans-serif; padding: 20px; }
            h3 { color: #34772e; }
            p { font-size: 16px; color: #333; }
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
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(page * pageSize, (page + 1) * pageSize);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="dashboard">
      <h6>Dashboard</h6>
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
          <h4>Thống kê</h4>
          <div className="custom-select-wrapper">
            <select
              value={monthFilter}
              onChange={handleMonthChange}
              className="custom-select"
            >
              <option value="Tháng">Tháng</option>
              <option value="Năm">Năm</option>
            </select>
          </div>
        </div>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>
                Nhiệt độ
              </th>
              <th>
                Độ ẩm không khí
              </th>
              <th>
                Độ ẩm đất
              </th>
              <th>
                Ánh sáng
              </th>
              <th>In báo cáo</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{row.temp}</td>
                <td>{row.airHumidity}</td>
                <td>{row.soilHumidity}</td>
                <td>{row.light}</td>
                <td>
                  <button
                    className="print-button"
                    onClick={() => handlePrint(row)}
                  >
                    <FaPrint />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
            className="pagination-button"
          >
            ◄
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index)}
              className={`pagination-button ${page === index ? 'active' : ''}`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages - 1}
            className="pagination-button"
          >
            ►
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;