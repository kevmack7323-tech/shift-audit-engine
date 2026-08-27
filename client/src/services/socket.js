import { io } from 'socket.io-client';

// Connection to backend server port
export const socket = io('http://localhost:5000');