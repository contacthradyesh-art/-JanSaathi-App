import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import centers from '../04-Data/centers.json';

export default function CenterLocator({ language, onBack }) {
  const hi = language === 'hi';
  const call = (number) => Linking.openURL(`tel:${number}`);
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.back} accessibilityRole="button"><Text style={styles.backText}>‹ {hi ? 'वापस' : 'Back'}</Text></Pressable>
        <Text style={styles.title}>{hi ? 'नज़दीकी सेंटर' : 'Nearby Centers'}</Text>
        <Text style={styles.subtitle}>{hi ? 'अभी के लिए static center list' : 'Static center list for MVP'}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {centers.map((center, index) => (
          <View key={`${center.name}-${index}`} style={styles.card}>
            <View style={styles.nameRow}><Text style={styles.icon}>🏢</Text><Text style={styles.name}>{center.name}</Text></View>
            <Text style={styles.address}>📍 {center.address}</Text>
            <View style={styles.metaRow}><Text style={styles.meta}>📏 {center.distance}</Text><Text style={styles.meta}>🕒 {center.timing}</Text></View>
            {center.contactNumber ? <Pressable onPress={() => call(center.contactNumber)} style={styles.callButton} accessibilityRole="button"><Text style={styles.callText}>📞 {hi ? 'Call karein' : 'Call'}</Text></Pressable> : null}
          </View>
        ))}
        <View style={styles.note}><Text style={styles.noteText}>{hi ? 'नोट: ये अभी sample/static entries हैं। Real GPS और live center data अगले phase में जोड़ा जाएगा।' : 'Note: These are sample/static entries. Real GPS and live center data will be added later.'}</Text></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:'#FFF'}, header:{paddingHorizontal:20,paddingTop:8,paddingBottom:14,borderBottomWidth:1,borderBottomColor:'#E6ECE8'}, back:{minHeight:48,justifyContent:'center',alignSelf:'flex-start'}, backText:{fontSize:17,fontWeight:'700',color:'#2E7D32'}, title:{fontSize:28,lineHeight:35,fontWeight:'800',color:'#172018'}, subtitle:{marginTop:4,fontSize:14,color:'#607D68'}, content:{padding:16,paddingBottom:28}, card:{marginBottom:12,padding:16,borderRadius:16,borderWidth:1,borderColor:'#DCE5DE',backgroundColor:'#FFF'}, nameRow:{flexDirection:'row',alignItems:'center'}, icon:{fontSize:28,marginRight:10}, name:{flex:1,fontSize:18,lineHeight:24,fontWeight:'800',color:'#172018'}, address:{marginTop:12,fontSize:15,lineHeight:21,color:'#455A64'}, metaRow:{marginTop:10,gap:8}, meta:{fontSize:14,lineHeight:20,color:'#546E7A'}, callButton:{marginTop:14,minHeight:48,borderRadius:12,backgroundColor:'#2E7D32',alignItems:'center',justifyContent:'center'}, callText:{fontSize:16,fontWeight:'800',color:'#FFF'}, note:{marginTop:2,padding:14,borderRadius:14,backgroundColor:'#FFF8E1',borderWidth:1,borderColor:'#FFE082'}, noteText:{fontSize:13,lineHeight:20,color:'#5D5140'}
});
