import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret')
    DYNAMODB_REGION = os.environ.get('DYNAMODB_REGION', 'us-east-1')
    AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
    S3_BUCKET = os.environ.get('S3_BUCKET', 'dashboard-assets')
    SOCKETIO_MESSAGE_QUEUE = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
