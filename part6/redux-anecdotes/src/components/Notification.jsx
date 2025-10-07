import {useDispatch, useSelector} from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'


const Notification = () => {
  const dispatch = useDispatch()
  const notification = useSelector(({notification}) => notification)
  // if (notification) {
  //   setTimeout(() => dispatch(setNotification('')), 5000)
  // }
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    display: (notification) ? '' : 'none' //if notification exists, then the element is not hidden, but if notification doesn't exist (has falsy value) then notification remains hidden
  }
  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification