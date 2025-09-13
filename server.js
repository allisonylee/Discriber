// server.js

// 1. Load environment variables from .env file
import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { AssemblyAI } from "assemblyai";

const app = express();
const port = 3000;
app.use(cors());

// Configure Multer to handle file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Access API keys from process.env
const assemblyApiKey = process.env.ASSEMBLYAI_API_KEY;

// Initialize the AssemblyAI client
const assemblyClient = new AssemblyAI({ apiKey: assemblyApiKey });


// THIS IS THE MISSING PIECE OF CODE
// This endpoint waits for a POST request with a file and transcribes it.
app.post('/transcribe', upload.single('audioFile'), async (req, res) => {
    console.log("Received a request to /transcribe");
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No audio file was uploaded." });
        }

        // The audio file is now in memory as a Buffer
        const audioBuffer = req.file.buffer;
        
        console.log("Transcribing audio file...");
        const transcript = await assemblyClient.transcripts.transcribe({
            audio: audioBuffer,
        });

        if (!transcript.text) {
            throw new Error("Transcription failed or returned no text.");
        }

        // Send the transcript text back to the frontend
        res.json({ 
            success: true,
            transcript: transcript.text, 
        });

    } catch (error) {
        console.error("Error during transcription:", error);
        res.status(500).json({ success: false, message: "An error occurred during transcription." });
    }
});


app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});