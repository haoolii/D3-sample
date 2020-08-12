import * as d3 from 'd3';

let format = d3.format(",");

let family = d3.hierarchy({
  name: 'root #1',
  children: [
    {name: "child #1"},
    {
      name: "child #2",
      children: [
        {
          name: "grandchild #1",
          children: [
            {
              name: "grandchild #33"
            }
          ]
        },
        {
          name: "grandchild #2"
        },
        {name: "grandchild #3"}
      ]
    }
  ]
})

let nodes = family.path();
nodes.forEach(node => console.log('node', node));

var svg = d3.select("svg").attr({
  width: 1000,
  height: 1000
})
      
// console.log(d3.layout)
  // var rectGrid = d3.layout.grid()
  // .bands()
  // .size([1000, 1000])
  // .padding([0.1, 0.1]);

// function update() {
//   var rect = svg.selectAll(".rect")
//     .data(rectGrid(rects));
//     rect.enter().append("rect")
//       .attr("class", "rect")
//       .attr("width", rectGrid.nodeSize()[0])
//       .attr("height", rectGrid.nodeSize()[1])
//       .attr("transform", function(d) { return "translate(" + (d.x + 460)+ "," + d.y + ")"; })
//       .style("opacity", 1e-6);
//     rect.transition()
//       .attr("width", rectGrid.nodeSize()[0])
//       .attr("height", rectGrid.nodeSize()[1])
//       .attr("transform", function(d) { return "translate(" + (d.x + 460)+ "," + d.y + ")"; })
//       .style("opacity", 1);
//     rect.exit().transition()
//       .style("opacity", 1e-6)
//       .remove();
// }

// update();

// let root = d3.hierarchy(family);
// let nodes = root.descendants();
// console.log(nodes);

// let focus = svg.append('g');


// var rectGrid = d3.layout.grid()
//                 .bands()
//                 .size([1000, 1000])
//                 .padding([0.1, 0.1]);



// let g = focus.selectAll('text')
//     .data(rectGrid(nodes))
//     .enter()
//     .append('text')
//     // .attr('width', 100)
//     // .attr('height', 20)
//     .attr('fill', 'black')
//     .text(d => d.data.data.name)
//     .attr('x', node => node.depth * 50)
//     .attr('y', (node, i) => i * 30)

// g.selectAll('text')
//   .data(nodes)
//   .append('text')
//   .text(d => d.data.data.name)
// fetch('http://localhost:1234/flare-2.json')
//   .then(response => response.json())
//   .then(responseJson => {
    
//     let root = d3.hierarchy(responseJson);
//     let nodes = root.descendants();

//     console.log(nodes);
//     let data = responseJson;
//     let svg = d3.select('svg').attr('width',1000).attr('height', 1000)
                
//     const node = svg.append("g")
//                 .selectAll("g")
//                 .data(nodes)
//                 .join("g")
//                 .attr("transform", d => {
//                   console.log(d.height);
//                   return `translate(0, ${d.height * nodeSize})`
//                 });

//                 node.append("circle")
//                     .attr("cx", d => d.depth * nodeSize)
//                     .attr("r", 2.5)
//                     .attr("fill", d => d.children ? null : "#999");

//                 node.append("text")
//                 .attr("dy", "0.32em")
//                 .attr("x", d => d.depth * nodeSize + 6)
//                 .text(d => d.data.name);

//                 node.append("title")
//       .text(d => d.ancestors().reverse().map(d => d.data.name).join("/"));

//       for (const {label, value, format, x} of columns) {
//         svg.append("text")
//             .attr("dy", "0.32em")
//             .attr("y", -nodeSize)
//             .attr("x", x)
//             .attr("text-anchor", "end")
//             .attr("font-weight", "bold")
//             .text(label);
    
//         node.append("text")
//             .attr("dy", "0.32em")
//             .attr("x", x)
//             .attr("text-anchor", "end")
//             .attr("fill", d => d.children ? null : "#555")
//           .data(root.copy().sum(value).descendants())
//             .text(d => format(d.value, d));
//       }
//     // const node = svg.append('g')
//     //               .selectAll('g')
//     //               .data(nodes)
//     //               .join('g')
//     //                 .attr("transform", d => `translate(0,${+d.index * nodeSize})`);







//   })
