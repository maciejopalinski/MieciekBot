import React from 'react';
import { getUserAvatar } from '../../util/api';

import './UserAvatar.css'

export function UserAvatar({ user }) {
    
    return (
        <div className='user-avatar d-none d-lg-block' style={{
            backgroundImage: `url(${getUserAvatar(user.id, user.avatar, 512)})`
        }}>
        </div>
    );
}