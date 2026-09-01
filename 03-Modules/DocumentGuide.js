import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const HINTS = {
  aadhaar: ['कोई भी वैध सरकारी पहचान पत्र/आधार की प्रति रखें।', 'Keep Aadhaar or another valid government ID.'],
  address: ['आधार, राशन कार्ड या बिजली बिल जैसे पता प्रमाण रखें।', 'Keep Aadhaar, ration card, utility bill, or another address proof.'],
  income: ['हाल का आय प्रमाण पत्र या मान्य आय प्रमाण रखें।', 'Keep a recent income certificate or valid income proof.'],
  bank: ['अपने नाम का बैंक खाता और पासबुक/विवरण रखें।', 'Keep a bank account in your name and bank/passbook details.'],
  photo: ['हाल की पासपोर्ट साइज फोटो रखें।', 'Keep a recent passport-size photograph.'],
  age: ['जन्म प्रमाण या अन्य वैध उम्र प्रमाण रखें।', 'Keep a birth certificate or other valid age proof.'],
  caste: ['मान्य जाति प्रमाण या संबंधित रिकॉर्ड रखें।', 'Keep a valid caste certificate or supporting record.'],
  land: ['खसरा/खतौनी या उपलब्ध भूमि रिकॉर्ड रखें।', 'Keep available land records such as khasra/khatauni.'],
  disability: ['मान्य दिव्यांगता प्रमाण पत्र रखें।', 'Keep a valid disability certificate.'],
  death: ['मृत्यु प्रमाण पत्र या संबंधित रिकॉर्ड रखें।', 'Keep the death certificate or related record.'],
  birth: ['जन्म प्रमाण पत्र या उपलब्ध जन्म रिकॉर्ड रखें।', 'Keep the birth certificate or available birth record.'],
  education: ['अंतिम कक्षा की मार्कशीट/प्रमाण पत्र रखें।', 'Keep your latest marksheet or education certificate.'],
  worker: ['काम/रोजगार से जुड़ा उपलब्ध प्रमाण रखें।', 'Keep available proof of work or employment.'],
  registration: ['पुराना पंजीकरण नंबर/कार्ड हो तो उसकी प्रति रखें।', 'Keep a copy of any existing registration number/card.'],
  rti: ['अपना सवाल और संबंधित विभाग की जानकारी तैयार रखें।', 'Keep your question and concerned department details ready.'],
};

