const express = require('express'); // подключаем библиотеку, благодаря которой можно запускать серверную часть (веб)

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server); // подключаем socket к серверу

app.use(express.json());

const rooms = new Map();

app.get('/rooms/:id', (req, res) => { // если пришёл get-запрос rooms, то выполняем функцию (req - клиент, res - сервер)
    const {id: roomID} = req.params;
    const obj = rooms.has(roomID)
        ? {
            users: [...rooms.get(roomID).get('users').values()],
            messages: [...rooms.get(roomID).get('messages').values()]
        }
        : {users: [], messages: []};
    res.json(obj);
});

app.post('/rooms', (req, res) => {
    const {roomID, userName} = req.body;
    if (!rooms.has(roomID)) {
        rooms.set(
            roomID,
            new Map([
                ['users', new Map()],
                ['messages', []],
            ]),
        );
    }
    res.send();
});

io.on('connection', (socket) => {
    socket.on('ROOM:JOIN', ({roomID, userName}) => {
        socket.join(roomID); //подключение к сокету в определнную комнату
        rooms.get(roomID).get('users').set(socket.id, userName); //подключение к БД
        const users = [...rooms.get(roomID).get('users').values()]; //список всех пользователей
        socket.to(roomID).broadcast.emit('ROOM:SET_USERS', users); //в определенную комнату всем, кроме меня, отправить сокет-запрос ROOMLJOINED
    });

    socket.on('ROOM:NEW_MESSAGE', ({roomID, userName, text}) => {
        const obj = {
            userName,
            text,
        };
        rooms.get(roomID).get('messages').push(obj);
        socket.to(roomID).broadcast.emit('ROOM:NEW_MESSAGE', obj); //в определенную комнату всем, кроме меня, отправить сокет-запрос ROOMLJOINED
    });

    socket.on('disconnect', () => {
        rooms.forEach((value, roomID) => { //value - значение, id - ключ
            if (value.get('users').delete(socket.id)) {
                const users = [...rooms.get(roomID).get('users').values()]; //актуальный список всех пользователей
                socket.to(roomID).broadcast.emit('ROOM:SET_USERS', users);
            }
        });
    });

    console.log('user connected', socket.id);
});


server.listen(9999, (err) => { //следить, чтобы был порт 9999
    if (err) {
        throw Error(err);
    }
    console.log('Сервер запущен!');
});