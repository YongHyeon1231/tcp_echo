import net from 'net';
import { readHeader, writeHeader } from '../utils.js';
import { HANDLER_ID, TOTAL_LENGTH_SIZE } from '../constants.js';

// 서버에 연결할 호스트와 포트
const HOST = 'localhost';
const PORT = 5555;

const client = new net.Socket();

client.connect(PORT, HOST, () => {
  console.log('Connected to server.');

  const message = 'Hello';
  const buffer = Buffer.from(message);

  const header = writeHeader(buffer.length, 11);
  const packet = Buffer.concat([header, buffer]);

  // const longMessage = 'V'.repeat(1024);
  // const longMessageBuffer = Buffer.from(longMessage);

  // const longHeaderBuffer = writeHeader(longMessageBuffer.length, 10);
  // const longPacket = Buffer.concat([longHeaderBuffer, longMessageBuffer]);
  // client.write(longPacket);
  // 서버로 보낸다.
  client.write(packet);
});

client.on('data', (data) => {
  const buffer = Buffer.from(data); // 버퍼 객체의 메서드를 사용하기 위해 변환

  const { length, handlerId } = readHeader(data);
  console.log('length => ', length);
  console.log('handlerId => ', handlerId);
  console.log('clientData => ', data);

  const headerSize = TOTAL_LENGTH_SIZE + HANDLER_ID;
  // 메시지 추출
  const message = buffer.subarray(headerSize); // 앞의 헤더 부분을 자른다.
  console.log(`server 에게 받은 메시지: ${message}`);
});

client.on('close', () => {
  console.log('Connection closed');
});

client.on('error', (err) => {
  console.error('Client error:', err);
});
