# Project Management Application

A simple project management application built using Flask for the backend and React for the frontend. This application allows users to create projects, manage tasks, and keep track of their progress.

## Features

- **User Authentication**: Users can register and log in to manage their projects.
- **Project Management**: Create,Edit, read, update, and delete projects.
- **Task Management**: Add, edit, delete, and mark tasks as completed for each project.
- **Export Gist**: Export project summaries as Gists to GitHub.

## Tech Stack

- **Frontend**: React, Axios
- **Backend**: Flask, Flask-SQLAlchemy
- **Database**: SQLite
- **Authentication**: Basic Authentication

## Installation

### Prerequisites

- Node.js (for frontend)
- Python 3.x (for backend)
- pip (for Python package management)
- Git (for version control)

### Clone the Repository

```bash
git clone https://github.com/<your-username>/project-management-app.git
cd project-management-app
```
### Frontend Setup
#### 1. Navigate to the frontend directory:
```bash
cd frontend
```

#### 2. Install dependencies:
```bash
npm install
```

#### 3. Create a .env file in the frontend directory and add your GitHub token :
```plaintext
REACT_APP_GITHUB_TOKEN='<your_github_token>'
```

#### 4. Start the React application:
```bash
npm start
```

### Backend Setup
#### 1. Navigate to the backend directory:
```bash
cd backend
```

#### 2. Install dependencies:
```bash
pip install -r requirements.txt
```

#### 3. Setup the database and run the server
```bash
python app.py
```


## Usage
1. Open your web browser and navigate to http://localhost:3000 for the frontend.
2. Use the application to manage your projects and tasks.

## Acknowledgements
- [Flask](https://flask.palletsprojects.com/) - for building the backend API.
- [Basic Authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication) - The application uses Basic Authentication for securing API endpoints.
- [Flask-SQLALchemy](https://flask-sqlalchemy.readthedocs.io/en/3.1.x/api/#module-flask_sqlalchemy) - Used for managing the database and providing Object-Relational Mapping (ORM) for database models.
- [React](https://reactjs.org/) - for providing a great frontend framework.
- [Axios](https://axios-http.com/docs/api_intro) - Used for handling HTTP requests in the project.
- [GitHub Gists](https://gist.github.com/) - for allowing easy export of project summaries.
