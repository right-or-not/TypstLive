import os
import uuid
from flask import Blueprint, render_template, request, jsonify, send_file, flash, redirect, url_for, current_app
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



@main.route("/info")
@login_required
def info():
    """ Display User Information """
    return render_template("user/info.html")


@main.route("/profile", methods=["GET", "POST"])
@login_required
def profile():
    """ Edit Profile """
    
    if request.method == "POST":
        try:
            # get new info
            gender = request.form.get("gender")
            phone_number = request.form.get("phone_number")
            birthday = request.form.get("birthday")
            signature = request.form.get("signature")
            bio = request.form.get("bio")
            
            # update new info
            # gender
            current_user.gender = gender
            # phone_number
            current_user.phone_number = phone_number if phone_number and phone_number.strip() else None
            # birthday
            if birthday:
                try:
                    current_user.birthday = datetime.strptime(birthday, '%Y-%m-%d').date()
                except ValueError:
                    flash("Invalid Date Format!", "warning")
            else:
                current_user.birthday = None
            # signature
            current_user.signature = signature if signature and signature.strip() else None
            # bio
            current_user.bio = bio if bio and bio.strip() else None
            # avatar
            if 'avatar' in request.files:
                file = request.files['avatar']
                if file and file.filename != '':
                    try:
                        filename = f"{current_user.id}.jpg"
                        upload_folder = os.path.join(current_app.root_path, 'static', 'images', 'avatars')
                        if not os.path.exists(upload_folder):
                            os.makedirs(upload_folder)
                        file_path = os.path.join(upload_folder, filename)
                        file.save(file_path)
                        current_user.avatar_path = f"static/images/avatars/{filename}"
                        print(f'[Image Upload] Avatar save to: {file_path}')
                    except Exception as e:
                        print(f'[ERROR] Failed to save avatar: {e}')
                        flash("Failed to upload avatat!", "danger")
            # commit the changes
            db.session.commit()
            flash("Update Request Received!", "success")
            return redirect(url_for("main.profile"))
        except Exception as e:
            db.session.rollback()
            print(f'[Database Error] {e}')
            if "UNIQUE constraint failed" in str(e) or "Duplicate entry" in str(e):
                flash("Update Failed: Phone number might already be in use.", "danger")
            else:
                flash(f"Update Failed: {str(e)}", "danger")
            return redirect(url_for("main.profile"))
    
    return render_template("user/profile.html")



@main.route("/history")
@login_required
def history():
    """ Compilation History """
    
    return render_template("user/history.html")




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





