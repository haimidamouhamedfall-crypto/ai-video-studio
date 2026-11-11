// Minimal i18n (ar / fr / en). Every key must exist in all three languages (see tests/i18n.test.js).
const D = {
  ar: {
    tab_research: 'بحث وتحليل', tab_image: 'صور', tab_video: 'فيديو', tab_library: 'المكتبة', tab_settings: 'الإعدادات',
    loading: 'جارٍ العمل…', cancel: 'إلغاء', save: 'حفظ', saved: 'تم الحفظ', download: 'تنزيل', share: 'مشاركة', delete: 'حذف', open: 'فتح', use: 'استخدم', copy: 'نسخ',
    r_title: 'ابحث في الإنترنت ثم حلّل', r_ph: 'اكتب موضوعاً أو فكرة فيديو…', r_search: '🔎 ابحث في الإنترنت',
    r_github: 'مشاريع مفتوحة المصدر (GitHub)', r_models: 'نماذج الذكاء الاصطناعي (Hugging Face)', r_wiki: 'ويكيبيديا', r_news: 'نقاشات وأخبار (Hacker News)',
    r_none: 'لا نتائج', r_failed: 'تعذر الجلب', r_analyze: '🧠 حلّل واكتب سيناريو', r_summary: 'الملخص', r_points: 'أهم النقاط', r_scenes: 'مشاهد الفيديو', r_to_video: '🎬 أرسل المشاهد إلى الفيديو',
    r_use_video: 'نموذج الفيديو', r_use_image: 'نموذج الصور', r_use_i2v: 'نموذج صورة→فيديو', r_hint: 'اكتب بالإنجليزية للمواضيع التقنية للحصول على نتائج أفضل من GitHub.',
    i_title: 'توليد الصور', i_ph: 'صف الصورة التي تريدها…', i_enhance: '✨ حسّن الوصف بالذكاء الاصطناعي', i_gen: '🖼 ولّد صورة', i_to_video: '🎞 حوّلها إلى فيديو', i_ratio: 'الأبعاد',
    v_title: 'فيديو بالذكاء الاصطناعي', v_ph: 'صف مشهد الفيديو والحركة…', v_gen: '🎬 ولّد فيديو', v_note: 'يعتمد على مزوّد خارجي ويستهلك رصيدك؛ قد يستغرق دقائق.',
    s_title: 'فيديو من مشاهد (يُجمَّع على هاتفك)', s_add: '+ مشهد', s_gen_all: '🖼 ولّد صور كل المشاهد', s_assemble: '🎞 اجمع الفيديو', s_seconds: 'ثواني لكل مشهد', s_captions: 'نص على الفيديو', s_music: 'موسيقى (اختياري)',
    s_scene: 'مشهد', s_title_ph: 'عنوان المشهد', s_narr_ph: 'النص المعروض / الشرح', s_img_ph: 'وصف الصورة (يفضّل بالإنجليزية)', s_regen: 'أعد توليد الصورة', s_empty: 'لا مشاهد بعد: أضف مشهداً أو استخدم البحث والتحليل.', s_need_images: 'ولّد صور المشاهد أولاً.', s_progress: 'تجميع',
    l_title: 'المكتبة', l_empty: 'لا يوجد محتوى محفوظ بعد.',
    st_title: 'الإعدادات', st_token: 'مفتاح Hugging Face (يُحفظ على جهازك فقط)', st_provider: 'مزوّد التشغيل', st_img: 'نموذج الصور', st_vid: 'نموذج الفيديو (نص→فيديو)', st_i2v: 'نموذج صورة→فيديو', st_chat: 'نموذج التحليل (نص)',
    st_test: 'اختبر المفتاح', st_ok: 'المفتاح صالح ✓', st_lang: 'اللغة', st_clear: 'احذف كل بياناتي', st_clear_q: 'حذف الإعدادات والمكتبة؟', st_help: 'أنشئ مفتاحاً مجانياً من huggingface.co/settings/tokens بصلاحية «Make calls to Inference Providers».',
    err_token: 'أضف مفتاح Hugging Face من الإعدادات أولاً.', err_auth: 'المفتاح غير صالح أو ينقصه الصلاحية.', err_credits: 'انتهى الرصيد المجاني للمزوّد أو تجاوزت الحد.', err_model: 'النموذج غير متاح لدى هذا المزوّد. غيّر النموذج أو المزوّد من الإعدادات.', err_generic: 'حدث خطأ', err_json: 'تعذر قراءة تحليل الذكاء الاصطناعي، حاول مرة أخرى.', err_media: 'متصفحك لا يدعم تسجيل الفيديو.'
  },
  fr: {
    tab_research: 'Recherche', tab_image: 'Images', tab_video: 'Vidéo', tab_library: 'Bibliothèque', tab_settings: 'Réglages',
    loading: 'En cours…', cancel: 'Annuler', save: 'Enregistrer', saved: 'Enregistré', download: 'Télécharger', share: 'Partager', delete: 'Supprimer', open: 'Ouvrir', use: 'Utiliser', copy: 'Copier',
    r_title: 'Recherchez sur Internet puis analysez', r_ph: 'Saisissez un sujet ou une idée de vidéo…', r_search: '🔎 Rechercher sur Internet',
    r_github: 'Projets open source (GitHub)', r_models: 'Modèles d\'IA (Hugging Face)', r_wiki: 'Wikipédia', r_news: 'Discussions et actualités (Hacker News)',
    r_none: 'Aucun résultat', r_failed: 'Échec du chargement', r_analyze: '🧠 Analyser et écrire un scénario', r_summary: 'Résumé', r_points: 'Points clés', r_scenes: 'Scènes de la vidéo', r_to_video: '🎬 Envoyer les scènes vers Vidéo',
    r_use_video: 'Modèle vidéo', r_use_image: 'Modèle image', r_use_i2v: 'Modèle image→vidéo', r_hint: 'Écrivez en anglais pour les sujets techniques afin d\'obtenir de meilleurs résultats GitHub.',
    i_title: 'Génération d\'images', i_ph: 'Décrivez l\'image souhaitée…', i_enhance: '✨ Améliorer la description (IA)', i_gen: '🖼 Générer une image', i_to_video: '🎞 En faire une vidéo', i_ratio: 'Format',
    v_title: 'Vidéo par IA', v_ph: 'Décrivez la scène et le mouvement…', v_gen: '🎬 Générer une vidéo', v_note: 'Utilise un fournisseur externe et consomme votre crédit ; peut prendre quelques minutes.',
    s_title: 'Vidéo à partir de scènes (assemblée sur votre téléphone)', s_add: '+ Scène', s_gen_all: '🖼 Générer les images de toutes les scènes', s_assemble: '🎞 Assembler la vidéo', s_seconds: 'Secondes par scène', s_captions: 'Texte sur la vidéo', s_music: 'Musique (optionnel)',
    s_scene: 'Scène', s_title_ph: 'Titre de la scène', s_narr_ph: 'Texte affiché / narration', s_img_ph: 'Description de l\'image (de préférence en anglais)', s_regen: 'Régénérer l\'image', s_empty: 'Aucune scène : ajoutez-en une ou utilisez Recherche.', s_need_images: 'Générez d\'abord les images des scènes.', s_progress: 'Assemblage',
    l_title: 'Bibliothèque', l_empty: 'Aucun contenu enregistré.',
    st_title: 'Réglages', st_token: 'Clé Hugging Face (stockée uniquement sur votre appareil)', st_provider: 'Fournisseur', st_img: 'Modèle d\'image', st_vid: 'Modèle vidéo (texte→vidéo)', st_i2v: 'Modèle image→vidéo', st_chat: 'Modèle d\'analyse (texte)',
    st_test: 'Tester la clé', st_ok: 'Clé valide ✓', st_lang: 'Langue', st_clear: 'Effacer mes données', st_clear_q: 'Supprimer réglages et bibliothèque ?', st_help: 'Créez une clé gratuite sur huggingface.co/settings/tokens avec la permission « Make calls to Inference Providers ».',
    err_token: 'Ajoutez d\'abord votre clé Hugging Face dans Réglages.', err_auth: 'Clé invalide ou permission manquante.', err_credits: 'Crédit gratuit du fournisseur épuisé ou limite dépassée.', err_model: 'Modèle indisponible chez ce fournisseur. Changez de modèle ou de fournisseur dans Réglages.', err_generic: 'Une erreur est survenue', err_json: 'Analyse IA illisible, réessayez.', err_media: 'Votre navigateur ne prend pas en charge l\'enregistrement vidéo.'
  },
  en: {
    tab_research: 'Research', tab_image: 'Images', tab_video: 'Video', tab_library: 'Library', tab_settings: 'Settings',
    loading: 'Working…', cancel: 'Cancel', save: 'Save', saved: 'Saved', download: 'Download', share: 'Share', delete: 'Delete', open: 'Open', use: 'Use', copy: 'Copy',
    r_title: 'Search the web, then analyze', r_ph: 'Type a topic or video idea…', r_search: '🔎 Search the web',
    r_github: 'Open-source projects (GitHub)', r_models: 'AI models (Hugging Face)', r_wiki: 'Wikipedia', r_news: 'Discussions & news (Hacker News)',
    r_none: 'No results', r_failed: 'Failed to load', r_analyze: '🧠 Analyze & write a script', r_summary: 'Summary', r_points: 'Key points', r_scenes: 'Video scenes', r_to_video: '🎬 Send scenes to Video',
    r_use_video: 'Video model', r_use_image: 'Image model', r_use_i2v: 'Image→video model', r_hint: 'Write in English for technical topics to get better GitHub results.',
    i_title: 'Image generation', i_ph: 'Describe the image you want…', i_enhance: '✨ Improve prompt with AI', i_gen: '🖼 Generate image', i_to_video: '🎞 Turn into video', i_ratio: 'Aspect',
    v_title: 'AI video', v_ph: 'Describe the scene and motion…', v_gen: '🎬 Generate video', v_note: 'Uses an external provider and your credits; may take minutes.',
    s_title: 'Video from scenes (assembled on your phone)', s_add: '+ Scene', s_gen_all: '🖼 Generate images for all scenes', s_assemble: '🎞 Assemble video', s_seconds: 'Seconds per scene', s_captions: 'On-screen text', s_music: 'Music (optional)',
    s_scene: 'Scene', s_title_ph: 'Scene title', s_narr_ph: 'On-screen text / narration', s_img_ph: 'Image prompt (English works best)', s_regen: 'Regenerate image', s_empty: 'No scenes yet: add one or use Research.', s_need_images: 'Generate the scene images first.', s_progress: 'Assembling',
    l_title: 'Library', l_empty: 'Nothing saved yet.',
    st_title: 'Settings', st_token: 'Hugging Face token (stored on your device only)', st_provider: 'Provider', st_img: 'Image model', st_vid: 'Video model (text→video)', st_i2v: 'Image→video model', st_chat: 'Analysis model (text)',
    st_test: 'Test token', st_ok: 'Token is valid ✓', st_lang: 'Language', st_clear: 'Erase all my data', st_clear_q: 'Delete settings and library?', st_help: 'Create a free token at huggingface.co/settings/tokens with the "Make calls to Inference Providers" permission.',
    err_token: 'Add your Hugging Face token in Settings first.', err_auth: 'Invalid token or missing permission.', err_credits: 'Provider free credits are used up or limit exceeded.', err_model: 'Model not available on this provider. Change the model or provider in Settings.', err_generic: 'Something went wrong', err_json: 'Could not read the AI analysis, try again.', err_media: 'Your browser does not support video recording.'
  }
};
export const dict = D;
export const langs = [['ar', 'العربية'], ['fr', 'Français'], ['en', 'English']];
let lang = 'ar';
try {
  const s = typeof localStorage !== 'undefined' && localStorage.getItem('avs_lang');
  const n = typeof navigator !== 'undefined' && (navigator.language || '').slice(0, 2);
  lang = D[s] ? s : (D[n] ? n : 'ar');
} catch { /* ignore */ }
export function getLang() { return lang; }
export function setLang(l) {
  if (!D[l]) return;
  lang = l;
  try { localStorage.setItem('avs_lang', l); } catch { /* ignore */ }
  if (typeof document !== 'undefined') { document.documentElement.lang = l; document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr'; }
}
export function t(k, vars) {
  let s = D[lang][k] ?? D.en[k] ?? k;
  if (vars) for (const [a, b] of Object.entries(vars)) s = s.replaceAll('{' + a + '}', b);
  return s;
}
