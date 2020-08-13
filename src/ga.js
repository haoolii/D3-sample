import * as d3 from 'd3';

const layout = () => {
    let padding;
    let width;
    let height;
    let compH = 80;
    const layout = nodes => {
        let accHeight = 0;
        let margin = 5;
        nodes.forEach(node => {
            node.y = node.depth * 100;
            node.x = accHeight + margin + padding;
            accHeight += compH;
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
    start: new Date('2020/08/13 9:00:00'),
    end: new Date('2020/08/20 12:00:00'),
    children: [
        {
            task: 'Task1',
            start: new Date('2020/08/13 9:00:00'),
            end: new Date('2020/08/15 9:00:00'),
            children: [
                {
                    task: 'Task1-1',
                    start: new Date('2020/08/13 9:00:00'),
                    end: new Date('2020/08/14 12:00:00')
                },
                {
                    task: 'Task1-2',
                    start: new Date('2020/08/13 9:00:00'),
                    end: new Date('2020/08/14 12:00:00')
                },
                {
                    task: 'Task1-3',
                    start: new Date('2020/08/13 9:00:00'),
                    end: new Date('2020/08/14 12:00:00')
                }
            ]
        },
        {
            task: 'Task2',
            start: new Date('2020/08/14 9:00:00'),
            end: new Date('2020/08/15 12:00:00'),
            children: [
                {
                    task: 'Task2-1',
                    start: new Date('2020/08/13 9:00:00'),
                    end: new Date('2020/08/14 12:00:00')
                },
                {
                    task: 'Task2-2',
                    start: new Date('2020/08/13 9:00:00'),
                    end: new Date('2020/08/14 12:00:00')
                },
                {
                    task: 'Task2-3',
                    start: new Date('2020/08/13 9:00:00'),
                    end: new Date('2020/08/14 12:00:00')
                }
            ]
        }
    ]
};
let width = 1200;
let height = 800;
let padding = 50;
let innerWidth = width - padding * 2;
let innerHeight = height - padding * 2;


let myLayout = layout()
                    .size([innerWidth, innerHeight])
                    .padding(padding)

let svg = d3.select('svg')
            .attr('width', width)
            .attr('height', height);

let focus = svg.append('g')
            .attr('transform', `translate(${padding}, ${padding})`);

const updateScale = nodes => {
    
    let xExtent = [
        d3.min(nodes.map(d => d.data.start)),
        d3.max(nodes.map(d => d.data.end))
    ]

    let xRange = d3.scaleTime().range([0, innerWidth]);
    let xScale = xRange.domain(xExtent);
    let xAxis = d3.axisBottom(xRange);

    let x_axis = focus.append("g")
                    .attr("class", "axis axis--x")
                    .attr('transform', 'translate(' + [0, innerHeight] + ')')
                    .call(xAxis);
}

const update = source => {
    root = d3.hierarchy(data);

    let nodes = [];

    root.eachBefore(node => nodes.push(node));

    updateScale(nodes);

    myLayout(nodes)

    let node = focus.selectAll('g.node').data(nodes);

    let nodeEnter = node.enter().append('g')
                        .attr('class', 'node')
                        .on('click', click);

    nodeEnter.append('rect')
            .attr('class', 'node')
            .attr('width', 200)
            .attr('height', 40)

    nodeEnter.append('text')
            .attr('dy', '.35em')
            .attr("x", function(d) {
                return d.children || d._children ? -13 : 13;
            })
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function(d) { return d.data.task; })
            .attr('fill', 'red')

    let nodeUpdate = nodeEnter.merge(node);
    
    nodeUpdate.attr("transform", d => "translate(" + d.y + "," + d.x + ")");

    var nodeExit = 
        node.exit()
        .remove();

    nodeExit.select('text')
        .style('fill-opacity', 0);

    nodes.forEach(function(d){
        d.x0 = d.x;
        d.y0 = d.y;
        });
}

const click = d => {
    if (d.data.children) {
        d.data._children = d.data.children;
        d.data.children = null;
    } else {
        d.data.children = d.data._children;
        d.data._children = null;
    }
    update(d);
}



let root = d3.hierarchy(data);
root.x0 = 0;
root.y0 = 0;
root.children.forEach(collapse);

update(root);

function collapse(d) {
    if(d.children) {
        d._children = d.children
        d._children.forEach(collapse)
        d.children = null
    }
}
let i = 0
