var w = 960,
    h = 500,
    // points = d3.range(1, 5).map(function(i) { return [i * w / 5, 50 + Math.random() * (h - 100)]; });
    points = [[300, 200], [200, 300], [300, 100], [500, 200], [600, 300], [750, 200], [675, 175], [750, 200], [550, 150], [460, 288], [300, 200], [200, 300], [750, 200], [500, 200], [600, 300], [300, 100], [675, 175], [750, 200], [550, 150], [460, 288]];
    fancyPath = [[725.6292589043662,260.2512326081814], [716.6219624219601,377.15010417222163], [636.1927090679118,152.4506523689999], [556.178799994128,230.98440686868926], [721.2034935314543,277.1782016362987], [498.2092724969877,340.009453809029], [563.6594208951375,182.627694897874], [185.83133948779738,52.57451913146926], [612.4831647191993,171.33887242989675], [774.6989992077924,178.97953826652736], [774.7174169573673,178.96881530000707], [675.9190260109922,310.5392215131415], [298.5505547175005,187.72953033947482], [791.3158495118978,161.72711446824172], [195.0864494760271,43.5907284351662], [387.14635510353884,216.03768891078755], [830.6762480715479,138.2430789689091], [637.1149803225496,208.86599823211816], [760.0027562749528,421.39762718968484], [792.4518774359938,126.04494870644788], [812.5668413198703,146.12975602030565], [760.0027562749528,421.39762718968484], [791.4281538234787,162.08007802916825]];
    
var trailLength = 150;
var delay = 10;
var pointSize = 1;
    
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
/*
d3.json("10986.json", function(collection) {

  var journeyNodes = playJourneys
    .selectAll("path")
    .data(collection.features)
    .enter()
    .append("path")
    .attr("d", d3.geo.path().projection(xy));
    
    var i = 0;
    var nodeCount = 0;
    var l = journeyNodes[0].length;
    var journeyPath = [];

    while (i < l) {
      if (journeyNodes[0][i]) {
        var journeyPathRaw = journeyNodes[0][i]['attributes'][0]['nodeValue'];
        var journeyArray = journeyPathRaw.split(',');
        var journeyObject = [journeyArray[0].replace('M', ''), journeyArray[1].replace('m0', '')];

        if (journeyObject !== 'undefined') {
          journeyPath[nodeCount] = journeyObject;
          nodeCount++;
        }
      }
      
      i++;
    }

    // console.log(journeyPath);
    // console.log(points);
    
    var journey = playJourneys.append("path")
        // .data([journeyPath])
        .data([fancyPath])
        .attr("class", "line")
        .attr("d",  d3.svg.line()
          .tension(0) // Catmull–Rom
          .interpolate("cardinal")
        );

    duration = journey.node().getTotalLength() / 5 * 100;
    
    var i = 0;
    while (i < trailLength) {
      var opacity = (trailLength - i) / 100;
      var thisJourney = playJourneys.append("circle")
        .attr("r", pointSize)
        .attr("transform", "translate(" + points[0] + ")")
        .style("opacity", 0)
        .transition()
        .delay(delay * i)
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
    
});
*/
var journey = playJourneys.append("path")
    .data([points])
    .attr("class", "line")
    .attr("d",  d3.svg.line()
      .tension(0) // Catmull–Rom
      .interpolate("cardinal") 
    );

duration = journey.node().getTotalLength() / 5 * 100;

var i = 0;
while (i < trailLength) {
  var opacity = (trailLength - i) / 100;
  var thisJourney = playJourneys.append("circle")
    .attr("r", pointSize)
    .attr("transform", "translate(" + points[0] + ")")
    .style("opacity", 0)
    .transition()
    .delay(delay * i) // Make this number higher to spread out the tail. Makes it faster but less smooth
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
