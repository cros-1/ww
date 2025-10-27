console.log("✅ script.js loaded");
/* =====================================
   إعداد المنصة – setup.html
===================================== */
function saveSetup() {
  const scriptURL = document.getElementById('suScript').value.trim();
  const adminPass = document.getElementById('suPass').value.trim();
  const primaryColor = document.getElementById('suPrimary').value;

  if (!scriptURL.startsWith("https://script.googleusercontent.com/")) {
    alert("⚠️ تأكد أن الرابط يبدأ بـ https://script.googleusercontent.com/");
    return;
  }

  if (!adminPass) {
    alert("⚠️ الرجاء إدخال كلمة مرور للوحة التحكم");
    return;
  }

  // حفظ الإعدادات في المتصفح (محلياً)
  localStorage.setItem("scriptURL", scriptURL);
  localStorage.setItem("adminPass", adminPass);
  localStorage.setItem("primaryColor", primaryColor);

  alert("✅ تم حفظ الإعدادات بنجاح!\nيمكنك الآن العودة للصفحة الرئيسية.");
}

function previewSetup() {
  const color = document.getElementById("suPrimary").value;
  document.body.style.background = color + "22"; // خلفية بلون فاتح من اللون الأساسي
  alert("🎨 تمت المعاينة بنجاح، اللون الأساسي: " + color);
}

/* =====================================
   تحميل الإعدادات عند فتح أي صفحة
===================================== */
window.addEventListener("DOMContentLoaded", () => {
  const primaryColor = localStorage.getItem("primaryColor");
  if (primaryColor) {
    document.documentElement.style.setProperty("--primary", primaryColor);
  }
});

/* =====================================
   لوحة التحكم – التحقق من كلمة المرور
===================================== */
function checkLogin() {
  const enteredPass = prompt("الرجاء إدخال كلمة مرور لوحة التحكم:");
  const savedPass = localStorage.getItem("adminPass");

  if (enteredPass === savedPass) {
    alert("✅ تم تسجيل الدخول بنجاح");
    document.body.classList.add("admin-active");
  } else {
    alert("❌ كلمة المرور غير صحيحة");
  }
}

/* =====================================
   دالة جلب البيانات من Google Apps Script
===================================== */
async function fetchData(type) {
  const scriptURL = localStorage.getItem("scriptURL");
  if (!scriptURL) {
    console.warn("⚠️ لم يتم إعداد رابط Google Script بعد");
    return [];
  }

  try {
    const res = await fetch(⁠ ${scriptURL}?mode=read&type=${type} ⁠);
    if (!res.ok) throw new Error("فشل الاتصال بالسكربت");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("حدث خطأ أثناء الجلب:", err);
    return [];
  }
}

/* =====================================
   دالة إرسال البيانات إلى Google Sheet
===================================== */
async function postData(type, payload) {
  const scriptURL = localStorage.getItem("scriptURL");
  if (!scriptURL) {
    alert("⚠️ لم يتم إعداد Google Script بعد من صفحة الإعدادات.");
    return false;
  }

  try {
    const res = await fetch(scriptURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "write", type, data: payload })
    });
    const result = await res.json();
    if (result.status === "success") {
      alert("✅ تم حفظ البيانات بنجاح");
      return true;
    } else {
      throw new Error(result.message || "فشل الإرسال");
    }
  } catch (err) {
    console.error("خطأ أثناء الإرسال:", err);
    alert("❌ حدث خطأ أثناء الإرسال، تحقق من الرابط أو الصلاحيات.");
    return false;
  }
}
