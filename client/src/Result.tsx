import './Result.css'

function Result ({ professor }){
    
    return (
        <div className="result-container">
            <h1>{professor.shortenedName}</h1>
            <p>Average class GPA: {professor.averageGPA}</p>
            <p>Last taught: {professor.lastTaught}</p>
            <p>Students taught: {professor.studentsTaught}</p>
        </div>
    )
}

export default Result