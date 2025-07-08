const users = {};
const messages = [];
const typingUsers = {};
const GLOBAL_CHAT_ROOM = 'global_chat';
const Message = require('../models/message')


function chatHandlers(io, socket){
// Handle user joining
  socket.on('user_join', (username) => {
    users[socket.id] = { username, id: socket.id };
    io.emit('user_list', Object.values(users));
    io.emit('user_joined', { username, id: socket.id });
    console.log(`${username} joined the chat`);

    // join global room
    socket.join(GLOBAL_CHAT_ROOM);
    io.to(GLOBAL_CHAT_ROOM).emit('user_list', Object.values(users));
    io.to(GLOBAL_CHAT_ROOM).emit('user_joined'), { username, id: socket.id };
    console.log(`${username} joined the global chat `)
  });

  // Handle chat messages
  socket.on('send_message', async (messageData) => {
    try{
        const sender = users[socket.id]?.username || 'Anonymous';
        const senderId = socket.id;
        const timestamp = new Date();

        const dbMessage = await Message.create({
            sender,
            senderId,
            message: messageData.message,
            isPrivate: false,
            timestamp,
            ready: [sender],
        });

        const message = {
            id: dbMessage._id,
            sender,
            senderId,
            message: dbMessage.message,
            timestamp: dbMessage.timestamp,
            readBy: dbMessage.readBy,
        };

        io.to(GLOBAL_CHAT_ROOM).emit('receive_message', message);
    }catch(error){
        console.server('Error saving or sending message:', error);
    }
  });

  // Handle message read
  socket.on('message:read', async ({ messageId }) => {
    const username = users[socket.id]?.username;
    if (!username) return;
  
    try {
      const updatedMessage = await Message.findByIdAndUpdate(
        messageId,
        { $addToSet: { readBy: username } }, // avoids duplicates
        { new: true }
      );
  
      if (updatedMessage) {
        io.to(GLOBAL_CHAT_ROOM).emit('message:read:update', {
          messageId,
          readBy: updatedMessage.readBy,
        });
      }
    } catch (error) {
      console.error('Failed to update read status:', error);
    }
  });
  
  // Message react handler
  socket.on('message:react', async ({ messageId, reactionType }) => {
    const username = users[socket.id]?.username;
    if (!username) return;
  
    try {
      const message = await Message.findById(messageId);
      if (!message) return;
  
      
      if (!message.reactions) message.reactions = {};
  
      const currentReactions = message.reactions[reactionType] || [];
  
      if (currentReactions.includes(username)) {
       
        message.reactions[reactionType] = currentReactions.filter(u => u !== username);
      } else {
        
        message.reactions[reactionType] = [...currentReactions, username];
      }
  
      await message.save();
  
      io.to(GLOBAL_CHAT_ROOM).emit('message:react:update', {
        messageId,
        reactions: message.reactions,
      });
    } catch (err) {
      console.error('Failed to react to message:', err);
    }
  });

  // Handle typing indicator
  socket.on('typing', (isTyping) => {
    if (users[socket.id]) {
      const username = users[socket.id].username;
      
      if (isTyping) {
        typingUsers[socket.id] = username;
      } else {
        delete typingUsers[socket.id];
      }
      
      io.emit('typing_users', Object.values(typingUsers));
    }
  });

  // Handle private messages
  socket.on('private_message', ({ to, message }) => {
    const messageData = {
      id: Date.now(),
      sender: users[socket.id]?.username || 'Anonymous',
      senderId: socket.id,
      message,
      timestamp: new Date().toISOString(),
      isPrivate: true,
    };
    
    socket.to(to).emit('private_message', messageData);
    socket.emit('private_message', messageData);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    if (users[socket.id]) {
      const { username } = users[socket.id];
      io.emit('user_left', { username, id: socket.id });
      console.log(`${username} left the chat`);
    }
    
    delete users[socket.id];
    delete typingUsers[socket.id];
    
    io.emit('user_list', Object.values(users));
    io.emit('typing_users', Object.values(typingUsers));
  });
}

function getMessages(){
    return messages;
}

function getUsers(){
    return Object.values(users);
}

module.exports = { chatHandlers, getMessages, getUsers};
