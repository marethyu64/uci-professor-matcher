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

  const loadDepartments = async () => {
    const response = await axios.get("http://localhost:8080/api/departments");
    setDepartmentList(response.data.data)
  }


  useEffect(() => {
    loadDepartments()
  }, [])

  const search = async () => {
    setSearchResults([])
    if (deptType !== "" && courseNumber.length > 0) {
      const result = await axios.get("http://localhost:8080/api/search", {params: {deptName: deptType, courseNumber: courseNumber}});
      if (result === null) {
        setSearchHelper("No results found for " + deptType + " " + courseNumber)
      }
      else {
        // display class title, etc.
        console.log(result.data)
        setSearchResults(result.data)
        setSearchHelper("Search results for " + deptType + " " + courseNumber)
      }
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
          {deptType === "" && <option key = "none" value="none">Select Department</option>}
          {departmentList.map((department : any) => <option key={department.deptCode}  value={department.deptCode}>{department.deptCode} - {department.deptName}</option>)}
        </select>
        <input onChange={e => setSearchTerm(e.target.value.toUpperCase())} type="text" placeholder="Course Number (2A, 43, etc.)" />
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
