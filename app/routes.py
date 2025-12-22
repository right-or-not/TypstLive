import os
import tempfile
import subprocess
from flask import Blueprint, render_template, request, jsonify, send_file, flash, redirect, url_for, current_app, Response
from flask_login import login_required, current_user
from datetime import datetime, timezone
from app import db
from app.models import User, CompilationHistory
from app.compiler import TypstRealtimeCompiler


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
    history_items = CompilationHistory.query.filter_by(user_id=current_user.id).order_by(CompilationHistory.created_at.desc()).all()
    return render_template("user/history.html", history_items=history_items)


@main.route("/api/like", methods=["POST"])
@login_required
def add_history():
    """ Save current code to history """
    try:
        data = request.get_json()
        code = data.get('code')
        env = data.get('env')
        if not code or not env:
            return jsonify({"status": "error", "message": "No code or environment provided.", "category": "danger"}), 400
        # create new history
        new_history = CompilationHistory(
            user_id=current_user.id,
            typst_code=code,
            current_environment=env
        )
        # commit the changes
        db.session.add(new_history)
        db.session.commit()
        return jsonify({"status": "success", "message": "Saved to My Favorites!", "category": "success"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e), "category": "danger"}), 500
    

@main.route("/api/history/<int:history_id>/delete", methods=["DELETE"])
@login_required
def delete_history(history_id):
    """ Delete History Item """
    try:
        item = CompilationHistory.query.get_or_404(history_id)
        # check the user id
        if item.user_id != current_user.id:
            return jsonify({"status": "error", "message": "Unauthorized"}), 403
        # commit the delete
        db.session.delete(item)
        db.session.commit()
        return jsonify({"status": "success", "message": "Removed from favorites."})
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500



@main.route("/history/image/<int:history_id>")
@login_required
def compile_typst_history(history_id):
    """ Compile Typst """
    item = CompilationHistory.query.get_or_404(history_id)
    
    # check user id
    if item.user_id != current_user.id:
        return "Unauthorized", 403

    # three diff environments
    code_content = item.typst_code
    if item.current_environment == 'inline-formula':
        code_content = f"${item.typst_code}$"
    if item.current_environment == 'interline-formula':
        code_content = f"$ {item.typst_code} $"
        
    try:
        with TypstRealtimeCompiler(user_id=current_user.id, session_id='history-compile') as compiler:
            result = compiler.compile_to_svg(code_content)
            if result['success']:
                svg_data = result['svg']
                return Response(svg_data, mimetype='image/svg+xml')
            else:
                print(f'[History Compile Error] {result["error"]}')
                error_svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="200" height="30"><text x="0" y="20" fill="red" font-family="monospace">Compile Error</text></svg>'
                return Response(error_svg, mimetype='image/svg+xml')
    except Exception as e:
        print(f'[History Compile Error] {e}')
        return Response('<svg><text>System Error</text></svg>', mimetype='image/svg+xml')
        






