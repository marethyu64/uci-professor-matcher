import { useState, useEffect } from 'react'
import axios from 'axios'
import ProfessorRanking from './ProfessorRanking'

function App() {

  // Dropdown menus
  const [departmentList, setDepartmentList] = useState([])

  const [searchResults, setSearchResults] = useState([])
  const [courseNumber, setSearchTerm] = useState("")
  const [deptType, setDeptType] = useState("")
  const [searchHelper, setSearchHelper] = useState("")

  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api/users");
    console.log(response.data.users);
  }

  useEffect(() => {
    fetchAPI()
  }, [])

  const fetchDepartments = async () => {
    const options = {method: 'GET', url: 'https://anteaterapi.com/v2/rest/websoc/departments'};

    try {
      const { data } = await axios.request(options);
      setDepartmentList(data.data)
    } 
    catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchProfessorData = async (queryParams = {}) => {
    const options = {method: 'GET', url: 'https://anteaterapi.com/v2/rest/courses', params: queryParams};

    try {
      const { data } = await axios.request(options);
      console.log(data)
      if (data.data.length === 0) {
        setSearchHelper("No results found for " + deptType + " " + courseNumber)
      }
      else {
        setSearchResults(data.data[0].instructors)
        setSearchHelper("Search results for " + deptType + " " + courseNumber)
      }
    } 
    catch (error) {
      console.error(error)
      setSearchHelper("An error occurred while fetching data")
    }
  }

  const search = () => {
    setSearchResults([])
    if (deptType !== "" && courseNumber.length > 0) {
      fetchProfessorData({department: deptType, courseNumber: courseNumber})
    } 
    else {
      setSearchHelper("Department and Course Number are required fields")
    }
  }

  return (
    <>
      <h1>UCI Professor Matcher</h1>
      <div className="search-container">
        <select onChange={e => setDeptType(e.target.value)}>
          {deptType === "" && <option value="none">Select Department</option>}
          {departmentList.map((department : any) => <option key={department.deptCode}  value={department.deptCode}>{department.deptCode} - {department.deptName}</option>)}
        </select>
        <input onChange={e => setSearchTerm(e.target.value.toUpperCase())} type="text" placeholder="Course Number (45C, 43, etc.)" />
        <button onClick={search}>Search</button>
      </div>
      <code> {searchHelper} </code>
      <div className="results-container">
        <ProfessorRanking professors={searchResults}/>
      </div>


    </>
  )
}

export default App
