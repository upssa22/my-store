import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
    const update = req.body;
    const BOT_TOKEN = process.env.TELEGRAM_TOKEN;

    try {
        // 1. جلب إعدادات الصيانة من قاعدة البيانات
        const { data: settings } = await supabase.from('store_settings').select('*').eq('id', 1).single();
        const isMaintenance = settings && settings.maintenance_mode;
        const maintenanceText = settings?.maintenance_text || "⚠️ المقر الملكي في صيانة حالياً، سنعود قريباً!";

        // 2. إذا كان الزبون يرسل رسالة نصية (Direct Message) والصيانة مفعلة
        if (update.message && update.message.text && isMaintenance) {
            const chatId = update.message.chat.id;

            // إرسال رسالة "المقر متعطل" فوراً للزبون
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: `👑 **رسالة إدارية مؤقتة** 👑\n\n${maintenanceText}\n\nنعتذر عن استقبال أي طلبات أو رسائل حالياً. ✨`,
                    parse_mode: 'Markdown'
                })
            });

            // ننهي العملية هنا لكي لا يصلك إشعار
            return res.status(200).send('OK');
        }

        // 3. إذا كان الطلب قادماً من "المتجر" (WebApp) والصيانة مفعلة
        if (req.method === 'POST' && req.body.product && isMaintenance) {
            return res.status(503).json({ success: false, message: maintenanceText });
        }

        // --- (بقية الكود الخاص بإرسال الطلبات الحقيقية للأدمن) ---
        // في حالة الصيانة معطلة، يتم إرسال الطلب لك بشكل طبيعي
        
        res.status(200).send('OK');
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send('Internal Server Error');
    }
}
