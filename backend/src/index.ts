import express, {Application} from 'express';

import errorHandler from './middlewares/errorHandler';
import getMeData from "./routes/getMeData";
import cors from 'cors';
import updateMeData from "./routes/updateMeData";
import {Data, WebSocket, WebSocketServer} from 'ws';
import {MessageCallback} from "./types/MessageCallback";
import {Message} from "./types/Message";

const PORT = 3001;

export const server = new WebSocketServer({
    port: 3000,
    skipUTF8Validation: true,
    perMessageDeflate: true
});

let sockets: WebSocket[] = [];
let messageCallbacks: MessageCallback[] = [{
    type: 'item-update',
    callback: (data: any) => {
        sockets.forEach(socket => socket.send(JSON.stringify({type: "get-item-data", data})));
    }
}, {
    type: 'craft-item',
    callback: (data: any) => {
        sockets.forEach(socket => socket.send(JSON.stringify({type: "craft-item", data})));
    }
}];

server.on('connection', function (socket: WebSocket) {
    console.log('WebSocket connection established');
    sockets.push(socket);

    // When you receive a message, send that message to every socket.
    socket.on('message', function (msg: Data) {
        console.log('received: %s', msg);
        const received = JSON.parse(msg.toString()) as Message
        messageCallbacks.filter(c => c.type === received.type).forEach(c => c.callback(received.data));
    });

    socket.on('error', function (err: any) {
        console.error('Error:', err);
        sockets = sockets.filter(s => s !== socket);
    })

    // When a socket closes, or disconnects, remove it from the array.
    socket.on('close', function () {
        console.log('Socket closed');
        sockets = sockets.filter(s => s !== socket);
    });
});

const app: Application = express();

app.use(cors())
app.use(express.json({limit: '10mb'}));
app.use(errorHandler);
app.use('/api', getMeData);
app.use('/api', updateMeData);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
