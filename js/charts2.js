var margin2 = {top: 25, right:10, bottom:20,left:25},
    width2 = 430 - margin.left,
    height2 = 130 - margin.top;


var x2 = d3.scaleLinear().range([0, width2]);

var y2 = d3.scaleLinear().range([height2,0]);


var area2 = d3.area()
    .x(function(d) { return x2(d.vreme); })
    .y0(height2)
    .y1(function(d) { return y2(d.tekst); })
    .curve(d3.curveBasis);


var valueline2 = d3.line()
    .x(function(d) { return x2(d.vreme); })
    .y(function(d) { return y2(d.tekst); })
    .curve(d3.curveBasis);

var svg3 = d3.select("#chart_right").append("svg")
    .attr("width", width2 + margin.left + margin.right)
    .attr("height", height2 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



d3.csv("data/tw_hours.csv", function(error, data) {
  if (error) throw error;


  data.forEach(function(d) {
      d.vreme = +d.vreme;
      d.tekst = +d.tekst;
  });


  x2.domain(d3.extent(data, function(d) { return d.vreme; }));
  y2.domain([0, d3.max(data, function(d) { return d.tekst; })]);

    svg3.append("path")
       .data([data])
       .attr("class", "area2")
       .attr("d", area2);

    svg3.append("path")
      .data([data])
      .attr("class", "line2")
      .attr("d", valueline2);

    svg3.append("g")
      .attr("transform", "translate(0," + height2 + ")")

      .call(d3.axisBottom(x2));

    svg3.append("g")
      .call(d3.axisLeft(y2)
      .ticks(4));

    svg3.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top-35))
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("text-decoration", "underline")
      .text("Prosečan broj tvitova tokom dana, po satima");

});
