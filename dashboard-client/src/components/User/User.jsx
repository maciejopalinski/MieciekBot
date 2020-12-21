import React from 'react';
import { Link } from 'react-router-dom';

import { UserAvatar } from '.';
import { Spinner, NavDropdown, Nav } from 'react-bootstrap';

export function User({ user }) {
    
    const redirectToLogin = process.env.REACT_APP_API_URL + '/auth';
    
    if(user) {
        if(user.id) {
            // logged in
            return (
                <Nav>
                    <UserAvatar user={user} />
                    <NavDropdown title={user.tag}>
                        <NavDropdown.Item as={Link} to='/dashboard'>Dashboard</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to='/@me'>Your data</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to='/logout' className='logout'>Logout</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            );
        }
        else {
            // not logged in
            return (
                <Nav>
                    <Nav.Link href={redirectToLogin}>Login</Nav.Link>
                </Nav>
            );
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