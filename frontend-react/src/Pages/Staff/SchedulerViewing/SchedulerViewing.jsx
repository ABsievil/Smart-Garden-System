import React, { useEffect, useState } from 'react';
import Navbar from '../../../Components/NavBar/NavBar';
import './ScheduleViewing.css';

const ScheduleViewing = () => {
  const [month, setMonth] = useState(3); // April (0-based index, set to current month)
  const [year, setYear] = useState(2025); // Current year
  const [showEventModal, setShowEventModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [notifData, setNotifData] = useState({ content: '' });
  const [weeklyTasks, setWeeklyTasks] = useState([]);
  const [events, setEvents] = useState([
    { date: new Date(2025, 3, 10), employee: 'Tony', area: 'A', content: 'Gieo hạt vườn đỏ' },
    { date: new Date(2025, 3, 15), employee: 'Tony', area: 'A', content: 'Đón vườn' },
    { date: new Date(2025, 3, 15), employee: 'Tony', area: 'A', content: 'Xem xét thiết bị' },
    { date: new Date(2025, 3, 18), employee: 'Tony', area: 'A', content: 'Thu hoạch vườn B' },
  ]);

  // Current user info (fixed for this user)
  const currentUser = 'Tony';
  const fixedArea = 'A';

  useEffect(() => {
    // Commented API fetch logic for events (filtered by user and area)
    /*
    const fetchEvents = async () => {
      try {
        const response = await api.get(`/api/v1/scheduler/getEvents?userId=${currentUser}&area=${fixedArea}`);
        if (response.data.status === "OK") {
          const eventData = response.data.data;
          setEvents(eventData.map(event => ({
            ...event,
            date: new Date(event.date)
          })));
        } else {
          console.error("Error fetching events:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
    */

    // Filter events for the current user and area (already done in fake data)
    const filteredEvents = events.filter(
      event => event.employee === currentUser && event.area === fixedArea
    );
    setEvents(filteredEvents);

    // Calculate weekly tasks (from current date to next 7 days)
    const currentDate = new Date(2025, 3, 15); // Fixed to April 15, 2025 as per system date
    const endOfWeek = new Date(currentDate);
    endOfWeek.setDate(currentDate.getDate() + 7);

    const tasksInWeek = filteredEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= currentDate && eventDate <= endOfWeek;
    });
    setWeeklyTasks(tasksInWeek);
  }, []);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const years = [2025, 2026, 2027];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleAddNotification = () => {
    setShowNotifModal(true);
  };

  const handleNotifSubmit = () => {
    // Commented API logic for sending notification to admin
    /*
    const sendNotificationToAdmin = async () => {
      try {
        const response = await api.post('/api/v1/notifications/sendToAdmin', {
          userId: currentUser,
          content: notifData.content
        });
        if (response.data.status === "OK") {
          console.log("Notification sent successfully:", response.data.data);
        } else {
          console.error("Error sending notification:", response.data.message);
        }
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    };
    sendNotificationToAdmin();
    */

    setShowNotifModal(false);
    setNotifData({ content: '' });
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
                  style={{ backgroundColor: '#27ae60' }} // Fixed color for area A
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
    return date.toLocaleDateString('en-US', options);
  };

  const getTaskDate = (date) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Define colors for task items (cycling through the colors as in the design)
  const taskColors = ['#27ae60', '#e74c3c', '#f1c40f', '#34772e'];

  return (
    <div className="sch-container">
      <div className="header">
        <h13>Events</h13>
        <Navbar />
      </div>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <div className="sch-calendar-container" style={{ width: '70%' }}>
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
          </div>
          
          <div className="sch-calendar">
            {daysOfWeek.map(day => (
              <div className="sch-day-header" key={day}>{day}</div>
            ))}
            {renderCalendar()}
          </div>
        </div>

        <div className="sch-weekly-tasks" style={{ width: '30%' }}>
          <h3 className="sch-weekly-title">Schedule Details</h3>
          <p className="sch-weekly-date">{getFormattedDate(new Date(2025, 3, 15))}</p>
          {weeklyTasks.length > 0 ? (
            weeklyTasks.map((task, index) => (
              <div
                key={index}
                className="sch-task-item"
                style={{ borderLeft: `5px solid ${taskColors[index % taskColors.length]}` }}
              >
                <p className="sch-task-name">{task.content}</p>
                <p className="sch-task-date">{getTaskDate(new Date(task.date))}</p>
                <p className="sch-task-area">Khu {task.area}</p>
              </div>
            ))
          ) : (
            <p className="sch-no-tasks">No tasks scheduled for this week.</p>
          )}
          <button className="view-more-task">View More</button>
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
            <h3>Send Notification to Admin</h3>
            <label>Content</label>
            <input
              type="text"
              value={notifData.content}
              onChange={(e) => setNotifData({ ...notifData, content: e.target.value })}
              placeholder="Enter important situation..."
            />
            <div className="sch-modal-buttons">
              <button onClick={() => setShowNotifModal(false)}>Cancel</button>
              <button onClick={handleNotifSubmit}>Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleViewing;