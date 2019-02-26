/**
 *	Executes ajax query to fetch data from list
 *	@params query sting and success call back function
 */
function executeQuery(queryUrl,successCallback) {
	jQuery.ajax({
		url: queryUrl,
		type: "GET",
		headers: {
			"accept": "application/json;odata=verbose",
			"X-RequestDigest": jQuery("#__REQUESTDIGEST").val()
		},
		success: successCallback,
		error: function (error) {
			//console.log(JSON.stringify(error));
		}
	});
}

//Main menu mobile toggle
jQuery(".region.region-primary-menu a.main-menu-mobile-link").click(function() {
    jQuery(".region.region-primary-menu .main-menu-items-wrapper").slideToggle();
});

//Main menu sub menu toggle - click
jQuery(".region.region-primary-menu span.sub-menu-arrow").click(function() {
    jQuery(this).parent().next().toggleClass('mobile-sub-menu-expanded');
	jQuery(this).html(jQuery(this).html().charCodeAt(0) == "8744" ? "&#8743;" : "&#8744;");
});

//Main menu sub menu toggle - enter
jQuery(".region.region-primary-menu span.sub-menu-arrow").keypress(function(e){
    if(e.which == 13){
        jQuery(this).parent().next().toggleClass('mobile-sub-menu-expanded');
	    jQuery(this).html(jQuery(this).html().charCodeAt(0) == "8744" ? "&#8743;" : "&#8744;");
    }
});

var myResponse;

//Home Carousel
(function insertOutbreakCarousel() {
    var queryUrl = "rest/views/outbreak-responses-carousel";
    var carouselHtml = "<div class='carousel' data-slick='{\"arrows\": false, \"dots\": true, \"appendDots\": \".carousel-controls\", \"autoplay\": true, \"autoplaySpeed\": 4000, \"swipe\": false, \"fade\": true, \"speed\": 200}'>";
    var carouselStatePickerHtml = "<ul class='carousel-state-selector-list'>";

    executeQuery(queryUrl, function(r){
        myResponse = r;
        var lastState = "";
        var currentState;
        var stateIndex = 0;
        var noCurrentResponsesText = "No current responses";

        jQuery.each(r, function() {
            currentState = this.state;
            
            if(!this.acronym == "") {
                noCurrentResponsesText += " (" + this.acronym + ")";
            }

            if (currentState != lastState && currentState != "New South Wales") {
                
                if (lastState != "") {
                    carouselHtml += "</ul></div></div>";
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
                carouselHtml += "<img class='carousel-item-image' src='" + this.state_image + "' alt='Map of " + currentState + " region'>";
                carouselHtml += "<ul class='carousel-item-list'>";
                carouselHtml += (this.outbreak != "") ? "<li class='carousel-item-li'><a href='" + this.outbreak_link + "'>" + this.outbreak + "</a>" : "<li class='carousel-item-li no-response'>" + noCurrentResponsesText;
                carouselHtml += "</li>";
                carouselStatePickerHtml += (stateIndex == 0) ? "<li class='carousel-state-selector-list-item active' aria-hidden='true'>" : "<li class='carousel-state-selector-list-item' aria-hidden='true'>";
                carouselStatePickerHtml += "<button type='button' data-slide='" + stateIndex + "'>" + currentState + "</button></li>"
            } else {
                carouselHtml += (this.outbreak != "") ? "<li class='carousel-item-li'><a href='" + this.outbreak_link + "'>" + this.outbreak + "</a>" : "<li class='carousel-item-li no-response'>" + noCurrentResponsesText;
                carouselHtml += "</li>";
            }

            noCurrentResponsesText = "No current responses";
        });

        carouselHtml += "</ul></div></div></div><div class='carousel-controls'><button class='carousel-autoplay'>Toggle autoplay</button></div>";
        jQuery('#block-homepagecarousel').html(carouselHtml);
        jQuery('.carousel').slick();
        jQuery('.carousel-controls').append(carouselStatePickerHtml);

        //Sync carousel dots with state picker
        jQuery('.carousel').on('beforeChange', function(event, slick, currentSlide, nextSlide){
            jQuery('.carousel-state-selector-list-item.active').removeClass('active');
            jQuery('.carousel-state-selector-list-item').eq(nextSlide).addClass('active');
        });
        
        //Control slides with state picker
        jQuery(".carousel-state-selector-list-item button").click(function() {
            var stateListButton = jQuery(this);
            var stateListItem = stateListButton.parent();
    
            if(!stateListItem.hasClass('active')) {
                jQuery('.carousel').slick('slickGoTo', stateListButton.data("slide"));
            }
        });

        jQuery(".carousel-autoplay").click(function() {
            var autoplayButton = jQuery(this);

            if(autoplayButton.hasClass('paused')) {
                jQuery('.carousel').slick('slickPlay');
            } else {
                jQuery('.carousel').slick('slickPause');
            }

            autoplayButton.toggleClass('paused');
        });
    });
}());