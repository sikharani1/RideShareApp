import React, { Component } from 'react'
import {signIn} from '../../store/actions/authActions'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {compose} from 'redux'

class SignIn extends Component {
  state = {
    email: '',
    password: '',
    
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.signIn(this.state);
  }
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }
  render() {
    const {authError,auth}=this.props;
    
    if(auth.uid) return <Redirect to='/'/>
    return (
      <div className="container">
        <form className="white" onSubmit={this.handleSubmit}>
          <h5 className="black-text text-darken-3 signin">SIGN IN</h5>
          <div className="input-field">
            <label htmlFor="email">Current Email</label>
            <input type="email" id='email' onChange={this.handleChange} />
          </div>
          <div className="input-field">
            <label htmlFor="password">Current Password</label>
            <input type="password" id='password' onChange={this.handleChange} />
          </div>
          
          <div className="input-field">
            <button className="btn yellow darken-3 black-text z-depth-0 buttons">Login</button>
            <div className="red-text text-darken-1 center">
              {authError?<p>{authError}</p>:null}
            </div>
          </div>
        </form>
      </div>
    )
  }
}
const mapStateToProps=(state)=>{
  return{
    authError:state.auth.authError,
    auth:state.firebase.auth
  }
}
const mapDispatchToProps=(dispatch)=>{
return {
  signIn:(creds)=>dispatch(signIn(creds))
}
}

export default compose(connect(mapStateToProps,mapDispatchToProps))(SignIn)