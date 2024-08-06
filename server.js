const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/anthropic', async (req, res) => {
    console.log('Received request:', JSON.stringify(req.body, null, 2));
    try {
        const response = await axios.post('https://api.anthropic.com/v1/messages', {
            model: req.body.model,
            max_tokens: req.body.max_tokens || 1000,
            messages: req.body.messages
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
        });
        console.log('Anthropic API response:', JSON.stringify(response.data, null, 2));
        res.json(response.data);
    } catch (error) {
        console.error('Error calling Anthropic API:', error.response?.data || error.message);
        console.error('Full error object:', JSON.stringify(error, null, 2));
        res.status(500).json({error: error.response?.data || error.message});
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
