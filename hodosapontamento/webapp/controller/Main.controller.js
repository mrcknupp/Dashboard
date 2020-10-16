sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/viz/ui5/controls/common/feeds/FeedItem',
	'sap/viz/ui5/data/FlattenedDataset'
], function (Controller, JSONModel, Filter, FilterOperator, FeedItem, FlattenedDataset) {
	"use strict";

	return Controller.extend("hodos.hodosapont.ZHODOSAPONT.controller.Main", {

		onInit: function () {
			//Router
			this.getRouter().getRoute("toTargetMain").attachPatternMatched(this.onRouteMatched, this);

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

		onRouteMatched: function (oEvent) {
			var that = this,
				sRoute = oEvent.getParameter("name"),
				oView = this.getView(),
				oModel = oView.getModel(),
				oArguments,
				oResourceBundle = oView.getModel("i18n").getResourceBundle(),
				aFilters = [],
				oGraphicModel = new sap.ui.model.json.JSONModel(),
				sApontEntity,
				sApontVendedorEntity,
				sFeedEntity;

			if (sRoute === "toTargetMain") {

				//Get parameters
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

				//Filter to call service
				var sTargetEntity, sTargetTime = "Mes";
				if (oArguments.Pais) {
					aFilters.push(new Filter("Pais", FilterOperator.EQ, oArguments.Pais));
					sTargetEntity = "Pais";
				} else {
					oArguments.Pais = "";
				}
				
				if (oArguments.Geral) {
					aFilters.push(new Filter("Geral", FilterOperator.EQ, oArguments.Geral));
					sTargetEntity = "Geral";
				} else {
					oArguments.Geral = "";
				}
				
				if (oArguments.Regional) {
					aFilters.push(new Filter("Regional", FilterOperator.EQ, oArguments.Regional));
					sTargetEntity = "Regional";
				} else {
					oArguments.Regional = "";
				}
				
				if (oArguments.CodLoja) {
					aFilters.push(new Filter("CodLoja", FilterOperator.EQ, oArguments.CodLoja));
					sTargetEntity = "CodLoja";
				} else {
					oArguments.CodLoja = "";
				}
				
				if (oArguments.CodVendedor) {
					aFilters.push(new Filter("CodVendedor", FilterOperator.EQ, oArguments.CodVendedor));
					sTargetEntity = "CodVendedor";
				} else {
					oArguments.CodVendedor = "";
				}
				
				if (oArguments.Ano) {
					aFilters.push(new Filter("Ano", FilterOperator.EQ, oArguments.Ano));
				}
				if (oArguments.Mes) {
					aFilters.push(new Filter("Mes", FilterOperator.EQ, oArguments.Mes));
				}
				if (oArguments.Semana) {
					aFilters.push(new Filter("Semana", FilterOperator.EQ, oArguments.Semana));
					sTargetTime = "Semana";
				}  else {
					oArguments.Semana = "";
				}
				
				//Set filter model with parameters
				oView.setModel(new JSONModel(oArguments), "filter");
				
				//Get entity description for feed item
				sFeedEntity = oResourceBundle.getText("txt" + sTargetEntity);

				//Check which entity was selected
				switch (sTargetEntity) {
				case "Pais":
					if (sTargetTime === "Semana") {
						sApontEntity = "/StoreRatePaisSet";
					} else {
						sApontEntity = "/StoreRatePaisMesSet";
					}

					break;
				case "Geral":
					if (sTargetTime === "Semana") {
						sApontEntity = "/StoreRateGerSet";
					} else {
						sApontEntity = "/StoreRateGerMesSet";
					}

					break;
				case "Regional":
					if (sTargetTime === "Semana") {
						sApontEntity = "/StoreRateRegSet";
					} else {
						sApontEntity = "/StoreRateRegMesSet";
					}

					break;
				case "CodLoja":
					if (sTargetTime === "Semana") {
						sApontEntity = "/StoreRateSet";
					} else {
						sApontEntity = "/StoreRateMesSet";
					}

					break;
				case "CodVendedor":
					if (sTargetTime === "Semana") {
						sApontEntity = "/StoreRateFuncSet";
					} else {
						sApontEntity = "/StoreRateFuncMesSet";
					}

					break;
				}

				//Set conversion rate entity
				sApontVendedorEntity = sTargetTime === "Semana" ? "/ConversaoFuncSet" : "/ConversaoFuncMesSet";

				var oVizFrame = that.getView().byId("idVizFrame");
				oVizFrame.setBusy(true);

				//Call service
				oModel.read(sApontEntity, {
					filters: aFilters,
					success: function (oData, response) {
						var aResults = [];
						for (var i = 0; i < oData.results.length; i++) {
							aResults.push({
								"Pais": oData.results[i].Pais,
								"Geral": oData.results[i].Geral,
								"Regional": oData.results[i].Regional,
								"CodLoja": oData.results[i].CodLoja,
								"CodVendedor": oData.results[i].CodVendedor,
								"QtdAval": parseInt(oData.results[i].QtdAval, 10),
								"MetaAval": parseInt(oData.results[i].MetaAval, 10)
							});
						}
						oGraphicModel.setData(aResults);
						that.getView().setModel(oGraphicModel, "graphic");

						//Set graphic
						var oDataset = new FlattenedDataset({
							dimensions: [{
								name: sFeedEntity,
								value: "{" + sTargetEntity + "}"
							}],
							measures: [{
								name: 'Avaliações realizadas',
								value: '{QtdAval}'
							}, {
								name: 'Meta apontamentos',
								value: '{MetaAval}'
							}],
							data: {
								path: "/"
							}
						});

						oVizFrame.setDataset(oDataset);
						oVizFrame.setModel(oGraphicModel);
						oVizFrame.setVizType('column');

						var feedValueAxis = new FeedItem({
								'uid': "valueAxis",
								'type': "Measure",
								'values': ["Avaliações realizadas", "Meta apontamentos"]
							}),
							feedCategoryAxis = new FeedItem({
								'uid': "categoryAxis",
								'type': "Dimension",
								'values': [sFeedEntity]
							});

						oVizFrame.addFeed(feedValueAxis);
						oVizFrame.addFeed(feedCategoryAxis);

						oVizFrame.setVizProperties({
							general: {
								layout: {
									padding: 0.04
								}
							},
							valueAxis: {
								label: {
									visible: true
								},
								title: {
									visible: true
								}
							},
							categoryAxis: {
								title: {
									visible: true
								}
							},
							plotArea: {
								colorPalette: d3.scale.category20().range(),
								dataLabel: {
									visible: true
								}
							},
							legend: {
								title: {
									visible: true
								}
							},
							title: {
								visible: true,
								text: 'Atendimentos apontados'
							}
						});

						oVizFrame.setBusy(false);

					},
					error: function (oError) {

					}
				});

				var oApontVendModel = new sap.ui.model.json.JSONModel();
				var oVizApontVend = this.getView().byId("vizApontVend");
				oVizApontVend.setBusy(true);

				this.getView().getModel().read(sApontVendedorEntity, {
					filters: aFilters,
					success: function (oData, response) {
						var aResults = [];
						for (var i = 0; i < oData.results.length; i++) {
							var iQtdVendeu = parseInt(oData.results[i].QtdVendeu, 10),
								iQtdNVendeu = parseInt(oData.results[i].QtdNVendeu, 10);

							aResults.push({
								"CodVendedor": oData.results[i].CodVendedor,
								"QtdVendeu": parseInt(oData.results[i].QtdVendeu, 10),
								"QtdNVendeu": parseInt(oData.results[i].QtdNVendeu, 10),
								"PercConv": ((iQtdVendeu + iQtdNVendeu) !== 0) ? parseInt(iQtdVendeu / (iQtdVendeu + iQtdNVendeu) * 100, 10) : 0
							});
						}
						oApontVendModel.setData(aResults);
						that.getView().setModel(oApontVendModel, "graphicApont");

						//Set graphic
						var oDatasetApont = new FlattenedDataset({
							dimensions: [{
								name: "Vendedor",
								value: "{CodVendedor}",
							}],
							measures: [{
								name: 'Vendeu',
								value: '{QtdVendeu}'
							}, {
								name: 'Não vendeu',
								value: '{QtdNVendeu}'
							}],
							data: {
								path: "/"
							}
						});

						oVizApontVend.setDataset(oDatasetApont);
						oVizApontVend.setModel(oApontVendModel);

						var feedValueAxis = new FeedItem({
								'uid': "valueAxis",
								'type': "Measure",
								'values': ["Vendeu", "Não vendeu"]
							}),
							feedCategoryAxis = new FeedItem({
								'uid': "categoryAxis",
								'type': "Dimension",
								'values': ["Vendedor"]
							});

						oVizApontVend.addFeed(feedValueAxis);
						oVizApontVend.addFeed(feedCategoryAxis);

						oVizApontVend.setVizProperties({
							general: {
								layout: {
									padding: 0.04
								}
							},
							valueAxis: {
								label: {
									visible: true
								},
								title: {
									visible: true
								}
							},
							categoryAxis: {
								title: {
									visible: true
								}
							},
							plotArea: {
								colorPalette: ["sapUiChartPaletteSemanticGood", "sapUiChartPaletteSemanticBad", "sapUiChartPaletteSemanticNeutralDark1"],
								dataLabel: {
									visible: true
								},
								dataShape: {
									primaryAxis: ['bar', 'bar']
								},
							},
							legend: {
								title: {
									visible: true
								}
							},
							title: {
								visible: true,
								text: 'Atendimentos apontados por vendedor'
							},
						});

						oVizApontVend.setBusy(false);
					},
					error: function (oError) {

					}
				});
			}
		},

		getMyComponent: function () {
			"use strict";
			var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
			return sap.ui.component(sComponentId);
		}
	});
});