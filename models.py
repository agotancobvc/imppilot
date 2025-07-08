from flask_pynamodb import PynamoDB
from pynamodb.attributes import UnicodeAttribute, NumberAttribute, JSONAttribute

# Initialize in routes.py after app creation

class UserSession(PynamoDB.Model):
    class Meta:
        table_name = "user_sessions"
        region = 'us-east-1'
    
    user_id = UnicodeAttribute(hash_key=True)
    session_data = JSONAttribute()

class MetricData(PynamoDB.Model):
    class Meta:
        table_name = "user_metrics"
        region = 'us-east-1'
    
    user_id = UnicodeAttribute(hash_key=True)
    metric_id = UnicodeAttribute(range_key=True)
    values = JSONAttribute()
    timestamp = NumberAttribute()
