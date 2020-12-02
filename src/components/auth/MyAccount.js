import React, { Component } from 'react'
import { connect } from 'react-redux'
import {firestoreConnect} from 'react-redux-firebase'
import {compose} from 'redux'
import { auth } from 'firebase'
import {signOut} from '../../store/actions/authActions'
import {Redirect} from 'react-router-dom'
import * as firebase from 'firebase';
import MyRides from './MyRides';
import PostList from '../posts/PostList'
import { TextInput, Button, Alert } from 'react'
import {HashLink} from 'react-router-hash-link'

class MyAccount extends Component {
    constructor(props){
    super(props);
    this.onSignoutPress = this.onSignoutPress.bind(this);
    this.onChangePasswordPress=this.onChangePasswordPress.bind(this);
    this.onChangeEmailPress=this.onChangeEmailPress.bind(this);
   }
componentWillMount() {
  this.setState({
    newEmail: '',
    newPassword: '',
    currentPassword:''
    })
}
async componentDidMount() {
  console.log(this.props);
   
  let user= this.props.firebaseauth.currentUser;  

    console.log(user.uid);
   this.setState({
    currentUser:user,
     myposts:await this.props.myposts
 
   })
   console.log(this.state.myposts);
  }
  

// Occurs when signout is pressed...
onSignoutPress = () => {
    this.props.signOut();
    
  }
  reauthenticate = (currentPassword) => {
    console.log(this.props);
    var user = this.props.firebaseauth.currentUser;
    var cred = this.props.auth.EmailAuthProvider.credential(user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
  }

  // Changes user's password...
  onChangePasswordPress = () => {
    console.log(this.props);
    this.reauthenticate(this.state.currentPassword).then(() => {
      var user = this.props.firebaseauth.currentUser;
      user.updatePassword(this.state.newPassword).then(() => {
        alert("Password was changed");
      }).catch((error) => { console.log(error.message); });
    }).catch((error) => { console.log(error.message) });
  }

  // Changes user's email...
  onChangeEmailPress = () => {
    this.reauthenticate(this.state.currentPassword).then(() => {
      var user = this.props.firebaseauth.currentUser;
      user.updateEmail(this.state.newEmail).then(() => {
        alert("Email was changed");
      }).catch((error) => { console
        .log(error.message); });
    }).catch((error) => { console.log(error.message) });
  }
  checkUser(uid){
    return function(post){
      console.log(post.authorId);
      console.log(post.authorId==uid);
      return post.authorId==uid ;
    }
  }
  




  render() {
    console.log(this.props);
    const {authError,auth,firebaseauth,myposts,users}=this.props;
    
    //const myposts=Object.entries(posts);
    console.log(myposts);
    console.log(users);
    let user=this.state.currentUser;
    user = firebase.auth().currentUser;
    const posts=this.props.myposts.filter(post=>post.authorId==user.uid);

    const posts1=[];
    
    const currentuser=this.props.users.filter(u=>u.id==user.uid);
    console.log(currentuser);
    if(currentuser[0].favourites) currentuser[0].favourites.map((fav)=>
    {
      console.log(fav);
      const favouriteposts=this.props.myposts.filter(post=>post.id==fav)
      console.log(favouriteposts);
    if(favouriteposts!=[]) posts1.push(favouriteposts[0]);
    }
    )
    console.log(posts);
    console.log(posts1);
    
   
  
   // if(auth.uid) return <Redirect to='/'/>
    return (
    
      
        <div className="container">
         <div id="account">
          <button className="myaccount-btn signout btn pink lighten-1 z-depth-0" onClick={this.onSignoutPress}>Sign out</button> 
          <i class="fas fa-user-edit"></i>
          <h5 className="grey-text text-darken-3">Password Reset</h5>
          <div className="input-field">
       
           <label htmlFor="current password">Current Password</label>
           <input type="password" id='current password' autoCapitalize="none" secureTextEntry={true} onChange={(e)=>this.setState({currentPassword: e.target.value})} />
          </div>
          <div className="input-field">
       
           <label htmlFor="new password">New Password</label>
           <input type="password" id='new password' autoCapitalize="none" secureTextEntry={true} onChange={(e)=>this.setState({newPassword: e.target.value})} />
          </div>
          <button className="myaccount-btn btn pink lighten-1 z-depth-0" onClick={this.onChangePasswordPress}>Change Password</button>
          </div>
          {/* <div className="input-field">
       
       <label htmlFor="email">Email</label>
       <input type="email" id='email' autoCapitalize="none" keyboardType="email-address" onChange={(e)=>this.setState({newEmail: e.target.value})} />
      </div>
      <button title="Change Email" onClick={this.onChangeEmailPress}>Change Email</button> */}
      {/* <MyRides myposts={this.props.posts} /> */}
      <div id="rides" className="main-container shadow">
      <b><h6 id="myrides-header">MY RIDES</h6></b>
<div className="posts-container" id="myrides">
     {/* <PostList posts={this.props.myposts.filter(this.checkUser(user.uid))} /> */}
     <PostList posts={posts} />
      </div>

</div>
<div id="favourites" className="main-container shadow">
      <b><h6 id="myrides-header">MY FAVOURITES</h6></b>
<div className="posts-container" id="myfavourites">
     {/* <PostList posts={this.props.myposts.filter(this.checkUser(user.uid))} /> */}
     <PostList posts={posts1} />
      </div>

</div>
<HashLink className="gototop" to="/myaccount#" activeStyle={{ color: 'red' }}>GO TO TOP</HashLink>
        </div>

      
    )
  }
}

const mapStateToProps=(state)=>{
  console.log(state);
  return{
    myposts: state.firestore.ordered.posts,
    users: state.firestore.ordered.users,
    authError:state.auth.authError,
  
    auth:firebase.auth,
    firebaseauth:firebase.auth()
  }
}
const mapDispatchToProps=(dispatch)=>{
return {
  signOut:()=>dispatch(signOut())
}
}



  // Reauthenticates the current user and returns a promise...
  






  export default compose(connect(mapStateToProps,mapDispatchToProps),firestoreConnect([
    { collection: 'posts'}, { collection: 'users'}
   ])
  )(MyAccount)

  