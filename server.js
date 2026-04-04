const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('.')); 

// BASİT PROXY: Karmaşık başlıkları (headers) kaldırıp doğrudan veriyi çeker
app.get('/proxy-image', async (req, res) => {
    const imageUrl = req.query.url;
    if (!imageUrl) return res.status(400).send('URL eksik');

    try {
        const response = await fetch(imageUrl);
        const buffer = await response.buffer();
        
        res.set('Content-Type', 'image/png');
        res.send(buffer);
    } catch (e) {
        console.error("Proxy hatası:", e.message);
        res.status(500).send('Görsel sunucu hatası');
    }
});

app.post('/chat', async (req, res) => {
    try {
        const { history } = req.body;
        const systemMessage = { 
            role: "system", 
            content: "Sen CanGPT U1'sin. Can Bartu Biçer senin kurucundur (5/A sınıfındadır). Arkadaşları: Kerem Ayrancı, Hasan Duran, Yunus Ege Usluoğlu, Hazal, Büşra, Emre Sahilli, Doğa Doğan, İpek Doğan, Emir Sürer. Görsel çizmek için 'GÖRSEL_OLUŞTUR: [açıklama]' kalıbını kullan." 
        };

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [systemMessage, ...history],
                temperature: 0.7
            })
        });

        const data = await response.json();
        res.json({ text: data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('*', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });
app.listen(PORT, () => console.log(`CanGPT Yayında: ${PORT}`));
