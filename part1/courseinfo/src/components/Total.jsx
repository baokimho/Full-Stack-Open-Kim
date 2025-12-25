const Total = ({exercises}) => {
    return(
        <div>
            <p>Number of exercises {exercises.reduce((sum, exercise) => sum + exercise, 0)}</p>
        </div>
    )   
}

export default Total