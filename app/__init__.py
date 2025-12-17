# import flask
from flask import Flask
# import expand package
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_socketio import SocketIO
# import config
from app.config import Config


# create expand instance
db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()
socketio = SocketIO()


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
    socketio.init_app(
        app,
        async_mode=app.config.get('SOCKETIO_ASYNC_MODE'),
        cors_allowed_origins="*",
        http_compression=False,
        ping_timeout=10,
        ping_interval=5
    )
    
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
        
    from app import websocket
        
    return app
    

def get_socketio():
    return socketio