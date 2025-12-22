import os
import shutil
import tempfile
import subprocess

# Prelude Code
TYPST_PRELUDE = """
#set page(width: auto, height: auto, margin: 20pt)
#set text(size: 24pt)
"""

class TypstRealtimeCompiler:
    """Typst Realtime Compiler"""
    def __init__(self, user_id=None, session_id=None):
        self.user_id = user_id
        self.session_id = session_id
        self.compile_count = 0
        self.temp_dir = tempfile.mkdtemp()
        
    def __enter__(self):
        return self
        
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.cleanup()
    
    def compile_to_svg(self, typst_code):
        """Compile Typst Code to SVG"""
        self.compile_count += 1
        
        try:
            # build temp file
            input_file = os.path.join(self.temp_dir, "input.typ")
            output_file = os.path.join(self.temp_dir, "output.svg")
            full_code = TYPST_PRELUDE + "\n" + typst_code
            
            # write Typst Code 
            with open(input_file, 'w', encoding='utf-8') as f:
                f.write(full_code)
            
            # run typst compile
            result = subprocess.run(
                ['typst', 'compile', input_file, output_file, '--format', 'svg'],
                capture_output=True,
                text=True,
                timeout=5
            )
            
            # check result
            if result.returncode == 0 and os.path.exists(output_file):
                # read SVG file
                with open(output_file, 'r', encoding='utf-8') as f:
                    svg_content = f.read()
                                    
                return {
                    'success': True,
                    'svg': svg_content,
                    'user_id': self.user_id,
                    'session_id': self.session_id,
                    'compile_count': self.compile_count
                }
            else:
                error_msg = result.stderr or "Compile Failed"
                return {
                    'success': False,
                    'error': self._process_error_message(error_msg)
                }
                
        except subprocess.TimeoutExpired:
            return {
                'success': False,
                'error': 'Compilation Timeout!'
            }
        except FileNotFoundError:
            return {
                'success': False,
                'error': 'Typst do not in PATH!'
            }
        except Exception as e:
            return {
                'success': False,
                'error': f'Compile Error: {str(e)}'
            }
    
    def _process_error_message(self, error_msg):
        """process error message"""
        return error_msg
    
    def cleanup(self):
        """clean temp files"""
        try:
            if os.path.exists(self.temp_dir):
                shutil.rmtree(self.temp_dir)
            print(f'[SocketIO] Clean up Compiler | User: "{self.user_id}" | Session: "{self.session_id}" | Active Connections: {self.compile_count}')
        except Exception as e:
            print(f"Clean TEMP Files Failed: {e}")