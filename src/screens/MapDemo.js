// 地图 运动轨迹
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  PermissionsAndroid,
  Dimensions,
  Platform,
  Button, 
  TouchableOpacity,
} from "react-native";
import {
  init,
  Geolocation,
  setInterval,
  setNeedAddress,
  setLocatingWithReGeocode
} from 'react-native-amap-geolocation';

//地图组件
import { MapView} from 'react-native-amap3d';

// //计算距离
import {computedRange} from '../middleware/ComputedRange.js';

// //计算时间
import {computationTimeTwo} from '../middleware/Computationtime.js';

//bounced 
import ModalBox from 'react-native-modalbox'

//时间
import dayjs from 'dayjs'

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  body: {
    padding: 16,
    paddingTop: Platform.OS === "ios" ? 48 : 16
  },
  result: {
    fontFamily: Platform.OS === "ios" ? "menlo" : "monospace"
  },
  mapBlock:{
    height:'90%',
    width:deviceWidth,
    backgroundColor: 'rgba(0,0,0,0.1)'
  },
  chooseView:{

  },
  modal:{
    height: '30%',
    width:deviceWidth*0.9,
  },
  modalLayer: {
    flex: 1,
    justifyContent: 'center',
    padding: 32
  }  
});

export default class MapDemo extends Component {
  constructor (props) {
    super(props)  
    this.polyline = [];
    this.state= {
        center:{
            latitude:0,
            longitude:0
        },
        line : [
            {
                latitude:0,
                longitude:0
            }
        ],
        isStausChange:false,
        isStausPiont:true,
        isStartcenter:{
          latitude:0,
          longitude:0
        },
        distance:0,
        startTime:'',
        endTime:'',
        spendTime:''
    }
}

  //初始化
  componentDidMount = async () =>{
      if (Platform.OS === "android") {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
      }
      //设置高德key
      await init({
        ios: "高德生成的key",
        android: "高德生成的key"
      });
      console.log('1111111-------   ')
     
      Geolocation.getCurrentPosition(position=>{
        console.log('position-------   ',position)
        let data = 
        {
          latitude:Number(position.coords.latitude),
          longitude:Number(position.coords.longitude)
        }    
        this.setState({
          center:data,
          isStartcenter:data
        })
      });
  }
  //实时定位中心点
  getCenter(lat, long) {
      this.setState({
          center:{
              latitude: lat,
              longitude: long,
          }
      })
  }
  //绘制折线 运动轨迹
  userAnimate(lat, long){
    let coordinate = {
        latitude: lat,
        longitude: long
    }
    console.warn("用户当前的坐标", coordinate)
    console.log("this.polyline----  ", this.polyline)
    this._mapView.animateTo({
        coordinate : coordinate
    })
    this.polyline.push(coordinate)
    this.setState({
        line:[...this.polyline],
    })
  }
  //开始
  _StartExercise = () =>{
    let startTime= dayjs().valueOf()
    this.setState({
      isStausChange:true,
      startTime:new Date()
    })
  }
  //结束  open Gendershow
  _StopExercise = () =>{
    this.refs.GenderModal.open()//打开
    let endTime= new Date()
    //computedRange
    let startvalue = this.polyline[0]
    let endvalue = this.polyline[this.polyline.length-1]
    let distance = computedRange(startvalue,endvalue)
    this.setState({
      isStausChange:false,
      isStausPiont:false,
      endTime:endTime,
      spendTime:computationTimeTwo(this.state.startTime),
      distance:distance
    })
  }

  //close Gendershow
  closeGenderVisible = () => {
    this.refs.GenderModal.close();//关闭
  }

  render() {
      return (            
          <View style={{flex:1}}>
              <MapView style={styles.mapBlock}
                  mapType = "standard" //地图类型  standard: 标准地图  satellite: 卫星地图 navigation: 导航地图 night: 夜间地图  bus: 公交地图
                  ref={(ref) => {this._mapView = ref}}    
                  locationStyle={{fillColor:'rgba(0,0,0,0)',strokeWidth:0}}
                  locationEnabled={this.state.isStausChange} // 是否启用定位
                  locationInterval={1} //定位间隔(ms)，默认 2000
                  distanceFilter={2} //定位的最小更新距离
                  showsBuildings={true} //是否显示3D建筑
                  showsZoomControls={false} //是否显示放大缩小按钮
                  showsCompass={true} //是否显示指南针
                  showsScale={false} //是否显示比例尺
                  showsLabels={true} //是否显示文本标签
                  scrollEnabled={true}//是否启用滑动手势，用于平移
                  rotateEnabled={true} //是否启用旋转手势，用于调整方向
                  tiltEnabled={true} //是否启用倾斜手势，用于改变视角
                  coordinate={this.state.center} //中心坐标
                  zoomLevel={18}//当前缩放级别，取值范围 [3, 20]
                  zoomEnabled={true} //是否启用缩放手势，用于放大缩小
                  // minZoomLevel = {18}//最大缩放级别
                  // minZoomLevel ={5}//最小缩放级别
                  onLocation={({ nativeEvent }) => {
                      // console.log("经度纬度",`${nativeEvent.latitude}, ${nativeEvent.longitude}`)
                      this.getCenter(nativeEvent.latitude, nativeEvent.longitude)
                      this.userAnimate(nativeEvent.latitude, nativeEvent.longitude)
                  }}
              >   
                <MapView.Marker
                  active
                  key={Math.random()}
                  title='起点'//标题，作为默认的选中弹出显示
                  color='red'
                  // description='起点'//描述，显示在标题下方
                  draggable={false}//是否可拖拽
                  clickDisabled={false} // 是否禁用点击，默认不禁用
                  coordinate={this.state.isStartcenter}
                >
                </MapView.Marker>
                {
                  this.state.isStausPiont == false ?(
                    <MapView.Marker
                    active
                    //flat={true}//是否平贴地图
                    key={Math.random()}
                    title='终点'//标题，作为默认的选中弹出显示
                    color='red'
                    // description='起点'//描述，显示在标题下方
                    draggable={false}//是否可拖拽
                    clickDisabled={false} // 是否禁用点击，默认不禁用
                    coordinate={this.state.center}
                  >
                  </MapView.Marker>
                  ):null
                }
                <MapView.Polyline
                    key={Math.random()}
                    ref={ref=>{this._polyline = ref}}
                    dashed={true}
                    width={10}
                    color='rgba(255, 0, 0, 0.5)'
                    coordinates={this.state.line}
                />
              </MapView>
              <View >
              <Button
                onPress={() => this._StartExercise()}
                title="开始"
                color="#17C6AC"
              />
              <Button
                onPress={() =>this._StopExercise()}
                title="结束"
                color="#17C6AC"
              />
              </View>
              <ModalBox 
                 style={styles.modal} 
                 ref={"GenderModal"} 
                 position="center"
                 isDisabled={false}
                 backdropPressToClose={false}
                >
                  <View style={styles.modalLayer}>
                    <Text>使用时间： {this.state.spendTime}</Text>
                    <Text>奔跑距离： {this.state.distance}</Text>
                    <View style={styles.modalButtonStyle}>
                        <Button 
                            title='保存' 
                            color="#17C6AC"
                            onPress={this.closeGenderVisible}
                        ></Button>
                    </View>
                  </View>
                </ModalBox>
          </View>
      );
  }
}