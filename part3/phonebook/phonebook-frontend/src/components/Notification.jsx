const Notification = ({notificationMessage, wasSuccessful}) => {
    if (!notificationMessage && !wasSuccessful) {
      return 
    }
    return (
      <div className = {wasSuccessful ? 'success' : 'error'}>
        {notificationMessage}
      </div>
    )
  }

export default Notification