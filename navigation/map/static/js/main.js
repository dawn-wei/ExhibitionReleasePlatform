var init = function() {
  initQQMap();
  window.switchToPointMode = switchToPointModeFunction;
  window.switchToRectMode = function () {
    switchToDrawMode();
    map.setOptions({draggable: false});
    var newRect = new Rectangle(currentColor);
    GeojsonPages[currentPageName].floors[currentFloor].MapCovers.push(newRect);
    addRectMouseDownListener = qq.maps.event.addListener(map, 'mousedown', function (event) {
      addRectMouseDownFunction(event, newRect);
    });
  };
  window.switchToPolygonMode = function () {
    switchToDrawMode();
    var newPolygon = new Polygon(currentColor);
    GeojsonPages[currentPageName].floors[currentFloor].MapCovers.push(newPolygon);
    addPolygonListener = qq.maps.event.addListener(map, 'click', function (event) {
      addPolygonNewPosFunction(event, newPolygon);
    });
  };
  window.selectMultiMarkers = selectMultiMarkersFunction;
  window.deleteCurrentMarkers = function ()
  {
    exitSelectMode();
    if(currentMarkerList==false) return;
    currentMarkerList.forEach(function(delMarker) {delMarker.qqMarker.setMap(null);});
  };
  window.addNewFloor = AddNewFloorFunction;
  window.addDetailPage = AddDetailPageFunction;
  window.selectFloorOnChange = function(floor){
    ReFreshTheQQMap(currentPageName, floor.value);
  };
  window.selectPageOnChange = function(page){
    ReFreshTheQQMap(page.value, 1);
  };
  window.assignGPStoActivity = function ()
  {
    exitSelectMode();
    var GPSs = [];
    if(currentMarkerList==false) return;
    currentMarkerList.forEach(function(gpsObj) {
      var gps;
      if(gpsObj instanceof KeyPoint)
        gps = gpsObj.qqMarker.center;
      else if(gpsObj instanceof Rectangle)
        gps=new qq.maps.LatLng((gpsObj.points[0].getLat()+gpsObj.points[2].getLat())*0.5,
          (gpsObj.points[0].getLng()+gpsObj.points[2].getLng())*0.5);
      else if(gpsObj instanceof Polygon)
      {
        var lat = 0.0, lng = 0.0;
        gpsObj.points.forEach(function(pnt){
          lat+=pnt.getLat();
          lng+=pnt.getLng();
        });
        gps = new qq.maps.LatLng(lat/gpsObj.points.length, lng/gpsObj.points.length);
      }
      GPSs.push(gps);
    });
    alert(GPSs.toString());
  };
  window.saveAllToGeoJSON = saveAllToGeoJSONFunction;
}


