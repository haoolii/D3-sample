import * as d3 from 'd3';
import { linkHorizontal } from 'd3';

const data = [
  {
    date: new Date('2020/08/10 8:00:00'),
    value: 1
  },
  {
    date: new Date('2020/08/10 9:00:00'),
    value: 2
  },
  {
    date: new Date('2020/08/10 10:00:00'),
    value: 3
  },
  {
    date: new Date('2020/08/10 11:00:00'),
    value: -1
  },
  {
    date: new Date('2020/08/10 12:00:00'),
    value: 0
  },
  {
    date: new Date('2020/08/10 13:00:00'),
    value: 3
  },
]

let width = 800;
let height = 600;
let svg = d3.select('svg')
            .attr('width', width)
            .attr('height', height);
let padding = 50;
let innerWidth = width - padding * 2;
let innerHeight = height - padding * 2;
let xExtent = d3.extent(data, d => d.date);
let yExtent = d3.extent(data, d => d.value);
let xRange = d3.scaleTime().range([0, innerWidth]);
let yRange = d3.scaleLinear().range([innerHeight, 0]);
let xScale = xRange.domain(xExtent);
// let yScale = yRange.domain(yExtent);
let yScale = yRange.domain([-10, 10]);
let xAxis = d3.axisBottom(xRange).tickSize(innerHeight, 0, 0);
let yAxis = d3.axisLeft(yRange).tickSize(-innerWidth, 0, 0);

var focus = svg.append("g")
    .attr("class", "focus")
    .style('pointer-events', 'all')
    .attr('height', innerHeight)
    .attr('width', innerWidth)
    .attr("transform", "translate(" + padding + "," + padding + ")");

  focus.append("clipPath")       // define a clip path
    .attr("id", "ellipse-clip") // give the clipPath an ID
    .append("rect")            // shape it as an ellipse
    .attr("x", 0)            // position the x-centre
    .attr("y", 0)            // position the y-centre
    .attr("width", innerWidth)
    .attr("height", innerHeight)
  
    
focus.append("g")
    .attr("class", "axis axis--x")
    .call(xAxis);

let y_axis = focus.append("g")
    .attr("class", "axis axis--y")
    .call(yAxis);

let lg = focus.append('g').attr('class', 'heelo').attr("clip-path","url(#ellipse-clip)");
let line = d3.line()
              .x(d => xScale(d.date))
              .y(d => yScale(d.value))
              .curve(d3.curveStepAfter)
              
lg.selectAll('path')
  .data([data])
  .enter().append('path')
  .attr('d', line)
  .attr('fill', 'none')
  .attr('stroke', 'red')
  .attr('stroke-width', 4)

let hoverLink;
focus.on('mousemove', function() {
  let x = d3.mouse(this)[0];
  let y = d3.mouse(this)[1];
  // console.log(`${x}, ${y}`);
  let ivx = xScale.invert(x);
  let ivy = yScale.invert(y);
  // console.log('invert', xScale.invert(x));
  // console.log('invert', yScale.invert(y));
  let bisect = d3.bisector(d => d.date).right;
  const ix = bisect(data, ivx);
  // const ix = d3.bisect(data, ivy);
  
  // console.log('ix', ix);

  let tv = ix - 1 < 0 ? 0 : ix - 1;

  let newV = data[tv];

  if (hoverLink) {
    hoverLink
      .select('line')
      .transition()
      .duration(100)
      .attr('x1', x)
      .attr('y1', 0)
      .attr('x2', x)
      .attr('y2', innerHeight)
    hoverLink
      .select('text')
      .text(newV.value)
      .transition()
      .duration(100)
      .attr('x', x)
      .attr('y', -10)
    
    return;
  }
  hoverLink = focus.append('g');
  hoverLink.append('text')
          .text(newV.value)
          .attr('x', x)
          .attr('y', -10)
  hoverLink.append('line')
        .attr('x1', x)
        .attr('y1', 0)
        .attr('x2', x)
        .attr('y2', innerHeight)
        .attr('stroke', '#a3a3a3')
        .attr('stroke-width', 2)        
});

// focus.call(d3.zoom().on("zoom", zoomed));
let zoom = d3.zoom()
  .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
  .extent([[0, 0], [width, height]])
  .on("zoom", updateChart);
  
  focus.call(zoom);

function zoomed() {
  // let t = d3.event.transform;
  // // focus.attr("transform", d3.event.transform)
  // var newX = d3.event.transform.rescaleX(xScale);
  // var newY = d3.event.transform.rescaleY(yScale);
  // console.log('newx', newX);
  // console.log('newy', newY);
  // xAxis.call(d3.axisBottom(newX))
  // yAxis.call(d3.axisLeft(newY))
  // // console.log(t.rescaleX(xScale).domain());
  // // xRange.domain(t.rescaleX(0.5).domain());
  // console.log('zoomed');
}

