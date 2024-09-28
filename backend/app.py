from flask import Flask, jsonify, request
from flask_httpauth import HTTPBasicAuth
from flask_cors import CORS
from config import Config
from model import User, Project, Todo, db

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
auth = HTTPBasicAuth()

# Enable CORS for all routes
CORS(app)


# Authentication function
@auth.verify_password
def verify_password(username, password):
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        return user
    return None

# user registration
@app.route('/register', methods=['POST'])
def create_user():
    data = request.get_json()
    
    username = data.get('username')
    password = data.get('password')
    
    # checking missing fields
    if not username or not password:
        return jsonify({'message':"All fields are required"}),400
        
    # checking user existance
    if User.query.filter_by(username=username).first():
        return jsonify({'message':'Username already exists'}),400
    
    
    # create new user and hash the password
    new_user = User(username=username)
    new_user.set_password(password)
    
    # adding to db
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message':"User registration successfull"}),201



# CHECK USER
@app.route('/usersl', methods=['GET'])
def usersl():
    users = User.query.all()
    users_list = [{'id':user.id, 'name':user.username, 'password':user.password_hash}for user in users]
    return jsonify({'users':users_list}),200

# login function
@app.route('/login',methods=['POST'])
def login():
    data = request.get_json()
    
    username = data.get('username')
    password = data.get('password')
    
    # validate input data
    if not username or not password:
        return jsonify({'message':"Both username and password are required"})
    
    # fetching user from db
    user = User.query.filter_by(username=username).first()
    
    # check if user exists and password is correct
    if not user or not user.check_password(password):
        return jsonify({'message':"Invalid username or password"})
    
    # if successfull
    return jsonify({'message':f'Welcome, {user.username},{user.password_hash}'}),200


# to create project
@app.route('/projects', methods=['POST'])
@auth.login_required
def create_project():
    data = request.get_json()
    title = data.get('title')
    
    
    if not title:
        return jsonify({'message':"Project title is required"}),400
    
    if Project.query.filter_by(user_id=auth.current_user().id,title=title).first():
        return jsonify({'message':'Project exists'}),400
    
    # create project
    new_project = Project(title=title, user_id=auth.current_user().id)
    
    # add project to session
    db.session.add(new_project)
    db.session.commit()
    
    return jsonify({'message':"Project created successfully", "project_id":new_project.id, "user":new_project.user_id}), 201

# to list project
@app.route('/projects', methods=['GET'])
@auth.login_required
def list_projects():
    
    projects= Project.query.filter_by(user_id=auth.current_user().id).all()
    projects_list = [{"id":project.id, "title":project.title, "created_date":project.created_date} for project in projects]
    
    
    return jsonify({'projects':projects_list}),200

# to update project title
@app.route('/project/<int:project_id>', methods=['PUT'])
@auth.login_required
def update_project_title(project_id):
    user = auth.current_user()
    project = Project.query.filter_by(id=project_id, user_id=user.id).first()
    
    if project is None:
        return jsonify({'message':'Project not found or access denied'}),404
    
    data = request.get_json()
    new_title = data.get('title')
    if not new_title:
        return jsonify({'message':'Title is required'}),400
    
    project.title = new_title
    db.session.commit()
    return jsonify({'message':'Project title updated successfully'}),200

# delete project
@app.route('/project/<int:project_id>', methods=['DELETE'])
@auth.login_required
def delete_project(project_id):
    user = auth.current_user()
    project = project = Project.query.filter_by(id=project_id, user_id=user.id).first()

    if project is None:
        return jsonify({'message':'Project not found or access denied'})
    
    db.session.delete(project)
    db.session.commit()
    
    return jsonify({'message':'Project deleted successfully'})



# create project todo
@app.route('/project/<int:project_id>/todos', methods=['POST'])
@auth.login_required()
def create_todo(project_id):
    user = auth.current_user()
    project = Project.query.filter_by(id=project_id, user_id=user.id).first()
    if project is None:
        return jsonify({'message':'Project not found or unauthorized access'}),400
    
    data = request.get_json()
    description = data.get('description')    
    
    if not description:
        return jsonify({'message':'Description is required'}),400
    
    # checking existance
    if Todo.query.filter_by(description=description, project_id=project_id).first():
        return jsonify({'message':'description alrady existed to this specific project'}),404
    
    new_todo = Todo(description=description,  project_id = project.id)
    db.session.add(new_todo)
    db.session.commit()
    
    return jsonify({'message':'Todo created!', "todo_id":new_todo.id, "status":new_todo.status, "user id":project.user_id})


    
    
# list all todos for specific project
@app.route('/project/<int:project_id>/todos', methods=['GET'])
@auth.login_required
def list_todo(project_id):
    user = auth.current_user()
    project = Project.query.filter_by(id=project_id, user_id=user.id).first()
    
    
    if project is None:
        return jsonify({'message':'Project not found or Invalid access'}),404
    
    completed_todos = Todo.query.filter_by(project_id=project_id, status=True).all()
    uncompleted_todos = Todo.query.filter_by(project_id=project_id, status=False).all()
    
    return jsonify({
        "project_title": project.title,
        "completed_todos": [
            {"id": todo.id, "description": todo.description, "status": todo.status} for todo in completed_todos
        ],
        "uncompleted_todos": [
            {"id": todo.id, "description": todo.description, "status": todo.status} for todo in uncompleted_todos
        ]
    }), 200


# Update todo status
@app.route('/todos/<int:todo_id>', methods=['PUT'])
@auth.login_required
def update_todo_status(todo_id):
    user = auth.current_user()
    todo = Todo.query.join(Project).filter(
        Todo.id == todo_id, 
        Project.user_id == user.id
    ).first()

    if not todo:
        return jsonify({"message": "Todo not found"}), 404

    data = request.get_json()
    todo.status = data.get('status')  # Update status based on the incoming request
    db.session.commit()

    return jsonify({"message": "Todo status updated", "status": todo.status}), 200

# update todo descriptio
@app.route('/todo/<int:todo_id>/description', methods=['PUT'])
def update_todo_description(todo_id):
    data = request.json
    description = data.get('description')

    # Retrieve the todo by its ID
    todo = Todo.query.get(todo_id)
    if not todo:
        return jsonify({'error': 'Todo not found'}), 404

    # Update the todo's description only
    if description:
        todo.description = description
        db.session.commit()  # Commit the changes to the database
        return jsonify({'message': 'Todo description updated successfully', 'todo': {
            'id': todo.id,
            'description': todo.description
        }}), 200
    else:
        return jsonify({'error': 'Description cannot be empty'}), 400

# delete todo from project
@app.route('/todos/<int:todo_id>', methods=['DELETE'])
@auth.login_required
def delete_todo(todo_id):
    user = auth.current_user()
    todo = Todo.query.join(Project).filter(Todo.id == todo_id, Project.user_id == user.id).first()
    
    if todo is None:
        return jsonify({'message':'Todo not fount or invalid access'})
    
    db.session.delete(todo)
    db.session.commit()
    
    return jsonify({'message':'Todo delete successfully'}),200
    
        

    

    
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)