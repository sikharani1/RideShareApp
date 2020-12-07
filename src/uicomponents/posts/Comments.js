import React, {Component} from 'react'
import {connect} from 'react-redux'
import {createComment} from '../../store/actions/commentActions'


class Comments extends Component {

    constructor() {
        super()
        this.handleSubmit = this.handleSubmit.bind(this)
        this.state = {
            
            
            comments:[]
        }
    }
    async componentDidMount() {
        await(this.props.comments)
    }
    componentDidUpdate(prevProps,prevState)  {
     
        if (this.props.comments !== prevProps.comments) {
      
        
          this.forceUpdate();
          
       // });
      }
      else{
       
        console.log("not updated");
      }
    }
    handleSubmit(event) {
        event.preventDefault()
        const comment = event.target.elements.comment.value
        this.props.createComment(comment, this.props.id)
        event.target.elements.comment.value = ''
        
    }

    render() {
        const comments=this.props.comments;
        const commentsArrayList=[];
        const commentsArray=[];
      if(Array.isArray(comments))
        {
           
          comments.map(sgp=>{
         
         const authorName=sgp.authorFirstName;
         
            if(Array.isArray(sgp.singlepersoncomments))
            {
                sgp.singlepersoncomments.map((comment,) => 
                {
                   return (
                        
                        commentsArray.push({authorName:authorName,comment:comment.value})
                        )
                     });
            }
            else{
                    commentsArray.push({authorName:authorName,comment:this.props.comments[0].singlepersoncomments[0].value});    
                }
                return commentsArray;
           })
         }

        return (    
        <div>
         
            {
            commentsArray.map((comment,index)=>(
                 <p key={comment.index}> {comment.authorName} - {comment.comment} </p>
                 ))}
            <p id="commentcount">{commentsArray.length} Comments</p>
        
        <div className="comment">
        <form className="comment-form" onSubmit={this.handleSubmit}> 
            <input type="text" placeholder="comment" name="comment"/>
            <input type="submit" hidden/>
        </form>
    

    </div>
    </div>
        
            
        )
       }
}
const mapStateToProps=(state)=>
{
  
  return{

      auth:state.firebase.auth
      
  }
}
const mapDispatchToProps = dispatch => {
  return {
    createComment: (comment,postId) => dispatch(createComment(comment,postId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Comments)

