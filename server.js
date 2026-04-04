const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('.')); 

// --- GÖRSEL ENGELİNİ AŞAN PROXY ---
app.get('/proxy-image', async (req, res) => {
    const imageUrl = req.query.url;
    if (!imageUrl) return res.status(400).send('URL eksik');
    try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error('Görsel çekilemedi');
        const buffer = await response.buffer();
        res.set('Content-Type', 'image/png');
        res.send(buffer);
    } catch (error) {
        res.status(500).send('Proxy hatası: ' + error.message);
    }
});

// --- CAN GPT ANA MOTORU ---
app.post('/chat', async (req, res) => {
    try {
        const { history } = req.body;
        if (!history || !Array.isArray(history)) {
            return res.status(400).json({ error: "Geçmiş verisi bulunamadı." });
        }

        // SENİN ÖZEL BİLGİLERİN BURADA KORUNUYOR
        const systemMessage = { 
            role: "system", 
            content: "Sen CanGPT U1'sin. Llama 3.3 altyapısıyla çalışıyorsun. Can Bartu Biçer senin kurucundur. Can Bartu Biçer 5/A sınıfındadır ve doğum günü 17 Nisan 2015'tir. Can Bartu'nun arkadaşları: Kerem Ayrancı, Hasan Duran, Yunus Ege Usluoğlu, Hazal, Büşra, Emre Sahilli, Doğa Doğan, İpek Doğan, Emir Sürer'dir. Eğer kullanıcı bir görsel çizmeni isterse, yanıtında mutlaka 'GÖRSEL_OLUŞTUR: [görsel açıklaması]' kalıbını kullan." 
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
        if (data.choices && data.choices[0]) {
            res.json({ text: data.choices[0].message.content });
        } else {
            res.status(400).json({ error: "API Hatası" });
        }
    } catch (error) {
        res.status(500).json({ error: "Sunucu hatası: " + error.message });
    }
});

app.get('*', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });
app.listen(PORT, () => console.log(`CanGPT U1 Yayında: Port ${PORT}`));
