import * as d3 from 'd3';
import { bisect } from 'd3';

let width = 1200;
let height = 800;
let padding = 50;

let data1 = [
  {
    date: new Date('2020/08/10 08:00:00'),
    value: 1
  },
  {
    date: new Date('2020/08/10 09:00:00'),
    value: 1.5
  },
  {
    date: new Date('2020/08/10 10:00:00'),
    value: 2
  },
  {
    date: new Date('2020/08/10 11:00:00'),
    value: 2
  },
  {
    date: new Date('2020/08/10 12:00:00'),
    value: 1
  },
  {
    date: new Date('2020/08/10 13:00:00'),
    value: 1
  },
  {
    date: new Date('2020/08/10 14:00:00'),
    value: 1
  },
  {
    date: new Date('2020/08/10 15:00:00'),
    value: 1
  },
  {
    date: new Date('2020/08/10 16:00:00'),
    value: 0
  }
]

let data2 = [
  {
    date: new Date('2020/08/10 8:00:00'),
    value: 3
  },
  {
    date: new Date('2020/08/10 9:00:00'),
    value: 3
  },
  {
    date: new Date('2020/08/10 10:00:00'),
    value: 3
  },
  {
    date: new Date('2020/08/10 11:00:00'),
    value: 3
  },
  {
    date: new Date('2020/08/10 12:00:00'),
    value: 3
  },
  {
    date: new Date('2020/08/10 13:00:00'),
    value: 2
  },
  {
    date: new Date('2020/08/10 14:00:00'),
    value: -1
  },
  {
    date: new Date('2020/08/10 15:00:00'),
    value: 0
  },
  {
    date: new Date('2020/08/10 16:00:00'),
    value: 1
  }
]

let data = [...data1, ...data2];

let svg = d3.select('svg')
  .attr('width', width)
  .attr('height', height)

  

svg.append('rect')
  .style('fill', 'none')
  .style('pointer-events', 'all')
  .attr('width', width)
  .attr('height', height)
  .on('mousedown', click)
  .on('mouseover', mouseover)
  .on('mousemove', mousemove)
  .on('mouseout', mouseout);

let xExtent = d3.extent(data, d => d.date)
let yExtent = d3.extent(data, d => d.value)

console.log('xExtent', xExtent);
console.log('yExtent', yExtent);

let xScale = d3.scaleTime()
              .domain(xExtent)
              .range([0, width - padding - padding])

let yScale = d3.scaleLinear()
              .domain([-3, 5])
              .range([height - padding - padding, 0])

let yAxis = d3.axisLeft()
              .tickSize(-width + padding + padding, 0, 0)
              // .tickValues(data.map(d => d.value))
              .scale(yScale)

let xAxis = d3.axisBottom()
              .tickSize(-height + padding + padding, 0, 0)
              // .tickValues(data.map(d => d.date))
              // .ticks(d3.timeDay.every(1))
              .scale(xScale)
              

let xaxis = svg.append('g')
  .attr("class", "x axis")
  .style('pointer-events', 'none')
  .attr('transform', `translate(${padding}, ${height - padding})`)
  .call(xAxis)
  .call(xAxisText)
  
  
  function grid(e) {
    console.log(e.selectAll('line'));
    console.log('grid', e);
    console.log('selectAll', e.selectAll('line'));
    // e.selectAll('line')[0].map(d => console.log(d));
    //  .append('rect')
    //  .attr('x', 0)
    //  .attr('y', e => yScale(e))
    //  .attr('width', width)
    //  .attr('height', height)
    //  .attr('fill', 'red')
    
  }

let yaxis = svg.append('g')
  .attr("class", "y axis")
  .attr('transform', `translate(${padding}, ${padding})`)
  .style('pointer-events', 'none')
  .call(yAxis)
  .call(yAxis)
  .call(grid)

function yAxisText(selection) {
  selection.selectAll('text').attr('transform', 'translate(-10, 0)');
}

function xAxisText(selection) {
  selection.selectAll('text').attr('transform', 'translate(0, 10)');
}
xaxis.selectAll("line")
    .style("stroke", "#EFEFEF");  

yaxis.selectAll("line")
    .style("stroke", "#EFEFEF");  

