from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import check_password_hash, generate_password_hash
from app import db
from app.models import User


# create blueprint of auth
auth = Blueprint("auth", __name__)



@auth.route("/login", methods=["GET", "POST"])
def login():
    """ User Login """
    if current_user.is_authenticated:
        return redirect(url_for("main.editor"))
    
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")
        remember = bool(request.form.get("remember"))
        
        # select the user: according to username
        user = User.query.filter_by(email=email).first()
        
        # check user and password
        if user and check_password_hash(user.password_hash, password):
            login_user(user, remember=remember)
            flash("Login Successfully!", "success")
            return redirect(url_for("main.editor"))
        else:
            flash("Your Email or Password is ERROR, Please Try Again!", "danger")
            return render_template("auth/login.html")
        
    return render_template("auth/login.html")






@auth.route("/register", methods=["GET", "POST"])
def register():
    """ User Register """
    
    return render_template("auth/register.html")




@auth.route("/logout")
@login_required
def logout():
    """ User Logout """
    pass