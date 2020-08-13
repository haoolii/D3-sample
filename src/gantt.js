import * as d3 from 'd3';

const data = [
    {
        id: 1,
        task: 'Task1',
        startDate: new Date('2020/08/12 12:00:00'),
        endDate: new Date('2020/08/15 12:00:00'),
        disabled: false,
        child: [
            {
                id: 2,
                task: 'Task1-1',
                startDate: new Date('2020/08/12 12:00:00'),
                endDate: new Date('2020/08/12 18:00:00')
            },
            {
                id: 3,
                task: 'Task1-2',
                startDate: new Date('2020/08/12 18:00:00'),
                endDate: new Date('2020/08/12 20:00:00')
            },
            {
                id: 4,
                task: 'Task1-3',
                startDate: new Date('2020/08/12 20:00:00'),
                endDate: new Date('2020/08/12 23:00:00')
            },
            {
                id: 5,
                task: 'Task1-4',
                startDate: new Date('2020/08/13 01:00:00'),
                endDate: new Date('2020/08/13 05:00:00')
            },
            {
                id: 6,
                task: 'Task1-5',
                startDate: new Date('2020/08/13 06:00:00'),
                endDate: new Date('2020/08/14 01:00:00')
            },
            {
                id: 7,
                task: 'Task1-6',
                startDate: new Date('2020/08/15 01:00:00'),
                endDate: new Date('2020/08/15 11:00:00')
            }
        ]
    },
    {
        id: 8,
        task: 'Task2',
        startDate: new Date('2020/08/14 12:00:00'),
        endDate: new Date('2020/08/16 12:00:00'),
        disabled: false,
        child: [
            {
                id: 9,
                task: 'Task2-1',
                startDate: new Date('2020/08/14 12:00:00'),
                endDate: new Date('2020/08/15 18:00:00')
            }
        ]
    },
    {
        id: 10,
        task: 'Task3',
        startDate: new Date('2020/08/14 14:00:00'),
        endDate: new Date('2020/08/16 12:00:00'),
        disabled: false
    },
    {
        id: 11,
        task: 'Task4',
        startDate: new Date('2020/08/16 1:00:00'),
        endDate: new Date('2020/08/16 13:00:00'),
        disabled: false
    },
    {
        id: 12,
        task: 'Task5',
        startDate: new Date('2020/08/16 5:00:00'),
        endDate: new Date('2020/08/16 14:00:00'),
        disabled: true
    },
    {
        id: 13,
        task: 'Task6',
        startDate: new Date('2020/08/16 12:00:00'),
        endDate: new Date('2020/08/17 12:00:00'),
        disabled: false
    },
    {
        id: 14,
        task: 'Task7',
        startDate: new Date('2020/08/15 12:00:00'),
        endDate: new Date('2020/08/16 20:00:00'),
        disabled: true
    },
    {
        id: 15,
        task: 'Task8',
        startDate: new Date('2020/08/18 14:00:00'),
        endDate: new Date('2020/08/19 16:00:00'),
        disabled: false
    },
    {
        id: 16,
        task: 'Task9',
        startDate: new Date('2020/08/20 12:00:00'),
        endDate: new Date('2020/08/22 12:00:00'),
        disabled: false
    }
]

// Inital
// init(data.filter(d => !d.disabled));

// function init(data) {

//     let width = 800;
//     let height = 400;
//     let padding = 50;
//     let innerWidth = width - padding * 2;
//     let innerHeight = height - padding * 2;

//     let xExtent = [
//         d3.min(data.map(d => d.startDate)),
//         d3.max(data.map(d => d.endDate))
//     ];
//     let color = d3.scaleOrdinal().domain([data.map((d, i) => i)]).range(d3.schemeSet1);

//     let xRange = d3.scaleTime().range([0, innerWidth]);
//     let xScale = xRange.domain(xExtent);
//     let xAxis = d3.axisBottom(xRange)

//     let yRange = d3.scaleBand().range([0, innerHeight]);
//     let yScale = yRange.domain(data.map(d=> d.task))

//     let yAxis = d3.axisLeft(yRange)

//     let svg = d3.select('svg')
//                 .attr('width', width)
//                 .attr('height', height);

//     let focus = svg.append('g')
//                 .attr('class', 'focus')
//                 .style('pointer-events', 'all')
//                 .attr('height', innerHeight)
//                 .attr('width', innerWidth)
//                 .attr('transform', `translate(${padding}, ${padding})`);


//     let x_axis = focus.append('g')
//             .attr('class', 'axis axis--x')
//             .attr('transform', `translate(0, ${innerHeight})`)
//             .call(xAxis);

//     let y_axis = focus.append('g')
//             .attr('class', 'axis axis--y')
//             .call(yAxis);

//     let barLayer = focus.append('g');
//     barLayer.selectAll('.bar')
//             .data(data)
//             .enter().append('rect')
//             .attr('class', 'bar')
//             .attr('fill', (d, i) => color(i))
//             .attr('y', d => yScale(d.task))
//             .attr('x',  d => xScale(d.startDate))
//             .attr('height', d => yScale.bandwidth(d.task))
//             .attr('width', d => xScale(d.endDate) - xScale(d.startDate))

//     barLayer.selectAll(".pending")
//         .data(data)
//         .enter().append("rect")
//         .attr("class", "pending")
//         .attr("y", d => yScale(d.task))
//         .attr("height", y.rangeBand())
//         .attr("x", d => x(d.startDate) + (x(d.endDate) - x(d.startDate)) * d.progress/100)
//         .attr("width", function(d) { return (x(d.to) - x(d.from))*(1-(d.progress/100))});
// }

class Gantt{
    _config;
    _width;
    _height;
    _data;
    _dataOperator;
    _dataFlat = [];
    _innerWidth;
    _innerHeight;
    _padding;
    _el;
    _svg;
    
