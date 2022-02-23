import io from 'socket.io-client';

const socket = io('http://localhost:9999'); // сокет-соединение для подключения к серверу, по умолчанию к 3000

export default socket;