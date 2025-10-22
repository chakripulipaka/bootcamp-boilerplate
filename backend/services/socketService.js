import { Server } from 'socket.io';
import { verifyToken, extractTokenFromHeader } from '../utils/jwt.js';
import { getDb } from '../ExampleConnect.js';

/**
 * WebSocket service for real-time communication
 */
export class SocketService {
    constructor() {
        this.io = null;
        this.connectedUsers = new Map(); // Map of socketId -> user info
    }

    /**
     * Initialize Socket.IO server
     * @param {Object} server - HTTP server instance
     */
    initialize(server) {
        this.io = new Server(server, {
            cors: {
                origin: process.env.FRONTEND_URL || "http://localhost:5173",
                methods: ["GET", "POST"]
            }
        });

        this.setupEventHandlers();
        console.log('✅ Socket.IO server initialized');
    }

    /**
     * Setup Socket.IO event handlers
     */
    setupEventHandlers() {
        this.io.on('connection', (socket) => {
            console.log(`Client connected: ${socket.id}`);

            // Handle authentication
            socket.on('authenticate', async (data) => {
                try {
                    const token = data.token;
                    if (!token) {
                        socket.emit('auth_error', { message: 'No token provided' });
                        return;
                    }

                    const decoded = verifyToken(token);
                    if (!decoded) {
                        socket.emit('auth_error', { message: 'Invalid token' });
                        return;
                    }

                    // Get user from database
                    const db = getDb();
                    const user = await db.collection('users').findOne({ 
                        _id: decoded.userId,
                        isActive: true 
                    });

                    if (!user) {
                        socket.emit('auth_error', { message: 'User not found' });
                        return;
                    }

                    // Store user info
                    this.connectedUsers.set(socket.id, {
                        userId: user._id.toString(),
                        email: user.email,
                        role: user.role,
                        firstName: user.firstName,
                        lastName: user.lastName
                    });

                    // Join user to their personal room
                    socket.join(`user_${user._id}`);
                    
                    // Join admin to admin room if applicable
                    if (user.role === 'admin') {
                        socket.join('admin_room');
                    }

                    socket.emit('authenticated', {
                        message: 'Authentication successful',
                        user: {
                            _id: user._id,
                            email: user.email,
                            role: user.role,
                            firstName: user.firstName,
                            lastName: user.lastName
                        }
                    });

                    console.log(`User authenticated: ${user.email} (${user.role})`);

                } catch (error) {
                    console.error('Authentication error:', error);
                    socket.emit('auth_error', { message: 'Authentication failed' });
                }
            });

            // Handle pet updates (admin only)
            socket.on('pet_updated', (data) => {
                const user = this.connectedUsers.get(socket.id);
                if (!user || user.role !== 'admin') {
                    socket.emit('error', { message: 'Unauthorized' });
                    return;
                }

                // Broadcast to all connected users
                this.io.emit('pet_updated', data);
            });

            // Handle pet created (admin only)
            socket.on('pet_created', (data) => {
                const user = this.connectedUsers.get(socket.id);
                if (!user || user.role !== 'admin') {
                    socket.emit('error', { message: 'Unauthorized' });
                    return;
                }

                // Broadcast to all connected users
                this.io.emit('pet_created', data);
            });

            // Handle pet deleted (admin only)
            socket.on('pet_deleted', (data) => {
                const user = this.connectedUsers.get(socket.id);
                if (!user || user.role !== 'admin') {
                    socket.emit('error', { message: 'Unauthorized' });
                    return;
                }

                // Broadcast to all connected users
                this.io.emit('pet_deleted', data);
            });

            // Handle user updates (admin only)
            socket.on('user_updated', (data) => {
                const user = this.connectedUsers.get(socket.id);
                if (!user || user.role !== 'admin') {
                    socket.emit('error', { message: 'Unauthorized' });
                    return;
                }

                // Broadcast to admin room
                this.io.to('admin_room').emit('user_updated', data);
            });

            // Handle disconnect
            socket.on('disconnect', () => {
                const user = this.connectedUsers.get(socket.id);
                if (user) {
                    console.log(`User disconnected: ${user.email}`);
                    this.connectedUsers.delete(socket.id);
                }
                console.log(`Client disconnected: ${socket.id}`);
            });

            // Handle errors
            socket.on('error', (error) => {
                console.error('Socket error:', error);
            });
        });
    }

    /**
     * Broadcast pet update to all connected users
     * @param {Object} petData - Pet data to broadcast
     */
    broadcastPetUpdate(petData) {
        if (this.io) {
            this.io.emit('pet_updated', {
                pet: petData,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Broadcast new pet to all connected users
     * @param {Object} petData - Pet data to broadcast
     */
    broadcastPetCreated(petData) {
        if (this.io) {
            this.io.emit('pet_created', {
                pet: petData,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Broadcast pet deletion to all connected users
     * @param {String} petId - Pet ID that was deleted
     */
    broadcastPetDeleted(petId) {
        if (this.io) {
            this.io.emit('pet_deleted', {
                petId,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Broadcast user update to admin room
     * @param {Object} userData - User data to broadcast
     */
    broadcastUserUpdate(userData) {
        if (this.io) {
            this.io.to('admin_room').emit('user_updated', {
                user: userData,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Send notification to specific user
     * @param {String} userId - User ID to send notification to
     * @param {String} type - Notification type
     * @param {Object} data - Notification data
     */
    sendNotificationToUser(userId, type, data) {
        if (this.io) {
            this.io.to(`user_${userId}`).emit('notification', {
                type,
                data,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Send notification to all admins
     * @param {String} type - Notification type
     * @param {Object} data - Notification data
     */
    sendNotificationToAdmins(type, data) {
        if (this.io) {
            this.io.to('admin_room').emit('notification', {
                type,
                data,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Get connected users count
     * @returns {Number} - Number of connected users
     */
    getConnectedUsersCount() {
        return this.connectedUsers.size;
    }

    /**
     * Get connected users info
     * @returns {Array} - Array of connected user info
     */
    getConnectedUsers() {
        return Array.from(this.connectedUsers.values());
    }
}

// Create singleton instance
export const socketService = new SocketService();

