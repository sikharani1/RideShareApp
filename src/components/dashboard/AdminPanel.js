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
    
  
  this.props.deleteSpam(postId);
  this.forceUpdate();
  }
tickSpam=(postId)=>{
  const spams=this.props.spams;
  
  const index = spams.findIndex(p => p.id == postId)
  spams[index]["isSpam"] = !spams[index].isSpam;

    
    
    const updatedspams=spams;

    if(updatedspams[index].isSpam)
    this.props.tickSpam(postId);
}
  render() {
   

  const defaulturl="www.google.com";
  const { spams } = this.props;
  return (
    <div className="container admin">
   <div className="main-container shadow">
     <div className="z-depth-0 spam-container container">
        
        
      
          <ul className="online-users collection with-header">
          <li className="collection-header "><h4 className="card-title">Spams</h4></li>
          { spams && spams.map(item =>{
            if(item.url)
              return <li className="collection-item pink-text darken-2" key={item.id}><a href={`/post/${item.postId}`}>
                <p className="orange-text darken-2">{item.content}</p>
                <p className="pink-text darken-2">{item.title}</p>
                <p>{item.authorFirstName} </p>
                
                <div className="note-date grey-text darken-2">{item.createdAt.toDate().toDateString()}</div></a>
          <div id="check" className="post-content" className="input-field">
            <button id="check-btn" className="btn lighten-1" onClick={() =>  this.tickSpam(item.id) } ><i className="far fa-check-square"/></button>
          </div>
            <div id="delete" className="post-content" className="input-field">
            <button id="delete-btn" className="btn lighten-1" onClick={() =>  this.deleteSpam(item.id) } ><i className="fas fa-trash"/></button>
          </div>
              </li>
              else
              return <li className="collection-item pink-text darken-2" key={item.id}><a href={`/post/${item.postId}`}>
                <p className="orange-text darken-2">{item.title}</p>
                <p className="pink-text darken-2">{item.content}</p>
                <p>{item.authorFirstName} </p>
                
                
                <div className="note-date grey-text darken-2">{item.createdAt.toDate().toDateString()}</div></a>
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
  )
          }
        }


const mapStateToProps = (state) => {
  

 
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