let line = d3.line()
  .x(d => xScale(d.date))
  .y(d => yScale(d.value))
  .curve(d3.curveStepAfter)

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
  .attr('stroke', '#ff8c8c')
  .attr('stroke-width', 2)
  .attr('transform', `translate(${padding}, ${padding})`)

update2.enter().append('path')
  .attr('d', line)
  .attr('fill', 'none')
  .attr('stroke', '#7aceff')
  .attr('stroke-width', 2)
  .attr('transform', `translate(${padding}, ${padding})`)

update1.exit().remove();
update2.exit().remove();

svg.selectAll('myCircles')
  .data(data1)
  .enter()
  .append('circle')
  .attr('fill', 'white')
  .attr('stroke', '#ff8c8c')
  .attr('stroke-width', 2)
  .attr('class', 'dot')
  .attr('data-date', d => d.date)
  .attr('data-value', d => d.value)
  .attr('cx', d => xScale(d.date))
  .attr('cy', d => yScale(d.value))
  .attr('r', 4)
  .attr('transform', `translate(${padding}, ${padding})`)

svg.selectAll('myCircles')
  .data(data2)
  .enter()
  .append('circle')
  .attr('fill', 'white')
  .attr('stroke', '#7aceff')
  .attr('stroke-width', 2)
  .attr('class', 'dot')
  .attr('data-date', d => d.date)
  .attr('data-value', d => d.value)
  .attr('cx', d => xScale(d.date))
  .attr('cy', d => yScale(d.value))
  .attr('r', 4)
  .attr('transform', `translate(${padding}, ${padding})`)

// 
/* Initialize tooltip */
var tooltip = d3.select('body').append("div")
    .attr('class', 'tooltip')
    .style("position", "absolute")
    .style("visibility", "hidden")


svg.selectAll('circle')
  .style('pointer-events', 'all')
  .on('mouseover', onCircleMouseover)
  .on('mousemove', onCircleMouseMove)
  .on('mouseout', onCircleMouseOut)



function onCircleMouseover() {
  let xv = this.getAttribute('data-date');
  let yv = this.getAttribute('data-value');
  let format = d3.timeFormat("%I:%M %p")
  tooltip.style("visibility", "visible")
  tooltip.html(`<div><span>Time: ${format(new Date(xv))}</span><br><span>Value: ${yv}</span></div>`)
  tooltip.style('top', `${d3.mouse(this)[1] - 15}px`);
  tooltip.style('left', `${d3.mouse(this)[0] + padding - 40}px`);
}
function onCircleMouseMove() {
}
function onCircleMouseOut() {
  tooltip.style('visibility', 'hidden');
}
// tip = d3.tip().attr('class', 'd3-tip').
// tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d; });

/* Invoke the tip in the context of your visualization */
// vis.call(tip)

// vis.selectAll('rect')
//   .data(data)
//   .enter()
//   .append('rect')
//   .attr('width', function() { return x.rangeBand() })
//   .attr('height', function(d) { return h - y(d) })
//   .attr('y', function(d) { return y(d) })
//   .attr('x', function(d, i) { return x(i) })
//   .on('mouseover', tip.show)
//   .on('mouseout', tip.hide)



// －－－
var focusText = svg
              .append('g')
              .append('text')
              .style("opacity", 0)
              .attr("text-anchor", "left")
              .attr("alignment-baseline", "middle")
              .attr('x', 200)
              .attr('y', 200)
              // .text('Hello World!')

let hoverLine = svg.append('line')
                  .attr('x1', 0)
                  .attr('y1', padding)
                  .attr('x2', 0)
                  .attr('y2', height - padding)
                  .attr('stroke', '#a3a3a3')
                  .attr('stroke-width', 0.5)


// var focus = svg
//   .append('g')
//   .append('circle')
//     .style("fill", "none")
//     .attr("stroke", "black")
//     .attr('r', 8.5)
//     .style("opacity", 0)

function mouseover() {
  // focus.style("opacity", 1)
  focusText.style("opacity", 1)
}
// var bisect = d3.bisector(d => { return d.date; }).left;

