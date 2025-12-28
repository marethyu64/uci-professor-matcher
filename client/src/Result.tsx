import './Result.css'

function Result ({ professor }){
    
    return (
        <div className="result-container">
            <h1>{professor.name}</h1>
            <code>{professor.title}</code>

        </div>
    )
}

export default Result