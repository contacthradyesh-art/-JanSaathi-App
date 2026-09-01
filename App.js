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
    try { await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language.code); setSelectedLanguage(language.code); setStatusMessage(''); setShowOnboarding(true); setOnboardingStep(0); }
    catch (error) { setStatusMessage('Language save nahi ho payi. Please try again.'); }
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
    return <SafeAreaView style={styles.screen}><StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" /><View style={styles.onboardingContent}><Pressable accessibilityRole="button" onPress={completeOnboarding} style={styles.skipButton}><Text style={styles.skipText}>{hi ? 'छोड़ें' : 'Skip'}</Text></Pressable><View style={styles.onboardingMain}><View style={styles.illustrationCircle}><Text style={styles.illustration}>{slide.icon}</Text></View><Text style={styles.onboardingTitle}>{slide.title}</Text><Text style={styles.onboardingBody}>{slide.body}</Text><View style={styles.dots}>{slides.map((_, index) => <View key={index} style={[styles.dot, index === onboardingStep && styles.dotActive]} />)}</View></View><Pressable accessibilityRole="button" onPress={() => isLastStep ? completeOnboarding() : setOnboardingStep((step) => step + 1)} style={styles.primaryButton}><Text style={styles.primaryButtonText}>{isLastStep ? (hi ? 'शुरू करें' : 'Get started') : (hi ? 'आगे' : 'Next')}</Text></Pressable></View></SafeAreaView>;
  }
  if (screen === 'home') return <HomeScreen language={selectedLanguage} onSearch={openSearch} onCategory={openCategory} />;
  if (screen === 'search') return <SearchScreen language={selectedLanguage} query={searchQuery} setQuery={setSearchQuery} results={filteredSchemes} selectedCategory={selectedCategory} onBack={() => setScreen('home')} onResult={openScheme} />;
  return <SchemeDetailScreen language={selectedLanguage} scheme={selectedScheme} onBack={() => setScreen('search')} />;
}

