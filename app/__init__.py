# import flask
from flask import Flask
# import expand package
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
# import config
from app.config import Config


# create expand instance
db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()
socketio = None


# create app
def create_app(config_mode=Config):
    """ create app instance and init config """

    # create app instance
    app = Flask(__name__)
    app.config.from_object(config_mode)
    
    # init expand instance
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    
    # login config
    login_manager.login_view = "auth.login"
    login_manager.login_message = "Please Login First!"
    login_manager.login_message_category = "info"
    
    # register blueprint
    from app.routes import main as main_blueprint
    from app.auth import auth as auth_blueprint
    app.register_blueprint(main_blueprint)
    app.register_blueprint(auth_blueprint, url_prefix="/auth")
    
    with app.app_context():
        db.create_all()
        
    global socketio
    from app.websocket import setup_socketio
    socketio = setup_socketio(app)
        
    return app
    

def get_socketio():
    return socketio