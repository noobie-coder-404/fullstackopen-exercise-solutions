import { createContext, useReducer, useContext } from "react";

const notificationReducer = (state, action) => {
    switch(action.type) {
        case "SET": 
            return action.payload
        case "UNSET": 
            return null
        default:
            return state
    }
}


const AnecdoteContext = createContext()

export const AnecdoteContextProvider = (props) => {

    const [notification, notificationDispatch ] = useReducer(notificationReducer, null)

    return(
        <AnecdoteContext.Provider value = {[notification, notificationDispatch]} >
            {props.children}
        </AnecdoteContext.Provider>
    )
   
}


export const useNotification = () => {
     const notificationFunctions = useContext(AnecdoteContext)
     const notificationDispatch = notificationFunctions[1]
   return (notificationContent) => {
     notificationDispatch({type: "SET", payload: notificationContent})
    setTimeout(() => {
        notificationDispatch({type: "UNSET"})
    }, 3000)
}
   }


export const useNotificationValue = () => {
    const notificationFunctions = useContext(AnecdoteContext)
    return notificationFunctions[0]
}

export default AnecdoteContextProvider