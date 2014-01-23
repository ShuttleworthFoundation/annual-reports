function gender(node, data) {
    var male = node.select('g.male');
    var female = node.select('g.female');
    
    data.total = data.male + data.female;
    
    var arc = d3.svg.arc();
    male.select('path.segment').attr('d', arc({
	innerRadius: 25,
	outerRadius: 36,
	startAngle: -(data.male/data.total)*Math.PI,
	endAngle: (data.male/data.total)*Math.PI
    }));
    male.select('text.aggregate').text(data.male);
    female.select('path.segment').attr('d', arc({
	innerRadius: 25,
	outerRadius: 36,
	startAngle: Math.PI-(data.female/data.total)*Math.PI,
	endAngle: Math.PI+(data.female/data.total)*Math.PI
    }));
    female.select('text.aggregate').text(data.female);
}
