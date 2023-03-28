import React from 'react'
import { useContext } from 'react'
import NotificationContext from '../NotificationContext'

const Notification = () => {
  const [notification, notificationDispatch] = useContext(NotificationContext)
  if (notification === '') {
    return null
  }

  return <div className='error'>{notification}</div>
}

export default Notification
