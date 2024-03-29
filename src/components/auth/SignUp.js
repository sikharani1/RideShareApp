import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {signUp} from '../../store/actions/authActions'
import {storage} from "firebase"

class SignUp extends Component {
  state = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    image:null,
    url:'',
    phoneNumber:0,
    progress: 0
  }
  handleImageAsFile = e => {
  
    console.log('start of upload');
    if(e.target.files[0]){
      const image=e.target.files[0];
      this.setState(()=>({image}))
    }
  }
    handleUpload = (e) => {
      e.preventDefault();
      const {image}=this.state;
      const uploadTask=storage().ref(`images/${image.name}`).put(image);
      uploadTask.on('state_changed', 
      (snapshot) => {
        // progrss function ....
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        this.setState({progress});
      }, 
      (error) => {
           // error function ....
        console.log(error);
      }, 
    () => {
        // complete function ....
        storage().ref('images').child(image.name).getDownloadURL().then(url => {
            console.log(url);
            this.setState({url});
            console.log(url);
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
    console.log(this.state);
    this.props.signUp(this.state)
  }
  render() {
    const style = {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    };
    const {auth}=this.props;
    if(auth.uid) return <Redirect to='/'/>
    return (
      
      <div className="container">
        <form className="white" onSubmit={this.handleSubmit}>
          <h5 className="grey-text text-darken-3">Sign Up</h5>
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
          <div style={style}>
          <label htmlFor="DL">Please Upload You Valid Drivers Licence</label>
      <progress value={this.state.progress} max="100"/>
      <br/>
        <input type="file" onChange={this.handleImageAsFile}/>
        <button onClick={this.handleUpload}>Upload</button>
        <br/>
        <img src={this.state.url || 'http://via.placeholder.com/400x300'} alt="Uploaded images" height="300" width="400"/>
      </div>
          <div className="input-field">
            <button className="btn pink lighten-1 z-depth-0">Sign Up</button>
          </div>
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