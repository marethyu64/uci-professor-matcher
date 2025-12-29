import Result from './Result'
import { useState } from 'react'
import axios from 'axios'

function ProfessorRanking ({ professors }){

    return (
        <>
            {professors.map((professor : any) => <Result professor={professor}/>)}
        </>
    )
}

export default ProfessorRanking