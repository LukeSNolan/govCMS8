//Main menu mobile toggle
jQuery(".region.region-primary-menu a.main-menu-mobile-link").click(function() {
    jQuery(".region.region-primary-menu .main-menu-items-wrapper").toggle();
});

jQuery(".region.region-primary-menu span.sub-menu-arrow").click(function() {
    jQuery(this).parent().next().toggleClass('mobile-menu-expanded');
	jQuery(this).html(jQuery(this).html().charCodeAt(0) == "8744" ? "&#8743;" : "&#8744;");
});