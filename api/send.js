import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
    const BOT_TOKEN = process.env.TELEGRAM_TOKEN;
    const update = req.body;

    if (req.method === 'POST' && update.message) {
        const msg = update.message;
        const chatId = msg.chat.id;
        const firstName = msg.from.first_name || "زبون";
        const username = msg.from.username || "n/a";
        
        let mediaType = 'text';
        let mediaId = null;
        let textContent = msg.text || msg.caption || "";

        // 🔍 فحص نوع الرسالة بدقة (صورة، صوت، فيديو، أو مستند)
        if (msg.photo) { 
            mediaType = 'photo'; 
            mediaId = msg.photo[msg.photo.length - 1].file_id; 
        } 
        else if (msg.voice) { 
            mediaType = 'voice'; 
            mediaId = msg.voice.file_id; 
        } 
        else if (msg.video) { 
            mediaType = 'video'; 
            mediaId = msg.video.file_id; 
        }
        else if (msg.video_note) { // رسائل الفيديو السريعة (الدوائر)
            mediaType = 'video'; 
            mediaId = msg.video_note.file_id; 
        }
        else if (msg.document) { 
            mediaType = 'file'; 
            mediaId = msg.document.file_id; 
        }

        try {
            // 1. حفظ في قاعدة البيانات مع النوع الصحيح
            await supabase.from('incoming_messages').insert([{ 
                chat_id: chatId, 
                full_name: firstName, 
                username: username, 
                message_text: textContent, 
                media_type: mediaType, 
                media_file_id: mediaId 
            }]);

            // 2. الرد التلقائي الملكي
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: `👑 أهلاً بك يا ${firstName}.. تم استلام رسالتك وتخزينها (نوع: ${mediaType}) في سجلات المقر الملكي. نحن في صيانة حالياً. ✨`,
                    parse_mode: 'Markdown'
                })
            });
        } catch (err) { 
            console.error("خطأ في الحفظ:", err.message); 
        }
    }
    return res.status(200).send('OK');
}
