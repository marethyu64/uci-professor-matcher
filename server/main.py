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

def calculate_avg_gpa(data : dict):
    total_grade_points = (data["gradeACount"] * 4) + (data["gradeBCount"] * 3) + (data["gradeCCount"] * 2) + (data["gradeDCount"] * 1) + (data["gradeFCount"] * 0)
    total_students = (data["gradeACount"] + data["gradeBCount"] + data["gradeCCount"] + data["gradeDCount"] + data["gradeFCount"])
    return (total_grade_points/total_students)

def sort_raw_grade_data(raw_data: dict):
    # potential issue: getting professor from LastName, F. will mess up if there are two who have same thing AND teach same class
    sorted_data = [
        # "professor_name":
        # {
        #     "overall": {
        #           gradeACount : 1
        #           gradeBCount : 2
        #           averageGPA : 3.33
        #       }
        #     "2024 - Winter": {
        #           gradeACount : 2
        #           gradeBCount : 4
        #           averageGPA : 3.33
        #       }
    ]

    professors_added = []

    # Each "data" is ONE class a professor had in any point in time.
    # Remember, there can be multiple classes that share the same date/quarter.
    for data in raw_data:

        professor_name = data["instructors"][0]
        year_quarter = f"{data["year"]} - {data["quarter"]}"

        course_grades = {
            "gradeACount": data["gradeACount"],
            "gradeBCount": data["gradeBCount"],
            "gradeCCount": data["gradeCCount"],
            "gradeDCount": data["gradeDCount"],
            "gradeFCount": data["gradeFCount"],
        }

        # Create an empty reference variable for the professor profile
        profile = None

        # Check if professor profile already exists in the sorted_data
        if professor_name not in professors_added:
            # Create a new profile for professor
            profile = {
                "instructor": professor_name,
                "averageGPA": 0,
                "courses": {}
            }
            # Add professor profile to the list
            sorted_data.append(profile)
            # Mark down that professor profile is in the list
            professors_added.append(professor_name)
        else:
            # Find existing profile based on index of professors_added list
            profile = sorted_data[professors_added.index(professor_name)]

        # Check if specific quarter/year is in the professor profile (since professors can have multiple of the same classe in one quarter)
        if year_quarter not in profile["courses"]:
            profile["courses"][year_quarter] = course_grades
        else:
            for grade in course_grades:
                profile["courses"][year_quarter][grade] += course_grades[grade]

        # Computes the average GPA for the one class
        grades = profile["courses"][year_quarter]
        total_students = sum(grades[k] for k in grades)
        total_score = 4*grades["gradeACount"] + 3*grades["gradeBCount"] + 2*grades["gradeCCount"] + 1*grades["gradeDCount"] + 0*grades["gradeFCount"]
        grades["averageGPA"] = total_score / total_students if total_students > 0 else 0

    # Compute the average GPA of the ENTIRE class
    for profile in sorted_data:
        total_students = 0
        total_score = 0
        for course, courseData in profile["courses"].items():
            total_students += sum(courseData[k] for k in ["gradeACount","gradeBCount","gradeCCount","gradeDCount","gradeFCount"])
            total_score += 4*courseData["gradeACount"] + 3*courseData["gradeBCount"] + 2*courseData["gradeCCount"] + 1*courseData["gradeDCount"] + 0*courseData["gradeFCount"]
        overall_gpa = total_score / total_students if total_students > 0 else 0
        profile["averageGPA"] = round(overall_gpa, 2)


    # Sort data by descending GPA
    sorted_data.sort(key=lambda x: float(x["averageGPA"]), reverse=True)
    
    return sorted_data

def compute_search(dept_name: str, course_number: str):
    # should sort data to display each professor grade average!!!
    raw_grade_data = fetch_anteater_api_data("grades/raw", {"department": dept_name, "courseNumber": course_number})

    if raw_grade_data == None or len(raw_grade_data["data"]) == 0:
        print("No data found for the given department and course number.")
        return None

    formatted_courses = sort_raw_grade_data(raw_grade_data["data"])
    
    return formatted_courses

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