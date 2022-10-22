import StackedAreaChart from './StackedAreaChart.js';
import AreaChart from './AreaChart.js';


d3.csv('unemployment.csv', d3.autoType).then(data => {
    var keys = Object.keys(data[0]);
    keys = keys.filter(function (k) { return k !== "date" });
  
    data.forEach(function (element) {
        var t = 0
        keys.forEach(k => {
            t = t + element[k]
        })
        element.total = t;
    });
  
    const stackedAreaChart=StackedAreaChart(".stacked-area-chart")
    stackedAreaChart.update(data); 
    
    const areaChart = AreaChart(".area-chart");
    areaChart.update(data);  
    areaChart.on("brushed", (range)=>{
        stackedAreaChart.filterByDate(range); // coordinating with stackedAreaChart
    })
});
