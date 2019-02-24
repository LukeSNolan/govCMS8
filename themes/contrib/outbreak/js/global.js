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
    var carouselHtml = "<div class='carousel' data-slick='{\"arrows\": false, \"dots\": true, \"swipe\": false, \"fade\": true}'>";
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
                carouselStatePickerHtml += "<li class='carousel-state-selector-list-item' aria-hidden='true'><button type='button' data-slide='" + stateIndex + "'>" + currentState + "</button></li>"
            } else {
                carouselHtml += (this.outbreak != "") ? "<li class='carousel-item-li'><a href='" + this.outbreak_link + "'>" + this.outbreak + "</a>" : "<li class='carousel-item-li no-response'>" + noCurrentResponsesText;
                carouselHtml += "</li>";
            }

            noCurrentResponsesText = "No current responses";
        });

        carouselHtml += "</ul></div></div></div>";
        jQuery('#block-homepagecarousel').html(carouselHtml + carouselStatePickerHtml);
        jQuery('.carousel').slick();
    });
    
}());
