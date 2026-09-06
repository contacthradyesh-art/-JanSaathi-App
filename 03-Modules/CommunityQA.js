import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const QUESTIONS={hi:['राशन कार्ड बनने में कितना समय लगता है?','आधार कार्ड में नाम कैसे बदलें?','पेंशन के लिए कौन-कौन से दस्तावेज़ चाहिए?','सरकारी योजना के लिए आवेदन कहां करें?'],en:['How long does it take to get a ration card?','How can I change my name on Aadhaar?','Which documents are needed for a pension?','Where can I apply for a government scheme?']};
export default function CommunityQA({language,onBack}){
  const hi=language==='hi'; const questions=QUESTIONS[language]||QUESTIONS.en;
  return <SafeAreaView style={styles.screen}><ScrollView contentContainerStyle={styles.container}>
    <Pressable onPress={onBack} style={styles.back} accessibilityRole="button"><Text style={styles.backText}>‹ {hi?'वापस':'Back'}</Text></Pressable>
    <View style={styles.header}><View style={styles.headerIconBox}><Text style={styles.headerIcon}>👥</Text></View><View style={styles.headerText}><Text style={styles.title}>{hi?'समुदाय से पूछें':'Community Q&A'}</Text><Text style={styles.subtitle}>{hi?'लोगों के आम सवाल और जवाब':'Common questions people ask'}</Text></View></View>
    <View style={styles.comingSoonCard}><View style={styles.comingSoonIconBox}><Text style={styles.comingSoonIcon}>💬</Text></View><Text style={styles.comingSoonTitle}>{hi?'यह फीचर जल्द आ रहा है':'This feature is coming soon'}</Text><Text style={styles.comingSoonText}>{hi?'जल्द ही आप समुदाय के सवाल और जवाब देख पाएंगे। अभी यहां केवल कुछ सामान्य सवाल दिए गए हैं।':'Soon you will be able to see community questions and answers. For now, here are some common questions.'}</Text></View>
    <Text style={styles.sectionTitle}>{hi?'लोग अक्सर पूछते हैं':'Common questions'}</Text>
    {questions.map((question,index)=><View key={index} style={styles.questionCard}><View style={styles.questionIconBox}><Text style={styles.questionIcon}>❓</Text></View><Text style={styles.questionText}>{question}</Text></View>)}
    <View style={styles.note}><Text style={styles.noteIcon}>ℹ️</Text><Text style={styles.noteText}>{hi?'अभी सवाल पूछने, पोस्ट करने या जवाब देने की सुविधा उपलब्ध नहीं है।':'Posting questions or answers is not available yet.'}</Text></View>
  </ScrollView></SafeAreaView>;
}
const styles=StyleSheet.create({
 screen:{flex:1,backgroundColor:'#FFFFFF'},container:{padding:16,paddingTop:10,paddingBottom:40},back:{minHeight:48,justifyContent:'center',alignSelf:'flex-start',paddingHorizontal:4},backText:{fontSize:17,lineHeight:22,fontWeight:'800',color:'#2E7D32'},
 header:{flexDirection:'row',alignItems:'center',marginTop:6,marginBottom:20},headerIconBox:{width:48,height:48,borderRadius:12,backgroundColor:'#E3F2FD',alignItems:'center',justifyContent:'center',marginRight:12},headerIcon:{fontSize:28},headerText:{flex:1},title:{fontSize:27,lineHeight:34,fontWeight:'800',color:'#172018'},subtitle:{marginTop:4,fontSize:14,lineHeight:20,color:'#607D68'},
 comingSoonCard:{backgroundColor:'#E3F2FD',borderWidth:1,borderColor:'#90CAF9',borderRadius:18,padding:20,alignItems:'center',marginBottom:24},comingSoonIconBox:{width:56,height:56,borderRadius:28,backgroundColor:'#FFFFFF',alignItems:'center',justifyContent:'center'},comingSoonIcon:{fontSize:30},comingSoonTitle:{fontSize:20,lineHeight:26,fontWeight:'800',textAlign:'center',marginTop:10,color:'#172018'},comingSoonText:{fontSize:15,lineHeight:22,color:'#37474F',textAlign:'center',marginTop:8},
 sectionTitle:{fontSize:20,lineHeight:26,fontWeight:'800',marginBottom:12,color:'#172018'},questionCard:{minHeight:72,borderWidth:1,borderColor:'#DCE5DE',borderRadius:14,padding:14,flexDirection:'row',alignItems:'center',marginBottom:10,backgroundColor:'#FFFFFF'},questionIconBox:{width:40,height:40,borderRadius:20,backgroundColor:'#F1F8F2',alignItems:'center',justifyContent:'center',marginRight:12},questionIcon:{fontSize:21},questionText:{flex:1,fontSize:16,lineHeight:22,fontWeight:'700',color:'#263238'},
 note:{marginTop:8,padding:14,minHeight:60,borderRadius:14,backgroundColor:'#FFF8E1',borderWidth:1,borderColor:'#FFE082',flexDirection:'row',alignItems:'flex-start'},noteIcon:{fontSize:20,lineHeight:24,marginRight:10},noteText:{flex:1,color:'#5D5140',fontSize:13,lineHeight:20}
});
