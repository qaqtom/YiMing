const WebSocket = require('ws');

const socket = new WebSocket('ws://localhost:8080');

let sequenceNumber = 0;
const ackTimeout = 1000; // 1 second timeout for ACK  
const pendingMessages = new Map(); // Store pending messages  

// Function to send a message with reliability  
function sendReliableMessage(message) {
    const seqNum = sequenceNumber++;
    const msg = JSON.stringify({ seqNum, message });

    // Store the message and its timeout  
    pendingMessages.set(seqNum, {
        message, timeout: setTimeout(() => {
            console.log(`Resending message: ${message}`);
            sendReliableMessage(message); // Resend the message if no ACK received  
        }, ackTimeout)
    });

    socket.send(msg);
}

// Handle incoming messages  
socket.on('message', (data) => {
    const { seqNum } = JSON.parse(data);

    // Send ACK for the received message  
    console.log(`Received message with seqNum: ${seqNum}`);
    if (pendingMessages.has(seqNum)) {
        clearTimeout(pendingMessages.get(seqNum).timeout); // Clear the timeout  
        pendingMessages.delete(seqNum); // Remove from pending messages  
    }
});

// Example usage  
sendReliableMessage("Hello, World!");