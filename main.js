import React, { Component } from 'react';
import {
    Modal,
    Text,
    View,
    Image,
    Button,
    StyleSheet,
    Dimensions,
    TouchableHighlight,//选中跳转
    TouchableOpacity,
    ScrollView,//页面滚动组件 （默认 一个页面长度大于手机的长度，使用这个组件）
  } from 'react-native'

//导入路由相关的组件
// Router:就相当干昨天我们所学的HashRouter
// Stack:这是一个分组的容器,他不表示具体的路由,专门用来给路由分组的 
// Scene:就表示一个具体的路由规则,好比昨天学到的Route
import {Router,Stack,Scene,Actions} from 'react-native-router-flux'
import MapDemoScreen from './src/screens/MapDemo.js';//MapDemo 地图

export default  class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }
    render() { 
        return ( 
            <Router>
                <Scene key='root'>
                    {/* 地图 */}
                    <Scene key='map' component={MapDemoScreen} title='mapEdit'></Scene>

                </Scene>
            </Router>
         );
    }
};