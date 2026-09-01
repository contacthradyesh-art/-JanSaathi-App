import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import schemes from './04-Data/schemes.json';

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
const CATEGORIES = [
  { id: 'Food', icon: '🍚', hi: 'राशन कार्ड', en: 'Ration Card' },
  { id: 'Identity', icon: '🪪', hi: 'आधार', en: 'Aadhaar' },
  { id: 'Pension', icon: '👵', hi: 'पेंशन', en: 'Pension' },
  { id: 'Certificates', icon: '📜', hi: 'प्रमाण पत्र', en: 'Certificates' },
  { id: 'Housing', icon: '🏠', hi: 'आवास', en: 'Housing' },
  { id: 'Farmer', icon: '🌾', hi: 'किसान', en: 'Farmer' },
  { id: 'Education', icon: '🎓', hi: 'शिक्षा', en: 'Education' },
  { id: 'Worker', icon: '👷', hi: 'श्रमिक', en: 'Worker' },
];
const getLocalizedScheme = (scheme, language) => scheme.languageText?.[language] || scheme.languageText?.en || scheme;

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [screen, setScreen] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState(null);

  useEffect(() => { loadAppState(); }, []);
  const loadAppState = async () => {
    try {
      const [savedLanguage, onboardingComplete] = await Promise.all([
        AsyncStorage.getItem(LANGUAGE_STORAGE_KEY), AsyncStorage.getItem(ONBOARDING_STORAGE_KEY),
      ]);
      if (savedLanguage) { setSelectedLanguage(savedLanguage); setShowOnboarding(onboardingComplete !== 'true'); }
    } catch (error) { console.warn('Could not load app state:', error); }
    finally { setIsLoading(false); }
  };
  const selectLanguage = async (language) => {
    if (language.placeholder) { setStatusMessage(`${language.nativeName} — coming soon`); return; }
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language.code);
      setSelectedLanguage(language.code); setStatusMessage(''); setShowOnboarding(true); setOnboardingStep(0);
    } catch (error) { setStatusMessage('Language save nahi ho payi. Please try again.'); }
  };
  const completeOnboarding = async () => {
    try { await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'true'); setShowOnboarding(false); setScreen('home'); }
    catch (error) { console.warn('Could not save onboarding status:', error); }
  };
  const filteredSchemes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return schemes.filter((scheme) => {
      const localized = getLocalizedScheme(scheme, selectedLanguage);
      const matchesCategory = !selectedCategory || scheme.category === selectedCategory;
      if (!query) return matchesCategory;
      const searchable = [localized.name, localized.shortDescription, scheme.name, scheme.category, scheme.id].join(' ').toLowerCase();
      return matchesCategory && searchable.includes(query);
    });
  }, [searchQuery, selectedCategory, selectedLanguage]);
  const openSearch = () => { setSelectedCategory(null); setSearchQuery(''); setScreen('search'); };
  const openCategory = (category) => { setSelectedCategory(category.id); setSearchQuery(''); setScreen('search'); };
  const openScheme = (scheme) => { setSelectedScheme(scheme); setScreen('detail'); };

  if (isLoading) return <SafeAreaView style={styles.loadingScreen}><StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" /><ActivityIndicator size="large" /><Text style={styles.loadingText}>JanSaathi loading...</Text></SafeAreaView>;
  if (!selectedLanguage) return <LanguageSelection onSelect={selectLanguage} statusMessage={statusMessage} />;
  if (showOnboarding) {
    const slides = ONBOARDING_CONTENT[selectedLanguage] || ONBOARDING_CONTENT.hi;
    const slide = slides[onboardingStep]; const isLastStep = onboardingStep === slides.length - 1; const hi = selectedLanguage === 'hi';
    return <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.onboardingContent}>
        <Pressable accessibilityRole="button" onPress={completeOnboarding} style={styles.skipButton}><Text style={styles.skipText}>{hi ? 'छोड़ें' : 'Skip'}</Text></Pressable>
        <View style={styles.onboardingMain}>
          <View style={styles.illustrationCircle}><Text style={styles.illustration}>{slide.icon}</Text></View>
          <Text style={styles.onboardingTitle}>{slide.title}</Text><Text style={styles.onboardingBody}>{slide.body}</Text>
          <View style={styles.dots}>{slides.map((_, index) => <View key={index} style={[styles.dot, index === onboardingStep && styles.dotActive]} />)}</View>
        </View>
        <Pressable accessibilityRole="button" onPress={() => isLastStep ? completeOnboarding() : setOnboardingStep((step) => step + 1)} style={styles.primaryButton}><Text style={styles.primaryButtonText}>{isLastStep ? (hi ? 'शुरू करें' : 'Get started') : (hi ? 'आगे' : 'Next')}</Text></Pressable>
      </View>
    </SafeAreaView>;
  }
  if (screen === 'home') return <HomeScreen language={selectedLanguage} onSearch={openSearch} onCategory={openCategory} />;
  if (screen === 'search') return <SearchScreen language={selectedLanguage} query={searchQuery} setQuery={setSearchQuery} results={filteredSchemes} selectedCategory={selectedCategory} onBack={() => setScreen('home')} onResult={openScheme} />;
  const localized = selectedScheme ? getLocalizedScheme(selectedScheme, selectedLanguage) : {};
  return <SafeAreaView style={styles.screen}><StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" /><View style={styles.detailPlaceholder}><Pressable onPress={() => setScreen('search')} style={styles.backButton}><Text style={styles.backText}>‹ {selectedLanguage === 'hi' ? 'वापस' : 'Back'}</Text></Pressable><Text style={styles.detailIcon}>{selectedScheme?.icon || '📄'}</Text><Text style={styles.detailTitle}>{localized.name}</Text><Text style={styles.placeholderLabel}>{selectedLanguage === 'hi' ? 'पूरी जानकारी अगला step है।' : 'Full scheme details are the next step.'}</Text></View></SafeAreaView>;
}

