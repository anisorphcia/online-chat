import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Chat, { TypingBubble, useMessages } from '@chatui/core';  // 正确的导入方式
import '@chatui/core/dist/index.css';
import socket from '../socket';

const userId = localStorage.getItem('userId') || uuidv4();
localStorage.setItem('userId', userId);

const ChatComponent = () => {
  const { messages, appendMsg } = useMessages([]);

  useEffect(() => {
    // 监听接收消息
    socket.on('chat message', (msg) => {
      appendMsg({
        type: 'text',
        content: { text: msg.text },
        position: msg.userId === userId ? 'right' : 'left',
      });
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const handleSend = (type: string, val: any) => {
    if (type === 'text' && val.trim()) {
      const msg = {
        text: val,
        userId,
      };
      socket.emit('chat message', msg);
    }
  };

  return (
    <Chat
      navbar={{ title: '聊天室' }}
      messages={messages}
      renderMessageContent={(msg) => <TypingBubble content={msg.content.text} />}
      onSend={handleSend}
    />
  );
};

export default ChatComponent;
