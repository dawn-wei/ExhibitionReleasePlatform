/**
 * Created by 关某人 on 2019/5/14.
 */
//存储GJSON所用
var strFloor = "floor";
var strColor = "color";
function FeatureObj(mtype)
{
  this.type ="Feature";
  this.geometry = {};
  this.geometry.type = mtype;
  this.geometry.coordinates =[];
  this.properties ={};
}
// qq.maps.LatLng(lat:Number, lng:Number)
// geoPoint.push getLng() getLat());
var ReadJsonToGeoPage = function()
{//TODO:多个页
  for(var i=0;i<1;++i)
  {
    var name =  defaultPageName;//TODO:name 是从JSON存储中获得的,现在暂时只加载default
    currentPageName = name;
    GeojsonPages[currentPageName] = new GeojsonPage(currentPageName);
    var strJSON = prompt("从数据库中读取JSON","");
    if(strJSON!="") {
      var geoStorageObj = JSON.parse(strJSON);if(geoStorageObj!==null)
        geoStorageObj.features.forEach(function(feature)
        {
          currentFloor = feature.properties[strFloor];
          currentColor = feature.properties[strColor];
          if(GeojsonPages[currentPageName].floors[currentFloor]==undefined) GeojsonPages[currentPageName].floors[currentFloor]=new Floor(currentFloor);
          if(feature.geometry.type=="Point"){
            doAddKeyPoint(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
          }
          else if(feature.geometry.type=="Polygon"){
            var newPolygon = new Polygon(currentColor);
            GeojsonPages[currentPageName].floors[currentFloor].MapCovers.push(newPolygon);
            feature.geometry.coordinates.forEach(function(geopnt){
              doAddPolygonNewPos(geopnt[1], geopnt[0], newPolygon);
            });
          }
        });
    }
  }
  currentPageName = defaultPageName;
  currentFloor=1;
  ReFreshTheQQMap(defaultPageName, 1);
};
var saveAllToGeoJSONFunction = function()
{
  Object.keys(GeojsonPages).forEach(function(name){
    var geoStorageObj = {};
    geoStorageObj.type = "FeatureCollection";
    geoStorageObj.features = [];
    Object.keys(GeojsonPages[name].floors).forEach(function(idx){
      GeojsonPages[name].floors[idx].MapCovers.forEach(function(mapCover){
        if(mapCover instanceof KeyPoint) {
          var pointFeature = new FeatureObj("Point");
          pointFeature.geometry.coordinates.push(mapCover.qqMarker.center.getLng());
          pointFeature.geometry.coordinates.push(mapCover.qqMarker.center.getLat());
          pointFeature.properties[strFloor]=idx;
          pointFeature.properties[strColor]=mapCover.color;
          geoStorageObj.features.push(pointFeature);
        }
        else if(mapCover instanceof Rectangle || mapCover instanceof Polygon) {
          var polygonFeature = new FeatureObj("Polygon");
          for(var pointIdx in mapCover.points) {
            var geoPoint = [];
            geoPoint.push(mapCover.points[pointIdx].getLng());
            geoPoint.push(mapCover.points[pointIdx].getLat());
            polygonFeature.geometry.coordinates.push(geoPoint);
          }
          polygonFeature.properties[strFloor]=idx;
          polygonFeature.properties[strColor]=mapCover.color;
          geoStorageObj.features.push(polygonFeature);
        }
      });
    });
    var fileName = name;
    var new_json = JSON.stringify(geoStorageObj);
    alert(new_json);
    console.log(new_json);
  });
};
