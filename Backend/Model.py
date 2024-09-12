from flask import Flask, Response, stream_with_context, jsonify
from flask_cors import CORS
from roboflow import Roboflow
import cv2
import os
import time
import requests
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from geopy.distance import great_circle

app = Flask(__name__)
CORS(app)  

# Roboflow API Key
rf = Roboflow(api_key="v6Ui9NmmYsTVA20xncca")
project = rf.workspace().project("accident_dataset-o5th9")
model = project.version("1").model

alerts_list = []
detected_accident_frames = []
saving_video = False

# Directory to save accident clips and reports
output_dir = "accident_clips"
os.makedirs(output_dir, exist_ok=True)

alert_active = False
alert_last_detected_time = 0

# Define constants
ALERT_COOLDOWN_TIME = 1  
SEARCH_RADIUS = 5000  # Radius in meters to search for nearby places

def generate_frames():
    video_source = 'car and human accidents.mp4'

    if not os.path.exists(video_source):
        print(f"Video file {video_source} not found.")
        return
    
    cap = cv2.VideoCapture(video_source)
    frame_skip = 7  
    frame_count = 0
    fps = cap.get(cv2.CAP_PROP_FPS)  

    global saving_video, alert_active, alert_last_detected_time

    # Example latitude and longitude (in practice, you should get actual values)
    latitude = 28.507161
    longitude = 77.017882

    while True:
        success, frame = cap.read()
        if not success:
            print("Failed to read frame.")
            break
        
        frame_count += 1
        if frame_count % frame_skip != 0:
            continue
        
        input_size = (640, 640) 
        frame_resized = cv2.resize(frame, input_size)

        temp_frame_path = 'temp_frame.jpg'
        cv2.imwrite(temp_frame_path, frame_resized)

        prediction = model.predict(temp_frame_path, confidence=40).json()
        predictions = prediction.get('predictions', [])

        accident_detected = False

        for box in predictions:
            x = int(box['x'] - box['width'] / 2)
            y = int(box['y'] - box['height'] / 2)
            w = int(box['width'])
            h = int(box['height'])
            label = box['class']
            
            color = (0, 255, 0)  # Default color (green)
            if label in ['car_car_accident', 'injured', 'car_person_accident']: 
                color = (0, 0, 255)  # Red color 

                accident_detected = True
                send_alert(label)

            cv2.rectangle(frame_resized, (x, y), (x + w, y + h), color, 2)
            cv2.putText(frame_resized, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2)

        current_time = time.time()
        if accident_detected:
            detected_accident_frames.append(frame_resized)

            if not alert_active:
                alert_active = True
                print("Alert started.")

            alert_last_detected_time = current_time
        else:
            if alert_active and current_time - alert_last_detected_time > ALERT_COOLDOWN_TIME:
                alert_active = False
                print("Alert stopped. Saving video and report.")
                save_accident_clip(fps, latitude, longitude)
                detected_accident_frames.clear()

        ret, buffer = cv2.imencode('.jpg', frame_resized)
        if not ret:
            continue
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

        # Clean up the temporary file
        os.remove(temp_frame_path)

    if detected_accident_frames:
        save_accident_clip(fps, latitude, longitude)
        detected_accident_frames.clear()

    cap.release()

def send_alert(label):
    alert_message = f"ALERT: {label} detected!"
    alerts_list.append(alert_message)
    print(alert_message)

def alert_stream():
    @stream_with_context
    def generate():
        while True:
            if alerts_list:
                yield f"data: {alerts_list.pop(0)}\n\n"
            time.sleep(1) 

    return Response(generate(), mimetype='text/event-stream')

def get_nearest_places(latitude, longitude):
    overpass_url = f"""
    https://overpass-api.de/api/interpreter?data=[out:json];
    (node["amenity"="hospital"](around:{SEARCH_RADIUS},{latitude},{longitude});
     node["amenity"="police"](around:{SEARCH_RADIUS},{latitude},{longitude}););
    out body;
    """
    response = requests.get(overpass_url)
    data = response.json()
    
    nearest_hospital = None
    nearest_police = None
    min_distance_hospital = float('inf')
    min_distance_police = float('inf')

    for place in data['elements']:
        place_lat = place['lat']
        place_lon = place['lon']
        distance = calculate_distance(latitude, longitude, place_lat, place_lon)
        
        if place['tags']['amenity'] == 'hospital' and distance < min_distance_hospital:
            nearest_hospital = place['tags'].get('name', 'Unknown Hospital')
            min_distance_hospital = distance
            
        if place['tags']['amenity'] == 'police' and distance < min_distance_police:
            nearest_police = place['tags'].get('name', 'Unknown Police Station')
            min_distance_police = distance

    return nearest_hospital, nearest_police

def calculate_distance(lat1, lon1, lat2, lon2):
    return great_circle((lat1, lon1), (lat2, lon2)).meters

def save_accident_clip(original_fps, latitude, longitude):
    """Save detected accident frames as a video clip with slower playback."""
    slow_fps = original_fps / 3 

    timestamp = time.strftime("%Y%m%d-%H%M%S")
    video_filename = os.path.join(output_dir, f"accident_clip_{timestamp}.mp4")
    height, width, _ = detected_accident_frames[0].shape
    out = cv2.VideoWriter(video_filename, cv2.VideoWriter_fourcc(*'mp4v'), slow_fps, (width, height))

    for frame in detected_accident_frames:
        out.write(frame)
    
    out.release()
    print(f"Saved accident clip: {video_filename}")

    # Fetch nearest hospital and police station
    nearest_hospital, nearest_police = get_nearest_places(latitude, longitude)
    
    # Save report including video and place information
    report_filename = os.path.join(output_dir, f"accident_report_{timestamp}.pdf")
    generate_report(report_filename, latitude, longitude, nearest_hospital, nearest_police, video_filename)

def generate_report(pdf_filename, latitude, longitude, nearest_hospital, nearest_police, video_filename):
    """Generate a PDF report with accident details."""
    c = canvas.Canvas(pdf_filename, pagesize=letter)
    width, height = letter

    c.drawString(100, height - 100, f"Accident Report")
    c.drawString(100, height - 140, f"Time of Incident: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    c.drawString(100, height - 180, f"Location: Latitude {latitude}, Longitude {longitude}")
    c.drawString(100, height - 220, f"Nearest Hospital: {nearest_hospital}")
    c.drawString(100, height - 260, f"Nearest Police Station: {nearest_police}")
    c.drawString(100, height - 300, f"Video: {video_filename}")

    c.save()
    print(f"Saved accident report: {pdf_filename}")

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/recent_reports', methods=['GET'])
def recent_reports():
    try:
        files = os.listdir(output_dir)
        reports = [f for f in files if f.endswith('.pdf')]
        videos = [f for f in files if f.endswith('.mp4')]
        return jsonify({
            'reports': reports,
            'videos': videos
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/alerts')
def alerts_feed():
    return alert_stream()

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(host='0.0.0.0', port=5000)
