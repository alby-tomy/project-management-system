import React, { useState } from 'react';
import { registerUser } from '../../api';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState('');
    const [confirm_password, setConfirm_password] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Function to handle registration
    const handleRegister = async (e) => {
        e.preventDefault(); 

        if (password !== confirm_password) {
            setErrorMessage("Passwords don't match"); 
            return;
        }

        try {
            await registerUser(username, password);
            alert('Registration successful! You can now login.');
            navigate('/login');
        } catch (error) {
            console.error('Registration failed:', error);
            setErrorMessage('Registration failed. Please try again.'); 
        }
    };

    return (
        <div>
            <h1 className="heading">Project Management System</h1>
            <div className="form-container">
                <h2>Register</h2>
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label>Username:</label>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirm_password}
                            onChange={(e) => setConfirm_password(e.target.value)}
                            required
                        />
                    </div>

                    
                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    <button type="submit">Register</button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '10px' }}>
                    Already have Account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
