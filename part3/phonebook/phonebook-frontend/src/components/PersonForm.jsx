const PersonForm = ({onSubmit, onNameChange, onNumberChange, newName, newNumber,}) => {
    return (
      <form onSubmit = {onSubmit}>
      
          <div>
            name: <input onChange = {onNameChange} value={newName} />
          </div>
          <div>
            number: <input onChange = {onNumberChange} value = {newNumber}/>
          </div>
          <div>
            <button type="submit" >add</button>
          </div>
    </form>
    )
  }
  
  
export default PersonForm