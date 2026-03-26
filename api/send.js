import { createClient } from '@supabase/supabase-js';

// إعداد السوبابيز (تأكد أن المفاتيح مضافة في Vercel)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
    const update = req.body;
    const BOT_TOKEN = process.env.TELEGRAM_TOKEN;

    try {
        // 1. جلب حالة الصيانة والنص من قاعدة البيانات
        const { data: settings } = await supabase.from('store_settings').select('*').eq('id', 1).single();
        const isMaintenance = settings?.maintenance_mode;
        const maintenanceText = settings?.maintenance_text || "⚠️ المقر في صيانة حالياً.";

        // 2. إذا كان الزبون يرسل رسالة نصية (Direct Message) والصيانة مفعلة
        if (update && update.message && isMaintenance) {
            const chatId = update.message.chat.id;

            // أمر إرسال الرد للعميل (أهم جزء)
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: `👑 **المقر الملكي للشحن** 👑\n\n${maintenanceText}\n\nيرجى الانتظار لحين الافتتاح الرسمي. ✨`,
                    parse_mode: 'Markdown'
                })
            });

            // ننهي العملية هنا لكي لا يصلك إشعار بالرسالة
            return res.status(200).send('OK');
        }

        // 3. إذا كان المتجر مفتوحاً (FALSE) أرسل الطلبات للأدمن كالمعتاد
        if (req.method === 'POST' && req.body.product && !isMaintenance) {
            const { product, price, customer_data } = req.body;
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: process.env.TELEGRAM_CHAT_ID,
                    text: `📦 طلب جديد: ${product}\n💰 السعر: ${price}\n👤 البيانات: ${customer_data}`
                })
            });
            return res.status(200).json({ success: true });
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error');
    }
}
