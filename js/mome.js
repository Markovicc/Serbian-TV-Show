var chart1 = new Chartist.Line('#chart1', {
  labels:['10. decembar', '11. decembar', '12. decembar', '13. decembar',
               '14. decembar', '15. decembar', '16. decembar', '17. decembar',
               '18. decembar', '19. decembar', '20. decembar'] ,
  series: [[573, 116,  66,  27,  21,  21,  23, 709, 132,  38,   5]]

}, {
  low: 0,
  showArea: true,
  showPoint: false,
  fullWidth: true,
  lineSmooth: Chartist.Interpolation.simple({
    divisor: 3
  })
});

chart1.on('draw', function(data) {
  if(data.type === 'line' || data.type === 'area') {
    data.element.animate({
      d: {
        begin: 2000 * data.index,
        dur: 2000,
        from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
        to: data.path.clone().stringify(),
        easing: Chartist.Svg.Easing.easeOutQuint
      }
    });
  }
});
