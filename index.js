const express = require('express');
const ytdl = require('ytdl-core');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('YouTube Video Downloader API');
});

app.get('/download', async (req, res) => {
    const videoURL = req.query.url;

    if (!videoURL) {
        return res.status(400).send('URL is required');
    }

    try {
        const info = await ytdl.getInfo(videoURL);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });

        res.header('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp4"`);
        ytdl(videoURL, { format: format }).pipe(res);
    } catch (error) {
        res.status(500).send('Error downloading video');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});