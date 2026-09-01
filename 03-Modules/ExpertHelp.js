import React from 'react';
import { Linking, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const HELPLINE = '1800-XXX-XXXX';

const FAQ = {
  hi: [
    ['योजना की पात्रता कैसे पता चलेगी?', 'Scheme की पूरी eligibility देखें और जरूरत हो तो नज़दीकी CSC center पर जानकारी verify कराएं।'],
    ['आवेदन के लिए कौन से documents चाहिए?', 'हर योजना के लिए documents अलग हो सकते हैं। Scheme Detail में document list देखें।'],
    ['आवेदन की स्थिति कैसे पता चलेगी?', 'अभी JanSaathi में real status check नहीं होता। आप अपने CSC center या संबंधित विभाग से पूछ सकते हैं।'],
    ['आवेदन में गलती हो जाए तो क्या करें?', 'गलती दिखे तो जल्द से जल्द CSC center या संबंधित विभाग से संपर्क करें।'],
  ],
  en: [
    ['How can I check scheme eligibility?', 'Check the scheme eligibility details and verify them at a nearby CSC center if needed.'],
    ['Which documents are required?', 'Documents can differ by scheme. Check the document list on the Scheme Detail screen.'],
    ['How can I check application status?', 'JanSaathi does not check real status yet. Contact your CSC center or the concerned department.'],
    ['What if there is a mistake in my application?', 'Contact the CSC center or concerned department as soon as possible to correct it.'],
  ],
};

export default function ExpertHelp({ language, onBack }) {
  const hi = language === 'hi';
  const faqs = FAQ[language] || FAQ.en;

  function callHelpline() {
    Linking.openURL(`tel:${HELPLINE.replace(/[^0-9+]/g, '')}`).catch(() => {});
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={onBack} style={styles.back}>
          <Text style={styles.backText}>‹ {hi ? 'वापस' : 'Back'}</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.headerIcon}>🤝</Text>
          <Text style={styles.title}>{hi ? 'विशेषज्ञ से मदद' : 'Expert Help'}</Text>
        </View>

        <View style={styles.contactCard}>
          <Text style={styles.contactIcon}>📞</Text>
          <Text style={styles.contactTitle}>{hi ? 'मदद के लिए हेल्पलाइन' : 'Helpline for help'}</Text>
          <Text style={styles.number}>{HELPLINE}</Text>
          <Text style={styles.placeholderNote}>{hi ? 'यह अभी demo / placeholder number है।' : 'This is currently a demo / placeholder number.'}</Text>
          <Pressable onPress={callHelpline} style={styles.callButton}>
            <Text style={styles.callButtonText}>{hi ? 'Call करें' : 'Call now'}</Text>
          </Pressable>
        </View>

        <Text style={styles.faqTitle}>{hi ? 'अक्सर पूछे जाने वाले सवाल' : 'Frequently asked questions'}</Text>
        {faqs.map(([question, answer], index) => (
          <View key={index} style={styles.faqCard}>
            <Text style={styles.question}>Q. {question}</Text>
            <Text style={styles.answer}>{answer}</Text>
          </View>
        ))}

        <Text style={styles.note}>{hi ? 'नोट: अभी live chat, real expert connection या backend service उपलब्ध नहीं है।' : 'Note: Live chat, real expert connection, and backend service are not available yet.'}</Text>
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
  title: { fontSize: 27, fontWeight: '800', color: '#111' },
  contactCard: { backgroundColor: '#E8F5E9', borderWidth: 1, borderColor: '#C8E6C9', borderRadius: 18, padding: 20, alignItems: 'center', marginBottom: 24 },
  contactIcon: { fontSize: 38 },
  contactTitle: { fontSize: 18, fontWeight: '800', marginTop: 8 },
  number: { fontSize: 25, fontWeight: '900', letterSpacing: 1, marginTop: 10, color: '#1B5E20' },
  placeholderNote: { marginTop: 7, color: '#666', textAlign: 'center', fontSize: 13 },
  callButton: { marginTop: 16, minHeight: 52, width: '100%', borderRadius: 12, backgroundColor: '#2E7D32', alignItems: 'center', justifyContent: 'center' },
  callButtonText: { color: '#FFF', fontSize: 17, fontWeight: '800' },
  faqTitle: { fontSize: 20, fontWeight: '800', marginBottom: 12 },
  faqCard: { borderWidth: 1, borderColor: '#DDD', borderRadius: 14, padding: 15, marginBottom: 10 },
  question: { fontSize: 16, fontWeight: '800', lineHeight: 22 },
  answer: { marginTop: 7, fontSize: 14, lineHeight: 21, color: '#555' },
  note: { marginTop: 10, color: '#666', fontSize: 13, lineHeight: 19, textAlign: 'center' },
});
