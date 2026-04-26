export type UiLanguage =
  | "en-IN"
  | "hi-IN"
  | "bn-IN"
  | "te-IN"
  | "ta-IN"
  | "mr-IN"
  | "gu-IN"
  | "kn-IN"
  | "ml-IN";

type Messages = {
  home: string;
  trustMap: string;
  desertAnalysis: string;
  howItWorks: string;
  brandSubtitle: string;
  appTagline: string;
  heroHighlight: string;
  heroSubtitle: string;
  searchPlaceholder: string;
  sosButton: string;
  thinkingToggle: string;
  shareButton: string;
  callButton: string;
  reportButton: string;
  listenButton: string;
  pinPlaceholder: string;
  locationPromptTitle: string;
  locationPromptBody: string;
  allowLocation: string;
  skip: string;
  mapSectionTitle: string;
  facilitiesTitle: string;
  interfaceLanguage: string;
  madeForBharat: string;
  analysis: string;
  sourcesLabel: string;
  showFullResponse: string;
  unknownLocation: string;
  facilityTypes: {
    hospital: string;
    clinic: string;
    diagnostic: string;
    pharmacy: string;
  };
};

const en: Messages = {
  home: "Home",
  trustMap: "Trust Map",
  desertAnalysis: "Desert Analysis",
  howItWorks: "How It Works",
  brandSubtitle: "Truth in Healthcare",
  appTagline: "Truth in healthcare for 1.4 Billion Indians",
  heroHighlight: "1.4 Billion Indians",
  heroSubtitle:
    "Ask in any Indian language. Get verified facilities, trust scores, and contradiction alerts backed by Databricks.",
  searchPlaceholder: "Describe your medical need...",
  sosButton: "SOS Emergency",
  thinkingToggle: "Show Agent Thinking",
  shareButton: "Share",
  callButton: "Call",
  reportButton: "Report inaccuracy",
  listenButton: "Listen to this response",
  pinPlaceholder: "Search by PIN code",
  locationPromptTitle: "Share your location to find the nearest hospitals",
  locationPromptBody: "We use your location only to find better nearby healthcare options.",
  allowLocation: "Allow location",
  skip: "Skip for now",
  mapSectionTitle: "Nearby facilities map",
  facilitiesTitle: "Preferred hospitals",
  interfaceLanguage: "Interface language",
  madeForBharat: "Truth in healthcare · Made for Bharat",
  analysis: "Analysis",
  sourcesLabel: "Sources",
  showFullResponse: "Show full response",
  unknownLocation: "Location unavailable",
  facilityTypes: {
    hospital: "Hospital",
    clinic: "Clinic",
    diagnostic: "Diagnostic",
    pharmacy: "Pharmacy",
  },
};

const hi: Messages = {
  home: "होम",
  trustMap: "ट्रस्ट मैप",
  desertAnalysis: "डेजर्ट विश्लेषण",
  howItWorks: "कैसे काम करता है",
  brandSubtitle: "स्वास्थ्य में भरोसा",
  appTagline: "1.4 अरब भारतीयों के लिए भरोसेमंद स्वास्थ्य जानकारी",
  heroHighlight: "1.4 अरब भारतीय",
  heroSubtitle:
    "किसी भी भारतीय भाषा में पूछें। सत्यापित सुविधाएं, ट्रस्ट स्कोर और विरोधाभास अलर्ट पाएं।",
  searchPlaceholder: "अपनी चिकित्सा जरूरत लिखें...",
  sosButton: "एसओएस इमरजेंसी",
  thinkingToggle: "एजेंट की सोच दिखाएं",
  shareButton: "शेयर करें",
  callButton: "कॉल करें",
  reportButton: "गलत जानकारी रिपोर्ट करें",
  listenButton: "इस उत्तर को सुनें",
  pinPlaceholder: "पिन कोड से खोजें",
  locationPromptTitle: "निकटतम अस्पताल खोजने के लिए लोकेशन साझा करें",
  locationPromptBody:
    "हम आपकी लोकेशन का उपयोग केवल पास की बेहतर स्वास्थ्य सेवाएं खोजने के लिए करते हैं।",
  allowLocation: "लोकेशन अनुमति दें",
  skip: "अभी छोड़ें",
  mapSectionTitle: "पास की सुविधाओं का मानचित्र",
  facilitiesTitle: "सुझाए गए अस्पताल",
  interfaceLanguage: "इंटरफेस भाषा",
  madeForBharat: "स्वास्थ्य में भरोसा · भारत के लिए",
  analysis: "विश्लेषण",
  sourcesLabel: "स्रोत",
  showFullResponse: "पूरा उत्तर दिखाएं",
  unknownLocation: "स्थान उपलब्ध नहीं",
  facilityTypes: {
    hospital: "अस्पताल",
    clinic: "क्लिनिक",
    diagnostic: "डायग्नोस्टिक",
    pharmacy: "फार्मेसी",
  },
};

