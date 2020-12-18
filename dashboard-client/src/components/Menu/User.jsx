import React from 'react';
// import { getUserAvatar } from '../../util/api';

import { Spinner, NavDropdown, Nav } from 'react-bootstrap';

export function User({user}) {
    
    const redirectToLogin = () => window.location.href = process.env.REACT_APP_API_URL + '/auth';
    
    if(user) {
        if(user.tag) {
            // logged in
            return (
                <NavDropdown title={user.tag}>
                    <NavDropdown.Item href='/menu'>Menu</NavDropdown.Item>
                    <NavDropdown.Item href='/@me'>Your data</NavDropdown.Item>
                </NavDropdown>
            );
        }
        else {
            // not logged in
            return (
                <Nav.Link onClick={redirectToLogin}>Login</Nav.Link>
            )
        }
    }
    else {
        // still loading
        return (
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        );
    }
}