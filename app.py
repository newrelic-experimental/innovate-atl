from flask import Flask, request

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "Hello World!"

@app.route("/get_bus_info", methods=["POST"])
def get_bus_info():
    request_body = request.get_json()

    # Do input validation stuff here

    # Make calls to MARTA and OpenAI API
    response_from_openai = ""

    requested_data = {
        "response": response_from_openai
    }

    return requested_data

