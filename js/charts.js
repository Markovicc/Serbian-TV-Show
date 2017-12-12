
var margin = {top: 25, right:10, bottom:20,left:25},
    width = 430 - margin.left -margin.right,
    height = 130 - margin.top - margin.bottom;


var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);


var area = d3.area()
    .x(function(d) { return x(d.vreme); })
    .y0(height)
    .y1(function(d) { return y(d.tekst); })
    .curve(d3.curveBasis);


var valueline = d3.line()
    .x(function(d) { return x(d.vreme); })
    .y(function(d) { return y(d.tekst); })
    .curve(d3.curveBasis);

var svg2 = d3.select("#chart_left").append("svg")
    .attr("width",width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.csv("data/tw_days.csv", function(error, data) {
  if (error) throw error;


  data.forEach(function(d) {
      d.vreme = +d.vreme;
      d.tekst = +d.tekst;
  });


  x.domain(d3.extent(data, function(d) { return d.vreme; }));
  y.domain([0, d3.max(data, function(d) { return d.tekst; })]);

    svg2.append("path")
       .data([data])
       .attr("class", "area1")
       .attr("d", area);

    svg2.append("path")
      .data([data])
      .attr("class", "line1")
      .attr("d", valueline);

    svg2.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
      .ticks(6));

    svg2.append("g")
      .call(d3.axisLeft(y)
      .ticks(4));

    svg2.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top-35))
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("text-decoration", "underline")
      .text("Prosečan broj tvitova tokom nedelje, po danima (PET-ČET)");





});
