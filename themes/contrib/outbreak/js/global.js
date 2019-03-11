// Execute ajax query
function executeQuery(queryUrl,successCallback) {
	jQuery.ajax({
		url: queryUrl,
		type: "GET",
		headers: {
			"accept": "application/json;odata=verbose",
			"X-RequestDigest": jQuery("#__REQUESTDIGEST").val()
		},
		success: successCallback,
		error: function (error) {}
	});
}

//IE Edge fix. Re-render list items so text decoration css is applied. Expecting fix in later Edge release (check v44.17763).
jQuery(function(){
    if (/Edge/.test(navigator.userAgent)) {
        var menu_clone;
        var parent;
        jQuery('.main-menu-wrapper li, .secondary-menu-wrapper li').each(function(){
            parent = jQuery(this).parent();
            menu_clone = jQuery(this).clone(true);
            jQuery(this).remove();
            menu_clone.appendTo(parent);
        });
    }
});

//External links open in new tab
jQuery('a[href^="http"]').attr({target: "_blank"});

//Main menu mobile toggle
jQuery('.region.region-primary-menu a.main-menu-mobile-link').click(function() {
    jQuery('.region.region-primary-menu .main-menu-items-wrapper').slideToggle();
});

//Main menu sub menu toggle on mobile view
jQuery('.region.region-primary-menu button.sub-menu-arrow').click(function() {
    jQuery(this).parent().next().toggleClass('mobile-sub-menu-expanded');
	jQuery(this).toggleClass('active');
});

//Toggle menu sub menu items on desktop - spacebar
jQuery('.main-menu-wrapper .menu-item-wrapper a, .secondary-menu-wrapper li.has-sub:not(.is-active) > a').keypress(function(e) {
    if(e.which == 32) {
        e.preventDefault();
        var expandedState = (jQuery(this).closest('li.has-sub').attr('aria-expanded') == "true");
        jQuery(this).closest('li.has-sub').attr('aria-expanded', !expandedState);
    }
});

//Collapse menu items on desktop - focus lost
jQuery('.main-menu-wrapper li.has-sub, .secondary-menu-wrapper li.has-sub:not(.is-active)').focusout(function(e) {
    var activeElement = (e.relatedTarget != null) ? e.relatedTarget : document.activeElement;
    if(jQuery(activeElement).parents('li.has-sub[aria-expanded="true"]').length < (jQuery(this).parents('li.has-sub[aria-expanded="true"]').length + 1)) {
        jQuery(this).attr('aria-expanded', false);
    }
});

