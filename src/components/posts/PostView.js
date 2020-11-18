import React,{ Component }  from 'react'
import {connect} from 'react-redux'
import {firestoreConnect} from 'react-redux-firebase'
import {updatePost,getAPost} from '../../store/actions/postActions'
import {compose} from 'redux'
import {Redirect} from 'react-router-dom'
import Comments from './Comments'
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import history from "../../utils/history";
import * as firebase from 'firebase';



class PostView extends Component {
  
  constructor(props){
    super(props);
   // const updatedData={};
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleChange=this.handleChange.bind(this);
    this.handleChange1=this.handleChange1.bind(this);
    //this.input = React.createRef();
    
    
    
  }
  
  componentWillMount(){
    let {id}=this.props.match.params;
    console.log(id);
    this.props.getAPost(id)
    
    // this.setState({
    //   posts:this.props.posts,
    //   loading: 'false'
    // });
    
    
    
  }
    componentDidUpdate(prevProps,prevState)  {
    // Typical usage (don't forget to compare props):
    console.log("Component did update")
    console.log(prevProps);
    console.log(this.props.posts);
    if (this.props.posts !== prevProps.posts) {
  
      console.log("updated");
      this.forceUpdate();
   // });
  }
  else{
   
    console.log("not updated");
  }
}

 handleChange = (e) => {
  e.persist();
    console.log(e.target.id);
    
   
    this.setState({
      [e.target.id]: e.target.value
    })
  } 
  handleChange1 = (e) => {
    e.persist();
      console.log(e.target.id);
      let value=e.target.value;
      this.setState(prevState => ({
        posts: { ...prevState.posts,  [e.target.id]: value }
      }))
      // this.setState({
      //   [e.target.id]: e.target.value
      // })
    } 


