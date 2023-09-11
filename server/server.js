import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from 'openai';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello, I am DevBot, your coding buddy!',
    })
});

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        console.log(prompt);

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    "role": "system",
                    "content": "You will be provided with a piece of code, and your task is to explain it in a concise way."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature: 0,
            max_tokens: 1024,
            top_p: 1,
            frequency_penalty: 0.5,
        });

        console.log(response.choices[0].message);

        res.status(200).send({
            bot: response.choices[0].message.content
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ error })
    }
})

app.listen(5000, () => console.log('Server is running on port https://dev-bot-wbco.onrender.com/'));