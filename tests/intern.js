define({
	
	proxyPort: 9000,
//
//	// A fully qualified URL to the Intern proxy
	proxyUrl: 'http://localhost:9000/',

  runnerClientReporter: {
      id: 'WebDriver',
      writeHTML: 'true'
  },

	loaderOptions: {
		// Packages that should be registered with the loader in each testing environment


		packages: [ {
            name: 'dgrid',
            location: 'src/dgrid'
          }, {
            name: 'dstore',
            location: 'src/dstore'
          }, {
            name: 'dijit',
            location: 'src/dijit'
          }, {
            name: 'esri',
            location: 'src/esri'
          }, {
            name: 'dojo',
            location: 'src/dojo'
          }, {
            name: 'dojox',
            location: 'src/dojox'
          }, {
            name: 'util',
            location: 'src/util'
          }, {
            name: 'app',
            location: 'src/app'
          }, {
            name: 'tests',
            location: 'tests'
          }, {
            name: 'moment',
            location: 'src/moment'
          }
        ]
	},


	// Non-functional test suite(s) to run in each browser
	suites: ['tests/unit/all'],

	// A regular expression matching URLs to files that should not be included in code coverage analysis
	excludeInstrumentation: /^(?:tests|node_modules|bower_components|src\/(?:dgrid|dijit|dojo|dojox|dstore|esri|moment|util))\//
});
