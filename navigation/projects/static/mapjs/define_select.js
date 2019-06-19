/**
 * Created by 关某人 on 2019/5/14.
 */
var deleteClickListener;
var currentMarkerList = [];

var enterToExitSelectMode = function (e) {
  var event = e || window.event; var key = event.which || event.keyCode || event.charCode;// 兼容FF和IE和Opera
  if (key == 13 || key == 27) {
    exitSelectMode();
    document.removeEventListener("keydown", enterToExitSelectMode);
  }
}
var exitSelectMode = function () {
  $("#SelectBtn").removeClass("btn-warning");
  $("#SelectBtn").addClass("btn-primary");
  $("#selectCollapse").removeClass("in");
  setSelectButtonsEnabled(false);
  refreshMapCoverOptions(false, false);
};

var setSelectButtonsEnabled = function(enable){
  if(enable==true)
  {
    if(currentPageName == defaultPageName){ 
      $("#AddDetailPageBtn").removeClass("disabled");
    }
    $("#DeleteBtn").removeClass("disabled");
    $("#assignActBtn").removeClass("disabled");
  }
  else{
    $("#AddDetailPageBtn").addClass("disabled");
    $("#DeleteBtn").addClass("disabled");
    $("#assignActBtn").addClass("disabled");
  }
}

var switchToSelectModeFunction = function () {
  exitPaintMode();
  $("#SelectBtn").removeClass("btn-primary");
  $("#SelectBtn").addClass("btn-warning");
  $("#selectCollapse").collapse("show");
  currentMarkerList.length = 0;
  addEventListener("keydown", enterToExitSelectMode);
  if (GeojsonPages[currentPageName].floors[currentFloor].MapCovers == false) return;
  GeojsonPages[currentPageName].floors[currentFloor].MapCovers.forEach(function (mapCover) {
    mapCover.qqCover.clickable = true;
    mapCover.qqCover.editable = false;
    mapCover.qqCover.cursor = "hand";
    var pushToList = function () {
      currentMarkerList.push(mapCover);
      mapCover.qqCover.clickable = false;
      if (mapCover.qqCover instanceof qq.maps.Marker) { mapCover.qqCover.setShadow(constShadow); }
      else { mapCover.qqCover.setStrokeColor("#1e90ff"); }
      mapCover.qqCover.cursor = "default";
      qq.maps.event.removeListener(mapCover.clickListener);
    };
    mapCover.clickListener = qq.maps.event.addListener(mapCover.qqCover, 'click', function (event) { pushToList(); 
      setSelectButtonsEnabled(true); });
    mapCover.qqCover.strokeColor = mapCover.qqCover.fillColor;
  });
  ReFreshTheQQMap(currentPageName, currentFloor);
};

var activities = {};

var updateActivityOptionsFunction = function () {
  var actSelectDom = document.getElementById("actSelect");
  actSelectDom.options.length = 0;
  /// TODO: 查询现有活动，取活动ID与活动名称


  if (JSON.stringify(activities) == '{}'){
    $.ajax({
    url: "/get_activities/",
    type: "GET",
    data: JSON.stringify({}),
    dataType: 'json',
    async: false,
    success: function(data){
      //alert("OK");
      //activities = data;

      for(var key in data){

        activities[key] = data[key];
      }
    },
    error: function(err){
      //alert("error");
    }
  });
 }

  //activities[1] = "表演";
  //activities[2] = "抽奖";


  ///Mock
  if (activities.length === 0) return;
  var set = false;
  Object.keys(activities).forEach(function (actId) {
    actSelectDom.options.add(new Option(activities[actId], actId));
    if(set===false){actSelectDom.value = actId; set=true;}
  });
}

var showBadge = function (event, name) {
  switch(event.type){
    case 'mouseover': {
      $("#textBadge").show();
      $("#textBadge").css("top", ""+event.cursorPixel.y+"px");
      $("#textBadge").css("left", ""+event.cursorPixel.x+"px");
      $("#textBadge").html(name);
      break;
    }case 'mousemove': {
      $("#textBadge").css("top", ""+event.cursorPixel.y+"px");
      $("#textBadge").css("left", ""+event.cursorPixel.x+"px");
      break;
    }
    case 'mouseout': $("#textBadge").hide();break;
    default: console.log(event); break;
  }
};

var assignCurrentMarkersFunction = function () {
  if (currentMarkerList == false) return;
  var actID = parseInt(document.getElementById('actSelect').value);
  currentMarkerList.forEach(function (mapCover) {
    if(mapCover.qqCover instanceof qq.maps.Polyline) {alert("路线不能用于关联活动！");return;}
    mapCover.actId=actID;
    mapCover.actName = activities[actID];
    qq.maps.event.addListener(mapCover.qqCover, 'mouseover', function (event) { showBadge(event, mapCover.actName);});
    qq.maps.event.addListener(mapCover.qqCover, 'mousemove', function (event) { showBadge(event, mapCover.actName);});
    qq.maps.event.addListener(mapCover.qqCover, 'mouseout', function (event) { showBadge(event, mapCover.actName);});
  });
  exitSelectMode();
};
var deleteCurrentMarkersFunction = function () {
  if (currentMarkerList == false) return;
  currentMarkerList.forEach(function (delMarker) { delMarker.qqCover.setMap(null); });
  exitSelectMode();
};
