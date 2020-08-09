import * as d3 from 'd3';
let width = 800;
let height = 800;
let padding = 50;

let data1 = [
  {
    date: new Date(2020, 3, 24),
    value: 20
  },
  {
    date: new Date(2020, 3, 25),
    value: 93
  },
  {
    date: new Date(2020, 3, 28),
    value: 50
  }
]

let data2 = [
  {
    date: new Date(2020, 4, 3),
    value: 50
  },
  {
    date: new Date(2020, 3, 21),
    value: 25
  },
  {
    date: new Date(2020, 3, 27),
    value: 120
  },
  {
    date: new Date(2020, 3, 6),
    value: 95
  },
  {
    date: new Date(2020, 1, 2),
    value: 23
  },
  {
    date: new Date(2020, 3, 1),
    value: 12
  },
  {
    date: new Date(2020, 3, 9),
    value: 5
  }
]

let data = [...data1, ...data2];

let svg = d3.select('svg')
  .attr('width', width)
  .attr('height', height)

let xExtent = d3.extent(data, d => d.date)
let yExtent = d3.extent(data, d => d.value)

console.log('xExtent', xExtent);
console.log('yExtent', yExtent);

let xScale = d3.scaleTime()
              .domain(xExtent)
              .range([0, width - padding - padding])

let yScale = d3.scaleLinear()
              .domain(yExtent)
              
              .range([height - padding - padding, 0])

let xAxis = d3.axisBottom()
              .tickSize(-height + padding + padding, 0, 0)
              // .tickValues(data.map(d => d.date))
              .ticks(d3.timeDay.every(1))
              .scale(xScale)
              
let yAxis = d3.axisLeft()
              .tickSize(-width + padding + padding, 0, 0)
              .tickValues(data.map(d => d.value))
              .scale(yScale);

let xaxis = svg.append('g')
  .attr('transform', `translate(${padding}, ${height - padding})`)
  .call(xAxis);

let yaxis = svg.append('g')
  .attr('transform', `translate(${padding}, ${padding})`)
  .call(yAxis);

xaxis.selectAll("line")
    .style("stroke", "#EFEFEF");  

yaxis.selectAll("line")
    .style("stroke", "#EFEFEF");  

let line = d3.line()
  .x(d => xScale(d.date))
  .y(d => yScale(d.value))

let g = svg.append('g');

let gs = g.selectAll('path');
let update1 = gs.data([data1.sort((a, b) => {
  return d3.descending(a.date, b.date);
})]);
  
let update2 = gs.data([data2.sort((a, b) => {
  return d3.descending(a.date, b.date);
})]);

update1.enter().append('path')
  .attr('d', line)
  .attr('fill', 'none')
  .attr('stroke', 'red')
  .attr('stroke-width', 2)
  .attr('transform', `translate(${padding}, ${padding})`)

update2.enter().append('path')
  .attr('d', line)
  .attr('fill', 'none')
  .attr('stroke', 'blue')
  .attr('stroke-width', 2)
  .attr('transform', `translate(${padding}, ${padding})`)

update1.exit().remove();
update2.exit().remove();

svg.selectAll('myCircles')
  .data(data)
  .enter()
  .append('circle')
  .attr('fill', 'red')
  .attr('stroke', 'none')
  .attr('class', 'dot')
  .attr('cx', d => xScale(d.date))
  .attr('cy', d => yScale(d.value))
  .attr('r', 3)
  .attr('transform', `translate(${padding}, ${padding})`)

// －－－
var focusText = svg
              .append('g')
              .append('text')
              .style("opacity", 0)
              .attr("text-anchor", "left")
              .attr("alignment-baseline", "middle")
              .attr('x', 200)
              .attr('y', 200)
              .text('Hello World!')

svg.append('rect')
  .style('fill', 'none')
  .style('pointer-events', 'all')
  .attr('width', width)
  .attr('height', height)
  .on('mouseover', mouseover)
  .on('mousemove', mousemove)
  .on('mouseout', mouseout);

// var focus = svg
//   .append('g')
//   .append('circle')
//     .style("fill", "none")
//     .attr("stroke", "black")
//     .attr('r', 8.5)
//     .style("opacity", 0)

function mouseover() {
  // focus.style("opacity", 1)
  focusText.style("opacity",1)
}

// var bisect = d3.bisector(d => { return d.date; }).left;

function mousemove() {
  var x0 = xScale.invert(d3.mouse(this)[0] - padding);
  var y0 = yScale.invert(d3.mouse(this)[1] - padding);
  console.log('xo', x0);
  console.log('x, y', `${x0}, ${y0}`)

  focusText.text(`${x0}, ${y0}`)

  // bisect(data, )u
  // var i = bisect(data, x0, 1);
  // selectedData = data[i]
  // focus
  //   .attr("cx", x(selectedData.x))

  //   .attr("cy", y(selectedData.y))
  // focusText
  //   .html("x:" + selectedData.date + "  -  " + "y:" + selectedData.value)
  //   .attr('x', 200)
  //   .attr('y', 200)
    // .attr("x", x(selectedData.x)+15)
    // .attr("y", y(selectedData.y))
  }

function mouseout() {
  // focus.style("opacity", 0)
  focusText.style("opacity", 0)
}

// https://www.d3-graph-gallery.com/graph/line_cursor.html
// https://www.d3-graph-gallery.com/graph/area_lineDot.html
// https://observablehq.com/@d3/d3-bisect

// https://htmlcssjavascript.com/web/mastering-svg-bonus-content-a-d3-line-chart/
