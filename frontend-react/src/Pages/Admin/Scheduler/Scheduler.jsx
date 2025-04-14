import React, { useState } from 'react';
import Navbar from '../../../Components/NavBar/NavBar';
import './Scheduler.css';

const Scheduler = () => {
  const [month, setMonth] = useState(0); // January (0-based index)
  const [year, setYear] = useState(2025);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [taskData, setTaskData] = useState({
    content: '',
    area: 'A',
    employee: 'Tony',
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
    { date: new Date(2025, 0, 18), employee: 'Tony', area: 'A', content: 'Task 5' },
    { date: new Date(2025, 0, 24), employee: 'Tony', area: 'A', content: 'Task 6' },
    { date: new Date(2025, 0, 29), employee: 'Johnny', area: 'C', content: 'Task 7' },
  ]);
  const [holidays, setHolidays] = useState([
    { date: new Date(2025, 0, 1), name: 'New Year' },
    { date: new Date(2025, 0, 29), name: 'Johnny' },
  ]);

  // API function to fetch events (commented out)
  // const fetchEvents = async () => {
  //   try {
  //     const response = await fetch('/api/events', {
  //       method: 'GET',
  //       headers: { 'Content-Type': 'application/json' }
  //     });
  //     const data = await response.json();
  //     setEvents(data.map(event => ({
  //       ...event,
  //       date: new Date(event.date)
  //     })));
  //   } catch (error) {
  //     console.error('Error fetching events:', error);
  //   }
  // };

  // API function to fetch holidays (commented out)
  // const fetchHolidays = async () => {
  //   try {
  //     const response = await fetch('/api/holidays', {
  //       method: 'GET',
  //       headers: { 'Content-Type': 'application/json' }
  //     });
  //     const data = await response.json();
  //     setHolidays(data.map(holiday => ({
  //       ...holiday,
  //       date: new Date(holiday.date)
  //     })));
  //   } catch (error) {
  //     console.error('Error fetching holidays:', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchEvents();
  //   fetchHolidays();
  // }, []);

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
    setTaskData({ content: '', area: 'A', employee: 'Tony', date: 'Wednesday, 1th January' });

    // API function to send task to employee (commented out)
    // const sendTaskToEmployee = async () => {
    //   try {
    //     await fetch('/api/assign-task', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({
    //         employeeId: taskData.employee,
    //         task: taskData.content,
    //         date: newEvent.date,
    //         area: taskData.area
    //       })
    //     });
    //   } catch (error) {
    //     console.error('Error sending task:', error);
    //   }
    // };
    // sendTaskToEmployee();
  };

  const handleNotifSubmit = () => {
    // API function to send notification to all employees in the area (commented out)
    // const sendNotificationToArea = async () => {
    //   try {
    //     await fetch('/api/send-notification', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({
    //         area: notifData.area,
    //         content: notifData.content
    //       })
    //     });
    //   } catch (error) {
    //     console.error('Error sending notification:', error);
    //   }
    // };
    // sendNotificationToArea();

    setShowNotifModal(false);
    setNotifData({ content: '', area: 'A' });
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);
    const days = [];

    // Adjust for Monday as the first day of the week
    const adjustedFirstDay = (firstDay === 0 ? 6 : firstDay - 1);

    // Add empty slots for days before the 1st
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(<div className="day" key={`empty-${i}`}></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dayEvents = events.filter(event =>
        event.date.getDate() === day &&
        event.date.getMonth() === month &&
        event.date.getFullYear() === year
      );
      const dayHoliday = holidays.find(holiday =>
        holiday.date.getDate() === day &&
        holiday.date.getMonth() === month &&
        holiday.date.getFullYear() === year
      );

      days.push(
        <div
          className={`day ${dayEvents.length > 0 ? 'event' : ''}`}
          key={day}
        >
          <div className="day-number">{day}</div>
          {dayEvents.map((event, index) => (
            <span
              key={index}
              className="event-dot"
              style={{ backgroundColor: event.area === 'A' ? '#27ae60' : event.area === 'B' ? '#e74c3c' : '#f1c40f' }}
            ></span>
          ))}
          {dayHoliday && <div className="holiday">{dayHoliday.name}</div>}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="scheduler-container">
      <div className="header">
      <h13>Events</h13>
      <Navbar />
      </div>
      
      <div className="calendar-container">
      <div className="scheduler-header">
      <h14>Calendar</h14>
        <div className="select-button">
          <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
            {months.map((m, index) => (
              <option key={m} value={index}>{m}</option>
            ))}
          </select>
          </div>
          <div className="select-button">
          <select value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div classname="notification-button">
          <button onClick={handleAddNotification}  >+ New Notification</button>
         
        </div>
        <div>
        <button onClick={handleAddTask}>+ New Plan</button>
          </div>
      </div>
      
      <div className="calendar">
        {daysOfWeek.map(day => (
          <div className="day-header" key={day}>{day}</div>
        ))}
        {renderCalendar()}
      </div>
      </div>
      {showTaskModal && (
        <div className="modal3">
          <div className="modal-content3">
            <button className="close-btn" onClick={() => setShowTaskModal(false)}>✖</button>
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
              <option value="Tony">Tony</option>
              <option value="Karen">Karen</option>
              <option value="Johnny">Johnny</option>
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
            <div className="modal-buttons3">
              <button onClick={() => setShowTaskModal(false)}>Hủy</button>
              <button onClick={handleTaskSubmit}>Thêm</button>
            </div>
          </div>
        </div>
      )}

      {showNotifModal && (
        <div className="modal3">
          <div className="modal-content3">
            <button className="close-btn" onClick={() => setShowNotifModal(false)}>✖</button>
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
            <div className="modal-buttons3">
              <button onClick={() => setShowNotifModal(false)}>Hủy</button>
              <button onClick={handleNotifSubmit}>Thêm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scheduler;