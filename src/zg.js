import * as d3 from 'd3';

const hgrid = () => {
  let width = 0;
  let height = 0;
  let padding = 0;
  const grid = nodes => {
    let accHeight = 0;
    let padding = 5;
    nodes.forEach(node => {
      console.log('d.data.height', node);
      if (node.data.hide) {
        node.data.heightT = node.data.height;
        node.data.height = 0;  
      } else {
        if (node.data.heightT) {
          node.data.height = node.data.heightT;
        }
        node.data.y = accHeight;
        node.data.x = node.depth * 50;
        accHeight += node.data.height + padding;
      }
    });
    return nodes;
  }; 

  grid.size = v => {
    width = v[0];
    height = v[1];
    return grid;
  }

  grid.padding = v => {
    padding = v;
    return grid;
  }
  return grid;
};

let width = 800;
let height = 800;

const myGrid = hgrid()
                .size([width, height])
                .padding(5)

let svg = d3.select('svg')
            .attr('width', width)
            .attr('height', height)

let focus = svg.append('g');
let data = {
  name: 'root #1',
  width: 100,
  height: 300,
  children: [
  {
    name: 't1 #1',
    task: 'task1',
    width: 400,
    height: 50,
    children: [
      {
        name: 't1-1 #1',
        task: 'task1-1',
        width: 200,
        height: 50
      }
    ]
  },
  {
    name: 't2 #2',
    task: 'task2',
    width: 80,
    height: 30
  },
  {
    name: 't3 #3',
    task: 'task3',
    width: 80,
    height: 30
  }]
};

const update = () => {
  let root =  d3.hierarchy(data);
  let nodes = [];
  root.eachBefore(d => {
    nodes.push(d);
    console.log('d', d);
  })
  // console.log('empy', empy);
  // let nodes = root.descendants();
  let rect = focus.selectAll('rect').data(myGrid(nodes));

   
  rect
    .enter()
    .append('rect')
    .on('mousedown', (e) => {
      e.children.forEach(d => {
        d.data.hide = !d.data.hide;
        update();
      });
    })
    .transition()
    .duration(500)
    .attr('class', 'rect')
    .attr('width', d => {
      console.log('dd', d.data.task)
      return d.data.width;
    })
    .attr('height', d => d.data.height)
    .attr('fill', 'gray')
    .attr('x', d => d.data.x)
    .attr('y', d => d.data.y)
    

  rect
    .transition()
    .duration(500)
    .attr('width', d => d.data.width)
    .attr('height', d => d.data.height)
    .attr('fill', 'gray')
    .attr('x', d => d.data.x)
    .attr('y', d => d.data.y)

  // svg.attr('height', data.length * 200);
}
update();

// document.getElementById('add').addEventListener('click', () => {
//   data.push(
//     {
//       task: `task${data.length}`,
//       width: Math.random() * 200,
//       height: Math.random() * 200
//     }
//   )
//   update();
// });


// let family = d3.hierarchy({
//   name: 'root #1',
//   children: [
//     {name: "child #1"},
//     {
//       name: "child #2",
//       children: [
//         {
//           name: "grandchild #1",
//           children: [
//             {
//               name: "grandchild #33"
//             }
//           ]
//         },
//         {
//           name: "grandchild #2"
//         },
//         {name: "grandchild #3"}
//       ]
//     }
//   ]
// })
// console.log('===================================');
//             // console.log(family.descendants())
// let nodes = family.path();
// nodes.forEach(node => console.log('node', node.data.name));