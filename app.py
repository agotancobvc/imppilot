from flask import Flask
from flask_socketio import SocketIO
from flask_pynamodb import PynamoDB

app = Flask(__name__)
app.config.from_object('config.Config')

# Initialize extensions
socketio = SocketIO(app, async_mode='eventlet')
db = PynamoDB(app)


if __name__ == '__main__':
    from routes import *
    socketio.run(app, debug=True, host='0.0.0.0', port=5001)
