Number.prototype.formatMoney = function(c, d, t){
    var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? ", " : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
    return s + '$' + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

$(document).ready(function() {
    function supportsSvg() {
	return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")
    }
    
    if (supportsSvg()) {
	setTimeout(function() {
	    $('.cover').css('opacity', 0)
	    setTimeout(function() {
		$('.cover').remove();
	    }, 600);
	}, 200);
    } else {
	$('.cover').text('This page requires an SVG capable browser.');
	$('body > *:not(.cover)').remove();
	throw new Error('This is not an error. This is just to abort javascript.');
    }
    
    updateContainers();
    updateContainerSizes();
});

function updateContainerSizes() {
    /* Update photo in CEO's message. */
    var heading = $('#container-heading');
    var height = Math.max(heading.find('.column-325').height(), heading.find('.column-385').height()) + heading.find('.column-700').height();
    heading.find('#photo-helen').css('height', height+'px');
    
    $('.containers').each(function() {
	if (!$(this).hasClass('container-with-fixed')) {
	    var height = $(this).find('.container-sidebar').outerHeight();
	    $(this).css('min-height', height+'px');
	}
    });
    $('.container').last().css('min-height', $(window).height());
    
    $('.container-sidebar').each(function() {
	var sidebar = $(this);
	var container = $('.container');
	/*var left = (container.outerWidth(true) - container.outerWidth())/2;*/
	var left = sidebar.closest('.container').find('.container-content').offset().left;
	sidebar.css('left', left);
    });
    /*
    $('.container.container-fixed').each(function() {
	var sidebar = $(this);
	var container = $('.container');
	var left = (container.outerWidth(true) - container.outerWidth())/2;
	sidebar.css('left', left);
    });
    */
}

function updateContainers() {
    var background = null;
    var found = false;
    var lastFixed = null;
    $('.container:not(.container-inline)').each(function() {
	var elem = $(this);
	var top = elem.offset()['top'];
	var bottom = top + elem.outerHeight();
	var scroll = $(document).scrollTop();
	
	if (elem.hasClass('container-fixed')) {
	    lastFixed = elem;
	} else {
	    if ((scroll+600 > bottom) || (found)) {
		if (elem.css('opacity') != 0) {
		    elem.removeClass('visible');
		    elem.css('opacity', 0);
		    elem.css('z-index', 0);
		    updateContainerSizes();
		}
	    } else {
		if (!background) {
		    background = elem.data('background');
		}
		if (elem.css('opacity') != 1) {
		    elem.addClass('visible');
		    elem.css('opacity', 1);
		    elem.css('z-index', 100);
		    updateContainerSizes();
		    if (elem.hasClass('container-with-fixed') && lastFixed) {
			lastFixed.addClass('visible');
			lastFixed.css('opacity', 1);
			lastFixed.css('z-index', 150);
			lastFixed.find('.container-sidebar').css('left', elem.find('.container-sidebar').offset().left);
			lastFixed.find('.container-content').css('left', elem.find('.container-content').offset().left);
		    } else {
			$('.container-fixed').removeClass('visible');
			$('.container-fixed').css('opacity', 0);
			$('.container-fixed').css('z-index', 0);
		    }
		}
		found = true;
		elem.trigger('visible');
	    }
	    $('body').css('background', background);
	    $('.container-fixed').css('background', background);
	}
	
	/* Scroll sidebar to follow. */
	var sidebar = elem.find('.container-sidebar');
	var height = sidebar.outerHeight();
	var winHeight = $(window).height();
	if ((height > winHeight) && (!sidebar.closest('.container').hasClass('fellow-container'))) {
	    var position = top - scroll;
	    var max = 0;
	    var min = winHeight - height;
	    sidebar.css('top', Math.min(Math.max(top - scroll, min), max));
	}
	
	/* Scroll fellow container. */
	var fscroll = $('.fellow-container.visible');
	if (fscroll.length > 0) {
	    var fcontainer = $('.fellow-container.visible .container-content');
	    var fbottom = fcontainer.offset().top + fcontainer.outerHeight();
	    var sbottom = $(window).scrollTop() + $(window).height();
	    if (fcontainer.outerHeight() > $(window).height()) {
		fcontainer.css('top', fscroll.offset().top - $(window).scrollTop() - 200);
	    } else {
		fcontainer.css('top', 0);
	    }
	}
    });
}

$(document).on('scroll', updateContainers);
$(window).resize(updateContainerSizes);
setTimeout(updateContainers, 500);
