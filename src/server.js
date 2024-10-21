import net from 'net';
import { readHeader, writeHeader } from '../utils.js';
import { HANDLER_ID, MAX_MESSAGE_LENGTH, TOTAL_LENGTH_SIZE } from '../constants.js';
import handlers from '../handlers/index.js';

const PORT = 5555;

const server = net.createServer((socket) => {
  console.log(`Client connected from: ${socket.remoteAddress}:${socket.remotePort}`);

  socket.on('data', (data) => {
    // data는 byte로 들어옴
    const buffer = Buffer.from(data); // byte로 들어온 객체를 Buffer로 재가공해줌
    const { length, handlerId } = readHeader(data);
    console.log('length => ', length);
    console.log('handlerId => ', handlerId);

    if (length > MAX_MESSAGE_LENGTH) {
      console.error(`Error: Message length ${length} exceeds maximum of ${MAX_MESSAGE_LENGTH}`);
      socket.write('Error: Message too long');
      socket.end();
      return;
    }

    const handler = handlers[handlerId];

    if (!handler) {
      console.error(`Error: No handler found for ID ${handlerId}`);
      socket.write(`Error: Invalid handler ID ${handlerId}`);
      socket.end();
      return;
    }

    const headerSize = TOTAL_LENGTH_SIZE + HANDLER_ID; // 6
    const message = buffer.subarray(headerSize);

    console.log(`client 에게 받은 메시지: ${message}`);

    // const responseMessage = 'Hi!, There';
    const responseMessage = handler(message);
    const responseBuffer = Buffer.from(responseMessage);

    const header = writeHeader(responseBuffer.length, handlerId);
    const responsePacket = Buffer.concat([header, responseBuffer]);

    //socket.write(data);
    socket.write(responsePacket);
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });

  socket.on('error', (err) => {
    console.error('Socket, error:', err);
  });
});

server.listen(PORT, () => {
  console.log(`Echo server listening on port ${PORT}`);
  console.log(server.address());
});
