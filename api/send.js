// ملف api/send.js - نسخة التوافق الكامل
export default async function handler(req, res) {
    // 1. السماح باستقبال البيانات (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // تسجيل وصول الطلب في الـ Logs (سيظهر مهما حدث)
    console.log("إشارة قادمة من تليجرام... النوع:", req.method);

    if (req.method !== 'POST') {
        return res.status(200).send('المقر الملكي يعمل! 👑');
    }

    const BOT_TOKEN = process.env.TELEGRAM_TOKEN;
    const update = req.body;

    // التأكد من وجود رسالة
    if (update && update.message) {
        const chatId = update.message.chat.id;
        const maintenanceMsg = "👑 **المقر الملكي للشحن** 👑\n\nنعتذر منك، المقر حالياً في وضع الصيانة والتطوير الشامل لتقديم خدمة أفضل. سنعود قريباً جداً! ✨";

        try {
            // إرسال الرد عبر رابط تليجرام المباشر
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: maintenanceMsg,
                    parse_mode: 'Markdown'
                })
            });

            const result = await response.json();
            console.log("تم إرسال الرد بنجاح:", result.ok);
        } catch (error) {
            console.error("خطأ في الإرسال:", error.message);
        }
    }

    // إغلاق الاتصال بـ OK لتيليجرام
    return res.status(200).json({ status: "ok" });
}
