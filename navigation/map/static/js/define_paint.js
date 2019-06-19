/**
 * Created by 关某人 on 2019/5/12.
 */
var penPointMarker;
var addKeyPointListener, polylineListener, addPolygonListener, addRectMouseDownListener, addRectMouseMoveListener, addRectMouseUpListener;
var currentColor = "#000";

function KeyPoint(color)
{
  mapCoverObj.call(this, color);
  this.qqMarker = new qq.maps.Circle({
    map: map,
    radius: 3,
    fillColor: this.color,
    strokeColor: qq.maps.Color.fromHex("#FFFFFF", 0.0),
    strokeWeight: 4,
    zIndex:2
  });
}
KeyPoint.prototype = Object.create(mapCoverObj.prototype);
KeyPoint.prototype.constructor = KeyPoint;
var doAddKeyPoint=function(lat, lng)
{
  var newPoint = new KeyPoint(currentColor);
  newPoint.qqMarker.setCenter(new qq.maps.LatLng(lat, lng));
  GeojsonPages[currentPageName].floors[currentFloor].MapCovers.push(newPoint);
}
var addKeyPointFunction = function(event) {
  doAddKeyPoint(event.latLng.getLat(),event.latLng.getLng());
}

function Circle(gps, radius, color)
{
  mapCoverObj.call(this, color);
  this.qqMarker=new qq.maps.Circle({
    map: map,
    center: gps,
    radius: this.radius,
    strokeColor: qq.maps.Color.fromHex("#FFFFFF", 0.0),
    fillColor: this.color,
    strokeWeight: 4,
    zIndex:2
  });
}
Circle.prototype = Object.create(mapCoverObj.prototype);
Circle.prototype.constructor = Circle;

function Polygon(color)
{
  mapCoverObj.call(this,color);
  this.points=[];
  this.qqMarker = new qq.maps.Polygon({
    map: map,
    path:this.points,
    strokeColor: qq.maps.Color.fromHex("#FFFFFF", 0.0),
    strokeWeight: 4,
    fillColor: this.color,
    zIndex:2
  });
}
Polygon.prototype = Object.create(mapCoverObj.prototype);
Polygon.prototype.constructor = Polygon;
var doAddPolygonNewPos = function (lat, lng, newPolygon) {
  newPolygon.points.push(new qq.maps.LatLng(lat, lng));
  newPolygon.qqMarker.setPath(newPolygon.points);
}
var addPolygonNewPosFunction=function(event, newPolygon) {
  penPointMarker.setVisible(true);
  penPointMarker.setCenter(event.latLng);
  doAddPolygonNewPos(event.latLng.getLat(), event.latLng.getLng(),newPolygon);
}

function Rectangle(color)
{
  Polygon.call(this,color);
}
Rectangle.prototype = Object.create(Polygon.prototype);
Rectangle.prototype.constructor = Rectangle;
var addRectMouseDownFunction = function(event, newRect)
{
  for (var i=0;i<4;i++) newRect.points.push(event.latLng);
  qq.maps.event.removeListener(addRectMouseDownListener);
  addRectMouseMoveListener = qq.maps.event.addListener(map, 'mousemove', function(event){addRectMouseMoveFunction(event, newRect);});
  addRectMouseUpListener = qq.maps.event.addListener(map, 'mouseup', function(event){addRectMouseUpFunction(event, newRect);});
}
var addRectMouseMoveFunction = function(event, newRect)
{
  newRect.points[1]=new qq.maps.LatLng(newRect.points[1].getLat(), event.latLng.getLng());
  newRect.points[2]=event.latLng;
  newRect.points[3]=new qq.maps.LatLng(event.latLng.getLat(), newRect.points[0].getLng());
  newRect.qqMarker.setPath(newRect.points);
}
var addRectMouseUpFunction = function(event, newRect)
{
  newRect.points[1]=new qq.maps.LatLng(newRect.points[1].getLat(), event.latLng.getLng());
  newRect.points[2]=event.latLng;
  newRect.points[3]=new qq.maps.LatLng(event.latLng.getLat(), newRect.points[0].getLng());
  newRect.qqMarker.setPath(newRect.points);
  qq.maps.event.removeListener(addRectMouseMoveListener);
  qq.maps.event.removeListener(addRectMouseUpListener);
  map.setOptions({draggable: true});
  map.draggableCursor = "move";
}
