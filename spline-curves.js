var w = 960,
    h = 500,
    // points = d3.range(1, 5).map(function(i) { return [i * w / 5, 50 + Math.random() * (h - 100)]; });
    points = [[300, 200], [200, 300], [300, 100], [500, 200], [600, 300], [750, 200], [775, 175], [750, 200]];
    // points = [[-84.514845,39.107998], [-80.313664,36.117607], [-82.323938,29.649401]];
    
// Our projection.
var xy = d3.geo.albers(),
    path = d3.geo.path().projection(xy);

var states = d3.select("body")
  .append("svg")
  .append("g")
    .attr("id", "states");
    
var playJourneys = d3.select("body")
  .append("svg")
  .append("g")
    .attr("id", "journeys");

d3.json("us-states.json", function(collection) {
  d3.select("#states")
    .selectAll("path")
      .data(collection.features)
    .enter().append("path")
      .attr("d", path);

});

var journey = playJourneys.append("path")
    .data([points])
    .attr("class", "line")
    .attr("d", d3.svg.line())
    .tension(0) // Catmull–Rom
    .interpolate("cardinal");

duration = journey.node().getTotalLength() / 5 * 100;

var i = 0;
while (i < 200) {
  var opacity = (200 - i) / 100;
  var thisJourney = playJourneys.append("circle")
    .attr("r", 1)
    .attr("transform", "translate(" + points[0] + ")")
    .style("opacity", 0)
    .transition()
    .delay(10 * i)
    .ease('linear')
    .duration(duration)
    .attrTween("transform", translateAlong(journey.node()))
    .remove();
    
    thisJourney
      .transition()
      .duration(10 * i)
      .style("opacity", opacity);
      
    i++;
}


// Returns an attrTween for translating along the specified path element.
function translateAlong(path) {
  var l = path.getTotalLength();
  return function(d, i, a) {
    return function(t) {
      var p = path.getPointAtLength(t * l);
      return "translate(" + p.x + "," + p.y + ")";
    };
  };
}
