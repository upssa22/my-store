// ملف api/send.js - نسخة الرد الإجباري
export default async function handler(req, res) {
    // 1. التأكد من أن Vercel استلم الطلب (سيظهر هذا في الـ Logs فوراً)
    console.log("⚠️ تم استلام إشارة من تليجرام!");

    if (req.method !== 'POST') {
        return res.status(200).send('المقر يعمل بنجاح ✅');
    }

    const update = req.body;
    const BOT_TOKEN = process.env.TELEGRAM_TOKEN;

    // 2. إذا كانت رسالة من زبون، نرد عليه فوراً
    if (update && update.message) {
        const chatId = update.message.chat.id;
        
        try {
            const telUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
            await fetch(telUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: "👑 **المقر الملكي للشحن** 👑\n\nنعتذر منك، المقر حالياً في وضع الصيانة والتطوير. سنعود قريباً جداً! ✨",
                    parse_mode: 'Markdown'
                })
            });
            console.log("✅ تم إرسال الرد التلقائي للزبون بنجاح.");
        } catch (err) {
            console.log("❌ خطأ أثناء محاولة الرد:", err.message);
        }
    }

    // 3. إنهاء الطلب بـ OK لكي لا يكرر تليجرام الإرسال
    return res.status(200).send('OK');
}
