# 🎬 AI Video Studio — استوديو توليد الصور والفيديو بالذكاء الاصطناعي

تطبيق مفتوح المصدر: **بحث في الإنترنت ← تحليل ← وصف احترافي ← توليد صورة / فيديو**.

مبني على مشاريع مفتوحة المصدر:
- [FastAPI](https://github.com/fastapi/fastapi) — الخادم
- [Hugging Face Diffusers](https://github.com/huggingface/diffusers) — التوليد المحلي (CogVideoX, SDXL-Turbo)
- [huggingface_hub](https://github.com/huggingface/huggingface_hub) — التوليد عن بُعد (FLUX, LTX-Video)
- [duckduckgo_search](https://github.com/deedy5/duckduckgo_search) — البحث في الإنترنت
- أي نموذج لغوي متوافق مع OpenAI (Ollama, vLLM...) لتحليل البحث

## الوضعان
| الوضع | المتطلبات | الاستخدام |
|---|---|---|
| `MODE=remote` (افتراضي) | مفتاح Hugging Face مجاني فقط، بدون GPU | يعمل من الهاتف / Codespaces / Space |
| `MODE=local` | بطاقة GPU (≥12GB لـ CogVideoX) | فك التعليق عن الحزم الثقيلة في `requirements.txt` |

## التشغيل
```bash
cp .env.example .env      # ضع HF_TOKEN
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 7860
```
ثم افتح `http://localhost:7860`.

## النشر على GitHub من الهاتف
1. أنشئ مستودعًا جديدًا على github.com وارفع محتوى هذا المجلد (أو من Termux):
   ```bash
   git init && git add . && git commit -m "init"
   git branch -M main
   git remote add origin https://github.com/USERNAME/ai-video-studio.git
   git push -u origin main
   ```
2. للتشغيل دون جهاز قوي: **Code → Codespaces → Create** ثم نفّذ أوامر التشغيل أعلاه.
3. للنشر الدائم: أنشئ **Hugging Face Space** من نوع Docker وارفع نفس الملفات، وأضف `HF_TOKEN` في Secrets.

## ملاحظات
- لا ترفع ملف `.env` أبدًا (محمي في `.gitignore`).
- التحقق من ترخيص كل نموذج قبل الاستخدام التجاري.
- مصادر البحث تظهر في الواجهة للتحقق منها يدويًا.

## خارطة الطريق
- [ ] دمج صوت/تعليق صوتي (Coqui TTS)
- [ ] صورة ← فيديو (Stable Video Diffusion)
- [ ] طابور مهام (Redis) وحفظ السجل
