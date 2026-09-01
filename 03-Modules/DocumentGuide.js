import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const COMMON_HINTS = {
  aadhaar: { hi: 'कोई भी वैध सरकारी पहचान पत्र/आधार की प्रति रखें।', en: 'Keep a copy of Aadhaar or another valid government ID.' },
  addressProof: { hi: 'पता साबित करने के लिए आधार, राशन कार्ड या बिजली बिल जैसे दस्तावेज़ रखें।', en: 'Use Aadhaar, ration card, utility bill, or another address proof.' },
  incomeProof: { hi: 'हाल का आय प्रमाण पत्र या मान्य आय संबंधी दस्तावेज़ रखें।', en: 'Keep a recent income certificate or valid income proof.' },
  bank: { hi: 'अपने नाम का बैंक खाता और पासबुक/बैंक विवरण रखें।', en: 'Keep a bank account in your name and bank/passbook details.' },
  photo: { hi: 'हाल की पासपोर्ट साइज फोटो रखें।', en: 'Keep a recent passport-size photograph.' },
  age: { hi: 'उम्र साबित करने के लिए जन्म प्रमाण या अन्य वैध प्रमाण रखें।', en: 'Keep a birth certificate or other valid age proof.' },
  caste: { hi: 'मान्य जाति प्रमाण या संबंधित रिकॉर्ड की प्रति रखें।', en: 'Keep a valid caste certificate or supporting record.' },
  land: { hi: 'जमीन से जुड़े खसरा/खतौनी या उपलब्ध रिकॉर्ड रखें।', en: 'Keep available land records such as khasra/khatauni.' },
  disability: { hi: 'मान्य दिव्यांगता प्रमाण पत्र रखें।', en: 'Keep a valid disability certificate.' },
  death: { hi: 'मृत्यु प्रमाण पत्र या संबंधित पंजीकरण रिकॉर्ड रखें।', en: 'Keep the death certificate or related registration record.' },
  birth: { hi: 'जन्म प्रमाण पत्र या जन्म से जुड़ा उपलब्ध रिकॉर्ड रखें।', en: 'Keep the birth certificate or available birth record.' },
  education: { hi: 'अंतिम कक्षा की मार्कशीट/प्रमाण पत्र रखें।', en: 'Keep your latest marksheet or education certificate.' },
  worker: { hi: 'काम/रोजगार से जुड़ा उपलब्ध प्रमाण रखें।', en: 'Keep available proof of work or employment.' },
  pan: { hi: 'पैन कार्ड या पैन से जुड़ा उपलब्ध प्रमाण रखें।', en: 'Keep your PAN card or available PAN proof.' },
  registration: { hi: 'पुराना पंजीकरण नंबर/कार्ड हो तो उसकी प्रति रखें।', en: 'Keep a copy of any existing registration number/card.' },
  rti: { hi: 'अपना सवाल और संबंधित विभाग/कार्यालय की जानकारी तैयार रखें।', en: 'Keep your question and the concerned department/office details ready.' },
};

const getHint = (hintKey, language) => COMMON_HINTS[hintKey]?.[language] || COMMON_HINTS[hintKey]?.en || '';

