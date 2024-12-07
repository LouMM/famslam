import express from 'express';
import { URL } from 'url';

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/fetch-html', async (req, res) => {
    const targetUrl = req.query.url as string;
    if (!targetUrl) {
        return res.status(400).send('Missing url parameter');
    }

    try {
        // Validate that targetUrl is a proper URL
        new URL(targetUrl);
        // Use dynamic import to load node-fetch 
        //const fetch = (await import('node-fetch')).default;
        const response = await fetch(targetUrl);
        const text = await response.text();

        // CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(text);
    } catch (error: any) {
        console.error(error);
        res.status(500).send('Error fetching page');
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server listening on port ${PORT}`);
});