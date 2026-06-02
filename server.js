const express = require('express');
const path = require('path');
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/analyze', (req, res) => {
  const features = req.body.features || {};
  res.json(analyze(features));
});

function analyze(f) {
  const pitch = f.pitch || 3000;
  const energy = f.energy || 0.3;
  const rhythm = f.rhythm || 0.5;

  let mood, emoji, color, confidence, description, advice;

  if (pitch > 3500 && energy > 0.6) {
    mood = "Excited & Happy"; emoji = "🎉"; color = "#00f5d4"; confidence = 82;
    description = "Your budgie is feeling energetic and joyful! This vocalization pattern is associated with positive arousal — singing, chirping, or social calling.";
    advice = "Talk back to them! Budgies love interactive vocal play. Try whistling a tune.";
  } else if (pitch > 2500 && pitch <= 3500 && energy > 0.3 && energy <= 0.6) {
    mood = "Content & Chatty"; emoji = "😊"; color = "#7c3aed"; confidence = 78;
    description = "Your budgie is relaxed and socializing. This is the sound of a happy, comfortable bird — often described as 'warbling' or 'chattering'.";
    advice = "They're happy! Keep doing what you're doing. A content budgie is a healthy budgie.";
  } else if (pitch <= 2500 && energy <= 0.3) {
    mood = "Calm / Sleepy"; emoji = "😴"; color = "#60a5fa"; confidence = 75;
    description = "Soft, low-energy sounds suggest your budgie is winding down. These gentle vocalizations often happen before napping or during quiet bonding time.";
    advice = "Consider dimming the lights and speaking softly. They may be ready for a nap.";
  } else if (pitch > 3500 && energy <= 0.3) {
    mood = "Alert / Uncertain"; emoji = "😰"; color = "#f59e0b"; confidence = 71;
    description = "Sharp, high-pitched calls with low body energy can indicate caution. Your budgie may have heard or seen something unfamiliar.";
    advice = "Check for potential stressors — loud noises, new objects, or predators. Speak calmly to reassure them.";
  } else if (rhythm > 0.7 && energy > 0.5) {
    mood = "Distressed / Upset"; emoji = "😢"; color = "#ef4444"; confidence = 80;
    description = "Irregular, high-energy vocalizations can indicate distress. This pattern is associated with alarm calls or frustration.";
    advice = "Check on your budgie. Make sure they have food, water, and a calm environment. Remove any potential threats.";
  } else if (energy < 0.15 && pitch < 2000) {
    mood = "Lethargic / Possibly Unwell"; emoji = "🤒"; color = "#dc2626"; confidence = 68;
    description = "Unusually quiet and low-energy. While some quiet time is normal, a prolonged lack of vocalization can be a sign of illness.";
    advice = "Monitor your budgie closely. Check for other symptoms (fluffed feathers, changes in appetite). Consider consulting an avian vet.";
  } else {
    mood = "Neutral / Observing"; emoji = "🐦"; color = "#94a3b8"; confidence = 60;
    description = "Your budgie is in a neutral state — alert, observing their environment, and making typical contact calls.";
    advice = "Nothing to worry about. Your budgie is just being a budgie!";
  }

  return {
    mood, emoji, color, confidence: Math.round(confidence),
    description, advice, timestamp: new Date().toISOString(),
    rawPitch: Math.round(pitch),
    rawEnergy: Math.round(energy * 100),
    rawRhythm: Math.round(rhythm * 100),
    scientificNote: "Based on Melopsittacus undulatus vocalization research (Farabaugh et al. 1992, Brittan-Powell et al. 1997)"
  };
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log('🐦 Jungle Budgie v2 on :' + PORT));
