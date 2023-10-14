from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os
from bson.json_util import dumps

load_dotenv()
USERNAME = os.environ.get("USERNAME")
PASSWORD = os.environ.get("PASSWORD")
uri = f"mongodb+srv://{USERNAME}:{PASSWORD}@users.jvsjo1k.mongodb.net/?retryWrites=true&w=majority"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
# Send a ping to confirm a successful connection
collection = client["All_Articles"]
db = collection["Articles"]
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

def queryMongo(id, db):
    query = {"id": str(id)}
    result = dict(db.find(query)[0])
    json_result = dumps(result)
    return json_result