import os
from datetime import timedelta


# Basic Config
class Config:
    """ Basic Config """
    
    # secret key
    SECRET_KEY = os.environ.get("SECRET_KEY") or "dev-secret-key-change-in-production"

    # database
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'mysql+pymysql://typstliveuser:20050430#_He@localhost/typstlive_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # session lifetime
    # PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    
    # upload file
    # max file size: 16MB
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
    
    # upload folder
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'static', 'outputs')
    ALLOWED_EXTENSIONS = {'png', 'svg', 'pdf'}
    
    # Typst
    TYPST_COMPILER_PATH = os.environ.get('TYPST_COMPILER_PATH') or 'typst'
    TYPST_OUTPUT_FORMAT = 'png'
    
    # development
    DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    

class DevelopmentConfig(Config):
    """ Development Environment """
    
    DEBUG = True
    SQLALCHEMY_ECHO = True
    
    
class ProductionConfig(Config):
    """ Production Environment """
    
    DEBUG = False
    SECRET_KEY = os.environ.get('SECRET_KEY')
    
    
class TestingConfig(Config):
    """ Testing Environment """
    
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    
    
# config map
config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
    "default": DevelopmentConfig,
}
    
    