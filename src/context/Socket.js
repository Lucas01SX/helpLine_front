// socket.js
import { io } from 'socket.io-client';

// Determina se está na rede 1 ou não
const isRede1 = window.location.hostname === '172.32.1.81' || window.location.hostname === 'localhost';
const socketHost = isRede1 ? 'http://172.32.1.81' : 'http://10.98.14.42';

// Configura o socket com o host dinâmico
const socket = io(socketHost, {
    path: '/suporte-api/socket.io',
    transports: ['polling'], // ou ['websocket'] se for aplicável
});

// Configura o socket com o host de DEV
//const socket = io(socketHost, {
//    path: '/suporte-api-dev/socket.io',
//    transports: ['polling'], // ou ['websocket'] se for aplicável
//});

// const socket = io('http://172.32.1.81:9002', {
//     path: '/socket.io',
//     transports: ['polling'], // ou ['websocket'] se o WebSocket estiver funcionando
// });

export default socket;
