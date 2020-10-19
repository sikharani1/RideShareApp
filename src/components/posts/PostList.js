import React,{useState} from 'react'
import PostSummary from './PostSummary'
import {Link,Route} from 'react-router-dom'
import Like from '../dashboard/Like.js'
import Bookmark from '../dashboard/Bookmark.js'
import {deletePost} from '../../store/actions/postActions'
import {connect} from 'react-redux'
import {compose} from'redux'
import {firestoreConnect} from 'react-redux-firebase'
import * as firebase from 'firebase';

const PostList = (props) => {
  
  const {posts,onLike,onBookmark,deletePost}=props;
 //console.log(props);
  posts && posts.sort(function(x, y){
    //console.log(x.createdAt);
    //console.log(y.createdAt);
    return y.createdAt - x.createdAt;
})
  
 // console.log(typeof posts);


  
  //const {}=props;
  
  

  
  return (
<Route>
    <div className="post-list section">
      { 
      //(
        
      //   (posts!==undefined && posts.sort(function(x, y){
      //     return x.createdAt.timestamp - y.createdAt.timestamp;
      // }))
      (posts) && posts.map(post => {
        console.log(post.liked);
        let user = firebase.auth().currentUser;    
          if(post.authorId==user.uid)
          {
        return (
          <div>
          <Link to={'/post/'+post.id} target="_blank" >
            <PostSummary post={post} key={post.id} />
          </Link>
          
          <div className="input-field">
            <button className="btn pink lighten-1" onClick={() =>  deletePost(post.id) } >Delete</button>
          </div>
          {(post.privacy=="public")?<div>Email: {post.email}</div>:<div></div>}
          
          
          </div>
        )
      }
      else{
        return(
          <div>
          <Link target="_blank" to={'/post/'+post.id}>
          <PostSummary post={post} key={post.id} />
          {(post.privacy=="public")?<div>Email{post.email}</div>:<div></div>}
          </Link>
          <Like liked={post.liked} onClick={()=>onLike(post)} />
          <Bookmark starred={post.starred} onClick={()=>onBookmark(post)} />
       
      
     
      
      </div>
      
        )
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
