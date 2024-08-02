const Course = ({course}) => {

    const sum = course.parts.reduce(
      (total, part) => {
        return total + part.exercises
        
      }, 
      0
  )
    return (
      <div>
        <Header name = {course.name}/>
        <Content parts = {course.parts}/>
        <Sum sum = {sum} />
      </div>
    )
  }
  
  
  
  
  const Content = ({parts}) => {
    return (
      <div>
        {parts.map( part => <Part key = {part.id} name = {part.name} exercises = {part.exercises} />
        )}
        
      </div>
    )
  }
  
  const Header = ({name}) => <h1>{name}</h1>
  
  const Part = ({name, exercises}) => <p>{name} {exercises}</p>
  
  const Sum = ({sum}) => <h4>Total of {sum} exercises</h4> 

  export default Course
  