/**
 * SIH26083 - Unique Feature 9: Multilingual Early Warning Localization Engine
 *
 * Supports Indian regional languages: English, Hindi, Marathi, and Kannada.
 * Clean, extensible dictionary-driven architecture with string interpolation for dynamic variables.
 */

export type SupportedLanguage = 'en' | 'hi' | 'mr' | 'kn';

export type LanguageMeta = {
  code: SupportedLanguage;
  name: string;
  native_name: string;
  font_family?: string;
};

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'en', name: 'English', native_name: 'English' },
  { code: 'hi', name: 'Hindi', native_name: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', native_name: 'मराठी' },
  { code: 'kn', name: 'Kannada', native_name: 'ಕನ್ನಡ' },
];

export type TranslationKey =
  | 'platform_title'
  | 'ministry_title'
  | 'tagline'
  | 'status_normal'
  | 'status_watch'
  | 'status_warning'
  | 'status_extreme'
  | 'htss_label'
  | 'temperature'
  | 'humidity'
  | 'wbgt_label'
  | 'utci_label'
  | 'heat_index_label'
  | 'vulnerability_label'
  | 'hospital_readiness'
  | 'cooling_centers'
  | 'outdoor_workers'
  | 'what_if_simulator'
  | 'digital_twin'
  | 'risk_cascade'
  | 'heatwave_memory'
  | 'ai_assistant'
  | 'alert_extreme_title'
  | 'alert_extreme_desc'
  | 'alert_warning_title'
  | 'alert_warning_desc'
  | 'alert_watch_title'
  | 'alert_watch_desc'
  | 'worker_advisory'
  | 'citizen_advisory'
  | 'authority_advisory'
  | 'hydration_reminder';

