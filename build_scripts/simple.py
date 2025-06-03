import base64, json
from build_types import *

def simple_builder(args: BuildArgs):
    json_object = args.json_obj
    template_html = args.template_str
    q_str = base64.b64encode(json.dumps(json_object, ensure_ascii=False).encode("utf-8")).decode("utf-8")
    title = json_object["title"]
    print(f"Writing quiz {title}...")
    template_html = template_html.replace(r"{{QUESTIONS_B64}}", q_str)
    template_html = template_html.replace(r"{{quiz_title}}", title)
    
    globals()["__RESULT_OBJ__"] = ResultObj(template_html, args)


if not isinstance(globals()["__BUILD_ARGS__"], BuildArgs):
    print(globals().keys())
    raise "No build args are given!"

simple_builder(globals()["__BUILD_ARGS__"])