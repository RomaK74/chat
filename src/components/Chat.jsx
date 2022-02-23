import React from 'react';
import socket from "../socket";


function Chat({users, messages, userName, roomID, onAddMessage}) {
    const [messageValue, setMessageValue] = React.useState('');
    const messagesRef = React.useRef(null);

    const onSendMessage = (e) => {
        if (messageValue === '') {
            e.preventDefault()
        } else {
            console.log(123);
            socket.emit('ROOM:NEW_MESSAGE', {
                userName,
                roomID,
                text: messageValue,
                time: new Date().toLocaleTimeString()
            });
            onAddMessage({userName, text: messageValue});
            setMessageValue('');
        }
    };

    const handleEnter = (e) => {
        if (e.keyCode === 'Enter') {
            this.onSendMessage();
        }
    }

    React.useEffect(() => {
        messagesRef.current.scrollTo(0, 99999);
    }, [messages]);

    return (
        <div className="chat">
            <div className="chat-users">
                Комната: <b>{roomID}</b>
                <hr/>
                <span>Онлайн ({users.length}):</span>
                <ul>
                    {users.map((name, index) => (
                        <li key={name + index}>{name}</li>
                    ))}
                </ul>
            </div>
            <div className="chat-messages">
                <div ref={messagesRef} className="messages">
                    {messages.map((message) => (
                        <div className="message">
                            <div>
                                <span>{message.userName}</span>
                            </div>
                            <p>{message.text}</p>

                        </div>
                    ))}
                </div>
                <form>
                    <textarea
                        value={messageValue}
                        onChange={e => setMessageValue(e.target.value)}
                        className="form-control"
                        rows="3"
                    onKeyPress={handleEnter}></textarea>
                    <button onClick={onSendMessage} type="button" className="btn btn-primary">
                        Отправить
                    </button>
                </form>
            </div>
        </div>

    );

}

export default Chat;