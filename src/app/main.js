define([
	'dijit/registry',
	"dojo/_base/declare",
	'dojo/parser',
	'dojo/dom',
	"dojo/dom-style",
	'dojo/dom-construct',
	'dojo/html',
	'dojo/router',
	"dojo/request",
	'dojo/query',
	'dojo/dom-class',
	'dojo/dom-attr',
	'dojo/_base/array',
	'dojo/promise/all',
	'dojo/Deferred',
	'dojo/hash',
	'dojo/topic',
	'dojo/on',
	'app/Card',
	'app/HomepageBanner',
	'app/PageBanner',
	'dijit/layout/ContentPane'
	], function(
		registry,
		declare,
		parser,
		dom,
		domStyle,
		domConstruct,
		html,
		router,
		request,
		query,
		domClass,
		domAttr,
		Array,
		all,
		Deferred,
		hash,
		topic,
		on,
		Card,
		HomepageBanner,
		PageBanner,
		ContentPane
		) {



	//identify sections of the index.html that will hold the html
		var app = {};

		function createGISPageBanner() {
			app.header = new PageBanner({
				id: 'gisportal-banner',
				baseClass: 'sub-nav-title text-white page-banner',
				title: 'Geographic Information Systems',
				routes: [{
					title: 'Map Viewer',
					href: '/#gisportal/mapviewer'
				}, {
					title: 'Web Apps',
					href: '/#gisportal/apps'
				}, {
					title: 'Browse GIS Data',
					href: '/#gisportal/gis-data-browse'
				}, {
					title: 'Backend Database APIs',
					href: '/#gisportal/backend-apis'
				}]
			});

			var pane = new ContentPane({
				id: 'headerPane',
				content: app.header
			}, 'headerPane');
			pane.startup();
		}

		function createOfficePageBanner() {
			app.header = new PageBanner({
				id: 'offices-banner',
				baseClass: 'sub-nav-title text-white page-banner',
				title: 'Office Locations',
				routes: [{
					title: 'Charlotte, NC',
					href: '/#offices/charlotte'
				}, {
					title: 'Atlanta, GA',
					href: '/#offices/atlanta'
				}, {
					title: 'Ft. Lauderdale',
					href: '/#offices/ftlauderdale'
				}]
			});
			var pane = new ContentPane({
				id: 'headerPane',
				content: app.header
			}, 'headerPane');
			pane.startup();
		}

		function createWebResourceBanner() {
			app.header = new PageBanner({
				id: 'web-resources-banner',
				baseClass: 'sub-nav-title text-white page-banner',
				title: 'Online Resource Library',
				routes: [{
					title: 'Live Data Feeds',
					href: '/#web-resources/live-data'
				}, {
					title: 'State Level GIS Data',
					href: '/#web-resources/state-level'
				}, {
					title: 'County Level GIS Data',
					href: '/#web-resources/county-level'
				}, {
					title: 'ESRI Online Resources',
					href: '/#web-resources/esri-resources'
				}]
			});

			var pane = new ContentPane({
				id: 'headerPane',
				content: app.header
			}, 'headerPane');

			pane.startup();
		}

		function createHelpBanner() {
			app.header = new PageBanner({
				id: 'help-banner',
				baseClass: 'sub-nav-title text-white page-banner',
				title: 'Help Documentation',
				routes: [{
					title: 'Technical Details',
					href: '/#help/tech-details'
				}, {
					title: 'About this Site',
					href: '/#help/about'
				}, {
					title: 'Request Help Ticket',
					href: '/#help/request-ticket'
				}, {
					title: 'Tutorials',
					href: '/#help/tutorials'
				}]
			});

			var pane = new ContentPane({
				id: 'headerPane',
				content: app.header
			}, 'headerPane');

			pane.startup();
		}

		var unloadBanner = function() {
			var deferred = new Deferred();
			(function() {
				if (registry.byId('headerPane') !== undefined) {
					domConstruct.empty(registry.byId('headerPane'));
					registry.remove('headerPane');
					deferred.resolve(true);
				} else {
					deferred.resolve(false);
				}
			})();
			return deferred.promise;
		};

		var unloadContent = function() {
			var deferred = new Deferred();
			(function() {
				if (registry.byId('main-content') !== undefined) {
					domConstruct.empty(registry.byId('main-content').containerNode);
					registry.remove('main-content');
					deferred.resolve(true);
				} else {
					deferred.resolve(false);
				}
			})();
			return deferred.promise;
		};

		var unloadSection = function() {
			var deferred = new Deferred();
			all([unloadBanner(), unloadContent()]).then(function(arr) {
				deferred.resolve("page cleaned, ready for new page load");
			});
			return deferred.promise;
		};

		app.loadCards = function(objects, domNode) {
			// each card object has [baseClass, imgSrc, header, content]
			var mainDeferred = new Deferred();

			var pane = new ContentPane({
				id: 'main-content'
			}, 'main-content');


			var nodelist = Array.map(objects, function(e) {
				var deferred = new Deferred();
				if (registry.byId(e.id) !== undefined) {
					registry.byId(e.id).destroyRecursive();
				}
				var div = domConstruct.create('div');
				var new_card = new Card({
					id: e.id,
					baseClass: e.baseClass,
					contents: e.contents,
					imgSrc: e.imgSrc,
					header: e.header
				}, div);
				return deferred.resolve(new_card);
			});

			all(nodelist).then(function(arr) {
				pane.startup();
				Array.forEach(arr, function(e) {
					pane.addChild(e);
				});
				mainDeferred.resolve(pane);
			});
			return mainDeferred.promise;
		};



		router.register("home", function(evt) {
			evt.preventDefault();
			console.log('loading ' + evt.newPath);

			unloadSection().then(function(e) {
				var pane = new ContentPane({
					style: "display: flex",
					id: 'headerPane'
				}, 'headerPane');

				pane.startup();

				if (registry.byId('homepage-banner') === undefined) {
					app.header = new HomepageBanner({
						id: 'homepage-banner',
						baseClass: 'sub-nav-title text-white leader-3 trailer-3',
						title: 'ARORA Engineering GIS Dev Website'
					});
				} else {
					app.header = registry.byId('homepage-banner');
				}

				pane.set('content', app.header);
			}, function(err) {
				console.log(err);
			});
		});

		router.register("gisportal/home", function(evt) {
			evt.preventDefault();
			console.log('loading ' + evt.newPath);

			unloadSection().then(function(e) {
				try {
					registry.byId('gisportal-banner').destroyRecursive();
				} catch(err) {
					console.log(err);
				}

				createGISPageBanner();

			}, function(err) {
				console.log(err);
			});
		});

		router.register("gisportal/mapviewer", function(evt) {
			evt.preventDefault();
			console.log('loading ' + evt.newPath);
			// when navigating within the GIS Portal tab we don't want to detroy the banner
			unloadContent().then(function(e) {
				if (registry.byId('gisportal-banner') !== undefined) {
					app.header.set('title', 'Map Viewer');
				} else {
					// when navigating directly to a subtab, we have to unload the existing banner 
					unloadSection().then(function(e) {
						// then create the GIS Portal banner
						createGISPageBanner();
						app.header.set('title', 'Map Viewer');
					});
				}
			}, function(err) {
				console.log(err);
			});
		});

		router.register("gisportal/apps", function(evt) {
			evt.preventDefault();
			unloadContent().then(function(e) {
				console.log('loading ' + evt.newPath);

				if (registry.byId('gisportal-banner') !== undefined) {
					registry.byId('gisportal-banner').set('title', "Geospatial Applications");
				} else {
					unloadSection().then(function(e) {
						createGISPageBanner();
						app.header.set('title', "Geospatial Applications");
					});
				}
				// Create App Cards to link to mapping applications

				// app.loadCards([{
				// 	id: "AirspaceAppCard",
				// 	imgSrc: '/img/thumbnails/airspace_app.png',
				// 	header: 'Airspace',
				// 	baseClass: 'card column-6 animate-fade-in leader-1 trailer-2',
				// 	contents: 'View and Analyze the data in the airspace of the RTAA Airport'
				// }, {
				// 	id: "eDocAppCard",
				// 	imgSrc: '/img/thumbnails/eDoc_app.png',
				// 	header: 'eDoc Search Tools',
				// 	baseClass: 'card column-6 animate-fade-in pre-1 leader-1 trailer-2',
				// 	contents: 'Search for documents and images using this map focused search tool'
				// }]).then(function(e) {
				// 	console.log(e);
				// }, function(err) {
				// 	console.log(err);
				// });
			});
		});

		router.register("gisportal/gis-data-browse", function(evt) {
			evt.preventDefault();
			console.log("loading "+evt.newPath);
			unloadContent().then(function(e) {
				if (registry.byId('gisportal-banner') !== undefined) {
					registry.byId('gisportal-banner').set('title', 'Browse GIS Data');
				} else {
					unloadSection().then(function(e) {
						createGISPageBanner();
						app.header.set('title', 'Browse GIS Data');
					});
				}
			});
		});

		router.register("gisportal/backend-apis", function(evt) {
			evt.preventDefault();
			console.log("loading "+evt.newPath);
			unloadContent().then(function(e) {
				if (registry.byId('gisportal-banner') !== undefined) {
					registry.byId('gisportal-banner').set('title', 'Backend APIs');
				} else {
					unloadSection().then(function(e) {
						createGISPageBanner();
						app.header.set('title', 'Backend APIs');
					});
				}
			});
		});

		router.register("offices/home", function(evt) {
			evt.preventDefault();
			console.log("loading "+evt.newPath);
			unloadSection().then(function(e) {
				try {
					registry.byId('offices-banner').destroyRecursive();
				} catch(err) {
					// console.log(err);
				}
				createOfficePageBanner();
			});

		});

		router.register("offices/charlotte", function(evt) {
			evt.preventDefault();
			console.log("loading "+evt.newPath);
			unloadContent().then(function(e) {
				if (registry.byId('offices-banner') !== undefined) {
					registry.byId('offices-banner').set('title', 'Charlotte, NC');
				} else {
					unloadSection().then(function(e) {
						createOfficePageBanner();
						app.header.set('title', 'Charlotte, NC');
					});
				}
			});
		});

		router.register("offices/atlanta", function(evt) {
			evt.preventDefault();
			console.log('loading '+evt.newPath);
			unloadContent().then(function(e) {
				if (registry.byId('offices-banner') !== undefined) {
					registry.byId('offices-banner').set('title', 'Atlanta, GA');
				} else {
					unloadSection().then(function(e) {
						createOfficePageBanner();
						app.header.set('title', 'Atlanta, GA');
					});
				}
			});
		});

		router.register("offices/ftlauderdale", function(evt) {
			evt.preventDefault();
			console.log('loading '+evt.newPath);
			unloadContent().then(function(e) {
				if (registry.byId('offices-banner') !== undefined) {
					registry.byId('offices-banner').set('title', 'Ft. Lauderdale, FL');
				} else {
					unloadSection().then(function(e) {
						createOfficePageBanner();
						app.header.set('title', 'Ft. Lauderdale, FL');
					});
				}
			});
		});


		router.register("web-resources/home", function(evt) {
			evt.preventDefault();
			console.log('loading '+evt.newPath);
			unloadSection().then(function(e) {
				try {
					registry.byId('web-resources-banner').destroyRecursive();
				} catch(err) {
					// console.log(err);
				}
				createWebResourceBanner();
			});
		});

		router.register("help/home", function(evt) {
			evt.preventDefault();
			console.log('loading '+evt.newPath);
			unloadSection().then(function(e) {
				try {
					registry.byId('help-banner').destroyRecursive();
				} catch(err) {
					// console.log(err);
				}
				createHelpBanner();
			});
		});

		router.startup();
		app.router = router;
	
		return app;

});
