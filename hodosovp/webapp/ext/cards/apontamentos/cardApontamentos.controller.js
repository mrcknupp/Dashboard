(function () {
	"use strict";

	/* controller for custom card  */

	sap.ui.controller("hodos.hodosovp.ext.cards.apontamentos.cardApontamentos", {

		onInit: function () {
			this.oMainComponent.oGlobalFilter.attachSearch(this.search, this);
		},

		onAfterRendering: function () {
			this.search();
		},

		onExit: function () {

		},

		search: function () {
			var oView = this.getView();
			var oModel = this.getModel();

			oModel.read("/" + this.entitySet.name, {
				success: function (oData, response) {
					var model = {
						quantidade: 0
					};

					if (oData.results && oData.results.length > 0) {
						model = {
							quantidade: parseInt(oData.results[0].QtdAval)
						};
					}

					oView.setModel(new sap.ui.model.json.JSONModel(model), "apontamentos");
				},
				error: function (oError) {

				}
			});
		},

		formatTextApontamentos: function (sRecords) {
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var iRecords = parseInt(sRecords);

			switch (iRecords) {
			case 0:
				return oResourceBundle.getText("txtNenhumAtendApontado");
			case 1:
				return oResourceBundle.getText("txtAtendApontado");
			default:
				return oResourceBundle.getText("txtAtendApontados");
			}
		},

		onApontamentoPress: function (oEvent) {
			var oMainComponent = this.oMainComponent;
			oMainComponent.doCustomNavigation(this.oCardComponentData.cardId, oEvent.getSource().getBindingContext(), oMainComponent.getGlobalFilter()
				.getFilterData());
		}
	});
})();