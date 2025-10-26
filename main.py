import json, shutil, os, runpy
from build_types import *

def save_result(rObj: ResultObj, args: BuildArgs):
    webpath = args.json_obj["url"] + ".html"
    with open(f"{script_path}/static/" +  webpath, "w", encoding="utf-8") as f:
        f.write(rObj.str_HTML)
    print(f"Finished writing {args.json_obj["title"]}")

def run_builder(type: str, json_obj, templates):
    if not type.isalnum():
        raise "Invalid builder name in json!"
    builder_path = f"{script_path}/build_scripts/{type}.py"
    if os.path.exists(builder_path):
        args = BuildArgs(script_path, json_obj, templates[f"{type}.html"])
        builder_results = runpy.run_path(builder_path, init_globals={"__BUILD_ARGS__": args})
        rObj = builder_results["__RESULT_OBJ__"]
        if not isinstance(rObj, ResultObj):
            raise "Did not get valid result object from builder!"
        save_result(rObj, args)
        return rObj
    else:
        raise "Builder not found!"

def load_templates():
    templ = {}
    for f in os.listdir(f"{script_path}/templates"):
        if not f.endswith(".html"):
            continue
        else:
            with open(f"{script_path}/templates/{f}", encoding="utf-8") as template_file:
                templ[f] = template_file.read()
    print(f"Loaded {len(templ)} templates.")
    return templ

def build_index(quizzes: list[ResultObj]):
    my_templ = TEMPLATES["index.html"]
    links = []
    for r in quizzes:
        links.append({"url": r.my_args.json_obj["url"] + ".html", "name": r.my_args.json_obj["title"]})
    index = my_templ.replace(r"{{LINKS_JSON}}", json.dumps(links))
    with open(f"{script_path}/static/" +  "index.html", "w", encoding="utf-8") as f:
        f.write(index)
    print("Built index.html")


script_path = os.path.dirname(os.path.realpath(__file__))
print(f"Running from {script_path}!")
TEMPLATES = load_templates()


print("Clearing static directory...")
for root, dirs, files in os.walk(os.path.join(script_path, f'{script_path}/static')):
    for f in files:
        os.unlink(os.path.join(root, f))
    for d in dirs:
        try:
            shutil.rmtree(os.path.join(root, d))
        except:
            print("WARNING: Could not clear pub dir.")

quizzes = []
if not os.path.exists(f"{script_path}/static"):
    os.mkdir(f"{script_path}/static")

for f in os.listdir(f"{script_path}/questions"):
    if not f.endswith(".json"):
        continue
    print(f"Building file {f}:")
    with open(f"{script_path}/questions/" + f, encoding="utf-8") as q_f:
        jObj = json.loads(q_f.read())
        quizzes.append(run_builder(jObj["type"], jObj, TEMPLATES))
    

build_index(quizzes)

print("Copying static files...")
for f in os.listdir(f"{script_path}/requirements"):
    shutil.copy(f"{script_path}/requirements/{f}", f"{script_path}/static/{f}")


print("Finished.")
