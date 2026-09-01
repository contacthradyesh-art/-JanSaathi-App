import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_STORAGE_KEY = '@jansathi/language';
const ONBOARDING_STORAGE_KEY = '@jansathi/onboarding-complete';

const LANGUAGES = [
  { code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi', placeholder: false },
  { code: 'en', nativeName: 'English', englishName: 'English', placeholder: false },
  { code: 'bho', nativeName: 'भोजपुरी', englishName: 'Bhojpuri', placeholder: true },
  { code: 'mr', nativeName: 'मराठी', englishName: 'Marathi', placeholder: true },
  { code: 'ta', nativeName: 'தமிழ்', englishName: 'Tamil', placeholder: true },
];

const ONBOARDING_CONTENT = {
  hi: [
    { icon: '🏛️', title: 'सरकारी मदद आसान बनाएं', body: 'योजनाओं और सरकारी काम की जानकारी अपनी भाषा में पाएं।' },
    { icon: '🔎', title: 'खोजें और जानें', body: 'योजना खोजें, जानकारी देखें और जरूरी दस्तावेज़ों की सूची पाएं।' },
    { icon: '🤝', title: 'शुरू करें', body: 'JanSaathi के साथ सरकारी काम आसान बनाएं।' },
  ],
  en: [
    { icon: '🏛️', title: 'Government help, made easy', body: 'Get scheme and government service information in your language.' },
    { icon: '🔎', title: 'Search and learn', body: 'Search a scheme, see details, and get the document list you need.' },
    { icon: '🤝', title: 'Get started', body: 'Make government work easier with JanSaathi.' },
  ],
};

const getContent = (language) => ONBOARDING_CONTENT[language] || ONBOARDING_CONTENT.hi;

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  useEffect(() => {
    loadAppState();
  }, []);

  const loadAppState = async () => {
    try {
      const [savedLanguage, onboardingComplete] = await Promise.all([
        AsyncStorage.getItem(LANGUAGE_STORAGE_KEY),
        AsyncStorage.getItem(ONBOARDING_STORAGE_KEY),
      ]);

      if (savedLanguage) {
        setSelectedLanguage(savedLanguage);
        setShowOnboarding(onboardingComplete !== 'true');
      }
    } catch (error) {
      console.warn('Could not load app state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectLanguage = async (language) => {
    if (language.placeholder) {
      setStatusMessage(`${language.nativeName} — coming soon`);
      return;
    }

    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language.code);
      setSelectedLanguage(language.code);
      setStatusMessage('');
      setShowOnboarding(true);
      setOnboardingStep(0);
    } catch (error) {
      setStatusMessage('Language save nahi ho payi. Please try again.');
      console.warn('Could not save language:', error);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
      setShowOnboarding(false);
    } catch (error) {
      console.warn('Could not save onboarding status:', error);
    }
  };

  const nextOnboardingStep = () => {
    if (onboardingStep === 2) {
      completeOnboarding();
      return;
    }
    setOnboardingStep((step) => step + 1);
  };

  const skipOnboarding = () => completeOnboarding();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>JanSaathi loading...</Text>
      </SafeAreaView>
    );
  }

  if (!selectedLanguage) {
    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.content}>
          <View style={styles.logoCircle} accessibilityLabel="JanSaathi logo placeholder">
            <Text style={styles.logoText}>JS</Text>
          </View>

          <Text style={styles.title}>JanSaathi</Text>
          <Text style={styles.subtitle}>Aapki sarkari madad, aapki bhasha mein</Text>
          <Text style={styles.question}>अपनी भाषा चुनें</Text>
          <Text style={styles.questionEnglish}>Choose your language</Text>

          <View style={styles.languageList}>
            {LANGUAGES.map((language) => {
              const isSelected = selectedLanguage === language.code;
              return (
                <Pressable
                  key={language.code}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected, disabled: language.placeholder }}
                  accessibilityLabel={`${language.nativeName}, ${language.englishName}`}
                  onPress={() => selectLanguage(language)}
                  style={({ pressed }) => [
                    styles.languageButton,
                    isSelected && styles.languageButtonSelected,
                    language.placeholder && styles.languageButtonPlaceholder,
                    pressed && styles.languageButtonPressed,
                  ]}
                >
                  <View style={styles.languageTextWrap}>
                    <Text style={styles.nativeName}>{language.nativeName}</Text>
                    <Text style={styles.englishName}>{language.englishName}</Text>
                  </View>
                  {language.placeholder ? (
                    <Text style={styles.comingSoon}>Soon</Text>
                  ) : (
                    <View style={[styles.radio, isSelected && styles.radioSelected]}>
                      {isSelected && <View style={styles.radioDot} />}
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.status} accessibilityLiveRegion="polite">{statusMessage}</Text>
          <Text style={styles.helperText}>बाद में Settings से भाषा बदली जा सकती है</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (showOnboarding) {
    const slides = getContent(selectedLanguage);
    const slide = slides[onboardingStep];
    const isLastStep = onboardingStep === slides.length - 1;
    const isHindi = selectedLanguage === 'hi';

    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.onboardingContent}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isHindi ? 'छोड़ें' : 'Skip'}
            onPress={skipOnboarding}
            style={styles.skipButton}
          >
            <Text style={styles.skipText}>{isHindi ? 'छोड़ें' : 'Skip'}</Text>
          </Pressable>

          <View style={styles.onboardingMain}>
            <View style={styles.illustrationCircle} accessibilityLabel={slide.title}>
              <Text style={styles.illustration}>{slide.icon}</Text>
            </View>
            <Text style={styles.onboardingTitle}>{slide.title}</Text>
            <Text style={styles.onboardingBody}>{slide.body}</Text>

            <View style={styles.dots} accessibilityLabel={`${onboardingStep + 1} of ${slides.length}`}>
              {slides.map((_, index) => (
                <View key={index} style={[styles.dot, index === onboardingStep && styles.dotActive]} />
              ))}
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isLastStep ? (isHindi ? 'शुरू करें' : 'Get started') : (isHindi ? 'आगे' : 'Next')}
            onPress={nextOnboardingStep}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
          >
            <Text style={styles.primaryButtonText}>
              {isLastStep ? (isHindi ? 'शुरू करें' : 'Get started') : (isHindi ? 'आगे' : 'Next')}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.placeholderScreen}>
        <Text style={styles.placeholderIcon}>🏠</Text>
        <Text style={styles.placeholderTitle}>{selectedLanguage === 'hi' ? 'Home' : 'Home'}</Text>
        <Text style={styles.placeholderBody}>{selectedLanguage === 'hi' ? 'Home screen अगला step है।' : 'Home screen is the next step.'}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  loadingScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#263238' },
  content: { flex: 1, width: '100%', maxWidth: 520, alignSelf: 'center', paddingHorizontal: 24, paddingTop: 36, paddingBottom: 24 },
  logoCircle: { width: 76, height: 76, borderRadius: 38, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E8F5E9', borderWidth: 2, borderColor: '#2E7D32' },
  logoText: { fontSize: 24, fontWeight: '800', color: '#1B5E20' },
  title: { marginTop: 14, textAlign: 'center', fontSize: 30, lineHeight: 36, fontWeight: '800', color: '#172018' },
  subtitle: { marginTop: 6, textAlign: 'center', fontSize: 16, lineHeight: 23, color: '#455A64' },
  question: { marginTop: 34, textAlign: 'center', fontSize: 24, lineHeight: 32, fontWeight: '700', color: '#172018' },
  questionEnglish: { marginTop: 3, textAlign: 'center', fontSize: 15, color: '#546E7A' },
  languageList: { marginTop: 22, gap: 12 },
  languageButton: { minHeight: 68, paddingHorizontal: 18, borderRadius: 14, borderWidth: 2, borderColor: '#CFD8DC', backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  languageButtonSelected: { borderColor: '#2E7D32', backgroundColor: '#F1F8F2' },
  languageButtonPlaceholder: { backgroundColor: '#FAFAFA' },
  languageButtonPressed: { opacity: 0.75 },
  languageTextWrap: { flex: 1 },
  nativeName: { fontSize: 20, lineHeight: 26, fontWeight: '700', color: '#172018' },
  englishName: { marginTop: 2, fontSize: 13, color: '#607D8B' },
  radio: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: '#90A4AE', alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: '#2E7D32' },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#2E7D32' },
  comingSoon: { fontSize: 13, fontWeight: '700', color: '#607D8B' },
  status: { minHeight: 22, marginTop: 14, textAlign: 'center', fontSize: 14, fontWeight: '600', color: '#2E7D32' },
  helperText: { marginTop: 'auto', textAlign: 'center', fontSize: 13, lineHeight: 20, color: '#607D8B' },
  onboardingContent: { flex: 1, width: '100%', maxWidth: 520, alignSelf: 'center', paddingHorizontal: 24, paddingTop: 12, paddingBottom: 24 },
  skipButton: { alignSelf: 'flex-end', minWidth: 72, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  skipText: { fontSize: 16, fontWeight: '700', color: '#546E7A' },
  onboardingMain: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 24 },
  illustrationCircle: { width: 160, height: 160, borderRadius: 80, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E8F5E9', borderWidth: 2, borderColor: '#A5D6A7' },
  illustration: { fontSize: 68 },
  onboardingTitle: { marginTop: 32, textAlign: 'center', fontSize: 27, lineHeight: 35, fontWeight: '800', color: '#172018' },
  onboardingBody: { marginTop: 12, maxWidth: 430, textAlign: 'center', fontSize: 18, lineHeight: 28, color: '#455A64' },
  dots: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 28 },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: '#CFD8DC' },
  dotActive: { width: 24, backgroundColor: '#2E7D32' },
  primaryButton: { minHeight: 60, width: '100%', borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2E7D32' },
  primaryButtonPressed: { opacity: 0.8 },
  primaryButtonText: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  placeholderScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  placeholderIcon: { fontSize: 58 },
  placeholderTitle: { marginTop: 18, fontSize: 28, fontWeight: '800', color: '#172018' },
  placeholderBody: { marginTop: 8, fontSize: 16, color: '#546E7A', textAlign: 'center' },
});
