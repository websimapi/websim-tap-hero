// This file generates a note chart for the game.
// In a real game, this would be parsed from a MIDI or other chart file.

export function generateSong() {
    const notes = [];
    let idCounter = 0;

    // Song parameters
    const bpm = 130;
    const beatsPerSecond = bpm / 60;
    const songDurationSeconds = 90;
    const totalBeats = songDurationSeconds * beatsPerSecond;

    // Simple patterns
    const patterns = [
        [0], [1], [2], [3], // Single notes
        [0, 2], [1, 3],     // Simple chords
        [0, 1], [2, 3]      // Adjacent notes
    ];

    let lastBeat = -1;
    for (let beat = 4; beat < totalBeats; beat++) {
        // Add notes on whole and half beats
        if (beat % 0.5 === 0 && beat > lastBeat + 0.4) {
             // Add some randomness to note placement
            if (Math.random() < 0.6) {
                const pattern = patterns[Math.floor(Math.random() * patterns.length)];
                for (const column of pattern) {
                    notes.push({
                        id: idCounter++,
                        time: beat / beatsPerSecond,
                        column: column,
                        duration: 0.1 // Not used yet, but good for holds later
                    });
                }
                lastBeat = beat;
            }
        }
    }

    // Ensure notes are sorted by time
    notes.sort((a, b) => a.time - b.time);

    return notes;
}