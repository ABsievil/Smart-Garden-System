import NotificationsIcon from '@mui/icons-material/Notifications';
import { AppBar, Avatar, Button, Toolbar, Typography } from "@mui/material";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';

const Navbar = ({ namePage }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const navigate = useNavigate();

  // Fake data for notifications and user
  useEffect(() => {
    const mockNotifications = [
      { id: 1, title: "Phát hiện nhiệt độ bất thường", description: "Vườn cơ chuối", date: "22/12/2022" },
      { id: 2, title: "Phát hiện độ ẩm bất thường", description: "Vườn dò", date: "22/12/2022" },
      { id: 3, title: "Phát hiện độ ẩm bất thường", description: "Vườn dò", date: "22/12/2022" },
      { id: 4, title: "Phát hiện bất thường", description: "Vườn lê", date: "22/12/2022" },
      { id: 5, title: "Phát hiện thiết bị hỏng", description: "Vườn cơ chuối", date: "22/12/2022" },
      { id: 6, title: "Phát hiện thiết bị hỏng", description: "Vườn cơ chuối", date: "22/12/2022" },
      { id: 7, title: "Phát hiện thiết bị hỏng", description: "Vườn cơ chuối", date: "22/12/2022" },
      { id: 8, title: "Phát hiện thiết bị hỏng", description: "Vườn cơ chuối", date: "22/12/2022" },
    ];
    const mockUser = {
      name: "Nguyễn Văn A",
      role: "Admin",
    };
    setNotifications(mockNotifications);
    setUser(mockUser);
    setHasNewNotification(true); // Simulate new notifications
  }, []);

  // API integration for fetching notifications (commented)
  /*
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/api/notifications');
        setNotifications(response.data);
        setHasNewNotification(response.data.some(notification => !notification.read));
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };
    fetchNotifications();
  }, []);
  */

  // API integration for fetching user info (commented)
  /*
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/user');
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };
    fetchUser();
  }, []);
  */

  const toggleNotificationDropdown = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setHasNewNotification(false); // Mark notifications as seen when opened
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
                <Typography variant="body2" style={{ color: "#333", marginBottom: "10px" , height: "20px"}}>
                  You have {notifications.length} notifications
                </Typography>
                <div className="notification-list">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="notification-item">
                      <Typography variant="body1" style={{ fontWeight: "bold", color: "#333", height: "20px" }}>
                        {notification.title}
                      </Typography>
                      <Typography variant="body2" style={{ color: "#666", height: "20px" }}>
                        {notification.description}
                      </Typography>
                      <Typography variant="caption" style={{ color: "#999" , height: "20px"}}>
                        {notification.date}
                      </Typography>
                    </div>
                  ))}
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
              <Typography variant="caption" color="textSecondary" style={{ marginBottom:"10px" }}>
                {user?.role || "Chức Vụ"}
              </Typography>
            </div>
            <Avatar alt="User Avatar" style={{ backgroundColor: "#34772e" }} />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;