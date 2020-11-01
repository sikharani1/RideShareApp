import React, { Component } from 'react'
import {connect} from 'react-redux'
import {createPost} from '../../store/actions/postActions'
import {Redirect} from 'react-router-dom'
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import history from "../../utils/history";
class CreatePost extends Component {
  state = {
    title: '',
    content: '',
    
    // country: '', 
    // region: '',
    //date:new Date()
  



  }

  
  // selectCountry (val) {
  //   this.setState({ country: val });
  // }
 
  // selectRegion (val) {
  //   this.setState({ region: val });
  // }
  handleChange = (e) => {
    
  console.log(e.target);
    
  if(e.target.id){
  
    this.setState({
      [e.target.id]: e.target.value
    })
  
  }
    else{

      this.setState({
        [e.target.className]: e.target.value
      })
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.type);
    this.props.createPost(this.state,this.type);

    this.props.history.push('/');

  }
  // handleUpdate(e){
  //   e.preventDefault(this.state.title);
  //   this.setState({
  //     title:""
  //   });
    
  // }
  render() {
   // const { country, region ,date} = this.state;
    const {auth}=this.props;
    if(!auth.uid) return <Redirect to='/signin'/>
    return (
      <div className="container">
        <form className="white" onSubmit={this.handleSubmit}>
        <div className="input-field" >
          <label htmlFor="post_or_request"></label>
          <select id="type" onChange={this.handleChange}>
          <option value="Post">Post a Ride</option>
          <option value="Request">Request a Ride</option>
</select>
</div>
          <h5 className="grey-text text-darken-3">Create a New Post</h5>
          <div className="input-field">
            <input type="text" id='title' onChange={this.handleChange} />
            <label htmlFor="title">Post Title</label>
          </div>
          <div className="input-field">
            <textarea id="content" className="materialize-textarea" onChange={this.handleChange}></textarea>
            <label htmlFor="content">Post Content</label>
          </div>
          <div className="input-field">
            <textarea id="origin" className="materialize-textarea" onChange={this.handleChange}></textarea>
            <label htmlFor="origin">Origin City</label>
          </div>
          <div className="input-field">
            <textarea id="arrival" className="materialize-textarea" onChange={this.handleChange}></textarea>
            <label htmlFor="arrival">Arrival City</label>
          </div>
          <div className="input-field">
          <input type="time" id="deptime" name="dep-time"
       min="09:00" max="18:00" required onChange={this.handleChange}/>
         </div>
         <div className="input-field">
          <input type="time" id="returntime" name="return-time"
       min="09:00" max="18:00" onChange={this.handleChange} />
         </div>
         
         <label for="start">Start date:</label>
         <div className="input-field">
         <input type="date" id="startdate" name="trip-start"
       defaultValue={new Date()} 
       min="2020-01-01" max="2020-12-31" onChange={this.handleChange}></input>
       </div>
      
         <label for="start">Return date:</label>
         <div className="input-field">
         <input type="date" id="returndate" name="trip-end"
       defaultValue={new Date()}
       min="2020-01-01" max="2020-12-31" onChange={this.handleChange}></input>
       </div>
          <div className="input-field">
            <textarea id="via" className="materialize-textarea" onChange={this.handleChange}></textarea>
            <label htmlFor="via">Via</label>
          </div>
          <label htmlFor="ritstudent">RIT Student</label>
          <div className="input-field radiobutton">
          <input className="ritstudent" type="radio" name="ritstudent" value="yes" onChange={this.handleChange} /> Yes
          <input className="ritstudent" type="radio" name="ritstudent" value="no" onChange={this.handleChange} /> No
          </div>
          <label htmlFor="gender">Gender</label>
          <div className="input-field radiobutton">
          <input className="gender" type="radio" name="gender" value="male" onChange={this.handleChange}/> Male
          <input className="gender" type="radio" name="gender" value="female" onChange={this.handleChange}/> Female
          </div>
            
            <label htmlFor="disability">Disability</label>
          <div className="input-field radiobutton">
          <input className="disability" type="radio" name="disability" value="none" onChange={this.handleChange}/> None
          <input className="disability" type="radio" name="disability" value="some" onChange={this.handleChange}/> Some
          </div> 
          <div className="input-field" >
          <label htmlFor="Ethnicity"></label>
          <select id="ethnicity" onChange={this.handleChange}>
  <option value="Asian">Asian</option>
  <option value="African">African</option>
  <option value="White">White</option>
  <option value="Latino/Hispanic">Latino</option>
  <option value="MiddleEast">MiddleEast</option>
</select>
</div>
          <div className="input-field">
          <input type="number" id="luggage" onChange={this.handleChange}
       min="0" max="5"></input>
        <label htmlFor="luggage">No of luggage space available</label>
       </div>
       <div className="input-field">
       <input type="number" id="seats" onChange={this.handleChange}
       min="1" max="3"></input>
        <label htmlFor="seats">No of seats available</label>
        
       </div>
       <label htmlFor="age">Choose age group (yrs):</label>
       <div className="input-field" >
       

<select id="age" defaultValue="20-30" onChange={this.handleChange}>
  <option value="20-30">20-30</option>
  <option value="30-40">30-40</option>
  <option value="40-50">40-50</option>
  <option value="50-60">50-60</option>
  <option value="60-70">60-70</option>
</select>

</div>
<label htmlFor="privacy">Privacy:</label>
       <div className="input-field">
       <select id="privacy" defaultValue="public" onChange={this.handleChange}>
  <option value="public">public</option>
  <option value="private">private</option>
  </select>
  </div>
         {/* <div>
        <CountryDropdown
          value={country}
          onChange={(val) => this.selectCountry(val)} />
    </div>  */}
    {/* <div>
        <RegionDropdown
          country={country}
          value={region}
          onChange={(val) => this.selectRegion(val)} />
      </div> */}
          <div className="input-field">
            <button className="btn pink lighten-1 buttons" >Create</button>
          </div>
        </form>
      </div>
    )
  }
}
const mapStateToProps=(state)=>
{
  //console.log(state);
 
  return{

      auth:state.firebase.auth
  }
}
const mapDispatchToProps = dispatch => {
  
  return {
    createPost: (post) => dispatch(createPost(post))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatePost)
