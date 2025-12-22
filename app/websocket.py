# import Flask
from flask import request
from flask_login import current_user
from flask_socketio import emit, disconnect
from app import socketio
from app.compiler import TypstRealtimeCompiler


# Store Compilers
# {session_id: compiler_instance}
compilers = {}

# Store Users
# {user_id: set(session_id_1, session_id_2, ...)}
user_sessions = {}


# SocketIO Runner  
@socketio.on('connect')
def handle_connect():
    # get ID
    session_id = request.sid
    if not current_user.is_authenticated:
        print(f'[StockIO] Unregistered User Attempts to Connect | Session: {session_id}')
        disconnect()
        return False
    else:
        user_id = current_user.id
    
    # build compiler
    compilers[session_id] = TypstRealtimeCompiler(
        user_id=user_id,
        session_id=session_id
    )
    
    # add session to User
    if user_id not in user_sessions:
        user_sessions[user_id] = set()
    user_sessions[user_id].add(session_id)
    active_connections = len(user_sessions[user_id])
    
    # emit info
    print(f'[SocketIO] Connect Client | User: "{user_id}" | Session: "{session_id}" | Active Connections: {active_connections}')
    emit('connected', {
        'message': 'Connect to Typst Compiler',
        'user_id': user_id,
        'session_id': session_id,
        'active_connections': active_connections
    })


@socketio.on('disconnect')
def handle_disconnect():
    session_id = request.sid
    
    if session_id in compilers:
        compiler = compilers[session_id]
        user_id = compiler.user_id
        
        # clean compilers
        compiler.cleanup()
        del compilers[session_id]
        
        # clean session in User
        if user_id in user_sessions:
            user_sessions[user_id].discard(session_id)
            if not user_sessions[user_id]:
                del user_sessions[user_id]
                print(f'[SocketIO] User "{user_id}" Disconnect All Connections!')
            else:
                print(f'[SocketIO] User "{user_id}" Disconnect One Connection | Active Connections: {len(user_sessions[user_id])}')
        
        # emit info
        print(f'[SocketIO] Disconnect Client | User: "{user_id}" | Session: "{session_id}"')

@socketio.on('compile')
def handle_compile(data):
    session_id = request.sid
    
    try:
        typst_code = data.get('code', '')
        
        # check empty Typst Code
        if not typst_code.strip():
            emit('compile_result', {
                'success': False,
                'error': 'Typst Code is Empty'
            })
            return None
        
        # get compiler
        compiler = compilers.get(session_id)
        if not compiler:
            emit('compile_result', {
                'success': False,
                'error': 'Do not Init Compiler, Please Refresh the Page!'
            })
            return None
        
        # compile the Typst Code
        result = compiler.compile_to_svg(typst_code)
        
        # emit result
        emit('compile_result', result)
        
    except Exception as e:
        print(f'[SocketIO] Compile Error: {e}')
        emit('compile_result', {
            'success': False,
            'error': f'Server Processing Error: {str(e)}'
        })

@socketio.on('ping')
def handle_ping():
    session_id = request.sid
    compiler = compilers.get(session_id)
    emit('pong', {
        'timestamp': session_id,
        'user_id': compiler.user_id if compiler else None,
        'session_id': session_id,
        'compile_count': compiler.compile_count if compiler else 0
    })
    
@socketio.on('stats')
def handle_stats():
    session_id = request.sid
    compiler = compilers.get(session_id)
    
    if compiler:
        user_id = compiler.user_id
        compile_count = compiler.compile_count
        active_connections = len(user_sessions.get(user_id, []))
        total_users = len(user_sessions)
        emit('stats', {
            'user_id': user_id,
            'session_id': session_id,
            'compile_count': compile_count,
            'active_connections': active_connections,
            'total_users': total_users
        })