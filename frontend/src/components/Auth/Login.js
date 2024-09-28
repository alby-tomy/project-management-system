import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(()=>{
        const token = localStorage.getItem('token')
        if(token){
            navigate('/projects')
        }
    },[navigate])
    const handleSubmit = async (e) => {
        e.preventDefault();


        try {
            const response = await loginUser(username, password);
            if (response.status === 200) {
                localStorage.setItem('token', btoa(`${username}:${password}`)); // Store Basic Auth token
                navigate('/projects');
            } else {
                setErrorMessage('Invalid username or password')
            }
        } catch (error) {
            console.error('Login failed:', error);
            setErrorMessage('Login failed. Please try again')
        }
    };

    return (
        <div>
            <h1 className="heading">Project Management System</h1>
            <div className="form-container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    <button type="submit">Login</button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '10px' }}>
                    Create Account? <Link to="/">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
