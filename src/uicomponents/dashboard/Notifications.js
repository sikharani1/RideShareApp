import React from 'react'
import moment from 'moment'

const Notifications = (props) => {
  const defaulturl="www.google.com";
  const { notifications } = props;
  return (
    <div className="section">
      <div className="card notification-div z-depth-0">
        <div className="card-content">
          
          <ul className="online-users">
          { notifications && notifications.map(item =>{
            if(item.url)
              return <li key={item.id}><a href={`/post/${item.url}`}>
                <span className="black-text">{item.user} </span>
                <span id="notification-content" className="white-text">{item.content}</span>
                <div className="light-blue-text text-darken-3">{moment(item.time.toDate()).fromNow()}</div></a>
              </li>
              else
              return <li key={item.id}>
                <span className="black-text">{item.user} </span>
                <span id="notification-content" className="white-text">{item.content}</span>
                <div className="light-blue-text text-darken-3">{moment(item.time.toDate()).fromNow()}</div>
              </li>
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Notifications