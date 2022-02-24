import React, {useState, useEffect} from 'react';

import {
  ScrollView,
  FlatList,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  StatusBar,
  Linking,
} from 'react-native';
import * as dropdownvales from './dropDownValues.json';

import {
  VictoryLine,
  VictoryChart,
  VictoryTheme,
  VictoryBar,
  VictoryZoomContainer,
  VictoryTooltip,
  VictoryBrushContainer,
  VictoryVoronoiContainer,
  VictoryAxis,
  createContainer,
  VictoryLabel,
} from 'victory-native';
import {Button, Header, Icon} from 'react-native-elements';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';

import Collapsible from 'react-native-collapsible';

export default function getPositiveCasesCountAPI({navigation}) {
  const [visible, setVisible] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState('Monthly');
  const [selectedYear, setSelectedYear] = useState('2021');
  const [selectedDistrict, setselectedDistrict] = useState('Linz-Land');
  const [showLineChart, setShowLineChart] = useState(true);
  const [loading, setLoading] = useState(true);
  const [visibleYear, setVisibleYear] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState();
  const [zoomDomain, setZoomDomain] = useState();
  const [districtWisePositiveCases, setDistrictWisePositiveCases] = useState(
    [],
  );
  const [modalVisiblePlaces, setModalVisiblePlaces] = useState(false);
  const [state, setState] = useState({data: dropdownvales['Districts']});
  const [query, setQuery] = useState('');
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
                Linking.openURL(
                  'https://www.data.gv.at/katalog/dataset/4b71eb3d-7d55-4967-b80d-91a3f220b60c',
                )
              }>
              link
            </Text>
          </Text>
        </Collapsible>
      </View>
    );
  }
  const showMenu = () => setVisible(true);
  const hideMenu = () => setVisible(false);
  const showMenuYear = () => setVisibleYear(true);
  const hideMenuYear = () => setVisibleYear(false);
  const getSelectedInterval = Interval => {
    setSelectedInterval(Interval);
  };

  const getSelectedYear = year => {
    setSelectedYear(year);
  };

  const getSelectedDistrict = district => {
    setselectedDistrict(district);

    setModalVisiblePlaces(!modalVisiblePlaces);
  };

  const ddvalues = dropdownvales['Districts'];
  const positiveCases = () => {
    Linking.openURL(
      'https://www.data.gv.at/katalog/dataset/4b71eb3d-7d55-4967-b80d-91a3f220b60c',
    );
  };
  /* const encodedDistrict = encodeURIComponent(selectedDistrictName);
  const encodedYear = encodeURIComponent(year);
  const encodedInterval = encodeURIComponent(interval); */
  //brush and zoomDomain
  const VictoryZoomVoronoiContainer = createContainer('zoom', 'voronoi');

  const handleZoom = domain => {
    setSelectedDomain(domain);
  };
  const handleBrush = domain => {
    setZoomDomain(domain);
  };
  const getDistrictData = async () => {
    try {
      const response = await fetch(
        `https://covid19infoapi.appspot.com/api/positivecasesbydistrict/?districtname=${selectedDistrict}&year=${selectedYear}&interval=${selectedInterval}`,
      );
      const json = await response.json();
      setDistrictWisePositiveCases(json.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  let months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'November',
    'December',
  ];

  useEffect(() => {
    getDistrictData();
  }, [selectedDistrict, selectedYear, selectedInterval]);

  function searchData(text) {
    console.log(text);
    const newData = ddvalues.filter(item => {
      const itemData = item.districtName.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    setState({
      data: newData,
    });
    setQuery(text);
  }
  const itemSeparator = () => {
    return (
      <View
        style={{
          height: 0.7,
          width: '100%',
          backgroundColor: '#000',
        }}
      />
    );
  };
  const Item = ({item, onPress, textColor}) => (
    <ScrollView>
      <TouchableOpacity onPress={onPress}>
        <Text style={[textColor, styles.row]}>{item.districtName}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
  const renderItem = ({item}) => {
    const color = item.districtName === selectedDistrict ? 'green' : 'black';

    return (
      <Item
        item={item}
        onPress={() => getSelectedDistrict(item.districtName)}
        textColor={{color}}
      />
    );
  };
  var MyChart = (
    <VictoryLine
      data={districtWisePositiveCases}
      x={'Interval'}
      y={'AnzahlFaelle'}
      style={{
        data: {stroke: '#FF5733', strokeWidth: 3},
        parent: {border: '1px solid #ccc'},
      }}
      interpolation="catmullRom"
    />
  );

  if (loading)
    return (
      <View style={{paddingTop: 150}}>
        <ActivityIndicator />
        <Text style={{textAlign: 'center'}}>Loading...</Text>
      </View>
    );

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <ScrollView>
          <View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisiblePlaces}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisiblePlaces(!modalVisiblePlaces);
              }}>
              <View style={styles.centeredView1}>
                <View style={styles.modalView}>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={text => searchData(text)}
                    value={query}
                    underlineColorAndroid="transparent"
                    placeholder="Search for a city"
                    placeholderTextColor="black"
                  />

                  <FlatList
                    data={state.data}
                    keyExtractor={item => item.id.toString()}
                    ItemSeparatorComponent={itemSeparator}
                    initialNumToRender={5}
                    renderItem={renderItem}
                    style={{marginTop: 10}}
                  />
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisiblePlaces(!modalVisiblePlaces)}>
                    <Text style={styles.ModalButtontextStyle}>Close</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </View>

          <View>
            <View style={styles.row1}>
              <Text style={styles.heading}>
                Positive Cases Count - Districts
              </Text>
              <TouchableOpacity onPress={() => toggleRiskInfo()}>
                <Icon
                  name="information"
                  type="material-community"
                  color="#ED471C"
                  style={{paddingTop: 20, paddingLeft: 20}}
                />
              </TouchableOpacity>
            </View>
            {riskInfo()}
          </View>

          <View
            style={{
              flexDirection: 'row',
              textAlign: 'center',
              justifyContent: 'center',
              paddingTop: 5,
            }}>
            <Text
              style={styles.textStyle}
              onPress={() => setModalVisiblePlaces(true)}>
              {selectedDistrict}
            </Text>

            <Menu
              visible={visible}
              onRequestClose={hideMenu}
              anchor={
                <Text style={styles.textStyle} onPress={showMenu}>
                  {selectedInterval}
                </Text>
              }>
              <MenuItem
                onPress={() => getSelectedInterval('Daily')}
                textStyle={{color: 'black'}}
                pressColor="#0597D8">
                Daily Count
              </MenuItem>
              <MenuItem
                onPress={() => getSelectedInterval('Weekly')}
                textStyle={{color: 'black'}}
                pressColor="#0597D8">
                Group By Week
              </MenuItem>
              <MenuItem
                onPress={() => getSelectedInterval('Monthly')}
                textStyle={{color: 'black'}}
                pressColor="#0597D8">
                Group By Month
              </MenuItem>
              <MenuItem
                onPress={() => getSelectedInterval('Yearly')}
                textStyle={{color: 'black'}}
                pressColor="#0597D8">
                Group By Year
              </MenuItem>
            </Menu>
          </View>

          <VictoryChart
            theme={VictoryTheme.material}
            width={400}
            height={500}
            domainPadding={{x: [2, 20], y: [0, 20]}}
            padding={{top: 100, left: 75, right: 30, bottom: 60}}
            containerComponent={
              <VictoryZoomVoronoiContainer
                allowPan={true}
                allowZoom={true}
                responsive={false}
                zoomDimension="x"
                minimumZoom={{x: 4, y: 0.01}}
                /* zoomDomain={zoomDomain}
              onZoomDomainChange={handleZoom} */
                labels={({datum}) => `cases:${datum.AnzahlFaelle}`}
              />
            }>
            <VictoryAxis
              dependentAxis
              fixLabelOverlap={true}
              tickValues={districtWisePositiveCases.Interval}
              style={{
                axis: {stroke: 'black'},
                ticks: {stroke: 'black'},

                tickLabels: {
                  fill: 'black',
                  fontSize: 14,
                },
                grid: {
                  stroke: 'transparent',
                },
              }}
            />
            <VictoryAxis
              fixLabelOverlap={true}
              independentAxis
              tickLabelComponent={<VictoryLabel angle={-19} y={450} dy={10} />}
              style={{
                axis: {stroke: 'black'},
                ticks: {stroke: 'black'},

                tickLabels: {
                  fill: 'black',
                  fontSize: 14,
                },
                grid: {
                  stroke: 'transparent',
                },
              }}
            />

            {MyChart}
          </VictoryChart>
        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  parametersRow: {
    flexDirection: 'row',
  },

  centeredView: {
    flex: 1,
    alignItems: 'center',
    marginTop: 100,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 320,
  },
  button: {
    width: 100,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  normalButton: {
    width: 70,
    height: 30,
    borderRadius: 50,
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 5,
    paddingLeft: 0,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  /*  buttonClose: {
    backgroundColor: '#F93C2D',
  }, */
  textStyle: {
    fontSize: 16,
    //color: '#0597D8',
    color: '#FF5733',
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  iconSetting: {
    width: 50,
    height: 50,
  },
  headerHeading: {
    fontSize: 16,
    color: '#white',

    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 5,
  },
  heading: {
    fontSize: 16,
    color: '#FF5733',
    //color: '#0597D8',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 20,
  },
  subHeading: {
    textAlign: 'center',
    fontSize: 17,
    color: 'black',
    fontWeight: 'bold',
  },
  flatlistcontainer: {
    height: 300,
  },
  row: {
    fontSize: 18,
    padding: 10,
  },
  textInput: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 280,
    height: 42,
    borderWidth: 1,
    borderColor: '#009688',
    borderRadius: 50,
    backgroundColor: '#FFFF',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  centeredView1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 50,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginLeft: 5,
    width: 120,
  },
  buttonOpen: {
    backgroundColor: 'dodgerblue',
  },
  buttonClose: {
    backgroundColor: '#F93C2D',
  },
  ModalButtontextStyle: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
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
});
