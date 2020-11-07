import React,{Component} from 'react'
import moment from 'moment'
import {connect} from 'react-redux'
import {compose} from'redux'
import {firestoreConnect} from 'react-redux-firebase'
import * as firebase from 'firebase';
import { deleteSpam,tickSpam } from '../../store/actions/reportSpamActions'
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
tickSpam=(postId)=>{
  const spams=this.props.spams;
  console.log(spams);
  const index = spams.findIndex(p => p.id == postId)
  spams[index]["isSpam"] = !spams[index].isSpam;

    // posts[index] = { post };
    console.log(spams[index]);
    const updatedspams=spams;

    if(updatedspams[index].isSpam)
    this.props.tickSpam(postId);
}
  render() {
    console.log(this.props);

  const defaulturl="www.google.com";
  const { spams } = this.props;
  return (
    <div className="container">
    <div className="section">
      <div className="card notification-div z-depth-0">
        <div className="card-content">
          <span className="card-title">Spams</span>
          <ul className="online-users">
          { spams && spams.map(item =>{
            if(item.url)
              return <li key={item.id}><a href={`/post/${item.postId}`}>{item.postId}
                <p className="pink-text">{item.authorFirstName} </p>
                <p>{item.content}</p>
                <div className="note-date grey-text">{item.createdAt.seconds}</div></a>
          <div id="check" className="post-content" className="input-field">
            <button id="check-btn" className="btn lighten-1" onClick={() =>  this.tickSpam(item.id) } ><i className="far fa-check-square"/></button>
          </div>
            <div id="delete" className="post-content" className="input-field">
            <button id="delete-btn" className="btn lighten-1" onClick={() =>  this.deleteSpam(item.id) } ><i className="fas fa-trash"/></button>
          </div>
              </li>
              else
              return <li key={item.id}><a href={`/post/${item.postId}`}>{item.postId}
                <p className="pink-text">{item.authorFirstName} </p>
                <p>{item.content}</p>
                
                <div className="note-date grey-text">{item.createdAt.seconds}</div></a>
                <div id="check" className="post-content" className="input-field">
            <button id="check-btn" className="btn lighten-1" onClick={() =>  this.tickSpam(item.id) } ><i className="far fa-check-square"/></button>
          </div>
                <div id="delete" className="post-content" className="input-field">
            <button id="delete-btn" className="btn lighten-1" onClick={() =>  this.deleteSpam(item.id) } ><i className="fas fa-trash"/></button>
          </div>
              </li>
            })}
          </ul>
        </div>
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
    deleteSpam: (postId) => dispatch(deleteSpam(postId)),
    tickSpam:(postId)=>dispatch(tickSpam(postId))
  }
}
 export default compose(connect(mapStateToProps,mapDispatchToProps),firestoreConnect([
  { collection: 'spams', orderBy:['createdAt','desc']}
 ])
)(AdminPanel)