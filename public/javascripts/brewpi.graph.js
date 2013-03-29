var palette = new Rickshaw.Color.Palette( { scheme: 'classic9' } );

var graph, slider,
    hoverDetail,
    annotator,
    legend,
    shelving,
    order,
    highlighter,
    smoother,
    xAxis,
    yAxis,
    controls;

var ticksTreatment = 'glow';

var messages = [
  "Changed home page welcome message",
  "Minified JS and CSS",
  "Changed button color from blue to green",
  "Refactored SQL query to use indexed columns",
  "Added additional logging for debugging",
  "Fixed typo",
  "Rewrite conditional logic for clarity",
  "Added documentation for new methods"
];


var socket = new WebSocket("ws://localhost:1081/1.0/event/get");

socket.onopen = function() {
  socket.send(JSON.stringify({
    "expression": "brewpi(beerTempCurrent,beerTempSetting,fridgeTempCurrent,fridgeSetting).eq(beerName,'Maibock')",
    "start": "2013-03-16",
    "stop": "2013-05-18"
  }));
};

var STARTED = false;

socket.onmessage = function(message) {

  var dataObj = JSON.parse(message.data);
  console.log('Data: ', dataObj.data);
  console.log('Time: ', dataObj.time);
  console.log(Date.parse(dataObj.time));



  formatDate = d3.time.format.iso;
  pointTime = formatDate.parse(dataObj.time).getTime();

  seriesData[0].push({ x: pointTime, y: dataObj.data.beerTempCurrent });
  seriesData[1].push({ x: pointTime, y: dataObj.data.beerTempSetting });
  seriesData[2].push({ x: pointTime, y: dataObj.data.fridgeSetting });
  seriesData[3].push({ x: pointTime, y: dataObj.data.fridgeTempCurrent });


  if (!STARTED) {


    // instantiate our graph!

    graph = new Rickshaw.Graph( {
      element: document.getElementById("chart"),
      width: 900,
      height: 500,
      renderer: 'area',
      stroke: true,
      preserve: true,
      series: [
        {
          color: palette.color(),
          data: seriesData[0],
          name: 'Beer Temp Current'
        }, {
          color: palette.color(),
          data: seriesData[1],
          name: 'Beer Temp Setting'
        }, {
          color: palette.color(),
          data: seriesData[2],
          name: 'Fridge Temp Setting'
        }, {
          color: palette.color(),
          data: seriesData[3],
          name: 'Fridge Temp Current'
        }
      ]
    } );



     slider = new Rickshaw.Graph.RangeSlider( {
      graph: graph,
      element: $('#slider')
    } );

     hoverDetail = new Rickshaw.Graph.HoverDetail( {
      graph: graph
    } );

     annotator = new Rickshaw.Graph.Annotate( {
      graph: graph,
      element: document.getElementById('timeline')
    } );

     legend = new Rickshaw.Graph.Legend( {
      graph: graph,
      element: document.getElementById('legend')

    } );

     shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
      graph: graph,
      legend: legend
    } );

     order = new Rickshaw.Graph.Behavior.Series.Order( {
      graph: graph,
      legend: legend
    } );

     highlighter = new Rickshaw.Graph.Behavior.Series.Highlight( {
      graph: graph,
      legend: legend
    } );

     smoother = new Rickshaw.Graph.Smoother( {
      graph: graph,
      element: $('#smoother')
    } );

     xAxis = new Rickshaw.Graph.Axis.Time( {
      graph: graph,
      ticksTreatment: ticksTreatment
    } );



     yAxis = new Rickshaw.Graph.Axis.Y( {
      graph: graph,
      tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
      ticksTreatment: ticksTreatment,
      element: document.getElementById('y_axis')
    } );

    controls = new RenderControls( {
      element: document.querySelector('form'),
      graph: graph
    } );


    graph.render();
    xAxis.render();
    yAxis.render();
    STARTED = true;
  }
  console.log('update: ', seriesData[0].length);

    xAxis.render();
    yAxis.render();
    graph.update();

};
