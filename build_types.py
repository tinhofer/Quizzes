class BuildArgs:
    template_str = ""
    filepath = ""
    json_obj = None
    def __init__(self, path, jsonObj, template):
        self.filepath = path
        self.json_obj = jsonObj
        self.template_str = template

class ResultObj:
    str_HTML = ""
    my_args = None
    def __init__(self, html, args: BuildArgs):
        self.str_HTML = html
        self.my_args = args
