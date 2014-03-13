Template.google_analytics.rendered = function() {
	return;
	if (!(window._gaq != null)) {
		window._gaq = [];
		
		_gaq.push(['_setAccount', 'UA-39461469-1']);
		_gaq.push(['_setDomainName', 'speechless.tv']);
		_gaq.push(['_setAllowLinker', true]);
		_gaq.push(['_trackPageview']);
		
		return (function() {
			var ga, s;
			ga = document.createElement('script');
			ga.type = 'text/javascript';
			ga.async = true;
			ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';
			s = document.getElementsByTagName('script')[0];
			return s.parentNode.insertBefore(ga, s);
		})();
	}
}