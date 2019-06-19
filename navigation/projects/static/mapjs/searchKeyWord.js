var searchService,geocoder;
var initSearchKeyWord = function () {
    var latlngBounds = new qq.maps.LatLngBounds();
    //设置Poi检索服务，用于本地检索、周边检索
    searchService = new qq.maps.SearchService({
        //设置搜索范围为北京
        location: "北京",
        //设置搜索页码为1
        pageIndex: 1,
        //设置每页的结果数为5
        pageCapacity: 5,
        //设置展现查询结构到infoDIV上
        panel: document.getElementById('infoDiv'),
        //设置动扩大检索区域。默认值true，会自动检索指定城市以外区域。
        autoExtend: true,
        //检索成功的回调函数
        complete: function (results) {
            // //设置回调函数参数
            var pois = results.detail.pois;
            if(pois.length==0) return;
            $("#infoDiv").show();
            // for (var i = 0, l = pois.length; i < l; i++) {
            //     var poi = pois[i];
            //     //扩展边界范围，用来包含搜索到的Poi点
            //     latlngBounds.extend(poi.latLng);

            // }
            // //调整地图视野
            // map.fitBounds(latlngBounds);
        },
        //若服务请求失败，则运行以下函数
        error: function () {
            alert("出错了。");
        }
    });
    geocoder = new qq.maps.Geocoder({
        complete : function(result){
            map.setCenter(result.detail.location);
        }
    });
    $("#infoDiv").hide();
    $("#hideInfoDiv").click(function(){
        $("#infoDiv").hide();
      });
}
//设置搜索的范围和关键字等属性
var searchKeywordFunction = function () {
    // 根据输入的城市设置搜索范围
    if(document.getElementById("regionText").value!="")
        searchService.setLocation(document.getElementById("regionText").value);
    else
        searchService.setLocation("北京");
    //根据输入的关键字在搜索范围内检索
    searchService.search(document.getElementById("keyword").value);

    $(document).on('click', '#infoDiv ol li',
        function () {
            var address= $(this).find("span:first").text();
            document.getElementById("keyword").value=address;
            geocoder.getLocation(address);
        });
}