import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

// إعداد الاتصال بقاعدة البيانات (تأكد من وجود المتغيرات في Vercel Settings)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
    // استقبال التحديث القادم من تيليجرام (Webhook) أو المتجر
    const update = req.body;

    try {
        // 1. جلب إعدادات الصيانة فوراً من Supabase
        const { data: settings, error: settingsError } = await supabase
            .from('store_settings')
            .select('*')
            .eq('id', 1)
            .single();

        if (settingsError) throw settingsError;

        const isMaintenance = settings && settings.maintenance_mode;
        const maintenanceText = settings?.maintenance_text || "⚠️ المقر الملكي في صيانة حالياً.";

        // --- الجزء الأول: التعامل مع الرسائل النصية المباشرة (الدايركت) ---
        if (update.message && update.message.text) {
            const chatId = update.message.chat.id;
            const userText = update.message.text;

            // إذا كانت الصيانة مفعلة، نرد آلياً وننهي العملية (الزبون لن يزعجك)
            if (isMaintenance) {
                await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: `👑 **رسالة ملكية تلقائية** 👑\n\n${maintenanceText}\n\nيرجى العلم أن المراسلة المباشرة مع البوت معطلة حالياً. انتظر الافتتاح الرسمي للمتجر. ✨`,
                        parse_mode: 'Markdown'
                    })
                });
                return res.status(200).send('OK'); // إنهاء هنا (لن يصلك إشعار)
            }
        }

        // --- الجزء الثاني: التعامل مع طلبات المتجر (Web App) ---
        // إذا وصل طلب من المتجر والصيانة مفعلة، نرفضه أيضاً
        if (isMaintenance && req.method === 'POST' && req.body.product) {
            return res.status(503).json({ 
                success: false, 
                message: maintenanceText 
            });
        }

        // --- الجزء الثالث: إرسال الطلبات الحقيقية (عندما تكون الصيانة FALSE) ---
        if (req.body.product && !isMaintenance) {
            const { product, price, customer_data } = req.body;
            
            const telegramMsg = `
👑 **طلب شراء جديد** 👑
──────────────────
📦 **المنتج:** ${product}
💰 **السعر:** ${price}$
👤 **البيانات:**
${customer_data}
──────────────────
            `;

            await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: process.env.TELEGRAM_CHAT_ID,
                    text: telegramMsg,
                    parse_mode: 'Markdown'
                })
            });

            return res.status(200).json({ success: true, message: "تم الاستلام!" });
        }

        // رد نهائي لتيليجرام لضمان استمرار الـ Webhook
        res.status(200).send('OK');

    } catch (error) {
        console.error("خطأ في معالجة الطلب:", error);
        res.status(500).json({ error: error.message });
    }
}
