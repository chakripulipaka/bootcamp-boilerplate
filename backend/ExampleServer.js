import * as path from 'path';
import { connectToServer } from './ExampleConnect.js';
import express from 'express';
import cors from 'cors';
import expressRouter from './ExampleRoutes.js';
import authRouter from './routes/authRoutes.js';
import petRouter from './routes/petRoutes.js';
import userRouter from './routes/userRoutes.js';
import { socketService } from './services/socketService.js';
import dotenv from 'dotenv';
import { createServer } from 'http';

const app = express()
const PORT = 3000   

const __dirname = path.resolve()
console.log(`Current directory: ${__dirname}`)

dotenv.config({ path: path.resolve(__dirname, '.env') })

app.use(cors())
app.use(express.json())
app.use("/pets", expressRouter)
app.use("/api/auth", authRouter)
app.use("/api/pets", petRouter)
app.use("/api/users", userRouter)

console.log(`Directory: ${path.resolve(__dirname, '.env')}`)
console.log(`Environment: ${process.env.NODE_ENV}`)

if (process.env.NODE_ENV == "production") {
    console.log("Production mode enabled")
    app.use(express.static(path.join(__dirname, "/frontend/dist")))
    app.get("/", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    })
}

// Create HTTP server and initialize Socket.IO
const server = createServer(app)

server.listen(PORT, async () => {
    // Connect to MongoDB
    const dbConnected = await connectToServer()
    
    if (dbConnected) {
        // Initialize Socket.IO
        socketService.initialize(server)
        console.log(`🚀 Server is running on port ${PORT}`)
        console.log(`📡 Socket.IO server is ready`)
    } else {
        console.error('❌ Failed to connect to database')
        process.exit(1)
    }
})