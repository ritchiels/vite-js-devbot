import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from 'openai';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

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

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            prompt: `${prompt}`,
            messages: [
                {
                    "role": "system",
                    "content": "You will be provided with a piece of code, and your task is to explain it in a concise way."
                },
                {
                    "role": "user",
                    "content": "class Log:\n    def __init__(self, path):\n        dirname = os.path.dirname(path)\n        os.makedirs(dirname, exist_ok=True)\n        f = open(path, \"a+\")\n\n        # Check that the file is newline-terminated\n        size = os.path.getsize(path)\n        if size > 0:\n            f.seek(size - 1)\n            end = f.read(1)\n            if end != \"\\n\":\n                f.write(\"\\n\")\n        self.f = f\n        self.path = path\n\n    def log(self, event):\n        event[\"_event_id\"] = str(uuid.uuid4())\n        json.dump(event, self.f)\n        self.f.write(\"\\n\")\n\n    def state(self):\n        state = {\"complete\": set(), \"last\": None}\n        for line in open(self.path):\n            event = json.loads(line)\n            if event[\"type\"] == \"submit\" and event[\"success\"]:\n                state[\"complete\"].add(event[\"id\"])\n                state[\"last\"] = event\n        return state"
                }
            ],
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        });

        console.log(response.choices[0].message);

        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ error })
    }
})

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));


// const configuration = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(configuration);

//streak