function mousemove() {
  var x0 = xScale.invert(d3.mouse(this)[0] - padding);
  var y0 = yScale.invert(d3.mouse(this)[1] - padding);

  hoverLine
    .transition()
    .duration(100)
    .ease(d3.easeBounce)
    .attr('x1', xScale(x0) + padding)
    .attr('x2', xScale(x0) + padding)
  }

function mouseout() {
  // focus.style("opacity", 0)
  focusText.style("opacity", 0)
}
let clickLine;
let clickLinkText;
let clickRect;
function click() {
  var x0 = xScale.invert(d3.mouse(this)[0] - padding);
  var y0 = yScale.invert(d3.mouse(this)[1] - padding);
  
  let x0v = xScale(x0) + padding;
  if (clickLine) {
    clickLine.remove();
  }
  // clickLine.remove();
  clickLine = svg.append('line')
                  .attr('x1',  x0v)
                  .attr('y1', padding)
                  .attr('x2', x0v)
                  .attr('y2', height - padding)
                  .attr('stroke', '#a3a3a3')
                  .attr('stroke-width', 2)
  let f = d3.timeFormat("%I:%M %p")

  
  // console.log('xScale.invert(x0v - padding)', new Date(xScale.invert(x0v - padding)));
  let ld = new Date(xScale.invert(x0v - padding));

  // clickLinkText.remove();
  if (clickLinkText) {
    clickLinkText.remove();
  }
  clickLinkText = svg
                  .append('g')
                  .append('text')
                  .style("opacity", 1)
                  .text(`${ld.toLocaleString()}`)
                  .style('pointer-events', 'none')
                  .attr("text-anchor", "left")
                  .attr("alignment-baseline", "middle")
                  .attr('x', x0v - 70)
                  .attr('y', 30)
  var selectedData;
  if (clickRect) {
    clickRect.remove();
  }
  clickRect = svg.append('rect')
                .attr('x', x0v)
                .attr('y', 50)
                .attr('width', 50)
                .attr('height', 30)
                .attr('stroke', 'black')
                .attr('fill', 'white')

                // var tdata = [
                //   {
                //     title: 'One',
                //     value: 1
                //   }, {
                //     title: 'Two',
                //     value: 2
                //   }, {
                //     title: 'Three',
                //     value: 3
                //   }, {
                //     title: 'Four',
                //     value: 4
                //   }, {
                //     title: 'Five',
                //     value: 5
                //   }
                // ];

                // console.log('===========================');
                // var bisect3 = d3.bisector(function(d) { return d.value; }).right;
                // console.log('')
                // console.log(bisect3(tdata, 2));
                // console.log('===========================');
    console.log('===========================');
    var bisect = d3.bisector(function(d) { return new Date(d.date) }).right;
    console.log(ld);
    console.log(...data2)
    var i = bisect(data2, ld);
    selectedData = data[i]
    console.log('I', i);
    console.log('===========================');
    // var i = bisect(data.map(d => d.value), 2, 1);
    // console.log(i);
  // hoverLine
  //   .transition()
  //   .duration(100)
  //   .ease(d3.easeBounce)
  //   .attr('x1', xScale(x0) + padding)
  //   .attr('x2', xScale(x0) + padding)

  // console.log(this);
  // console.log('click');
}
// https://www.d3-graph-gallery.com/graph/line_cursor.html
// https://www.d3-graph-gallery.com/graph/area_lineDot.html
// https://observablehq.com/@d3/d3-bisect

// https://htmlcssjavascript.com/web/mastering-svg-bonus-content-a-d3-line-chart/

let color = d3.scaleLinear()
              .domain([1, 10])
              .range(['#f00', '#00f']);

console.log(color(3));


let category = d3.select('body').append("div")
    .attr('class', 'category')
    .style("position", "absolute")
    .style('top', `56px`)
    .style('left', `${width}px`);

category.append('div')
        .attr('class', 'group red')
        .html('<h2>Data1</h2>')
category.append('div')
        .attr('class', 'group blue')
        .html('<h2>Data2</h2>')


// d3.select('body').append("div")
//     .attr('class', 'category')
//     .style("position", "absolute")
//     .style('top', `50px`)
//     .style('left', `${width}px`)
//     .html('<h2>Data1</h2>')
