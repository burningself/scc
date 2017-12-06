const store = new Vuex.Store({
    state: {
        self_city: '', //当前所在城市
        weather_today: '', //当天天气
    },
    mutations: {
        //位置定位
        dw(state) {
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(showPosition, showError, {
                enableHighAccuracy: true,
                maximumAge: 1000
            });
            //定位成功显示对应城市
            function showPosition(position) {
                var latitude = position.point.lat; // 纬度
                var longitude = position.point.lng; // 经度
                // console.log("当前坐标经度为：" + longitude + "， 纬度为：" + latitude);
                var point = new BMap.Point(longitude, latitude); // 创建点坐标
                var gc = new BMap.Geocoder();
                gc.getLocation(point, function(result) {
                    console.log(result.addressComponents.city);
                    state.self_city = result.addressComponents.city;
                });

            }
            //定位失败处理
            function showError(error) {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        alert("定位失败,用户拒绝请求地理定位");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        alert("定位失败,位置信息是不可用");
                        break;
                    case error.TIMEOUT:
                        alert("定位失败,请求获取用户位置超时");
                        break;
                    case error.UNKNOWN_ERROR:
                        alert("定位失败,定位系统失效");
                        break;
                }
            }
        },

    },
    getters: {

    },
    actions: {

    }
})