export const TRANSLATIONS: Record<SupportedLanguage, Record<TranslationKey, string>> = {
  en: {
    platform_title: 'SIH26083 — Extreme Heatwave Intelligence Command Center',
    ministry_title: 'Ministry of Earth Sciences (MoES) | NCMRWF',
    tagline: 'Translating meteorological forecasts into localized human thermal stress intelligence',
    status_normal: 'NORMAL CONDITIONS',
    status_watch: 'HEATWATCH ACTIVE',
    status_warning: 'HEAT WARNING ACTIVE',
    status_extreme: 'CRITICAL HEATWAVE EMERGENCY',
    htss_label: 'Human Thermal Stress Score',
    temperature: 'Ambient Temperature',
    humidity: 'Relative Humidity',
    wbgt_label: 'Wet Bulb Globe Temperature (WBGT)',
    utci_label: 'Universal Thermal Climate Index (UTCI)',
    heat_index_label: 'NOAA Heat Index',
    vulnerability_label: 'Population Vulnerability',
    hospital_readiness: 'Hospital Surge Readiness',
    cooling_centers: 'Smart Cooling Centers',
    outdoor_workers: 'Outdoor Worker Safety',
    what_if_simulator: 'What-If Heat Simulator',
    digital_twin: '5-Day Heat Risk Digital Twin',
    risk_cascade: 'Heat Risk Cascade',
    heatwave_memory: 'Historical Heatwave Memory',
    ai_assistant: 'AI Heat Assistant',
    alert_extreme_title: 'CRITICAL HEATWAVE ALERT: Extreme Human Thermal Stress Expected',
    alert_extreme_desc: 'Severe biometeorological stress reaching critical physiological limits between 11:30 AM and 4:30 PM. Halt unshaded outdoor labor; activate municipal cooling shelters.',
    alert_warning_title: 'HEATWAVE WARNING: Elevated Thermal Risk for Vulnerable Populations',
    alert_warning_desc: 'High WBGT and thermal load detected. Ensure mandatory 20-minute rest intervals in shade and drink ORS fluids.',
    alert_watch_title: 'HEATWATCH ADVISORY: Approaching Elevated Thermal Stress',
    alert_watch_desc: 'Temperatures rising across urban districts. Monitor elderly citizens and avoid strenuous midday outdoor physical exertion.',
    worker_advisory: 'Mandatory Work-Rest Regimen: 20 mins rest per hour in deep shade. Drink 1L cool water/ORS hourly.',
    citizen_advisory: 'Stay indoors between 12 PM and 4 PM. Keep elders and infants hydrated. Avoid direct sun exposure.',
    authority_advisory: 'Open municipal cooling centers, stage water tankers in informal settlements, and place hospitals on surge alert.',
    hydration_reminder: 'Hydration Alert: Drink water every 20 minutes even if not feeling thirsty. Electrolytes recommended.',
  },

  hi: {
    platform_title: 'SIH26083 — चरम ग्रीष्म लहर पूर्व चेतावनी एवं थर्मल तनाव कमान केंद्र',
    ministry_title: 'पृथ्वी विज्ञान मंत्रालय (MoES) | NCMRWF',
    tagline: 'मौसम पूर्वानुमानों को सटीक मानव-स्वास्थ्य केंद्रित ताप-जोखिम खुफिया में बदलना',
    status_normal: 'सामान्य स्थिति',
    status_watch: 'ताप निगरानी सक्रिय',
    status_warning: 'उष्ण लहर चेतावनी सक्रिय',
    status_extreme: 'अति-गंभीर उष्ण लहर आपातकाल',
    htss_label: 'मानव थर्मल तनाव स्कोर (HTSS)',
    temperature: 'परिवेश का तापमान',
    humidity: 'सापेक्षिक आर्द्रता',
    wbgt_label: 'वेट बल्ब ग्लोब तापमान (WBGT)',
    utci_label: 'सार्वभौमिक थर्मल जलवायु सूचकांक (UTCI)',
    heat_index_label: 'हीट इंडेक्स (ताप सूचकांक)',
    vulnerability_label: 'जनसंख्या संवेदनशीलता',
    hospital_readiness: 'अस्पताल तत्परता स्तर',
    cooling_centers: 'स्मार्ट शीतलन केंद्र',
    outdoor_workers: 'श्रमिक कार्यस्थल सुरक्षा',
    what_if_simulator: 'व्हाट-इफ ताप सिम्युलेटर',
    digital_twin: '5-दिवसीय हीट रिस्क डिजिटल ट्विन',
    risk_cascade: 'ताप जोखिम प्रवाह (कैस्केड)',
    heatwave_memory: 'ऐतिहासिक उष्ण लहर स्मृति',
    ai_assistant: 'एआई हीट सहायक',
    alert_extreme_title: 'चरम उष्ण लहर आपातकालीन चेतावनी: अत्यधिक थर्मल तनाव संभावित',
    alert_extreme_desc: 'दोपहर 11:30 से 4:30 बजे के बीच चरम जैव-मौसम संबंधी तनाव। खुले में शारीरिक श्रम तुरंत रोकें; शीतलन केंद्र चालू करें।',
    alert_warning_title: 'उष्ण लहर चेतावनी: संवेदनशील नागरिकों के लिए उच्च जोखिम',
    alert_warning_desc: 'उच्च WBGT एवं आर्द्रता दर्ज। श्रमिकों को हर घंटे 20 मिनट छायादार विश्राम एवं ओआरएस घोल उपलब्ध कराएं।',
    alert_watch_title: 'ताप निगरानी परामर्श: तापमान में तीव्र वृद्धि',
    alert_watch_desc: 'शहरी क्षेत्रों में तापमान में वृद्धि। बुजुर्गों और बच्चों की निगरानी रखें तथा दोपहर में धूप से बचें।',
    worker_advisory: 'श्रमिक सुरक्षा नियम: प्रति घंटे 20 मिनट छायादार विश्राम अनिवार्य। प्रति घंटे 1 लीटर ठंडा पानी/ओआरएस पिएं।',
    citizen_advisory: 'दोपहर 12 से 4 बजे के बीच घर के अंदर रहें। बुजुर्गों का विशेष ध्यान रखें और पर्याप्त पानी पिएं।',
    authority_advisory: 'नगर निगम शीतलन केंद्र खोलें, झुग्गी बस्तियों में पानी के टैंकर भेजें और अस्पतालों को अलर्ट पर रखें।',
    hydration_reminder: 'जलयोजन अनुस्मारक: प्यास न लगने पर भी हर 20 मिनट में पानी पिएं। ओआरएस/इलेक्ट्रोलाइट्स का सेवन करें।',
  },

  mr: {
    platform_title: 'SIH26083 — तीव्र उष्णतेची लाट पूर्वसूचना व मानवी थर्मल ताण नियंत्रण कक्ष',
    ministry_title: 'पृथ्वी विज्ञान मंत्रालय (MoES) | NCMRWF',
    tagline: 'हवामान अंदाजाचे स्थानिक मानवी आरोग्य थर्मल जोखीम बुद्धिमत्तेत रूपांतर',
    status_normal: 'सामान्य परिस्थिती',
    status_watch: 'उष्णता दक्षता इशारा',
    status_warning: 'उष्णतेची लाट इशारा (वॉर्निंग)',
    status_extreme: 'अति-तीव्र उष्णतेची लाट आणीबाणी',
    htss_label: 'मानवी थर्मल ताण निर्देशांक (HTSS)',
    temperature: 'सभोवतालचे तापमान',
    humidity: 'हवेतील आर्द्रता',
    wbgt_label: 'वेट बल्ब ग्लोब तापमान (WBGT)',
    utci_label: 'युनिव्हर्सल थर्मल क्लायमेट इंडेक्स (UTCI)',
    heat_index_label: 'हीट इंडेक्स (उष्णता निर्देशांक)',
    vulnerability_label: 'लोकसंख्या संवेदनशीलता',
    hospital_readiness: 'रुग्णालय सज्जता स्तर',
    cooling_centers: 'स्मार्ट कुलिंग केंद्रे',
    outdoor_workers: 'बाहेरील कामगार सुरक्षा',
    what_if_simulator: 'व्हॉट-इफ उष्णता सिम्युलेटर',
    digital_twin: '५-दिवसीय हीट रिस्क डिजिटल ट्विन',
    risk_cascade: 'उष्णता जोखीम शृंखला (कॅस्केड)',
    heatwave_memory: 'ऐतिहासिक उष्णतेच्या लाटांची नोंद',
    ai_assistant: 'एआय उष्णता साहाय्यक',
    alert_extreme_title: 'अति-तीव्र उष्णतेची लाट आणीबाणी: दुपारी १२ ते ४ वेळेत तीव्र धोका',
    alert_extreme_desc: 'दुपारी १२ ते ४ या वेळेत तीव्र उष्णतेचा धोका अपेक्षित आहे. उघड्यावरील कष्टाची कामे त्वरित थांबवा; तात्पुरती कुलिंग केंद्रे सुरू करा.',
    alert_warning_title: 'उष्णतेची लाट वॉर्निंग: संवेदनशील नागरिकांसाठी उच्च जोखीम',
    alert_warning_desc: 'उच्च WBGT नोंदवले गेले आहे. बाहेरील कामगारांना सावलीत विश्रांती व ओआरएस पाणी उपलब्ध करून द्या.',
    alert_watch_title: 'उष्णता दक्षता सल्ला: तापमान वाढीचा कल',
    alert_watch_desc: 'तापमानात वाढ होत आहे. वृद्ध व्यक्तींची काळजी घ्या आणि दुपारच्या वेळी थेट सूर्यप्रकाश टाळा.',
    worker_advisory: 'कामगार सुरक्षा सूचना: दर तासाला २० मिनिटे सावलीत विश्रांती घ्या. तासाला १ लिटर पाणी किंवा ओआरएस प्या.',
    citizen_advisory: 'दुपारी १२ ते ४ दरम्यान घरातच राहा. पुरेसे पाणी प्या आणि लहान मुले व वृद्धांची काळजी घ्या.',
    authority_advisory: 'महापालिकेने तात्पुरती कुलिंग केंद्रे उघडावीत, वस्त्यांमध्ये पाण्याचे टँकर पाठवावेत आणि रुग्णालयांना सज्ज ठेवावे.',
    hydration_reminder: 'पाणी पिण्याची आठवण: तहान लागली नसली तरीही दर २० मिनिटांनी पाणी प्या. लिंबू सरबत किंवा ओआरएस घ्या.',
  },

  kn: {
    platform_title: 'SIH26083 — ತೀವ್ರ ಶಾಖದ ಅಲೆ ಮುನ್ನೆಚ್ಚರಿಕೆ ಮತ್ತು ಥರ್ಮಲ್ ಒತ್ತಡ ನಿಯಂತ್ರಣ ಕೇಂದ್ರ',
    ministry_title: 'ಭೂ ವಿಜ್ಞಾನ ಸಚಿವಾಲಯ (MoES) | NCMRWF',
    tagline: 'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆಗಳನ್ನು ಸ್ಥಳೀಯ ಮಾನವ ಆರೋಗ್ಯ ಶಾಖ-ಅಪಾಯ ಮಾಹಿತಿಯಾಗಿ ಪರಿವರ್ತಿಸುವುದು',
    status_normal: 'ಸಾಮಾನ್ಯ ಪರಿಸ್ಥಿತಿ',
    status_watch: 'ಶಾಖ ನಿಗಾ ಸಕ್ರಿಯ',
    status_warning: 'ಶಾಖದ ಅಲೆ ಎಚ್ಚರಿಕೆ ಸಕ್ರಿಯ',
    status_extreme: 'ತೀವ್ರ ಶಾಖದ ಅಲೆ ತುರ್ತುಸ್ಥಿತಿ',
    htss_label: 'ಮಾನವ ಥರ್ಮಲ್ ಒತ್ತಡ ಸೂಚ್ಯಂಕ (HTSS)',
    temperature: 'ತಾಪಮಾನ',
    humidity: 'ಆರ್ದ್ರತೆ',
    wbgt_label: 'ವೆಟ್ ಬಲ್ಬ್ ಗ್ಲೋಬ್ ತಾಪಮಾನ (WBGT)',
    utci_label: 'ಯುಟಿ dasಿಐ (UTCI)',
    heat_index_label: 'ಹೀಟ್ ಇಂಡೆಕ್ಸ್',
    vulnerability_label: 'ಜನಸಂಖ್ಯೆಯ ಸಂವೇದನಾಶೀಲತೆ',
    hospital_readiness: 'ಆಸ್ಪತ್ರೆ ಸನ್ನದ್ಧತೆ ಮಟ್ಟ',
    cooling_centers: 'ಸ್ಮಾರ್ಟ್ ಕೂಲಿಂಗ್ ಕೇಂದ್ರಗಳು',
    outdoor_workers: 'ಹೊರಾಂಗಣ ಕಾರ್ಮಿಕರ ಸುರಕ್ಷತೆ',
    what_if_simulator: 'ವಾಟ್-ಇಫ್ ಶಾಖ ಸಿಮ್ಯುಲೇಟರ್',
    digital_twin: '೫ ದಿನಗಳ ಹೀಟ್ ರಿಸ್ಕ್ ಡಿಜಿಟಲ್ ಟ್ವಿನ್',
    risk_cascade: 'ಶಾಖದ ಅಪಾಯದ ಸರಣಿ (ಕ್ಯಾಸ್ಕೇಡ್)',
    heatwave_memory: 'ಐತಿಹಾಸಿಕ ಶಾಖದ ಅಲೆಗಳ ದಾಖಲೆ',
    ai_assistant: 'ಎಐ ಶಾಖ ಸಹಾಯಕ',
    alert_extreme_title: 'ತೀವ್ರ ಶಾಖದ ಅಲೆಯ ತುರ್ತು ಎಚ್ಚರಿಕೆ: ಮಧ್ಯಾಹ್ನ ೧೨ ರಿಂದ ೪ ರವರೆಗೆ ತೀವ್ರ ಅಪಾಯ',
    alert_extreme_desc: 'ಮಧ್ಯಾಹ್ನ ೧೨ ರಿಂದ ೪ ರವರೆಗೆ ತೀವ್ರ ಶಾಖದ ಅಪಾಯ ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ. ಹೊರಾಂಗಣ ಕಠಿಣ ಕೆಲಸಗಳನ್ನು ನಿಲ್ಲಿಸಿ; ತಂಪಾದ ಆಶ್ರಯ ಕೇಂದ್ರಗಳನ್ನು ತೆರೆಯಿರಿ.',
    alert_warning_title: 'ಶಾಖದ ಅಲೆ ಎಚ್ಚರಿಕೆ: ದುರ್ಬಲ ಜನರಿಗೆ ಹೆಚ್ಚಿನ ಅಪಾಯ',
    alert_warning_desc: 'ಹೆಚ್ಚಿನ WBGT ಮತ್ತು ಶಾಖದ ಹೊರೆ ಕಂಡುಬಂದಿದೆ. ನೆರಳಿನಲ್ಲಿ ಕಡ್ಡಾಯ ವಿಶ್ರಾಂತಿ ಮತ್ತು ಓಆರ್‌ಎಸ್ ನೀರನ್ನು ಒದಗಿಸಿ.',
    alert_watch_title: 'ಶಾಖ ನಿಗಾ ಸಲಹೆ: ಹೆಚ್ಚುತ್ತಿರುವ ತಾಪಮಾನ',
    alert_watch_desc: 'ತಾಪಮಾನ ಹೆಚ್ಚುತ್ತಿದೆ. ಹಿರಿಯ ನಾಗರಿಕರನ್ನು ನೋಡಿಕೊಳ್ಳಿ ಮತ್ತು ಮಧ್ಯಾಹ್ನದ ಬಿಸಿಲನ್ನು ತಪ್ಪಿಸಿ.',
    worker_advisory: 'ಕಾರ್ಮಿಕರ ಸುರಕ್ಷತೆ: ಪ್ರತಿ ಗಂಟೆಗೆ ೨೦ ನಿಮಿಷ ನೆರಳಿನಲ್ಲಿ ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ. ಗಂಟೆಗೆ ೧ ಲೀಟರ್ ತಣ್ಣೀರು ಅಥವಾ ಓಆರ್‌ಎಸ್ ಕುಡಿಯಿರಿ.',
    citizen_advisory: 'ಮಧ್ಯಾಹ್ನ ೧೨ ರಿಂದ ೪ ರವರೆಗೆ ಮನೆಯೊಳಗೆ ಇರಿ. ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ ಮತ್ತು ಮಕ್ಕಳು ಹಾಗೂ ವೃದ್ಧರನ್ನು ರಕ್ಷಿಸಿ.',
    authority_advisory: 'ಪಾಲಿಕೆಯು ಕೂಲಿಂಗ್ ಕೇಂದ್ರಗಳನ್ನು ತೆರೆಯಬೇಕು, ನೀರು ಸರಬರಾಜು ಮಾಡಬೇಕು ಮತ್ತು ಆಸ್ಪತ್ರೆಗಳನ್ನು ಸನ್ನದ್ಧವಾಗಿಡಬೇಕು.',
    hydration_reminder: 'ದ್ರವಾಹಾರ ಜ್ಞಾಪನೆ: ಬಾಯಾರಿಕೆ ಇಲ್ಲದಿದ್ದರೂ ಪ್ರತಿ ೨೦ ನಿಮಿಷಗಳಿಗೊಮ್ಮೆ ನೀರು ಕುಡಿಯಿರಿ.',
  },
};

