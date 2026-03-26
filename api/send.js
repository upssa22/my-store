// ملف api/send.js - نسخة الطوارئ المستقرة
export default async function handler(req, res) {
    const BOT_TOKEN = process.env.TELEGRAM_TOKEN;
    const update = req.body;

    // تسجيل أي حركة في الـ Logs للتشخيص
    console.log("استلام طلب جديد...");

    if (req.method === 'POST' && update && update.message) {
        const chatId = update.message.chat.id;
        const firstName = update.message.from.first_name || "زبون";

        try {
            // الرد التلقائي المباشر (بدون انتظار قاعدة البيانات حالياً)
            const text = `👑 **المقر الملكي للشحن** 👑\n\nأهلاً بك يا ${firstName}.. المقر حالياً في وضع الصيانة. سنعود غداً إن شاء الله! ✨`;
            
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: text,
                    parse_mode: 'Markdown'
                })
            });

            console.log(`✅ تم الرد بنجاح على: ${firstName}`);
        } catch (err) {
            console.error("❌ فشل الإرسال:", err.message);
        }
    }

    // إرسال رد ناجح لتيليجرام دائماً لمنع التكرار
    return res.status(200).send('OK');
}
