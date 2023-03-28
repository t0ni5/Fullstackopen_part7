import React from 'react'
import { useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'

const Notification = () => {
    const notification = useSelector((state) => state.notification)
    console.log(notification)
    if (notification === '') {
        return null
    }

    return (
        <div className="container">
            {notification && <Alert variant="success">{notification}</Alert>}
        </div>
    )
}

export default Notification
