from flask import Blueprint, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models import User
from app.utils import validate_email, error, success

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register new user"""
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return error('Missing required fields', 400)
    
    if not validate_email(data['email']):
        return error('Invalid email format', 400)
    
    if len(data['password']) < 6:
        return error('Password must be 6+ characters', 400)
    
    if User.query.filter_by(email=data['email']).first():
        return error('Email already exists', 409)
    
    if User.query.filter_by(username=data['username']).first():
        return error('Username already taken', 409)
    
    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    return success(user.to_dict(), 'User registered', 201)

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return error('Missing email or password', 400)
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return error('Invalid credentials', 401)
    
    # Use string identity to avoid PyJWT "Subject must be a string" (422)
    token = create_access_token(identity=str(user.id))
    return success({'user': user.to_dict(), 'access_token': token}, 'Login successful')

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    """Get current user"""
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    
    if not user:
        return error('User not found', 404)
    
    return success(user.to_dict())
