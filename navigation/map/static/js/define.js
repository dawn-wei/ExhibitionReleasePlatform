/**
 * Created by 关某人 on 2019/5/14.
 */

var map;
function initQQMap()
{
  map = new qq.maps.Map(document.getElementById("container"),{
    center: new qq.maps.LatLng(39.7592,116.356666),
    draggableCursor: "move",
    mapStyleId :'style2',
    zoom: 18
  });
  penPointMarker = new qq.maps.Circle({
    map: map,
    radius: 2,
    fillColor: "#00f",
    strokeWeight: 2,
    zIndex:3
  });
  // TODO: 加载
  ReadJsonToGeoPage();
}

var currentPageName = "";
var defaultPageName = "默认地图";
var currentFloor = 1;
var GeojsonPages ={};
function GeojsonPage(name)
{
  this.name = name;
  this.floors = {};
  this.floors[1] = new Floor(1);
  currentFloor = 1;
}
function Floor(idx)
{
  this.mapCoverObjID= 0;
  this.MapCovers=[];
}
function mapCoverObj(color)
{
  this.color = color;
  this.id = GeojsonPages[currentPageName].floors[currentFloor].mapCoverObjID++;
  this.clickListener = null;
  this.qqMarker = null;
}

var AddNewFloorFunction = function()
{
  exitPaintMode();
  exitSelectMode();
  var floorIdx=parseInt(prompt("楼层数：",""));
  if(!isNaN(floorIdx))
  {
    var exist = false;
    Object.keys(GeojsonPages[currentPageName].floors).forEach(function(idx){ if(idx == floorIdx) exist = true; });
    if(exist == true) return;
    GeojsonPages[currentPageName].floors[floorIdx] = new Floor(floorIdx);
    if(currentMarkerList!=false)
    {
      currentMarkerList.forEach(function(marker)
      {
        GeojsonPages[currentPageName].floors[floorIdx].MapCovers.push(marker);
      });
    }
    ReFreshTheQQMap(currentPageName, floorIdx);
  }
};

var AddDetailPageFunction = function () {
  exitPaintMode();
  exitSelectMode();
  var pageName = prompt("详情页名称","");
  if(pageName=="")return;
  var exist = false;
  Object.keys(GeojsonPages).forEach(function(name){if(name==pageName) exist = false;})
  if(exist == true) return;
  GeojsonPages[pageName] = new GeojsonPage(pageName);
  currentPageName = pageName;
  if(currentMarkerList!=false)
  {
    currentMarkerList.forEach(function(marker)
    {
      GeojsonPages[currentPageName].floors[1].MapCovers.push(marker);
    });
  }
  ReFreshTheQQMap(pageName, 1);
};

var ReFreshTheQQMap = function(pageName, floorIdx) {
  console.log(GeojsonPages);
  var pageSelectDom = document.getElementById("pageSelect");
  pageSelectDom.options.length=0;
  if(pageName==defaultPageName) map.setOptions({mapStyleId :'style2'});
  else map.setOptions({mapStyleId :'style1'});
  Object.keys(GeojsonPages).forEach(function(name){
    pageSelectDom.options.add(new Option(name, name));
    if(name==pageName) {
      var floorSelectDom = document.getElementById("floorSelect");
      floorSelectDom.options.length = 0;
      Object.keys(GeojsonPages[name].floors).forEach(function(idx){
        floorSelectDom.options.add(new Option(idx.toString(),idx));
        currentFloor = floorIdx;
        if (idx == floorIdx) {
          GeojsonPages[name].floors[idx].MapCovers.forEach(function(mapCover){
            mapCover.qqMarker.setVisible(true);
          });
        }else{
          GeojsonPages[name].floors[idx].MapCovers.forEach(function(mapCover){
            mapCover.qqMarker.setVisible(false);
          });
        }});
      floorSelectDom.value =floorIdx.toString();
    }
    else{
      Object.keys(GeojsonPages[name].floors).forEach(function(idx){
        GeojsonPages[name].floors[idx].MapCovers.forEach(function(mapCover){
          mapCover.qqMarker.setVisible(false);
        });});
    }});
  pageSelectDom.value=pageName;
};
