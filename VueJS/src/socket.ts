import { io } from 'socket.io-client';

const socket = io('http://localhost:5132');

export default socket;