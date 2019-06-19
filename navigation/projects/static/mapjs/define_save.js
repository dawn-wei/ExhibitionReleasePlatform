/**
 * Created by 关某人 on 2019/5/14.
 */
//存储GJSON所用
var strFloor = "floor";
var strAct = "actId";
var strActName = "actName";
var strPage = "dtPage";
//专有
var strColor = "color";
var strRadius = "radius";
var strIcon = "icon";
var strGrav = "gravPnt";
var geoStorageObj;
function FeatureObj(mtype) {
  this.type = "Feature";
  this.geometry = {};
  this.geometry.type = mtype;
  this.geometry.coordinates = [];
  this.properties = {};
}
var ReadJsonToGeoPage = function () {//TODO:多个页
  for (var i = 0; i < 1; ++i) {
    var name = defaultPageName;//TODO:name 是从JSON存储中获得的,现在暂时只加载default
    currentPageName = name;
    GeojsonPages[currentPageName] = new GeojsonPage(currentPageName);

  
    var strJSON = "";

    // read map_data from db
    $.ajax({
      url: "/read_json/",
      type: "GET",
      data: JSON.stringify({}),
      dataType: 'json',
      async: false,
      success: function(data){
        //alert("OK");
        /*
        if(data['exists'] == 1){

          strJSON = data['data'];
        }
        else{
          strJSON = "";
        }
        */
        strJSON = JSON.stringify(data);
      },
      error: function(err){
        //alert("error");
      }
    });


    //var strJSON = prompt("从数据库中读取JSON", "");// TODO: 从数据库中读取默认地图
    if (strJSON != "") {

      var geoStorageObj = JSON.parse(strJSON); if (geoStorageObj !== null)
        var latlngBounds = new qq.maps.LatLngBounds();
      latlngBounds.extend(new qq.maps.LatLng(geoStorageObj.bounds[0].lat, geoStorageObj.bounds[0].lng));
      latlngBounds.extend(new qq.maps.LatLng(geoStorageObj.bounds[1].lat, geoStorageObj.bounds[1].lng));
      map.fitBounds(latlngBounds);
      geoStorageObj.features.forEach(function (feature) {
        currentFloor = feature.properties[strFloor];
        if (GeojsonPages[currentPageName].floors[currentFloor] == undefined) GeojsonPages[currentPageName].floors[currentFloor] = new Floor(currentFloor);
        var mapCover = new mapCoverObj(null);
        if (feature.geometry.type == "Point") {
          mapCover.qqCover = new qq.maps.Circle({
            map: map,
            center: new qq.maps.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]),
            radius: feature.properties[strRadius],
            fillColor: qq.maps.Color.fromHex(feature.properties[strColor], 0.3),
            strokeColor: qq.maps.Color.fromHex(feature.properties[strColor], 0.3),
            strokeWeight: 2, clickable: false, editable: false
          });
        }
        else if (feature.geometry.type == "Marker") {
          mapCover.qqCover = new qq.maps.Marker({
            map: map, draggable: true, icon: feature.properties[strIcon], shadow: null,
            position: new qq.maps.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]),
          });
        }
        else if (feature.geometry.type == "Polygon" || feature.geometry.type == "MultiLineString") {
          var onlyLine = [];
          feature.geometry.coordinates[0].forEach(function (geopnt) {
            onlyLine.push(new qq.maps.LatLng(geopnt[1], geopnt[0]));
          });
          if (feature.geometry.type == "Polygon")
            mapCover.qqCover = new qq.maps.Polygon({
              map: map, path: onlyLine, fillColor: qq.maps.Color.fromHex(feature.properties[strColor], 0.3),
              strokeColor: qq.maps.Color.fromHex(feature.properties[strColor], 0.3), strokeWeight: 2, clickable: false, editable: false
            });
          else
            mapCover.qqCover = new qq.maps.Polyline({
              map: map, path: onlyLine,
              strokeColor: qq.maps.Color.fromHex(feature.properties[strColor], 0.3), strokeWeight: 4, clickable: false, editable: false
            });
        }
        if (feature.properties[strPage] != undefined) 
        {
          mapCover.dtPage = feature.properties[strPage];
          qq.maps.event.addListener(mapCover.qqCover, 'mouseover', function (event) { showBadge(event, "详情页:"+ mapCover.dtPage); });
          qq.maps.event.addListener(mapCover.qqCover, 'mousemove', function (event) { showBadge(event, "详情页:"+mapCover.dtPage); });
          qq.maps.event.addListener(mapCover.qqCover, 'mouseout', function (event) { showBadge(event, "详情页:"+mapCover.dtPage); });
        }
        else if (feature.properties[strAct] != undefined) { 
          qq.maps.event.addListener(mapCover.qqCover, 'mouseover', function (event) { showBadge(event, mapCover.actName); });
          qq.maps.event.addListener(mapCover.qqCover, 'mousemove', function (event) { showBadge(event, mapCover.actName); });
          qq.maps.event.addListener(mapCover.qqCover, 'mouseout', function (event) { showBadge(event, mapCover.actName); });
          mapCover.actId = feature.properties[strAct]; mapCover.actName = feature.properties[strActName];}
        GeojsonPages[currentPageName].floors[currentFloor].MapCovers.push(mapCover);
      });
    }
  }
  currentPageName = defaultPageName;
  currentFloor = 1;
  ReFreshTheQQMap(defaultPageName, 1);
};

