// Install the assemblyai package by executing the command "npm install assemblyai"

import { ASSEMBLY_API_KEY, GEMINI_API_KEY } from './config.js';
import { AssemblyAI } from "assemblyai";
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const client = new AssemblyAI({
  apiKey: ASSEMBLY_API_KEY,
});

// const audioFile = "./local_file.mp3";
const audioFile = 'https://assembly.ai/wildfires.mp3';

const params = {
  audio: audioFile,
  speech_model: "universal",
  speaker_labels: true,
  speakers_expected: 2
};

const run = async () => {
  const transcript = await client.transcripts.transcribe(params);

  console.log(transcript.text);
  console.log("Speaker Labels:", transcript.speaker_labels);
  console.log("[END]");
  if (transcript.utterances) {
    for (const utterance of transcript.utterances) {
      const speaker = utterance.speaker;
      const text = utterance.text;
      console.log(`Speaker ${speaker}: ${text}`);
    }
  } else {
    console.log("Utterances not available. Ensure speaker_labels was set to true.");
  }
  const result = await model.generateContent("Summarize the following text in a concise manner, giving advice to the listener: " + transcript.text);
  const text = result.response.text();
  console.log(text); 
};

run();