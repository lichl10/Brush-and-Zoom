function AreaChart(container) {
    const margin = ({ top: 20, right: 20, bottom: 20, left: 40 });
  
    const width = 800 - margin.left - margin.right,
          height = 200 - margin.top - margin.bottom;
  
    const svg = d3.select(container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
  
    const g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    const xScale = d3.scaleTime().range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]);
    
    g.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0, ${height})`);
  
    g.append("g")
        .attr("class", 'axis y-axis')
  
    g.append("path")
        .attr("class", "area")

    const brush = d3.brushX()
        .extent( [ [0,0], [width,height] ])
        .on("brush", brushed)
        .on("end", brushended);

    const listeners = { brushed: null };

    function update(data) {
        xScale.domain(d3.extent(data,d => d.date));
        yScale.domain([0, d3.max(data, d => d.total)]);
  
        var area = d3.area()
            .x(function(d) { return xScale(d.date); })
            .y1(function(d) { return yScale(d.total) })
            .y0(height);
  
        g.select(".area")
            .datum(data)
            .attr("fill","steelblue")
            .attr("d", area);

        g.append("g").attr('class', 'brush').call(brush);
  
        const xAxis = d3.axisBottom()
            .scale(xScale)
  
        const yAxis = d3.axisLeft()
            .scale(yScale)
      
        g.select('.x-axis')
            .transition()
            .call(xAxis)
         
        g.select('.y-axis')
            .transition()
            .call(yAxis)
    }

    function brushed(event) {
        if (event.selection) {
          listeners["brushed"](event.selection.map(xScale.invert));
        }
    }

    function brushended(event) {
        if (!event.selection) {
            d3.select(this).call(brush.move, [0,300]);
        }
    }
    function on(event, listener) {
		listeners[event] = listener;
    }

    return {
      update,
      on
    };
  
}
export default AreaChart;