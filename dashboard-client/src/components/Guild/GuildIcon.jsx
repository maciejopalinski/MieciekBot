import React from 'react';
import { getGuildIcon } from '../../util/api';

export function GuildIcon({ guild }) {

    if(guild.icon) {
        return (
            <img
                className='guild-icon guild-image'
                src={getGuildIcon(guild.id, guild.icon, 512)}
                alt=''
            />
        );
    }
    else {
        return (
            <div className='guild-icon guild-acronym'>
                {guild.name.split(' ').map(v => v[0]).join('')}
            </div>
        );
    }
}