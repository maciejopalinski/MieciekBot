/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { getUserDetails, getMutualGuilds } from '../../util/api';

import { Navbar, GuildsWrapper } from '../../components';

export function MenuPage(props) {

    const [ user, setUser ] = React.useState(null);
    const [ guilds, setGuilds ] = React.useState(null);

    React.useEffect(() => {
        
        getUserDetails()
        .then(res => setUser(res.data))
        .catch(err => {
            setUser({});
            props.history.push('/');
        });
        
        getMutualGuilds()
        .then(res => setGuilds(res.data))
        .catch(err => {
            setGuilds([]);
        });

    }, []);

    return (
        <div>
            <Navbar user={user} guilds={guilds} />
            
            <div className='app'>
                <h1>Select a server</h1>

                <GuildsWrapper guilds={guilds} />
            </div>
        </div>
    );
}