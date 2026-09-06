import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const QUESTIONS = [
  { key: 'age', hi: 'आपकी उम्र क्या है?', en: 'What is your age?', options: [['under18', '18 से कम', 'Under 18'], ['18-59', '18–59 साल', '18–59 years'], ['60+', '60 साल या ज्यादा', '60+ years']] },
  { key: 'income', hi: 'आपकी आय कितनी है?', en: 'What is your income range?', options: [['low', '₹1 लाख से कम', 'Below ₹1 lakh'], ['mid', '₹1–3 लाख', '₹1–3 lakh'], ['high', '₹3 लाख से ज्यादा', 'Above ₹3 lakh']] },
  { key: 'state', hi: 'आप किस राज्य में रहते हैं?', en: 'Which state do you live in?', options: [['up', 'उत्तर प्रदेश', 'Uttar Pradesh'], ['mh', 'महाराष्ट्र', 'Maharashtra'], ['other', 'अन्य राज्य', 'Other state']] },
  { key: 'category', hi: 'आपकी श्रेणी क्या है?', en: 'What is your category?', options: [['general', 'General', 'General'], ['obc', 'OBC', 'OBC'], ['sc', 'SC', 'SC'], ['st', 'ST', 'ST']] },
];

export default function EligibilityChecker({ scheme, language, onBack }) {
  const hi = language === 'hi';
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const current = QUESTIONS.find((question) => !answers[question.key]);
  const completed = Object.keys(answers).length;

  const choose = (key, value) => { setAnswers((old) => ({ ...old, [key]: value })); setResult(null); };
  const check = () => { const hasStructuredRules = Boolean(scheme?.eligibilityRules?.age || scheme?.eligibilityRules?.income || scheme?.ageRange || scheme?.incomeRange); setResult(hasStructuredRules ? 'apply' : 'generic'); };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.back} accessibilityRole="button"><Text style={styles.backText}>‹ {hi ? 'वापस' : 'Back'}</Text></Pressable>
        <Text style={styles.title}>{hi ? 'क्या मैं पात्र हूं?' : 'Am I eligible?'}</Text>
        <Text style={styles.subtitle}>{hi ? 'कुछ आसान सवालों के जवाब दें' : 'Answer a few simple questions'}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.schemeCard}><View style={styles.schemeIconBox}><Text style={styles.schemeIcon}>{scheme?.icon || '📄'}</Text></View><Text style={styles.schemeName}>{scheme?.languageText?.[language]?.name || scheme?.languageText?.en?.name || scheme?.name}</Text></View>
        {current ? (
          <View style={styles.questionCard}>
            <View style={styles.progressPill}><Text style={styles.progress}>{completed + 1} / {QUESTIONS.length}</Text></View>
            <Text style={styles.question}>{hi ? current.hi : current.en}</Text>
            <View style={styles.options}>{current.options.map(([value, hiLabel, enLabel]) => <Pressable key={value} onPress={() => choose(current.key, value)} style={[styles.option, answers[current.key] === value && styles.optionSelected]} accessibilityRole="radio" accessibilityState={{ selected: answers[current.key] === value }}><View style={[styles.radio, answers[current.key] === value && styles.radioSelected]} /><Text style={styles.optionText}>{hi ? hiLabel : enLabel}</Text></Pressable>)}</View>
          </View>
        ) : (
          <View style={styles.doneCard}>
            <View style={styles.doneIconBox}><Text style={styles.doneIcon}>✓</Text></View>
            <Text style={styles.doneTitle}>{hi ? 'सारी जानकारी मिल गई' : 'All answers received'}</Text>
            <Text style={styles.doneText}>{hi ? 'अब शुरुआती जांच करें।' : 'Now run a basic eligibility check.'}</Text>
            <Pressable onPress={check} style={styles.checkButton} accessibilityRole="button"><Text style={styles.checkButtonText}>{hi ? 'पात्रता जांचें' : 'Check eligibility'}</Text></Pressable>
          </View>
        )}
        {result && <View style={[styles.resultCard, result === 'apply' ? styles.resultPositive : styles.resultNeutral]}><Text style={styles.resultIcon}>{result === 'apply' ? '✅' : 'ℹ️'}</Text><Text style={styles.resultTitle}>{result === 'apply' ? (hi ? 'आपको इस scheme के लिए apply करना चाहिए।' : 'You should apply for this scheme.') : (hi ? 'पूरी details CSC center पर check कराएं।' : 'Please check the full details at a CSC center.')}</Text><Text style={styles.resultNote}>{hi ? 'यह सिर्फ शुरुआती जानकारी है। अंतिम पात्रता संबंधित नियमों से तय होगी।' : 'This is only a basic guide. Final eligibility depends on the applicable rules.'}</Text></View>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:'#FFFFFF'},
  header:{paddingHorizontal:20,paddingTop:10,paddingBottom:16,borderBottomWidth:1,borderBottomColor:'#E4EAE5',backgroundColor:'#FFFFFF'},
  back:{minHeight:48,justifyContent:'center',alignSelf:'flex-start',paddingHorizontal:4},
  backText:{fontSize:17,lineHeight:22,fontWeight:'800',color:'#2E7D32'},
  title:{marginTop:6,fontSize:27,lineHeight:34,fontWeight:'800',color:'#172018'},
  subtitle:{marginTop:5,fontSize:14,lineHeight:20,color:'#607D68'},
  content:{padding:16,paddingBottom:40},
  schemeCard:{minHeight:76,flexDirection:'row',alignItems:'center',padding:14,borderRadius:16,backgroundColor:'#F7F9F7',borderWidth:1,borderColor:'#E1E8E2'},
  schemeIconBox:{width:48,height:48,borderRadius:12,alignItems:'center',justifyContent:'center',backgroundColor:'#E8F5E9',marginRight:12},schemeIcon:{fontSize:28},schemeName:{flex:1,fontSize:18,lineHeight:25,fontWeight:'800',color:'#172018'},
  questionCard:{marginTop:16,padding:18,borderRadius:16,borderWidth:1,borderColor:'#E0E6E1',backgroundColor:'#FFFFFF'},
  progressPill:{alignSelf:'flex-start',paddingHorizontal:10,paddingVertical:6,borderRadius:20,backgroundColor:'#E3F2FD'},progress:{fontSize:13,fontWeight:'800',color:'#1565C0'},
  question:{marginTop:12,fontSize:22,lineHeight:29,fontWeight:'800',color:'#172018'},
  options:{marginTop:16,gap:10},
  option:{minHeight:56,paddingHorizontal:14,borderRadius:14,borderWidth:2,borderColor:'#CFD8DC',backgroundColor:'#FFFFFF',flexDirection:'row',alignItems:'center'},
  optionSelected:{borderColor:'#2E7D32',backgroundColor:'#F1F8F2'},
  radio:{width:22,height:22,borderRadius:11,borderWidth:2,borderColor:'#78909C',marginRight:12},radioSelected:{borderColor:'#2E7D32',borderWidth:7},
  optionText:{flex:1,fontSize:17,lineHeight:23,fontWeight:'700',color:'#263238'},
  doneCard:{marginTop:16,padding:20,borderRadius:16,backgroundColor:'#E8F5E9',borderWidth:1,borderColor:'#A5D6A7',alignItems:'center'},
  doneIconBox:{width:56,height:56,borderRadius:28,backgroundColor:'#2E7D32',alignItems:'center',justifyContent:'center'},doneIcon:{fontSize:34,fontWeight:'900',color:'#FFFFFF'},
  doneTitle:{marginTop:10,fontSize:21,lineHeight:27,fontWeight:'800',color:'#1B5E20',textAlign:'center'},doneText:{marginTop:6,fontSize:15,lineHeight:21,color:'#455A64',textAlign:'center'},
  checkButton:{marginTop:16,minHeight:56,width:'100%',borderRadius:14,backgroundColor:'#2E7D32',alignItems:'center',justifyContent:'center'},checkButtonText:{fontSize:18,fontWeight:'800',color:'#FFFFFF'},
  resultCard:{marginTop:16,padding:18,borderRadius:16,borderWidth:2},resultPositive:{backgroundColor:'#E8F5E9',borderColor:'#2E7D32'},resultNeutral:{backgroundColor:'#E3F2FD',borderColor:'#90CAF9'},resultIcon:{fontSize:30},resultTitle:{marginTop:8,fontSize:20,lineHeight:28,fontWeight:'800',color:'#172018'},resultNote:{marginTop:8,fontSize:13,lineHeight:20,color:'#546E7A'}
});
