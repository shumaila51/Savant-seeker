
export function moodToColor(mood: string): string {
    const colors: { [key: string]: string } = {
        "happy": "#FFD700", // Gold
        "sad": "#1E90FF",   // DodgerBlue
        "angry": "#DC143C",  // Crimson
        "calm": "#3CB371",   // MediumSeaGreen
        "excited": "#FFA500",// Orange
        "bored": "#808080"   // Gray
    };
    const color = colors[mood.toLowerCase()] || "#FFFFFF"; // Default to white
    return `The color for ${mood.toLowerCase()} is ${color}`;
}

export function getReverseMotivation(): string {
    const quotes = [
        "You're not gonna make it, unless you prove me wrong.",
        "Why even try? Unless you're different from the rest...",
        "No one expects you to succeed—surprise them.",
        "Success is probably not for you. Go ahead, prove it.",
        "Just give up. It's easier. Or is it?",
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
}

export function toAlienLanguage(text: string): string {
    const alienMap: { [key: string]: string } = { 'a': '@', 'e': '∑', 'i': '!', 'o': 'Ø', 'u': '∪' };
    return text.split('').map(char => alienMap[char.toLowerCase()] || char).join('');
}

export function getEmojiWeather(): string {
    const forecast = ["☀️ Sunny", "🌧️ Rainy", "⛈️ Stormy", "❄️ Snowy", "🌫️ Foggy", "🌪️ Tornado Warning!", "🌤️ Partly Cloudy"];
    return `Today's forecast: ${forecast[Math.floor(Math.random() * forecast.length)]}`;
}

export function getProcrastinationTime(taskType: string): string {
    const delay: { [key: string]: string } = {
        "homework": "2 hours",
        "cleaning": "30 minutes",
        "work email": "1 hour",
        "taxes": "3 days",
        "laundry": "at least 1 business day",
        "dishes": "until you run out of spoons"
    };
    return `Estimated delay for '${taskType.toLowerCase()}': ${delay[taskType.toLowerCase()] || "an unknown, but significant, amount of time"}`;
}

export function interpretDream(dreamObject: string): string {
    const meanings: { [key: string]: string } = {
        "snake": "You're afraid of betrayal.",
        "water": "You seek emotional clarity.",
        "flying": "You desire freedom.",
        "teeth falling": "You fear embarrassment.",
        "dog": "It means you're a good person.",
        "cat": "You are craving independence and a nap.",
    };
    return `Dreaming of a ${dreamObject.toLowerCase()}? ${meanings[dreamObject.toLowerCase()] || "That dream means you're awesome."}`;
}

export function translateKeyboardSmash(smash: string): string {
    if (smash.trim() === '') return "Please provide a keyboard smash.";
    return `Translation: 'Urgent chaos approaching!' (Detected ${smash.length} units of energy)`;
}

export function getNameVibe(name: string): string {
    if (name.trim() === '') return "Please provide a name.";
    const vibes = ["a cool", "a mysterious", "a chaotic", "a peaceful", "a funny", "a genius"];
    const vibe = vibes[Math.floor(Math.random() * vibes.length)];
    return `${name} gives off ${vibe} vibe!`;
}

export function translatePetTalk(sound: string): string {
    if (sound.trim() === '') return "Please provide a pet sound.";
    const lowerSound = sound.toLowerCase();
    if (lowerSound.includes("meow")) return "Translation: 'Feed me, human. And perhaps a head scratch.'";
    if (lowerSound.includes("bark") || lowerSound.includes("woof")) return "Translation: 'Intruder alert! Or maybe a squirrel. It's a 50/50 chance.'";
    if (lowerSound.includes("chirp")) return "Translation: 'It's a beautiful day for screaming!'";
    if (lowerSound.includes("purr")) return "Translation: 'This is acceptable. Do not stop.'";
    return "This sound translates to: 'I am a mysterious creature with unknowable thoughts.'";
}
