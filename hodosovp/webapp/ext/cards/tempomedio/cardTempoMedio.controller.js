(function () {
	"use strict";

	/* controller for custom card  */

	sap.ui.controller("hodos.hodosovp.ext.cards.tempomedio.cardTempoMedio", {

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
					var oTempoMedio = (oData.results.length > 0) ? oData.results[0] : {
						TempMedTot: ""
					};

					oView.setModel(new sap.ui.model.json.JSONModel(oTempoMedio), "tempomedio");
				},
				error: function (oError) {

				}
			});
		},

		toHHMMSS: function (sSeconds) {
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

			if (!sSeconds || sSeconds === "") {
				return oResourceBundle.getText("txtSemDados");
			}

			var iSeconds = parseInt(sSeconds);
			var dValue = new Date(null);

			dValue.setSeconds(iSeconds);
			return dValue.toISOString().substr(11, 8);
		},

		onTempoMedioPress: function (oEvent) {
			var oMainComponent = this.oMainComponent;
			oMainComponent.doCustomNavigation(this.oCardComponentData.cardId, oEvent.getSource().getBindingContext(), oMainComponent.getGlobalFilter()
				.getFilterData());
		}
	});
})();