function updateChart() {
console.log('tt');
  // recover the new scale
  // var newX = d3.event.transform.rescaleX(xScale);
  // var newY = d3.event.transform.rescaleY(yScale);
  y_axis.transition()
  .duration(50)
  .call(yAxis.scale(d3.event.transform.rescaleY(yScale)));

  var newyScale = d3.event.transform.rescaleY(yScale);
      // circles.attr("cy", function(d) { return new_yScale(d[1]); });
  // update axes with these new boundaries
  // focus.call(d3.axisBottom(newX))
  // focus.call(d3.axisLeft(newY))

  // update circle position

  // if (lg) {
  //   lg.remove()
  // }

  let line2 = d3.line()
                .x(d => xScale(d.date))
                .y(d => newyScale(d.value))
                .curve(d3.curveStepAfter)
                  
  lg.selectAll('path')
    .attr('d', line2)
    .attr('fill', 'none')
    .attr('stroke', 'blue')
    .attr('stroke-width', 4)

    // let line2 = d3.line()
    //           // .x(d => newX(d.date))
    //           .y(d => new_yScale(d.value))
    //           .curve(d3.curveStepAfter)
   
    //   lg.selectAll('path')
    //   .attr('d', line2)
    //   .attr('fill', 'none')
    //   .attr('stroke', 'blue')
    //   .attr('stroke-width', 4)
}


// var svg = d3.select("svg"),
//     margin = {top: 20, right: 20, bottom: 110, left: 40},
//     margin2 = {top: 430, right: 20, bottom: 30, left: 40},
//     width = +svg.attr("width") - margin.left - margin.right,
//     height = +svg.attr("height") - margin.top - margin.bottom,
//     height2 = +svg.attr("height") - margin2.top - margin2.bottom;

// var parseDate = d3.timeParse("%b %Y");

// var x = d3.scaleTime().range([0, width]),
//     x2 = d3.scaleTime().range([0, width]),
//     y = d3.scaleLinear().range([height, 0]),
//     y2 = d3.scaleLinear().range([height2, 0]);
    
// var xAxis = d3.axisBottom(x),
//     xAxis2 = d3.axisBottom(x2),
//     yAxis = d3.axisLeft(y);

    
// var brush = d3.brushX()
//     .extent([[0, 0], [width, height2]])
//     .on("brush end", brushed);

// var zoom = d3.zoom()
//     .scaleExtent([1, Infinity])
//     .translateExtent([[0, 0], [width, height]])
//     .extent([[0, 0], [width, height]])
//     .on("zoom", zoomed);

// var area = d3.area()
//     .curve(d3.curveMonotoneX)
//     .x(function(d) { return x(d.date); })
//     .y0(height)
//     .y1(function(d) { return y(d.price); });

// var area2 = d3.area()
//     .curve(d3.curveMonotoneX)
//     .x(function(d) { return x2(d.date); })
//     .y0(height2)
//     .y1(function(d) { return y2(d.price); });

// svg.append("defs").append("clipPath")
//     .attr("id", "clip")
//   .append("rect")
//     .attr("width", width)
//     .attr("height", height);

// var focus = svg.append("g")
//     .attr("class", "focus")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// var context = svg.append("g")
//     .attr("class", "context")
//     .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
// d3.csv('http://localhost:1234/sp500.a5a121b7.csv', type).then(data => {

//   x.domain(d3.extent(data, function(d) { return d.date; }));
//   y.domain([0, d3.max(data, function(d) { return d.price; })]);
//   x2.domain(x.domain());
//   y2.domain(y.domain());

//   console.log('data', data);

//   focus.append("path")
//       .datum(data)
//       .attr("class", "area")
//       .attr("d", area);

//   focus.append("g")
//       .attr("class", "axis axis--x")
//       .attr("transform", "translate(0," + height + ")")
//       .call(xAxis);

//   focus.append("g")
//       .attr("class", "axis axis--y")
//       .call(yAxis);

//   context.append("path")
//       .datum(data)
//       .attr("class", "area")
//       .attr("d", area2);

//   context.append("g")
//       .attr("class", "axis axis--x")
//       .attr("transform", "translate(0," + height2 + ")")
//       .call(xAxis2);

//   context.append("g")
//       .attr("class", "brush")
//       .call(brush)
//       .call(brush.move, x.range());

//   svg.append("rect")
//       .attr("class", "zoom")
//       .attr("width", width)
//       .attr("height", height)
//       .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
//       .call(zoom);
// });

// function brushed() {
//   console.log('brushed end');
// //   if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
//   var s = d3.event.selection || x2.range();
//   x.domain(s.map(x2.invert, x2));
//   focus.select(".area").attr("d", area);
//   focus.select(".axis--x").call(xAxis);
//   svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
//       .scale(width / (s[1] - s[0]))
//       .translate(-s[0], 0));
// }

// function zoomed() {
//   if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
  // var t = d3.event.transform;
  // x.domain(t.rescaleX(x2).domain());
//   focus.select(".area").attr("d", area);
//   focus.select(".axis--x").call(xAxis);
//   context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
// }

// function type(d) {
//   d.date = parseDate(d.date);
//   d.price = +d.price;
//   return d;
// }
