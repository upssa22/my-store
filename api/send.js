import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
    const BOT_TOKEN = process.env.TELEGRAM_TOKEN;
    const update = req.body;

    if (req.method === 'POST' && update.message) {
        const msg = update.message;
        const chatId = msg.chat.id;
        const firstName = msg.from.first_name || "زبون ملكي";
        
        let mediaType = 'text';
        let mediaId = null;
        let caption = msg.text || "";

        // 1. التحقق إذا كانت المرسل "صورة"
        if (msg.photo) {
            mediaType = 'photo';
            // نأخذ أعلى جودة للصورة (آخر عنصر في المصفوفة)
            mediaId = msg.photo[msg.photo.length - 1].file_id;
            caption = msg.caption || "صورة بدون وصف";
        } 
        // 2. التحقق إذا كانت المرسل "بصمة صوتية" (Voice)
        else if (msg.voice) {
            mediaType = 'voice';
            mediaId = msg.voice.file_id;
        }
        // 3. التحقق إذا كانت "ملف صيفي" (Audio)
        else if (msg.audio) {
            mediaType = 'audio';
            mediaId = msg.audio.file_id;
        }

        try {
            // حفظ البيانات في جدول 'incoming_messages'
            await supabase.from('incoming_messages').insert([
                { 
                    chat_id: chatId, 
                    full_name: firstName, 
                    message_text: caption,
                    media_type: mediaType,
                    media_file_id: mediaId // هذا المعرف يسمح لك بمشاهدة الصورة لاحقاً
                }
            ]);

            // الرد التلقائي المعتاد
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: `👑 أهلاً بك يا ${firstName}.. تم استلام رسالتك (نوع: ${mediaType}) وهي قيد الأرشفة في وضع الصيانة حالياً. ✨`,
                    parse_mode: 'Markdown'
                })
            });

        } catch (err) {
            console.error("خطأ في الأرشفة:", err.message);
        }
    }

    return res.status(200).send('OK');
}
