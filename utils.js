import { HANDLER_ID, TOTAL_LENGTH_SIZE } from './constants.js';

export const readHeader = (buffer) => {
  return {
    length: buffer.readUInt32BE(0), // offset 0부터 4byte만큼 읽어서 길이를 알아냄
    handlerId: buffer.readUInt16BE(TOTAL_LENGTH_SIZE), // offset 4부터 2byte만큼 읽어서 handlerId를 뽑아냄
  };
};

// length : 메시지의 길이
export const writeHeader = (length, handlerId) => {
  const headerSize = TOTAL_LENGTH_SIZE + HANDLER_ID; // 6
  const buffer = Buffer.alloc(headerSize); // headerSize 는 6바이트
  buffer.writeUInt32BE(length + headerSize, 0); // 메시지 길이를 빅엔디안 방식으로 기록 (4바이트)
  buffer.writeUInt16BE(handlerId, TOTAL_LENGTH_SIZE); // 핸들러 ID를 빅엔디안 방식으로 기록 (2바이트)

  return buffer;
};
