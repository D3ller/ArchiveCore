import { io } from 'socket.io-client';

const socket = io('https://192.168.1.158:5132');

export default socket;