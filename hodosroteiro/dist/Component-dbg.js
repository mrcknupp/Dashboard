sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"hodos/hodosroteiro/model/models",
	"sap/ui/model/json/JSONModel"
], function(UIComponent, Device, models, JSONModel) {
	"use strict";

	return UIComponent.extend("hodos.hodosroteiro.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function 
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

//			var aQuestions = [];
//			var fnCollor = function(valor) {
//				var sRes;
//				if (valor) {
//					valor = parseFloat(valor, 10);
//					if (valor < 30) {
//						sRes = 8;
//					}
//					if (valor > 30 && valor < 50) {
//						sRes = 3;
//					}
//					if (valor > 50) {
//						sRes = 3;
//					}
//				}
//				return sRes;
//			};
//			for (var i = 1; i < 25; i++) {
//				if (i !== 21) {
//
//					var aQuestao = this.getModel("i18n").getResourceBundle().getText("notasChecklist.questao" + i).split("|");
//					var aux = {
//						Grupo: aQuestao[2],
//						Questao: aQuestao[0],
//						Tipo: aQuestao[1],
//						Total: (Math.random() * 100).toFixed(0),
//						Vendeu: (Math.random() * 100).toFixed(0),
//						nVendeu: (Math.random() * 100).toFixed(0)
//					};
//					aux.corTotal = fnCollor(aux.Total);
//					aux.corVendeu = fnCollor(aux.Vendeu);
//					aux.cornVendeu = fnCollor(aux.nVendeu);
//
//					aQuestions.push(aux);
//				}
//			}
//
//			// Nota Checklist Model
//			var oModel = new JSONModel();
//			oModel.setDefaultBindingMode("TwoWay");
//			oModel.setData(aQuestions);
//			this.setModel(oModel, "notaChecklist");
		}
	});
});