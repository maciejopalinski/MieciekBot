import React from 'react';
import { Link } from 'react-router-dom';

import './Navbar.css';
import { Navbar as BSNavbar, Nav } from 'react-bootstrap';
import { User } from '..';

export function Navbar({ user }) {
    return (
        <BSNavbar bg='dark' variant='dark' expand='lg' className='navbar justify-content-between' sticky='top'>
                
            <BSNavbar.Brand href='/' className='navbar-brand'>
                <b>MieciekBot</b>
            </BSNavbar.Brand>

            <BSNavbar.Toggle aria-controls='navbar-collapse' />

            <BSNavbar.Collapse className='navbar-items' id='navbar-collapse'>
            
                <Nav className='mr-auto'>
                    <Nav.Link as={Link} to='/'>Home</Nav.Link>
                    <Nav.Link as={Link} to='/'>Docs</Nav.Link>                    
                </Nav>
                
                <User user={user} />
            
            </BSNavbar.Collapse>
            
        </BSNavbar>
    );
}