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
  appTagline: string;
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
};

const en: Messages = {
  appTagline: "Truth in healthcare for 1.4 Billion Indians",
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
};

const hi: Messages = {
  appTagline: "1.4 अरब भारतीयों के लिए भरोसेमंद स्वास्थ्य जानकारी",
  searchPlaceholder: "अपनी चिकित्सा जरूरत लिखें...",
  sosButton: "एसओएस इमरजेंसी",
  thinkingToggle: "एजेंट की सोच दिखाएं",
  shareButton: "शेयर करें",
  callButton: "कॉल करें",
  reportButton: "गलत जानकारी रिपोर्ट करें",
  listenButton: "इस उत्तर को सुनें",
  pinPlaceholder: "पिन कोड से खोजें",
  locationPromptTitle: "निकटतम अस्पताल खोजने के लिए लोकेशन साझा करें",
  locationPromptBody: "हम आपकी लोकेशन का उपयोग केवल पास की बेहतर स्वास्थ्य सेवाएं खोजने के लिए करते हैं।",
  allowLocation: "लोकेशन अनुमति दें",
  skip: "अभी छोड़ें",
  mapSectionTitle: "पास की सुविधाओं का मानचित्र",
  facilitiesTitle: "सुझाए गए अस्पताल",
};

const dict: Partial<Record<UiLanguage, Messages>> = {
  "en-IN": en,
  "hi-IN": hi,
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
