import App from "../app.js";
import {getCurrentPendingRequests} from "../function.js";
const {io} = App;
const onlineUsers = {};

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
        let userId = Object.keys(onlineUsers).find(key => onlineUsers[key] === socket.id);
        delete onlineUsers[userId];
        console.log(onlineUsers);
    });

    socket.on('login', (userId) => {
        onlineUsers[userId] = socket.id;
        console.log(onlineUsers);
        getCurrentPendingRequests(userId).then((requests) => {
          socket.emit('pendingRequests', requests.length);
        })
    });

    socket.on('friendRequest', (userId) => {
        if(onlineUsers[userId]) {
            io.to(onlineUsers[userId]).emit('friendRequest');
        }
    })
});

export default io;