function LanguageSelection({ onSelect, statusMessage }) { return <SafeAreaView style={styles.screen}><StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" /><View style={styles.content}><View style={styles.logoCircle}><Text style={styles.logoText}>JS</Text></View><Text style={styles.title}>JanSaathi</Text><Text style={styles.subtitle}>Aapki sarkari madad, aapki bhasha mein</Text><Text style={styles.question}>अपनी भाषा चुनें</Text><Text style={styles.questionEnglish}>Choose your language</Text><View style={styles.languageList}>{LANGUAGES.map((language) => <Pressable key={language.code} accessibilityRole="button" onPress={() => onSelect(language)} style={styles.languageButton}><View style={styles.languageTextWrap}><Text style={styles.nativeName}>{language.nativeName}</Text><Text style={styles.englishName}>{language.englishName}</Text></View><Text style={styles.comingSoon}>{language.placeholder ? 'Soon' : '›'}</Text></Pressable>)}</View><Text style={styles.status}>{statusMessage}</Text></View></SafeAreaView>; }

function HomeScreen({ language, onSearch, onCategory }) { const hi = language === 'hi'; return <SafeAreaView style={styles.screen}><StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" /><ScrollView contentContainerStyle={styles.homeContent}><View style={styles.homeHeader}><View><Text style={styles.homeGreeting}>{hi ? 'नमस्ते 👋' : 'Namaste 👋'}</Text><Text style={styles.homeTitle}>JanSaathi</Text></View><View style={styles.smallLogo}><Text style={styles.smallLogoText}>JS</Text></View></View><Text style={styles.homeQuestion}>{hi ? 'आज क्या करना है?' : 'What do you need today?'}</Text><Pressable onPress={onSearch} style={styles.searchBar} accessibilityRole="button"><Text style={styles.searchIcon}>⌕</Text><Text style={styles.searchPlaceholder}>{hi ? 'Scheme ya certificate khojein' : 'Search a scheme or certificate'}</Text></Pressable><Text style={styles.sectionTitle}>{hi ? 'लोकप्रिय सेवाएं' : 'Popular services'}</Text><View style={styles.categoryGrid}>{CATEGORIES.map((category) => <Pressable key={category.id} onPress={() => onCategory(category)} style={styles.categoryCard} accessibilityRole="button"><Text style={styles.categoryIcon}>{category.icon}</Text><Text style={styles.categoryName}>{hi ? category.hi : category.en}</Text></Pressable>)}</View></ScrollView></SafeAreaView>; }

function SearchScreen({ language, query, setQuery, results, selectedCategory, onBack, onResult }) { const hi = language === 'hi'; return <SafeAreaView style={styles.screen}><StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" /><View style={styles.searchContent}><Pressable onPress={onBack} style={styles.backButton}><Text style={styles.backText}>‹ {hi ? 'वापस' : 'Back'}</Text></Pressable><Text style={styles.searchScreenTitle}>{hi ? 'खोजें' : 'Search'}</Text><View style={styles.inputWrap}><Text style={styles.searchIcon}>⌕</Text><TextInput value={query} onChangeText={setQuery} placeholder={hi ? 'Scheme ya certificate khojein' : 'Search a scheme or certificate'} placeholderTextColor="#78909C" style={styles.searchInput} returnKeyType="search" /></View><Text style={styles.resultCount}>{results.length} {hi ? 'परिणाम' : 'results'}</Text><ScrollView contentContainerStyle={styles.resultList} keyboardShouldPersistTaps="handled">{results.map((scheme) => { const localized = getLocalizedScheme(scheme, language); return <Pressable key={scheme.id} onPress={() => onResult(scheme)} style={styles.resultCard} accessibilityRole="button"><Text style={styles.resultIcon}>{scheme.icon}</Text><View style={styles.resultTextWrap}><Text style={styles.resultName}>{localized.name}</Text><Text style={styles.resultDescription} numberOfLines={2}>{localized.shortDescription}</Text></View><Text style={styles.resultArrow}>›</Text></Pressable>; })}{results.length === 0 && <Text style={styles.emptyText}>{hi ? 'कोई परिणाम नहीं मिला।' : 'No results found.'}</Text>}</ScrollView></View></SafeAreaView>; }

const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:'#FFFFFF'}, loadingScreen:{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#FFFFFF'}, loadingText:{marginTop:12,fontSize:16,color:'#263238'},
  content:{flex:1,width:'100%',maxWidth:520,alignSelf:'center',paddingHorizontal:24,paddingTop:36,paddingBottom:24}, logoCircle:{width:76,height:76,borderRadius:38,alignSelf:'center',alignItems:'center',justifyContent:'center',backgroundColor:'#E8F5E9',borderWidth:2,borderColor:'#2E7D32'},logoText:{fontSize:24,fontWeight:'800',color:'#1B5E20'},title:{marginTop:14,textAlign:'center',fontSize:30,lineHeight:36,fontWeight:'800',color:'#172018'},subtitle:{marginTop:6,textAlign:'center',fontSize:16,lineHeight:23,color:'#455A64'},question:{marginTop:34,textAlign:'center',fontSize:24,lineHeight:32,fontWeight:'700',color:'#172018'},questionEnglish:{marginTop:3,textAlign:'center',fontSize:15,color:'#546E7A'},languageList:{marginTop:22,gap:12},languageButton:{minHeight:68,paddingHorizontal:18,borderRadius:14,borderWidth:2,borderColor:'#CFD8DC',backgroundColor:'#FFFFFF',flexDirection:'row',alignItems:'center',justifyContent:'space-between'},languageTextWrap:{flex:1},nativeName:{fontSize:20,lineHeight:26,fontWeight:'700',color:'#172018'},englishName:{marginTop:2,fontSize:13,color:'#607D8B'},comingSoon:{fontSize:13,fontWeight:'700',color:'#607D8B'},status:{minHeight:22,marginTop:14,textAlign:'center',fontSize:14,fontWeight:'600',color:'#2E7D32'},
  onboardingContent:{flex:1,width:'100%',maxWidth:520,alignSelf:'center',paddingHorizontal:24,paddingTop:12,paddingBottom:24},skipButton:{alignSelf:'flex-end',minWidth:72,minHeight:48,alignItems:'center',justifyContent:'center'},skipText:{fontSize:16,fontWeight:'700',color:'#546E7A'},onboardingMain:{flex:1,alignItems:'center',justifyContent:'center',paddingBottom:24},illustrationCircle:{width:160,height:160,borderRadius:80,alignItems:'center',justifyContent:'center',backgroundColor:'#E8F5E9',borderWidth:2,borderColor:'#A5D6A7'},illustration:{fontSize:68},onboardingTitle:{marginTop:32,textAlign:'center',fontSize:27,lineHeight:35,fontWeight:'800',color:'#172018'},onboardingBody:{marginTop:12,maxWidth:430,textAlign:'center',fontSize:18,lineHeight:28,color:'#455A64'},dots:{flexDirection:'row',alignItems:'center',gap:8,marginTop:28},dot:{width:9,height:9,borderRadius:5,backgroundColor:'#CFD8DC'},dotActive:{width:24,backgroundColor:'#2E7D32'},primaryButton:{minHeight:60,width:'100%',borderRadius:16,alignItems:'center',justifyContent:'center',backgroundColor:'#2E7D32'},primaryButtonText:{fontSize:20,fontWeight:'800',color:'#FFFFFF'},
  homeContent:{paddingHorizontal:22,paddingTop:24,paddingBottom:40},homeHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},homeGreeting:{fontSize:16,color:'#546E7A'},homeTitle:{marginTop:2,fontSize:28,fontWeight:'800',color:'#172018'},smallLogo:{width:48,height:48,borderRadius:24,alignItems:'center',justifyContent:'center',backgroundColor:'#E8F5E9',borderWidth:1,borderColor:'#A5D6A7'},smallLogoText:{fontSize:15,fontWeight:'800',color:'#1B5E20'},homeQuestion:{marginTop:30,fontSize:22,fontWeight:'700',color:'#172018'},searchBar:{marginTop:14,minHeight:62,borderRadius:16,borderWidth:2,borderColor:'#CFD8DC',flexDirection:'row',alignItems:'center',paddingHorizontal:18,backgroundColor:'#FFFFFF'},searchIcon:{fontSize:30,color:'#2E7D32',marginRight:10},searchPlaceholder:{flex:1,fontSize:16,color:'#607D8B'},sectionTitle:{marginTop:32,marginBottom:14,fontSize:20,fontWeight:'800',color:'#172018'},categoryGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',gap:12},categoryCard:{width:'48%',minHeight:112,borderRadius:16,borderWidth:1,borderColor:'#CFD8DC',alignItems:'center',justifyContent:'center',backgroundColor:'#FFFFFF',paddingHorizontal:8},categoryIcon:{fontSize:34},categoryName:{marginTop:8,textAlign:'center',fontSize:16,fontWeight:'700',color:'#263238'},
  searchContent:{flex:1,paddingHorizontal:22,paddingTop:10},backButton:{minHeight:48,justifyContent:'center',alignSelf:'flex-start'},backText:{fontSize:17,fontWeight:'700',color:'#2E7D32'},searchScreenTitle:{fontSize:28,fontWeight:'800',color:'#172018',marginBottom:14},inputWrap:{minHeight:62,borderRadius:16,borderWidth:2,borderColor:'#2E7D32',flexDirection:'row',alignItems:'center',paddingHorizontal:16},searchInput:{flex:1,minHeight:58,fontSize:17,color:'#172018'},resultCount:{marginTop:16,fontSize:15,fontWeight:'700',color:'#607D8B'},resultList:{paddingTop:10,paddingBottom:30,gap:10},resultCard:{minHeight:86,borderRadius:15,borderWidth:1,borderColor:'#CFD8DC',paddingHorizontal:14,paddingVertical:12,flexDirection:'row',alignItems:'center',backgroundColor:'#FFFFFF'},resultIcon:{fontSize:34,width:48,textAlign:'center'},resultTextWrap:{flex:1,paddingHorizontal:10},resultName:{fontSize:17,fontWeight:'800',color:'#172018'},resultDescription:{marginTop:4,fontSize:14,lineHeight:19,color:'#546E7A'},resultArrow:{fontSize:28,color:'#78909C'},emptyText:{textAlign:'center',marginTop:40,fontSize:17,color:'#607D8B'},
  detailPlaceholder:{flex:1,alignItems:'center',paddingHorizontal:24,paddingTop:10},detailIcon:{marginTop:80,fontSize:70},detailTitle:{marginTop:22,textAlign:'center',fontSize:28,lineHeight:36,fontWeight:'800',color:'#172018'},placeholderLabel:{marginTop:12,textAlign:'center',fontSize:16,lineHeight:24,color:'#607D8B'},
});
