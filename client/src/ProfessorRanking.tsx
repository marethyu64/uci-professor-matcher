import Result from './Result'
import { useState } from 'react'
import axios from 'axios'

function ProfessorRanking ({ professors }){

    const [rankedProfessors, setrankedProfessors] = useState([]);
    const [professorAverageGPA, setProfessorAverageGPA] = useState({});


    const fetchProfessorData = async (queryParams = {}) => {
        const options = {method: 'GET', url: 'https://anteaterapi.com/v2/rest/grades/raw', params: queryParams};

        try {
            const { data } = await axios.request(options);
            // check if classes is more than one, if not, compile the average of all of them
        } 
        catch (error) {
            console.error(error)
        }
    }

    const getProfessorAverage = () => {
        professors.map((professor : any) => {})
        
    }


    return (
        <>
            {professors.map((professor : any) => <Result professor={professor}/>)}
        </>
    )
}

export default ProfessorRanking