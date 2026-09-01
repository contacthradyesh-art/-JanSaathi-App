import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const QUESTIONS = {
  hi: [
    'राशन कार्ड बनने में कितना समय लगता है?',
    'आधार कार्ड में नाम कैसे बदलें?',
    'पेंशन के लिए कौन-कौन से दस्तावेज़ चाहिए?',
    'सरकारी योजना के लिए आवेदन कहां करें?',
  ],
  en: [
    'How long does it take to get a ration card?',
    'How can I change my name on Aadhaar?',
    'Which documents are needed for a pension?',
    'Where can I apply for a government scheme?',
  ],
};

export default function CommunityQA({ language, onBack }) {
  const hi = language === 'hi';
  const questions = QUESTIONS[language] || QUESTIONS.en;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={onBack} style={styles.back}>
          <Text style={styles.backText}>‹ {hi ? 'वापस' : 'Back'}</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.headerIcon}>👥</Text>
          <View style={styles.headerText}>
            <Text style={styles.title}>{hi ? 'समुदाय से पूछें' : 'Community Q&A'}</Text>
            <Text style={styles.subtitle}>{hi ? 'लोगों के आम सवाल और जवाब' : 'Common questions people ask'}</Text>
          </View>
        </View>

        <View style={styles.comingSoonCard}>
          <Text style={styles.comingSoonIcon}>💬</Text>
          <Text style={styles.comingSoonTitle}>{hi ? 'यह फीचर जल्द आ रहा है' : 'This feature is coming soon'}</Text>
          <Text style={styles.comingSoonText}>
            {hi
              ? 'जल्द ही आप समुदाय के सवाल और जवाब देख पाएंगे। अभी यहां केवल कुछ सामान्य सवाल दिए गए हैं।'
              : 'Soon you will be able to see community questions and answers. For now, here are some common questions.'}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>{hi ? 'लोग अक्सर पूछते हैं' : 'Common questions'}</Text>
        {questions.map((question, index) => (
          <View key={index} style={styles.questionCard}>
            <Text style={styles.questionIcon}>❓</Text>
            <Text style={styles.questionText}>{question}</Text>
          </View>
        ))}

        <Text style={styles.note}>
          {hi
            ? 'अभी सवाल पूछने, पोस्ट करने या जवाब देने की सुविधा उपलब्ध नहीं है।'
            : 'Posting questions or answers is not available yet.'}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF' },
  container: { padding: 20, paddingBottom: 40 },
  back: { paddingVertical: 8, marginBottom: 10 },
  backText: { fontSize: 18, fontWeight: '700', color: '#1B5E20' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  headerIcon: { fontSize: 38, marginRight: 12 },
  headerText: { flex: 1 },
  title: { fontSize: 27, fontWeight: '800', color: '#111' },
  subtitle: { marginTop: 4, fontSize: 14, color: '#666' },
  comingSoonCard: { backgroundColor: '#E3F2FD', borderWidth: 1, borderColor: '#BBDEFB', borderRadius: 18, padding: 20, alignItems: 'center', marginBottom: 24 },
  comingSoonIcon: { fontSize: 40 },
  comingSoonTitle: { fontSize: 20, fontWeight: '800', textAlign: 'center', marginTop: 10 },
  comingSoonText: { fontSize: 15, lineHeight: 22, color: '#444', textAlign: 'center', marginTop: 8 },
  sectionTitle: { fontSize: 20, fontWeight: '800', marginBottom: 12 },
  questionCard: { minHeight: 62, borderWidth: 1, borderColor: '#DDD', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  questionIcon: { fontSize: 23, marginRight: 12 },
  questionText: { flex: 1, fontSize: 16, lineHeight: 22, fontWeight: '700' },
  note: { marginTop: 10, color: '#666', fontSize: 13, lineHeight: 19, textAlign: 'center' },
});
