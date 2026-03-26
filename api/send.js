import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
    // 1. جلب إعدادات الصيانة الحالية من قاعدة البيانات
    const { data: settings } = await supabase
        .from('store_settings')
        .select('*')
        .single();

    // 2. التحقق: إذا كان وضع الصيانة مفعلاً، ارفض الطلب فوراً
    if (settings && settings.maintenance_mode) {
        return res.status(503).json({ 
            success: false, 
            message: settings.maintenance_text || "المقر في صيانة حالياً." 
        });
    }

    // 3. إذا كانت الصيانة معطلة، أكمل كود إرسال الرسالة لتليجرام
    // (هنا تضع كود إرسال الرسالة الخاص بك القديم)
    
    res.status(200).json({ success: true, message: "تم استقبال طلبك بنجاح!" });
}
