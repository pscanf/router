(function ($) {

	var Routes = {};

	var Route = function (partialHref) {
		this.partialHref = partialHref;
	};
	Route.prototype.constructor = Route;
	Route.prototype.getHTML = function () {
		var request = new XMLHttpRequest();
		request.open("GET", this.partialHref, false);
		request.send(null);
		this.html = request.response;
	};

	var Router = {};
	Router._showRoute = function (path) {
		var route = Routes[path];
		if (!route) {
			route = Routes[Router._defaultPath];
		}
		if (!route.html) {
			route.getHTML();
		}
		Router._view.innerHTML = route.html;
	};
	Router._setView = function (viewId) {
		Router._view = document.getElementById(viewId);
	};
	Router._hijackLink = function (link) {
		link.addEventListener("click", function (e) {
			history.pushState(null, null, this.href);
			Router._showRoute(this.pathname);
			e.preventDefault();
		}, null);
	};
	Router._hijackAllLinks = function () {
		var links = document.querySelectorAll("a");
		for (var i=0; i<links.length; i++) {
			if (links[i].hostname === location.hostname) {
				Router._hijackLink(links[i]);
			}
		}
	};
	Router._hijackBack = function () {
		window.addEventListener("popstate", function(e) {
			Router._showRoute(location.pathname);
		}, null);
	};
	Router.addRoute = function (path, partialHref, def) {
		Routes[path] = new Route(partialHref);
		if (def) {
			Router._defaultPath = path;
		}
	};
	Router.start = function (viewId) {
		Router._setView(viewId || "view");
		Router._hijackAllLinks();
		Router._hijackBack();
		Router._showRoute(Router._defaultPath);
	};

	$.Router = Router;
})(window);
