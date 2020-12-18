/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { getUserDetails, getMutualGuilds } from '../../util/api';

import '../styles.css';
import { Navbar } from '../../components';

export function HomePage(props) {
    
    const [ user, setUser ] = React.useState(null);
    const [ guilds, setGuilds ] = React.useState([]);

    React.useEffect(() => {
        getUserDetails()
        .then(res => {
            // console.log(res.data);
            setUser(res.data);
            
            return getMutualGuilds();
        })
        .then(res => {
            // console.log(res.data);
            setGuilds(res.data);
        })
        .catch(err => {
            console.log("[INFO] Not logged in");
            setUser({});
        });
    }, []);

    return (
        <div>
            <Navbar user={user} guilds={guilds} />
            
            <div className='app-header'>
                <img
                    className='mieciekbot-img'
                    src='https://cdn.discordapp.com/avatars/511219391539445761/067aec30675c8483654c344bfabd2c19.png?size=4096'
                    alt='MieciekBot Avatar'
                    width='400px'
                />
                <h1>This is the best Discord Bot!</h1>
                <h3>Includes: moderation, leveling, music and much more!</h3>
            </div>
        </div>
    );
}