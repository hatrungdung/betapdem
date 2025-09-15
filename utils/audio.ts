import React from 'react';

let audioContext: AudioContext | null = null;

// This function creates or resumes the audio context.
// Browsers require user interaction to start the audio context.
const ensureAudioContext = () => {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (e) {
            console.error("Web Audio API is not supported in this browser");
            return;
        }
    }

    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
};

const playNote = (frequency: number, duration: number, type: OscillatorType = 'sine', delay: number = 0) => {
    if (!audioContext) return;
    
    const startTime = audioContext.currentTime + delay;
    const stopTime = startTime + duration;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);

    // A simple attack-decay envelope to make it sound less harsh
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.5, startTime + 0.01); // Quick attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, stopTime);

    oscillator.start(startTime);
    oscillator.stop(stopTime);
};

// Function to create a frequency glide, for the "meow" sound
const playGlide = (startFreq: number, endFreq: number, duration: number, type: OscillatorType = 'triangle', delay: number = 0) => {
    if (!audioContext) return;

    const startTime = audioContext.currentTime + delay;
    const stopTime = startTime + duration;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(startFreq, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(endFreq, stopTime);

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, stopTime);

    oscillator.start(startTime);
    oscillator.stop(stopTime);
};


// Cheerful tones for kids
const sounds = {
    increment: () => {
        playNote(523.25, 0.15); // C5
        playNote(783.99, 0.15, 'sine', 0.1); // G5
    },
    decrement: () => {
        playNote(440.00, 0.15); // A4
        playNote(329.63, 0.15, 'sine', 0.1); // E4
    },
    limit: () => {
        playNote(130.81, 0.2, 'sawtooth'); // C3, sawtooth for a gentle "buzz"
    },
    hit: () => {
        // "Meow Meow" sound
        playGlide(800, 1200, 0.15, 'triangle');
        playGlide(700, 1100, 0.15, 'triangle', 0.15);
    }
};

export const playSound = (type: 'increment' | 'decrement' | 'limit' | 'hit') => {
    // This must be called from a user-initiated event like a click
    ensureAudioContext(); 
    if (audioContext) {
      sounds[type]();
    }
};