/**
 * Initialization Code and shared classes of library hodos.hodosencant.controls.
 */
sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/library' // library dependency
	],  function(jQuery, library) {

		"use strict";

		/**
		 * Suite controls library.
		 *
		 * @namespace
		 * @name hodos.hodosencant.controls
		 * @author SAP SE
		 * @version ${version}
		 * @public
		 */

		// delegate further initialization of this library to the Core
		sap.ui.getCore().initLibrary({
			name : "hodos.hodosencant.controls",
			noLibraryCSS: true,
			version: "${version}",
			dependencies : ["sap.ui.core", "sap.m"],
			types: [],
			interfaces: [],
			controls: [
				"hodos.hodosencant.controls.RadarChartJS"
			],
			elements: []
		});

		return hodos.hodosencant.controls;

}, /* bExport= */ false);