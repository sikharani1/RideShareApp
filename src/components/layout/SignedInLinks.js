import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { signOut } from '../../store/actions/authActions'
import {typography} from '@material-ui/system'

const SignedInLinks = (props) => {
  return (
    <div>
      <ul className="right" >
        <li><NavLink className="link" fontWeight="fontWeightBold" to='/create'>NEW POST</NavLink></li>
        <li><a className="link" fontWeight="fontWeightBold" onClick={props.signOut}>LOG OUT</a></li>
  <li><NavLink className="link" to='/myaccount' className="btn btn-floating pink lighten-1">{props.profile.initials}</NavLink></li>
  <li><NavLink className="link" to='/admin' className="btn btn-floating pink lighten-1"><i class="fas fa-users-cog"></i></NavLink></li>
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