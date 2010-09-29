#===============================================================================
import tornado.httpserver
import tornado.ioloop
import tornado.web
from tornado.escape import json_encode
import random
import time
import os

settings = {
    "static_path": os.path.join(os.path.dirname(__file__),"static")
}

def read(file):
    """ get the whole file and cloes it"""
    with open(file) as file:
        return file.read()


class WorkSpace():

    def __init__(self):
        self.boards = []

    def findPad(self, id):
        for board in self.boards:
            for pad in board.pads:
                if pad.id == id:
                    return pad

class Board():

    def __init__(self):
        self.pads = []


class Pad():

    def __init__(self):
        self.name = ""
        self.text = ""

    def save(self):
        with open(self.name,'w') as file:
            file.write(self.text)


space = [
    ["re_edit.py"],
    ["static/main.css","static/main.js"],
    ["html/workspace.html"]
]

def lang(filename):
    if ".py" in filename:
        return "python"
    if ".css" in filename:
        return "css"
    if ".js" in filename:
        return "javascript"
    if ".html" in filename:
        return "htmlmixed"

ws = WorkSpace()
m = 0
for l in space:
    b = Board()
    for f in l:
        p = Pad()
        p.id = m
        m += 1
        p.name = f
        p.lang = lang(f)
        p.text = read(f)
        b.pads.append(p)
    ws.boards.append(b)

class MainHandler(tornado.web.RequestHandler):
    """
        handles the loading of the main board
    """    
    def get(self):
    
        WORKSPACE = tornado.template.Template(open('html/workspace.html').read())
        self.finish(WORKSPACE.generate(ws=ws))
        

class UpdateHandler(tornado.web.RequestHandler):
    """
        handles the loading of the main board
    """    
    def post(self):
        text = self.get_argument("text")
        id = int(self.get_argument("id"))
        pad = ws.findPad(id)
        pad.text = text
        pad.save()
        print text
 
application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/update.ajax", UpdateHandler),
], **settings)

if __name__ == "__main__":
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
