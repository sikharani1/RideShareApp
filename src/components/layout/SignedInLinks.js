import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { signOut } from '../../store/actions/authActions'
import {typography} from '@material-ui/system'

const SignedInLinks = (props) => {
  return (
    <div>
      <ul className="right" >
        <li><NavLink className="link" fontWeight="fontWeightBold" to='/create'>New Post</NavLink></li>
        <li><a className="link" fontWeight="fontWeightBold" onClick={props.signOut}>Log Out</a></li>
  <li><NavLink className="link" to='/myaccount' className="btn btn-floating pink lighten-1">{props.profile.initials}</NavLink></li>
      </ul>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut())
  }
}

export default connect(null, mapDispatchToProps)(SignedInLinks)