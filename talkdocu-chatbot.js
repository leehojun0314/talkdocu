/**
 * TalkDocu Chatbot Widget
 * A simple chatbot that interacts with TalkDocu API endpoints
 */

class TalkDocuChatbot {
  constructor(options = {}) {
    this.convStringId = options.convStringId || null;
    this.authToken = options.authToken || null;
    this.apiBase = options.apiBase || '/api';
    this.isOpen = false;
    this.isLoading = false;
    this.messages = [];
    this.salutation = options.salutation || 'Hello, how can I help you today?';

    // Create DOM elements
    this.createElements();
    this.attachEventListeners();

    // Initialize if we have conversation ID and token
    if (this.convStringId && this.authToken) {
      this.initialize();
    }
  }

  createElements() {
    // Create container
    this.container = document.createElement('div');
    this.container.className = 'talkdocu-chatbot-container';
    this.container.innerHTML = `
      <div class="talkdocu-chat-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
      
      <div class="talkdocu-chat-panel">
        <div class="talkdocu-chat-header">
          <h3>TalkDocu Chat</h3>
          <button class="talkdocu-close-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="talkdocu-chat-messages"></div>
        
        <div class="talkdocu-chat-input-container">
          <input type="text" class="talkdocu-chat-input" placeholder="Type your message...">
          <button class="talkdocu-send-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(this.container);

    // Store references to elements
    this.chatButton = this.container.querySelector('.talkdocu-chat-button');
    this.chatPanel = this.container.querySelector('.talkdocu-chat-panel');
    this.closeButton = this.container.querySelector('.talkdocu-close-btn');
    this.messagesContainer = this.container.querySelector(
      '.talkdocu-chat-messages',
    );
    this.inputField = this.container.querySelector('.talkdocu-chat-input');
    this.sendButton = this.container.querySelector('.talkdocu-send-btn');
  }

  attachEventListeners() {
    // Toggle chat panel
    this.chatButton.addEventListener('click', () => this.toggleChat());
    this.closeButton.addEventListener('click', () => this.toggleChat());

    // Send message on button click
    this.sendButton.addEventListener('click', () => this.sendMessage());

    // Send message on Enter key
    this.inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.chatPanel.style.display = 'flex';
      setTimeout(() => {
        this.chatPanel.classList.add('open');
      }, 10);
    } else {
      this.chatPanel.classList.remove('open');
      setTimeout(() => {
        this.chatPanel.style.display = 'none';
      }, 300);
    }
  }

  initialize() {
    this.showLoading();

    // Get conversation and initial messages
    fetch(
      `${this.apiBase}/conversation/getOne?convStringId=${this.convStringId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
      },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to initialize chat');
        }
        return response.json();
      })
      .then((data) => {
        this.messages = data.messages || [];
        this.salutation = data.conversation.salutation || this.salutation;

        // Display messages
        this.renderMessages();
        this.hideLoading();
      })
      .catch((error) => {
        console.error('Error initializing chat:', error);
        this.hideLoading();
        this.addSystemMessage(
          'Failed to initialize chat. Please try again later.',
        );
      });
  }

  renderMessages() {
    // Clear messages container
    this.messagesContainer.innerHTML = '';

    // Add salutation if no messages
    if (this.messages.length === 0) {
      this.addAIMessage(this.salutation);
      return;
    }

    // Add existing messages
    this.messages.forEach((message) => {
      if (message.sender === 'user') {
        this.addUserMessageToDOM(message.message);
      } else if (message.sender === 'assistant') {
        this.addAIMessageToDOM(message.message);
      }
    });

    // Scroll to bottom
    this.scrollToBottom();
  }

  sendMessage() {
    const message = this.inputField.value.trim();

    if (!message || this.isLoading) {
      return;
    }

    // Add user message to UI
    this.addUserMessage(message);

    // Clear input field
    this.inputField.value = '';

    // Send message to API
    this.sendMessageToAPI(message);
  }

  sendMessageToAPI(message) {
    this.showLoading();

    // First get related content using the paragraph API
    fetch(`${this.apiBase}/paragraph/getParagraph_v2`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        convStringId: this.convStringId,
        text: message,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to get paragraph');
        }
        return response.json();
      })
      .then((data) => {
        const { relatedContent, referenceDocs } = data;

        // Now send the message with the related content
        return fetch(`${this.apiBase}/ai/message_v2`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            convStringId: this.convStringId,
            prompt: message,
            relatedContent: relatedContent,
            provideContent: true,
            systemMessage: '당신은 친절한 챗봇 입니다. 친절하게 답변해주세요!',
          }),
        });
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to send message');
        }
        return response.text();
      })
      .then((responseText) => {
        // Add AI response to UI
        this.addAIMessage(responseText);

        // Save to backend
        return this.saveMessageToBackend(message, responseText);
      })
      .catch((error) => {
        console.error('Error sending message:', error);
        this.hideLoading();
        this.addSystemMessage(
          'Failed to send message. Please try again later.',
        );
      });
  }

  saveMessageToBackend(userMessage, aiMessage) {
    return fetch(`${this.apiBase}/message/insertMessage`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        convStringId: this.convStringId,
        userMessage: userMessage,
        answerMessage: aiMessage,
        referenceDocs: [], // Adding empty array as required by API
        relatedContent: '',
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to save message');
        }
        return response.json();
      })
      .then((data) => {
        this.messages = data.messages;
        this.hideLoading();
      })
      .catch((error) => {
        console.error('Error saving message:', error);
        this.hideLoading();
      });
  }

  addUserMessage(message) {
    this.addUserMessageToDOM(message);
    this.scrollToBottom();
  }

  addAIMessage(message) {
    this.addAIMessageToDOM(message);
    this.scrollToBottom();
  }

  addSystemMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.className = 'talkdocu-message system';
    messageEl.textContent = message;
    this.messagesContainer.appendChild(messageEl);
    this.scrollToBottom();
  }

  addUserMessageToDOM(message) {
    const messageEl = document.createElement('div');
    messageEl.className = 'talkdocu-message user';
    messageEl.textContent = message;
    this.messagesContainer.appendChild(messageEl);
  }

  addAIMessageToDOM(message) {
    const messageEl = document.createElement('div');
    messageEl.className = 'talkdocu-message ai';
    messageEl.textContent = message;
    this.messagesContainer.appendChild(messageEl);
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  showLoading() {
    this.isLoading = true;
    this.sendButton.classList.add('loading');
    this.inputField.disabled = true;
  }

  hideLoading() {
    this.isLoading = false;
    this.sendButton.classList.remove('loading');
    this.inputField.disabled = false;
  }

  // Public methods
  setConversation(convStringId, authToken) {
    this.convStringId = convStringId;
    this.authToken = authToken;
    this.initialize();
  }
}

