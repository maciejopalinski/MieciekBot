import React from 'react';

import './GuildsWrapper.css';
import { Spinner } from 'react-bootstrap';
import { Guild } from '.';

export function GuildsWrapper({ guilds }) {

    if(guilds && guilds instanceof Array) {
        // logged in
        return (
            <div>
                <div className='guilds'>
                    {guilds.map(guild => (
                        <Guild guild={guild} key={guild.id} />
                    ))}
                </div>

                {guilds.length < 1 && (<h3>You have no guilds available!</h3>)}
            </div>
        );
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