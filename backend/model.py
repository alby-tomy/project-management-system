from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    """User model for storing user information."""
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'

class Project(db.Model):
    """Project model for storing project information."""
    id = db.Column(db.Integer, primary_key=True) 
    title = db.Column(db.String(100), nullable=False) 
    created_date = db.Column(db.DateTime, default=datetime.utcnow) 
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False) 

    # Relationships
    user = db.relationship('User', backref='projects')  
    todos = db.relationship('Todo', backref='project', lazy=True)  # Relationship with Todo


    def __repr__(self):
        return f'<Project {self.title}>'

class Todo(db.Model):
    """Todo model for storing task information associated with a project."""
    id = db.Column(db.Integer, primary_key=True)  #
    description = db.Column(db.String(500), nullable=False)
    status = db.Column(db.Boolean, default=False)  # Status (Completed/Not Completed)
    created_date = db.Column(db.DateTime, default=datetime.utcnow) 
    updated_date = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) 
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)  # Associated Project ID

    def __repr__(self):
        return f'<Todo {self.description}>'
