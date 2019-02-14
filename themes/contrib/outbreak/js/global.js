//Search placeholder text
jQuery('#views-exposed-form-content-search-page-1 input[type="text"]').attr('placeholder','Search...');

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