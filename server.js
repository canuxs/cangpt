const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('.')); 

app.post('/chat', async (req, res) => {
    try {
        const { history } = req.body;
        const systemMessage = { 
            role: "system", 
            content: "Sen CanGPT U1'sin. Kurucun Can Bartu Biçer'dir (5/A sınıfı). Arkadaşları: Kerem Ayrancı, Hasan Duran, Yunus Ege Usluoğlu, Hazal, Büşra, Emre Sahilli, Doğa Doğan, İpek Doğan, Emir Sürer. Eğer kullanıcı görsel çizmeni isterse, yanıtında sadece 'GÖRSEL_OLUŞTUR: [İngilizce betimleme]' yaz." 
        };

        // Render panelindeki GROQ_API_KEY değişkenini kullanır
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
        res.status(500).json({ error: "Groq Bağlantı Hatası" });
    }
});

app.get('*', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });
app.listen(PORT, () => console.log(`Sistem Aktif`));
