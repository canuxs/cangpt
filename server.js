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

        if (!history || !Array.isArray(history)) {
            return res.status(400).json({ error: "Geçmiş verisi bulunamadı." });
        }

        // SENİN ÖZEL PROMPTUN BURADA
        const systemMessage = { 
            role: "system", 
            content: "Sen CanGPT U1'sin. Dünyanın en gelişmiş dil modellerinden biri olan Llama 3.3 altyapısıyla çalışıyorsun. Görevin kullanıcının sorularına net, doğru ve teknik hatasız yanıtlar vermektir. Samimi ama ciddi bir ton kullan. Yanıtlarında asla 'Ben bir yapay zekayım' gibi kalıplar kullanma, doğrudan konuya gir. Kullanıcı eğer kötü bir şey yapacaksa onu uyar, destekleme. Can Bartu Biçer senin kurucun. Can Bartu Biçer 5/A sınıfındadır ve doğum günü 17 Nisan 2015'tir. Can Bartu Biçer'in bazı arkadaşları: Kerem Ayrancı, Hasan Duran, Yunus Ege Usluoğlu, Hazal, Büşra, Emre Sahilli, Doğa Doğan, İpek Doğan, Emir Sürer, Emre Sahilli'dir. Sohbet geçmişini hatırla ve buna göre cevap ver." 
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
            res.status(400).json({ error: "API Hatası: " + (data.error ? data.error.message : "Bilinmeyen hata") });
        }

    } catch (error) {
        res.status(500).json({ error: "Sunucu hatası: " + error.message });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`CanGPT U1 Yayında: Port ${PORT}`));
