import os
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    """Create Flask application"""
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    frontend_dir = os.path.join(base_dir, 'frontend')
    app = Flask(__name__, static_folder=frontend_dir, static_url_path='')
    
    # Config
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///contacts.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'secret-key-change-in-production'
    
    # Init extensions
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)
    
    # Create tables (ensure models are imported before create_all)
    with app.app_context():
        from app import models  # noqa: F401
        db.create_all()
    
    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.contacts import contacts_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(contacts_bp)
    
    # Health check
    @app.route('/api/health', methods=['GET'])
    def health():
        return {'status': 'ok'}, 200

    # Serve frontend at root
    @app.route('/', methods=['GET'])
    def root():
        return app.send_static_file('index.html')
    
    return app
