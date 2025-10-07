import {createSlice} from '@reduxjs/toolkit'


const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        setNotification(state, action) {
            return action.payload
        }
    }
})
export const {setNotification} = notificationSlice.actions

export const notification = (notificationContent , timeout) => {
    return async dispatch => {
        dispatch(setNotification(notificationContent))
        setTimeout(() => {
            dispatch(setNotification(''))
        }, timeout*1000)
        
    }
}

export default notificationSlice.reducer