// socket.js
import { io } from 'socket.io-client';

const socket = io('http://172.32.1.81:9002', {
    path: '/socket.io',
    transports: ['polling'], // ou ['websocket'] se o WebSocket estiver funcionando
});

export default socket;
