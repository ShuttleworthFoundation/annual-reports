(function() {
    function curveEdge(outerRadius, startAngle) {
	return [
	    outerRadius*Math.sin(startAngle),
	    outerRadius*Math.cos(startAngle)
	]
    }
    
    SelectionWidget = function(node, data) {
	this.rDelta = 10;
	this.colors = ['#ff0000', '#00ff00', '#000000ff', '', '', ''];
	
	this.node = node;
	if (data) {
	    this.data = data;
	    this.init();
	    this.draw();
	} else {
	    this.load();
	}
    }

    SelectionWidget.prototype = {
	init: function() {
	    var me = this;
	    
	    var size = me.rDelta*(me.data.length+1);
	    d3.select(me.node)
		.attr('viewBox', 
		      (-size) + ' ' + (-size) + ' ' + (3.1*size) + ' ' + (2*size)
		     )
	    
	    var base = d3.select(me.node)
		.append('svg:g')
		.attr('class', 'base');
	    base.append('svg:circle')
		.attr('class', 'grey')
		.attr('cx', '0')
		.attr('cy', '0')
		.attr('r', (me.rDelta*0.8));
	    
	    var arc = d3.svg.arc();
	    base.selectAll('path')
		.data(me.data)
		.enter()
		.append('svg:path')
		.attr('class', function(d, i) {
		    if (i == me.data.length-1) {
			return 'transparent';
		    }
		    return 'grey';
		})
		.attr('d', function(d, i) {
		    d.innerRadius = me.rDelta*(i+1);
		    d.outerRadius = me.rDelta*(i+1) + (me.rDelta*0.8);
		    d.startAngle = 0;
		    d.endAngle = 2*Math.PI;
		    return arc(d, i);
		});
	},
	load: function() {
	    var me = this;
	    var src = me.node.attributes['data-src'].value;
	    
	    d3.json(src, function(json) {
		me.data = json;
		me.init();
		me.draw();
	    });
	},
	draw: function() {
	    var me = this;
	    var arc = d3.svg.arc();
	    var size = me.rDelta*(me.data.length+1);
	    
	    var max = 0;
	    for (i=0; i<me.data.length; i++) {
		var value = me.data[i].value;
		if (value > max) { max = value; };
	    }

	    var scale = d3.scale.pow().exponent(0.6).domain([0,max]).range([0,1.5*Math.PI]);
	    for (i=0; i<me.data.length; i++) {
		var scaled = scale(me.data[i].value);
		me.data[i].innerRadius = me.rDelta*(i+1);
		me.data[i].outerRadius = me.rDelta*(i+2);
		me.data[i].startAngle = 0.75*Math.PI;
		me.data[i].endAngle = me.data[i].startAngle + scaled;
	    }
	    
	    var segments = d3.select(me.node)
		.selectAll('g.segment')
		.data(me.data)
		.enter()
		.append('svg:g')
		.attr('class', function(d, i) { return 'segment segment'+i; });
	    segments.append('svg:path')
		.attr('class', function(d, i) { return 'bar bar'+i; })
		.attr('d', arc);
	    segments.append('svg:line')
		.attr('class', function(d, i) { return 'bar bar'+i; })
		.attr('x1', function(d, i) { d.x1 = (d.outerRadius-0.5)*Math.sin(d.startAngle); return d.x1; })
		.attr('y1', function(d, i) { d.y1 = -(d.outerRadius-0.5)*Math.cos(d.startAngle); return d.y1; })
		.attr('x2', function(d, i) { d.x2 = size; return d.x2-2; })
		.attr('y2', function(d, i) { d.y2 = d.y1 - (d.x2 - d.x1); return d.y2+2; });
	    segments.append('svg:path')
		.attr('class', function(d, i) { return 'bar bar'+i; })
		.attr('transform', function(d, i) { return 'translate('+d.x2+','+d.y2+')'; })
		.attr('d', 'M0,5A5,5 0 1,1 0,-5A5,5 0 1,1 0,5M0,2.5A2.5,2.5 0 1,0 0,-2.5A2.5,2.5 0 1,0 0,2.5Z');
	    segments.append('svg:text')
		.attr('class', function(d, i) { return 'bar bar'+i; })
		.attr('x', function(d, i) { return d.x2+7; })
		.attr('y', function(d, i) { return d.y2; })
		.attr('dy', '0.35em')
		.text(function(d, i) { return d.label; })
		.append('svg:tspan')
		.attr('x', function(d, i) { return d.x2+60; })
		.text(function(d, i) { return d.value; });	    
	}
    }
})();
