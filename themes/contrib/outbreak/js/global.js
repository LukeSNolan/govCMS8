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
var carouselHtml = "<div class='carousel' data-slick='{\"slidesToShow\": 1, \"slidesToScroll\": 1, \"swipe\": false, \"dots\": true, \"arrows\": true}'>";
//Home Carousel
(function insertOutbreakCarousel() {   
    var queryUrl = "rest/views/outbreak-responses-carousel";

    executeQuery(queryUrl, function(r){
        myResponse = r;
        var lastState = "";

        jQuery.each(r, function() {

            if (this.state != lastState) {

                if (lastState != "") {
                    carouselHtml += "</ul></div></div></div>";
                }
                
                lastState = this.state;
                carouselHtml += "<div class='carousel-item'>";
                carouselHtml += "<div class='carousel-item-heading'>Current responses to outbreaks: " + this.state + "</div>";
                carouselHtml += "<div class='carousel-item-main-container'>";
                carouselHtml += "<div class='carousel-item-image'><img src='" + this.state_image + "' alt='Map of " + this.state + " region'></div>";
                carouselHtml += "<div class='carousel-item-list'><ul><li class='carousel-item-li'>";
                carouselHtml += (this.outbreak != "") ? "<a href='" + this.outbreak_link + "'>" + this.outbreak + "</a>" : "No current responses";
                carouselHtml += "</li>";
            } else {
                carouselHtml += "<a href='" + this.outbreak_link + "'>" + this.outbreak + "</a>";
            }  

        });

        carouselHtml += "</ul></div></div></div></div>";
        jQuery('#block-homepagecarousel').html(carouselHtml);
        jQuery('.carousel').slick();
    });
    
}());