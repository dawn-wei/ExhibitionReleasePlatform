/**
 * Created by 关某人 on 2019/5/14.
 */
var deleteClickListener;
var currentMarkerList = [];
var exitSelectMode = function () {
  if(GeojsonPages[currentPageName].floors[currentFloor].MapCovers==false) return;
  GeojsonPages[currentPageName].floors[currentFloor].MapCovers.forEach(function(mapCover)
  {
    mapCover.clickable=false;
    mapCover.cursor = "default";
    mapCover.qqMarker.setStrokeColor(qq.maps.Color.fromHex("#FFFFFF", 0.0));
    if(mapCover.clickListener!==null)
      qq.maps.event.removeListener(mapCover.clickListener);
  })
};
var selectMultiMarkersFunction= function()
{
  exitPaintMode();
  currentMarkerList.length = 0;
  if(GeojsonPages[currentPageName].floors[currentFloor].MapCovers==false) return;
  GeojsonPages[currentPageName].floors[currentFloor].MapCovers.forEach(function(marker) {
    marker.qqMarker.clickable=true;
    marker.cursor ="pointer";
    var pushToList = function (currentMarkerList) {currentMarkerList.push(marker);marker.qqMarker.clickable=false;marker.qqMarker.cursor="move";qq.maps.event.removeListener(marker.clickListener);}
    marker.clickListener = qq.maps.event.addListener(marker.qqMarker,'click', function(event){pushToList(currentMarkerList);highlightCurrentMarkers();});
  });
};
var selectMultiMarkersWithCallback = function(objList, callback)
{
  exitPaintMode();
  if(GeojsonPages[currentPageName].floors[currentFloor].MapCovers==false) return;
  GeojsonPages[currentPageName].floors[currentFloor].MapCovers.forEach(function(marker) {
    marker.qqMarker.clickable=true;
    marker.cursor ="pointer";
    var pushToList = function (event, objList) {
      objList.push(marker);marker.qqMarker.clickable=false;marker.qqMarker.cursor="move";qq.maps.event.removeListener(marker.clickListener);
      //if(event.shiftKey) {document.addEventListener("keyup", releaseShiftToFinish);console.log("shiftKey")}
      //else if(typeof callback == "function") callback(objList);
      }
    marker.clickListener = qq.maps.event.addListener(marker.qqMarker,'click', function(event){pushToList(event,objList);});
  });
  //var releaseShiftToFinish = function(e){
  //  var event = e || window.event;var key = event.which || event.keyCode || event.charCode;// 兼容FF和IE和Opera
  //  if (key == 16) {document.removeEventListener("keyup", releaseShiftToFinish);map.draggableCursor="move";console.log("ReleaseshiftKey");if(typeof callback == "function") callback(objList);}
  //};
};

