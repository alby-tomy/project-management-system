import React, { useState, useEffect } from 'react';
import { getProjects, updateProjectTitle, addProject, deleteProject } from '../../api'; // Import the addProject function
import { Link } from 'react-router-dom';
import { HashLoader  } from "react-spinners"
import Navbar from '../Navbar';



const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [editingProjectId, setEditingProjectId] = useState(null);
    const [loading, setLoading] = useState(false)
    const [newTitle, setNewTitle] = useState('');
    const [newProjectTitle, setNewProjectTitle] = useState('');

    useEffect(() => {
        setLoading(true)
        const token = localStorage.getItem('token');
        getProjects(token).then((response) => {
            console.log('Projects Response:', response.data);
            setProjects(response.data.projects);
            setLoading(false)
        }).catch(error => {
            console.error('Error fetching projects:', error);
            setLoading(false)
        });
    }, []);


    // edit 
    const handleEditClick = (projectId, currentTitle) => {
        setEditingProjectId(projectId);
        setNewTitle(currentTitle);
    };


    // Update the project title
    const handleUpdateTitle = async (projectId) => {
        const token = localStorage.getItem('token');
        try {
            await updateProjectTitle(token, projectId, newTitle);
            setProjects(projects.map((project) =>
                project.id === projectId ? { ...project, title: newTitle } : project
            ));
            setEditingProjectId(null);
        } catch (error) {
            console.error('Error updating project title:', error);
        }
    };

    // add project
    const handleAddProject = async () => {
        if (newProjectTitle.trim() === '') return;
        const token = localStorage.getItem('token');
        try {
            await addProject(token, newProjectTitle);
            setNewProjectTitle('');
            const response = await getProjects(token);
            setProjects(response.data.projects);

        } catch (error) {
            console.error('Error adding project:', error);
        }
    };

    // delete project
    const handleDeleteProject = async (projectId) => {
        // const token = localStorage.getItem('token');
        try {
            await deleteProject(projectId);
            setProjects(projects.filter((project) => project.id !== projectId));
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };


    return (
        <div>
            <Navbar />
            <div className="project-list-container">
                <div className="header">
                    <h2>Your Projects</h2>
                    <div className="add-project">
                        <input
                            type="text"
                            placeholder="New Project Title"
                            value={newProjectTitle}
                            onChange={(e) => setNewProjectTitle(e.target.value)}
                        />
                        <button className="add-button" onClick={handleAddProject}>
                            +
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="loader-container">
                        <HashLoader   />
                    </div>
                ) : (
                    <div className="project-grid">
                        {projects.map((project) =>
                            project && project.id ? (
                                <div className="project-box" key={project.id}>
                                    {editingProjectId === project.id ? (
                                        <div className="edit-project-title">
                                            <input
                                                type="text"
                                                value={newTitle}
                                                onChange={(e) => setNewTitle(e.target.value)}
                                            />
                                            <button onClick={() => handleUpdateTitle(project.id)}>
                                                Save
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <Link to={`/project/${project.id}/todos`} className="project-link">
                                                <h3>{project.title}</h3>
                                                <p>
                                                    Created on: {new Date(project.created_date).toLocaleDateString()}
                                                </p>
                                            </Link>
                                            <button
                                                className="edit-button"
                                                onClick={() => handleEditClick(project.id, project.title)}
                                            >
                                                ✎
                                            </button>
                                            <button
                                                className="delete-button"
                                                onClick={() => handleDeleteProject(project.id)}
                                            >
                                                🗑 Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            ) : null
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
export default ProjectList;
