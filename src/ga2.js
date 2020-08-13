import * as d3 from 'd3';
const layout = () => {
    const layout = (nodes, bandwidth) => {
        let accHeight = 0;
        nodes.forEach(node => {
            // console.log(bandwidth);
            // node.x = node.depth ;
            node.y = accHeight;
            accHeight += bandwidth;
        })
        return nodes;
    }

    layout.size = v => {
        width = v[0];
        height = v[1];
        return layout;
    }
    layout.padding = v => {
        padding = v;
        return layout;
    }
    return layout;
}

const data = {
    task: 'root',
    start: new Date('2020/08/20 01:00:00'),
    end: new Date('2020/08/20 23:00:00'),
    children: [
        {
            task: 'Task1',
            start: new Date('2020/08/20 01:00:00'),
            end: new Date('2020/08/20 11:00:00'),
            children: [
                {
                    task: 'Task1-1',
                    start: new Date('2020/08/20 01:00:00'),
                    end: new Date('2020/08/20 05:00:00')
                },
                {
                    task: 'Task1-2',
                    start: new Date('2020/08/20 05:00:00'),
                    end: new Date('2020/08/20 07:00:00')
                },
                {
                    task: 'Task1-3',
                    start: new Date('2020/08/20 07:00:00'),
                    end: new Date('2020/08/20 11:00:00')
                }
            ]
        },
        {
            task: 'Task2',
            start: new Date('2020/08/20 11:00:00'),
            end: new Date('2020/08/20 23:00:00'),
            children: [
                {
                    task: 'Task2-1',
                    start: new Date('2020/08/20 11:00:00'),
                    end: new Date('2020/08/20 12:00:00')
                },
                {
                    task: 'Task2-2',
                    start: new Date('2020/08/20 12:00:00'),
                    end: new Date('2020/08/20 20:00:00')
                },
                {
                    task: 'Task2-3',
                    start: new Date('2020/08/20 20:00:00'),
                    end: new Date('2020/08/20 23:00:00')
                }
            ]
        }
    ]
};

let width = 1280;
let height = 720;
let padding = 50;
let innerWidth = width - padding * 2;
let innerHeight = height - padding * 2;

let svg = d3.select('svg')
            .attr('width', width)
            .attr('height', height);

let focus = svg.append('g')
            .attr('transform', `translate(${padding}, ${padding})`);
let root = d3.hierarchy(data);

let xLayer = focus.append('g');
let xExtent,
    xRange,
    xScale,
    xAxis,
    xAxisR;

let yLayer = focus.append('g');
let yExtent,
    yRange,
    yScale,
    yAxis;

let myLayout = layout()
                .size([innerWidth, innerHeight])
                .padding(padding)

let t = true;
let lineg = focus.append('g');

function updateX(nodes) {
    if (!xExtent) {
        xExtent = [
            d3.min(nodes.map(node => node.data.start)),
            d3.max(nodes.map(node => node.data.end)),
        ]
    }
    xRange = d3.scaleTime().range([0, innerWidth]);
    xScale = xRange.domain(xExtent);
    xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(20)
            .tickSize(-innerHeight, 0, 0);


    let g = xLayer.append('g')
    
    xAxisR = g
            .attr('class', 'axis axis--x')
            .attr('transform', 'translate(' + [0, innerHeight] + ')')
            .transition().duration(2000)
            .call(xAxis);

}

function updateY(nodes) {
    yRange = d3.scaleBand()
                .range([0, innerHeight]);
    yScale = yRange.domain(nodes.map(node => node.data.task));
    yAxis = d3.axisLeft()
                .scale(yScale)

    yLayer.append('g')
        .transition()
        .duration(1000)
        .attr('class', 'axis axis-y')
        .call(yAxis);
    
        nodes.forEach((node, i) => {
            yLayer.append('line')
                .attr('class', 'axis line')
                .attr('x1', 0)
                .attr('x2', innerWidth)
                .attr('y1', i * yScale.bandwidth())
                .attr('y2', i * yScale.bandwidth())
        });
}


function click(d) {
    if (d.data.children) {
        d.data._children = d.data.children;
        d.data.children = null;
    } else {
        d.data.children = d.data._children;
        d.data._children = null;
    }
    // update();
    console.log('Click', xAxisR);
    xAxisR
        .transition()
        .duration(1000)
        .attr('width', 300)
        .call(xAxis)
        
    
    // let nodes = [];
    
    // root.eachBefore(node => nodes.push(node));

    // // let node = lineg.selectAll('g.node').data(nodes);
    // console.log(nodes);
    
}

function update() {
    let nodes = [];
    root = d3.hierarchy(data);
    root.eachBefore(node => nodes.push(node));
    updateX(nodes);
    updateY(nodes);
    

    let node = lineg.selectAll('g.node').data(nodes);

    // let nodeEnter = node.enter()
    //                     .append('rect')
    //                     .attr('class', 'node')
    //                     .style('cursor', 'pointer')
    //                     .attr('height', d => yScale.bandwidth() - 20)
    //                     .attr('x', node => xScale(node.data.start))
    //                     .attr('y', node => yScale(node.data.task) + 10)
    //                     .attr('width', 0)
    //                     .on('click', click)
    //                     .transition()
    //                     .duration(1500)
    //                     .attr('width', node => xScale(node.data.end) - xScale(node.data.start))

    let nodeExit = node.exit().remove();
    
    if (t) {
        t = false;
    }
}

update();