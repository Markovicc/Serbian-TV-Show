
var chart9 = new Chartist.Bar('#chart9', {
  labels: ['Srbija', 'Crna Gora', 'BiH', 'Makedonija'],
  series: [
    [100, 39, 29, 26 ]
  ]
}, {
  high: 120,
  low: 0,

});

chart9.on('draw', function(data) {
  // If this draw event is of type bar we can use the data to create additional content
  if(data.type === 'bar') {

    data.group.append(new Chartist.Svg('circle', {
      cx: data.x2,
      cy: data.y2,
      r: Math.abs(Chartist.getMultiValue(data.value))/1.5
    }, 'ct-slice-pie'));
  }
});
