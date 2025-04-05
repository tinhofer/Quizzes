import json, shutil, os, base64

def simple_builder(json_object):
    q_str = base64.b64encode(json.dumps(json_object, ensure_ascii=False).encode("utf-8")).decode("utf-8")
    title = json_object["title"]
    print(f"Writing quiz {title}...")
    with open(f"{script_path}/template.html", encoding="utf-8") as template_file:
        template_html = template_file.read()
        template_html = template_html.replace(r"{{QUESTIONS_B64}}", q_str)
        #template_html = template_html.replace(r"{{return_url}}", json_object["return_url"])
        template_html = template_html.replace(r"{{quiz_title}}", title)
        with open(f"{script_path}/public/" + json_object["url"] + ".html" , "w", encoding="utf-8") as f:
            f.write(template_html)

def find_builder(type):
    if type == "simple":
        return simple_builder



script_path = os.path.dirname(os.path.realpath(__file__))
print(f"Running from {script_path}!")
print("Clearing public directory...")
for root, dirs, files in os.walk(os.path.join(script_path, f'{script_path}/public')):
    for f in files:
        os.unlink(os.path.join(root, f))
    for d in dirs:
        try:
            shutil.rmtree(os.path.join(root, d))
        except:
            print("WARNING: Could not clear pub dir.")


for f in os.listdir(f"{script_path}/questions"):
    if not f.endswith(".json"):
        continue
    print(f"Building file {f}:")
    with open(f"{script_path}/questions/" + f, encoding="utf-8") as q_f:
        jObj = json.loads(q_f.read())
        builder = find_builder(jObj["type"])
        builder(jObj)

shutil.copy(f"{script_path}/style.css", f"{script_path}/public/style.css")
shutil.copy(f"{script_path}/script.js", f"{script_path}/public/script.js")