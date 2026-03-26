// js/app-config.js
const CONFIG = {
    // روابط الاتصال (هذه عامة ولا يمكن إخفاؤها في الفرونت-إند)
    SUPABASE_URL: "https://roljlpmrgkuzeumviobn.supabase.co",
    SUPABASE_KEY: "sb_publishable_mEf2kXqJsivTvismRbM8cQ_RGeuii9q", 

    // إعدادات الهوية (تغيرها هنا لتتغير في كل الصفحات)
    STORE_NAME: "مونوپولي ستور",
    POINTS_NAME: "نقاط ولاء", // المسمى الجديد
    CURRENCY: "$",

    // الروابط الداخلية (لتسهيل النقل مستقبلاً)
    PATH_ADMIN: "admin.html",
    PATH_PRODUCTS: "admin-products.html",
    PATH_USERS: "admin-users.html",
    PATH_SALES: "admin-sales.html",
    PATH_STAFF: "admin-staff.html"
};

// تجميد الكائن لمنع التلاعب به من الكونسول
Object.freeze(CONFIG);
window.CONFIG = CONFIG;
