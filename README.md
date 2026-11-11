# 🎬 AI Video Studio

تطبيق ذكاء اصطناعي لتوليد **الصور والفيديو**، يعتمد على **الإنترنت** للبحث والتحليل قبل التوليد، ومبني على مشاريع **مفتوحة المصدر** من GitHub.

## كيف يعمل
```
الهاتف / المتصفح  ──►  web/  (واجهة PWA على GitHub Pages)
   │  1) بحث (Wikipedia أو Tavily) + تحليل بنموذج لغوي ──► Prompt سينمائي
   │  2) صورة  ──► Pollinations (مجاني) أو Space الخاص بك
   └─ 3) فيديو ──► space/  (Hugging Face Space: diffusers + LTX-Video)
GitHub Actions: ينشر web/ على Pages، ويزامن space/ إلى Hugging Face
```
المصادر المفتوحة: [diffusers](https://github.com/huggingface/diffusers) · [LTX-Video](https://github.com/Lightricks/LTX-Video) · FLUX.1-schnell (اختياري) · [Gradio](https://github.com/gradio-app/gradio).

## 1) الرفع إلى GitHub (من Termux)
```
unzip ai-video-studio.zip -d ai-video-studio && cd ai-video-studio
git init && git add -A && git commit -m "AI Video Studio v0"
git branch -M main
git remote add origin https://github.com/USERNAME/ai-video-studio.git
git push -u origin main
```
(أنشئ المستودع `ai-video-studio` على GitHub أولاً.)

## 2) تشغيل الواجهة (GitHub Pages)
المستودع ← **Settings → Pages → Source: GitHub Actions**. بعد دقيقتين يظهر الرابط في تبويب Actions.
الصورة (Pollinations) والبحث والتحليل تعمل فوراً دون أي مفتاح.

## 3) تشغيل توليد الفيديو (يحتاج GPU)
1. أنشئ حساباً على huggingface.co واصنع **Access Token** (صلاحية write).
2. في مستودع GitHub: **Settings → Secrets and variables → Actions**
   - Secret باسم `HF_TOKEN` = التوكن.
   - Variable باسم `HF_SPACE` = `USERNAME/ai-video-studio-backend`.
3. شغّل Workflow **Sync backend** (أو ادفع تعديلاً داخل `space/`). يُنشأ الـ Space ويُرفع الكود.
4. في إعدادات الـ Space اختر العتاد **ZeroGPU** (يتطلب اشتراك HF PRO) أو أي GPU مدفوع.
5. في التطبيق: ⚙️ الإعدادات ← رابط الـ Space: `https://USERNAME-ai-video-studio-backend.hf.space` ← حفظ.

> بدون اشتراك: يمكنك وضع رابط أي Space عام لتوليد الفيديو ثم ضبط «اسم الواجهة» و«قالب المعاملات» كما تظهر في صفحته (Use via API). حصة ZeroGPU المجانية صغيرة.

## ما اختُبر وما لم يُختبر
- ✔ منطق الواجهة (البحث، التحليل، استدعاء Gradio، المعرض) اختُبر بشبكة مُحاكاة.
- ✘ لم يُجرَّب توليد فيديو حقيقي ولا نشر الـ Space ولا خدمات Pollinations/Tavily/Groq الحية. قد تحتاج أرقام إصدارات `space/requirements.txt` إلى تعديل عند أول بناء.

## الخطوات التالية المقترحة
1. صورة → فيديو (LTX image-to-video) وتمديد المشاهد.
2. سيناريو متعدد اللقطات + دمج المقاطع في المتصفح (ffmpeg.wasm).
3. تحليل الفيديو المولَّد (لقطات رئيسية + نموذج رؤية) واقتراح تحسين الـ Prompt.
4. تعليق صوتي (TTS مفتوح المصدر) وترجمة نصية.
5. وكيل بحث أعمق (عدة استعلامات + استشهادات).
