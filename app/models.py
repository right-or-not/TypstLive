import os
from flask_login import UserMixin
from datetime import datetime, timezone
from app import db, login_manager


class User(UserMixin, db.Model):
    """ User Model """
    
    # table name
    __tablename__ = "users"
    
    # info in table
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # relationship with compilation history
    compilations = db.relationship("CompilationHistory", backref="user", lazy="dynamic")
    
    def __repr__(self):
        # return super().__repr__()
        return f"<User {self.username}>"
    


class CompilationHistory(db.Model):
    """ Compilation History """
    
    # table name
    __tablename__ = "compilation_history"
    
    # info in table
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    typst_code = db.Column(db.Text, nullable=False)
    image_path = db.Column(db.String(255), nullable=False)
    output_format = db.Column(db.String(10), default='png')
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    
    """ get url of image """
    def get_image_url(self):
        if 'static/images' in self.image_path:
            relative_path = self.image_path.split('static/outputs')[-1].lstrip('/')
            return f"/static/images/{relative_path}"
        else:
            filename = os.path.basename(self.image_path)
            return f"/static/images/{filename}"
        
    
    def __repr__(self):
        # return super().__repr__()
        return f"<CompilationHistory {self.id}>"


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
            

