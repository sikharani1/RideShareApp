import React,{Component} from 'react'
import moment from 'moment'
import {connect} from 'react-redux'
import {compose} from'redux'
import {firestoreConnect} from 'react-redux-firebase'
import * as firebase from 'firebase';
import { deleteSpam } from '../../store/actions/reportSpamActions'
class AdminPanel extends Component {
  constructor(props){
  super(props);
  }
  deleteSpam=(postId)=>
  {
  //   event.preventDefault();
  //   if(event.target.value) 
  //  {
  //   const val=event.target.value;
  //  }
  this.props.deleteSpam(postId);
  this.forceUpdate();
  }
  render() {
    console.log(this.props);

  const defaulturl="www.google.com";
  const { spams } = this.props;
  return (
    <div className="section">
      <div className="card notification-div z-depth-0">
        <div className="card-content">
          <span className="card-title">Spams</span>
          <ul className="online-users">
          { spams && spams.map(item =>{
            if(item.url)
              return <li key={item.id}><a href={`/post/${item.postId}`}>{item.postId}
                <span className="pink-text">{item.authorFirstName} </span>
                <span>{item.content}</span>
                <div className="note-date grey-text">{item.createdAt.seconds}</div></a>
                <div id="delete" className="post-content" className="input-field">
            <button id="delete-btn" className="btn lighten-1" onClick={() =>  this.deleteSpam(item.id) } ><i className="fas fa-trash"/></button>
          </div>
              </li>
              else
              return <li key={item.id}><a href={`/post/${item.postId}`}>{item.postId}
                <span className="pink-text">{item.authorFirstName} </span>
                <span>{item.content}</span>
                
                <div className="note-date grey-text">{item.createdAt.seconds}</div></a>
                <div id="delete" className="post-content" className="input-field">
            <button id="delete-btn" className="btn lighten-1" onClick={() =>  this.deleteSpam(item.id) } ><i className="fas fa-trash"/></button>
          </div>
              </li>
            })}
          </ul>
        </div>
      </div>
    </div>
  )
          }
        }


const mapStateToProps = (state) => {
  console.log(state);

 
    return {
   spams: state.firestore.ordered.spams
  
  }
 }
 const mapDispatchToProps=(dispatch)=>{
  return {
    deleteSpam: (postId) => dispatch(deleteSpam(postId))
  }
}
 export default compose(connect(mapStateToProps,mapDispatchToProps),firestoreConnect([
  { collection: 'spams', orderBy:['createdAt','desc']}
 ])
)(AdminPanel)