/**
 * Returns localized string for a given key and language.
 */
export function t(key: TranslationKey, lang: SupportedLanguage = 'en'): string {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return dict[key] || TRANSLATIONS.en[key] || key;
}

/**
 * Generates formatted localized public advisory for outdoor workers and citizens.
 */
export function generateLocalizedAdvisory(
  location: string,
  htssScore: number,
  peakHours: string,
  lang: SupportedLanguage = 'en'
): {
  headline: string;
  body: string;
  recommended_actions: string[];
  sms_template: string;
} {
  if (lang === 'mr') {
    return {
      headline: `[${location}] तीव्र उष्णतेची लाट इशारा (HTSS: ${htssScore.toFixed(0)}/100)`,
      body: `हवामान अंदाजानुसार ${location} मध्ये ${peakHours} दरम्यान तीव्र मानवी थर्मल ताण जाणवेल. उघड्यावरील कष्टाची कामे टाळावीत.`,
      recommended_actions: [
        'दुपारी १२ ते ४ थेट उन्हात जाणे टाळा.',
        'दर २० मिनिटांनी ओआरएस, लिंबू पाणी किंवा ताक प्या.',
        'अशक्तपणा किंवा चक्कर आल्यास तात्काळ जवळच्या महापालिका कुलिंग केंद्रात जा.',
      ],
      sms_template: `[उष्णता इशारा - ${location}]: दुपारी ${peakHours} तीव्र उष्णतेची लाट अपेक्षित. भरपूर पाणी प्या, उन्हात जाणे टाळा. आणीबाणीसाठी 108 डायल करा.`,
    };
  }

  if (lang === 'hi') {
    return {
      headline: `[${location}] उष्ण लहर चेतावनी (HTSS: ${htssScore.toFixed(0)}/100)`,
      body: `${location} में ${peakHours} के दौरान गंभीर थर्मल तनाव की संभावना है। दोपहर में धूप में निकलने से बचें।`,
      recommended_actions: [
        'दोपहर 12 से 4 बजे के बीच घर से बाहर न निकलें।',
        'हर 20 मिनट में ओआरएस, नींबू पानी या छाछ पिएं।',
        'चक्कर आने या घबराहट होने पर तुरंत निकटतम शीतलन केंद्र में जाएं।',
      ],
      sms_template: `[उष्ण लहर अलर्ट - ${location}]: दोपहर ${peakHours} में भीषण गर्मी। भरपूर पानी पिएं, धूप से बचें। आपातकाल में 108 पर कॉल करें।`,
    };
  }

  if (lang === 'kn') {
    return {
      headline: `[${location}] ತೀವ್ರ ಶಾಖದ ಅಲೆ ಎಚ್ಚರಿಕೆ (HTSS: ${htssScore.toFixed(0)}/100)`,
      body: `${location} ನಲ್ಲಿ ${peakHours} ರವರೆಗೆ ತೀವ್ರ ಶಾಖದ ಒತ್ತಡ ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ. ಬಿಸಿಲಿನಲ್ಲಿ ಓಡಾಡುವುದನ್ನು ತಪ್ಪಿಸಿ.`,
      recommended_actions: [
        'ಮಧ್ಯಾಹ್ನ ೧೨ ರಿಂದ ೪ ರವರೆಗೆ ಹೊರಗೆ ಹೋಗಬೇಡಿ.',
        'ಪ್ರತಿ ೨೦ ನಿಮಿಷಗಳಿಗೊಮ್ಮೆ ನೀರು ಅಥವಾ ಓಆರ್‌ಎಸ್ ದ್ರವ ಕುಡಿಯಿರಿ.',
        'ತಲೆತಿರುಗುವಿಕೆ ಉಂಟಾದರೆ ತಕ್ಷಣವೇ ಹತ್ತಿರದ ಕೂಲಿಂಗ್ ಕೇಂದ್ರಕ್ಕೆ ಭೇಟಿ ನೀಡಿ.',
      ],
      sms_template: `[ಶಾಖದ ಎಚ್ಚರಿಕೆ - ${location}]: ಮಧ್ಯಾಹ್ನ ${peakHours} ತೀವ್ರ ಶಾಖದ ಮುನ್ಸೂಚನೆ. ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ. ತುರ್ತುಸ್ಥಿತಿಗೆ 108 ಕರೆ ಮಾಡಿ.`,
    };
  }

  // Default English
  return {
    headline: `[${location}] Heatwave Warning Advisory (HTSS: ${htssScore.toFixed(0)}/100)`,
    body: `Extreme human thermal stress forecasted for ${location} between ${peakHours}. Evaporative perspiration limit constrained.`,
    recommended_actions: [
      'Reschedule heavy outdoor manual labor outside peak solar hours (11:30 AM - 4:30 PM).',
      'Consume 1 liter of cool water with electrolytes or ORS every hour.',
      'Seek immediate shaded shelter or municipal misting cooling centers if dizziness occurs.',
    ],
    sms_template: `[HEAT ALERT - ${location}]: Critical thermal stress expected ${peakHours}. Drink water frequently, stay in shade. Dial 108 for medical help.`,
  };
}
