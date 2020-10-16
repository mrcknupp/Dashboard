sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/Formatter"
], function(Controller, Formatter) {
	//"use strict";

	return Controller.extend("roff.ferromex.mti.controls.BaseController", {

		formatter: Formatter,
		
		getResourceBundle : function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},


	});
});