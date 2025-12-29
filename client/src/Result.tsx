import './Result.css'

function Result ({ professor }){
    
    return (
        <div className="result-container">
            <h1>{professor.instructor}</h1>
            <code>Average class GPA: {professor.averageGPA.toFixed(2)}</code>

        </div>
    )
}

export default Result