class NotificationsHandler {
  requestPermission () {
    return new Promise((res, rej) => {
      if (this.isAuthorized()) {
        res()
      } else {
        Notification.requestPermission(status => {
          if (status === 'granted') {
            res()
          } else {
            rej()
          }
        })
      }
    })
  }

  displayNotification ({swReg, title, body, icon, data, actions}) {
    swReg.showNotification(title, {
      body: body,
      icon: icon,
      vibrate: [150, 70, 200],
      data: data,
      actions: actions
    })
  }

  isAuthorized () {
    return Notification.permission === 'granted'
  }
}

export default NotificationsHandler