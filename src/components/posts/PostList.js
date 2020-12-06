import React,{useState} from 'react'
import PostSummary from './PostSummary'
import {Link,Route} from 'react-router-dom'
import Like from '../dashboard/Like.js'
import Bookmark from '../dashboard/Bookmark.js'
import ReportSpam from '../dashboard/ReportSpam.js'
import {deletePost} from '../../store/actions/postActions'
import {connect} from 'react-redux'
import {compose} from'redux'
import {firestoreConnect} from 'react-redux-firebase'
import * as firebase from 'firebase';

const PostList = (props) => {
  
  const {posts,onLike,onBookmark,deletePost,onReport}=props;
 
  posts && posts.sort(function(x, y){
    
    return y.createdAt - x.createdAt;
})
  
  return (
<Route>
    <div className="post-list section">
      { 
     
      (posts) && posts.map(post => { if(post) {
        const email="mailto:"+post.email;
        const phonenumber="tel:"+post.phoneNumber;
        const message="sms:"+post.phoneNumber;
        console.log(post.liked);
        console.log(post.spamReported);
        let user = firebase.auth().currentUser;    
          if(user && post.authorId==user.uid)
          {
        return (
          <div>
          <div className="post-box">
          <Link className="post-link post-content" to={'/post/'+post.id} >
            <PostSummary post={post} key={post.id} />
          </Link>
          <Link className="update-link" to={'update/post/'+post.id}>
          <i class="fas fa-edit"></i> 
          </Link>
          
          <div id="delete" className="post-content" className="input-field">
            <button id="delete-btn" className="btn lighten-1" onClick={() =>  deletePost(post.id) } ><i className="fas fa-trash"/></button>
          </div>
          </div>
          {(post.privacy=="public")?<div className="me">Ride Posted By Me</div>:<div></div>}
          
          
          </div>
        )
      }
      else{
        return(
          <div>
          <Link  className="link" to={'/post/'+post.id}>
          <PostSummary post={post} key={post.id} />
          </Link>
        <div className="click-options">{(post.verified==true)?<div className="verified"><i className="fas fa-user-check"></i></div>:<div></div>}{(post.privacy=="public")?<div className="email"><a  href={email}><i className="fas fa-envelope"/></a></div>:<div></div>}{(post.phoneNumber)?<div className="phonenumber"><a  href={phonenumber}><i className="fas fa-phone"/></a></div>:<div></div>}{(post.phoneNumber)?<div class="message"><a  href={message}><i className="fas fa-sms"/></a></div>:<div></div>}
          <Like liked={post.liked} onClick={()=>onLike(post)} />
          <Bookmark starred={post.starred} onClick={()=>onBookmark(post)} />
          <ReportSpam spamReported={post.spamReported} onClick={()=>onReport(post)}/>
          </div>
       </div>
      
        )
      }
      
      }
     
      }
      
      )
    
  
      }  
    </div>
    </Route>
  )
}
const mapStateToProps = (state,ownProps) => {
  console.log(state);
  console.log(ownProps);
  if(ownProps.posts)
  {
    return {
      posts: ownProps
     }
  }
  else
  {
    return {
   posts: state.firestore.ordered.posts
  }
  }
 }
const mapDispatchToProps = dispatch => {
  return {
    deletePost: (postId) => { return (
      dispatch(deletePost(postId))
      
    )
    }
    }
}
export default compose(connect(null,mapDispatchToProps),firestoreConnect([
  { collection: 'posts', orderBy:['createdAt','desc']}
 ])
)(PostList)
