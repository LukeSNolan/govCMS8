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

function insertOutbreakCarousel() {
	var carouselItemImage = "/govCMS8/docroot/sites/default/files/2019-01/carousel-responses-";
	var carouselHtml = "<div id='outbreakCarousel' class='carousel slide' data-ride='carousel'><ol class='carousel-indicators'>";
	var carouselValues = {all: "All responses", nsw:"New South Wales", northernterritory: "Northern Territory", westernaustralia: "Western Australia"};
	var stateTerritoryMapping = {"f21ee40c-1dd2-410c-b8a3-20e7b109c2df":"nsw", "4e2975af-167c-49f4-9cf2-7faaad1f0003":"northernterritory","37de9eb7-11eb-45e7-8c5a-e74b2f65ef45": "westernaustralia"};
  
	for (i = 0; i < Object.keys(carouselValues).length; i++) {
	  carouselHtml += "<li data-target='#outbreakCarousel' data-slide-to='" + i + "'></li>";
	}
  
	carouselHtml += "</ol><div class='carousel-inner'>";
  
	jQuery.each(carouselValues, function(key, value) {
	  carouselHtml += "<div class='carousel-item'>";
	  carouselHtml += "<div class='carousel-item-heading'>Current responses to outbreaks: " + value + "</div>";
	  carouselHtml += "<div class='carousel-item-main-container'>";
	  carouselHtml += "<div class='carousel-item-image'><img src='" + carouselItemImage + key + ".jpg' alt='" + key + "' ></div>";
	  carouselHtml += "<div class='carousel-item-list'><ul id='carousel-item-ul-" + key + "'></ul></div>"; //<li class='carousel-item-li'><a href=''>Link 1</a></li><li class='carousel-item-li'><a href=''>Link 2</a></li></ul></div>";
	  carouselHtml += "</div></div>";
	});
  
	carouselHtml += "</div>";
	/*carouselHtml += "<a class='carousel-control-prev' href='#outbreakCarousel' role='button' data-slide='prev'>";
	carouselHtml += "<span class='carousel-control-prev-icon' aria-hidden='true'></span>";
	carouselHtml += "<span class='sr-only'>Previous</span>";
	carouselHtml += "</a><a class='carousel-control-next' href='#outbreakCarousel' role='button' data-slide='next'>";
	carouselHtml += "<span class='carousel-control-next-icon' aria-hidden='true'></span>";
	carouselHtml += "<span class='sr-only'>Next</span>";*/
  
	jQuery(".modifiers-id-paragraph-59 div.paragraph-content").html(carouselHtml);

	jQuery(".carousel-inner .carousel-item:first").addClass('active');
	jQuery(".carousel-indicators li:first").addClass('active');

	//Add outbreak response information into the carousel
	var queryUrl = "rest/views/outbreak-responses";
	var myResponse;

	executeQuery(queryUrl, function(r){
		var outbreakResponseHtml;
		var outbreakResponseUrl;
		myResponse = r;

		jQuery.each(r, function() {
			
			if(this.field_outbreak_list_link[0].uri.indexOf("entity:node/") >= 0) {
				outbreakResponseUrl = this.path[0].alias.substring(1);
			} else {
				outbreakResponseUrl = this.field_outbreak_list_link[0].uri;
			}

			outbreakResponseHtml = "<li class='carousel-item-li'><a href='" + outbreakResponseUrl + "'>" + this.title[0].value + "</a></li>";
			jQuery("#carousel-item-ul-all").append(outbreakResponseHtml);

			jQuery.each(this.field_state_territory, function() {
				jQuery("#carousel-item-ul-" + stateTerritoryMapping[this.target_uuid]).append(outbreakResponseHtml);
			});
		});

	});

}

function insertMinimapsIntoOutbreakResponseList () {
	var minimapPath = "/govCMS8/docroot/sites/default/files/2018-12/minimap_";

	jQuery('.outbreak-list-state-territory-outer').each(function() {
		var minimap = minimapPath + jQuery(this).find('h3').html().toLowerCase() + ".gif";
		jQuery(this).find('h3').after("<img class='minimap-image' src='" + minimap + "'>");
		jQuery(this).wrapInner('<div class="minimap-container"/>');
	});
}

function insertSubMenuArrowsIntoMobileMainMenu() {
	
	jQuery.each(jQuery('#block-govcms8-uikit-starter-mainnavigation .menu-item--expanded>a'),function(){
		jQuery(this).wrap("<div class='menu-item-wrapper'></div>");
		jQuery(this).after("<span class='sub-menu-arrow'>&#8744;</span>");
	});

	jQuery('.sub-menu-arrow').on('click', function() {
		jQuery(this).parent().next().toggleClass('mobile-menu-expanded');
		jQuery(this).html(jQuery(this).html().charCodeAt(0) == "8744" ? "&#8743;" : "&#8744;");
	});

}

//CSS classes to fix up breadcrumbs
jQuery('.block-system-breadcrumb-block').closest('.container').addClass('breadcrumb-parent-container');
jQuery('.block-system-breadcrumb-block').closest('.page-layout__content').addClass('breadcrumb-parent-page-layout__content');

insertSubMenuArrowsIntoMobileMainMenu();
if(jQuery(".modifiers-id-paragraph-59 div.paragraph-content").length) {insertOutbreakCarousel();}
if(jQuery(".view-display-id-outbreak_page_view").length) {insertMinimapsIntoOutbreakResponseList();};