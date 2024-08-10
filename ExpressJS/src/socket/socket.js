import App from "../app.js";
const {io} = App;

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('caca', (msg) => {
        io.emit('caca', msg);
    })
});

export default io;