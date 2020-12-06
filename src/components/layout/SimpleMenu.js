import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from 'react-router-dom'
import {NavHashLink} from 'react-router-hash-link'

export default function SimpleMenu() {
  const [anchorElement, setAnchorElement] = React.useState(null);

  const handleClick = (event) => {
    setAnchorElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };

  return (
    <div id="menu">
      
        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}><i class="fas fa-bars"/></Button>
     
      <Menu
        id="simple-menu"
        anchorElement={anchorElement}
        keepMounted
        open={Boolean(anchorElement)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}><NavHashLink to="/myaccount#account" activeClassName="selected" activeStyle={{ color: 'red' }}>My Account</NavHashLink></MenuItem>
        <MenuItem onClick={handleClose}><NavHashLink to="/myaccount#rides">My Rides</NavHashLink></MenuItem>
        <MenuItem onClick={handleClose}><NavHashLink to="/myaccount#favourites">My Favourites</NavHashLink></MenuItem>
      </Menu>
    </div>
  );
}
