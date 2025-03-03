const express = require('express');
const dotenv = require('dotenv');
const spotifyPreviewFinder = require('spotify-preview-finder');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Health check endpoint to prevent the server from sleeping
app.get('/ping', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/preview', async (req, res) => {
    const songName = req.query.song;
    if (!songName) {
        return res.status(400).json({ error: 'Song name is required' });
    }

    try {
        const result = await spotifyPreviewFinder(songName, 1);
        if (result.success) {
            const previewUrls = result.results.map(song => song.previewUrls);
            res.json({ previewUrls });
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
