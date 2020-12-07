import React, { Component } from 'react'
import {connect} from 'react-redux'
import {createPost} from '../../store/actions/postActions'
import {Redirect} from 'react-router-dom'
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import history from "../../utils/history";
import purify from "dompurify";
import validator from 'validator'; 
import TextField from '@material-ui/core/TextField';

const inputRegex=RegExp(/^[^<>]+$/)

class CreatePost extends Component {
handleChange=(e)=>{
  e.preventDefault(); 
  if(e.target.id){
    this.setState({
      //sanitizing each value with purify method from dompurify before saving
      [e.target.id]: purify.sanitize(e.target.value)
    })
    
    }
  else{
      this.setState({
        [e.target.className]: purify.sanitize(e.target.value)
      })
      
    }
  
}
validate(item,value){
  var valid=true;
  var regexvalid=true;  
 
  // Check if field value is empty or contains unallowed characters
  if (validator.isEmpty(`${value}`) && !inputRegex.test(value)){
    regexvalid=false;
    alert(`please enter valid values for ${item}`);
    
    valid=false;
  }
  else{
    regexvalid=true;
  }

  if(regexvalid==true){
  //check if title, origin or arrival field values are just numeric and not text  
  if(item=="title" || item=="origin" || item=="arrival"){
    if(validator.isNumeric(`${value}`)){
      valid=false;
      alert(`${item} field is not valid`);
    
    }
  }
}
return valid;

}
handleSubmit = (e) => {
    var validinputs=false;
    var validinputsArray=[];
    e.preventDefault();
   
    const iterator1 = Object.entries(this.state);
    var isValid=false;
    iterator1.forEach(item=>
      //validating each value with validate implemeneting diff methods from validator.js before submitting
      {isValid=this.validate(item[0],item[1]);
        if(isValid==false){
          validinputsArray.push(false);
          
        }
      }
    )
    if(validinputsArray.includes(false)){
        console.log("invalid inputs");
    }
    else{
      
      this.props.createPost(this.state,this.type);
      this.props.history.push('/');
    }
}
 
render() {
   
    const {auth}=this.props;
    if(!auth.uid) return <Redirect to='/signin'/>
    return (
      <div className="container">
        <form className="white" onSubmit={this.handleSubmit}>
        {/* <h1>hello</h1> */}
        {/* tried to check this attack scenario */}
        {/* <h1 dangerouslySetInnerHTML= {{ __html:purify.sanitize(`<b>"Hi, <img src='' onerror='alert(0)' />"</b>`)}}/>  */}
         {/* {this.sanitize(this.props.title)}  */}
        <div className="input-field" >
          <label htmlFor="post_or_request"></label>
          <select id="type" onChange={this.handleChange}>
          <option value="Post">POST A RIDE</option>
          <option value="Request">REQUEST A RIDE</option>
          </select>
          </div>
          <h6 className="grey-text text-darken-3">CREATE A NEW POST</h6>
          <div className="input-field">
            <input type="text" id='title' required onChange={this.handleChange}  />
            <label htmlFor="title">Post Title</label>
          </div>

          <div className="input-field">
            <textarea id="content" className="materialize-textarea" onChange={this.handleChange}></textarea>
            <label htmlFor="content">Post Content</label>
          </div>

          <div className="input-field">
            <textarea id="origin" className="materialize-textarea" required onChange={this.handleChange}></textarea>
            <label htmlFor="origin">Origin City</label>
          </div>

          <div className="input-field">
            <textarea id="arrival" className="materialize-textarea" required onChange={this.handleChange}></textarea>
            <label htmlFor="arrival">Arrival City</label>
          </div>
  <div className="input-field">
    <TextField
    id="start_datetime_local"
    label="Start Date Time"
    type="datetime-local"
    defaultValue="2017-05-24T10:30"
    onChange={this.handleChange}
    InputLabelProps={{
      shrink: true,
    }}
  />
  </div>
  <div className="input-field">
  <TextField
    id="return_datetime_local"
    label="Return Date Time"
    type="datetime-local"
    defaultValue="2017-05-24T10:30"
    onChange={this.handleChange}
    InputLabelProps={{
      shrink: true,
    }}
  />
  </div>
{/* 
          <div className="input-field">
            <label htmlFor="start">Dep time:</label>
            <input type="time" id="deptime" name="dep-time"
            min="09:00" max="18:00"  onChange={this.handleChange} />
         </div>

         <div className="input-field">
          <label htmlFor="return">Return time:</label>
          <input type="time" id="returntime" name="return-time"
          min="09:00" max="18:00" onChange={this.handleChange} />
         </div>

         <label htmlFor="start">Start date:</label>
         <div className="input-field">
         <input type="date" id="startdate" name="trip-start"
          //  defaultValue={new Date()} 
          min="2020-01-01" max="2020-12-31" onChange={this.handleChange}></input>
          </div>
      
         <label htmlFor="start">Return date:</label>
         <div className="input-field">
         <input type="date" id="returndate" name="trip-end"
          //  defaultValue={new Date()}
          min="2020-01-01" max="2020-12-31" onChange={this.handleChange}></input>
          </div> */}

          <div className="input-field">
            <textarea id="via" className="materialize-textarea" onKeyPress={this.handleEnter}></textarea>
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
         
                <div className="input-field">
                  <button className="btn yellow darken-3 black-text buttons" >Create</button>
                </div>
        </form>
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
    createPost: (post) => dispatch(createPost(post))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatePost)
