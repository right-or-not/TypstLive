import os
import tempfile
import subprocess
from flask import Blueprint, render_template, request, jsonify, send_file, flash, redirect, url_for, current_app, Response
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

    preamble = """
#set page(width: auto, height: auto, margin: 10pt)
#set text(size: 14pt)
"""
    full_code = ""
    
    if item.current_environment == 'passage':
        full_code = f"{preamble}\n{item.typst_code}"
    elif item.current_environment == 'inline-formula':
        # 行内公式，两边加 $
        full_code = f"{preamble}\n$ {item.typst_code} $"
    elif item.current_environment == 'interline-formula':
        # 行间公式，两边加 $，通常 Typst 会自动居中内容，
        # 但我们这里的居中主要靠前端 CSS 控制 SVG 在容器中的位置
        full_code = f"{preamble}\n$ {item.typst_code} $"
    else:
        full_code = f"{preamble}\n{item.typst_code}"

    try:
        # 2. 创建临时文件进行编译
        with tempfile.NamedTemporaryFile(suffix=".typ", delete=False) as f_typ:
            f_typ.write(full_code.encode('utf-8'))
            typ_path = f_typ.name
            
        svg_path = typ_path.replace(".typ", ".svg")
        
        # 3. 调用 Typst CLI 编译 (确保服务器已安装 typst 命令行工具)
        # --root . 确保能引用其他文件(如果有)
        process = subprocess.run(
            ["typst", "compile", typ_path, svg_path],
            capture_output=True,
            text=True
        )
        
        if process.returncode != 0:
            # 编译失败，返回错误 SVG 或 400
            print(f"Compilation Error: {process.stderr}")
            return Response('<svg height="30" width="200"><text x="0" y="15" fill="red">Error</text></svg>', mimetype='image/svg+xml')

        # 4. 返回生成的 SVG 文件
        return send_file(svg_path, mimetype='image/svg+xml')

    except Exception as e:
        print(f"Render Error: {e}")
        return Response('<svg height="30" width="200"><text x="0" y="15" fill="red">Server Error</text></svg>', mimetype='image/svg+xml')
    finally:
        # 清理临时文件 (可选，Linux下 /tmp 通常会自动清理，但最好手动处理)
        try:
            if 'typ_path' in locals() and os.path.exists(typ_path):
                os.remove(typ_path)
            if 'svg_path' in locals() and os.path.exists(svg_path):
                os.remove(svg_path)
        except:
            pass






