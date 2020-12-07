import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import {signUp} from '../../store/actions/authActions'
import {connect} from 'react-redux'
import {storage} from "firebase"

class SignUp extends Component {
  state = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    image:null,
    imageurl:'',
    phoneNumber:0,
    uploadprogress: 0
  }
  handleImageAsFile = e => {
  
    
    if(e.target.files[0]){
      const image=e.target.files[0];
      this.setState(()=>({image}))
    }
  }
  handleUpload = (e) => {
      e.preventDefault();
      const {image}=this.state;
      const uploadtask=storage().ref(`images/${image.name}`).put(image);
      uploadtask.on('state_changed', 
      (snap) => {
        const uploadprogress = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        this.setState({uploadprogress});
      }, 
      (error) => {
          console.log(error);
      }, 
    () => {
       storage().ref('images').child(image.name).getDownloadURL().then(imageurl => {
           this.setState({imageurl});
           
        })
    });
    }
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    
    this.props.signUp(this.state)
  }
  render() {
  
    const {auth,authError}=this.props;
    if(auth.uid) return <Redirect to='/'/>
    
    
    return (
      <div className="container">
      
     
        <form className="white" onSubmit={this.handleSubmit}>
          <h5 className="light-blue-text text-darken-3 signup">SIGN UP</h5>
          <div className="input-field">
            <label htmlFor="email"><span id="asterisk">*</span> Email</label>
            <input type="email" id='email' onChange={this.handleChange} />
          </div>
          <div className="input-field">
            <label htmlFor="password">Password(required)</label>
            <input type="password" id='password' onChange={this.handleChange} />
          </div>
          <div className="input-field">
            <label htmlFor="firstName">First Name</label>
            <input type="text" id='firstName' onChange={this.handleChange} />
          </div>
          <div className="input-field">
            <label htmlFor="lastName">Last Name</label>
            <input type="text" id='lastName' onChange={this.handleChange} />
          </div>
          <div className="input-field">
            <label htmlFor="phoneNumber"><span id="asterisk">*</span> Mobile Number</label>
            <input type="number" id='phoneNumber' onChange={this.handleChange} />
          </div>
          <div id="imageupload">
          <label htmlFor="DL" id="dl">Please Upload Your Valid Drivers Licence</label>
      <progress value={this.state.uploadprogress} max="100"/>
      <br/>
        <input type="file" onChange={this.handleImageAsFile}/>
        <button class="buttons btn yellow darken-3 black-text z-depth-0" onClick={this.handleUpload}>Upload</button>
        <br/>
        <img src={this.state.imageurl || 'http://via.placeholder.com/400x300'} alt="Uploaded image" height="300" width="400"/>
      </div>
          <div className="input-field">
            <button className="btn yellow darken-3 black-text z-depth-0 buttons">SIGN UP</button>
          </div>
          {(authError)?(
      <div className="red-text text-darken-1 center">{authError}</div>):null}
        </form>
        
      </div>
    )
  }
}
const mapStateToProps=(state)=>{
  return{
    
    auth:state.firebase.auth,
    authError:state.auth.authError
  }
}
const mapDispatchToProps= (dispatch) => {
  return {
    signUp: (newUser) => dispatch(signUp(newUser))
}
}

export default connect(mapStateToProps,mapDispatchToProps)(SignUp)