import React from 'react';
import axios from 'axios';
import socket from '../socket';

function JoinBlock({onLogin}) {
    const [roomID, setRoomID] = React.useState('');
    const [userName, setUserName] = React.useState('');
    const [isLoading, setLoading] = React.useState(false);

    const onEnter = async () => {

        if (!roomID || !userName) {
            return alert('Заполните все поля!');
        }
        const obj = {
            roomID,
            userName
        };

        setLoading(true);
        await axios.post('/rooms', obj);
        onLogin(obj);
    };

    return (
        <div className="join-block">
            <div><input type="text" placeholder="Room ID" value={roomID} onChange={e => setRoomID(e.target.value)}/>
            </div>
            <div><input type="text" placeholder="Ваше имя" value={userName}
                        onChange={e => setUserName(e.target.value)}/></div>
            <div>
                <button disabled={isLoading} onClick={onEnter} className="btn btn-success">{isLoading ? 'ВХОД...' : 'ВОЙТИ'}</button>
            </div>
        </div>
    )

}

export default JoinBlock;