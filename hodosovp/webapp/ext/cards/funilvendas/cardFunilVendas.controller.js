(function () {
	"use strict";

	/* controller for custom card  */

	sap.ui.controller("hodos.hodosovp.ext.cards.funilvendas.cardFunilVendas", {

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
			var oModel = new sap.ui.model.odata.v2.ODataModel(this.getModel().sServiceUrl);
			var oFilters = this.oMainComponent.oGlobalFilter.getFilterData();
			var aFilters = [new sap.ui.model.Filter("Pais", sap.ui.model.FilterOperator.EQ, oFilters.Pais),
				new sap.ui.model.Filter("Ano", sap.ui.model.FilterOperator.EQ, oFilters.Ano),
				new sap.ui.model.Filter("Mes", sap.ui.model.FilterOperator.EQ, oFilters.Mes),
				new sap.ui.model.Filter("FiltroOVP", sap.ui.model.FilterOperator.EQ, true),
				new sap.ui.model.Filter("Perc", sap.ui.model.FilterOperator.EQ, "X")
			];

			if (oFilters.Geral) {
				aFilters.push(new sap.ui.model.Filter("Geral", sap.ui.model.FilterOperator.EQ, oFilters.Geral));
			}

			if (oFilters.Regional) {
				aFilters.push(new sap.ui.model.Filter("Regional", sap.ui.model.FilterOperator.EQ, oFilters.Regional));
			}

			if (oFilters.CodLoja) {
				aFilters.push(new sap.ui.model.Filter("CodLoja", sap.ui.model.FilterOperator.EQ, oFilters.CodLoja));
			}

			if (oFilters.CodVendedor) {
				aFilters.push(new sap.ui.model.Filter("CodVendedor", sap.ui.model.FilterOperator.EQ, oFilters.CodVendedor));
			}

			if (oFilters.Semana) {
				aFilters.push(new sap.ui.model.Filter("Semana", sap.ui.model.FilterOperator.EQ, oFilters.Semana));
			}

			oModel.read("/" + this.entitySet.name, {
				filters: aFilters,
				success: function (oData, response) {
					var oFunil = (oData.results.length > 0) ? oData.results : [];
					oView.setModel(new sap.ui.model.json.JSONModel(oFunil), "funilvendas");
				},
				error: function (oError) {

				}
			});
		},

		toInteger: function (sValue) {
			return parseInt(sValue);
		},

		onFunilVendasPress: function (oEvent) {
			var oMainComponent = this.oMainComponent;
			oMainComponent.doCustomNavigation(this.oCardComponentData.cardId, oEvent.getSource().getBindingContext(), oMainComponent.getGlobalFilter()
				.getFilterData());
		}
	});
})();