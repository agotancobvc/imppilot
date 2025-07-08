import boto3
import time
from datetime import datetime, timedelta
# from app import app
# from models import MetricData

# Mock clinician database - replace with real authentication
CLINICIANS = {
    'dr.smith': {'password': 'password123', 'name': 'Dr. Sarah Smith'},
    'dr.jones': {'password': 'secure456', 'name': 'Dr. Michael Jones'},
    'dr.brown': {'password': 'clinic789', 'name': 'Dr. Lisa Brown'},
    'admin': {'password': 'admin', 'name': 'Administrator'}
}

# Mock patient database - replace with real patient validation
PATIENTS = [
    'P001', 'P002', 'P003', 'P004', 'P005',
    'PATIENT001', 'PATIENT002', 'TEST001'
]

def validate_clinician(clinician_id, password):
    """Validate clinician credentials"""
    clinician = CLINICIANS.get(clinician_id.lower())
    if clinician and clinician['password'] == password:
        return True
    return False

def get_clinician_name(clinician_id):
    """Get clinician's display name"""
    clinician = CLINICIANS.get(clinician_id.lower())
    return clinician['name'] if clinician else clinician_id

def validate_patient(patient_id):
    """Validate patient ID"""
    return patient_id.upper() in [p.upper() for p in PATIENTS]

def get_patient_metrics(patient_id):
    """Get available metrics for a patient"""
    # In real implementation, this would query the database for patient-specific metrics
    return [
        'step_length', 'step_length_variability', 'stride_length', 
        'stride_length_variability', 'stride_time_variability', 'cadence',
        'gait_speed', 'gait_cycle_variability', 'stance_time', 
        'swing_time', 'swing_time_variability', 'double_support_time'
    ]

def get_metric_data(patient_id, metric_id, timeframe):
    """Get historical metric data for a patient"""
    # Calculate time range
    end_time = int(time.time())
    start_time = end_time - {
        '1h': 3600,
        '1d': 86400,
        '1w': 604800
    }.get(timeframe, 3600)
    
    # Generate sample data (replace with actual database query)
    data_points = 20 if timeframe != 'all' else 50
    data = []
    
    for i in range(data_points):
        timestamp = start_time + (i * (end_time - start_time) // data_points)
        value = generate_sample_value_for_metric(metric_id)
        data.append({
            'timestamp': timestamp,
            'value': value
        })
    
    return data

def generate_realtime_data(patient_id, metric_id):
    """Generate real-time data point for a patient"""
    return {
        'metric_id': metric_id,
        'patient_id': patient_id,
        'value': generate_sample_value_for_metric(metric_id),
        'timestamp': int(time.time())
    }

def generate_sample_value_for_metric(metric_id):
    """Generate realistic sample values for different metrics"""
    import random
    
    base_values = {
        'step_length': 65,
        'step_length_variability': 5,
        'stride_length': 130,
        'stride_length_variability': 8,
        'stride_time_variability': 3,
        'cadence': 110,
        'gait_speed': 1.2,
        'gait_cycle_variability': 4,
        'stance_time': 62,
        'swing_time': 38,
        'swing_time_variability': 2.5,
        'double_support_time': 12
    }
    
    ranges = {
        'step_length': 10,
        'step_length_variability': 3,
        'stride_length': 20,
        'stride_length_variability': 5,
        'stride_time_variability': 2,
        'cadence': 15,
        'gait_speed': 0.3,
        'gait_cycle_variability': 2,
        'stance_time': 8,
        'swing_time': 6,
        'swing_time_variability': 1.5,
        'double_support_time': 4
    }
    
    base = base_values.get(metric_id, 50)
    range_val = ranges.get(metric_id, 10)
    
    value = base + random.uniform(-range_val/2, range_val/2)
    return max(0, round(value, 2))

# Keep existing S3 functions if you have them
# def upload_to_s3(file, user_id):
#     ...