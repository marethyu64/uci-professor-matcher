# Frontend and backend communicate through HTTP requests
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

# Creates an app instance
app = Flask(__name__)
cors = CORS(app, origins='*')

def fetch_anteater_api_data(endpoint: str, params: dict):
    try:
        response = requests.get(
            f"https://anteaterapi.com/v2/rest/{endpoint}",
            params=params
        )
        response.raise_for_status()
        return response.json()
    
    except requests.RequestException as e:
        print(f"Error fetching AnteaterAPI data: {e}")
        return None

def compute_search(dept_name: str, course_number: str):
    # should sort data to display each professor grade average!!!
    response = fetch_anteater_api_data("grades/aggregateByOffering", {"department": dept_name, "courseNumber": course_number})

    if response == None or len(response["data"]) == 0:
        print("No data found for the given department and course number.")
        return None
    
    course_data = response["data"]

    sorted_courses = []

    for course in course_data:
        sorted_courses.append({
            "instructor": course["instructor"],
            "averageGPA": course["averageGPA"]
        })
    
    sorted_courses = sorted(sorted_courses, key=lambda x: x["averageGPA"],reverse=True)

    print(sorted_courses)
    
    return sorted_courses

@app.route('/api/departments', methods=['GET'])
def fetch_departments():
    return jsonify(fetch_anteater_api_data("websoc/departments", {}))

# Creates a route for the API
@app.route('/api/test', methods=['GET'])
def test():
    return jsonify(
        {
            "users": [
                "bob",
                "zack",
                "alice"
            ]
        }
    )

@app.route('/api/professor', methods=['GET'])
def fetch_professor():
    return jsonify(fetch_anteater_api_data("instructors", {"nameContains": "Ziv"}))

@app.route('/api/search', methods=['GET'])
def fetch_courses():
    dept_name = request.args.get("deptName")
    course_number = request.args.get("courseNumber")
    return jsonify(compute_search(dept_name, course_number))


if __name__ == "__main__":
    app.run(debug=True, port=8080)