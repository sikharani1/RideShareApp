import React /*,  {useState} */ from 'react'
import Comments from './Comments'
import {deletePost} from '../../store/actions/postActions'

const PostSummary = ({post}) => {
  
  return (
    
    <div className="card z-depth-0 post-summary">
      <div className="card-content white-text">
        <span className="card-title ">{post.title}</span>
        <p>Posted by {post.authorFirstName} {post.authorLastName}</p>
        <p className="black-text">{post.createdAt.toDate().toDateString()}</p>
  
      </div>

      
    </div>
    
   
   
    
  )
}

export default PostSummary