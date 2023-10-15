from flask import Flask, request, jsonify
import GPT as gpt
import MongoFuncs as mf

app = Flask(__name__)

if __name__ == "__main__":
  app.run(debug=True)

@app.route('/upload', methods=['POST'])
def sendPdf():
  if request.method == 'POST':
    if 'file' not in request.files:
        return jsonify({})

    file = request.files['file']

  if file.filename == '':
    return jsonify({})
  
  if file:
    db = mf.DBQuery()
    result_json = jsonify({})
    nodeList = gpt.main(file)
    first_id = list(nodeList[0].keys())[0]
    articleTitle = nodeList[0][first_id]["title"]
    articleText = nodeList[0][first_id]["text"]
    id = int(db.currentIndex()) + 1
    if len(db.queryMongo(id)) == 0:
      result_json = jsonify({"id": str(id), "title": articleTitle, "description": articleText, "nodes":nodeList})
    db.insertMongo(result_json)
    return result_json

@app.route('/<question>', methods=['POST'])
def askGPT(question):
  if request.method == 'POST':
    return GPT(question)
    
