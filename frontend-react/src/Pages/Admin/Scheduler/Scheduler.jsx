import React, { useEffect, useState } from 'react';
import Navbar from '../../../Components/NavBar/NavBar';
import api from '../../../api';
import './Scheduler.css';

// Utility to format Date object to "yyyy-MM-dd'T'HH:mm:ss"
const formatDateForBackend = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

// Utility to parse backend date string "yyyy-MM-dd'T'HH:mm:ss" into a Date object
const parseDateFromBackend = (dateStr) => {
  return new Date(`${dateStr}Z`);
};

// Utility to map area (integer) to color
const getAreaColor = (area) => {
  switch (area) {
    case 1:
      return '#27ae60'; // Green (previously area "A")
    case 2:
      return '#e74c3c'; // Red (previously area "B")
    case 3:
      return '#f1c40f'; // Yellow (previously area "C")
    default:
      return '#cccccc'; // Gray for undefined areas
  }
};

// Utility to map area (integer) to display name
const getAreaDisplayName = (area) => {
  return `Area ${area}`;
};

const Scheduler = () => {
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(2025);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [taskData, setTaskData] = useState({
    content: '',
    area: 1, // Default to integer 1
    employee: '',
    employeeId: null,
    day: 1,
  });
  const [notifData, setNotifData] = useState({
    content: '',
    area: 1, // Default to integer 1
  });
  const [sendToAllAreas, setSendToAllAreas] = useState(false); // New state for checkbox
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/api/v1/schedule/allCalendar');
        if (response.data.status === 'OK') {
          const eventData = response.data.data.eventList;
          setEvents(eventData.map(event => ({
            id: event.id,
            date: parseDateFromBackend(event.dateTime),
            employee: '',
            employeeId: event.userId,
            area: event.area, // Now an integer (e.g., 1, 2, 3)
            content: event.content,
          })));
          setError(null);
        } else {
          console.error('Lỗi khi lấy danh sách sự kiện:', response.data.message);
          setError('Lỗi khi lấy danh sách sự kiện');
        }
      } catch (error) {
        console.error('Lỗi API:', error.response?.data?.message || error.message);
        setError('Lỗi khi lấy danh sách sự kiện');
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await api.get('/api/v1/staff-manage/user-list');
        if (response.data.status === 'OK') {
          const employeeData = response.data.data.userList.map((user, index) => ({
            userId: index + 1,
            name: user.name || 'Không có tên',
          }));
          setEmployees(employeeData);
          if (employeeData.length > 0) {
            setTaskData(prev => ({
              ...prev,
              employee: employeeData[0].name,
              employeeId: employeeData[0].userId,
            }));
          }
          setError(null);
        } else {
          console.error('Lỗi khi lấy danh sách nhân viên:', response.data.message);
          setError('Lỗi khi lấy danh sách nhân viên');
        }
      } catch (error) {
        console.error('Lỗi API:', error.response?.data?.message || error.message);
        setError('Lỗi khi lấy danh sách nhân viên');
      }
    };

    fetchEvents();
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
      setEvents(prevEvents =>
        prevEvents.map(event => {
          const employee = employees.find(emp => emp.userId === event.employeeId);
          return {
            ...event,
            employee: employee ? employee.name : 'Không xác định',
          };
        })
      );
    }
  }, [employees]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const years = [2025, 2026, 2027];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const areas = [1, 2, 3]; // Define possible area values as integers starting from 1

  const handleAddTask = () => {
    setShowTaskModal(true);
  };

  const handleAddNotification = () => {
    setShowNotifModal(true);
  };

  const handleTaskSubmit = async () => {
    if (!taskData.content || !taskData.employeeId) {
      setError('Vui lòng nhập nội dung công việc và chọn nhân viên');
      return;
    }

    if (typeof month !== 'number' || month < 0 || month > 11) {
      setError('Tháng không hợp lệ');
      return;
    }
    if (typeof year !== 'number' || year < 2025 || year > 2027) {
      setError('Năm không hợp lệ');
      return;
    }

    const day = taskData.day;
    const daysInMonth = getDaysInMonth(month, year);
    if (isNaN(day) || day < 1 || day > daysInMonth) {
      setError(`Ngày không hợp lệ. Vui lòng chọn ngày từ 1 đến ${daysInMonth}`);
      return;
    }

    const eventDate = new Date(year, month, day);
    if (isNaN(eventDate.getTime())) {
      setError('Không thể tạo ngày hợp lệ từ dữ liệu đã chọn');
      return;
    }

    const formattedDate = formatDateForBackend(eventDate);

    try {
      const response = await api.post('/api/v1/schedule/addEvent', {
        content: taskData.content,
        area: taskData.area, // Send as integer
        userId: taskData.employeeId,
        dateTime: formattedDate,
      });
      if (response.data.status === 'OK') {
        const newEvent = {
          id: response.data.data.id,
          date: parseDateFromBackend(response.data.data.dateTime),
          employee: employees.find(emp => emp.userId === taskData.employeeId)?.name || 'Không xác định',
          employeeId: taskData.employeeId,
          area: taskData.area, // Integer
          content: taskData.content,
        };
        setEvents([...events, newEvent]);
        setShowTaskModal(false);
        setTaskData({
          content: '',
          area: 1,
          employee: employees[0]?.name || '',
          employeeId: employees[0]?.userId || null,
          day: 1,
        });
        setError(null);
      } else {
        console.error('Lỗi khi thêm sự kiện:', response.data.message);
        setError('Lỗi khi thêm sự kiện: ' + response.data.message);
      }
    } catch (error) {
      console.error('Lỗi API:', error.response?.data?.message || error.message);
      setError('Lỗi khi thêm sự kiện: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleNotifSubmit = async () => {
    if (!notifData.content) {
      setError('Vui lòng nhập nội dung thông báo');
      return;
    }

    try {
      const response = await api.post('/api/v1/dashboard/notifications/broadcast', {
        content: notifData.content,
        areaId: sendToAllAreas ? null : notifData.area, // Send null if sending to all areas
      });
      if (response.data.status === 'OK') {
        setShowNotifModal(false);
        setNotifData({ content: '', area: 1 });
        setSendToAllAreas(false); // Reset checkbox
        setError(null);
      } else {
        console.error('Lỗi khi thêm thông báo:', response.data.message);
        setError('Lỗi khi thêm thông báo: ' + response.data.message);
      }
    } catch (error) {
      console.error('Lỗi API:', error.response?.data?.message || error.message);
      setError('Lỗi khi thêm thông báo: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await api.delete(`/api/v1/schedule/delete/${eventId}`);
      if (response.data.status === 'OK') {
        setEvents(events.filter(event => event.id !== eventId));
        setSelectedEvent(null);
        setError(null);
      } else {
        console.error('Lỗi khi xóa sự kiện:', response.data.message);
        setError('Lỗi khi xóa sự kiện: ' + response.data.message);
      }
    } catch (error) {
      console.error('Lỗi API:', error.response?.data?.message || error.message);
      setError('Lỗi khi xóa sự kiện: ' + (error.response?.data?.message || error.message));
    }
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDayClick = (dayEvents) => {
    setSelectedDayEvents(dayEvents);
    setShowEventModal(true);
  };

  const handleDotClick = (event, e) => {
    e.stopPropagation();
    setSelectedEvent(event);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);
    const days = [];

    const adjustedFirstDay = (firstDay === 0 ? 6 : firstDay - 1);

    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(<div className="sch-day" key={`empty-${i}`}></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dayEvents = events.filter(event =>
        event.date.getDate() === day &&
        event.date.getMonth() === month &&
        event.date.getFullYear() === year
      );

      days.push(
        <div
          className={`sch-day ${dayEvents.length > 0 ? 'sch-event' : ''}`}
          key={day}
          onClick={() => handleDayClick(dayEvents)}
        >
          <div className="sch-day-number">{day}</div>
          <div className="sch-event-dots">
            {dayEvents.map((event, index) => (
              <div className="sch-event-dot-wrapper" key={index}>
                <span
                  className="sch-event-dot"
                  style={{ backgroundColor: getAreaColor(event.area) }} // Map integer to color
                  onClick={(e) => handleDotClick(event, e)}
                ></span>
                <div className="sch-event-tooltip">
                  <p><strong>Task:</strong> {event.content}</p>
                  <p><strong>Employee:</strong> {event.employee}</p>
                  <p><strong>Area:</strong> {getAreaDisplayName(event.area)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="sch-container">
      <div className="header">
        <h13>Events</h13>
        <Navbar />
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="sch-calendar-container">
        <div className="sch-scheduler-header">
          <h14>Calendar</h14>
          <div className="sch-select-button">
            <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
              {months.map((m, index) => (
                <option key={m} value={index}>{m}</option>
              ))}
            </select>
          </div>
          <div className="sch-select-button">
            <select value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="sch-notification-button">
            <button onClick={handleAddNotification}>+ New Notification</button>
          </div>
          <div>
            <button onClick={handleAddTask}>+ New Plan</button>
          </div>
        </div>
        <div className="sch-calendar">
          {daysOfWeek.map(day => (
            <div className="sch-day-header" key={day}>{day}</div>
          ))}
          {renderCalendar()}
        </div>
      </div>

      {showTaskModal && (
        <div className="sch-modal">
          <div className="sch-modal-content">
            <button className="sch-close-btn" onClick={() => setShowTaskModal(false)}>✖</button>
            <h3>Thêm công việc</h3>
            <label>Nội dung</label>
            <input
              type="text"
              value={taskData.content}
              onChange={(e) => setTaskData({ ...taskData, content: e.target.value })}
            />
            <label>Khu vực</label>
            <select
              value={taskData.area}
              onChange={(e) => setTaskData({ ...taskData, area: parseInt(e.target.value) })}
            >
              {areas.map(area => (
                <option key={area} value={area}>
                  {getAreaDisplayName(area)}
                </option>
              ))}
            </select>
            <label>Nhân viên</label>
            <select
              value={taskData.employee}
              onChange={(e) => {
                const selectedEmployee = employees.find(emp => emp.name === e.target.value);
                setTaskData({
                  ...taskData,
                  employee: e.target.value,
                  employeeId: selectedEmployee ? selectedEmployee.userId : null,
                });
              }}
            >
              {employees.length > 0 ? (
                employees.map((employee, index) => (
                  <option key={index} value={employee.name}>{employee.name}</option>
                ))
              ) : (
                <option value="">Không có nhân viên</option>
              )}
            </select>
            <label>Ngày thực hiện</label>
            <select
              value={taskData.day}
              onChange={(e) => setTaskData({ ...taskData, day: parseInt(e.target.value) })}
            >
              {Array.from({ length: getDaysInMonth(month, year) }, (_, i) => {
                const day = i + 1;
                const date = new Date(year, month, day);
                const dayName = daysOfWeek[(date.getDay() === 0 ? 6 : date.getDay() - 1)];
                return (
                  <option key={day} value={day}>
                    {`${dayName}, ${day}th ${months[month]}`}
                  </option>
                );
              })}
            </select>
            <div className="sch-modal-buttons">
              <button onClick={() => setShowTaskModal(false)}>Hủy</button>
              <button onClick={handleTaskSubmit}>Thêm</button>
            </div>
          </div>
        </div>
      )}

      {showNotifModal && (
        <div className="sch-modal">
          <div className="sch-modal-content">
            <button className="sch-close-btn" onClick={() => setShowNotifModal(false)}>✖</button>
            <h3>Thêm thông báo</h3>
            <label>Nội dung</label>
            <input
              type="text"
              value={notifData.content}
              onChange={(e) => setNotifData({ ...notifData, content: e.target.value })}
            />
            <label>Gửi đến tất cả khu vực</label>
            <input
              type="checkbox"
              checked={sendToAllAreas}
              onChange={(e) => {
                setSendToAllAreas(e.target.checked);
                setNotifData({
                  ...notifData,
                  area: e.target.checked ? null : 1, // Set to null if checked, else default to 1
                });
              }}
            />
            <label>Khu vực</label>
            <select
              value={notifData.area || ''} // Handle null area
              onChange={(e) => setNotifData({ ...notifData, area: parseInt(e.target.value) })}
              disabled={sendToAllAreas} // Disable when sending to all areas
            >
              {areas.map(area => (
                <option key={area} value={area}>
                  {getAreaDisplayName(area)}
                </option>
              ))}
            </select>
            <div className="sch-modal-buttons">
              <button onClick={() => setShowNotifModal(false)}>Hủy</button>
              <button onClick={handleNotifSubmit}>Thêm</button>
            </div>
          </div>
        </div>
      )}

      {showEventModal && (
        <div className="sch-modal">
          <div className="sch-modal-content">
            <button className="sch-close-btn" onClick={() => setShowEventModal(false)}>✖</button>
            <h3>Scheduled Tasks</h3>
            {selectedEvent ? (
              <div className="sch-task-details">
                <p><strong>Task:</strong> {selectedEvent.content}</p>
                <p><strong>Employee:</strong> {selectedEvent.employee}</p>
                <p><strong>Area:</strong> {getAreaDisplayName(selectedEvent.area)}</p>
                <div className="sch-modal-buttons">
                  <button onClick={() => setSelectedEvent(null)}>Quay lại tất cả công việc</button>
                  <button onClick={() => handleDeleteEvent(selectedEvent.id)}>Xóa</button>
                  <button onClick={() => setShowEventModal(false)}>Đóng</button>
                </div>
              </div>
            ) : (
              <div className="sch-task-list">
                {selectedDayEvents.length > 0 ? (
                  selectedDayEvents.map((event, index) => (
                    <div key={index} className="sch-task-item">
                      <p><strong>Task:</strong> {event.content}</p>
                      <p><strong>Employee:</strong> {event.employee}</p>
                      <p><strong>Area:</strong> {getAreaDisplayName(event.area)}</p>
                    </div>
                  ))
                ) : (
                  <p className="sch-no-tasks">Không có công việc nào được lên lịch cho ngày này.</p>
                )}
                <div className="sch-modal-buttons">
                  <button onClick={() => setShowEventModal(false)}>Đóng</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Scheduler;