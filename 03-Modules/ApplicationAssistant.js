import React, { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const GENERIC_STEPS = [
  ['🏢', 'CSC center जाएं', 'Visit your nearest CSC / Jan Seva Kendra.'],
  ['📄', 'Documents दिखाएं', 'Carry and show the required documents.'],
  ['📝', 'Form भरवाएं', 'Ask the center operator to fill the application form.'],
  ['💰', 'Fee दें (अगर है)', 'Pay the official fee only if the service requires one.'],
  ['🧾', 'Receipt लें', 'Take the application receipt or acknowledgement before leaving.'],
];

export default function ApplicationAssistant({ scheme, language, onBack }) {
  const hi = language === 'hi';
  const [done, setDone] = useState(() => new Set());
  const steps = useMemo(() => {
    const custom = scheme?.applicationSteps?.[language] || scheme?.applicationSteps?.en;
    return Array.isArray(custom) && custom.length ? custom.map((step, i) => ['✓', step, '']) : GENERIC_STEPS;
  }, [scheme, language]);

  const toggle = (index) => setDone((current) => {
    const next = new Set(current);
    next.has(index) ? next.delete(index) : next.add(index);
    return next;
  });

  const schemeName = scheme?.languageText?.[language]?.name || scheme?.languageText?.en?.name || scheme?.name;
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.back} accessibilityRole="button">
          <Text style={styles.backText}>‹ {hi ? 'वापस' : 'Back'}</Text>
        </Pressable>
        <Text style={styles.title}>{hi ? 'आवेदन में मदद' : 'Application Assistant'}</Text>
        <Text style={styles.subtitle}>{hi ? 'बस ये आसान steps follow करें' : 'Follow these simple application steps'}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.schemeCard}>
          <Text style={styles.schemeIcon}>{scheme?.icon || '📄'}</Text>
          <Text style={styles.schemeName}>{schemeName}</Text>
        </View>
        <View style={styles.note}>
          <Text style={styles.noteIcon}>ℹ️</Text>
          <Text style={styles.noteText}>{hi ? 'यह केवल guidance है। App खुद form नहीं भरेगा और application submit नहीं करेगा।' : 'This is guidance only. The app does not fill or submit forms.'}</Text>
        </View>
        {steps.map(([icon, hiText, enText], index) => {
          const checked = done.has(index);
          const fallback = typeof hiText === 'string' ? hiText : String(hiText);
          const label = enText ? (hi ? hiText : enText) : fallback;
          return (
            <Pressable key={`${index}-${label}`} onPress={() => toggle(index)} style={[styles.stepCard, checked && styles.stepCardDone]} accessibilityRole="checkbox" accessibilityState={{ checked }}>
              <View style={[styles.number, checked && styles.numberDone]}><Text style={styles.numberText}>{checked ? '✓' : index + 1}</Text></View>
              <View style={styles.stepIcon}><Text style={styles.iconText}>{icon}</Text></View>
              <View style={styles.stepText}><Text style={[styles.stepTitle, checked && styles.stepTitleDone]}>{label}</Text>{enText && <Text style={styles.stepSub}>{hi ? enText : hiText}</Text>}</View>
            </Pressable>
          );
        })}
        <View style={styles.finishCard}>
          <Text style={styles.finishIcon}>✅</Text>
          <Text style={styles.finishTitle}>{hi ? 'सभी steps पूरे होने पर' : 'When the steps are complete'}</Text>
          <Text style={styles.finishText}>{hi ? 'Receipt/acknowledgement संभालकर रखें और आगे की जानकारी के लिए संबंधित केंद्र से पूछें।' : 'Keep your receipt/acknowledgement and ask the center about the next step.'}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:'#FFF'},header:{paddingHorizontal:20,paddingTop:8,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#E6ECE8'},back:{minHeight:44,justifyContent:'center',alignSelf:'flex-start'},backText:{fontSize:17,fontWeight:'700',color:'#2E7D32'},title:{marginTop:4,fontSize:27,lineHeight:34,fontWeight:'800',color:'#172018'},subtitle:{marginTop:4,fontSize:14,color:'#607D68'},content:{padding:16,paddingBottom:32},schemeCard:{flexDirection:'row',alignItems:'center',padding:14,borderRadius:14,backgroundColor:'#F7F9F7',borderWidth:1,borderColor:'#E1E8E2'},schemeIcon:{fontSize:34,marginRight:12},schemeName:{flex:1,fontSize:18,lineHeight:24,fontWeight:'800',color:'#172018'},note:{marginTop:14,padding:14,borderRadius:14,backgroundColor:'#E3F2FD',borderWidth:1,borderColor:'#90CAF9',flexDirection:'row',alignItems:'flex-start'},noteIcon:{fontSize:20,marginRight:10},noteText:{flex:1,fontSize:14,lineHeight:20,color:'#37474F'},stepCard:{minHeight:86,marginTop:12,padding:14,borderRadius:16,borderWidth:2,borderColor:'#D5DDD7',backgroundColor:'#FFF',flexDirection:'row',alignItems:'center'},stepCardDone:{borderColor:'#2E7D32',backgroundColor:'#F1F8F2'},number:{width:38,height:38,borderRadius:19,backgroundColor:'#E8F5E9',alignItems:'center',justifyContent:'center',marginRight:10},numberDone:{backgroundColor:'#2E7D32'},numberText:{fontSize:17,fontWeight:'900',color:'#1B5E20'},stepIcon:{width:38,alignItems:'center'},iconText:{fontSize:26},stepText:{flex:1,marginLeft:8},stepTitle:{fontSize:17,lineHeight:23,fontWeight:'800',color:'#172018'},stepTitleDone:{color:'#1B5E20'},stepSub:{marginTop:3,fontSize:12,lineHeight:18,color:'#607D8B'},finishCard:{marginTop:18,padding:16,borderRadius:16,backgroundColor:'#FFF8E1',borderWidth:1,borderColor:'#FFE082'},finishIcon:{fontSize:28},finishTitle:{marginTop:6,fontSize:18,fontWeight:'800',color:'#5D5140'},finishText:{marginTop:5,fontSize:13,lineHeight:20,color:'#5D5140'}
});
