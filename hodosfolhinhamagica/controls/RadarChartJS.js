// Provides control hodosovp.FolhaMagica.controls.chartjs.RadarChartJS
sap.ui.define([
	"./BaseChartJS"
], function (BaseChartJS) {
	"use strict";
	
	/**
	 * Constructor for a new Chart.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * QRCode Control to render a QR Code
	 * @extends sap.m.InputBase
	 * @version ${version}
	 *
	 * @constructor
	 * @public
	 * @since 1.40
	 * @name hodosovp.FolhaMagica.controls.chartjs.RadarChartJS
	 */
	var RadarChartJS =  BaseChartJS.extend("hodosovp.FolhaMagica.controls.RadarChartJS", {
		
		metadata : {
			//library: 'hodosovp.FolhaMagica.controls.chartjs',
			properties: {
				
				/**
				 * The number of degrees to rotate the chart clockwise.
				 */
				startAngle : {type : "int", group : "Appearance", defaultValue : 0},
				
			},
			aggregations: {},
			events: {}
		},
		
		init: function() {
		},
		
		onBeforeRendering: function() {
			this.setChartType("radar");
		},
		
		/////////////////////////////////////
		// OVERRIDE
		/////////////////////////////////////
		
		addGlobalOptions: function(globalOptions) {
			globalOptions.startAngle = this.getStartAngle();
		},
		
		//////////////////////////////////////////////
		// GETTER / SETTER
		//////////////////////////////////////////////
		
		
		
		//////////////////////////////////////////////
		// CHART METHODS
		//////////////////////////////////////////////
		
	});


	return RadarChartJS;

}, /* bExport= */ true);