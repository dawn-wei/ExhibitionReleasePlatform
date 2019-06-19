var strFloor = "floor";
var strColor = "color";
var div, svg, projection, path;
var geoStorageObj = {};
var currentFloor =1;
var floorIndices = [];


var init = function () {
  div = document.getElementById('mapContainer');
  window.selectFloorOnChange = function (floor) {
    refreshTheMap(floor.value);
  };
  window.onresize=function(){
    initD3Map();
  }
  readFromJSON();
  if (navigator.geolocation) {
    console.log(navigator.geolocation);
    navigator.geolocation.watchPosition(showUserPosition);
  }
}

var readFromJSON = function () { // TODO: 加载详情页json文件

  /*
  $.get('doc/geoJsonPKU.json').done(function (data) {
    geoStorageObj = data;
    initFloorIndices();
    initD3Map();
  });
  */

  //TODO
  //var detail_name;

  $.ajax({
    url: "/read_json_detail/",
    type: "GET",
    data: JSON.stringify({}),
    //data: {"project_id": project_id_selected},
    dataType: 'json',
    async: false,
    success: function(data){
        //alert("OK");
        //strJSON = JSON.stringify(data);

        geoStorageObj = JSON.stringify(data);
        alert('ok');
        
    },
    error: function(err){
        //alert("error");
    }
  });


    geoStorageObj = JSON.parse(geoStorageObj);
    initFloorIndices();
    initD3Map();

}

var initD3Map = function () {
  var width = div.clientWidth;
  var height = div.clientHeight;
  svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);
  projection = d3.geoMercator().fitExtent([[20, 20], [width, height]], geoStorageObj);
  path = d3.geoPath()
    .projection(projection)
    .pointRadius(0.0);
  refreshTheMap(currentFloor);
}

var initFloorIndices = function () {
  geoStorageObj.features.forEach(function (geoFeature, i) {
    var floorIdx = Number(geoFeature.properties.floor);
    var contained = false;
    floorIndices.forEach(function (idx) { if (idx == floorIdx) contained = true; })
    if (contained === false) {
      var floorSelectDom = document.getElementById("floorSelect");
      floorSelectDom.options.add(new Option(geoFeature.properties.floor, floorIdx));
    } floorIndices.push(floorIdx);
  })
}

var refreshTheMap = function (floorIdx) {
  currentFloor = Number(floorIdx);
  svg.selectAll("circle").remove();
  svg.selectAll("path").remove();
  d3.selectAll(".markerIcon").remove();
  geoStorageObj.features.forEach(function (geoFeature, i) {
    var cover;
    if (geoFeature.geometry.type == "Point") {
      cover = svg.append("circle")
        .datum(geoFeature.geometry)
        .attr("cx", function (geo) {
          return projection(geo.coordinates)[0];
        })
        .attr("cy", function (geo) {
          return projection(geo.coordinates)[1];
        })
        .attr("r", geoFeature.properties.radius)
        .style("fill", geoFeature.properties.color)
        .attr("stroke", geoFeature.properties.color)
        .attr("stroke-width", 1)
        .style('fill-opacity', 0.3)
        .style("visibility", Number(geoFeature.properties.floor) === currentFloor ? "visible" : "hidden")
    }
    else if (geoFeature.geometry.type == "MultiLineString") {
      cover = svg.append("path")
        .attr("stroke", geoFeature.properties.color)
        .attr("stroke-width", 4)
        .attr("d", path(geoFeature.geometry))
        .style('fill-opacity', 0.0)
        .style("visibility", Number(geoFeature.properties.floor) === currentFloor ? "visible" : "hidden")
    }
    else if (geoFeature.geometry.type == "Polygon") {
      cover = svg.append("path")
        .attr("stroke", geoFeature.properties.color)
        .attr("stroke-width", 1)
        .attr("d", path(geoFeature.geometry))
        .attr("fill", geoFeature.properties.color)
        .style('fill-opacity', 0.3)
        .style("visibility", Number(geoFeature.properties.floor) === currentFloor ? "visible" : "hidden")
    }
    else if (geoFeature.geometry.type == "Marker") {
      var left = projection(geoFeature.geometry.coordinates)[0] - 18;
      var top = projection(geoFeature.geometry.coordinates)[1] - 32;
      cover = d3.select("#mapContainer").append("img")
        .style("position", "absolute")
        .style("left", "" + left + "px")
        .style("top", "" + top + "px")
        .attr("src", geoFeature.properties.icon)
        .attr("class", "markerIcon")
        .style("z-index", 1000)
        .style("visibility", Number(geoFeature.properties.floor) === currentFloor ? "visible" : "hidden")
    }
    if (geoFeature.properties.actId != undefined) {
      cover.on("click", function () {
        console.log(geoFeature.properties.actId); // TODO: 如果与活动关联，可以此处触发
        d3.select("h3").text("" + geoFeature.properties.actName);
      });
    }
    else {
      cover.on("click", function () {
        d3.select("h3").text("");
      });
    }
  })
};

function showUserPosition(position) {
  var geoPoint = [];
  geoPoint.push(position.coords.longitude);
  geoPoint.push(position.coords.latitude);
  console.log(geoPoint + "" + projection(geoPoint));
  d3.select("#userPoint")
    .style("position", "absolute")
    .style("left", "" + projection(geoPoint)[0] + "px")
    .style("top", "" + projection(geoPoint)[1] + "px")
    .style("z-index", 1002)
}