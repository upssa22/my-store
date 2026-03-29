export default async function handler(req, res) {
    const { fileId } = req.query;
    const BOT_TOKEN = process.env.TELEGRAM_TOKEN;

    if (!fileId) return res.status(400).send("مفقود معرف الملف");

    try {
        // طلب مسار الملف من تليجرام (السيرفر يتحدث مع السيرفر)
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
        const data = await response.json();

        if (data.ok) {
            // تكوين الرابط المباشر للملف
            const filePath = data.result.file_path;
            const fullUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
            
            // إعادة توجيه المتصفح للرابط (Redirect)
            return res.redirect(fullUrl);
        } else {
            return res.status(404).send("الملف غير موجود أو انتهت صلاحيته في تليجرام");
        }
    } catch (error) {
        return res.status(500).send("خطأ في الاتصال بتليجرام");
    }
}
