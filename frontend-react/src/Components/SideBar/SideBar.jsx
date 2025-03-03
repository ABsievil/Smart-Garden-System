import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DevicesIcon from '@mui/icons-material/Devices';
import ForestIcon from "@mui/icons-material/Forest";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import StorageIcon from "@mui/icons-material/Storage";
import { Typography } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { logout } from "../../redux/action";
import api from "./../../api";
import './SideBar.css';
const Sidebar = () => {
    const dispatch = useDispatch();
    const handleLogout = async () => {
    try{
        api.post('api/logout');
        dispatch(logout());
    }catch(e){
        console.error(e);
    }
    };
    const userRole = localStorage.getItem("role");
    return (
    <div className="sidebar">
        {/* Logo */}
        <Typography variant="h4" style={{ lineHeight: '54px', fontWeight: '700', fontSize: '36px' }}>
        SMART GARDEN
        </Typography>
        {/* Navigation */}
        {userRole && userRole === "USER"? 
        <ul>
        <li>
            <NavLink to="/control-device">
            <StorageIcon /> Dữ liệu thiết bị
            </NavLink>
        </li>
        <li>
            <NavLink to="/tree-view">
            <ForestIcon /> Danh sách cây trồng
            </NavLink>
        </li>
        <li>
            <NavLink to="/scheduler-view">
            <CalendarMonthIcon /> Lịch trình
            </NavLink>
        </li>
        <li className="logout-button" onClick={handleLogout}>
        <NavLink className="logout-link">
            <LogoutIcon /> Đăng xuất
        </NavLink>
        </li>
        </ul> : <ul>
        <li>
            <NavLink to="/dash-board">
            <HomeIcon /> Trang chủ
            </NavLink>
        </li>
        <li>
            <NavLink to="/tree-manager">
            <ForestIcon /> Quản lý cây trồng
            </NavLink>
        </li>
        <li>
            <NavLink to="/staff-manager">
            <ManageAccountsIcon /> Quản lý nhân viên
            </NavLink>
        </li>
        <li>
            <NavLink to="/scheduler">
            <CalendarMonthIcon /> Lịch trình
            </NavLink>
        </li>
        <li>
            <NavLink to="/device-record">
            <StorageIcon /> Dữ liệu thiết bị
            </NavLink>
        </li>
        <li>
            <NavLink to="/device-manager">
            <DevicesIcon /> Quản lý thiết bị
            </NavLink>
        </li>
        <li className="logout-button" onClick={handleLogout}>
        <NavLink className="logout-link">
            <LogoutIcon /> Đăng xuất
        </NavLink>
        </li>
        </ul>
        }

    </div>
    );
};

export default Sidebar;