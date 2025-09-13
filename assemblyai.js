// Install the assemblyai package by executing the command "npm install assemblyai"
import { API_KEY } from 'config.js';
import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
  apiKey: API_KEY,
});

// const audioFile = "./local_file.mp3";
const audioFile = 'https://assembly.ai/wildfires.mp3';

const params = {
  audio: audioFile,
  speech_model: "universal",
  speaker_labels: true,
};

const run = async () => {
  const transcript = await client.transcripts.transcribe(params);

  console.log(transcript.text);
};

run();