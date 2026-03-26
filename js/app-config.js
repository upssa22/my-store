// js/app-config.js
const CONFIG = {
    // بيانات الربط مع Supabase
    SUPABASE_URL: "https://roljlpmrgkuzeumviobn.supabase.co",
    SUPABASE_KEY: "sb_publishable_mEf2kXqJsivTvismRbM8cQ_RGeuii9q",

    // إعدادات المتجر العامة
    STORE_NAME: "مونوپولي ستور",
    POINTS_NAME: "نقاط ولاء", 
    CURRENCY: "$",

    // مسارات الصفحات (للتنقل السهل)
    PATH_ADMIN: "admin.html",
    PATH_PRODUCTS: "admin-products.html",
    PATH_USERS: "admin-users.html",
    PATH_SALES: "admin-sales.html",
    PATH_STAFF: "admin-staff.html"
};

Object.freeze(CONFIG);
window.CONFIG = CONFIG;
