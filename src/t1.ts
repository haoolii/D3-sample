import * as d3 from 'd3';
import { Config } from './interfaces/Config';
import { Data } from './interfaces/Data';
import { mocksS1, mocksS2, mocksS3 } from './t1_mock';

interface DataSourceGroup {
    source: string;
    data: Array<Data[]>
}

class T1 {
    private els: string;
    private height: number;
    private width: number;
    private padding: number = 50;
    private dataSource: Array<Data[]>

    /**
     * 內部使用的變數
     */

    private _dataSource: Array<Data[]>
    private _dataSourceTotal: Data[];
    private _innerWidth: number;
    private _innerHeight: number;
    private _svg;
    private _xExtent;
    private _yExtent;
    private _xScale;
    private _yScale;
    private _xAxis;
    private _yAxis;
    private _flag;

s
    private _color = d3.scaleOrdinal().domain([1, 10]).range(d3.schemeSet1);

    /**
     * 圖層
     */
    private _gLines;
    private _gAxis;

    constructor(config: Config) {
        this.els = config.els;
        this.height = config.height;
        this.width = config.width;
        this.dataSource = config.dataSource;
        this.padding = config.padding;

        this._innerWidth = this.width - this.padding * 2;
        this._innerHeight = this.height - this.padding * 2;
        this.inital();
    }

    /**
     * 初始化流程
     */
    inital() {
        this.initalData();
        this.initalSVG();
        this.initalExtent();
        this.initalScale();
        this.initalAxis();
        this.initalLines();
        this.initalBrush();
        this.initalMouseEvent();
    }
    
    /**
     * 初始化處理Data
     */
    initalData() {
        this._dataSource = this.dataSource.map(source => source.sort((a, b) => a.date.getTime() - b.date.getTime()));
        this._dataSourceTotal = this.dataSource.reduce((acc, val) => acc.concat(val), []);
        this._dataSourceTotal = this._dataSourceTotal.sort((a, b) => a.date.getTime() - b.date.getTime())
    }

    /**
     * 初始化處理SVG
     */
    initalSVG() {
        this._svg = d3.select('svg')
                    .attr('width', this.width)
                    .attr('height', this.height);
    }

    /**
     * 初始化Extent
     */
    initalExtent() {
        this._xExtent = d3.extent(this._dataSourceTotal, data => data.date);
        this._yExtent = d3.extent(this._dataSourceTotal, data => data.value);
    }

    /**
     * 初始化Scale
     */
    initalScale() {
        this._xScale = d3.scaleTime()
                        .domain(this._xExtent)
                        .range([0, this._innerWidth]);

        // this._yScale = d3.scaleLinear()
        //                 .domain(this._yExtent)
        //                 .range([this._innerHeight, 0]);
        this._yScale = d3.scaleLinear()
                        .domain([-10 , 10])
                        .range([this._innerHeight, 0]);
    }

    /**
     * 初始化Axis
     */
    initalAxis() {
        this._yAxis = d3.axisLeft()
                        .tickSize(-this._innerWidth, 0, 0)
                        .scale(this._yScale);
        this._xAxis = d3.axisBottom()
                        .tickSize(-this._innerHeight, 0, 0)
                        .scale(this._xScale);
        this._svg.append('g')
                .attr("class", "x axis")
                .attr('transform', `translate(${this.padding}, ${this._innerHeight + this.padding})`)
                .call(this._xAxis)
                .call(selection => selection.selectAll('text').attr('transform', 'translate(0, 10)'))
        this._svg.append('g')
                .attr("class", "y axis")
                .attr('transform', `translate(${this.padding}, ${this.padding})`)
                .call(this._yAxis)
                .call(selection => selection.selectAll('text').attr('transform', 'translate(-10, 0)'))
    }

    /**
     * 初始化Lines
     */
    initalLines() {
        this._dataSource.forEach((source, i) => {
            this.genSource(source, source[0].source, this._color(i), this._svg.append('g'))
        });
    }
    
    /**
     * 初始化Lines
     */
    initalBrush() {
        this._svg.append("g")
            .attr("class", "brush")
            .call(d3.brush().on("brush", (e) => {
                console.log('brush');
            }));
        // this._brush = d3.brush().on("end", this.brushended);

        // this._svg.append("g")
        //     .attr("class", "brush")
        //     .call(this._brush);
    }


    /**
     * 初始化Tooltip
     */
    initalTooltip() {

    }

    /**
     * 初始化滑鼠事件
     */
    initalMouseEvent() {
        let onMouseDown = this.onMouseDown.bind(this);

        let clickRect = this._svg.append('rect')
            .style('fill', 'none')
            .style('pointer-events', 'all')
            .attr('width', this._innerWidth)
            .attr('height', this._innerHeight)
            .attr('transform', `translate(${this.padding}, ${this.padding})`)
            // .on('mousedown', this.onMouseDown.bind(this)(clickRect))

        clickRect.on('mousedown', function() {
            let clickPosition = d3.mouse(this);
            onMouseDown(clickPosition[0], clickPosition[1])
        });
    }

    onMouseDown(x, y) {
        this.genFlag(x, y);
    }

    // Utils
    /**
     * 產生各資料來源元件
     */
    genSource(source, type, color, g) {
        console.log(`Source: ${source}, Type: ${type}, Color: ${color}`);
        this.genLine(source, type, color, g);
        this.genCircle(source, type, color, g);
    }
    
    /**
     * 製作右側分類
     */
    genCategory() {
        
    }

    genLine(source, type, color, g) {
        g.selectAll('path')
        .data([source])
        .enter().append('path')
        .attr('d', this.getLine())
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 4)
        .attr('transform', `translate(${this.padding}, ${this.padding})`)
    }

    genCircle(source, type, color, g) {
        g.selectAll('myCircles')
        .data(source)
        .enter()
        .append('circle')
        .attr('r', 5)
        .attr('fill', 'white')
        .attr('stroke', color)
        .attr('stroke-width', 4)
        .attr('cx', d => this._xScale(d.date) + this.padding)
        .attr('cy', d => this._yScale(d.value) + this.padding)
    }

    genFlag(x, y) {
        console.log('gen Flag', `${x}, ${y}`);
        let format = d3.timeFormat("%Y/%-m/%-d, %I:%M %p")

        let invertX = this._xScale.invert(x);
        let invertY = this._yScale.invert(y);

        if (this._flag) this._flag.remove();

        this._flag = this._svg.append('g');

        this._flag.append('line')
                    .attr('x1', x)
                    .attr('y1', 0)
                    .attr('x2', x)
                    .attr('y2', this._innerHeight)
                    .attr('stroke', '#a3a3a3')
                    .attr('stroke-width', 2)
                    .attr('transform', `translate(${this.padding}, ${this.padding})`)

        this._flag.append('text')
                .text(format(invertX))
                .attr('x', x)
                .attr('y', 40)

        let flagRect = this._flag.append('rect');

        flagRect
            .attr('stroke', 'red')
            .attr('height', 40)
            .attr('width', 60)
            .attr('x', x + this.padding)
            .attr('y', this.padding)
            .attr('fill', 'white')
            .attr('stroke', '#767676');
        
    }
    

    getLine() {
        return d3.line()
                .x(d => this._xScale(d.date))
                .y(d => this._yScale(d.value))
                .curve(d3.curveStepAfter)
    }
    
}

const config: Config = {
    els: 'svg',
    width: 1200,
    height: 600,
    padding: 50,
    dataSource: [mocksS1, mocksS2, mocksS3]
};
new T1(config);