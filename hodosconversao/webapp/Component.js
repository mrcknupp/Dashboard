sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"hodos/hodosconversao/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("hodos.hodosconversao.Component", {

		metadata: {
			manifest: "json"
		},

		init: function () {
			
			// set the device model
			var oDeviceModel = new sap.ui.model.json.JSONModel(Device);
			
			oDeviceModel.setDefaultBindingMode("OneWay");
			
			this.setModel(oDeviceModel, "device");

			// call the base component's init function and create the App view
			UIComponent.prototype.init.apply(this, arguments);

			// create the views based on the url/hash
			this.getRouter().initialize();
		}
	});
});