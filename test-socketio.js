#!/usr/bin/env node

/**
 * Script de test Socket.IO
 * Vérifie que le serveur Socket.IO fonctionne correctement
 */

const http = require('http');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

console.log('🧪 Test Socket.IO Configuration\n');
console.log(`Testing server at http://${HOST}:${PORT}\n`);

// Test 1: Vérifier que le serveur répond
console.log('Test 1: Server Health Check...');
http.get(`http://${HOST}:${PORT}/health`, (res) => {
  if (res.statusCode === 200) {
    console.log('✅ Server is running\n');
    
    // Test 2: Vérifier que Socket.IO est accessible
    console.log('Test 2: Socket.IO Endpoint Check...');
    http.get(`http://${HOST}:${PORT}/socket.io/socket.io.js`, (res2) => {
      if (res2.statusCode === 200) {
        console.log('✅ Socket.IO client library is accessible\n');
        console.log('🎉 All tests passed! Socket.IO is configured correctly.\n');
        process.exit(0);
      } else {
        console.log(`❌ Socket.IO client library returned status ${res2.statusCode}`);
        console.log('⚠️  This might cause 404 errors in the browser.\n');
        console.log('Solution: Check RENDER_SOCKETIO_FIX.md\n');
        process.exit(1);
      }
    }).on('error', (err) => {
      console.log('❌ Error accessing Socket.IO endpoint:', err.message);
      console.log('⚠️  Socket.IO might not be properly configured.\n');
      process.exit(1);
    });
    
  } else {
    console.log(`❌ Server returned status ${res.statusCode}\n`);
    process.exit(1);
  }
}).on('error', (err) => {
  console.log('❌ Cannot connect to server:', err.message);
  console.log('💡 Make sure the server is running: npm start\n');
  process.exit(1);
});

// Timeout après 10 secondes
setTimeout(() => {
  console.log('❌ Test timeout - server not responding\n');
  process.exit(1);
}, 10000);
