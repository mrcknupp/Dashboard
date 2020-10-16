sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/viz/ui5/format/ChartFormatter'
], function (Controller, JSONModel, Filter, FilterOperator, ChartFormatter) {
	"use strict";

	return Controller.extend("hodos.hodosfunil.controller.Main", {
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

		formatTest: function (sValue) {
			return sValue;
		},

		onRouteMatched: function (oEvent) {
			var sRoute = oEvent.getParameter("name"),
				oView = this.getView(),
				oModel = oView.getModel(),
				that = this,
				sPath,
				sPerdasEntity,
				sPerguntasEntity;

			var ofuncPopover = function (data) {
				var divStr = "";

				if (data.data.val) {
					var values = data.data.val;
					switch (values[2].id) {
					case "Perc":
						divStr = "<div style = 'margin: 5px 30px 0 30px'>" + "% Total" + "<span style = 'float: right'>" + (values[2].value * 10) +
							"%</span></div>";
						break;
					default:
						divStr = "<div style = 'margin: 5px 30px 0 30px'>" + "Valor" + "<span style = 'float: right'>" + values[2].value +
							"</span></div>";
						break;
					}

					return new sap.ui.core.HTML({
						content: divStr
					});
				}
			}.bind(this);

			if (sRoute === "toTargetMain") {

				//Hash route?
				var oArguments = this.sOperation = oEvent.getParameter("arguments");
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

				var aFilters = [];
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

				var aGeneralFilter = aFilters.slice();
				aFilters.push(new sap.ui.model.Filter("FiltroOVP", sap.ui.model.FilterOperator.EQ, true));

				oView.byId("ovpList").getBinding("items").filter(new Filter(aFilters, true));

				if (oArguments.CodVendedor) {
					if (oArguments.Semana) {
						sPath = "/FunilFuncSet(Pais='" + oArguments.Pais + "',Geral='" + oArguments.Geral + "',Regional='" + oArguments.Regional +
							"',CodLoja='" + oArguments.CodLoja + "',Ano='" + oArguments.Ano + "',Mes='" + oArguments.Mes + "',Semana='" + oArguments.Semana +
							"',Area='AGRADECER" + "',CodVendedor='" + oArguments.CodVendedor + "')/";
						sPerdasEntity = "FunilPerdasFuncSet";
						sPerguntasEntity = "FunilPerguntasFuncSet";
					} else {
						sPath = "/FunilFuncMesSet(Pais='" + oArguments.Pais + "',Geral='" + oArguments.Geral + "',Regional='" + oArguments.Regional +
							"',CodLoja='" + oArguments.CodLoja + "',Ano='" + oArguments.Ano + "',Mes='" + oArguments.Mes + "',Area='AGRADECER" +
							"',CodVendedor='" + oArguments.CodVendedor + "')/";
						sPerdasEntity = "FunilPerdasFuncMesSet";
						sPerguntasEntity = "FunilPerguntasFuncMesSet";
					}
				} else if (oArguments.CodLoja) {
					if (oArguments.Semana) {
						sPath = "/FunilSet(Pais='" + oArguments.Pais + "',Geral='" + oArguments.Geral + "',Regional='" + oArguments.Regional +
							"',CodLoja='" + oArguments.CodLoja + "',Ano='" + oArguments.Ano + "',Mes='" + oArguments.Mes + "',Semana='" + oArguments.Semana +
							"',Area='AGRADECER')/";
						sPerdasEntity = "FunilPerdasSet";
						sPerguntasEntity = "FunilPerguntasSet";
					} else {
						sPath = "/FunilMesSet(Pais='" + oArguments.Pais + "',Geral='" + oArguments.Geral + "',Regional='" + oArguments.Regional +
							"',CodLoja='" + oArguments.CodLoja + "',Ano='" + oArguments.Ano + "',Mes='" + oArguments.Mes + "',Area='AGRADECER')/";
						sPerdasEntity = "FunilPerdasMesSet";
						sPerguntasEntity = "FunilPerguntasMesSet";
					}
				} else if (oArguments.Regional) {
					if (oArguments.Semana) {
						sPath = "/FunilRegSet(Pais='" + oArguments.Pais + "',Geral='" + oArguments.Geral + "',Regional='" + oArguments.Regional +
							"',Ano='" + oArguments.Ano + "',Mes='" + oArguments.Mes + "',Semana='" + oArguments.Semana +
							"',Area='AGRADECER')/";
						sPerdasEntity = "FunilPerdasRegSet";
						sPerguntasEntity = "FunilPerguntasRegSet";
					} else {
						sPath = "/FunilRegMesSet(Pais='" + oArguments.Pais + "',Geral='" + oArguments.Geral + "',Regional='" + oArguments.Regional +
							"',Ano='" + oArguments.Ano + "',Mes='" + oArguments.Mes + "',Area='AGRADECER')/";
						sPerdasEntity = "FunilPerdasRegMesSet";
						sPerguntasEntity = "FunilPerguntasRegMesSet";
					}
				} else if (oArguments.Geral) {
					if (oArguments.Semana) {
						sPath = "/FunilGerSet(Pais='" + oArguments.Pais + "',Geral='" + oArguments.Geral + "',Ano='" + oArguments.Ano + "',Mes='" +
							oArguments.Mes + "',Semana='" + oArguments.Semana + "',Area='AGRADECER')/";
						sPerdasEntity = "FunilPerdasGerMesSet";
						sPerguntasEntity = "FunilPerguntasGerSet";
					} else {
						sPath = "/FunilGerMesSet(Pais='" + oArguments.Pais + "',Geral='" + oArguments.Geral + "',Ano='" + oArguments.Ano + "',Mes='" +
							oArguments.Mes + "',Area='AGRADECER')/";
						sPerdasEntity = "FunilPerdasGerMesSet";
						sPerguntasEntity = "FunilPerguntasGerMesSet";
					}
				} else if (oArguments.Pais) {
					if (oArguments.Semana) {
						sPath = "/FunilPaisSet(Pais='" + oArguments.Pais + "',Ano='" + oArguments.Ano + "',Mes='" + oArguments.Mes + "',Semana='" +
							oArguments.Semana + "',Area='AGRADECER')/";
						sPerdasEntity = "FunilPerdasPaisSet";
						sPerguntasEntity = "FunilPerguntasPaisSet";
					} else {
						sPath = "/FunilPaisMesSet(Pais='" + oArguments.Pais + "',Ano='" + oArguments.Ano + "',Mes='" + oArguments.Mes +
							"',Area='AGRADECER')/";
						sPerdasEntity = "FunilPerdasPaisMesSet";
						sPerguntasEntity = "FunilPerguntasPaisMesSet";
					}
				}

				oView.byId("hboxConversao").bindElement({
					path: sPath
				});

				//Restaura filtro e busca entidade
				aFilters = aGeneralFilter;
				oModel.read("/" + sPerdasEntity, {
					filters: aFilters,
					success: function (oData, response) {
						var oPerdas = {
							FunilPerdasSet: oData.results
						};

						var oPerdasModel = new sap.ui.model.json.JSONModel(oPerdas);
						var oVizFramePerdas = that.oVizFramePerdas = oView.byId("idPerdasVendas");
						oVizFramePerdas.setVizProperties({
							plotArea: {
								dataShape: {
									primaryAxis: ["bar"],
									secondaryAxis: ["line"]
								},
								dataLabel: {
									visible: true
								},
								primaryValuesColorPalette: ["#0c6"],
								secondaryValuesColorPalette: ["sapUiChartPaletteSemanticNeutralDark1"],
								secondaryScale: {
									fixedRange: true,
									maxValue: 100,
									minValue: 0
								}
							},
							valueAxis: {
								title: {
									visible: false
								}
							},
							categoryAxis: {
								title: {
									visible: false
								}
							},
							legend: {
								visible: false
							},
							title: {
								visible: false
							}
						});
						oVizFramePerdas.setModel(oPerdasModel);

						//Set popovers
						this.oPopOverPerdas = new sap.viz.ui5.controls.Popover();
						this.oPopOverPerdas.connect(oVizFramePerdas.getVizUid());
						this.oPopOverPerdas.setCustomDataControl(ofuncPopover);
					}.bind(this),
					error: function (oError) {

					}
				});

				oModel.read("/" + sPerguntasEntity, {
					filters: aFilters,
					success: function (oData, response) {
						var aChart = [];

						var oChart = {
							Area: "",
							Values: []
						};

						for (var i = 0; i < oData.results.length; i++) {
							var current = oData.results[i];

							if (current.Area !== oChart.Area) {
								oChart = {
									Area: current.Area,
									Values: []
								};
								oChart.Area = current.Area;
								aChart.push(oChart);
							}

							oChart.Values.push({
								Descricao: current.Descricao,
								Perc: current.Perc,
								QtdNVendeu: current.QtdNVendeu,
								DescricaoCurta: current.DescricaoCurta
							});
						}

						for (i = 0; i < aChart.length; i++) {
							oChart = aChart[i];

							var oPerguntas = {
								FunilPerguntasSet: oChart.Values
							};
							var oPerguntasModel = new sap.ui.model.json.JSONModel(oPerguntas);

							if (i >= 3) break;
							var oVizFramePerguntas = that.oVizFramePerguntas = oView.byId("idPerguntasVendas" + i.toString());
							oVizFramePerguntas.setVisible(true);

							oVizFramePerguntas.setVizProperties({
								plotArea: {
									dataShape: {
										primaryAxis: ["bar"],
										secondaryAxis: ["line"]
									},
									dataLabel: {
										visible: true
									},
									primaryValuesColorPalette: ["#0c6"],
									secondaryValuesColorPalette: ["sapUiChartPaletteSemanticNeutralDark1"],
									secondaryScale: {
										fixedRange: true,
										maxValue: 100,
										minValue: 0
									}
								},
								valueAxis: {
									title: {
										visible: false
									}
								},
								categoryAxis: {
									title: {
										visible: false
									}
								},
								legend: {
									visible: false
								},
								title: {
									text: oChart.Area
								}
							});
							oVizFramePerguntas.setModel(oPerguntasModel);
						}
					},
					error: function (oError) {

					}
				});
			}
		}
	});
});