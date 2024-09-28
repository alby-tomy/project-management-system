import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProjectList from './components/Projects/ProjectList';
import TodoList from './components/Projects/TodoList';
import './App.css';


const ProtectedRoute = () => {

  const token = localStorage.getItem("token")
  if (!token) {
    return <Navigate to={"/login"} />
  } else {

    return (<Outlet />)
  }
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/project/:projectId/todos" element={<TodoList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;