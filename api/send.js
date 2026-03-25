export default async function handler(req, res) {
    // التأكد من أن الإرسال يتم عبر POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    // فحص سريع إذا كانت المتغيرات مفقودة
    if (!BOT_TOKEN || !CHAT_ID) {
        return res.status(500).json({ error: 'الرموز السرية BOT_TOKEN أو CHAT_ID غير موجودة في إعدادات Vercel' });
    }

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const result = await response.json();
        
        if (result.ok) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(500).json({ error: 'Telegram API Error', details: result });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
