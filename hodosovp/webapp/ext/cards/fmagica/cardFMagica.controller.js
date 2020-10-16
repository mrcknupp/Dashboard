(function () {
	"use strict";

	/* controller for custom card  */

	sap.ui.controller("hodos.hodosovp.ext.cards.fmagica.cardFMagica", {

		onInit: function () {

		},

		onAfterRendering: function () {

		},

		onExit: function () {

		},

		onFolhaMagica: function (oEvent) {
			var oMainComponent = this.oMainComponent;
			oMainComponent.doCustomNavigation(this.oCardComponentData.cardId, oEvent.getSource().getBindingContext(), oMainComponent.getGlobalFilter()
				.getFilterData());
		}
	});
})();