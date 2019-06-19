function getFileUrl(sourceId) {
  var url;
  if (navigator.userAgent.indexOf("MSIE")>=1) { // IE
    url = document.getElementById(sourceId).value;
  } else if(navigator.userAgent.indexOf("Firefox")>0) { // Firefox
    url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
  } else if(navigator.userAgent.indexOf("Chrome")>0) { // Chrome
    url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
  }
  return url;
}
var overlayBoundListener;
var bounds = [];
function addGroundOverlay(fileId) {
  var url = getFileUrl(fileId);
  var groundOverlay = new qq.maps.GroundOverlay;
  groundOverlay.setOptions({
    map: map,
    imageUrl: url,
    //设置覆盖层的透明度
    opacity: 0.4,
    clickable: true,
  });
  var flag =0;
  overlayBoundListener = qq.maps.event.addListener(map, 'click', function(event) {
    bounds[flag] = event.latLng;
    if(bounds.length===1)
    {
      bounds[1] = new qq.maps.LatLng(event.latLng.getLng()+0.001, event.latLng.getLat()+0.001);
    }
    groundOverlay.setBounds(new qq.maps.LatLngBounds(bounds[0],bounds[1]));
    flag = (flag+1)%2;
    yesnoDiv.transition()
      .duration(500)
      .style("opacity",1.0)
      .style("left", (event.Point-48) + "px")
      .style("top", (event.Point-18) + "px");
  });
}
