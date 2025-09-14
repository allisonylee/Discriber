// server.js

// 1. Load environment variables from .env file
import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { AssemblyAI } from "assemblyai";
import { GoogleGenerativeAI } from "@google/generative-ai";


const app = express();
const port = 3000;
app.use(cors());

// Configure Multer to handle file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Access API keys from process.env
const assemblyApiKey = process.env.ASSEMBLYAI_API_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

// Initialize the AssemblyAI client
const assemblyClient = new AssemblyAI({ apiKey: assemblyApiKey });
const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// This endpoint waits for a POST request with a file and transcribes it.
app.post('/transcribe-and-summarize', upload.single('audioFile'), async (req, res) => {
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
            speaker_labels: true,
            speakers_expected: 2
        });

        if (!transcript.text) {
            throw new Error("Transcription failed or returned no text.");
        }

        let formattedTranscript = "";
        for (const utterance of transcript.utterances) {
            const speaker = utterance.speaker === 'A' ? 'Dispatcher' : 'Caller';
            formattedTranscript += `${speaker}: ${utterance.text}\n`;
        }

        console.log("Generating summary and advice with Gemini...");
        const prompt = `Based on the following transcript, provide two things:
        1. A concise, one-paragraph summary of the situation. Be concise without sacrificing important details and accuracy. Be 100% accurate when possible and do not hallucinate.
        2. Advice for the responding EMTs. If there is no specific advice, simply state "No specific advice." If you are uncertain, you must state your uncertainty. You are to advise the medical professionals, not tell them what to do. Be 100% accurate when possible and do not hallucinate. Be concise without sacrificing important details and accuracy.
        
        Separate the summary and the advice with the keyword "ADVICE:".
        
        Transcript:
        """
        ${formattedTranscript}
        """`;        
        const result = await model.generateContent(prompt);
        const geminitext = result.response.text();
        if (!geminitext) {
            throw new Error("Gemini summary generation failed or returned no text.");
        }
        const [summaryPart, advicePart] = geminitext.split('ADVICE:');
        const summary = summaryPart ? summaryPart.trim() : "Summary could not be generated.";
        const advice = advicePart ? advicePart.trim() : "Advice could not be generated.";

        // --- Send all three parts back to the frontend ---
        res.json({ 
            success: true,
            transcript: formattedTranscript.trim(),
            summary: summary,
            advice: advice // Add the new advice field
        });

    } catch (error) {
        console.error("Error during transcription:", error);
        res.status(500).json({ success: false, message: "An error occurred during transcription." });
    }
});


app.listen(port, () => {
  console.log(`Server is listening at https://vitalvox-backend.onrender.com`);
});