const bn: Messages = {
  ...en,
  home: "হোম",
  trustMap: "ট্রাস্ট ম্যাপ",
  desertAnalysis: "ডেজার্ট বিশ্লেষণ",
  howItWorks: "কীভাবে কাজ করে",
  brandSubtitle: "স্বাস্থ্যসেবায় সত্য",
  appTagline: "১.৪ বিলিয়ন ভারতীয়ের জন্য বিশ্বস্ত স্বাস্থ্য তথ্য",
  heroHighlight: "১.৪ বিলিয়ন ভারতীয়",
  heroSubtitle:
    "যেকোনো ভারতীয় ভাষায় জিজ্ঞাসা করুন। যাচাইকৃত হাসপাতাল, ট্রাস্ট স্কোর ও সতর্কতা পান।",
  searchPlaceholder: "আপনার চিকিৎসার প্রয়োজন লিখুন...",
  sosButton: "এসওএস জরুরি",
  thinkingToggle: "এজেন্টের চিন্তা দেখান",
  pinPlaceholder: "পিন কোড দিয়ে খুঁজুন",
  interfaceLanguage: "ইন্টারফেস ভাষা",
  madeForBharat: "স্বাস্থ্যসেবায় সত্য · ভারতের জন্য",
  analysis: "বিশ্লেষণ",
};

const te: Messages = {
  ...en,
  home: "హోమ్",
  trustMap: "ట్రస్ట్ మ్యాప్",
  desertAnalysis: "డెజర్ట్ విశ్లేషణ",
  howItWorks: "ఎలా పనిచేస్తుంది",
  appTagline: "1.4 బిలియన్ భారతీయులకు నమ్మదగిన ఆరోగ్య సమాచారం",
  heroHighlight: "1.4 బిలియన్ భారతీయులు",
  heroSubtitle:
    "ఏ భారతీయ భాషలోనైనా అడగండి. ధృవీకరించిన సౌకర్యాలు, ట్రస్ట్ స్కోర్లు మరియు హెచ్చరికలు పొందండి.",
  searchPlaceholder: "మీ వైద్య అవసరాన్ని రాయండి...",
  sosButton: "SOS అత్యవసరం",
  thinkingToggle: "ఏజెంట్ ఆలోచన చూపించు",
  pinPlaceholder: "పిన్ కోడ్‌తో వెతకండి",
  interfaceLanguage: "ఇంటర్ఫేస్ భాష",
  analysis: "విశ్లేషణ",
};

const ta: Messages = {
  ...en,
  home: "முகப்பு",
  trustMap: "நம்பிக்கை வரைபடம்",
  desertAnalysis: "பாலைவன பகுப்பாய்வு",
  howItWorks: "இது எப்படி வேலை செய்கிறது",
  appTagline: "1.4 பில்லியன் இந்தியர்களுக்கான நம்பகமான சுகாதார தகவல்",
  heroHighlight: "1.4 பில்லியன் இந்தியர்கள்",
  heroSubtitle:
    "எந்த இந்திய மொழியிலும் கேளுங்கள். சரிபார்க்கப்பட்ட மருத்துவமனைகள், நம்பிக்கை மதிப்பெண்கள் மற்றும் எச்சரிக்கைகள் பெறுங்கள்.",
  searchPlaceholder: "உங்கள் மருத்துவ தேவையை எழுதுங்கள்...",
  sosButton: "SOS அவசரம்",
  thinkingToggle: "முகவர் சிந்தனையை காட்டு",
  pinPlaceholder: "பின் கோடு மூலம் தேடு",
  interfaceLanguage: "இடைமுக மொழி",
  analysis: "பகுப்பாய்வு",
};

const mr: Messages = {
  ...hi,
  home: "मुख्यपृष्ठ",
  trustMap: "ट्रस्ट मॅप",
  desertAnalysis: "डेजर्ट विश्लेषण",
  howItWorks: "कसे कार्य करते",
  searchPlaceholder: "तुमची वैद्यकीय गरज लिहा...",
  sosButton: "SOS आपत्कालीन",
  thinkingToggle: "एजंटचे विचार दाखवा",
  pinPlaceholder: "पिन कोडने शोधा",
  interfaceLanguage: "इंटरफेस भाषा",
  analysis: "विश्लेषण",
};

