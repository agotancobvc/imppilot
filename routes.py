from flask import render_template, session, request, redirect, url_for, jsonify, flash
from flask_socketio import emit
from app import app, socketio, db
# from models import UserSession, MetricData  # Commented out for now
import utils

# Clinician Authentication Routes
@app.route('/')
def index():
    # If fully logged in, go to dashboard
    if 'patient_id' in session and 'clinician_id' in session:
        return redirect(url_for('dashboard'))
    # If clinician logged in but no patient, go to patient select
    elif 'clinician_id' in session:
        return redirect(url_for('patient_select'))
    # Otherwise, show clinician login
    else:
        return render_template('login.html')

@app.route('/clinician-login', methods=['POST'])
def clinician_login():
    clinician_id = request.form['clinician_id']
    password = request.form['password']
    
    # Validate clinician credentials
    if utils.validate_clinician(clinician_id, password):
        session['clinician_id'] = clinician_id
        session['clinician_name'] = utils.get_clinician_name(clinician_id)
        return redirect(url_for('patient_select'))
    else:
        return render_template('login.html', error='Invalid clinician credentials')

@app.route('/patient-select')
def patient_select():
    # Ensure clinician is logged in
    if 'clinician_id' not in session:
        return redirect(url_for('index'))
    
    return render_template('patient-select.html')

@app.route('/patient-select', methods=['POST'])
def patient_select_post():
    # Ensure clinician is logged in
    if 'clinician_id' not in session:
        return redirect(url_for('index'))
    
    patient_id = request.form['patient_id']
    
    # Validate patient ID
    if utils.validate_patient(patient_id):
        session['patient_id'] = patient_id
        # UserSession(user_id=f"{session['clinician_id']}_{patient_id}", session_data={}).save()
        return redirect(url_for('dashboard'))
    else:
        return render_template('patient-select.html', error='Invalid patient ID')

# Dashboard Pages
@app.route('/dashboard')
def dashboard():
    # Ensure both clinician and patient are selected
    if 'clinician_id' not in session or 'patient_id' not in session:
        return redirect(url_for('index'))
    
    patient_id = session['patient_id']
    clinician_id = session['clinician_id']
    metrics = utils.get_patient_metrics(patient_id)
    
    return render_template('dashboard.html', 
                           patient_id=patient_id,
                           clinician_id=clinician_id,
                           metrics=metrics)

@app.route('/history')
def history():
    # Ensure both clinician and patient are selected
    if 'clinician_id' not in session or 'patient_id' not in session:
        return redirect(url_for('index'))
    
    return render_template('history.html')

@app.route('/notes')
def notes():
    # Ensure both clinician and patient are selected
    if 'clinician_id' not in session or 'patient_id' not in session:
        return redirect(url_for('index'))
    
    return render_template('notes.html')

@app.route('/settings')
def settings():
    # Ensure both clinician and patient are selected
    if 'clinician_id' not in session or 'patient_id' not in session:
        return redirect(url_for('index'))
    
    return render_template('settings.html')

# Real-Time Data API
@app.route('/api/metrics/<metric_id>')
def get_metric_data(metric_id):
    if 'patient_id' not in session:
        return jsonify({'error': 'Not authorized'}), 401
    
    patient_id = session['patient_id']
    timeframe = request.args.get('timeframe', '1h')
    data = utils.get_metric_data(patient_id, metric_id, timeframe)
    return jsonify(data)

# Logout Routes
@app.route('/patient-logout')
def patient_logout():
    # Remove patient but keep clinician logged in
    session.pop('patient_id', None)
    return redirect(url_for('patient_select'))

@app.route('/clinician-logout')
def clinician_logout():
    # Remove clinician but keep them on login page
    session.pop('clinician_id', None)
    session.pop('clinician_name', None)
    session.pop('patient_id', None)
    return redirect(url_for('index'))

@app.route('/logout')
def logout():
    # Full logout - clear everything
    session.clear()
    return redirect(url_for('index'))

# WebSocket Events
@socketio.on('connect')
def handle_connect():
    if 'patient_id' in session:
        emit('connection_ack', {'status': 'connected'})
    else:
        emit('connection_ack', {'status': 'unauthorized'})

@socketio.on('request_metric_update')
def handle_metric_request(data):
    metric_id = data['metric_id']
    patient_id = session.get('patient_id')
    clinician_id = session.get('clinician_id')
    
    if patient_id and clinician_id:
        new_data = utils.generate_realtime_data(patient_id, metric_id)
        emit('metric_update', new_data)