// Add styles to document
const style = document.createElement('style');
style.textContent = `
  /* TalkDocu Chatbot styles */
  .talkdocu-chatbot-container {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
  }
  
  .talkdocu-chat-button {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #4F46E5;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    color: white;
    transition: transform 0.3s ease;
  }
  
  .talkdocu-chat-button:hover {
    transform: scale(1.05);
  }
  
  .talkdocu-chat-panel {
    position: absolute;
    bottom: 80px;
    right: 0;
    width: 350px;
    height: 500px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
    display: none;
    flex-direction: column;
    overflow: hidden;
    transform: translateY(20px);
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
  
  .talkdocu-chat-panel.open {
    transform: translateY(0);
    opacity: 1;
  }
  
  .talkdocu-chat-header {
    background-color: #4F46E5;
    color: white;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .talkdocu-chat-header h3 {
    margin: 0;
    font-weight: 500;
  }
  
  .talkdocu-close-btn {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0;
  }
  
  .talkdocu-chat-messages {
    flex: 1;
    padding: 15px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .talkdocu-message {
    padding: 10px 14px;
    border-radius: 18px;
    max-width: 80%;
    word-wrap: break-word;
  }
  
  .talkdocu-message.user {
    background-color: #4F46E5;
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 4px;
  }
  
  .talkdocu-message.ai {
    background-color: #F3F4F6;
    color: #111827;
    align-self: flex-start;
    border-bottom-left-radius: 4px;
  }
  
  .talkdocu-message.system {
    background-color: #FEF2F2;
    color: #B91C1C;
    align-self: center;
    border-radius: 8px;
    font-size: 0.85em;
  }
  
  .talkdocu-chat-input-container {
    padding: 15px;
    border-top: 1px solid #E5E7EB;
    display: flex;
    gap: 10px;
  }
  
  .talkdocu-chat-input {
    flex: 1;
    padding: 10px 14px;
    border: 1px solid #E5E7EB;
    border-radius: 24px;
    outline: none;
    font-size: 14px;
  }
  
  .talkdocu-chat-input:focus {
    border-color: #4F46E5;
  }
  
  .talkdocu-send-btn {
    background-color: #4F46E5;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .talkdocu-send-btn:hover {
    background-color: #4338CA;
  }
  
  .talkdocu-send-btn.loading {
    position: relative;
    pointer-events: none;
  }
  
  .talkdocu-send-btn.loading svg {
    opacity: 0;
  }
  
  .talkdocu-send-btn.loading::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 0.8s ease infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  @media (max-width: 480px) {
    .talkdocu-chat-panel {
      width: calc(100vw - 40px);
      height: 60vh;
      bottom: 80px;
    }
  }
`;

document.head.appendChild(style);

// Export to window object
window.TalkDocuChatbot = TalkDocuChatbot;
