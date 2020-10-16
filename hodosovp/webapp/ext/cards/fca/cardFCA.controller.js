(function () {
	"use strict";

	/* controller for custom card  */

	sap.ui.controller("hodos.hodosovp.ext.cards.fca.cardFCA", {

		onInit: function () {

		},

		onAfterRendering: function () {

		},

		onExit: function () {

		},

		onFCA: function (oEvent) {
			var oMainComponent = this.oMainComponent;
			oMainComponent.doCustomNavigation(this.oCardComponentData.cardId, oEvent.getSource().getBindingContext(), oMainComponent.getGlobalFilter()
				.getFilterData());
		}
	});
})();