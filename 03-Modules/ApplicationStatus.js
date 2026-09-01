import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@jansathi/my-applications';

const localize = (scheme, language) => scheme?.languageText?.[language] || scheme?.languageText?.en || scheme || {};

function formatDate(date) {
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export default function ApplicationStatus({ language, schemes, onBack }) {
  const hi = language === 'hi';
  const [applications, setApplications] = useState([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showSchemes, setShowSchemes] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) setApplications(JSON.parse(saved));
    } catch (error) {
      console.warn(error);
      setMessage(hi ? 'आवेदन लोड नहीं हो पाए।' : 'Applications could not be loaded.');
    }
  }

  async function saveApplications(next) {
    setApplications(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      console.warn(error);
      setMessage(hi ? 'आवेदन save नहीं हो पाया।' : 'Application could not be saved.');
    }
  }

  const schemeOptions = useMemo(() => schemes.map(item => ({
    id: item.id,
    name: localize(item, language).name || item.name,
  })), [schemes, language]);

  const selectedScheme = schemeOptions.find(item => item.id === selectedSchemeId);

  async function addApplication() {
    if (!selectedSchemeId) {
      setMessage(hi ? 'पहले योजना चुनें।' : 'Please select a scheme first.');
      return;
    }

    const entry = {
      id: `${Date.now()}-${selectedSchemeId}`,
      schemeId: selectedSchemeId,
      schemeName: selectedScheme?.name || selectedSchemeId,
      applicationDate: dateKey(selectedDate),
      status: 'in_progress',
    };
    const next = [entry, ...applications];
    await saveApplications(next);
    setSelectedSchemeId('');
    setSelectedDate(new Date());
    setMessage(hi ? 'आवेदन जोड़ दिया गया।' : 'Application added.');
  }

  async function deleteApplication(id) {
    const next = applications.filter(item => item.id !== id);
    await saveApplications(next);
  }

  function openDatePicker() {
    setPickerDate(selectedDate);
    setShowDatePicker(true);
  }

  function changeMonth(delta) {
    setPickerDate(current => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  }

  function chooseDay(day) {
    const chosen = new Date(pickerDate.getFullYear(), pickerDate.getMonth(), day);
    setSelectedDate(chosen);
    setShowDatePicker(false);
  }

  const monthNames = hi
    ? ['जनवरी','फरवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितंबर','अक्टूबर','नवंबर','दिसंबर']
    : ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const weekNames = hi ? ['र', 'सो', 'मं', 'बु', 'गु', 'शु', 'श'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const firstDay = new Date(pickerDate.getFullYear(), pickerDate.getMonth(), 1).getDay();
  const totalDays = daysInMonth(pickerDate.getFullYear(), pickerDate.getMonth());
  const calendarCells = Array.from({ length: firstDay + totalDays }, (_, index) => index < firstDay ? null : index - firstDay + 1);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={onBack} style={styles.back}>
          <Text style={styles.backText}>‹ {hi ? 'वापस' : 'Back'}</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.headerIcon}>📋</Text>
          <View style={styles.headerText}>
            <Text style={styles.title}>{hi ? 'मेरे आवेदन' : 'My Applications'}</Text>
            <Text style={styles.subtitle}>{hi ? 'अपने saved applications यहां देखें' : 'View your saved applications here'}</Text>
          </View>
        </View>

        <View style={styles.addCard}>
          <Text style={styles.cardTitle}>{hi ? 'नया आवेदन जोड़ें' : 'Add a new application'}</Text>

          <Text style={styles.label}>{hi ? 'योजना चुनें' : 'Select scheme'}</Text>
          <Pressable onPress={() => setShowSchemes(true)} style={styles.selectButton}>
            <Text style={[styles.selectText, !selectedScheme && styles.placeholder]}>
              {selectedScheme?.name || (hi ? 'योजना चुनने के लिए दबाएं' : 'Tap to choose a scheme')}
            </Text>
            <Text style={styles.arrow}>⌄</Text>
          </Pressable>

          <Text style={styles.label}>{hi ? 'आवेदन की तारीख' : 'Application date'}</Text>
          <Pressable onPress={openDatePicker} style={styles.selectButton}>
            <Text style={styles.selectText}>{formatDate(selectedDate)}</Text>
            <Text style={styles.calendarIcon}>📅</Text>
          </Pressable>

          <Pressable onPress={addApplication} style={styles.addButton}>
            <Text style={styles.addButtonText}>{hi ? 'आवेदन जोड़ें' : 'Add application'}</Text>
          </Pressable>
          {!!message && <Text style={styles.message}>{message}</Text>}
        </View>

        <Text style={styles.listTitle}>{hi ? 'मेरे saved आवेदन' : 'My saved applications'}</Text>
        {applications.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📄</Text>
            <Text style={styles.emptyTitle}>{hi ? 'अभी कोई आवेदन नहीं है' : 'No applications yet'}</Text>
            <Text style={styles.emptyText}>{hi ? 'ऊपर से अपना पहला आवेदन जोड़ें।' : 'Add your first application above.'}</Text>
          </View>
        ) : applications.map(item => (
          <View key={item.id} style={styles.applicationCard}>
            <View style={styles.applicationMain}>
              <Text style={styles.applicationName}>{item.schemeName}</Text>
              <Text style={styles.applicationDate}>{hi ? 'तारीख' : 'Date'}: {item.applicationDate.split('-').reverse().join('/')}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{hi ? 'प्रक्रिया में' : 'In progress'}</Text>
              </View>
            </View>
            <Pressable onPress={() => deleteApplication(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>{hi ? 'हटाएं' : 'Delete'}</Text>
            </Pressable>
          </View>
        ))}

        <Text style={styles.note}>{hi ? 'यह demo tracker है। असली application status अभी check नहीं किया जाता।' : 'This is a demo tracker. Real application status is not checked yet.'}</Text>
      </ScrollView>

      <Modal visible={showSchemes} transparent animationType="slide" onRequestClose={() => setShowSchemes(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{hi ? 'योजना चुनें' : 'Choose a scheme'}</Text>
            <ScrollView style={styles.schemeList}>
              {schemeOptions.map(item => (
                <Pressable key={item.id} onPress={() => { setSelectedSchemeId(item.id); setShowSchemes(false); setMessage(''); }} style={styles.schemeOption}>
                  <Text style={styles.schemeOptionText}>{item.name}</Text>
                  <Text style={styles.arrow}>›</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable onPress={() => setShowSchemes(false)} style={styles.cancelButton}>
              <Text style={styles.cancelText}>{hi ? 'बंद करें' : 'Close'}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={showDatePicker} transparent animationType="fade" onRequestClose={() => setShowDatePicker(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.dateModal}>
            <Text style={styles.modalTitle}>{hi ? 'तारीख चुनें' : 'Choose date'}</Text>
            <View style={styles.monthRow}>
              <Pressable onPress={() => changeMonth(-1)} style={styles.monthButton}><Text style={styles.monthArrow}>‹</Text></Pressable>
              <Text style={styles.monthTitle}>{monthNames[pickerDate.getMonth()]} {pickerDate.getFullYear()}</Text>
              <Pressable onPress={() => changeMonth(1)} style={styles.monthButton}><Text style={styles.monthArrow}>›</Text></Pressable>
            </View>
            <View style={styles.weekRow}>{weekNames.map((day, index) => <Text key={index} style={styles.weekText}>{day}</Text>)}</View>
            <View style={styles.calendarGrid}>
              {calendarCells.map((day, index) => day ? (
                <Pressable key={index} onPress={() => chooseDay(day)} style={styles.dayButton}>
                  <Text style={styles.dayText}>{day}</Text>
                </Pressable>
              ) : <View key={index} style={styles.dayButton} />)}
            </View>
            <Pressable onPress={() => setShowDatePicker(false)} style={styles.cancelButton}>
              <Text style={styles.cancelText}>{hi ? 'रद्द करें' : 'Cancel'}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF' },
  container: { padding: 20, paddingBottom: 40 },
  back: { paddingVertical: 8, marginBottom: 8 },
  backText: { fontSize: 18, fontWeight: '700', color: '#1B5E20' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  headerIcon: { fontSize: 34, marginRight: 12 },
  headerText: { flex: 1 },
  title: { fontSize: 27, fontWeight: '800', color: '#111' },
  subtitle: { marginTop: 4, fontSize: 14, color: '#555' },
  addCard: { backgroundColor: '#F8FBF8', borderWidth: 1, borderColor: '#D8E8D8', borderRadius: 16, padding: 16, marginBottom: 24 },
  cardTitle: { fontSize: 20, fontWeight: '800', marginBottom: 14 },
  label: { fontSize: 15, fontWeight: '700', marginTop: 10, marginBottom: 7 },
  selectButton: { minHeight: 52, borderWidth: 1, borderColor: '#B8C7B8', borderRadius: 12, backgroundColor: '#FFF', paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  selectText: { flex: 1, fontSize: 16, color: '#111' },
  placeholder: { color: '#777' },
  arrow: { fontSize: 24, color: '#1B5E20' },
  calendarIcon: { fontSize: 20 },
  addButton: { marginTop: 16, minHeight: 52, borderRadius: 12, backgroundColor: '#2E7D32', alignItems: 'center', justifyContent: 'center' },
  addButtonText: { color: '#FFF', fontSize: 17, fontWeight: '800' },
  message: { marginTop: 10, color: '#1B5E20', fontWeight: '600' },
  listTitle: { fontSize: 20, fontWeight: '800', marginBottom: 12 },
  emptyCard: { borderWidth: 1, borderColor: '#DDD', borderRadius: 14, padding: 22, alignItems: 'center' },
  emptyIcon: { fontSize: 30 },
  emptyTitle: { marginTop: 8, fontSize: 17, fontWeight: '700' },
  emptyText: { marginTop: 4, color: '#666', textAlign: 'center' },
  applicationCard: { borderWidth: 1, borderColor: '#DDD', borderRadius: 14, padding: 15, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  applicationMain: { flex: 1 },
  applicationName: { fontSize: 17, fontWeight: '800', color: '#111' },
  applicationDate: { marginTop: 5, color: '#555' },
  statusBadge: { alignSelf: 'flex-start', marginTop: 9, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, backgroundColor: '#FFF3E0' },
  statusText: { color: '#E65100', fontWeight: '800', fontSize: 13 },
  deleteButton: { marginLeft: 10, paddingHorizontal: 10, paddingVertical: 9 },
  deleteText: { color: '#C62828', fontWeight: '800' },
  note: { marginTop: 18, color: '#666', fontSize: 13, lineHeight: 19, textAlign: 'center' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  modalCard: { maxHeight: '82%', backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  dateModal: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, margin: 18 },
  modalTitle: { fontSize: 21, fontWeight: '800', marginBottom: 14 },
  schemeList: { marginBottom: 8 },
  schemeOption: { minHeight: 52, borderBottomWidth: 1, borderBottomColor: '#EEE', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  schemeOptionText: { flex: 1, fontSize: 16, paddingRight: 10 },
  cancelButton: { marginTop: 10, minHeight: 48, borderRadius: 12, backgroundColor: '#F2F2F2', alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontSize: 16, fontWeight: '800' },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  monthButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center' },
  monthArrow: { fontSize: 28, color: '#1B5E20' },
  monthTitle: { fontSize: 18, fontWeight: '800' },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  weekText: { width: '14.28%', textAlign: 'center', fontSize: 12, fontWeight: '700', color: '#666' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayButton: { width: '14.28%', height: 42, alignItems: 'center', justifyContent: 'center' },
  dayText: { fontSize: 16, fontWeight: '600' },
});
