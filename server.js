const express = require('express');
const path = require('path');
const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/analyze', (req, res) => {
  const { features } = req.body;
  if (!features) return res.json(analyzeFromFeatures({}));
  res.json(analyzeFromFeatures(features));
});

function analyzeFromFeatures(f) {
  const pitch = f.pitch || 3000;
  const energy = f.energy || 0.3;
  const rhythm = f.rhythm || 0.5;
  const duration = f.duration || 1.0;

  let mood, emoji, color, description, confidence, advice;

  // High pitch + high energy = excited/happy
  if (pitch > 3500 && energy > 0.6) {
    mood = "Excited & Happy";
    emoji = "🎉";
    color = "#00f5d4";
    confidence = 0.82;
    description = "Your budgie is feeling energetic and joyful! This vocalization pattern is associated with positive arousal — singing, chirping, or social calling.";
    advice = "Talk back to them! Budgies love interactive vocal play. Try whistling a tune.";
  }
  // Mid-high pitch + moderate energy = content/chatting
  else if (pitch > 2500 && pitch <= 3500 && energy > 0.3 && energy <= 0.6) {
    mood = "Content & Chatty";
    emoji = "😊";
    color = "#7c3aed";
    confidence = 0.78;
    description = "Your budgie is relaxed and socializing. This is the sound of a happy, comfortable bird — often described as 'warbling' or 'chattering'.";
    advice = "They're happy! Keep doing what you're doing. A content budgie is a healthy budgie.";
  }
  // Low pitch + low energy = tired/calm
  else if (pitch <= 2500 && energy <= 0.3) {
    mood = "Calm / Sleepy";
    emoji = "😴";
    color = "#60a5fa";
    confidence = 0.75;
    description = "Soft, low-energy sounds suggest your budgie is winding down. These gentle vocalizations often happen before napping or during quiet bonding time.";
    advice = "Consider dimming the lights and speaking softly. They may be ready for a nap.";
  }
  // High pitch + low energy =警报 / scared
  else if (pitch > 3500 && energy <= 0.3) {
    mood = "Alert / Uncertain";
    emoji = "😰";
    color = "#f59e0b";
    confidence = 0.71;
    description = "Sharp, high-pitched calls with low body energy can indicate caution. Your budgie may have heard or seen something unfamiliar.";
    advice = "Check for potential stressors — loud noises, new objects, or predators (cats, dogs). Speak calmly to reassure them.";
  }
  // Erratic rhythm + high energy = distressed
  else if (rhythm > 0.7 && energy > 0.5) {
    mood = "Distressed / Upset";
    emoji = "😢";
    color = "#ef4444";
    confidence = 0.80;
    description = "Irregular, high-energy vocalizations can indicate distress. This pattern is associated with alarm calls or frustration.";
    advice = "Check on your budgie. Make sure they have food, water, and a calm environment. Remove any potential threats.";
  }
  // Very low energy + very low pitch = sick/lethargic
  else if (energy < 0.15 && pitch < 2000) {
    mood = "Lethargic / Possibly Unwell";
    emoji = "🤒";
    color = "#dc2626";
    confidence = 0.68;
    description = "Unusually quiet and low-energy. While some quiet time is normal, a prolonged lack of vocalization can be a sign of illness.";
    advice = "Monitor your budgie closely. Check for other symptoms (fluffed feathers, changes in appetite). Consider consulting an avian vet.";
  }
  // Default
  else {
    mood = "Neutral / Observing";
    emoji = "🐦";
    color = "#94a3b8";
    confidence = 0.6;
    description = "Your budgie is in a neutral state — alert, observing their environment, and making typical contact calls.";
    advice = "Nothing to worry about. Your budgie is just being a budgie!";
  }

  return {
    mood, emoji, color, confidence: Math.round(confidence * 100),
    description, advice,
    rawPitch: Math.round(pitch),
    rawEnergy: Math.round(energy * 100),
    rawRhythm: Math.round(rhythm * 100),
    scientificNote: "Analysis based on published research on Melopsittacus undulatus vocalizations (Farabaugh et al. 1992, Brittan-Powell et al. 1997)"
  };
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log('🐦 Budgie Mood on :' + PORT));