export default function DocumentGuide({ scheme, language, onBack }) {
  const hi = language === 'hi';
  const localized = scheme?.languageText?.[language] || scheme?.languageText?.en || scheme || {};
  const documents = scheme?.requiredDocuments || [];
  const [ready, setReady] = useState(() => new Set());
  const progress = useMemo(() => ({ ready: ready.size, total: documents.length }), [ready, documents.length]);

  const toggleDocument = (index) => {
    setReady((current) => {
      const next = new Set(current);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton} accessibilityRole="button">
          <Text style={styles.backText}>‹ {hi ? 'वापस' : 'Back'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{hi ? 'दस्तावेज़ गाइड' : 'Document Guide'}</Text>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressRow}>
          <Text style={styles.progressIcon}>📊</Text>
          <Text style={styles.progressTitle}>{hi ? `${progress.total} में से ${progress.ready} दस्तावेज़ तैयार हैं` : `${progress.ready} of ${progress.total} documents ready`}</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress.total ? (progress.ready / progress.total) * 100 : 0}%` }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.schemeCard}>
          <Text style={styles.schemeIcon}>{scheme?.icon || '📄'}</Text>
          <Text style={styles.schemeName}>{localized.name}</Text>
        </View>

        {documents.map((document, index) => {
          const rawName = typeof document === 'string' ? document : document.name;
          const label = typeof document === 'string'
            ? document
            : (document.languageText?.[language] || document.languageText?.en || rawName);
          const hintKey = typeof document === 'string' ? inferHint(document) : document.hint;
          const hint = HINTS[hintKey]?.[hi ? 0 : 1] || (hi ? 'दस्तावेज़ की वैध प्रति रखें।' : 'Keep a valid copy of this document.');
          const checked = ready.has(index);

          return (
            <Pressable
              key={`${rawName}-${index}`}
              onPress={() => toggleDocument(index)}
              style={[styles.documentCard, checked && styles.documentCardReady]}
              accessibilityRole="checkbox"
              accessibilityState={{ checked }}
            >
              <View style={[styles.checkbox, checked && styles.checkboxReady]}>
                {checked && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.documentText}>
                <Text style={[styles.documentName, checked && styles.documentNameReady]}>{label}</Text>
                <Text style={styles.documentHint}>{hint}</Text>
              </View>
            </Pressable>
          );
        })}

        <View style={styles.noteCard}>
          <Text style={styles.noteIcon}>💡</Text>
          <Text style={styles.noteText}>{hi ? 'असली दस्तावेज़ राज्य और योजना के नियमों के अनुसार अलग हो सकते हैं।' : 'Actual requirements can vary by scheme and state.'}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function inferHint(value) {
  const text = value.toLowerCase();
  if (text.includes('aadhaar') || text.includes('identity') || text.includes('id')) return 'aadhaar';
  if (text.includes('address')) return 'address';
  if (text.includes('income')) return 'income';
  if (text.includes('bank')) return 'bank';
  if (text.includes('photo')) return 'photo';
  if (text.includes('age') || text.includes('birth')) return 'age';
  if (text.includes('caste')) return 'caste';
  if (text.includes('land')) return 'land';
  if (text.includes('disability')) return 'disability';
  if (text.includes('death') || text.includes('widow')) return 'death';
  if (text.includes('education') || text.includes('marksheet')) return 'education';
  if (text.includes('worker') || text.includes('work') || text.includes('employment')) return 'worker';
  if (text.includes('rti')) return 'rti';
  return 'registration';
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E6ECE8' },
  backButton: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' },
  backText: { fontSize: 17, fontWeight: '700', color: '#2E7D32' },
  headerTitle: { marginTop: 4, fontSize: 27, lineHeight: 34, fontWeight: '800', color: '#172018' },
  progressCard: { margin: 16, padding: 16, borderRadius: 16, backgroundColor: '#E8F5E9', borderWidth: 1, borderColor: '#A5D6A7' },
  progressRow: { flexDirection: 'row', alignItems: 'center' },
  progressIcon: { fontSize: 28, marginRight: 10 },
  progressTitle: { flex: 1, fontSize: 18, lineHeight: 24, fontWeight: '800', color: '#1B5E20' },
  progressTrack: { height: 10, marginTop: 14, borderRadius: 5, overflow: 'hidden', backgroundColor: '#C8E6C9' },
  progressFill: { height: '100%', borderRadius: 5, backgroundColor: '#2E7D32' },
  content: { paddingHorizontal: 16, paddingBottom: 28 },
  schemeCard: { flexDirection: 'row', alignItems: 'center', padding: 14, marginBottom: 12, borderRadius: 14, backgroundColor: '#F7F9F7', borderWidth: 1, borderColor: '#E1E8E2' },
  schemeIcon: { fontSize: 34, marginRight: 12 },
  schemeName: { flex: 1, fontSize: 18, lineHeight: 24, fontWeight: '800', color: '#172018' },
  documentCard: { minHeight: 88, marginBottom: 10, padding: 14, borderRadius: 14, borderWidth: 2, borderColor: '#D5DDD7', backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center' },
  documentCardReady: { borderColor: '#2E7D32', backgroundColor: '#F1F8F2' },
  checkbox: { width: 34, height: 34, borderRadius: 8, borderWidth: 2, borderColor: '#78909C', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  checkboxReady: { borderColor: '#2E7D32', backgroundColor: '#2E7D32' },
  checkmark: { fontSize: 22, lineHeight: 24, fontWeight: '900', color: '#FFFFFF' },
  documentText: { flex: 1 },
  documentName: { fontSize: 17, lineHeight: 23, fontWeight: '800', color: '#172018' },
  documentNameReady: { color: '#1B5E20' },
  documentHint: { marginTop: 4, fontSize: 13, lineHeight: 19, color: '#546E7A' },
  noteCard: { marginTop: 8, padding: 14, borderRadius: 14, backgroundColor: '#FFF8E1', borderWidth: 1, borderColor: '#FFE082', flexDirection: 'row', alignItems: 'flex-start' },
  noteIcon: { fontSize: 21, marginRight: 10 },
  noteText: { flex: 1, fontSize: 13, lineHeight: 20, color: '#5D5140' },
});