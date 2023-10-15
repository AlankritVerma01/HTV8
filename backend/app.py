from flask import Flask, request, jsonify
from flask_cors import CORS
import MongoFuncs as mf
import GPT as gpt
import json
from bson.json_util import dumps

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


# @app.route('/', methods=['GET', 'POST'])
# def hello():
#     return 'Hello, World!'

# def colour_assigner():


@app.route('/question', methods=['POST'])
def askGPT():
    if request.method == 'POST':
        data = request.json
        text_received = data['question']
        return text_received


@app.route('/upload', methods=['POST'])
def upload():
    if request.method == 'POST':
        if 'file' not in request.files:
            return jsonify({})

        file = request.files['file']

        if file.filename == '':
            return jsonify({})

        if file:
            db = mf.DBQuery()
            result_json = jsonify({})
            nodeDict = gpt.main(file)
            print(nodeDict)
            print("---------------------------------------------------------------")
            print(nodeDict.keys())
            first_id = list(nodeDict.keys())[0]
            articleTitle = nodeDict[first_id]["title"]
            articleText = nodeDict[first_id]["text"]
            id = int(db.currentIndex()) + 1
            if len(db.queryMongo(id)) == 0:
                result_json = jsonify(
                    {"id": str(id), "title": articleTitle, "text": articleText, "nodes": nodeDict}).get_json()
                db.insertMongo(result_json)
                result_json = dumps(result_json)
            with open("./frontend/src/app/data/trial.json", "w") as file:
                file.write(result_json)
    return {"Status": "Success"}


if __name__ == "__main__":
    app.run(debug=True)
