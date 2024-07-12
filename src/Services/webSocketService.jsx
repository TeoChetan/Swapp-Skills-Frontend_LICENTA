import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.subscriptions = {};
  }

  connect(callback) {
    const socket = new SockJS('http://localhost:8080/ws');
    this.client = Stomp.over(socket);

    this.client.connect({}, frame => {
      console.log('Connected: ' + frame);
      this.subscribeToTopic('/topic/messages', callback);
    }, error => {
      console.error('Connection error: ' + error);
      setTimeout(() => {
        this.connect(callback);
      }, 5000);
    });

    this.client.onclose = () => {
      console.log('Connection closed');
      setTimeout(() => {
        this.connect(callback);
      }, 5000);
    };
  }

  disconnect() {
    if (this.client) {
      Object.keys(this.subscriptions).forEach(topic => {
        this.subscriptions[topic].unsubscribe();
        delete this.subscriptions[topic];
      });
      this.client.disconnect(() => {
        console.log('Disconnected');
      });
    }
  }

  subscribeToTopic(topic, callback) {
    if (this.client && this.client.connected) {
      if (!this.subscriptions[topic]) {
        this.subscriptions[topic] = this.client.subscribe(topic, message => {
          const parsedMessage = JSON.parse(message.body);
          callback(parsedMessage);
        });
        console.log(`Subscribed to topic: ${topic}`);
      } else {
        console.log(`Already subscribed to topic: ${topic}`);
      }
    } else {
      console.error('Cannot subscribe, client is not connected');
    }
  }

  sendMessage(senderId, receiverId, content) {
    if (this.client && this.client.connected) {
      const message = {
        sender: { uid: senderId },
        receiver: { uid: receiverId },
        content,
      };
      this.client.send('/app/chat', {}, JSON.stringify(message));
    } else {
      console.error('Cannot send message, client is not connected');
    }
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
