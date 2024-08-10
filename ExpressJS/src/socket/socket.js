import App from "../app.js";
import {findUserByUsernameOrEmail, getCurrentPendingRequests, getFriendsByUserId} from "../function.js";
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

    socket.on('friendRequest', (username) => {
        findUserByUsernameOrEmail(username).then((user) => {
            if(!user) {
                return socket.emit('friendRequestError', 'User not found');
            }
            if(user.id === Object.keys(onlineUsers).find(key => onlineUsers[key] === socket.id)) {
                return socket.emit('friendRequestError', 'You cannot send a friend request to yourself');
            }
            io.to(onlineUsers[user.id]).emit('friendRequest', user);

        })
    })

    socket.on('startListening', (song) => {
        console.log('startListening');
        let userId = Object.keys(onlineUsers).find(key => onlineUsers[key] === socket.id);
        console.log(userId);
        getFriendsByUserId(userId).then((friends) => {
            friends.forEach((friend) => {
                io.to(onlineUsers[friend.requesterId]).emit('friendListening', song);
                io.to(onlineUsers[friend.accepterId]).emit('friendListening', song);
            })
        })
    })
});

export default io;