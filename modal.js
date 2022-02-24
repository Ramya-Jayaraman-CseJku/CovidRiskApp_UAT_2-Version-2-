import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  Linking,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Button, Header, Icon} from 'react-native-elements';

import BehavioralProperties from './BehavioralProperties';
import RoomProperties from './RoomProperties';
import InfectedPersonProperties from './InfectedPersonProperties';
import ModalParameters from './data';
import RiskInfoandSimulation from './riskInfectionCalculation';
import Collapsible from 'react-native-collapsible';

export default function ModelParamSelection() {
  //behavior
  const [maskCateogoryPpl, setMaskCategoryPpl] = useState('None');
  const [maskEfficiencyI, setMaskEfficiencyI] = useState(0);
  const [maskEfficiencyN, setMaskEfficiencyN] = useState(0);
  const [maskTypeI, setMaskTypeI] = useState('None');
  const [maskTypeN, setMaskTypeN] = useState('None');
  const [vaccination, setVaccination] = useState('None');
  //room
  const [eventType, setEventType] = useState('Classroom');
  const [roomSize, setRoomSize] = useState(60);
  const [durationofStay, setDurationofStay] = useState(12);
  const [noOfPeople, setNoOfPeople] = useState(24);
  const [ventilation, setVentilation] = useState(0.35);
  const [ventilationType, setVentilationType] = useState('None');
  const [ceilingHeight, setCeilingHeight] = useState(3);
  //infected person
  const [speechVolume, setSpeechVolume] = useState(2);
  const [speechDuration, setSpeechDuration] = useState(10);
  //modal parameters text
  const [speechDurationinTime, setSpeechDurationinTime] = useState('None');
  const [speechVolumeText, setSpeechVolumeText] = useState('None');
  const [showRiskInfo, setShowRiskInfo] = useState(true);

  const toggleRiskInfo = () => {
    //Toggling the state of single Collapsible
    setShowRiskInfo(!showRiskInfo);
  };
  function riskInfo() {
    return (
      <View style={styles.REffText1}>
        <Collapsible collapsed={showRiskInfo}>
          <Text style={styles.REffText}>
            Click on the link below to know about datasources used in COVID-19
            Positive Cases Count chart<Text>{'  '}</Text>
            <Text
              style={[styles.REffText, {color: 'blue'}]}
              onPress={() =>
                Linking.openURL('https://www.mpic.de/4747361/risk-calculator')
              }>
              link
            </Text>
          </Text>
        </Collapsible>
      </View>
    );
  }
  const behavioralProps = {
    maskCateogoryPpl,
    maskEfficiencyI,
    maskEfficiencyN,
    vaccination,
    eventType,
    roomSize,
    durationofStay,
    noOfPeople,
    ventilation,
    ceilingHeight,
    speechVolume,
    speechDuration,
    maskTypeI,
    maskTypeN,
    ventilationType,
    speechDurationinTime,
    speechVolumeText,
    setMaskCategoryPpl,
    setMaskEfficiencyI,
    setMaskEfficiencyN,
    setVaccination,
    setEventType,
    setRoomSize,
    setDurationofStay,
    setNoOfPeople,
    setVentilation,
    setCeilingHeight,
    setSpeechVolume,
    setSpeechDuration,
    setMaskTypeI,
    setMaskTypeN,
    setVentilationType,
    setSpeechDurationinTime,
    setSpeechVolumeText,
  };
  /* console.log({selectedEventType});
  console.log({maskCateogoryPpl});
  console.log({roomSize});
  console.log({durationofStay});
  console.log({noOfPeople});
  console.log({maskEfficiencyI});
  console.log({maskEfficiencyN});
  console.log({vaccination});
  console.log({ventilation});
  console.log({ceilingHeight});
  console.log({speechDuration});
  console.log({speechVolume}); */
  return (
    <View styles={styles.container}>
      <ScrollView>
        <>
          <View>
            <View style={styles.row1}>
              <Text style={styles.heading}>Modal Parameters</Text>
              <TouchableOpacity onPress={() => toggleRiskInfo()}>
                <Icon
                  name="information"
                  type="material-community"
                  color="#9239FE"
                  style={{paddingTop: 10, paddingLeft: 20}}
                />
              </TouchableOpacity>
            </View>
            {riskInfo()}
          </View>
          <BehavioralProperties todos={behavioralProps} />
          <RoomProperties roomprops={behavioralProps} />
          <InfectedPersonProperties infectedpplprops={behavioralProps} />
          <ModalParameters todos={behavioralProps} />
          <RiskInfoandSimulation todos={behavioralProps} />
        </>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    backgroundColor: '#DAE1DE',
  },

  default: {
    color: 'black',
  },
  REffText: {
    fontSize: 16,

    paddingTop: 5,

    textAlign: 'left',
    marginLeft: 7,
    marginRight: 5,
    color: 'black',
  },
  REffText1: {
    paddingTop: 5,
    height: 50,
    paddingBottom: 20,
    textAlign: 'left',
    marginLeft: 7,
    marginRight: 5,
    color: 'black',
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 18,
    color: '#9239FE',
    //color: '#0597D8',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 10,
  },
});
