import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import centers from '../04-Data/centers.json';

const COLORS = { green:'#2E7D32', greenDark:'#1B5E20', greenSoft:'#E8F5E9', blue:'#1565C0', blueSoft:'#E3F2FD', orange:'#E65100', orangeSoft:'#FFF3E0', text:'#172018', muted:'#607D68', border:'#DCE5DE', page:'#FFFFFF' };
const FALLBACK_DISTANCES = ['2 km','8 km','12 km','18 km','25 km','3 km','6 km','9 km'];

function haversineKm(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371;
  const toRad = value => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(a));
}

function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export default function CenterLocator({ language, onBack }) {
  const hi = language === 'hi';
  const [locationState, setLocationState] = useState('loading');
  const [userLocation, setUserLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;
    async function loadLocation() {
      try {
        const servicesEnabled = await Location.hasServicesEnabledAsync();
        if (!servicesEnabled) {
          if (active) { setLocationState('fallback'); setErrorMessage(hi ? 'लोकेशन सेवा बंद है।' : 'Location services are off.'); }
          return;
        }
        const permission = await Location.requestForegroundPermissionsAsync();
        if (permission.status !== Location.PermissionStatus.GRANTED) {
          if (active) { setLocationState('fallback'); setErrorMessage(hi ? 'लोकेशन की अनुमति नहीं मिली।' : 'Location permission was not granted.'); }
          return;
        }
        const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        if (active) { setUserLocation(current.coords); setLocationState('located'); }
      } catch (error) {
        console.warn(error);
        if (active) { setLocationState('fallback'); setErrorMessage(hi ? 'लोकेशन नहीं मिल पाई।' : 'Could not get your location.'); }
      }
    }
    loadLocation();
    return () => { active = false; };
  }, [hi]);

  const sortedCenters = useMemo(() => {
    if (!userLocation) {
      return centers.map((center, index) => ({
        ...center,
        calculatedDistance: FALLBACK_DISTANCES[index] || '—',
        numericDistance: index,
      }));
    }
    return centers.map(center => {
      const numericDistance = (typeof center.latitude === 'number' && typeof center.longitude === 'number')
        ? haversineKm(userLocation.latitude, userLocation.longitude, center.latitude, center.longitude)
        : Number.POSITIVE_INFINITY;
      return { ...center, calculatedDistance: formatDistance(numericDistance), numericDistance };
    }).sort((a, b) => a.numericDistance - b.numericDistance);
  }, [userLocation]);

  const call = number => Linking.openURL(`tel:${number}`);

  if (locationState === 'loading') {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={COLORS.green} />
          <Text style={styles.loadingTitle}>{hi ? 'आपकी लोकेशन खोजी जा रही है…' : 'Finding your location…'}</Text>
          <Text style={styles.loadingText}>{hi ? 'पास के centers की दूरी निकाली जा रही है।' : 'Calculating distances to nearby centers.'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.back} accessibilityRole="button"><Text style={styles.backText}>‹ {hi ? 'वापस' : 'Back'}</Text></Pressable>
        <View style={styles.headerRow}>
          <View style={styles.headerIconBox}><Text style={styles.headerIcon}>📍</Text></View>
          <View style={styles.headerText}>
            <Text style={styles.title}>{hi ? 'नज़दीकी सेंटर' : 'Nearby Centers'}</Text>
            <Text style={styles.subtitle}>{userLocation ? (hi ? 'आपकी लोकेशन के अनुसार दूरी' : 'Distances from your location') : (hi ? 'सर्विस सेंटर की सूची' : 'Service center list')}</Text>
          </View>
        </View>
      </View>
      {locationState === 'fallback' && (
        <View style={styles.fallbackBanner}>
          <Text style={styles.fallbackIcon}>ℹ️</Text>
          <Text style={styles.fallbackText}>
            {hi ? 'Aapke paas ke centers dikhane ke liye location chahiye। लोकेशन उपलब्ध नहीं हुई, इसलिए static list दिखाई जा रही है।' : 'Location is needed to show nearby centers. Location was unavailable, so the static list is shown.'}
          </Text>
        </View>
      )}
      <ScrollView contentContainerStyle={styles.content}>
        {sortedCenters.map((center, index) => (
          <View key={`${center.name}-${index}`} style={styles.card}>
            <View style={styles.nameRow}>
              <View style={styles.iconBox}><Text style={styles.icon}>🏢</Text></View>
              <Text style={styles.name} numberOfLines={2}>{center.name}</Text>
            </View>
            <Text style={styles.address}>📍 {center.address}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>📏 {center.calculatedDistance}</Text>
              <Text style={styles.meta}>🕒 {center.timing}</Text>
            </View>
            {center.contactNumber ? <Pressable onPress={() => call(center.contactNumber)} style={styles.callButton} accessibilityRole="button"><Text style={styles.callText}>📞 {hi ? 'Call karein' : 'Call'}</Text></Pressable> : null}
          </View>
        ))}
        <View style={styles.note}>
          <Text style={styles.noteIcon}>ℹ️</Text>
          <Text style={styles.noteText}>
            {userLocation ? (hi ? 'दूरी आपकी वर्तमान लोकेशन से लगभग है।' : 'Distances are approximate from your current location.') : (hi ? 'नोट: लोकेशन उपलब्ध न होने पर पुरानी static दूरी दिखाई जाती है।' : 'Note: The previous static distances are shown when location is unavailable.')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:COLORS.page},header:{paddingHorizontal:20,paddingTop:10,paddingBottom:16,borderBottomWidth:1,borderBottomColor:COLORS.border,backgroundColor:COLORS.page},back:{minHeight:48,justifyContent:'center',alignSelf:'flex-start',paddingHorizontal:4},backText:{fontSize:17,lineHeight:22,fontWeight:'800',color:COLORS.greenDark},headerRow:{flexDirection:'row',alignItems:'center',marginTop:6},headerIconBox:{width:48,height:48,borderRadius:12,backgroundColor:COLORS.blueSoft,alignItems:'center',justifyContent:'center',marginRight:12},headerIcon:{fontSize:27},headerText:{flex:1,minWidth:0},title:{fontSize:27,lineHeight:34,fontWeight:'800',color:COLORS.text},subtitle:{marginTop:4,fontSize:14,lineHeight:20,color:COLORS.muted},fallbackBanner:{marginHorizontal:16,marginTop:12,padding:12,minHeight:56,borderRadius:14,backgroundColor:COLORS.orangeSoft,borderWidth:1,borderColor:'#FFE0B2',flexDirection:'row',alignItems:'flex-start'},fallbackIcon:{fontSize:20,lineHeight:24,marginRight:9},fallbackText:{flex:1,fontSize:13,lineHeight:20,color:'#5D4037'},content:{padding:16,paddingBottom:40},card:{marginBottom:12,padding:16,minHeight:150,borderRadius:16,borderWidth:1,borderColor:COLORS.border,backgroundColor:COLORS.page},nameRow:{flexDirection:'row',alignItems:'center'},iconBox:{width:44,height:44,borderRadius:12,backgroundColor:COLORS.greenSoft,alignItems:'center',justifyContent:'center',marginRight:10},icon:{fontSize:25},name:{flex:1,minWidth:0,fontSize:18,lineHeight:25,fontWeight:'800',color:COLORS.text},address:{marginTop:12,fontSize:15,lineHeight:21,color:'#455A64'},metaRow:{marginTop:10,gap:8},meta:{fontSize:14,lineHeight:20,color:'#546E7A'},callButton:{marginTop:14,minHeight:48,paddingHorizontal:16,borderRadius:12,backgroundColor:COLORS.green,alignItems:'center',justifyContent:'center'},callText:{fontSize:16,lineHeight:20,fontWeight:'800',color:'#FFFFFF'},note:{marginTop:2,padding:14,minHeight:62,borderRadius:14,backgroundColor:COLORS.blueSoft,borderWidth:1,borderColor:'#90CAF9',flexDirection:'row',alignItems:'flex-start'},noteIcon:{fontSize:20,lineHeight:24,marginRight:10},noteText:{flex:1,fontSize:13,lineHeight:20,color:'#37474F'},loadingState:{flex:1,alignItems:'center',justifyContent:'center',padding:28},loadingTitle:{marginTop:14,fontSize:19,lineHeight:26,fontWeight:'800',color:COLORS.text,textAlign:'center'},loadingText:{marginTop:6,fontSize:14,lineHeight:21,color:COLORS.muted,textAlign:'center'}
});