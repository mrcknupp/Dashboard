(function () {
	"use strict";

	/* controller for custom card  */

	sap.ui.controller("hodos.hodosovp.ext.cards.conversao.cardConversao", {

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
					var oConversao = (oData.results.length > 0) ? oData.results[0] : {
						PercConv: 0
					};

					oView.setModel(new sap.ui.model.json.JSONModel(oConversao), "conversao");
				},
				error: function (oError) {

				}
			});
		},
		
		onConversaoPress: function(oEvent) {
			var oMainComponent = this.oMainComponent;
			oMainComponent.doCustomNavigation(this.oCardComponentData.cardId, oEvent.getSource().getBindingContext(), oMainComponent.getGlobalFilter()
				.getFilterData());
		}
	});
})();