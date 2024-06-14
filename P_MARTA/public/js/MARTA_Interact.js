
//Webpage's interactions 
document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput) return;

    addMessageToChat('User', userInput);
    document.getElementById('user-input').value = '';

    // Simulate chatbot response
    setTimeout(() => {
        const botResponse = getBotResponse(userInput);
        addMessageToChat('Bot', botResponse);
    }, 1000);
}

function addMessageToChat(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function getBotResponse(userInput) {
    // This is a placeholder function. Replace with actual chatbot logic.
    return `You said: ${userInput}`;
}

//Webpage fetching Chatbot's API
async function fetchData() {
    try {
      const response = await fetch('https://api.example.com/data');
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }
  
  fetchData();
  document.addEventListener('DOMContentLoaded', () => {
    const updatesList = document.getElementById('updates-list');
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
  
    // Function to display a message in the chatbox
    function displayMessage(message, sender = 'user') {
      const messageElement = document.createElement('div');
      messageElement.classList.add('message', sender);
      messageElement.textContent = message;
      chatBox.appendChild(messageElement);
      chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
    }
  
    // Event listener for the send button
    sendBtn.addEventListener('click', () => {
      const message = userInput.value.trim();
      if (message) {
        displayMessage(message);
        userInput.value = ''; // Clear the input field
        // Here you can also send the message to the server if needed
        // For example, you could use fetch to send the message to your server
      }
    });
  
    // Optional: Handle Enter key to send message
    userInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        sendBtn.click();
      }
    });
  });
    
  