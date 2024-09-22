
const Person = ({name, number, removePerson, id}) => {
    return (
      <p>{name} {number} <button onClick = {removePerson(id)}>delete</button></p>
    )
  }

export default Person