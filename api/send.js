export default async function handler(req, res) {
    if (req.method === 'POST') {
        const update = req.body;
        const BOT_TOKEN = process.env.TELEGRAM_TOKEN;

        if (update.message) {
            const chatId = update.message.chat.id;
            const text = "👑 **المقر الملكي للشحن** 👑\n\nنعتذر منك، المقر حالياً في وضع الصيانة والتطوير الشامل لتقديم خدمة أفضل. سنعود قريباً جداً! ✨";

            // استخدام fetch المدمج في Node.js 18+
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: text,
                    parse_mode: 'Markdown'
                })
            });
        }
    }
    return res.status(200).send('OK');
}
