# VitalVox: https://vitalvox.netlify.app/
Devpost: https://devpost.com/software/vitalvox

Demo: https://youtu.be/ndIbq4j0uBA?si=NljyFuIEbSggVsYu

## Inspiration
I (Allison) volunteered at a rescue squad in high school, riding in ambulances alongside EMTs and responding to local 911 calls. There, I saw the inner workings of emergency response -- and I was shocked. We were almost always thrown on scene with very little information from dispatchers, so we constantly had to walk up to patients having no idea what their emergency was. It wasn't uncommon to just get a message saying "motor vehicle accident" -- which told us nothing about how many patients there were, how severe the accident was, or what kinds of injuries were present. I soon learned that this was because dispatchers had to juggle countless responsibilities at once, making it impossible for them to give us all the information they received. That's why Arvin and I built VitalVox. VitalVox makes it much easier for dispatchers to transmit information to EMTs before they arrive on scene, allowing them to make faster, smarter decisions and save more lives.

## What it does
When someone dials 911, a dispatcher can use VitalVox to record the call in real-time. VitalVox will produce a transcript of the call, give a summary of the patient's symptoms, and let EMTs know what they might encounter. This allows EMTs to find out what's going on before they meet the patient, not after. VitalVox can also give suggestions on what equipment to bring, as well as what conditions the patient could potentially have, making EMTs well-equipped to treat patients faster.

## How we built it
We built the front-end using JavaScript, HTML, and CSS (with Tailwind). The back-end utilizes Node.js and Express.js. We obtain a live audio stream using the browser's media recorder, then generate a transcript using speaker diarization through a convolution-augmented transformer, via the AssemblyAI API. Next, we use the Gemini API to summarize the transcript and suggest ideas for what the EMTs might run into while on scene.

## Challenges we ran into
We initially only planned to develop a front-end for this project. However, when we realized that storing API keys in the front-end was not very secure, we suddenly had to pivot and build a back-end. While testing our project, we also reached the limit for Gemini API's free tier, so we had to generate more API keys using some random other Google accounts we had.

## Accomplishments that we're proud of
We're both freshmen, and we're proud of completing our first Hackathon! We believe that VitalVox truly has the potential to impact peoples' lives when they need it most, and we're happy to have developed something that we're very passionate about. 

## What we learned
This project really strengthened our web development skills, and this experience will certainly help us build projects more efficiently in the future. We also learned how to use Gemini API for the first time!

## What's next for VitalVox
We're hoping to build a browser extension that can directly interact with emergency response software such as IamResponding, so that dispatchers no longer have to even click on the website -- the entire process will just be done for them. We're also thinking of fine-tuning Gemini to better suit a medical setting and provide even more accurate guidance.
