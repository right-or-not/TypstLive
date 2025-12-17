import os
import json
import hashlib
import subprocess
import importlib.util
from pathlib import Path

class ToolboxBuilder:
    def __init__(self, source_path, js_output_path, js_var_name, img_output_dir, web_img_prefix="/static/img/toolbox"):
        """
        初始化构建器
        :param source_path: 数据源 .py 文件的绝对或相对路径
        :param js_output_path: 输出 .js 文件的路径
        :param js_var_name: JS 文件中导出的常量名称 (如 TOOLBOX_DATA)
        :param img_output_dir: Typst 编译出的 PNG 图片存放的本地目录
        :param web_img_prefix: 前端访问图片的 URL 前缀 (用于生成 JS 中的 path 字段)
        """
        self.source_path = Path(source_path).resolve()
        self.js_output_path = Path(js_output_path).resolve()
        self.js_var_name = js_var_name
        self.img_output_dir = Path(img_output_dir).resolve()
        self.web_img_prefix = web_img_prefix
        
        # Typst 编译模板：自动宽高，透明或白色背景，字体大小调整
        self.typst_template = """
#set page(width: auto, height: auto, margin: 1pt, fill: none)
#set text(size: 20pt)
#set par(leading: 1pt)

{code}
"""

    def load_source_data(self):
        """动态加载数据源 .py 文件"""
        if not self.source_path.exists():
            raise FileNotFoundError(f"Source file not found: {self.source_path}")
        
        spec = importlib.util.spec_from_file_location("toolbox_source", self.source_path)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        return module
    
    
    def get_safe_filename(self, prefix, identifier): 
        short_hash = hashlib.md5(identifier.encode('utf-8')).hexdigest()[:4]
        safe_id = "".join([c if c.isalnum() else "_" for c in identifier])
        return f"{prefix}_{safe_id}_{short_hash}"
    

    def compile_typst_to_png(self, typst_code, filename_stem):
        """ compile Typst code to PNG | return: path """
        # 1. 准备目录
        if not self.img_output_dir.exists():
            self.img_output_dir.mkdir(parents=True, exist_ok=True)

        # 2. 构造临时 Typst 文件
        temp_typ_file = self.img_output_dir / f"{filename_stem}.typ"
        output_png_file = self.img_output_dir / f"{filename_stem}.png"
        
        full_code = self.typst_template.format(code=typst_code)
        
        with open(temp_typ_file, 'w', encoding='utf-8') as f:
            f.write(full_code)

        # 3. 调用 Typst CLI
        # --ppi 144 保证高清屏显示清晰
        try:
            cmd = ["typst", "compile", str(temp_typ_file), str(output_png_file), "--ppi", "144"]
            subprocess.run(cmd, check=True, capture_output=True)
            # print(f"  [Compiled] {filename_stem}.png")
        except subprocess.CalledProcessError as e:
            print(f"  [Error] Failed to compile {filename_stem}: {e.stderr.decode()}")
            return None
        finally:
            # 清理临时 .typ 文件
            if temp_typ_file.exists():
                os.remove(temp_typ_file)

        # 4. 返回 Web 路径
        # 拼接 URL，注意 Windows 下路径分隔符替换
        return f"{self.web_img_prefix}/{filename_stem}.png"

    def build(self):
        """ main build function """
        print(f"[Running] Starting Build Process...")
        print(f"[File] Source: {self.source_path}")
        print(f"[File] Image Dir: {self.img_output_dir}")

        data_module = self.load_source_data()
        
        # 这里的命名需要和源文件里的变量名一致
        categories = getattr(data_module, 'category', [])
        groups_map = getattr(data_module, 'groups', {})
        items_map = getattr(data_module, 'items', {})

        final_data = []

        # --- 遍历 Category ---
        for cat_name in categories:
            print(f"\nProcessing Category: {cat_name}")
            cat_obj = {
                "category": cat_name,
                "groups": []
            }

            # 获取该分类下的小组数据
            # 注意：源文件中 groups 可能是 list (简单定义) 或 dict (详细定义)
            # 我们这里主要处理 dict 情况，如果是 list 则跳过或仅用名字
            cat_groups_data = groups_map.get(cat_name, {})

            if isinstance(cat_groups_data, list):
                print(f"  ⚠️ Warning: Group data for '{cat_name}' is a list. Skipping detail compilation. Please convert to dict in source.")
                continue

            # --- 遍历 Group ---
            for group_id, group_info in cat_groups_data.items():
                print(f"  Processing Group: {group_info.get('name', group_id)}")
                
                # 1. 编译 Group Icon
                group_icon_code = group_info.get('icon_code', '')
                group_path = None
                if group_icon_code:
                    file_stem = self.get_safe_filename("group", group_id)
                    group_path = self.compile_typst_to_png(group_icon_code, file_stem)

                group_obj = {
                    "id": group_info.get('id', group_id),
                    "name": group_info.get('name', group_id),
                    "path": group_path, # 生成的图片路径
                    "icon": "", # 留空，因为我们优先用 path
                    "items": []
                }

                # --- 遍历 Items ---
                # 在 items_map 中查找属于该 group_id 的 items
                group_items = items_map.get(group_id, {})
                
                for item_key, item_info in group_items.items():
                    # 2. 编译 Item Icon
                    # 优先使用 icon_code，如果没有，可以用 display 兜底（如果 display 是纯文本）
                    item_code_for_typst = item_info.get('icon_code', item_info.get('display', ''))
                    item_path = None
                    
                    if item_code_for_typst:
                        unique_key = f"{group_id}_{item_key}"
                        file_stem = self.get_safe_filename("item", unique_key)
                        item_path = self.compile_typst_to_png(item_code_for_typst, file_stem)

                    item_obj = {
                        "code": item_info.get('code', ''),
                        "display": "", # 留空，优先用 path
                        "path": item_path,
                        "desc": item_info.get('desc', item_info.get('code', '')),
                        "move": item_info.get('move', 0)
                    }
                    group_obj["items"].append(item_obj)

                cat_obj["groups"].append(group_obj)
            
            final_data.append(cat_obj)

        # --- 生成 JS 文件 ---
        self.write_js_file(final_data)
        print(f"\n✅ Build Complete! JS saved to: {self.js_output_path}")

    def write_js_file(self, data):
        """将处理后的数据写入 JS 文件"""
        json_str = json.dumps(data, indent=4, ensure_ascii=False)
        content = f"// This file is auto-generated by build_toolbox.py\n// Do not edit manually.\n\nexport const {self.js_var_name} = {json_str};\n"
        
        with open(self.js_output_path, 'w', encoding='utf-8') as f:
            f.write(content)

# ==========================================
# 脚本入口
# ==========================================
if __name__ == "__main__":
    # 配置参数
    current_dir = Path(__file__).parent
    
    # parameters
    # 源文件路径
    SOURCE_FILE = current_dir / "TOOLBOX_DATA.py"
    
    # JS 输出文件路径
    JS_OUTPUT = current_dir.parent / "static" / "js" / "TOOLBOX_DATA_SOURCE.js"
    
    # PNG 输出文件路径
    IMG_OUTPUT_DIR = current_dir.parent / "static" / "images" / "icons"
    
    # 前端访问时的路径前缀
    WEB_PREFIX = "/static/images/icons"

    # 运行构建
    try:
        builder = ToolboxBuilder(
            source_path=SOURCE_FILE,
            js_output_path=JS_OUTPUT,
            js_var_name="TOOLBOX_DATA",
            img_output_dir=IMG_OUTPUT_DIR,
            web_img_prefix=WEB_PREFIX
        )
        builder.build()
    except Exception as e:
        print(f"\n❌ Critical Error: {e}")