const gu: Messages = {
  ...en,
  home: "હોમ",
  trustMap: "ટ્રસ્ટ મેપ",
  desertAnalysis: "ડેઝર્ટ વિશ્લેષણ",
  howItWorks: "કેવી રીતે કામ કરે છે",
  appTagline: "1.4 અબજ ભારતીયો માટે વિશ્વસનીય આરોગ્ય માહિતી",
  heroHighlight: "1.4 અબજ ભારતીયો",
  heroSubtitle: "કોઈપણ ભારતીય ભાષામાં પૂછો. ચકાસેલી સુવિધાઓ, ટ્રસ્ટ સ્કોર અને ચેતવણીઓ મેળવો.",
  searchPlaceholder: "તમારી તબીબી જરૂરિયાત લખો...",
  sosButton: "SOS ઇમરજન્સી",
  thinkingToggle: "એજન્ટ વિચાર બતાવો",
  pinPlaceholder: "પિન કોડથી શોધો",
  interfaceLanguage: "ઇન્ટરફેસ ભાષા",
  analysis: "વિશ્લેષણ",
};

const kn: Messages = {
  ...en,
  home: "ಮುಖಪುಟ",
  trustMap: "ಟ್ರಸ್ಟ್ ಮ್ಯಾಪ್",
  desertAnalysis: "ಡೆಸರ್ಟ್ ವಿಶ್ಲೇಷಣೆ",
  howItWorks: "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
  appTagline: "1.4 ಬಿಲಿಯನ್ ಭಾರತೀಯರಿಗೆ ವಿಶ್ವಾಸಾರ್ಹ ಆರೋಗ್ಯ ಮಾಹಿತಿ",
  heroHighlight: "1.4 ಬಿಲಿಯನ್ ಭಾರತೀಯರು",
  heroSubtitle:
    "ಯಾವುದೇ ಭಾರತೀಯ ಭಾಷೆಯಲ್ಲಿ ಕೇಳಿ. ಪರಿಶೀಲಿಸಿದ ಸೌಲಭ್ಯಗಳು, ಟ್ರಸ್ಟ್ ಸ್ಕೋರ್ ಮತ್ತು ಎಚ್ಚರಿಕೆಗಳನ್ನು ಪಡೆಯಿರಿ.",
  searchPlaceholder: "ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ಅಗತ್ಯವನ್ನು ಬರೆಯಿರಿ...",
  sosButton: "SOS ತುರ್ತು",
  thinkingToggle: "ಏಜೆಂಟ್ ಆಲೋಚನೆ ತೋರಿಸಿ",
  pinPlaceholder: "PIN ಕೋಡ್ ಮೂಲಕ ಹುಡುಕಿ",
  interfaceLanguage: "ಇಂಟರ್ಫೇಸ್ ಭಾಷೆ",
  analysis: "ವಿಶ್ಲೇಷಣೆ",
};

const ml: Messages = {
  ...en,
  home: "ഹോം",
  trustMap: "ട്രസ്റ്റ് മാപ്പ്",
  desertAnalysis: "ഡെസേർട്ട് വിശകലനം",
  howItWorks: "എങ്ങനെ പ്രവർത്തിക്കുന്നു",
  appTagline: "1.4 ബില്യൺ ഇന്ത്യൻ ജനങ്ങൾക്ക് വിശ്വസനീയ ആരോഗ്യ വിവരം",
  heroHighlight: "1.4 ബില്യൺ ഇന്ത്യക്കാർ",
  heroSubtitle:
    "ഏത് ഇന്ത്യൻ ഭാഷയിലും ചോദിക്കൂ. പരിശോധിച്ച സൗകര്യങ്ങൾ, ട്രസ്റ്റ് സ്കോർ, മുന്നറിയിപ്പുകൾ ലഭിക്കും.",
  searchPlaceholder: "നിങ്ങളുടെ മെഡിക്കൽ ആവശ്യം എഴുതൂ...",
  sosButton: "SOS അടിയന്തിരം",
  thinkingToggle: "ഏജന്റ് ചിന്ത കാണിക്കുക",
  pinPlaceholder: "PIN കോഡ് ഉപയോഗിച്ച് തിരയൂ",
  interfaceLanguage: "ഇന്റർഫേസ് ഭാഷ",
  analysis: "വിശകലനം",
};

const dict: Record<UiLanguage, Messages> = {
  "en-IN": en,
  "hi-IN": hi,
  "bn-IN": bn,
  "te-IN": te,
  "ta-IN": ta,
  "mr-IN": mr,
  "gu-IN": gu,
  "kn-IN": kn,
  "ml-IN": ml,
};

export const UI_LANGUAGES: Array<{ code: UiLanguage; label: string }> = [
  { code: "en-IN", label: "English" },
  { code: "hi-IN", label: "हिंदी" },
  { code: "bn-IN", label: "বাংলা" },
  { code: "te-IN", label: "తెలుగు" },
  { code: "ta-IN", label: "தமிழ்" },
  { code: "mr-IN", label: "मराठी" },
  { code: "gu-IN", label: "ગુજરાતી" },
  { code: "kn-IN", label: "ಕನ್ನಡ" },
  { code: "ml-IN", label: "മലയാളം" },
];

export function t(lang: string): Messages {
  return dict[lang as UiLanguage] ?? en;
}
