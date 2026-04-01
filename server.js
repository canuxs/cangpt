const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('.')); 

app.post('/chat', async (req, res) => {
    try {
        const { prompt } = req.body;
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                // Burası artık güvenli! Değişkeni Render panelinden alacak.
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { 
                        role: "system", 
                        content: "Sen CanGPT 6.0'sın. Dünyanın en gelişmiş dil modellerinden biri olan Llama 3.3 altyapısıyla çalışıyorsun. Görevin kullanıcının sorularına net, doğru ve teknik hatasız yanıtlar vermektir. Samimi ama ciddi bir ton kullan. Yanıtlarında asla 'Ben bir yapay zekayım' gibi kalıplar kullanma, doğrudan konuya gir." 
                    },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        
        if (data.error) {
            return res.status(400).json({ text: "Groq Hatası: " + data.error.message });
        }

        res.json({ text: data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: "Sunucu hatası oluştu: " + error.message });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`CanGPT 6.0 port ${PORT} üzerinde yayında!`));
