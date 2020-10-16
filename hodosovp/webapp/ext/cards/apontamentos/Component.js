(function () {
	"use strict";

	/* component for custom card */

	jQuery.sap.declare("hodos.hodosovp.ext.cards.apontamentos.Component");
	jQuery.sap.require("sap.ovp.cards.custom.Component");

	sap.ovp.cards.custom.Component.extend("hodos.hodosovp.ext.cards.apontamentos.Component", {
		// use inline declaration instead of component.json to save 1 round trip
		metadata: {
			properties: {
				"contentFragment": {
					"type": "string",
					"defaultValue": "hodos.hodosovp.ext.cards.apontamentos.cardApontamentos"
				},
			},

			version: "@version@",

			library: "sap.ovp",

			includes: [],

			dependencies: {
				libs: ["sap.m"],
				components: []
			},
			config: {},
			customizing: {
				"sap.ui.controllerExtensions": {
					"sap.ovp.cards.generic.Card": {
						controllerName: "hodos.hodosovp.ext.cards.apontamentos.cardApontamentos"
					}
				}
			}
		}
	});
})();