(function () {
	"use strict";

	/* controller for custom card  */

	sap.ui.controller("hodos.hodosovp.ext.cards.roteiro.cardRoteiro", {

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
					var oRoteiro = (oData.results.length > 0) ? oData.results[0] : {
						CumpRot: ""
					};

					oView.setModel(new sap.ui.model.json.JSONModel(oRoteiro), "roteiro");
				},
				error: function (oError) {

				}
			});
		},

		onRoteiroPress: function (oEvent) {
			var oMainComponent = this.oMainComponent;
			oMainComponent.doCustomNavigation(this.oCardComponentData.cardId, oEvent.getSource().getBindingContext(), oMainComponent.getGlobalFilter()
				.getFilterData());
		}
	});
})();