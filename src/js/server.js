const express = require('express');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const app = express();
app.use(express.json());

const client = new SecretManagerServiceClient();
const cors = require('cors');
app.use(cors()); // Adaugă asta în server.js

async function getApiKey() {
    const [version] = await client.accessSecretVersion({
        name: 'projects/YOUR_PROJECT_ID/secrets/OPENAI_API_KEY/versions/latest',
    });
    return version.payload.data.toString();
}

app.post('/api/recommendations', async (req, res) => {
    try {
        const apiKey = await getApiKey();
        const { userHabits } = req.body;

        // Aici apelezi OpenAI folosind apiKey-ul securizat
        // const response = await callOpenAI(apiKey, userHabits);

        res.json({ status: 'success', data: 'Aici va fi recomandarea AI' });
    } catch (error) {
        res.status(500).send('Error retrieving secret or calling AI');
    }
});

app.listen(8080, () => console.log('Antigravity service running on port 8080'));