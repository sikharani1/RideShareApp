import React from 'react'
import { Link } from 'react-router-dom'
const Footer = (props) => {
    
return (
    <footer className="page-footer grey darken-3">
      <div className="container"></div>
      <div className="footer-copyright">
            <div className="container">
      <Link to='/' className="brand-logo"><i className="fas fa-car-side"></i> RIDESHARE</Link>
         &nbsp; All rights reserved. © 2020 SIKHA RANI. 
        </div>
      </div>
    </footer>
    )
}


export default (Footer)