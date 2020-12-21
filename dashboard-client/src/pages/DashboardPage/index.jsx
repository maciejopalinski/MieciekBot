/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { getUserDetails, getMutualGuilds } from '../../util/api';

import { Navbar, GuildDashboard } from '../../components';

export function DashboardPage({
    history, match
}) {
    
    const [ user, setUser ] = React.useState(null);
    const [ guilds, setGuilds ] = React.useState(null);
    const [ currentGuild, setCurrentGuild ] = React.useState(null);

    React.useEffect(() => {
        
        getUserDetails()
        .then(res => setUser(res.data))
        .catch(err => {
            setUser({});
            history.push('/');
        });
        
        getMutualGuilds()
        .then(res => {
            setGuilds(res.data);

            setCurrentGuild(res.data.find(v => v.id === match.params.id));
        })
        .catch(err => {
            setGuilds([]);
        });

    }, []);

    return (
        <div>
            <Navbar user={user} guilds={guilds} />
            
            <div className='app'>
                <h1>Dashboard Page</h1>

                <GuildDashboard guild={currentGuild} />
            </div>
        </div>
    );
}