var saveAllToGeoJSONFunction = function () {
  Object.keys(GeojsonPages).forEach(function (name) {
    geoStorageObj = {};
    geoStorageObj.type = "FeatureCollection";
    geoStorageObj.features = [];
    var pageBounds = new qq.maps.LatLngBounds();
    Object.keys(GeojsonPages[name].floors).forEach(function (idx) {
      GeojsonPages[name].floors[idx].MapCovers.forEach(function (mapCover) {
        var thisfeature;
        if (mapCover.qqCover.map == null) return ;
        if (mapCover.qqCover instanceof qq.maps.Circle) {
          var thisfeature = new FeatureObj("Point");
          thisfeature.geometry.coordinates.push(mapCover.qqCover.center.getLng());
          thisfeature.geometry.coordinates.push(mapCover.qqCover.center.getLat());
          pageBounds.extend(mapCover.qqCover.center);
          thisfeature.properties[strColor] = mapCover.qqCover.strokeColor.toHex();
          thisfeature.properties[strRadius] = mapCover.qqCover.radius;
        }
        else if (mapCover.qqCover instanceof qq.maps.Marker) {//注意判断有无map,以处理删除！
          var thisfeature = new FeatureObj("Marker");
          thisfeature.geometry.coordinates.push(mapCover.qqCover.position.getLng());
          thisfeature.geometry.coordinates.push(mapCover.qqCover.position.getLat());
          pageBounds.extend(mapCover.qqCover.position);
          thisfeature.properties[strIcon] = mapCover.qqCover.icon.url;
        }
        else if (mapCover.qqCover instanceof qq.maps.Polygon || mapCover.qqCover instanceof qq.maps.Polyline) {
          var latlngBounds;
          if (mapCover.actId != null || mapCover.dtPage != false) { latlngBounds = new qq.maps.LatLngBounds(); }
          if (mapCover.qqCover instanceof qq.maps.Polygon) thisfeature = new FeatureObj("Polygon");
          else thisfeature = new FeatureObj("MultiLineString");
          var onlyLine = [];
          for (var pointIdx in mapCover.qqCover.path.elems) {
            var geoPoint = [];
            if (mapCover.actId != null || mapCover.dtPage != false) latlngBounds.extend(mapCover.qqCover.path.elems[pointIdx]);
            geoPoint.push(mapCover.qqCover.path.elems[pointIdx].getLng());
            geoPoint.push(mapCover.qqCover.path.elems[pointIdx].getLat());
            pageBounds.extend(mapCover.qqCover.path.elems[pointIdx]);
            onlyLine.push(geoPoint);
          }
          if (mapCover.qqCover instanceof qq.maps.Polygon) { onlyLine.push(onlyLine[0]); } thisfeature.geometry.coordinates.push(onlyLine);
          thisfeature.properties[strColor] = mapCover.qqCover.strokeColor.toHex();
          if (mapCover.actId != null || mapCover.dtPage != false) { thisfeature.properties[strGrav] = latlngBounds.getCenter(); }
        }
        if (mapCover.dtPage != "")
          thisfeature.properties[strPage] = mapCover.dtPage;
        else if (mapCover.actId != -1) {
          thisfeature.properties[strAct] = mapCover.actId;
          thisfeature.properties[strActName] = mapCover.actName;
        }
        thisfeature.properties[strFloor] = idx;
        geoStorageObj.features.push(thisfeature);
      });
    });

    if(geoStorageObj.features.length!=0){
      geoStorageObj.bounds = [];
      geoStorageObj.bounds.push(pageBounds.getNorthEast());
      geoStorageObj.bounds.push(pageBounds.getSouthWest());
      geoStorageObj.initialPnt = pageBounds.getCenter();
      var fileName = name; // TODO: 区分默认地图与详情页
      var new_json = JSON.stringify(geoStorageObj);
      console.log(new_json);

    }

    if(fileName == "默认地图"){
      $.ajax({
        url: "/save_json/",
        type: "POST",
        data: new_json,
        dataType: 'json',
        success: function(data){
          alert("OK");
        },
        error: function(err){
          alert("error");
        }
      });
    }
    
    else{

      var json_detail = {'page_name': fileName, 'map_data': geoStorageObj};
      
      $.ajax({
        url: "/save_json_detailedpage/",
        type: "POST",
        data: JSON.stringify(json_detail),
        dataType: 'json',
        success: function(data){
          alert("OK");
        },
        error: function(err){
          alert("error");
        }
      });
    }

  });
};

var previewDetailPageFunction = function () {
  console.log(document.getElementById("pageSelect").value);

  // read detail page from db

  var detail_name = document.getElementById("pageSelect").value;

  $.ajax({
    url: "/set_preview/",
    type: "POST",
    data: JSON.stringify({'detail_name': detail_name}),
    dataType: 'json',
    success: function(data){
      //alert("OK");
    },
    error: function(err){
      //alert("error");
    }
  });
  

  window.open("/preview.html/"); // TODO: 同小程序访问webview一样，可以以FengMapD3Viewer的方式打开详情页
}