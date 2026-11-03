// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allows requests from your React frontend
  },
});

// Store active match rooms
const rooms = {};

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Join a match room (1v1 or 2v2)
  socket.on('joinRoom', ({ roomId, mode, playerInfo }) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = {
        mode: mode, // '1v1' or '2v2'
        players: {},
      };
    }

    const maxPlayers = mode === '1v1' ? 2 : 4;
    const currentPlayers = Object.keys(rooms[roomId].players).length;

    if (currentPlayers < maxPlayers) {
      rooms[roomId].players[socket.id] = {
        id: socket.id,
        team: currentPlayers % 2 === 0 ? 'red' : 'blue',
        position: { x: (currentPlayers - 1) * 2, y: 0, z: 0 },
        rotation: { y: 0 },
        name: playerInfo?.name || `Robot ${currentPlayers + 1}`,
      };

      // Notify the player of their assigned team and room state
      socket.emit('roomJoined', {
        playerId: socket.id,
        roomState: rooms[roomId],
      });

      // Broadcast updated player list to everyone in the room
      io.to(roomId).emit('updateRoom', rooms[roomId]);
    } else {
      socket.emit('roomFull');
    }
  });

  // Broadcast player movements (position, velocity, angle)
  socket.on('playerTransform', ({ roomId, position, rotation }) => {
    if (rooms[roomId] && rooms[roomId].players[socket.id]) {
      rooms[roomId].players[socket.id].position = position;
      rooms[roomId].players[socket.id].rotation = rotation;

      // Send to all other players in the room except sender
      socket.to(roomId).emit('playerMoved', {
        id: socket.id,
        position,
        rotation,
      });
    }
  });

  // Handle player disconnects
  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    for (const roomId in rooms) {
      if (rooms[roomId].players[socket.id]) {
        delete rooms[roomId].players[socket.id];
        io.to(roomId).emit('playerLeft', socket.id);
        if (Object.keys(rooms[roomId].players).length === 0) {
          delete rooms[roomId]; // Clean up empty room
        }
      }
    }
  });
});

server.listen(4000, () => {
  console.log('Multiplayer WebSocket server running on port 4000');
});