//Home carousel
function insertOutbreakCarousel() {
    var responsesPerScroll = 3;
    var queryUrl = "rest/views/outbreak-responses-carousel";
    var carouselHtml = "<div class='carousel' data-slick='{\"arrows\": false, \"dots\": true, \"appendDots\": \".carousel-controls\", \"autoplay\": true, \"autoplaySpeed\": 4000, \"swipe\": false, \"fade\": true, \"speed\": 200}'>";
    var carouselStatePickerHtml = "<ul class='carousel-state-selector-list'>";

    executeQuery(queryUrl, function(r){
        var lastState = "";
        var currentState;
        var stateIndex = 0;
        var noOfResponses = 0;
        var noCurrentResponsesText = "No current responses";

        jQuery.each(r, function() {
            currentState = this.state;
            
            if(!this.acronym == "") {
                noCurrentResponsesText += " (" + this.acronym + ")";
            }

            if (currentState != lastState && currentState != "New South Wales") {

                if (lastState != "") {
                    carouselHtml += "</ul>";

                    if(noOfResponses > responsesPerScroll) {
                        carouselHtml += "<div class='response-batch-controls'><a class='next-batch' href='javascript:void(0);'>Scroll Down</a><a class='previous-batch disabled' href='javascript:void(0);'>Scroll Up</a></div>";
                    }

                    carouselHtml += "</div></div></div>";
                    noOfResponses = 0;
                    stateIndex++;
                }
                
                lastState = currentState;

                if(currentState == "Australian Capital Territory") {
                    currentState = "New South Wales & Australian Capital Territory";
                }
                
                lastState = this.state;
                carouselHtml += "<div class='carousel-item'>";
                carouselHtml += "<h2 class='carousel-item-heading'>Current responses to outbreaks: " + currentState + "</h2>";
                carouselHtml += "<div class='carousel-item-main-container'>";
                carouselHtml += "<div class='carousel-item-image-wrapper'><img class='carousel-item-image' src='" + this.state_image + "' alt='Map of " + currentState + " region'></div>";
                carouselHtml += "<div class='carousel-list-wrapper'><ul class='carousel-item-list'>";
                carouselHtml += (this.outbreak != "") ? "<li class='carousel-item-li'><a href='" + this.outbreak_link + "'>" + this.outbreak + "</a></li>" : "<li class='carousel-item-li no-response'>" + noCurrentResponsesText + "</li>";
                carouselStatePickerHtml += (stateIndex == 0) ? "<li class='carousel-state-selector-list-item active' aria-hidden='true'>" : "<li class='carousel-state-selector-list-item' aria-hidden='true'>";
                carouselStatePickerHtml += "<button type='button' data-slide='" + stateIndex + "'>" + currentState + "</button></li>"
            } else {
                carouselHtml += (noOfResponses >= responsesPerScroll) ? "<li class='carousel-item-li batch-hide" : "<li class='carousel-item-li";
                carouselHtml += (this.outbreak != "") ? "'><a href='" + this.outbreak_link + "'>" + this.outbreak + "</a></li>" : " no-response'>" + noCurrentResponsesText + "</li>";
            }
            
            noOfResponses++;
            noCurrentResponsesText = "No current responses";
        });

        carouselHtml += "</ul></div></div></div></div><div class='carousel-controls'><button class='carousel-autoplay'>Toggle autoplay</button></div>";
        jQuery('#block-homepagecarousel').html(carouselHtml);
        jQuery('.carousel').slick();
        jQuery('.carousel-controls').append(carouselStatePickerHtml);

        //Sync carousel dots with state picker
        jQuery('.carousel').on('beforeChange', function(event, slick, currentSlide, nextSlide){
            jQuery('.carousel-state-selector-list-item.active').removeClass('active');
            jQuery('.carousel-state-selector-list-item').eq(nextSlide).addClass('active');
        });
        
        //Show next/previous batch of outbreak responses for the selected state/territory
        jQuery('.response-batch-controls a').click(function() {
            if(!jQuery(this).hasClass('disabled'))
            {
                var items = jQuery(this).closest('.carousel-list-wrapper').find('.carousel-item-li');
                var visibleItems = items.not('.batch-hide');

                visibleItems.addClass('batch-hide');

                if(jQuery(this).hasClass('next-batch')) {
                    visibleItems = visibleItems.last().nextAll();
                } else {
                    visibleItems = visibleItems.first().prevAll();
                }

                visibleItems.slice(0, responsesPerScroll).removeClass('batch-hide');
                jQuery(this).siblings().removeClass('disabled');

                if((jQuery(this).hasClass('next-batch') && !items.last().hasClass('batch-hide')) || (jQuery(this).hasClass('previous-batch') && !items.first().hasClass('batch-hide'))) {
                    jQuery(this).addClass('disabled');
                }
                
            }
        });

        //Control slides with state picker
        jQuery('.carousel-state-selector-list-item button').click(function() {
            var stateListButton = jQuery(this);
            var stateListItem = stateListButton.parent();
    
            if(!stateListItem.hasClass('active')) {
                jQuery('.carousel').slick('slickGoTo', stateListButton.data('slide'));
            }
        });

        //Autoplay (start/pause) button for slides
        jQuery('.carousel-autoplay').click(function() {
            var autoplayButton = jQuery(this);

            if(autoplayButton.hasClass('paused')) {
                jQuery('.carousel').slick('slickPlay');
            } else {
                jQuery('.carousel').slick('slickPause');
            }

            autoplayButton.toggleClass('paused');
        });
    });
}

if(jQuery('#block-homepagecarousel').length) {
    insertOutbreakCarousel();
}