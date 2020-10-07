import React /*,  {useState} */ from 'react'
import Comments from './Comments'
import {deletePost} from '../../store/actions/postActions'

const PostSummary = ({post}) => {
  console.log(post);
  
 
  return (
    
    <div className="card z-depth-0 post-summary">
      <div className="card-content text-darken-3">
        <span className="card-title ">{post.title}</span>
        <p>Posted by {post.authorFirstName} {post.authorLastName}</p>
  <p className="black-text">{post.createdAt.toDate().toDateString()}</p>
  
      </div>

      
    </div>
    
   
   
    
  )
}

export default PostSummary