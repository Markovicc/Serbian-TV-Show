var act = ["Andrija Kuzmanović", "Dragan Bjelogrlić", "Marija Bergam", "Nenad Jezdić","Žarko Laušević"];



var margin3 = {top: 10, right: 10, bottom: 10, left: 10},
    width3 = 900 - margin.left - margin.right,
    height3 = 350 - margin.top - margin.bottom;


var x3 = d3.scaleLinear().range([0, width3]);
var y3 = d3.scaleLinear().range([height3, 0]);

var valuearea1 = d3.area()
    .x(function(d) { return x3(d.dan); })
    .y0(height3)
    .y1(function(d) { return y3(d.ak); })
    .curve(d3.curveBasis);

var valuearea2 = d3.area()
    .x(function(d) { return x3(d.dan); })
    .y0(height3)
    .y1(function(d) { return y3(d.db); })
    .curve(d3.curveBasis);

var valuearea3 = d3.area()
    .x(function(d) { return x3(d.dan); })
    .y0(height3)
    .y1(function(d) { return y3(d.mb); })
    .curve(d3.curveBasis);

var valuearea4 = d3.area()
  .x(function(d) { return x3(d.dan); })
  .y0(height3)
  .y1(function(d) { return y3(d.nj); })
  .curve(d3.curveBasis);

var valuearea5 = d3.area()
  .x(function(d) { return x3(d.dan); })
  .y0(height3)
  .y1(function(d) { return y3(d.zl); })
  .curve(d3.curveBasis);


var svg4 = d3.select("#chart_down").append("svg")
    .attr("width", width3 + margin.left + margin.right)
    .attr("height", height3 + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


d3.csv("data/actors.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.dan = +d.dan;
      d.ak = +d.ak;
      d.db = +d.db;
      d.mb= +d.mb;
      d.nj= +d.nj;
      d.zl= +d.zl;
  });


  x3.domain(d3.extent(data, function(d) { return d.dan; }));
  y3.domain([7,100]);

  svg4.append("path")
    .data([data])
    .attr("class", "valuearea1")
    .attr("d", valuearea1);

  svg4.append("path")
    .data([data])
    .attr("class", "valuearea2")
    .attr("d", valuearea2);

    svg4.append("path")
        .data([data])
        .attr("class", "valuearea3")
        .attr("d", valuearea3);


  svg4.append("path")
   .data([data])
   .attr("class", "valuearea4")
   .attr("d", valuearea4);



  svg4.append("path")
    .data([data])
    .attr("class", "valuearea5")
    .attr("d", valuearea5);


  svg4.append("g")
      .attr("transform", "translate(0," + height3 + ")")
      .call(d3.axisBottom(x3));


  svg4.append("g")
      .call(d3.axisLeft(y3)
      .ticks(5));

  svg4.append("text")
      .attr("x", (width3/2))
      .attr("y", 0 - (margin.top-25))
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("text-decoration", "underline")
      .text("Uporedni podaci sa Google Trends za prethodnih 30 dana");

  svg4.append("circle")
      .attr("r", 5)
      .style("fill", "DarkRed")
      .attr("transform", "translate(700,35)");

  svg4.append("circle")
      .attr("r", 5)
      .style("fill", "SkyBlue")
      .style("opacity",0.4)
      .attr("transform", "translate(700,50)");


  svg4.append("circle")
          .attr("r", 5)
          .style("fill", "Plum")
          .style("opacity",0.4)
          .attr("transform", "translate(700,65)");

  svg4.append("circle")
          .attr("r", 5)
          .style("fill", "SlateBlue")
          .style("opacity",0.7)
        .attr("transform", "translate(700,80)");

  svg4.append("circle")
        .attr("r", 5)
        .style("fill", "MediumPurple")
        .style("opacity",0.5)
        .attr("transform", "translate(700,95)");

  svg4.append("text")
        .style("font-size", "15px")
        .text("Andrija Kuzmanović")
        .attr("transform", "translate(710,37)");

  svg4.append("text")
        .style("font-size", "15px")
        .text("Dragan Bjelogrlić")
        .attr("transform", "translate(710,52)");

  svg4.append("text")
        .style("font-size", "15px")
        .text("Marija Bergam")
        .attr("transform", "translate(710,67)");

    svg4.append("text")
        .style("font-size", "15px")
        .text("Nenad Jezdić")
        .attr("transform", "translate(710,82)");


    svg4.append("text")
        .style("font-size", "15px")
        .text("Žarko Laušević")
        .attr("transform", "translate(710,97)");






});
