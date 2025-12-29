const Part = ({name, exercises}) => {
    return(<p>{name} {exercises}</p>)
}

const Content = (props) => {
    // console.log(props);
    return(
        <div>
            {props.parts.map(course => <Part key={course.id} name={course.name} exercises={course.exercises} />)}
        </div>

    )
}

export default Content