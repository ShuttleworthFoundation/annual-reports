buildFellow = function(obj) {
    var i;
    var color = ['#c8ddd6', '#bdd5cd'];
    var node = $('#fellow-template').clone();
    node.attr('id', 'fellow-'+obj.id);
    
    var total = 0;
    for (i=0; i<obj.spend.length; i++) { total += obj.spend[i].value; }
    
    /* Set the correct color. */
    var lastColor = $('.fellow-container').last().attr('data-background');
    var index = color.indexOf(lastColor);
    if (index == -1) { index = 0; } else { index++; }
    if (typeof color[index] == 'undefined') { index = 0; }
    node.attr('data-background', color[index]);
    
    /* Replace all text items. */
    node.find('.fellow-ph-name').text(obj.name);
    node.find('.fellow-ph-funds-footnote').text(obj['funds-footnote']);
    node.find('.fellow-ph-duration').text(obj.duration);
    if (typeof obj.funds == 'number') {
	node.find('.fellow-ph-funds').text(obj.funds.formatMoney(2));
    } else {
	node.find('.fellow-ph-funds').text(obj.funds);
    }
    node.find('.fellow-photo').css('background-image', 'url(img/photos/'+obj.id+'.jpg)');
    
    /* Add contact details. */
    var sidebar = node.find('.fellow-sidebar');
    if (obj.blog) {
	sidebar.append($('<div/>', { addClass: 'fellow-contact-blog', text: obj.blog }));
    }
    if (obj.twitter) {
	sidebar.append($('<div/>', { addClass: 'fellow-contact-twitter', text: obj.twitter }));
    }
    if (obj.www) {
	sidebar.append($('<div/>', { addClass: 'fellow-contact-www', text: obj.www }));
    }
    
    /* Build spend breakdown. */
    var breakdown = $('<div/>', { addClass: 'fellow-spend-breakdown' });
    for (i=0; i<obj.spend.length; i++) {
	var data = obj.spend[i];
	var item = $('<div/>', { addClass: 'fellow-spend-item', 
				 attr: {'data-spend-icon': data.label.toLowerCase() } });
	item.append($('<div/>', { addClass: 'fellow-spend-label',
				  text: data.label }));
	item.append($('<div/>', { addClass: 'fellow-spend-amount',
				  text: data.value.formatMoney(2) }));
	breakdown.append(item);
    }
    var item = $('<div/>', { addClass: 'fellow-spend-item', 
			     attr: {'data-spend-icon': 'total' } });
    item.append($('<div/>', { addClass: 'fellow-spend-total',
			      text: total.formatMoney(2) }));
    breakdown.append(item);
    
    node.find('.fellow-spend').append(breakdown);
    
    /* Build donut. */
    var r = 100;
    var color = {
	'People': '#a1624f',
	'Printing': '#768388',
	'Overheads': '#e3af24',
	'Marketing': '#8b8099',
	'Software': '#8ca595',
	'Stipends': '#4c606d',
	'Distribution': '#e8c79a',
	'Travel': '#b6a691',
	'Legal fees': '#8db5cf',
	'Events': '#577844',
	'Infrastructure': '#2F4243'
    };
    
    var vis = d3.select(node[0]).select('svg');
    vis.data([obj.spend]);
    
    var arc = d3.svg.arc()
	.innerRadius(r*0.4)
	.outerRadius(r);
    
    var pie = d3.layout.pie()
	.value(function(d) { return d.value; });
    
    var arcs = vis.selectAll('g.slice')
	.data(pie)
	.enter()
	.append('svg:g')
        .attr('class', 'slice');
    
    arcs.append('svg:path')
        .attr('fill', function(d, i) { return color[obj.spend[i].label]; } )
        .attr('d', arc);
    
    arcs.append('svg:text')
	.attr('class', 'label')
        .attr('transform', function(d) {
            d.innerRadius = r*0.4;
            d.outerRadius = r;
            return 'translate(' + arc.centroid(d) + ')';
	})
	.attr('text-anchor', 'middle')
	.attr('dy', '0.35em')
	.text(function(d, i) {
	    var percent = d.value*100 / total;
	    if (percent < 5) { return '' }
	    return percent.toFixed(0)+'%';
	});
    
    $('.fellow-container').last().after(node);
}

buildAlumni = function(obj) {
    var node = $('#fellow-alumni').find('.fellow-alumni-section').first().clone();
    node.attr('id', 'alumni-'+obj.id);

    var i, total = 0;
    for (i=0; i<obj.spend.length; i++) { total += obj.spend[i].value; }
    
    node.find('.fellow-photo-small').css('background-image', 'url(img/photos/'+obj.id+'.jpg)');
    node.find('.fellow-ph-name').text(obj.name);
    
    /* Build spend breakdown. */
    var breakdown = $('<div/>', { addClass: 'fellow-spend-breakdown' });
    for (i=0; i<obj.spend.length; i++) {
	var data = obj.spend[i];
	var item = $('<div/>', { addClass: 'fellow-spend-item' });
	item.append($('<span/>', { addClass: 'fellow-spend-label',
				  text: data.label }));
	item.append($('<span/>', { addClass: 'fellow-spend-amount',
				  text: data.value.formatMoney(2) }));
	breakdown.append(item);
    }
    var item = $('<div/>', { addClass: 'fellow-spend-total' });
    item.append($('<span/>', { addClass: 'fellow-spend-amount',
			       text: total.formatMoney(2) }));
    breakdown.append(item);    
    node.find('.fellow-spend').append(breakdown);


    $('.fellow-alumni-section').last().after(node);
    
}
