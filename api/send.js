import fetch from 'node-fetch';

export default async function handler(req, res) {
    const update = req.body;
    const BOT_TOKEN = process.env.TELEGRAM_TOKEN;

    // سجل للعمليات في Vercel Logs
    console.log("استقبال تحديث جديد من تيليجرام...");

    try {
        // إذا كانت رسالة نصية من زبون
        if (update && update.message && update.message.chat) {
            const chatId = update.message.chat.id;

            // أمر الرد المباشر (حتى لو فشل الاتصال بسوبابيز سيرد بالرسالة الافتراضية)
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: "👑 **المقر الملكي للشحن** 👑\n\nنعتذر منك، المقر حالياً في وضع الصيانة والتطوير الشامل لتقديم خدمة أفضل. سنعود قريباً جداً! ✨",
                    parse_mode: 'Markdown'
                })
            });

            const result = await response.json();
            console.log("نتيجة إرسال الرد:", result);

            return res.status(200).send('OK');
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error("خطأ كارثي:", error);
        res.status(500).send('Error');
    }
}
