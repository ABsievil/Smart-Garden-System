import React, { useEffect, useState } from 'react';
import Navbar from '../../../Components/NavBar/NavBar';
import api from '../../../api';
import './ScheduleViewing.css';

// Utility to parse backend date string "yyyy-MM-dd'T'HH:mm:ss" into a Date object
const parseDateFromBackend = (dateStr) => {
  return new Date(`${dateStr}Z`);
};

// Utility to map area (integer) to display name
const getAreaDisplayName = (area) => {
  return `Area ${area}`;
};

const ScheduleViewing = () => {
  const [month, setMonth] = useState(3);
  const [year, setYear] = useState(2025);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [notifData, setNotifData] = useState({ content: '' });
  const [weeklyTasks, setWeeklyTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  const currentUser = 'Tony';
  const currentUserId = 1; // Should be fetched dynamically in a real app
  const fixedArea = 1;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get(`/api/v1/schedule/user/${currentUserId}`);
        if (response.data.status === "OK") {
          const eventData = response.data.data.eventList;
          const parsedEvents = eventData.map(event => ({
            id: event.id,
            date: parseDateFromBackend(event.dateTime),
            employee: currentUser,
            area: event.area,
            content: event.content,
          }));

          const filteredEvents = parsedEvents.filter(event => event.area === fixedArea);
          setEvents(filteredEvents);

          const currentDate = new Date(2025, 3, 15);
          const endOfWeek = new Date(currentDate);
          endOfWeek.setDate(currentDate.getDate() + 7);

          const tasksInWeek = filteredEvents.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= currentDate && eventDate <= endOfWeek;
          });
          setWeeklyTasks(tasksInWeek);

          setError(null);
        } else {
          console.error("Error fetching events:", response.data.message);
          setError("Error fetching events: " + response.data.message);
        }
      } catch (error) {
        console.error("Error fetching events:", error.response?.data?.message || error.message);
        setError("Error fetching events: " + (error.response?.data?.message || error.message));
      }
    };

    fetchEvents();
  }, []);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const years = [2025, 2026, 2027];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleAddNotification = () => {
    setShowNotifModal(true);
  };

  const handleNotifSubmit = async () => {
    // Validate input
    if (!notifData.content.trim()) {
      setError("Notification content cannot be empty");
      return;
    }

    try {
      console.log("ID:" + notifData.content.trim());
      const response = await api.post('/api/v1/dashboard/notifications/to-admin', {
        senderUserId: currentUserId, // Match backend DTO field name
        content: notifData.content.trim(),
      });
    
      if (response.data.status === "OK") {
        setShowNotifModal(false);
        setNotifData({ content: '' });
        setError(null);
      } else {
        console.error("Error sending notifications:", response.data.message);
        setError("Failed to send notification: " + response.data.message);
      }
    } catch (error) {
      console.error("Error sending notification:", error.response?.data?.message || error.message);
      const errorMessage = error.response?.data?.message || error.message;
      if (error.response?.status === 409) {
        setError("This notification has already been sent to the admin.");
      } else if (error.response?.status === 400) {
        setError("Invalid user ID. Please check your account.");
      } else if (error.response?.status === 404) {
        setError("Admin not found. Please contact support.");
      } else {
        setError("Error sending notification: " + errorMessage);
      }
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
                  style={{ backgroundColor: '#27ae60' }}
                  onClick={(e) => handleDotClick(event, e)}
                ></span>
                <div className="sch-event-tooltip">
                  <p><strong>Task:</strong> {event.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  const getFormattedDate = (date) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('vi-VN', options);
  };

  const getTaskDate = (date) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('vi-VN', options);
  };

  const taskColors = ['#27ae60', '#e74c3c', '#f1c40f', '#34772e'];

  return (
    <div className="sch-container">
      <div className="header">
        <h13>Lịch Trình</h13>
        <Navbar />
      </div>
      {error && <div className="error-message">{error}</div>}
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <div className="sch-calendar-container" style={{ width: '70%' }}>
          <div className="sch-scheduler-header">
            <h14 style={{ color: "white" }}>Calendar</h14>
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
              <button onClick={handleAddNotification}>+ Thêm thông báo</button>
            </div>
          </div>
          
          <div className="sch-calendar">
            {daysOfWeek.map(day => (
              <div className="sch-day-header" key={day}>{day}</div>
            ))}
            {renderCalendar()}
          </div>
        </div>

        <div className="sch-weekly-tasks" style={{ width: '30%' }}>
          <h3 className="sch-weekly-title">Chi Tiết</h3>
          <p className="sch-weekly-date">Hôm nay là {getFormattedDate(new Date())}</p>
          {weeklyTasks.length > 0 ? (
            weeklyTasks.map((task, index) => (
              <div
                key={index}
                className="sch-task-item"
                style={{ borderLeft: `5px solid ${taskColors[index % taskColors.length]}` }}
              >
                <p className="sch-task-name">{task.content}</p>
                <p className="sch-task-date">{getTaskDate(new Date(task.date))}</p>
                <p className="sch-task-area">{getAreaDisplayName(task.area)}</p>
              </div>
            ))
          ) : (
            <p className="sch-no-tasks">Không có công việc nào trong tuần này.</p>
          )}
          <button className="view-more-task">Xem Thêm</button>
        </div>
      </div>

      {showEventModal && (
        <div className="sch-modal">
          <div className="sch-modal-content">
            <button className="sch-close-btn" onClick={() => setShowEventModal(false)}>✖</button>
            <h3>Scheduled Tasks</h3>
            {selectedEvent ? (
              <div className="sch-task-details">
                <p><strong>Task:</strong> {selectedEvent.content}</p>
                <div className="sch-modal-buttons">
                  <button onClick={() => setSelectedEvent(null)}>Back to All Tasks</button>
                  <button onClick={() => setShowEventModal(false)}>Close</button>
                </div>
              </div>
            ) : (
              <div className="sch-task-list">
                {selectedDayEvents.length > 0 ? (
                  selectedDayEvents.map((event, index) => (
                    <div key={index} className="sch-task-item">
                      <p><strong>Task:</strong> {event.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="sch-no-tasks">No tasks scheduled for this day.</p>
                )}
                <div className="sch-modal-buttons">
                  <button onClick={() => setShowEventModal(false)}>Close</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showNotifModal && (
        <div className="sch-modal">
          <div className="sch-modal-content">
            <button className="sch-close-btn" onClick={() => setShowNotifModal(false)}>✖</button>
            <h3>Gửi thông báo tới Admin</h3>
            <label>Nội dung</label>
            <input
              type="text"
              value={notifData.content}
              onChange={(e) => setNotifData({ ...notifData, content: e.target.value })}
              placeholder="Nhập nội dung..."
            />
            <div className="sch-modal-buttons">
              <button onClick={() => setShowNotifModal(false)}>Hủy</button>
              <button onClick={handleNotifSubmit}>Gửi ngay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleViewing;