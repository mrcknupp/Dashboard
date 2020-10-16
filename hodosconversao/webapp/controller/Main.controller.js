sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/viz/ui5/format/ChartFormatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/viz/ui5/data/FlattenedDataset',
	'sap/viz/ui5/controls/common/feeds/FeedItem',
	'sap/viz/ui5/api/env/Format'
], function (Controller, JSONModel, ChartFormatter, Filter, FilterOperator, FlattenedDataset, FeedItem, Format) {
	"use strict";

	return Controller.extend("hodos.hodosconversao.controller.Main", {

		totalConversaoSemana: 0,
		totalConversaoPeriodo: 0,
		totalConversaoDia: 0,
		totalConversaoAtendimento: 0,

		onInit: function () {
			this._chartModel = this.getOwnerComponent().getModel("chart");
			this.getRouter().attachRouteMatched(this.onRouteMatched, this);

			this.getChart("cGeral").setVizProperties({
				plotArea: {
					colorPalette: ["sapUiChartPaletteSemanticGood", "sapUiChartPaletteSemanticBad"]

				}
			});

			this.getChart("cPeriodo").setVizProperties({
				plotArea: {
					dataShape: {
						primaryAxis: ['bar', 'bar'],
						secondaryAxis: ['line']
					},
					primaryValuesColorPalette: ["sapUiChartPaletteSemanticGood", "sapUiChartPaletteSemanticBad",
						"sapUiChartPaletteSemanticNeutralDark1"
					],
					secondaryValuesColorPalette: ["sapUiChartPaletteSemanticNeutralDark1"],
					secondaryScale: {
						fixedRange: true,
						maxValue: 100,
						minValue: 0
					}
				}
			});

			this.getChart("cDiaSemana").setVizProperties({
				plotArea: {
					dataShape: {
						primaryAxis: ['bar', 'bar'],
						secondaryAxis: ['line']
					},
					primaryValuesColorPalette: ["sapUiChartPaletteSemanticGood", "sapUiChartPaletteSemanticBad",
						"sapUiChartPaletteSemanticNeutralDark1"
					],
					secondaryValuesColorPalette: ["sapUiChartPaletteSemanticNeutralDark1"],
					secondaryScale: {
						fixedRange: true,
						maxValue: 100,
						minValue: 0
					}
				}
			});

			this.getChart("cAtendimento").setVizProperties({
				plotArea: {
					dataShape: {
						primaryAxis: ['bar', 'bar'],
						secondaryAxis: ['line']
					},
					primaryValuesColorPalette: ["sapUiChartPaletteSemanticGood", "sapUiChartPaletteSemanticBad",
						"sapUiChartPaletteSemanticNeutralDark1"
					],
					secondaryValuesColorPalette: ["sapUiChartPaletteSemanticNeutralDark1"],
					secondaryScale: {
						fixedRange: true,
						maxValue: 100,
						minValue: 0
					}
				}
			});

			this.getChart("cSemana2").setVizProperties({
				plotArea: {
					dataShape: {
						primaryAxis: ['bar', 'bar'],
						secondaryAxis: ['line']
					},
					primaryValuesColorPalette: ["sapUiChartPaletteSemanticGood", "sapUiChartPaletteSemanticBad",
						"sapUiChartPaletteSemanticNeutralDark1"
					],
					secondaryValuesColorPalette: ["sapUiChartPaletteSemanticNeutralDark1"],
					secondaryScale: {
						fixedRange: true,
						maxValue: 100,
						minValue: 0
					}
				}
			});

			Format.numericFormatter(ChartFormatter.getInstance());
		},

		customFormat: function () {
			var customFormatter = {
				format: function (value, pattern) {
					var formattedString = value;
					if (pattern == "datalabelFormat") {
						if (value > 1) {
							var datalabelFormat = sap.ui.core.format.FileSizeFormat.getInstance();
							formattedString = datalabelFormat.format(value);
							formattedString = formattedString.substring(0, formattedString.length - 1);
						} else if (value < 1) {
							var datalabelFormatPercent = sap.ui.core.format.NumberFormat.getPercentInstance();
							formattedString = datalabelFormatPercent.format(value);
						}
					} else if (pattern == "axisFormat") {
						if (value > 1) {
							var axisFormat = sap.ui.core.format.FileSizeFormat.getInstance();
							formattedString = axisFormat.format(value);
							formattedString = formattedString.substring(0, formattedString.length - 1);
						} else if (value < 1) {
							var axisFormatPercent = sap.ui.core.format.NumberFormat.getPercentInstance();
							formattedString = axisFormatPercent.format(value);
						}
					} else {
						formattedString = value;
					}

					return formattedString;
				}
			};
			jQuery.sap.require("sap.ui.core.format.DateFormat");
			jQuery.sap.require("sap.ui.core.format.FileSizeFormat");
			jQuery.sap.require("sap.ui.core.format.NumberFormat");
			sap.viz.api.env.Format.numericFormatter(customFormatter);
		},

		oRule: function (oContext) {
			if (oContext.measureNames === "Conversao") {
				return true;
			} else {
				return false;
			}
		},

		onAfterRendering: function () {

		},

		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		getChart: function (sId) {
			if (sId) {
				return this.getView().byId(sId);
			} else {
				return null;
			}
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

			var sRoute = oEvent.getParameter("name");

			if (sRoute === "toTargetMain") {
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

				this.getView().setModel(new JSONModel(oArguments), "filter");
				this.readData(oArguments);
			}
		},

		readData: function (oParameters) {
			var that = this,
				sObjectPath,
				sObjectPathConvSemana,
				sObjectPathApontFunc,
				aFilterFields = [],
				aFilterValues = [],
				sTargetEntity,
				sTargetTime;

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

				if (oParameters[sProperty]) {
					if (i >= 0 && i <= 4) {
						sTargetEntity = sProperty;
					} else {
						sTargetTime = sProperty;
					}

					aFilterFields.push(sProperty);
					aFilterValues.push(oParameters[sProperty]);
				}
			}

			switch (sTargetEntity) {
			case "Pais":
				if (sTargetTime === "Semana") {
					sObjectPath = "ConversaoPaisSet";
					sObjectPathApontFunc = "ConversaoFuncSet";
					sObjectPathConvSemana = "ConvSemanaPaisSet";
				} else {
					sObjectPath = "ConversaoPaisMesSet";
					sObjectPathApontFunc = "ConversaoFuncMesSet";
					sObjectPathConvSemana = "ConvSemanaPaisMesSet";
				}

				break;
			case "Geral":
				if (sTargetTime === "Semana") {
					sObjectPath = "ConversaoGerSet";
					sObjectPathApontFunc = "ConversaoFuncSet";
					sObjectPathConvSemana = "ConvSemanaGerSet";
				} else {
					sObjectPath = "ConversaoGerMesSet";
					sObjectPathApontFunc = "ConversaoFuncMesSet";
					sObjectPathConvSemana = "ConvSemanaGerMesSet";
				}

				break;
			case "Regional":
				if (sTargetTime === "Semana") {
					sObjectPath = "ConversaoRegSet";
					sObjectPathApontFunc = "ConversaoFuncSet";
					sObjectPathConvSemana = "ConvSemanaRegSet";
				} else {
					sObjectPath = "ConversaoRegMesSet";
					sObjectPathApontFunc = "ConversaoFuncMesSet";
					sObjectPathConvSemana = "ConvSemanaRegMesSet";
				}

				break;
			case "CodLoja":
				if (sTargetTime === "Semana") {
					sObjectPath = "ConversaoSet";
					sObjectPathApontFunc = "ConversaoFuncSet";
					sObjectPathConvSemana = "ConvSemanaSet";
				} else {
					sObjectPath = "ConversaoMesSet";
					sObjectPathApontFunc = "ConversaoFuncMesSet";
					sObjectPathConvSemana = "ConvSemanaMesSet";
				}

				break;
			case "CodVendedor":
				if (sTargetTime === "Semana") {
					sObjectPath = "ConversaoFuncSet";
					sObjectPathApontFunc = "ConversaoFuncSet";
					sObjectPathConvSemana = "ConvSemanaFuncSet";
				} else {
					sObjectPath = "ConversaoFuncMesSet";
					sObjectPathApontFunc = "ConversaoFuncMesSet";
					sObjectPathConvSemana = "ConvSemanaFuncMesSet";
				}

				break;
			}

			var aFilters = this._createSearchFilterObject(aFilterFields, aFilterValues);

			var aPeriodo = [],
				aDiaSemana = [],
				sContext,
				cGeral = this.getChart("cGeral"),
				cDiaSemana = this.getChart("cDiaSemana"),
				cPeriodo = this.getChart("cPeriodo");

			cGeral.setModel(this._chartModel, "chart");
			cDiaSemana.setModel(this._chartModel, "chart");
			cPeriodo.setModel(this._chartModel, "chart");

			cGeral.setBusy(true);
			cDiaSemana.setBusy(true);
			cPeriodo.setBusy(true);

			this.getView().getModel().read("/" + sObjectPath, {
				filters: aFilters,
				success: function (d) {

					for (var i = 0; i < d.results.length; i++) {
						//Sum values for %
						//that.totalConversaoSemana = that.totalConversaoSemana + parseInt(d.results[i].QtdTotal, 10);
						that.totalConversaoPeriodo = that.totalConversaoPeriodo +
							parseInt(d.results[i].ManhaNVendeu, 10) +
							parseInt(d.results[i].ManhaVendeu, 10) +
							parseInt(d.results[i].NoiteNVendeu, 10) +
							parseInt(d.results[i].NoiteVendeu, 10) +
							parseInt(d.results[i].TardeNVendeu, 10) +
							parseInt(d.results[i].TardeVendeu, 10);
						that.totalConversaoDia = that.totalConversaoDia +
							parseInt(d.results[i].SegNVendeu, 10) +
							parseInt(d.results[i].SegVendeu, 10) +
							parseInt(d.results[i].TerNVendeu, 10) +
							parseInt(d.results[i].TerVendeu, 10) +
							parseInt(d.results[i].QuaNVendeu, 10) +
							parseInt(d.results[i].QuaVendeu, 10) +
							parseInt(d.results[i].QuiNVendeu, 10) +
							parseInt(d.results[i].QuiVendeu, 10) +
							parseInt(d.results[i].SexNVendeu, 10) +
							parseInt(d.results[i].SexVendeu, 10) +
							parseInt(d.results[i].SabNVendeu, 10) +
							parseInt(d.results[i].SabVendeu, 10) +
							parseInt(d.results[i].DomNVendeu, 10) +
							parseInt(d.results[i].DomVendeu, 10);
					}

					d.results.forEach(function (r) {
						this.setPeriodo(r, aPeriodo);
						this.setDiaSemana(r, aDiaSemana);
					}.bind(this));

					sContext = {
						geral: d.results,
						semana: d.results,
						periodo: aPeriodo,
						diasemana: aDiaSemana
							//atendimento: d.results
					};

					this._chartModel.setData(sContext);
					cGeral.setBusy(false);
					//cSemana.setBusy(false);
					cDiaSemana.setBusy(false);
					cPeriodo.setBusy(false);
				}.bind(this),
				error: function (oError) {

				}
			});

			//Read CONVERSAO SEMANA
			var oGraphicConvSemanaModel = new sap.ui.model.json.JSONModel();
			var oVizFrameSemana = that.getView().byId("cSemana2");
			oVizFrameSemana.setBusy(true);
			this.getView().getModel().read("/" + sObjectPathConvSemana, {
				filters: aFilters,
				success: function (oData, response) {
					var aResults = [];
					for (var i = 0; i < oData.results.length; i++) {
						var iQtdVendeu = parseInt(oData.results[i].QtdVendeu, 10),
							iQtdNVendeu = parseInt(oData.results[i].QtdNVendeu, 10);

						that.totalConversaoSemana = that.totalConversaoSemana + iQtdVendeu + iQtdNVendeu;

						aResults.push({
							"Semana": parseInt(oData.results[i].Semana, 10) + "/" + parseInt(oData.results[i].Ano, 10),
							"QtdVendeu": iQtdVendeu,
							"QtdNVendeu": iQtdNVendeu,
							"PercConv": ((iQtdVendeu + iQtdNVendeu) !== 0) ? parseInt(iQtdVendeu / (iQtdVendeu + iQtdNVendeu) * 100, 10) : 0
						});
					}
					oGraphicConvSemanaModel.setData(aResults);
					that.getView().setModel(oGraphicConvSemanaModel, "graphicSemana");

					//Set graphic
					var oDataset = new FlattenedDataset({
						dimensions: [{
							name: "Semana",
							value: "{Semana}",
						}],
						measures: [{
							name: 'Vendeu',
							value: '{QtdVendeu}'
						}, {
							name: 'Não vendeu',
							value: '{QtdNVendeu}'
						}, {
							name: 'Conversão %',
							value: '{PercConv}'
						}],
						data: {
							path: "/"
						}
					});

					oVizFrameSemana.setDataset(oDataset);
					oVizFrameSemana.setModel(oGraphicConvSemanaModel);
					oVizFrameSemana.setVizType('dual_combination');

					var feedValueAxis = new FeedItem({
							'uid': "valueAxis",
							'type': "Measure",
							'values': ["Vendeu", "Não vendeu"]
						}),
						feedValueAxis2 = new FeedItem({
							'uid': "valueAxis2",
							'type': "Measure",
							'values': ["Conversão %"]
						}),
						feedCategoryAxis = new FeedItem({
							'uid': "categoryAxis",
							'type': "Dimension",
							'values': ["Semana"]
						});

					oVizFrameSemana.addFeed(feedValueAxis);
					oVizFrameSemana.addFeed(feedValueAxis2);
					oVizFrameSemana.addFeed(feedCategoryAxis);

					oVizFrameSemana.setVizProperties({
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
							dataLabel: {
								visible: true
							},
						},
						legend: {
							title: {
								visible: true
							}
						},
						title: {
							visible: true,
							text: 'Conversão por semana'
						},
					});

					oVizFrameSemana.setBusy(false);

				},
				error: function (oError) {

				}
			});

			//Read APONTAMENTOS x VENDEDOR
			var oGraphicModel = new sap.ui.model.json.JSONModel();
			var oVizFrame = that.getView().byId("cAtendimento");
			oVizFrame.setBusy(true);

			this.getView().getModel().read("/" + sObjectPathApontFunc, {
				filters: aFilters,
				success: function (oData, response) {
					var aResults = [];
					for (var i = 0; i < oData.results.length; i++) {
						var iQtdVendeu = parseInt(oData.results[i].QtdVendeu, 10),
							iQtdNVendeu = parseInt(oData.results[i].QtdNVendeu, 10);

						that.totalConversaoAtendimento = that.totalConversaoAtendimento + oData.results[i].QtdTotal;
						aResults.push({
							"CodVendedor": oData.results[i].CodVendedor,
							"QtdVendeu": parseInt(oData.results[i].QtdVendeu, 10),
							"QtdNVendeu": parseInt(oData.results[i].QtdNVendeu, 10),
							"PercConv": ((iQtdVendeu + iQtdNVendeu) !== 0) ? parseInt(iQtdVendeu / (iQtdVendeu + iQtdNVendeu) * 100, 10) : 0
						});
					}
					oGraphicModel.setData(aResults);
					that.getView().setModel(oGraphicModel, "graphic");

					//Set graphic
					var oDataset = new FlattenedDataset({
						dimensions: [{
							name: "Vendedor",
							value: "{CodVendedor}"
						}],
						measures: [{
								name: 'Vendeu',
								value: '{QtdVendeu}'
							}, {
								name: 'Não vendeu',
								value: '{QtdNVendeu}'
							}, {
								name: 'Conversão %',
								value: '{PercConv}'
							}

						],
						data: {
							path: "/"
						}
					});

					oVizFrame.setDataset(oDataset);
					oVizFrame.setModel(oGraphicModel);
					oVizFrame.setVizType('dual_combination');

					var feedValueAxis = new FeedItem({
							'uid': "valueAxis",
							'type': "Measure",
							'values': ["Vendeu", "Não vendeu"]
						}),
						feedValueAxis2 = new FeedItem({
							'uid': "valueAxis2",
							'type': "Measure",
							'values': ["Conversão %"]
						}),
						feedCategoryAxis = new FeedItem({
							'uid': "categoryAxis",
							'type': "Dimension",
							'values': ["Vendedor"]
						});

					oVizFrame.addFeed(feedValueAxis);
					oVizFrame.addFeed(feedValueAxis2);
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
							text: 'Atendimentos apontados e conversão por vendedor'
						}
					});

					oVizFrame.setBusy(false);

				},
				error: function (oError) {

				}
			});
		},

		_createSearchFilterObject: function (aFields, aValues) {
			var aFilters = [],
				iCount;

			var mOperator = sap.ui.model.FilterOperator;

			for (iCount = 0; iCount < aFields.length; iCount = iCount + 1) {
				aFilters.push(new sap.ui.model.Filter(aFields[iCount], mOperator.EQ, aValues[iCount], ""));
			}
			return aFilters;
		},

		setPeriodo: function (r, a) {

			var sPeriodo = {
				Periodo: "Manhã",
				QtdVendeu: r.ManhaVendeu,
				QtdNVendeu: r.ManhaNVendeu,
				PercConv: ((parseInt(r.ManhaNVendeu) + parseInt(r.ManhaVendeu)) === 0) ? 0 : parseInt(parseInt(r.ManhaVendeu) / (parseInt(r.ManhaNVendeu) +
					parseInt(r.ManhaVendeu)) * 100)
			};

			a.push(sPeriodo);

			sPeriodo = {
				Periodo: "Tarde",
				QtdVendeu: r.TardeVendeu,
				QtdNVendeu: r.TardeNVendeu,
				PercConv: ((parseInt(r.TardeNVendeu) + parseInt(r.TardeVendeu)) === 0) ? 0 : parseInt(parseInt(r.TardeVendeu) / (parseInt(r.TardeNVendeu) +
					parseInt(r.TardeVendeu)) * 100)
			};

			a.push(sPeriodo);

			sPeriodo = {
				Periodo: "Noite",
				QtdVendeu: r.NoiteVendeu,
				QtdNVendeu: r.NoiteNVendeu,
				PercConv: ((parseInt(r.NoiteNVendeu) + parseInt(r.NoiteVendeu)) === 0) ? 0 : parseInt(parseInt(r.NoiteVendeu) / (parseInt(r.NoiteNVendeu) +
					parseInt(r.NoiteVendeu)) * 100)
			};

			a.push(sPeriodo);
		},

		setDiaSemana: function (r, a) {

			var sDiaSemana = {
				DiaSemana: "Seg",
				QtdVendeu: r.SegVendeu,
				QtdNVendeu: r.SegNVendeu,
				PercConv: ((parseInt(r.SegNVendeu) + parseInt(r.SegVendeu)) === 0) ? 0 : parseInt(parseInt(r.SegVendeu) / (parseInt(r.SegNVendeu) +
					parseInt(r.SegVendeu)) * 100)
			};

			a.push(sDiaSemana);

			sDiaSemana = {
				DiaSemana: "Ter",
				QtdVendeu: r.TerVendeu,
				QtdNVendeu: r.TerNVendeu,
				PercConv: ((parseInt(r.TerNVendeu) + parseInt(r.TerVendeu)) === 0) ? 0 : parseInt(parseInt(r.TerVendeu) / (parseInt(r.TerNVendeu) +
					parseInt(r.TerVendeu)) * 100)
			};

			a.push(sDiaSemana);

			sDiaSemana = {
				DiaSemana: "Qua",
				QtdVendeu: r.QuaVendeu,
				QtdNVendeu: r.QuaNVendeu,
				PercConv: ((parseInt(r.QuaNVendeu) + parseInt(r.QuaVendeu)) === 0) ? 0 : parseInt(parseInt(r.QuaVendeu) / (parseInt(r.QuaNVendeu) +
					parseInt(r.QuaVendeu)) * 100)
			};

			a.push(sDiaSemana);

			sDiaSemana = {
				DiaSemana: "Qui",
				QtdVendeu: r.QuiVendeu,
				QtdNVendeu: r.QuiNVendeu,
				PercConv: ((parseInt(r.QuiNVendeu) + parseInt(r.QuiVendeu)) === 0) ? 0 : parseInt(parseInt(r.QuiVendeu) / (parseInt(r.QuiNVendeu) +
					parseInt(r.QuiVendeu)) * 100)
			};

			a.push(sDiaSemana);

			sDiaSemana = {
				DiaSemana: "Sex",
				QtdVendeu: r.SexVendeu,
				QtdNVendeu: r.SexNVendeu,
				PercConv: ((parseInt(r.SexNVendeu) + parseInt(r.SexVendeu)) === 0) ? 0 : parseInt(parseInt(r.SexVendeu) / (parseInt(r.SexNVendeu) +
					parseInt(r.SexVendeu)) * 100)
			};

			a.push(sDiaSemana);

			sDiaSemana = {
				DiaSemana: "Sáb",
				QtdVendeu: r.SabVendeu,
				QtdNVendeu: r.SabNVendeu,
				PercConv: ((parseInt(r.SabNVendeu) + parseInt(r.SabVendeu)) === 0) ? 0 : parseInt(parseInt(r.SabVendeu) / (parseInt(r.SabNVendeu) +
					parseInt(r.SabVendeu)) * 100)
			};

			a.push(sDiaSemana);

			sDiaSemana = {
				DiaSemana: "Dom",
				QtdVendeu: r.DomVendeu,
				QtdNVendeu: r.DomNVendeu,
				PercConv: ((parseInt(r.DomNVendeu) + parseInt(r.DomVendeu)) === 0) ? 0 : parseInt(parseInt(r.DomVendeu) / (parseInt(r.DomNVendeu) +
					parseInt(r.DomVendeu)) * 100)
			};

			a.push(sDiaSemana);

		}
	});
});