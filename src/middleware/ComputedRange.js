 // 计算运算轨迹 起点 终点 距离

  const Rad = (d) =>{
        return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
  }

 //计算距离，参数分别为第一点 startvalue 的纬度，经度；第二点 endvalue 的纬度，经度
  const computedRange = (startvalue, endvalue) =>{
    //console.log('s-----tartvalue ------ ',startvalue) //s-----tartvalue ------ {"latitude":29.530243, "longitude":106.485114}
    //console.log('e-----ndvalue ------ ',endvalue)//e-----ndvalue ------ {"latitude":29.530243, "longitude":106.485111}
    const radLat1 = Rad(startvalue.latitude);
    const radLat2 = Rad(endvalue.latitude);
    const a = radLat1 - radLat2;
    const b = Rad(startvalue.longitude) - Rad(endvalue.longitude);
    const s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
    Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    const s1 = s *6378.137 ;// EARTH_RADIUS;
    const data = Math.round(s1 * 10000) / 10000; //输出为公里
    //console.log("sss---------  ",data)// sss---- 0.0003
    return data;
  }

 export {
    Rad,
    computedRange
 }