import * as d3 from 'd3';
import { data, treeData } from './ga.mock';

let width = 1200;
let height = 600;
let padding = 50;
let innerWidth = width - padding * 2;
let innerHeight = height - padding * 2;
let svg = d3.select('svg').attr('width', width).attr('height', height);
let focus = svg.append('g').attr('transform', `translate(${padding}, ${padding})`);

let root,
    duration = 500;
let nodes = [];

root = d3.hierarchy(data, d => d.children);
root.eachBefore(node => nodes.push(node));

/**
 * X一堆處理
 */
let xExtent = [
    d3.min(nodes.map(node => node.data.start)),
    d3.max(nodes.map(node => node.data.end))
]

let xRange = d3.scaleTime().range([0, innerWidth]);
let xScale = xRange.domain(xExtent);
let xAxis = d3.axisBottom().scale(xScale);
let xAxisLayer = focus.append('g').attr('class', 'axis x-axis');

xAxisLayer
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(xAxis);

/**
 * Y一堆處理
 */
let yRange = d3.scaleBand().range([0, innerHeight]);
let yScale = yRange.domain(nodes.map(node => node.data.task));
let yAxis = d3.axisLeft().scale(yScale);
let yAixLayer = focus.append('g').attr('class', 'axis y-axis');

yAixLayer
    .call(yAxis);

/**
 * 顯示甘特圖
 */
let lineg = focus.append('g');

// Enter

updateTest();
function updateTest() {
    nodes = [];

    root = d3.hierarchy(data, d => d.children);
    root.eachBefore(node => {
        nodes.push(node);
        // console.log(node);
    });

    // 

    xExtent = [
        d3.min(nodes.map(node => node.data.start)),
        d3.max(nodes.map(node => node.data.end))
    ]

    xRange = d3.scaleTime().range([0, innerWidth]);
    
    xScale = xRange.domain(xExtent);

    xAxis =  d3.axisBottom().scale(xScale);

    xAxisLayer
        .transition()
        .duration(duration)
        .call(xAxis);

    // 

    yRange = d3.scaleBand().range([0, innerHeight]);

    yScale = yRange.domain(nodes.map(node => node.data.task));

    yAxis = d3.axisLeft().scale(yScale);
    
    yAixLayer
        .transition()
        .duration(duration)
        .call(yAxis);

    // ===============

    let node = lineg.selectAll('rect').data(nodes);

    // Enter

    let nodeEnter = node.enter()
        .append('rect')
        .style('cursor', node => node.data.children ? 'pointer' : '')
        .on('click', click)
        .attr('y', (d, i) => i * yScale.bandwidth())
        .attr('x', d => xScale(d.data.start))
        .transition()
        .duration(duration)
        .attr('width', d => xScale(d.data.end) - xScale(d.data.start))
        .attr('height', yScale.bandwidth())

    // Update
    node
        .transition()
        .duration(duration)
        .attr('width', d =>  xScale(d.data.end) - xScale(d.data.start))
        .attr('y', (d, i) => i * yScale.bandwidth())
        .attr('height', yScale.bandwidth())
        .attr('x', d => xScale(d.data.start))

    node.exit().remove();
}

function click(d) {
    if (d.data.children) {
        d.data._children = d.data.children;
        d.data.children = null;
    } else {
        d.data.children = d.data._children;
        d.data._children = null;
    }
    updateTest();
}

document
    .getElementById('update')
    .addEventListener('click', updateTest)

