var init = function() {
  initQQMap();
  window.switchToPaintMode = switchToPaintModeFunction;
  window.switchIcon = function(color){ switchIconFunction(color)};
  window.switchColor = function(color){ switchColorFunction(color)};
  window.switchToSelectMode = switchToSelectModeFunction;
  window.deleteCurrentMarkers = deleteCurrentMarkersFunction;
  window.assignCurrentMarkers = assignCurrentMarkersFunction;
  window.addNewFloor = AddNewFloorFunction;
  window.addDetailPage = AddDetailPageFunction;
  window.selectFloorOnChange = function(floor){
    exitPaintMode();
    exitSelectMode();
    ReFreshTheQQMap(currentPageName, floor.value);
  };
  window.selectPageOnChange = function(page){
    exitPaintMode();
    exitSelectMode();
    ReFreshTheQQMap(page.value, 1);
  };
  window.updateActivityOptions = updateActivityOptionsFunction;
  window.searchKeyword = searchKeywordFunction;
  window.previewDetailPage = previewDetailPageFunction;
  window.saveAllToGeoJSON = saveAllToGeoJSONFunction;
}