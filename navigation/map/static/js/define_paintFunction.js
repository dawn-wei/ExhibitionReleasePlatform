/**
 * Created by 关某人 on 2019/5/14.
 */

var removeAllListeners = function()
{
  penPointMarker.setVisible(false);
  if(addKeyPointListener!==undefined)qq.maps.event.removeListener(addKeyPointListener);
  if(addPolygonListener!==undefined)qq.maps.event.removeListener(addPolygonListener);
};
var enterToExitPaitMode = function(e) {
  var event = e || window.event;var key = event.which || event.keyCode || event.charCode;// 兼容FF和IE和Opera
  if (key == 13) {
    document.removeEventListener("keydown", enterToExitPaitMode);
  }
};
var switchToDrawMode = function()
{
  removeAllListeners();
  map.draggableCursor = "crosshair";
};
var exitPaintMode = function()
{
  removeAllListeners();
};

var highlightCurrentMarkers = function()
{
  GeojsonPages[currentPageName].floors[currentFloor].MapCovers.forEach(function(cover){
    cover.qqMarker.setStrokeColor(qq.maps.Color.fromHex("#FFFFFF", 0.0));});
  currentMarkerList.forEach(function (cover) {
    cover.qqMarker.setStrokeColor(qq.maps.Color.fromHex("#34FFFF", 0.5));
  })
};

//-------------------------------------------Window Function-----------------------------------------------------
var switchToPointModeFunction = function () {
  switchToDrawMode();
  addKeyPointListener = qq.maps.event.addListener(map, 'click', addKeyPointFunction);
};