function LanguageSelection({ onSelect, statusMessage }) { return <SafeAreaView style={styles.screen}><StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" /><View style={styles.content}><View style={styles.logoCircle}><Text style={styles.logoText}>JS</Text></View><Text style={styles.title}>JanSaathi</Text><Text style={styles.subtitle}>Aapki sarkari madad, aapki bhasha mein</Text><Text style={styles.question}>अपनी भाषा चुनें</Text><Text style={styles.questionEnglish}>Choose your language</Text><View style={styles.languageList}>{LANGUAGES.map((language) => <Pressable key={language.code} accessibilityRole="button" onPress={() => onSelect(language)} style={styles.languageButton}><View style={styles.languageTextWrap}><Text style={styles.nativeName}>{language.nativeName}</Text><Text style={styles.englishName}>{language.englishName}</Text></View><Text style={styles.comingSoon}>{language.placeholder ? 'Soon' : '›'}</Text></Pressable>)}</View><Text style={styles.status}>{statusMessage}</Text></View></SafeAreaView>; }

function HomeScreen({ language, onSearch, onCategory }) { const hi = language === 'hi'; return <SafeAreaView style={styles.screen}><StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" /><ScrollView contentContainerStyle={styles.homeContent}><View style={styles.homeHeader}><View><Text style={styles.homeGreeting}>{hi ? 'नमस्ते 👋' : 'Namaste 👋'}</Text><Text style={styles.homeTitle}>JanSaathi</Text></View><View style={styles.smallLogo}><Text style={styles.smallLogoText}>JS</Text></View></View><Text style={styles.homeQuestion}>{hi ? 'आज क्या करना है?' : 'What do you need today?'}</Text><Pressable onPress={onSearch} style={styles.searchBar} accessibilityRole="button"><Text style={styles.searchIcon}>⌕</Text><Text style={styles.searchPlaceholder}>{hi ? 'Scheme ya certificate khojein' : 'Search a scheme or certificate'}</Text></Pressable><Text style={styles.sectionTitle}>{hi ? 'लोकप्रिय सेवाएं' : 'Popular services'}</Text><View style={styles.categoryGrid}>{CATEGORIES.map((category) => <Pressable key={category.id} onPress={() => onCategory(category)} style={styles.categoryCard} accessibilityRole="button"><Text style={styles.categoryIcon}>{category.icon}</Text><Text style={styles.categoryName}>{hi ? category.hi : category.en}</Text></Pressable>)}</View></ScrollView></SafeAreaView>; }

function SearchScreen({ language, query, setQuery, results, selectedCategory, onBack, onResult }) { const hi = language === 'hi'; return <SafeAreaView style={styles.screen}><StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" /><View style={styles.searchContent}><Pressable onPress={onBack} style={styles.backButton}><Text style={styles.backText}>‹ {hi ? 'वापस' : 'Back'}</Text></Pressable><Text style={styles.searchScreenTitle}>{hi ? 'खोजें' : 'Search'}</Text><View style={styles.inputWrap}><Text style={styles.searchIcon}>⌕</Text><TextInput value={query} onChangeText={setQuery} placeholder={hi ? 'Scheme ya certificate khojein' : 'Search a scheme or certificate'} placeholderTextColor="#78909C" style={styles.searchInput} returnKeyType="search" /></View>{selectedCategory && <Text style={styles.filterLabel}>{hi ? 'श्रेणी' : 'Category'}: {CATEGORIES.find((item) => item.id === selectedCategory)?.[hi ? 'hi' : 'en']}</Text>}<Text style={styles.resultCount}>{results.length} {hi ? 'परिणाम' : 'results'}</Text><ScrollView contentContainerStyle={styles.resultList} keyboardShouldPersistTaps="handled">{results.map((scheme) => { const localized = getLocalizedScheme(scheme, language); return <Pressable key={scheme.id} onPress={() => onResult(scheme)} style={styles.resultCard} accessibilityRole="button"><Text style={styles.resultIcon}>{scheme.icon}</Text><View style={styles.resultTextWrap}><Text style={styles.resultName}>{localized.name}</Text><Text style={styles.resultDescription} numberOfLines={2}>{localized.shortDescription}</Text></View><Text style={styles.resultArrow}>›</Text></Pressable>; })}{results.length === 0 && <Text style={styles.emptyText}>{hi ? 'कोई परिणाम नहीं मिला।' : 'No results found.'}</Text>}</ScrollView></View></SafeAreaView>; }

function SchemeDetailScreen({ language, scheme, onBack }) {
  const hi = language === 'hi'; const localized = scheme ? getLocalizedScheme(scheme, language) : {}; const eligibility = scheme?.eligibility?.[language] || scheme?.eligibility?.en || []; const documents = scheme?.requiredDocuments || [];
  const applyText = hi ? ['अपने नज़दीकी CSC केंद्र पर जाएं।', 'जरूरी दस्तावेज़ साथ ले जाएं।'] : ['Visit your nearest CSC center.', 'Carry the required documents.'];
  const labels = hi ? { back:'वापस', what:'यह क्या है', eligible:'कौन आवेदन कर सकता है', docs:'दस्तावेज़ चाहिए', apply:'कहां / कैसे आवेदन करें', guide:'Document Guide देखें', soon:'जल्द आ रहा है' } : { back:'Back', what:'What is this?', eligible:'Who can apply?', docs:'Documents needed', apply:'Where / How to apply', guide:'View Document Guide', soon:'Coming soon' };
  return <SafeAreaView style={styles.screen}><StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" /><ScrollView contentContainerStyle={styles.detailContent}><Pressable onPress={onBack} style={styles.backButton}><Text style={styles.backText}>‹ {labels.back}</Text></Pressable><View style={styles.detailHeader}><View style={styles.detailIconCircle}><Text style={styles.detailIcon}>{scheme?.icon || '📄'}</Text></View><Text style={styles.detailTitle}>{localized.name}</Text></View><DetailSection icon="ℹ️" title={labels.what}><Text style={styles.detailDescription}>{localized.shortDescription}</Text></DetailSection><DetailSection icon="✅" title={labels.eligible}><BulletList items={eligibility} /></DetailSection><DetailSection icon="📄" title={labels.docs}><BulletList items={documents.map((item) => translateDocument(item, hi))} /></DetailSection><DetailSection icon="📍" title={labels.apply}><BulletList items={applyText} /></DetailSection><View style={styles.guideCard}><Text style={styles.guideIcon}>📋</Text><View style={styles.guideTextWrap}><Text style={styles.guideTitle}>{labels.guide}</Text><Text style={styles.guideSoon}>{labels.soon}</Text></View><Pressable disabled style={styles.disabledGuideButton}><Text style={styles.disabledGuideText}>→</Text></Pressable></View></ScrollView></SafeAreaView>;
}
function DetailSection({ icon, title, children }) { return <View style={styles.detailSection}><View style={styles.sectionHeader}><Text style={styles.sectionIcon}>{icon}</Text><Text style={styles.detailSectionTitle}>{title}</Text></View>{children}</View>; }
function BulletList({ items }) { return <View style={styles.bulletList}>{items.map((item, index) => <View key={`${item}-${index}`} style={styles.bulletRow}><Text style={styles.bullet}>•</Text><Text style={styles.bulletText}>{item}</Text></View>)}</View>; }
function translateDocument(item, hi) { const map = { 'Aadhaar Card':'आधार कार्ड','Address Proof':'पता प्रमाण','Income Proof':'आय प्रमाण','Bank Account Details':'बैंक खाता विवरण','Passport-size Photo':'पासपोर्ट आकार का फोटो','Ration Card':'राशन कार्ड','Mobile Number':'मोबाइल नंबर','Other approved identity proof':'अन्य मान्य पहचान प्रमाण','Family Details':'परिवार का विवरण','Family/Ration Card Details':'परिवार/राशन कार्ड विवरण','Land Records':'भूमि रिकॉर्ड','Farmer/State Registration Details':'किसान/राज्य पंजीकरण विवरण','Supporting Update Document':'सहायक अपडेट दस्तावेज़','Identity Proof where required':'जहां जरूरी हो पहचान प्रमाण','Address Proof where required':'जहां जरूरी हो पता प्रमाण','Disability Certificate':'दिव्यांगता प्रमाण पत्र','Age Proof':'आयु प्रमाण','Widow/Death Certificate':'विधवा/मृत्यु प्रमाण पत्र','Caste Proof/Family Certificate':'जाति प्रमाण/परिवार प्रमाण पत्र','Residence Evidence':'निवास प्रमाण','Hospital/Birth Record':'अस्पताल/जन्म रिकॉर्ड','Parent Details':'माता-पिता का विवरण','Deceased Person Details':'मृत व्यक्ति का विवरण','Informant ID Proof':'सूचना देने वाले का पहचान प्रमाण','Hospital/Death Record':'अस्पताल/मृत्यु रिकॉर्ड','Date of Birth Proof':'जन्म तिथि प्रमाण','Work/Occupation Proof':'काम/व्यवसाय प्रमाण','Student ID/School ID':'छात्र/स्कूल पहचान पत्र','Previous Marksheet':'पिछली अंकतालिका','Mobile/Contact Details':'मोबाइल/संपर्क विवरण','Clear Information Request':'स्पष्ट सूचना अनुरोध','Application Fee where applicable':'जहां लागू हो आवेदन शुल्क','Supporting Document where useful':'जहां उपयोगी हो सहायक दस्तावेज़'}; return hi ? (map[item] || item) : item; }

const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:'#FFFFFF'}, loadingScreen:{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#FFFFFF'}, loadingText:{marginTop:12,fontSize:16,color:'#263238'},
  content:{flex:1,width:'100%',maxWidth:520,alignSelf:'center',paddingHorizontal:24,paddingTop:36,paddingBottom:24}, logoCircle:{width:76,height:76,borderRadius:38,alignSelf:'center',alignItems:'center',justifyContent:'center',backgroundColor:'#E8F5E9',borderWidth:2,borderColor:'#2E7D32'},logoText:{fontSize:24,fontWeight:'800',color:'#1B5E20'},title:{marginTop:14,textAlign:'center',fontSize:30,lineHeight:36,fontWeight:'800',color:'#172018'},subtitle:{marginTop:6,textAlign:'center',fontSize:16,lineHeight:23,color:'#455A64'},question:{marginTop:34,textAlign:'center',fontSize:24,lineHeight:32,fontWeight:'700',color:'#172018'},questionEnglish:{marginTop:3,textAlign:'center',fontSize:15,color:'#546E8B'},languageList:{marginTop:22,gap:12},languageButton:{minHeight:68,paddingHorizontal:18,borderRadius:14,borderWidth:2,borderColor:'#CFD8DC',backgroundColor:'#FFFFFF',flexDirection:'row',alignItems:'center',justifyContent:'space-between'},languageTextWrap:{flex:1},nativeName:{fontSize:20,lineHeight:26,fontWeight:'700',color:'#172018'},englishName:{marginTop:2,fontSize:13,color:'#607D8B'},comingSoon:{fontSize:13,fontWeight:'700',color:'#607D8B'},status:{minHeight:22,marginTop:14,textAlign:'center',fontSize:14,fontWeight:'600',color:'#2E7D32'},
  onboardingContent:{flex:1,width:'100%',maxWidth:520,alignSelf:'center',paddingHorizontal:24,paddingTop:12,paddingBottom:24},skipButton:{alignSelf:'flex-end',minWidth:72,minHeight:48,alignItems:'center',justifyContent:'center'},skipText:{fontSize:16,fontWeight:'700',color:'#546E7A'},onboardingMain:{flex:1,alignItems:'center',justifyContent:'center',paddingBottom:24},illustrationCircle:{width:160,height:160,borderRadius:80,alignItems:'center',justifyContent:'center',backgroundColor:'#E8F5E9',borderWidth:2,borderColor:'#A5D6A7'},illustration:{fontSize:68},onboardingTitle:{marginTop:32,textAlign:'center',fontSize:27,lineHeight:35,fontWeight:'800',color:'#172018'},onboardingBody:{marginTop:12,maxWidth:430,textAlign:'center',fontSize:18,lineHeight:28,color:'#455A64'},dots:{flexDirection:'row',alignItems:'center',gap:8,marginTop:28},dot:{width:9,height:9,borderRadius:5,backgroundColor:'#CFD8DC'},dotActive:{width:24,backgroundColor:'#2E7D32'},primaryButton:{minHeight:60,width:'100%',borderRadius:16,alignItems:'center',justifyContent:'center',backgroundColor:'#2E7D32'},primaryButtonText:{fontSize:20,fontWeight:'800',color:'#FFFFFF'},
  homeContent:{padding:24,paddingBottom:40},homeHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},homeGreeting:{fontSize:17,color:'#546E7A'},homeTitle:{marginTop:3,fontSize:30,fontWeight:'800',color:'#172018'},smallLogo:{width:50,height:50,borderRadius:25,alignItems:'center',justifyContent:'center',backgroundColor:'#E8F5E9',borderWidth:1,borderColor:'#A5D6A7'},smallLogoText:{fontSize:16,fontWeight:'800',color:'#1B5E20'},homeQuestion:{marginTop:30,fontSize:23,fontWeight:'800',color:'#172018'},searchBar:{marginTop:16,minHeight:62,paddingHorizontal:18,borderRadius:16,borderWidth:2,borderColor:'#CFD8DC',flexDirection:'row',alignItems:'center',backgroundColor:'#FFFFFF'},searchIcon:{fontSize:30,color:'#37474F'},searchPlaceholder:{marginLeft:12,fontSize:16,color:'#78909C',flex:1},sectionTitle:{marginTop:30,fontSize:20,fontWeight:'800',color:'#172018'},categoryGrid:{marginTop:14,flexDirection:'row',flexWrap:'wrap',gap:12},categoryCard:{width:'47%',minHeight:110,borderRadius:16,borderWidth:1,borderColor:'#E0E0E0',backgroundColor:'#FAFAFA',padding:16,alignItems:'center',justifyContent:'center'},categoryIcon:{fontSize:36},categoryName:{marginTop:9,fontSize:15,fontWeight:'700',textAlign:'center',color:'#263238'},
  searchContent:{flex:1,paddingHorizontal:20,paddingTop:8},backButton:{minHeight:48,justifyContent:'center',alignSelf:'flex-start'},backText:{fontSize:17,fontWeight:'700',color:'#2E7D32'},searchScreenTitle:{fontSize:28,fontWeight:'800',color:'#172018',marginBottom:16},inputWrap:{minHeight:60,borderWidth:2,borderColor:'#CFD8DC',borderRadius:15,flexDirection:'row',alignItems:'center',paddingHorizontal:15},searchInput:{flex:1,fontSize:17,color:'#172018',paddingVertical:10},filterLabel:{marginTop:12,fontSize:14,fontWeight:'700',color:'#546E7A'},resultCount:{marginTop:14,fontSize:14,fontWeight:'700',color:'#607D8B'},resultList:{paddingTop:10,paddingBottom:30,gap:10},resultCard:{minHeight:88,padding:14,borderRadius:15,borderWidth:1,borderColor:'#E0E0E0',backgroundColor:'#FFFFFF',flexDirection:'row',alignItems:'center'},resultIcon:{fontSize:34,width:48,textAlign:'center'},resultTextWrap:{flex:1,paddingHorizontal:10},resultName:{fontSize:17,fontWeight:'800',color:'#172018'},resultDescription:{marginTop:4,fontSize:14,lineHeight:20,color:'#546E7A'},resultArrow:{fontSize:28,color:'#90A4AE'},emptyText:{padding:30,textAlign:'center',fontSize:17,color:'#607D8B'},
  detailContent:{paddingHorizontal:20,paddingTop:8,paddingBottom:40},detailHeader:{alignItems:'center',paddingTop:6,paddingBottom:22},detailIconCircle:{width:96,height:96,borderRadius:48,backgroundColor:'#E8F5E9',borderWidth:2,borderColor:'#A5D6A7',alignItems:'center',justifyContent:'center'},detailIcon:{fontSize:48},detailTitle:{marginTop:14,fontSize:26,lineHeight:33,fontWeight:'800',textAlign:'center',color:'#172018'},detailSection:{marginTop:14,padding:18,borderRadius:16,borderWidth:1,borderColor:'#E0E0E0',backgroundColor:'#FAFAFA'},sectionHeader:{flexDirection:'row',alignItems:'center',marginBottom:12},sectionIcon:{fontSize:24,width:36},detailSectionTitle:{flex:1,fontSize:19,lineHeight:25,fontWeight:'800',color:'#172018'},detailDescription:{fontSize:16,lineHeight:25,color:'#455A64'},bulletList:{gap:10},bulletRow:{flexDirection:'row',alignItems:'flex-start'},bullet:{width:22,fontSize:22,lineHeight:23,fontWeight:'800',color:'#2E7D32'},bulletText:{flex:1,fontSize:16,lineHeight:23,color:'#37474F'},guideCard:{marginTop:18,minHeight:76,borderRadius:16,borderWidth:1,borderColor:'#CFD8DC',backgroundColor:'#F5F5F5',padding:14,flexDirection:'row',alignItems:'center'},guideIcon:{fontSize:28,width:42},guideTextWrap:{flex:1},guideTitle:{fontSize:16,fontWeight:'800',color:'#616161'},guideSoon:{marginTop:3,fontSize:13,color:'#757575'},disabledGuideButton:{width:44,height:44,borderRadius:22,backgroundColor:'#E0E0E0',alignItems:'center',justifyContent:'center'},disabledGuideText:{fontSize:24,color:'#9E9E9E'},
});
