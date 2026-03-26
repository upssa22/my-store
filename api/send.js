import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

// إعداد الاتصال بقاعدة البيانات باستخدام المتغيرات البيئية المخزنة في Vercel
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
    // التأكد من أن الطلب من نوع POST فقط
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // 1. التحقق من وضع الصيانة في قاعدة البيانات
        const { data: settings, error: settingsError } = await supabase
            .from('store_settings')
            .select('*')
            .eq('id', 1)
            .single();

        if (settingsError) throw settingsError;

        // 2. إذا كان وضع الصيانة TRUE، نوقف العملية ونرسل رسالة الصيانة للزبون
        if (settings && settings.maintenance_mode) {
            return res.status(503).json({ 
                success: false, 
                message: settings.maintenance_text || "المقر في صيانة حالياً، نعتذر عن استقبال الطلبات." 
            });
        }

        // 3. إذا كان المتجر مفتوحاً (FALSE)، نستقبل البيانات ونرسلها لتليجرام
        const { product, price, customer_data } = req.body;

        // بناء رسالة تليجرام الملكية
        const message = `
👑 **طلب جديد من المقر الملكي** 👑
──────────────────
📦 **المنتج:** ${product}
💰 **السعر:** ${price}$
👤 **بيانات العميل:**
${customer_data}
──────────────────
        `;

        const telegramToken = process.env.TELEGRAM_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        if (response.ok) {
            res.status(200).json({ success: true, message: "تم إرسال طلبك للمقر بنجاح! ✅" });
        } else {
            throw new Error("فشل إرسال الإشعار لتليجرام");
        }

    } catch (error) {
        console.error("خطأ برمي:", error);
        res.status(500).json({ success: false, error: error.message });
    }
}
