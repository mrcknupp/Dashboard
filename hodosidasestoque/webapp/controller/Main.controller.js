sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("hodosovp.Estoque.controller.Main", {
		onInit: function () {

			this.attachRoute("toTargetMain", this.onRouteMatched);
		},

		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("appHome", {}, true);
			}
		},

		attachRoute: function (sRoute, fRouteMatched) {
			this.getRouter().getRoute(sRoute).attachPatternMatched(fRouteMatched, this);
		},

		onRouteMatched: function (oEvent) {
			var sRoute = oEvent.getParameter("name"),
				oView = this.getView(),
				oArguments;

			if (sRoute === "toTargetMain") {
				if (!oEvent.getParameter("arguments")) {
					oArguments = oEvent.getParameter("arguments");
				} else if (this.getOwnerComponent().getComponentData()) {
					var oStartupParameters = this.getOwnerComponent().getComponentData().startupParameters;

					oArguments = {
						Pais: oStartupParameters.Pais,
						Geral: oStartupParameters.Geral,
						Regional: oStartupParameters.Regional,
						CodLoja: oStartupParameters.CodLoja,
						Ano: oStartupParameters.Ano,
						Mes: oStartupParameters.Mes,
						Semana: oStartupParameters.Semana,
						CodVendedor: oStartupParameters.CodVendedor
					};
				}
				
				if (!oArguments.Geral) {
					oArguments.Geral = "";
				}

				if (!oArguments.Regional) {
					oArguments.Regional = "";
				}

				if (!oArguments.CodLoja) {
					oArguments.CodLoja = "";
				}

				if (!oArguments.CodVendedor) {
					oArguments.CodVendedor = "";
				}

				if (!oArguments.Semana) {
					oArguments.Semana = "";
				}

				oView.setModel(new JSONModel(oArguments), "filter");

				var that = this,
					oModel = this.getView().getModel(),
					aFilters = [];
					
				for (var i = 0; i < 8; i++) {
					var sProperty;

					switch (i) {
					case 0:
						sProperty = "Pais";
						break;
					case 1:
						sProperty = "Geral";
						break;
					case 2:
						sProperty = "Regional";
						break;
					case 3:
						sProperty = "CodLoja";
						break;
					case 4:
						sProperty = "CodVendedor";
						break;
					case 5:
						sProperty = "Ano";
						break;
					case 6:
						sProperty = "Mes";
						break;
					case 7:
						sProperty = "Semana";
						break;
					}

					if (oArguments[sProperty]) {
						aFilters.push(new sap.ui.model.Filter(sProperty, sap.ui.model.FilterOperator.EQ, oArguments[sProperty]));
					}
				}

				aFilters.push(new sap.ui.model.Filter("Condensed", sap.ui.model.FilterOperator.EQ, false));
				aFilters.push(new sap.ui.model.Filter("FiltroOVP", sap.ui.model.FilterOperator.EQ, true));

				oModel.read("/IdaEstqFuncSet", {
					filters: aFilters,
					success: function (oData, response) {
						var list = [];

						for (var i = 0; i < oData.results.length; i++) {
							list.push({
								"Class": oData.results[i].QtdIda,
								"QtdVendeu": oData.results[i].QtdVendeu,
								"QtdNVendeu": oData.results[i].QtdNVendeu
							});
						}
						var oResult = new sap.ui.model.json.JSONModel({
							"list": list
						});
						that.getView().setModel(oResult);

						var oVizFrame = that.getView().byId("idStackedChart");
						oVizFrame.setVizProperties({
							plotArea: {
								// colorPalette: d3.scale.category20().range(),
								colorPalette: ['#00B300', '#FF0000'],
								dataLabel: {
									showTotal: true
								}
							},
							tooltip: {
								visible: true
							},
							title: {
								text: ""
							},
							valueAxis: {
								title: {
									text: "Quantidade de apontamentos"
								}
							}
						});

						oVizFrame.setModel(oResult);
					},
					error: function (oError) {

					}
				});
			}
		}
	});
});