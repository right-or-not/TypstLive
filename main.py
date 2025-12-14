import os
from app import create_app, db, socketio
from app.models import User, CompilationHistory

# create app: default development config
app = create_app()


@app.shell_context_processor
def make_shell_context():
    return {
        "db": db,
        "User": User,
        "CompilationHistory": CompilationHistory
    }


def main():
    # GET HOST and PORT
    host = os.environ.get("FLASK_HOST", "127.0.0.1")
    port = int(os.environ.get('FLASK_PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    # print info
    print("Hello from TypstLive!")
    print(f"URL: http://{host}:{port}")
    print(f"Debug Mode: {debug}")
    
    # run Flask app
    socketio.run(
        app,
        host=host,
        port=port,
        debug=debug,
        use_reloader=False,
        allow_unsafe_werkzeug=True
    )


if __name__ == "__main__":
    main()
