import React from 'react'
import { NavLink } from 'react-router-dom'

const SignedOutLinks = () => {
  return (
    <div>
      <ul className="right">
        <li><NavLink className="link" font-weight="fontWeightBold" to='/signup'>SIGNUP</NavLink></li>
        <li><NavLink className="link" font-weight="fontWeightBold" to='/signin'>LOGIN</NavLink></li>
      </ul>
    </div>
  )
}

export default SignedOutLinks