export default function DocumentGuide({ scheme, language, onBack }) {
  const [ready, setReady] = useState(() => new Set());
  const hi = language === 'hi';
  const localized = scheme.languageText?.[language] || scheme.languageText?.en || scheme;
  const documents = scheme.requiredDocuments || [];
  const progress = useMemo(() => ({ ready: ready.size, total: documents.length }), [ready, documents.length]);

  const toggleDocument = (documentId) => {
    setReady((current) => {
      const next = new Set(current);
      if (next.has(documentId)) next.delete(documentId);
      else next.add(documentId);
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
        <View style={styles.progressTop}>
          <Text style={styles.progressIcon}>📊</Text>
          <View style={styles.progressTextWrap}>
            <Text style={styles.progressTitle}>{hi ? `${progress.total} में से ${progress.ready} दस्तावेज़ तैयार हैं` : `${progress.ready} of ${progress.total} documents ready`}</Text>
            <Text style={styles.progressHint}>{hi ? 'तैयार दस्तावेज़ पर टैप करें' : 'Tap a document when you have it'}</Text>
          </View>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress.total ? (progress.ready / progress.total) * 100 : 0}%` }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.schemeCard}>
          <Text style={styles.schemeIcon}>{scheme.icon}</Text>
          <Text style={styles.schemeName}>{localized.name}</Text>
        </View>

        {documents.map((document) => {
          const isReady = ready.has(document.id);
          const label = document.languageText?.[language] || document.languageText?.en || document.name;
          const hint = document.hint ? getHint(document.hint, language) : '';
          return (
            <Pressable key={document.id} onPress={() => toggleDocument(document.id)} style={[styles.documentCard, isReady && styles.documentCardReady]} accessibilityRole="checkbox" accessibilityState={{ checked: isReady }}>
              <View style={[styles.checkbox, isReady && styles.checkboxReady]}>
                {isReady && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.documentText}>
                <Text style={[styles.documentName, isReady && styles.documentNameReady]}>{label}</Text>
                {hint ? <Text style={styles.documentHint}>{hint}</Text> : null}
              </View>
              <Text style={styles.tapArrow}>›</Text>
            </Pressable>
          );
        })}

        <View style={styles.noteCard}>
          <Text style={styles.noteIcon}>💡</Text>
          <Text style={styles.noteText}>{hi ? 'दस्तावेज़ की असली जरूरत योजना/राज्य के नियमों पर निर्भर हो सकती है।' : 'Actual document requirements can vary by scheme and state.'}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#E6ECE8' },
  backButton: { minHeight: 48, justifyContent: 'center', alignSelf: 'flex-start', paddingHorizontal: 4 },
  backText: { fontSize: 17, fontWeight: '700', color: '#2E7D32' },
  headerTitle: { fontSize: 27, lineHeight: 34, fontWeight: '800', color: '#172018', marginTop: 2 },
  progressCard: { margin: 16, padding: 16, borderRadius: 16, backgroundColor: '#E8F5E9', borderWidth: 1, borderColor: '#A5D6A7' },
  progressTop: { flexDirection: 'row', alignItems: 'center' },
  progressIcon: { fontSize: 30, marginRight: 12 },
  progressTextWrap: { flex: 1 },
  progressTitle: { fontSize: 18, lineHeight: 24, fontWeight: '800', color: '#1B5E20' },
  progressHint: { marginTop: 3, fontSize: 13, color: '#455A64' },
  progressTrack: { height: 10, marginTop: 14, borderRadius: 5, overflow: 'hidden', backgroundColor: '#C8E6C9' },
  progressFill: { height: '100%', borderRadius: 5, backgroundColor: '#2E7D32' },
  content: { paddingHorizontal: 16, paddingBottom: 28 },
  schemeCard: { flexDirection: 'row', alignItems: 'center', padding: 14, marginBottom: 12, borderRadius: 14, backgroundColor: '#F7F9F7', borderWidth: 1, borderColor: '#E1E8E2' },
  schemeIcon: { fontSize: 34, marginRight: 12 },
  schemeName: { flex: 1, fontSize: 18, lineHeight: 24, fontWeight: '800', color: '#172018' },
  documentCard: { minHeight: 88, marginBottom: 10, padding: 14, borderRadius: 14, borderWidth: 2, borderColor: '#D5DDD7', backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center' },
  documentCardReady: { borderColor: '#2E7D32', backgroundColor: '#F1F8F2' },
  checkbox: { width: 32, height: 32, borderRadius: 8, borderWidth: 2, borderColor: '#78909C', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  checkboxReady: { borderColor: '#2E7D32', backgroundColor: '#2E7D32' },
  checkmark: { fontSize: 21, lineHeight: 24, fontWeight: '900', color: '#FFFFFF' },
  documentText: { flex: 1 },
  documentName: { fontSize: 17, lineHeight: 23, fontWeight: '800', color: '#172018' },
  documentNameReady: { color: '#1B5E20' },
  documentHint: { marginTop: 4, fontSize: 13, lineHeight: 19, color: '#546E7A' },
  tapArrow: { marginLeft: 8, fontSize: 28, color: '#78909C' },
  noteCard: { marginTop: 8, padding: 14, borderRadius: 14, backgroundColor: '#FFF8E1', borderWidth: 1, borderColor: '#FFE082', flexDirection: 'row', alignItems: 'flex-start' },
  noteIcon: { fontSize: 22, marginRight: 10 },
  noteText: { flex: 1, fontSize: 13, lineHeight: 20, color: '#5D5140' },
});
