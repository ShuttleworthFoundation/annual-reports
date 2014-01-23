function CircularBar(vis, data) {
 
    //var data = vis.data();
    var length = data.length;
    var scale = d3.scale.pow().exponent(0.6).domain([0,80]).range([100,5]);
    var arc = d3.svg.arc();
 
    function bar(d, i) {
	var data = [];
	for (i=0; i<d.length; i++) {
	    var item = d[i];
	    var delay = 0;
	    data.push({
		startAngle: -(Math.PI)/d.length,
		endAngle: (Math.PI)/d.length,
		outerRadius: 100,
		innerRadius: 100,
		innerRadius2: scale(item.value),
		rotate: (Math.PI*2)/d.length*i,
		category: item.category,
		flipValue: ((i > d.length/4) && (i < (d.length*3)/4)),
		flipCategory: (i > d.length/2),
		value: item.value,
		label: item.label
	    });
	}
	return data;
    }

    vis.data([data.items]);
 
    var arcs = vis.selectAll("g.slice")
        .data(bar)
        .enter()
            .append("svg:g")
            .attr("class", function(d,i) {
		return "slice slice-"+d.category;
	    })
	    .attr("transform", function(d, i) {
		return "rotate("+d.rotate*(180/Math.PI)+")";
	    });

    arcs.append("svg:path")
        .attr("fill", function(d, i) { d.color; } )
        .attr("d", arc)
        .transition()
	    .duration(500)
	    .attr("d", function(d, i) {
		d.innerRadius = d.innerRadius2;
		return arc(d, i);
	    });

    /* Set value label inside bar. */
    arcs.append("svg:text")
        .attr("transform", function(d) {
            d.innerRadius = 93;
            d.outerRadius = 100;
	    if (d.flipValue) {
		return "translate(" + arc.centroid(d) + ") rotate(180)";
	    }
	    return "translate(" + arc.centroid(d) + ")";
        })
        .attr("text-anchor", "middle")
        .attr("y", "0.3em")
        .text(function(d, i) { return d.value; });
    /* Set country / category label outside bar. */
    arcs.append("svg:text")
        .attr("transform", function(d, i) {
            d.innerRadius = 100;
            d.outerRadius = 100;
	    if (d.flipCategory) {
		return "translate(" + arc.centroid(d) + ") rotate(90)";
	    }
	    return "translate(" + arc.centroid(d) + ") rotate(270)";
        })
        .attr("class", "label")
        .attr("text-anchor", function(d, i) {
	    return d.flipCategory ? "end" : "start";
        })
        .attr("y", "0.4em")
        .attr("x", function(d, i) {
	    if (d.flipCategory) {
		return "-0.4em";
	    }
	    return "0.4em";
        })
        .text(function(d, i) { return d.label; })
	.attr('opacity', 0)
	.transition()
	    .duration(500)
            .attr('opacity', 1);
    
    /* Aggregated numbers text in the middle of the graph. */
    var text;
    text = vis.append('svg:text')
	.attr('class', 'aggregate')
	.attr('x', -60)
	.attr('y', 7);
    text.attr('opacity', 0)
	.transition()
	    .duration(500)
            .attr('opacity', 1);
    text.append('svg:tspan')
	.attr('class', 'number')
	.text(data.applications);
    text.append('svg:tspan')
	.text(' people from');
    
    text = vis.append('svg:text')
	.attr('class', 'aggregate')
	.attr('x', -10)
	.attr('y', 20);
    text.attr('opacity', 0)
	.transition()
	    .duration(500)
            .attr('opacity', 1);
    text.append('svg:tspan')
	.attr('class', 'number')
	.text(data.countries);
    text.append('svg:tspan')
	.text(' countries applied');
    
    text = vis.append('svg:text')
	.attr('class', 'aggregate-blue')
	.attr('x', -52)
	.attr('y', 34);
    text.attr('opacity', 0)
	.transition()
	    .duration(500)
            .attr('opacity', 1);
    text.append('svg:tspan')
	.text('across ');
    text.append('svg:tspan')
	.attr('class', 'number')
	.text(data.categories);
    text.append('svg:tspan')
	.text(' different themes');
}

