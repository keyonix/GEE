// ОБЪЕКТ ImageCollection И ДАННЫЕ SENTINEL-2
  //Вводим переменные
  var bands = ['B1','B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B8A', 'B10', 'B11', 'B12']
  var start = ee.Date('2017-06-01');
  var finish = ee.Date('2017-08-30');
  //Загружаем коллекцию снимков Sentinel-2
  var img = ee.ImageCollection('COPERNICUS/S2')
    //.filterBounds(bounds) // Фильтруем по области интереса
    .filterDate(start,finish) // Фильтруем по датам
    .filter(ee.Filter.lt('CLOUD_COVERAGE_ASSESSMENT',10)); // Фильтруем по облачности
    
  //Понижаем коллекцию снимков до одного снимка с помощью сортировки по метаданным (облачность)
  var image = ee.Image(img.sort('CLOUD_COVERAGE_ASSESSMENT') 
    .first()) // выбираем первый снимок в ранжированном ряду
    .clip(bounds) // обрезаем снимок по области интереса
    .select(bands); // выбираем каналы для работы
  // Задаем параметры визуализации в режиме True colour
  var visParams = {bands: ['B4', 'B3', 'B2'], gamma: 2, min:300, max:5000};
  // Центрируем карту по области интереса
  Map.centerObject(bounds, 9);
  // Добавляем коллекцию снимков на карту
  Map.addLayer(img,visParams,'Image Collection');
  // Добавляем отфильтрованный снимок на карту
  Map.addLayer(image,visParams,'Image');


// РАСЧЕТ ИНДЕКСА NDVI

  //Опция 1. Расчет нормированной разности двух каналов для единичного снимка
    var ndvi=image.normalizedDifference(['B8A', 'B4']);
    // Определяем параметры визуализации для расчнтного слоя NDVI
    var vis = {min: 0, max: 2, palette: [
    'FFFFFF', 'CE7E45', 'FCD163', '66A000', '207401',
    '056201', '004C00', '023B01', '012E01', '011301']};
    // Добавляем слой на карту
    Map.addLayer(ndvi, vis, 'NDVI image');
    
  //Опция 1. Расчет нормированной разности двух каналов серии снимков
    //Определим функцию addNDVI
    function addNDVI(image) {
      var ndvi = image.normalizedDifference(['B8A', 'B4']).rename('NDVI');
      return image.addBands(ndvi);
    }
    // Добавим дополнительный канал NDVI к существующим спектральным каналам в коллекции снимков
    // с помощью вызова функции addNDVI
    var with_ndvi = img.map(addNDVI);
    // Определяем параметры визуализации для коллекции снимков, с помощью визуализации нового канала nd
    var vis_collection = {bands: ['NDVI'], min: 0, max: 2, palette: [
      'FFFFFF', 'CE7E45', 'FCD163', '66A000', '207401',
      '056201', '004C00', '023B01', '012E01', '011301']};
    // Добавляем слой на карту
    Map.addLayer(with_ndvi,vis_collection,'Images+NDVI');