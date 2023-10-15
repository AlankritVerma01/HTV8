# from flask import Flask, request, jsonify, make_response
# # import GPT as gpt
# import MongoFuncs as mf
# from flask_cors import CORS

# app = Flask(__name__)

# # cors = CORS(app, resources={r"/question": {"origins": ["http://localhost:3000"]}})

# if __name__ == "__main__":
#   app.run(debug=True)

# @app.route('/')
# def base():
#    return jsonify({"message": "Hello World"})

# @app.route('/upload', methods=['POST'])
# def sendPdf():
#   if request.method == 'POST':
#     if 'file' not in request.files:
#         return jsonify({})

#     file = request.files['file']

#   if file.filename == '':
#     return jsonify({})
  
#   if file:
#     db = mf.DBQuery()
#     result_json = jsonify({})
#     nodeList = gpt.main(file)
#     first_id = list(nodeList[0].keys())[0]
#     articleTitle = nodeList[0][first_id]["title"]
#     articleText = nodeList[0][first_id]["text"]
#     id = int(db.currentIndex()) + 1
#     if len(db.queryMongo(id)) == 0:
#       result_json = jsonify({"id": str(id), "title": articleTitle, "description": articleText, "nodes":nodeList})
#     db.insertMongo(result_json)
#     return result_json
  
# @app.route("/question", methods=["POST", "OPTIONS"])
# # @cross_origin(headers=['Content-Type'])
# def askGPT():
#     if request.method == "OPTIONS": # CORS preflight
#         return _build_cors_preflight_response()
#     elif request.method == "POST": # The actual request following the preflight
#         return _corsify_actual_response(jsonify({"name": "Murphy Lee"}))
#     else:
#         raise RuntimeError("Weird - don't know how to handle method {}".format(request.method))

# # @app.route('/question', methods=['OPTIONS'])
# # def handle_options():
# #     response = jsonify({'message': 'Preflight request OK'})
# #     response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
# #     response.headers.add('Access-Control-Allow-Methods', 'POST')
# #     response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
# #     return response

# def _corsify_actual_response(response):
#     response.headers.add("Access-Control-Allow-Origin", "*")
#     return response

# def _build_cors_preflight_response():
#     response = make_response()
#     response.headers.add("Access-Control-Allow-Origin", "*")
#     response.headers.add("Access-Control-Allow-Headers", "*")
#     response.headers.add("Access-Control-Allow-Methods", "*")
#     return response
    
# from flask import Flask, jsonify

# app = Flask(__name__)


# @app.route('/')
# def hello():
#     return jsonify({"name": "Murphy Lee"})

from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def hello():
    return 'Hello, World!'

@app.route('/question', methods=['POST'])
def askGPT():
  if request.method == 'POST':
    response = jsonify({"name": "Murphy Lee"})
    return response
  
@app.route('/upload', methods=['POST'])
def upload():
  if request.method == 'POST':
    response = jsonify({"name": "Murphy Lee1"})
    return response

if __name__ == "__main__":
  app.run(debug=True)