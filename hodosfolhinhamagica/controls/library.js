/**
 * Initialization Code and shared classes of library hodosovp.FolhaMagica.controls.
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
		 * @name hodosovp.FolhaMagica.controls
		 * @author SAP SE
		 * @version ${version}
		 * @public
		 */

		// delegate further initialization of this library to the Core
		sap.ui.getCore().initLibrary({
			name : "hodosovp.FolhaMagica.controls",
			noLibraryCSS: true,
			version: "${version}",
			dependencies : ["sap.ui.core", "sap.m"],
			types: [],
			interfaces: [],
			controls: [
				"hodosovp.FolhaMagica.controls.RadarChartJS"
			],
			elements: []
		});

		return hodosovp.FolhaMagica.controls;

}, /* bExport= */ false);