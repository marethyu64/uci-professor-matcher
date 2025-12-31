import Result from './Result'

function ProfessorRanking ({ professors }){


    return (
        <>

            {professors.map((professor : any) => <Result professor={professor}/>)}
        </>
    )
}

export default ProfessorRanking