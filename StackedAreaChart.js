function StackedAreaChart(container) {
    const margin = ({ top: 20, right: 20, bottom: 20, left: 40 });

    const width = 800 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

    const svg = d3.select(container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    const g=svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        
    const xScale = d3.scaleTime().range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]);
    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

    g.append("g")
        .attr("class", 'axis y-axis')

    g.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0, ${height})`)

    g.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)// the size of clip-path is the same as
        .attr("height", height); // the chart area
    
    const tooltip = svg
        .append("text")
        .attr('x', 50)
        .attr('y', 20)

    let selected = null, xDomain, data;

    function update(_data) {
        data = _data;//This is to simply call update(data) anywhere in the chart function.

        const keys = selected ? [selected] : data.columns.slice(1);

        var stack = d3.stack()
            .keys(keys)
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);

        var stackedData = stack(data);

        xScale.domain(xDomain ? xDomain : d3.extent(data, d => d.date));
        yScale.domain([0, d3.max(stackedData, i => d3.max(i, d => d[1]))]);
        colorScale.domain(keys);

        const area = d3.area()
            .x(function (d) { return xScale(d.data.date); })
            .y0(function (d) { return yScale(d[0]) })
            .y1(function (d) { return yScale(d[1]) });

        const areas = g.selectAll(".area")
            .data(stackedData, function (d) {
                return d.key;
            });

        areas.enter()
            .append('path')
            .attr("class", "area")
            .attr("clip-path", "url(#clip)") 
            .attr('width',200)
            .merge(areas)
            .attr("d", area)
            .on("mouseover", (event, d, i) => tooltip.text(d.key))
            .on("mouseout", (event, d, i) => tooltip.text(""))
            .on("click", (event, d) => {
                // toggle selected based on d.key
                if (selected === d.key) {
                    selected = null;
                } else {
                    selected = d.key;
                }
                update(data); // simply update the chart again
            })
            .style('fill', d => colorScale(d.key));

        areas.exit().remove();

        const xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(10)

        const yAxis = d3.axisLeft()
            .scale(yScale)

        g.select('.x-axis')
            .transition()
            .call(xAxis)

        g.select('.y-axis')
            .transition()
            .call(yAxis)

    }

    function filterByDate(range) {
        xDomain = range;  // -- (3)
        update(data); // -- (4)
    }
    
    return {
        update,
        filterByDate
    }
}

export default StackedAreaChart;