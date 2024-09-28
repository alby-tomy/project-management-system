import React, { useState, useEffect } from "react";
import {
    getTodos,
    updateTodoStatus,
    deleteTodo,
    addTodo,
    updateTodoDescription,
    createGist,
} from "../../api";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar";
import { HashLoader } from "react-spinners";

const TodoList = () => {
    const [completedTodos, setCompletedTodos] = useState([]);
    const [uncompletedTodos, setUncompletedTodos] = useState([]);
    const [newTodoDescription, setNewTodoDescription] = useState("");
    const [editingTodoId, setEditingTodoId] = useState(null);
    const [editingDescription, setEditingDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [editingStatus, setEditingStatus] = useState(false);
    const [projectTitle, setProjectTitle] = useState("");
    const { projectId } = useParams();
    const [gistExporting, setGistExporting] = useState(false);

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await getTodos(projectId);
                setCompletedTodos(response.data.completed_todos);
                setUncompletedTodos(response.data.uncompleted_todos);
                setProjectTitle(response.data.project_title); // Set project title from response
            } catch (error) {
                console.error("Error fetching todos:", error);
            }
        };

        fetchTodos();
    }, [projectId]);

    const handleCheckboxChange = async (todoId, isCompleted) => {
        try {
            await updateTodoStatus(todoId, !isCompleted);
            const response = await getTodos(projectId);
            setCompletedTodos(response.data.completed_todos);
            setUncompletedTodos(response.data.uncompleted_todos);
        } catch (error) {
            console.error("Error updating todo status:", error);
        }
    };

    const handleDeleteTodo = async (todoId) => {
        try {
            await deleteTodo(todoId);
            const response = await getTodos(projectId);
            setCompletedTodos(response.data.completed_todos);
            setUncompletedTodos(response.data.uncompleted_todos);
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    };

    const handleAddTodo = async () => {
        if (newTodoDescription.trim() === "") return;
        try {
            await addTodo(projectId, newTodoDescription);
            setNewTodoDescription("");
            const response = await getTodos(projectId);
            setCompletedTodos(response.data.completed_todos);
            setUncompletedTodos(response.data.uncompleted_todos);
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    };

    const handleEditClick = (todoId, description, isCompleted) => {
        setEditingTodoId(todoId);
        setEditingDescription(description);
        setEditingStatus(isCompleted);
    };

    const handleUpdateDescription = async (todoId) => {
        try {
            await updateTodoDescription(todoId, editingDescription, editingStatus);
            setEditingTodoId(null);
            const response = await getTodos(projectId);
            setCompletedTodos(response.data.completed_todos);
            setUncompletedTodos(response.data.uncompleted_todos);
        } catch (error) {
            console.error("Error updating todo description:", error);
        }
    };

    const exportToGist = async () => {
        const token = process.env.REACT_APP_GITHUB_TOKEN; // Use your environment variable for the GitHub token
        const gistTitle = projectTitle; // The title of the Gist
        const totalTodos = completedTodos.length + uncompletedTodos.length;
        const completedCount = completedTodos.length;
    
        // Markdown content for the gist
        const gistContent = `# ${projectTitle}\n\n### Summary: ${completedCount} / ${totalTodos} completed.\n\n## Section 1: Pending Tasks:\n${uncompletedTodos.length === 0 ? '- No pending tasks.' : uncompletedTodos.map((todo) => `- [ ] ${todo.description}`).join("\n")}\n\n## Section 2: Completed Tasks:\n${completedTodos.length === 0 ? '- No completed tasks.' : completedTodos.map((todo) => `- [x] ${todo.description}`).join("\n")}`;
    
        try {
            setGistExporting(true); // Set loading state to true
            const gistResponse = await createGist(gistTitle, gistContent, token);
            alert(`Gist created successfully! View it here: ${gistResponse.html_url}`);
        } catch (error) {
            alert("Failed to create Gist. Please check your GitHub token or try again later.");
        } finally {
            setGistExporting(false); // Turn off loading state
        }
    };




    return (
        <div>
            <Navbar />

            <div className="todo-list-container">
                <div className="header">
                    <h1>Todo Items</h1>
                </div>

                {loading ? (
                    <div className="loader-container">
                        <HashLoader />
                    </div>
                ) : (
                    <div>
                        <div className="header">
                            <h2>Project: {projectTitle}</h2> {/* Display the project title */}
                            {/* Export as Gist button */}
                            <button onClick={exportToGist} disabled={gistExporting}>
                                {gistExporting ? "Exporting..." : "Export as Gist"}
                            </button>
                        </div>
                        <div className="add-todo">
                            <input
                                type="text"
                                placeholder="New Todo Description"
                                value={newTodoDescription}
                                onChange={(e) => setNewTodoDescription(e.target.value)}
                            />
                            <button className="add-button" onClick={handleAddTodo}>
                                Add
                            </button>
                        </div>
                        <p>
                            <b>Summary: </b>
                            {completedTodos.length} /{" "}
                            {completedTodos.length + uncompletedTodos.length} todos completed
                        </p>

                        <div className="todo-section">
                            <h3>Pending</h3>
                            {uncompletedTodos.map((todo) => (
                                <div className="todo-box" key={todo.id}>
                                    <input
                                        type="checkbox"
                                        checked={false}
                                        onChange={() => handleCheckboxChange(todo.id, false)}
                                    />
                                    {editingTodoId === todo.id ? (
                                        <div className="edit-todo">
                                            <input
                                                type="text"
                                                value={editingDescription}
                                                onChange={(e) => setEditingDescription(e.target.value)}
                                            />
                                            <button onClick={() => handleUpdateDescription(todo.id)}>
                                                Save
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <p>{todo.description}</p>
                                            <button
                                                onClick={() =>
                                                    handleEditClick(todo.id, todo.description, false)
                                                }
                                            >
                                                ✎ Edit
                                            </button>
                                            <button onClick={() => handleDeleteTodo(todo.id)}>
                                                🗑 Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="todo-section">
                            <h3>Completed</h3>
                            {completedTodos.map((todo) => (
                                <div className="todo-box" key={todo.id}>
                                    <input
                                        type="checkbox"
                                        checked={true}
                                        onChange={() => handleCheckboxChange(todo.id, true)}
                                    />
                                    {editingTodoId === todo.id ? (
                                        <div className="edit-todo">
                                            <input
                                                type="text"
                                                value={editingDescription}
                                                onChange={(e) => setEditingDescription(e.target.value)}
                                            />
                                            <button onClick={() => handleUpdateDescription(todo.id)}>
                                                Save
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <p>{todo.description}</p>
                                            <button
                                                onClick={() =>
                                                    handleEditClick(todo.id, todo.description, true)
                                                }
                                            >
                                                ✎ Edit
                                            </button>
                                            <button onClick={() => handleDeleteTodo(todo.id)}>
                                                🗑 Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodoList;
