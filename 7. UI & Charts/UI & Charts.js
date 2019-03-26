// -------------------------------------
// Создание пользовательского интефейса
// -------------------------------------

// Создаем панель, на которой будем отображать виджеты.
var panel = ui.Panel();
panel.style().set('width', '300px');

// Создаем панель intro с заголовками.
var intro = ui.Panel([
  ui.Label({
    value: 'NDVI Chart Inspector',
    style: {fontSize: '20px', fontWeight: 'bold'}
  }),
  ui.Label('Click a point on the map to inspect.')
]);
panel.add(intro);

// Панель, на которой будут отображаться занчения lon/lat.
var lon = ui.Label();
var lat = ui.Label();
panel.add(ui.Panel([lon, lat], ui.Panel.Layout.flow('horizontal')));

// Регистрация отклика от базовой карты, который осущесвтляется в процессе клика курсором по карте.
Map.onClick(function(coords) {
  // Обновляемя занчения lon/lat на панели в соответствии с получаемыми занчениями при клике на карту.
  lon.setValue('lon: ' + coords.lon.toFixed(2)),
  lat.setValue('lat: ' + coords.lat.toFixed(2));
  var point = ee.Geometry.Point(coords.lon, coords.lat);

  // Создаем график NDVI по временным рядам снимков SENTINEL.
  var ndviChart = ui.Chart.image.series(collection_with_ndvi.select('NDVI'), point, ee.Reducer.mean(), 10);
  ndviChart.setOptions({
    title: 'SENTINEL NDVI',
    vAxis: {title: 'NDVI', maxValue: 1},
    hAxis: {title: 'date', format: 'MM-yy', gridlines: {count: 7}},
  });
  panel.widgets().set(5, ndviChart);
});

Map.style().set('cursor', 'crosshair');

// Добавляем панель в ui.root.
ui.root.insert(0, panel);