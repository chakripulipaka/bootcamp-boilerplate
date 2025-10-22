import { io, Socket } from 'socket.io-client';
import { SocketEvents } from '../types';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(token: string): void {
    if (this.socket?.connected) {
      return;
    }

    const serverUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.authenticate(token);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Set up authentication handlers
    this.socket.on('authenticated', (data) => {
      console.log('Socket authenticated:', data);
      this.emit('authenticated', data);
    });

    this.socket.on('auth_error', (data) => {
      console.error('Socket auth error:', data);
      this.emit('auth_error', data);
    });

    // Set up pet event handlers
    this.socket.on('pet_updated', (data) => {
      console.log('Pet updated:', data);
      this.emit('pet_updated', data);
    });

    this.socket.on('pet_created', (data) => {
      console.log('Pet created:', data);
      this.emit('pet_created', data);
    });

    this.socket.on('pet_deleted', (data) => {
      console.log('Pet deleted:', data);
      this.emit('pet_deleted', data);
    });

    // Set up user event handlers
    this.socket.on('user_updated', (data) => {
      console.log('User updated:', data);
      this.emit('user_updated', data);
    });

    // Set up notification handlers
    this.socket.on('notification', (data) => {
      console.log('Notification:', data);
      this.emit('notification', data);
    });

    this.socket.on('error', (data) => {
      console.error('Socket error:', data);
      this.emit('error', data);
    });
  }

  private authenticate(token: string): void {
    if (this.socket) {
      this.socket.emit('authenticate', { token });
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  // Event subscription methods
  on<K extends keyof SocketEvents>(event: K, callback: SocketEvents[K]): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off<K extends keyof SocketEvents>(event: K, callback: SocketEvents[K]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit<K extends keyof SocketEvents>(event: K, data: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in socket event handler for ${event}:`, error);
        }
      });
    }
  }

  // Admin-only methods for sending events
  emitPetUpdated(pet: any): void {
    if (this.socket) {
      this.socket.emit('pet_updated', { pet });
    }
  }

  emitPetCreated(pet: any): void {
    if (this.socket) {
      this.socket.emit('pet_created', { pet });
    }
  }

  emitPetDeleted(petId: string): void {
    if (this.socket) {
      this.socket.emit('pet_deleted', { petId });
    }
  }

  emitUserUpdated(user: any): void {
    if (this.socket) {
      this.socket.emit('user_updated', { user });
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

// Create singleton instance
export const socketService = new SocketService();

// React hook for using socket service
export const useSocket = () => {
  return socketService;
};

