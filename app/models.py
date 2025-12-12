import os
from flask_login import UserMixin
from datetime import datetime, timezone, date
from app import db, login_manager


class User(UserMixin, db.Model):
    """ User Model """
    
    # table name
    __tablename__ = "users"
    
    # info in table
    # Basic info
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64, collation="utf8mb4_unicode_ci"), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.Text, nullable=False)
    # profile info
    gender = db.Column(db.String(10), default='Secret') 
    birthday = db.Column(db.Date, nullable=True)
    bio = db.Column(db.Text, nullable=True)
    signature = db.Column(db.String(255), nullable=True)
    avatar_path = db.Column(db.String(255), default='static/images/avatars/default.png')
    # time stamp
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # relationship with compilation history
    compilations = db.relationship("CompilationHistory", backref="user", lazy="dynamic")
    
    def get_avatar_url(self):
        """ get avatar URL """
        if self.avatar_path:
            if self.avatar_path.startswith("static/"):
                return f"/{self.avatar_path}"
            return f"/static/images/avatars/{self.avatar_path}"
        return "/static/images/avatars/default/avator-female.png" if self.gender == "Female" else "/static/images/avatars/default/avator-male.png"
    
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
        if not self.image_path:
            return ""
        
        # normalize path
        normalized_path = self.image_path.replace('\\', '/')
        if 'static/images/outputs' in normalized_path:
            filename = os.path.basename(normalized_path)
            return f"/static/images/outputs/{filename}"
        else:
            filename = os.path.basename(normalized_path)
            return f"/static/images/outputs/{filename}"
        
    
    def __repr__(self):
        # return super().__repr__()
        return f"<CompilationHistory {self.id}>"


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
            