    // layer
    _Lfoucs;
    _Ltask;
    _LxAxis;
    _LyAxis;

    _xExtent;
    _yExtent;
    
    // Function
    _FxRange;
    _FyRange;
    _FxScale;
    _FyScale;
    _Fcolor;
    
    // Axis
    _xAxis;
    _yAxis;

    constructor(config) {
        this._config = config;
        this.initial = this.initial.bind(this);
        this.initialData = this.initialData.bind(this);
        this.initialExtent = this.initialExtent.bind(this);
        this.initialRange = this.initialRange.bind(this);
        this.initialScale = this.initialScale.bind(this);
        this.initialAxis = this.initialAxis.bind(this);
        this.initialLayer = this.initialLayer.bind(this);
        this.renderTask = this.renderTask.bind(this);
        this.initialColor = this.initialColor.bind(this);
        this.initialListenTask = this.initialListenTask.bind(this);

        this.initial();
    }

    initial() {
        this.initialData();
        this.initialExtent();
        this.initialRange();
        this.initialScale();
        this.initialAxis();
        this.initialLayer();
        this.initialColor();
        this.renderTask();
        this.initialListenTask();
    }

    initialData() {
        this._data = this._config.dataSource.slice(0);
        this._dataOperator = this._data.slice(0);
        this._width = this._config.width;
        this._height = this._config.height;
        this._padding = this._config.padding;
        this._innerHeight = this._height - this._config.padding * 2;
        this._innerWidth = this._width - this._config.padding * 2;
        this._el = this._config.el;
    }

    initialExtent() {
        let __data = this.getData();
        this._xExtent = [
            d3.min(__data.map(d => d.startDate)),
            d3.max(__data.map(d => d.endDate))
        ]
    }
    
    initialRange() {
        this._FxRange = d3.scaleTime().range([0, this._innerWidth]);
        this._FyRange = d3.scaleBand().range([0, this._innerHeight]);
    }

    initialScale() {
        let __data = this.getData();
        this._FxScale = this._FxRange.domain(this._xExtent);
        this._FyScale = this._FyRange.domain(__data.map(d => d.task))
    }

    initialAxis() {
        this._xAxis = d3.axisBottom(this._FxRange)
        this._yAxis = d3.axisLeft(this._FyRange)
    }

    initialLayer() {
        this._svg = d3.select('svg')
                    .attr('width', this._width)
                    .attr('height', this._height);
        this._Lfoucs = this._svg.append('g')
                .attr('transform', `translate(${this._padding}, ${this._padding})`);
        this._LxAxis = this._Lfoucs.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', `translate(0, ${this._innerHeight})`)
            .call(this._xAxis);
        this._LyAxis =this._Lfoucs.append('g')
            .attr('class', 'axis axis--y')
            .call(this._yAxis);

        this._Ltask = this._Lfoucs.append('g');
    }

    initialColor() {
        // let __data = this.getData();
        this._Fcolor = d3.scaleOrdinal().domain([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]).range(d3.schemeSet1);
    }

    renderTask() {
        let preData = this.getData();
        let update = this._Ltask.selectAll('.task')
                    .data(preData);

        let enter = update.enter()
                    .append('rect')
                    .attr('class', 'task')
                    .attr('fill', d => {
                        this._Fcolor(d.id)
                        console.log(d.id);
                        return this._Fcolor(d.id);
                    })
                    .attr('y', d => this._FyScale(d.task))
                    .attr('x',  d => this._FxScale(d.startDate))
                    // .attr('height', d => this._FyRange.bandwidth(d.task))
                    .attr('width', d => this._FxScale(d.endDate) - this._FxScale(d.startDate))
                    .attr("height", d => 0)
                    // .transition()
                    // .duration(300)
                    .attr("height", d => this._FyRange.bandwidth(d.task))

        update.attr('class', 'task')
            .attr('fill', (d, i) => this._Fcolor(d.id))
            .attr('y', d => this._FyScale(d.task))
            .attr('x',  d => this._FxScale(d.startDate))
            .attr('height', d => this._FyRange.bandwidth(d.task))
            .attr('width', d => this._FxScale(d.endDate) - this._FxScale(d.startDate))
            

            // .attr("fill-opacity", 0)
            // .attr("stroke-opacity", 0)
            // .transition()
            // .duration(300)
            // .attr("fill-opacity", 1)
            // .attr("stroke-opacity", 1)
        update.exit()
            // .attr("height", d => this._FyRange.bandwidth(d.task))
            .attr("height", 0)
            .remove();
    }

    initialFun() {
        // this._Fcolor = d3.scaleOrdinal().domain([data.map((d, i) => i)]).range(d3.schemeSet1);
    }

    // Listener
    initialListenTask() {
        this._Ltask
            .selectAll('.task')
            .on('click', (d) => {
                d.isCollapse = !d.isCollapse;
                d.child.forEach(dc => dc.disabled = !d.isCollapse);

                this.initialExtent();
                this.initialScale();
            
                this._LyAxis
                    .transition()
                    .duration(300)
                    .call(this._yAxis);

                this._LxAxis
                    .transition()
                    .duration(300)
                    .call(this._xAxis);
                
                this.renderTask();
            })
    }

    getData() {
        if (this._dataFlat.length === 0) {
            this._dataOperator.forEach(d => {
                this._dataFlat.push(d);
                if (d.child) {
                    d.child.forEach(dc => {
                        if (!dc.disabled) {
                            this._dataFlat.push(dc);
                        }
                    })
                }
            })
        }
        return this._dataFlat.filter(d => !d.disabled);
    }
}

new Gantt({
    width: 1200,
    height: 400,
    padding: 50,
    dataSource: data,
    el: 'svg'
})