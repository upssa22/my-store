export default async function handler(req, res) {
    const BOT_TOKEN = process.env.TELEGRAM_TOKEN;
    const update = req.body;

    if (req.method === 'POST' && update.message) {
        const chatId = update.message.chat.id;
        
        // النص الملكي للرد
        const text = "👑 **المقر الملكي للشحن** 👑\n\nنعتذر منك، المقر حالياً في وضع الصيانة والتطوير الشامل. سنعود قريباً جداً! ✨";

        try {
            // استخدام رابط URL مباشر مع الحقول المطلوبة فقط
            const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
            
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: text,
                    parse_mode: 'Markdown' // هذا لتنسيق الخط العريض والرموز
                })
            });

            console.log("✅ تم إرسال الرد لـ Chat ID:", chatId);
        } catch (err) {
            console.log("❌ فشل الإرسال:", err.message);
        }
    }

    return res.status(200).send('OK');
}