  handleUpdate(e) {
    e.preventDefault();
    
   
    console.log(this);
 
  
    console.log(this.props);
    console.log(this.state);
    this.props.updatePost(this.props.id,this.state);

   
    this.props.history.push("/");

}

  
// console.log(props.post(id).comments);
render() { 
 
  console.log("rendered again");
  const {posts,auth,comments} = this.props;
  console.log(this.state);
  
  console.log(this.props);
  if(!auth.uid) return <Redirect to='/signin'/>
  let user = firebase.auth().currentUser;  
  
  if(this.props.posts){
    
      return(
      
     
    <div className="container section post-details">
      <div className="card z-depth-0">
        <div className="card-content">
          <span className="card-title">{posts.title}</span>
          <p>{posts.content}</p>
        </div>
        <div className="card-action grey lighten-4 grey-text">
          <div>Posted by {posts.authorFirstName}{posts.authorLastName}</div>
          {/* <div>{post.createdAt.toDate().toDateString()}</div> */}
          <form onSubmit={this.handleUpdate} >
          <div className="input-field">
            <input type="text" /* ref={this.input}  key={this.state.posts.title ? 'notLoadedYet' : 'loaded'} */  id='title' onChange={this.handleChange1} value={posts.title} />
          </div>
          <div className="input-field">
          <label htmlFor="content">Post Content</label>
            <textarea id="content" className="materialize-textarea" value={posts.content} onChange={this.handleChange}></textarea>
            
          </div>
          <div className="input-field">
            <textarea id="origin" className="materialize-textarea" value={posts.origin} onChange={this.handleChange}></textarea>
            <label htmlFor="origin">Origin City</label>
          </div>
          <div className="input-field">
            <textarea id="arrival" className="materialize-textarea" value={posts.arrival} onChange={this.handleChange}></textarea>
            <label htmlFor="arrival">Arrival City</label>
          </div>
          <div className="input-field">
          <label htmlFor="start">Dep time:</label>
          <input type="time" id="deptime" name="deptime"
       min="09:00" max="18:00" value={posts.deptime} required/>
         </div>
         <div className="input-field">
         <label htmlFor="start">Return time:</label>
          <input type="time" id="returntime" name="returntime"
       min="09:00" max="18:00" value={posts.returntime} />
         </div>
         
         <label htmlFor="start">Start date:</label>
         <div className="input-field">
         <input type="date" id="startdate" name="trip-start"
       value={posts.startdate}
       min="2020-01-01" max="2020-12-31"></input>
       </div>
      
         <label htmlFor="start">Return date:</label>
         <div className="input-field">
         <input type="date" id="returndate" name="trip-start"
       value={posts.returndate}
       min="2020-01-01" max="2020-12-31"></input>
       </div>
          <div className="input-field">
            <textarea id="via" className="materialize-textarea" value={posts.via} onChange={this.handleChange}></textarea>
            <label htmlFor="via">Via</label>
          </div>
          <label htmlFor="gender">RIT Student</label>
          <div className="input-field radiobutton" defaultChecked={posts.origin}>
          <input type="radio" name="ritstudent" value="none" checked="checked" onChange={this.handleChange}/> Yes
          <input type="radio" name="ritstudent" value="some" onChange={this.handleChange}/> No
          </div>
          <label htmlFor="gender">Gender</label>
          <div className="input-field radiobutton" defaultChecked={posts.gender}>
          <input type="radio" name="gender" value="male" /> Male
          <input type="radio" name="gender" value="female"/> Female
          </div>
            
            <label htmlFor="gender">Disability</label>
          <div className="input-field radiobutton">
          <input type="radio" name="disability" value="none" deafaultchecked="checked"/> None
          <input type="radio" name="disability" value="some"/> Some
          </div>

            
          
          <div className="input-field">
          <select id="ethnicity" value="Asian">
  <option value="Asian" >Asian</option>
  <option value="African">African</option>
  <option value="White">White</option>
  <option value="Latino/Hispanic">Latino</option>
  <option value="MiddleEast">MiddleEast</option>
</select>
          <label htmlFor="Ethnicity"></label>
          </div>
          <div className="input-field">
          <input type="number" id="luggage" value={posts.luggage} onChange={this.handleChange}
       min="0" max="5"></input>
        <label htmlFor="luggage">No of luggage space available</label>
       </div>
       <div className="input-field">
       <input type="number" id="seats" value={posts.seats} onChange={this.handleChange}
       min="1" max="3"></input>
        <label htmlFor="seats">No of seats available</label>
        
       </div>
       <label htmlFor="age">Choose age group (yrs):</label>
       <div className="input-field">
       

<select id="age" value="20-30">
  <option value="20-30">20-30</option>
  <option value="30-40">30-40</option>
  <option value="40-50">40-50</option>
  <option value="50-60">50-60</option>
  <option value="60-70">60-70</option>
</select>

</div>

     {/* <div>
        <CountryDropdown
          value='USA'  //{this.state.country} 
          onChange={(val) => this.selectCountry(val)} />
    </div> 
    <div>
        <RegionDropdown
          country='USA'  //{post.country} 
          value= 'Newyork' //{this.state.region}
          onChange={(val) => this.selectRegion(val)} />
      </div> */}
      
        
      <div className="input-field">
      {(posts.authorId==user.uid)?<input type="submit" value="Submit" className="btn pink lighten-1" />:<input disabled type="submit" value="Submit" className="btn pink lighten-1" />
  }
</div>
</form>
          <Comments createComment={this.props.createComment} comments={comments} id = {this.props.id}/>
        </div>
      </div>
    </div>
    )



  }
  else{
    return (
        <div className="container center">
          <p>Loading post...</p>
        </div>
      )
  }
  //console.log(props);
 
  }
}



 const mapStateToProps = (state,ownProps) => {
   console.log(state);
 
   const id=ownProps.match.params.id;
   const posts=state.posts;
   const comments=state?posts.comments:null;

  return {
   posts: posts,
   comments:comments,
   id:id,
   auth:state.firebase.auth
  }
 }
 //export default connect(mapStateToProps, mapDispatchToProps)(singleGoal)
const mapDispatchToProps = dispatch => {
  return {
    getAPost: (id) => { dispatch(getAPost(id))},
    updatePost: (postId,updatedState) => dispatch(updatePost(postId,updatedState))
    

  }
}

//export default connect(mapStateToProps, mapDispatchToProps)(updatePost)
export default connect(mapStateToProps,mapDispatchToProps)(PostView)
