import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Flask backend URL

// Login user
export const loginUser = (username, password) => {
    return axios.post(`${API_URL}/login`, {}, {
        auth: {
            username,
            password,
        }
    });
};

// Register user
export const registerUser = (username, password) => {
    return axios.post(`${API_URL}/register`, { username, password }, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};



// Get projects
export const getProjects = () => {
    const token = localStorage.getItem("token")
    return axios.get(`${API_URL}/projects`, {
        headers: {
            'Authorization': `Basic ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

// Add project
export const addProject = (token, title) => {
    return axios.post(`${API_URL}/projects`, { title:title }, {
        headers: {
            'Authorization': `Basic ${token}`
        }
    });
};

// Update project title
export const updateProjectTitle = (token, projectId, newTitle) => {
    return axios.put(
        `${API_URL}/project/${projectId}`,
        { title: newTitle },
        {
            headers: {
                'Authorization': `Basic ${token}`,
                'Content-Type': 'application/json',
            },
        }
    );
};

// delete project
export const deleteProject = (projectId) =>{
    return axios.delete(`${API_URL}/project/${projectId}`,{
        headers:{
            'Authorization':`Basic ${localStorage.getItem('token')}`
        }
    });
}


// Get todos for a project
export const getTodos = (projectId) => {
    const token = localStorage.getItem("token")
    return axios.get(`${API_URL}/project/${projectId}/todos`, {
        headers: {
            'Authorization': `Basic ${token}`,
            'Content-Type': 'application/json',
        }
    });
};

// update todo status
export const updateTodoStatus = (todoId, status) => {
    return axios.put(`${API_URL}/todos/${todoId}`, { status }, {
        headers: {
            'Authorization': `Basic ${localStorage.getItem('token')}`
        }
    });
};

// update todo description
export const updateTodoDescription = (todoId, newDescription, isCompleted) => {
    return axios.put(`${API_URL}/todo/${todoId}/description`, {
        description: newDescription,
        is_completed: isCompleted,
    }, {
        headers: {
            'Authorization': `Basic ${localStorage.getItem('token')}`,
        }
    });
};



// delete todo
export const deleteTodo = (todoId) => {
    return axios.delete(`${API_URL}/todos/${todoId}`, {
        headers: {
            'Authorization': `Basic ${localStorage.getItem('token')}`
        }
    });
};



// Add a new todo
export const addTodo = async (projectId, description) => {
    const response = await axios.post(`${API_URL}/project/${projectId}/todos`, {
        description: description
    }, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you're using token-based auth
        }
    });
    return response.data;
};


const GITHUB_API_URL = 'https://api.github.com/gists';

/**
 * Creates a secret Gist on GitHub with the project summary.
 *
 * @param {string} title
 * @param {string} content 
 * @param {string} token
 * @returns {object} - The response data from GitHub API with details about the created Gist.
 */
export const createGist = async (title, content, token) => {
    const gistData = {
        description: title,
        public: false,
        files: {
            [`${title}.md`]: {
                content, 
            },
        },
    };

    try {
        const response = await axios.post(GITHUB_API_URL, gistData, {
            headers: {
                Authorization: `token ${token}`, // Provide the personal access token
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating Gist:', error);
        throw error;
    }
};