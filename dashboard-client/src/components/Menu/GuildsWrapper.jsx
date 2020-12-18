import React from 'react';

import { NavDropdown } from 'react-bootstrap';

export function GuildsWrapper({guilds}) {
    return (
        <NavDropdown title='Guilds' id='navbar-guilds'>
            {guilds.map(guild => (
                <NavDropdown.Item key={guild.id} href={`/dashboard/${guild.id}`}>
                    {guild.name}
                </NavDropdown.Item>
            ))}
        </NavDropdown>
    );
}