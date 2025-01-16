// socket.js
import { io } from 'socket.io-client';

const socket = io('http://172.32.1.81', {
    path: '/suporte-api/socket.io',
    transports: ['polling'], // ou ['websocket'] se o WebSocket estiver funcionando
});

export default socket;
