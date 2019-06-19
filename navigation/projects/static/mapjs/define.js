/**
 * Created by 关某人 on 2019/5/14.
 */
var map;
function initQQMap() {
  map = new qq.maps.Map(document.getElementById("container"), {
    center: new qq.maps.LatLng(39.7592, 116.356666),
    mapStyleId: 'style2',
    zoom: 18
  });
  initDrawManager();
  ReadJsonToGeoPage();
  initSearchKeyWord();
}

var currentPageName = "";
var defaultPageName = "默认地图";
var currentFloor = 1;
var GeojsonPages = {};
function GeojsonPage(name) {
  this.name = name;
  this.floors = {};
  this.floors[1] = new Floor(1);
  currentFloor = 1;
}
function Floor(idx) {
  this.mapCoverObjID = 0;
  this.MapCovers = [];
}
function mapCoverObj(cover) {
  this.id = GeojsonPages[currentPageName].floors[currentFloor].mapCoverObjID++;
  this.qqCover = cover;
  this.actId = -1;
  this.actName = "";
  this.dtPage = "";
}

var AddNewFloorFunction = function () {
  var floorIdx = parseInt(document.getElementById('floorInput').value);
  if (!isNaN(floorIdx)) {
    var exist = false;
    Object.keys(GeojsonPages[currentPageName].floors).forEach(function (idx) { if (idx == floorIdx) exist = true; });
    if (exist == true) return;
    GeojsonPages[currentPageName].floors[floorIdx] = new Floor(floorIdx);
    if (currentMarkerList != false) {
      currentMarkerList.forEach(function (marker) {
        GeojsonPages[currentPageName].floors[floorIdx].MapCovers.push(marker);
      });
    }
    exitPaintMode();
    exitSelectMode();
    ReFreshTheQQMap(currentPageName, floorIdx);
  }
};

var AddDetailPageFunction = function () {
  if (currentMarkerList == false) return;
  var pageName = document.getElementById('pageInput').value;
  if (pageName == "") return;
  exitPaintMode();
  exitSelectMode();
  if (currentMarkerList != false) {
    var shouldRefresh = false;
    currentMarkerList.forEach(function (marker) {
      if (marker.qqCover instanceof qq.maps.Polyline || marker.qqCover instanceof qq.maps.Marker) { alert("详情页适用于展区，已跳过路线与标注点"); return; }
      if (marker.dtPage != "") { alert("已关联详请页" + marker.dtPage + "，请勿重复添加！"); return; }
      if (GeojsonPages[pageName] == undefined) { GeojsonPages[pageName] = new GeojsonPage(pageName); }
      marker.dtPage = pageName; shouldRefresh = true;
      if (marker.actId != -1) { marker.actId = -1; alert("详情页优先级更高，已取消活动关联"); }
    });
    if (shouldRefresh) ReFreshTheQQMap(pageName, 1);
  }
};

var ReFreshTheQQMap = function (pageName, floorIdx) {
  var pageSelectDom = document.getElementById("pageSelect");
  pageSelectDom.options.length = 0;
  if (pageName == defaultPageName) { $('#DetailPageAddition').collapse('hide'); map.setOptions({ mapStyleId: 'style2' }); }
  else { $('#DetailPageAddition').collapse('show'); map.setOptions({ mapStyleId: 'style1' }); }
  Object.keys(GeojsonPages).forEach(function (name) {
    pageSelectDom.options.add(new Option(name, name));
    if (name == pageName) {
      var floorSelectDom = document.getElementById("floorSelect");
      floorSelectDom.options.length = 0;
      Object.keys(GeojsonPages[name].floors).forEach(function (idx) {
        floorSelectDom.options.add(new Option(idx.toString(), idx));
        currentFloor = floorIdx;
        if (idx == floorIdx) {
          GeojsonPages[name].floors[idx].MapCovers.forEach(function (mapCover) {
            mapCover.qqCover.setVisible(true);
            if (mapCover.dtPage != "") {
              qq.maps.event.addListener(mapCover.qqCover, 'mouseover', function (event) { showBadge(event, "详情页:"+mapCover.dtPage); });
              qq.maps.event.addListener(mapCover.qqCover, 'mousemove', function (event) { showBadge(event, "详情页:"+mapCover.dtPage); });
              qq.maps.event.addListener(mapCover.qqCover, 'mouseout', function (event) { showBadge(event, "详情页:"+mapCover.dtPage); });
            }
            else if (mapCover.actId != -1) {
              qq.maps.event.addListener(mapCover.qqCover, 'mouseover', function (event) { showBadge(event, mapCover.actName); });
              qq.maps.event.addListener(mapCover.qqCover, 'mousemove', function (event) { showBadge(event, mapCover.actName); });
              qq.maps.event.addListener(mapCover.qqCover, 'mouseout', function (event) { showBadge(event, mapCover.actName); });
            }
          });
        } else {
          GeojsonPages[name].floors[idx].MapCovers.forEach(function (mapCover) {
            mapCover.qqCover.setVisible(false);
            qq.maps.event.clearListeners(mapCover.qqCover, 'mouseover');
            qq.maps.event.clearListeners(mapCover.qqCover, 'mousemove');
            qq.maps.event.clearListeners(mapCover.qqCover, 'mouseout');
          });
        }
      });
      floorSelectDom.value = floorIdx.toString();
    }
    else {
      Object.keys(GeojsonPages[name].floors).forEach(function (idx) {
        GeojsonPages[name].floors[idx].MapCovers.forEach(function (mapCover) {
          mapCover.qqCover.setVisible(false);
        });
      });
    }
  });
  currentPageName = pageName;
  pageSelectDom.value = pageName;
};
