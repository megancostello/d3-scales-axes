async function scatter(){
    //scatter plot for european city data 
    let wealthHealth;

    await d3.csv('wealth-health-2014.csv', d3.autoType).then(data=>{
        wealthHealth = data;
        console.log('wealth health 2014 data', wealthHealth);
        
    })
    console.log('data print 2 ', wealthHealth);

    const margin = {top:20, left:50, right:20, bottom:20};
  
    const width = 650 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select('.chart').append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let incomeRange = d3.extent(wealthHealth, d=>d.Income);
    let lifeRange = d3.extent(wealthHealth, d=>d.LifeExpectancy);
    let popRange = d3.extent(wealthHealth, d=>d.Population);
    
    const xScale = d3.scaleLinear()
        .domain([incomeRange[0],incomeRange[1]])
        .range([0,width]);

    const yScale = d3.scaleLinear()
        .domain([lifeRange[0],lifeRange[1]])
        .range([height,0]);

    console.log(xScale(incomeRange[1])); // returns the chart width

    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

    const popScale = d3.scaleLinear()
        .domain([popRange[0],popRange[1]])
        .range([5,30]);

    svg.selectAll("circle")
    .data(wealthHealth)
    .enter()
    .append("circle")
    .attr("cy", (d,i)=>{
        return yScale(d.LifeExpectancy);
      })
    .attr("cx", (d,i)=>{
      return xScale(d.Income);
    })
    .attr("r", (d,i)=>{
        return popScale(d.Population);
      })
    .attr("fill", d=>colorScale(d.Region))
    .attr("stroke", "black")
    .style("opacity", "65%")
    .on("mouseenter", (event, d) => {
        // show the tooltip
        const pos = d3.pointer(event, window);
        console.log('position ',pos);
        d3.selectAll(".tooltip")
            .style("display", "block")
            .style("top", pos[1]+"px")
            .style("left", pos[0]+"px")
            .attr("position", "fixed")
            .style("padding", "5px")
            .html(
                // format your tooltip
                "<p>"+
                "Country: " + d.Country + "<br>" +
                "Region: " + d.Region  + "<br>" +
                "Population: " +d3.format(",")(d.Population)+"<br>" +
                "Income: " + d3.format(",")(d.Income)+ "<br>" +
                "Life Expectancy: " + d.LifeExpectancy+"<br>" + "</p>"
                
                
            );
    })
    .on("mouseleave", (event, d) => {
        // hide the tooltip
        d3.selectAll(".tooltip")
            .style("display","none");
    });

    const xAxis = d3.axisBottom()
	.scale(xScale)
    .ticks(5, "s");;

    const yAxis = d3.axisLeft()
	.scale(yScale);

    svg.append("g")
        .attr("class", "axis x-axis")
        .call(xAxis)
        .attr("transform", `translate(0, ${height})`);
        
    svg.append("text")
		.attr('x', 500)
		.attr('y', 450)
		.text("Income");
        // add attrs such as alignment-baseline and text-anchor as necessary

    svg.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis)
        .attr("transform", `translate(0,0)`);

    svg.append("text")
		.attr('x', 10)
		.attr('y', 35)
		.text("Life Expectancy")
        .attr("transform", `translate(40,0)rotate(90)`);

    let legend = svg.append("g").attr("id", "legend");

    legend.selectAll("rect")
        .data(colorScale.domain())
        .enter()
        .append("rect")
        .attr('x', 400)
        .attr('y', (d,i)=>{
            return 300+i*20;
          })
        .attr("fill", d=>colorScale(d))
        .attr("width", 10)
        .attr("height", 10)
        .attr("stroke", "black")
        .style("opacity", "65%");
        
    legend.selectAll("#legend")
        .data(colorScale.domain())
        .enter()
        .append("text")
        .attr('x', 420)
		.attr('y', (d,i)=>{
            return 310+i*20;
          })
		.text((d,i)=>{
            return d;
          })
        .style("font-size", "15px");
    
    // svg.append("text")
	// 	.attr('x', 500)
	// 	.attr('y', (d,i)=>{
    //         return 300+i*20;
    //       })
	// 	.text((d,i)=>{
    //         return d.Region;
    //       });
    
        
}

scatter();
