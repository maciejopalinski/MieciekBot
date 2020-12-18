import React from 'react';

import { Navbar as BSNavbar, Nav } from 'react-bootstrap';
import { GuildsWrapper } from '../../components';
import { User } from './';

export function Navbar({
    user, guilds
}) {
    return (
        <BSNavbar bg='dark' variant='dark' expand='lg' className='navbar'>
                
            <BSNavbar.Brand href='/' className='navbar-brand'>
                <b>MieciekBot</b>
            </BSNavbar.Brand>

            <BSNavbar.Toggle aria-controls='navbar-collapse' />

            <BSNavbar.Collapse className='navbar-items' id='navbar-collapse'>
                <Nav className='mr-auto'>
                    <Nav.Link href='/'>Home</Nav.Link>

                    {(user && guilds) && (<GuildsWrapper guilds={guilds} />)}
                    
                    <User user={user} guilds={guilds} />
                </Nav>
            </BSNavbar.Collapse>
            
        </BSNavbar>
    );
}