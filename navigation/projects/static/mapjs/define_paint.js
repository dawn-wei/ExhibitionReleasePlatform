
var currentColor = new qq.maps.Color(255, 127, 80, 0.3);
var currentIcon = new qq.maps.MarkerImage("/static/mapimg/icons/icon0t.png");
var constShadow = new qq.maps.MarkerImage("/static/mapimg/shadow.png");

var drawingManager;
var initDrawManager = function () {
  drawingManager = new qq.maps.drawing.DrawingManager({
    map:map,
    drawingMode: null,
    drawingControl: false,
    drawingControlOptions: {
      position: qq.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        qq.maps.drawing.OverlayType.MARKER,
        qq.maps.drawing.OverlayType.CIRCLE,
        qq.maps.drawing.OverlayType.POLYGON,
        qq.maps.drawing.OverlayType.POLYLINE,
        qq.maps.drawing.OverlayType.RECTANGLE
      ]
    }
  });
  refreshMarkerOptions();
  refreshDrawOptions();
  qq.maps.event.addListener(drawingManager, 'overlaycomplete', function(cover) {addCoverToMapObj(cover.overlay);});
}
var addCoverToMapObj = function (cover) {
  var newCover = new mapCoverObj(cover);
  GeojsonPages[currentPageName].floors[currentFloor].MapCovers.push(newCover);
}
var refreshMarkerOptions = function()
{
  drawingManager.setOptions({
    markerOptions:{map: map,draggable: true,icon: currentIcon,title: '测试'}});
}
var refreshDrawOptions = function()
{
  drawingManager.setOptions({
    polylineOptions: {map: map, strokeColor: currentColor, strokeWeight:4, clickable: false, editable: true},
    polygonOptions: {map: map, fillColor: currentColor, strokeColor:currentColor, strokeWeight:2, clickable: false, editable: true},
    circleOptions: {map: map, fillColor: currentColor, strokeColor:currentColor, strokeWeight:2, clickable: false, editable: true},
    rectangleOptions: {map: map, fillColor: currentColor, strokeColor:currentColor, strokeWeight:2, clickable: false, editable: true}});
}
var refreshMapCoverOptions = function(isClickable, isEditable)
{ 
  if(GeojsonPages[currentPageName].floors[currentFloor].MapCovers==false) return;
  GeojsonPages[currentPageName].floors[currentFloor].MapCovers.forEach(function(mapCover)
  {
    mapCover.qqCover.clickable=isClickable;
    if(isClickable){
      mapCover.qqCover.cursor = "hand";
    }
    else{
      mapCover.qqCover.cursor = "default";
      if(mapCover.clickListener!==undefined)
        qq.maps.event.removeListener(mapCover.clickListener);
    }
    if(mapCover.qqCover instanceof qq.maps.Marker) {mapCover.qqCover.setDraggable(isEditable);mapCover.qqCover.setShadow(null);}
    else {mapCover.qqCover.setEditable(isEditable);mapCover.qqCover.setOptions({strokeColor: mapCover.qqCover.fillColor});}
  })
}
var enterToExitPaintMode = function(e)
{
  var event = e || window.event; var key = event.which || event.keyCode || event.charCode;// 兼容FF和IE和Opera
  if (key == 13||key==27) {
    exitPaintMode();
    document.removeEventListener("keydown", enterToExitPaintMode);
  }
}
var exitPaintMode = function () {
  $("#PaintBtn").removeClass("btn-warning");
  $("#PaintBtn").addClass("btn-primary");
  $("#paintCollapse").removeClass("in");
  drawingManager.setOptions({drawingControl: false});
  drawingManager.setDrawingMode(null);
  refreshMapCoverOptions(false, false);
};
//-------------------------------------------Window Function-----------------------------------------------------
var switchToPaintModeFunction = function () {
  exitSelectMode();
  $("#PaintBtn").removeClass("btn-primary");
  $("#PaintBtn").addClass("btn-warning");
  $("#paintCollapse").collapse("show")
  drawingManager.setOptions({drawingControl: true});
  drawingManager.setDrawingMode(qq.maps.drawing.OverlayType.MARKER);
  refreshMapCoverOptions(false, true);
  addEventListener("keydown", enterToExitPaintMode);
};
var switchIconFunction = function (icon) {
  switch (icon) {
    case '0': currentIcon = new qq.maps.MarkerImage("/static/mapimg/icons/icon0t.png"); break;
    case '1': currentIcon = new qq.maps.MarkerImage("/static/mapimg/icons/icon1.png"); break;
    case '2': currentIcon = new qq.maps.MarkerImage("/static/mapimg/icons/icon2.png"); break;
    case '3': currentIcon = new qq.maps.MarkerImage("/static/mapimg/icons/icon3.png"); break;
    case '4': currentIcon = new qq.maps.MarkerImage("/static/mapimg/icons/icon4.png"); break;
    case '5': currentIcon = new qq.maps.MarkerImage("/static/mapimg/icons/icon5.png"); break;
    case '6': currentIcon = new qq.maps.MarkerImage("/static/mapimg/icons/icon6.png"); break;
    default: break;
  }
  refreshMarkerOptions();
  $("#currentIcon").attr("src", "/static/mapimg/icons/icon" + icon + ".png");
}

var switchColorFunction = function (color) {
  switch (color) {
    case '1': currentColor = new qq.maps.Color(255, 127, 80, 0.3); break;
    case '2': currentColor = new qq.maps.Color(135, 206, 250, 0.3); break;
    case '3': currentColor = new qq.maps.Color(218, 112, 213, 0.3); break;
    case '4': currentColor = new qq.maps.Color(50, 205, 51, 0.3); break;
    case '5': currentColor = new qq.maps.Color(250, 215, 95, 0.3); break;
    case '6': currentColor = new qq.maps.Color(206, 92, 92, 0.3); break;
    default: break;
  }
  refreshDrawOptions();
  $("#currentColor").attr("src", "/static/mapimg/colors/color" + color + ".jpg");
}