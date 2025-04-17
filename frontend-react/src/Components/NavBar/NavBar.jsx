import NotificationsIcon from '@mui/icons-material/Notifications';
import { AppBar, Avatar, Button, Toolbar, Typography } from "@mui/material";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import './NavBar.css';

const Navbar = ({ namePage }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [error, setError] = useState(null); // Add error state for UI feedback
  const navigate = useNavigate();

  const currentUsername=localStorage.getItem('username');

  // Load viewed notification IDs from localStorage
  const [viewedNotifications, setViewedNotifications] = useState(() => {
    const saved = localStorage.getItem('viewedNotifications');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get(`/api/v1/dashboard/notifications/user/${currentUserId}`);
        if (response.data.status === "OK") {
          const notificationData = response.data.data.notifications.map((notif, index) => {
            const date = new Date(notif.datetime).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            });
            // Extract title from content if possible (e.g., "Khu vực 1: Urgent issue")
            let title = "Thông báo";
            let description = notif.content;
            const contentParts = notif.content.split(": ");
            if (contentParts.length > 1) {
              title = contentParts[0]; // e.g., "Khu vực 1"
              description = contentParts.slice(1).join(": "); // e.g., "Urgent issue"
            }
            return {
              id: index + 1, // Generate a temporary ID
              title,
              description,
              date,
            };
          });
          setNotifications(notificationData);
          // Check for new notifications (not viewed yet)
          const hasNew = notificationData.some(notif => !viewedNotifications.includes(notif.id));
          setHasNewNotification(hasNew);
          setError(null);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error.response?.data?.message || error.message);
        setError('Không thể tải thông báo: ' + (error.response?.data?.message || error.message));
      }
    };

    const fetchUser = async () => {
      try {
        const response = await api.post('/api/v1/users/profile', {
          username: currentUsername,
        });
        if (response.data.status === "OK") {
          const userData = response.data.data;
          console.log("name" + response.data.data.name);
          setUser({
            name: userData.information.lname + ' ' + userData.information.fname ,
            role: userData.role ,
          });
          setError(null);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching user info:', error.response?.data?.message || error.message);
        setError('Không thể tải thông tin người dùng: ' + (error.response?.data?.message || error.message));
        setUser({
          name: "Tên Người Dùng",
          role: "Chức Vụ",
        });
      }
    };

    fetchNotifications();
    fetchUser();
  }, []);

  // Update viewed notifications when the dropdown is opened
  const toggleNotificationDropdown = () => {
    setIsNotificationOpen(!isNotificationOpen);
    if (!isNotificationOpen) {
      // Mark all current notifications as viewed
      const notificationIds = notifications.map(notif => notif.id);
      const updatedViewed = [...new Set([...viewedNotifications, ...notificationIds])];
      setViewedNotifications(updatedViewed);
      localStorage.setItem('viewedNotifications', JSON.stringify(updatedViewed));
      setHasNewNotification(false); // Clear the new notification dot
    }
  };

  const handleUserClick = () => {
    navigate('/user-profile');
  };

  return (
    <div className="header-title">
      <AppBar position="static" style={{ backgroundColor: "transparent", padding: "10px 0", boxShadow: 'none' }}>
        <Toolbar>
          <Typography
            variant="h4"
            component="div"
            fontFamily={"Roboto"}
            sx={{ flexGrow: 1, color: "#333", lineHeight: '40px', fontWeight: '700', paddingLeft: '2%' }}
          >
            {namePage}
          </Typography>
          <div className="notification-section">
            <Button
              style={{ color: "#555", padding: "0px 3px", minWidth: "unset" }}
              onClick={toggleNotificationDropdown}
            >
              <NotificationsIcon style={{ width: "28px", height: "28px" }} />
              {hasNewNotification && <span className="notification-dot"></span>}
            </Button>
            {isNotificationOpen && (
              <div className="notification-dropdown">
                <Typography variant="h12" style={{ color: "#1e88e5", marginBottom: "10px", height: "20px", fontWeight: "bold", fontSize: "25px" }}>
                  Notifications
                </Typography>
                <Typography variant="body2" style={{ color: "#333", marginBottom: "10px", height: "20px" }}>
                  You have {notifications.length} notifications
                </Typography>
                <div className="notification-list">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div key={notification.id} className="notification-item">
                        <Typography variant="body1" style={{ fontWeight: "bold", color: "#333", height: "20px" }}>
                          {notification.title}
                        </Typography>
                        <Typography variant="body2" style={{ color: "#666", height: "20px" }}>
                          {notification.description}
                        </Typography>
                        <Typography variant="caption" style={{ color: "#999", height: "20px" }}>
                          {notification.date}
                        </Typography>
                      </div>
                    ))
                  ) : (
                    <Typography variant="body2" style={{ color: "#666", height: "20px" }}>
                      No notifications available.
                    </Typography>
                  )}
                </div>
                <Button className="view-more" variant="contained">
                  VIEW MORE
                </Button>
              </div>
            )}
          </div>
          <div className="user-section" onClick={handleUserClick}>
            <div style={{ textAlign: "right", marginRight: "10px", marginLeft: "0px" }}>
              <Typography variant="body1" style={{ color: "#303972", fontSize: "14px" }}>
                {user?.name || "Tên Người Dùng"}
              </Typography>
              <Typography variant="caption" color="textSecondary" style={{ marginBottom: "10px" }}>
                {user?.role || "Chức Vụ"}
              </Typography>
            </div>
            <Avatar alt="User Avatar" style={{ backgroundColor: "#34772e" }} />
          </div>
        </Toolbar>
      </AppBar>
      {error && (
        <div style={{ position: 'absolute', top: '60px', right: '20px', backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '5px' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default Navbar;