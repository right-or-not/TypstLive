import os
import uuid
from flask import Blueprint, render_template, request, jsonify, send_file, flash, redirect, url_for
from flask_login import login_required, current_user
from datetime import datetime, timezone
from app import db
from app.models import User, CompilationHistory
# from app.utils import compile_typst_to_image


# create blueprint of main routes
main = Blueprint("main", __name__)



@main.route("/")
def index():
    """ Home """
    if current_user.is_authenticated:
        return redirect(url_for("main.editor"))
    return redirect(url_for("auth.login"))


@main.route("/editor")
@login_required
def editor():
    """ Formula Editor """
    return render_template("editor.html")


@main.route("/profile", methods=["GET", "POST"])
@login_required
def profile():
    """ Edit Profile """
    
    """
    # POST: form
    if request.method == "POST":
        # get form information
        username = request.form.get("username")
        email = request.form.get("email")
        
        # check: none
        if not username or not email:
            flash("Username and Email cannot be Empty!", "danger")
            return render_template("profile.html")
        
        # check: username occupied
        existing_user = User.query.filter(
            User.username == username,
            User.id != current_user.id
        ).first()
        if existing_user:
            flash("Username Occupied!", "danger")
            return render_template("profile.html")
        
        # check: email occupied
        existing_email = User.query.filter(
            User.email == email,
            User.id != current_user.id
        ).first()
        if existing_email:
            flash("Email Occupied!", "danger")
            return render_template("profile.html")
        
        # update user info
        current_user.username = username
        current_user.email = email
        current_user.update_at = datetime.now(timezone.utc)
        
        db.session.commit()
        flash("Personal Information Updated Successfully!", "success")
        return redirect(url_for("main.profile"))
    """
    
    return render_template("profile.html")



@main.route("/history")
@login_required
def history():
    """ Compilation History """
    
    return render_template("history.html")




@main.route("/api/compile", methods=["POST"])
@login_required
def compile_typst():
    """ Compile Typst """
    pass




@main.route("/api/history/<int:history_id>")
@login_required
def get_history(history_id):
    """ Get History """
    pass





@main.route("/api/history/<int:history_id>/delete", methods=["DELETE"])
@login_required
def delete_history(history_id):
    """ Delete History """ 
    pass




@main.route("/download/<int:history_id>")
@login_required
def download_image(history_id):
    """ Download Figure """
    pass





