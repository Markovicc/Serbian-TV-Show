
var chart10 = new Chartist.Bar('#chart10', {
  labels: ['Niš', 'Beograd', 'Kragujevac', 'Banja Luka', 'Novi Sad'],
  series: [
    [100, 66, 62, 56, 49]

  ]
}, {
  seriesBarDistance: 10,
  reverseData: true,
  horizontalBars: true,
  axisY: {
    offset: 70
  }
});
