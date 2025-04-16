import React, { useEffect, useState } from 'react';
import Navbar from '../../../Components/NavBar/NavBar';
import './Scheduler.css';

const Scheduler = () => {
  const [month, setMonth] = useState(0); // January (0-based index)
  const [year, setYear] = useState(2025);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [employees, setEmployees] = useState([]); // State to store fetched employees
  const [taskData, setTaskData] = useState({
    content: '',
    area: 'A',
    employee: '', // Will be set dynamically after fetching employees
    date: 'Wednesday, 1th January'
  });
  const [notifData, setNotifData] = useState({
    content: '',
    area: 'A'
  });
  const [events, setEvents] = useState([
    { date: new Date(2025, 0, 2), employee: 'Tony', area: 'A', content: 'Task 1' },
    { date: new Date(2025, 0, 6), employee: 'Tony', area: 'A', content: 'Task 2' },
    { date: new Date(2025, 0, 10), employee: 'Karen', area: 'B', content: 'Task 3' },
    { date: new Date(2025, 0, 15), employee: 'Tony', area: 'A', content: 'Task 4' },
    { date: new Date(2025, 0, 15), employee: 'Karen', area: 'B', content: 'Task 5' },
    { date: new Date(2025, 0, 15), employee: 'Johnny', area: 'C', content: 'Task 6' },
    { date: new Date(2025, 0, 18), employee: 'Tony', area: 'A', content: 'Task 7' },
    { date: new Date(2025, 0, 24), employee: 'Tony', area: 'A', content: 'Task 8' },
    { date: new Date(2025, 0, 29), employee: 'Johnny', area: 'C', content: 'Task 9' },
  ]);

  useEffect(() => {
    const fetchEvents = async () => {
      /*
      try {
        const response = await api.get('/api/v1/scheduler/getEvents');
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
      */
    };

    const fetchEmployees = async () => {
      /*
      try {
        const response = await api.get('/api/v1/employees/getAll');
        if (response.data.status === "OK") {
          const employeeData = response.data.data;
          setEmployees(employeeData.map(employee => employee.name));
          if (employeeData.length > 0) {
            setTaskData(prev => ({ ...prev, employee: employeeData[0].name }));
          }
        } else {
          console.error("Error fetching employees:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
      */
      // Fake data for employees since the API call is commented out
      const fakeEmployees = ['Tony', 'Karen', 'Johnny', 'Alice', 'Bob'];
      setEmployees(fakeEmployees);
      setTaskData(prev => ({ ...prev, employee: fakeEmployees[0] }));
    };

    fetchEvents();
    fetchEmployees();
  }, []);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const years = [2025, 2026, 2027];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleAddTask = () => {
    setShowTaskModal(true);
  };

  const handleAddNotification = () => {
    setShowNotifModal(true);
  };

  const handleTaskSubmit = () => {
    const newEvent = {
      date: new Date(2025, 0, parseInt(taskData.date.split(' ')[2])),
      employee: taskData.employee,
      area: taskData.area,
      content: taskData.content
    };
    setEvents([...events, newEvent]);
    setShowTaskModal(false);
    setTaskData({ content: '', area: 'A', employee: employees[0] || '', date: 'Wednesday, 1th January' });

    /*
    const sendTaskToEmployee = async () => {
      try {
        const response = await api.post('/api/v1/scheduler/assignTask', {
          employeeId: taskData.employee,
          task: taskData.content,
          date: newEvent.date,
          area: taskData.area
        });
        if (response.data.status === "OK") {
          console.log("Task assigned successfully:", response.data.data);
        } else {
          console.error("Error assigning task:", response.data.message);
        }
      } catch (error) {
        console.error("Error assigning task:", error);
      }
    };
    sendTaskToEmployee();
    */
  };

  const handleNotifSubmit = () => {
    /*
    const sendNotificationToArea = async () => {
      try {
        const response = await api.post('/api/v1/scheduler/sendNotification', {
          area: notifData.area,
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
    sendNotificationToArea();
    */

    setShowNotifModal(false);
    setNotifData({ content: '', area: 'A' });
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
                  style={{ backgroundColor: event.area === 'A' ? '#27ae60' : event.area === 'B' ? '#e74c3c' : '#f1c40f' }}
                  onClick={(e) => handleDotClick(event, e)}
                ></span>
                <div className="sch-event-tooltip">
                  <p><strong>Task:</strong> {event.content}</p>
                  <p><strong>Employee:</strong> {event.employee}</p>
                  <p><strong>Area:</strong> {event.area}</p>
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
              onChange={(e) => setTaskData({ ...taskData, area: e.target.value })}
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
            <label>Nhân viên</label>
            <select
              value={taskData.employee}
              onChange={(e) => setTaskData({ ...taskData, employee: e.target.value })}
            >
              {employees.length > 0 ? (
                employees.map((employee, index) => (
                  <option key={index} value={employee}>{employee}</option>
                ))
              ) : (
                <option value="">No employees available</option>
              )}
            </select>
            <label>Ngày thực hiện</label>
            <select
              value={taskData.date}
              onChange={(e) => setTaskData({ ...taskData, date: e.target.value })}
            >
              {Array.from({ length: getDaysInMonth(month, year) }, (_, i) => {
                const day = i + 1;
                const date = new Date(year, month, day);
                const dayName = daysOfWeek[(date.getDay() === 0 ? 6 : date.getDay() - 1)];
                return (
                  <option key={day} value={`${dayName}, ${day}th ${months[month]}`}>
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
            <label>Khu vực</label>
            <select
              value={notifData.area}
              onChange={(e) => setNotifData({ ...notifData, area: e.target.value })}
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
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
                <p><strong>Area:</strong> {selectedEvent.area}</p>
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
                      <p><strong>Employee:</strong> {event.employee}</p>
                      <p><strong>Area:</strong> {event.area}</p>
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
    </div>
  );
};

export default Scheduler;