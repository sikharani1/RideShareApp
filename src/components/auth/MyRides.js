import React, { Component } from 'react'
import { connect } from 'react-redux'
import {firestoreConnect} from 'react-redux-firebase'
import {compose} from 'redux'
import { auth } from 'firebase'
import {signOut} from '../../store/actions/authActions'
import {Redirect} from 'react-router-dom'
import * as firebase from 'firebase';
import PostList from '../posts/PostList'

const MyRides = (props) => {
    const {myposts}=props;
    let user = firebase.auth().currentUser;   
    return(
<div className="main-container shadow">
<label htmlFor="my rides">My Rides</label>
<div className="posts-container">


    <PostList myposts={myposts.filter(post => post.authorId==user.uid)}/>
    </div>

</div>
    )
}

  
  
  export default MyRides
   
