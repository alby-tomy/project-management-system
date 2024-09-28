// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'


const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear token from local storage
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <nav className="navbar">
            <ul>
                <li className="left">
                    <Link to="/projects"><b>Home</b></Link> {/* Navigate to Project List */}
                </li>
                <li className="right">
                    <button onClick={handleLogout}>Logout</button> {/* Logout Button */}
                </li>
            </ul>
        </nav>
    );
    
};

export default Navbar;
