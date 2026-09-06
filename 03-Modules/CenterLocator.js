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
        <View style={styles.headerRow}><View style={styles.headerIconBox}><Text style={styles.headerIcon}>📍</Text></View><View style={styles.headerText}><Text style={styles.title}>{hi ? 'नज़दीकी सेंटर' : 'Nearby Centers'}</Text><Text style={styles.subtitle}>{hi ? 'अभी के लिए static center list' : 'Static center list for MVP'}</Text></View></View>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {centers.map((center, index) => (
          <View key={`${center.name}-${index}`} style={styles.card}>
            <View style={styles.nameRow}><View style={styles.iconBox}><Text style={styles.icon}>🏢</Text></View><Text style={styles.name}>{center.name}</Text></View>
            <Text style={styles.address}>📍 {center.address}</Text>
            <View style={styles.metaRow}><Text style={styles.meta}>📏 {center.distance}</Text><Text style={styles.meta}>🕒 {center.timing}</Text></View>
            {center.contactNumber ? <Pressable onPress={() => call(center.contactNumber)} style={styles.callButton} accessibilityRole="button"><Text style={styles.callText}>📞 {hi ? 'Call karein' : 'Call'}</Text></Pressable> : null}
          </View>
        ))}
        <View style={styles.note}><Text style={styles.noteIcon}>ℹ️</Text><Text style={styles.noteText}>{hi ? 'नोट: ये अभी sample/static entries हैं। Real GPS और live center data अगले phase में जोड़ा जाएगा।' : 'Note: These are sample/static entries. Real GPS and live center data will be added later.'}</Text></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:'#FFFFFF'},
  header:{paddingHorizontal:20,paddingTop:10,paddingBottom:16,borderBottomWidth:1,borderBottomColor:'#E4EAE5',backgroundColor:'#FFFFFF'},
  back:{minHeight:48,justifyContent:'center',alignSelf:'flex-start',paddingHorizontal:4},
  backText:{fontSize:17,lineHeight:22,fontWeight:'800',color:'#2E7D32'},
  headerRow:{flexDirection:'row',alignItems:'center',marginTop:6},
  headerIconBox:{width:48,height:48,borderRadius:12,backgroundColor:'#E3F2FD',alignItems:'center',justifyContent:'center',marginRight:12},
  headerIcon:{fontSize:27},
  headerText:{flex:1},
  title:{fontSize:27,lineHeight:34,fontWeight:'800',color:'#172018'},
  subtitle:{marginTop:4,fontSize:14,lineHeight:20,color:'#607D68'},
  content:{padding:16,paddingBottom:40},
  card:{marginBottom:12,padding:16,minHeight:150,borderRadius:16,borderWidth:1,borderColor:'#DCE5DE',backgroundColor:'#FFFFFF'},
  nameRow:{flexDirection:'row',alignItems:'center'},
  iconBox:{width:44,height:44,borderRadius:12,backgroundColor:'#F1F8F2',alignItems:'center',justifyContent:'center',marginRight:10},
  icon:{fontSize:25},
  name:{flex:1,fontSize:18,lineHeight:25,fontWeight:'800',color:'#172018'},
  address:{marginTop:12,fontSize:15,lineHeight:21,color:'#455A64'},
  metaRow:{marginTop:10,gap:8},
  meta:{fontSize:14,lineHeight:20,color:'#546E7A'},
  callButton:{marginTop:14,minHeight:48,paddingHorizontal:16,borderRadius:12,backgroundColor:'#2E7D32',alignItems:'center',justifyContent:'center'},
  callText:{fontSize:16,lineHeight:20,fontWeight:'800',color:'#FFFFFF'},
  note:{marginTop:2,padding:14,minHeight:62,borderRadius:14,backgroundColor:'#E3F2FD',borderWidth:1,borderColor:'#90CAF9',flexDirection:'row',alignItems:'flex-start'},
  noteIcon:{fontSize:20,lineHeight:24,marginRight:10},
  noteText:{flex:1,fontSize:13,lineHeight:20,color:'#37474F'}
});
