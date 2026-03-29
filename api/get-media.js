// ملف api/get-media.js - جالب الوسائط السري
export default async function handler(req, res) {
    const { fileId } = req.query;
    const BOT_TOKEN = process.env.TELEGRAM_TOKEN;

    if (!fileId) return res.status(400).send("مفقود ID الملف");

    try {
        // 1. طلب مسار الملف من تليجرام (سرياً بالسيرفر)
        const fileRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
        const fileData = await fileRes.json();

        if (fileData.ok) {
            const fullUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileData.result.file_path}`;
            // 2. إعادة توجيه المتصفح للرابط الحقيقي دون كشف التوكن
            return res.redirect(fullUrl);
        }
        res.status(404).send("الملف غير موجود");
    } catch (e) {
        res.status(500).send("خطأ في السيرفر");
    }
}
