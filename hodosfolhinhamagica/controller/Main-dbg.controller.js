sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/viz/ui5/format/ChartFormatter',
	'sap/viz/ui5/api/env/Format'
], function (Controller, JSONModel, History, Filter, FilterOperator, ChartFormatter, Format) {
	"use strict";
	return Controller.extend("hodosovp.FolhaMagica.controller.Main", {

		onInit: function () {
			this.attachRoute("toTargetMain", this.onRouteMatched);

			this.getView().setModel(new sap.ui.model.json.JSONModel({
				namespace: sap.ui.require.toUrl("hodosovp/FolhaMagica")
			}), "param");

		},

		initStartParams: function () {
			var oParameters = {};
			try {
				var oStartupParameters = this.getOwnerComponent().getComponentData().startupParameters;
				oParameters = {
					CodLoja: oStartupParameters.CodLoja[0],
					Ano: oStartupParameters.Ano[0],
					Semana: oStartupParameters.Semana[0],
					CodVendedor: ((oStartupParameters.CodVendedor && oStartupParameters.CodVendedor[0]) ? oStartupParameters.CodVendedor[0] : "")
				};
			} catch (err) {
				oParameters.CodLoja = "0121";
				oParameters.Ano = "2019";
				oParameters.Semana = "04";
				oParameters.CodVendedor = "";
			}

			this.getView().setModel(new JSONModel(oParameters), "filter");

			return oParameters;
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
			this.initStartParams();
		},

		onLoad: function (oEvent) {
			// Lista Funcionários
			var oParameters = {
				CodLoja: this.getView().byId("fdCodLoja").getValue(),
				Ano: this.getView().byId("fdAno").getValue(),
				Semana: this.getView().byId("fdSemana").getValue(),
				CodVendedor: this.getView().byId("fdCodVendedor").getValue()
			};
			this.getView().setModel(new JSONModel(oParameters), "filter");
			this.onMSEvolucao(oParameters);
			this.onMSProjecao(oParameters);
			this.onRoteiro(oParameters);
			this.onEncantRadar(oParameters);
			this.onPerguntas(oParameters);
			this.onConversao(oParameters);
			this.onFunil(oParameters);
		},

		onSearch: function (oEvent) {
			if (!this._oDialogVend) {
				this._oDialogVend = sap.ui.xmlfragment("hodosovp.FolhaMagica.fragment.Vendedores", this);
				this._oDialogVend.setModel(this.getView().getModel());
			}

			this._oDialogVend.setMultiSelect(false);
			this._oDialogVend.setShowClearButton(true);
			this._oDialogVend.setGrowing(true);
			var sGrowingThreshold = oEvent.getSource().data("threshold");
			if (sGrowingThreshold) {
				this._oDialogVend.setGrowingThreshold(parseInt(sGrowingThreshold));
			}

			this._oDialogVend.getBinding("items").filter([]);
			var aFilters = this._createSearchFilterObject(["CodLoja"], [this.getView().byId("fdCodLoja").getValue()]);
			this._oDialogVend.getBinding("items").filter(aFilters);

			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogVend);
			this._oDialogVend.open();
		},

		onMSEvolucao: function (oParameters) {
			var aFilterFields = ["CodLoja", "Ano", "Semana", "CodVendedor"];
			var aFilterValues = [oParameters.CodLoja, oParameters.Ano, oParameters.Semana, oParameters.CodVendedor];
			var sObjectPathEvol = "/MSEvolucaoSet";
			var aFilters = this._createSearchFilterObject(aFilterFields, aFilterValues);
			var tEvol = this.getView().byId("tEvol");
			this.getView().getModel().read(sObjectPathEvol, {
				filters: aFilters,
				success: function (oData) {
					var oEvol = {
						MSEvolucaoSet: oData.results
					};
					var oEvolModel = new sap.ui.model.json.JSONModel(oEvol);
					tEvol.setModel(oEvolModel);
				},
				error: function (oError) {
					alert.log(oError);
				}
			});
		},

		onMSProjecao: function (oParameters) {
			var aFilterFields = ["CodLoja", "Ano", "Semana", "CodVendedor"];
			var aFilterValues = [oParameters.CodLoja, oParameters.Ano, oParameters.Semana, oParameters.CodVendedor];
			var sObjectPathProj = "/MSProjecaoSet";
			var aFilters = this._createSearchFilterObject(aFilterFields, aFilterValues);
			var tProjr = this.getView().byId("tProjReal");
			var tProjs = this.getView().byId("tProjSimu");
			var tProjm = this.getView().byId("tProjMais");
			this.getView().getModel().read(sObjectPathProj, {
				filters: aFilters,
				success: function (oData) {
					var oProj = {
						MSProjecaoSet: oData.results
					};
					var oProjModel = new sap.ui.model.json.JSONModel(oProj);
					tProjr.setModel(oProjModel);
					tProjs.setModel(oProjModel);
					tProjm.setModel(oProjModel);
				},
				error: function (oError) {
					alert.log(oError);
				}
			});
		},

		onRoteiro: function (oParameters) {
			var sObjectRoteiroPath = "/RoteiroFuncSet";
			var sObjectEncantNPSPath = "/EncantNPSFuncSet";
			var aFilterFields = ["CodLoja", "Ano", "Semana", "CodVendedor"];
			var aFilterValues = [oParameters.CodLoja, oParameters.Ano, oParameters.Semana, oParameters.CodVendedor];

			var aFilters = this._createSearchFilterObject(aFilterFields, aFilterValues);
			var lCumpRot = this.getView().byId("lCumpRot");
			var RotVendeu = this.getView().byId("rmRotVendeu");
			var RotNVendeu = this.getView().byId("rmRotNVendeu");
			var rmRotProced = this.getView().byId("rmRotProced");
			var rmRotNProced = this.getView().byId("rmRotNProced");
			this.getView().getModel().read(sObjectRoteiroPath, {
				filters: aFilters,
				success: function (oData) {
					lCumpRot.setText(oData.results[0].CumpRot + "%");
					RotVendeu.setPercentage(oData.results[0].CumpRotVendeu);
					RotNVendeu.setPercentage(oData.results[0].CumpRotVendeu);
					rmRotProced.setPercentage(oData.results[0].CumpRotProcedimento);
					rmRotNProced.setPercentage(oData.results[0].CumpRotNProcedimento);
				},
				error: function (oError) {}
			});

			var lPCumpTot = this.getView().byId("lPCumpTot");
			var lPQtdTot = this.getView().byId("lPQtdTot");
			var aFilterPromotor = this._createSearchFilterObject(aFilterFields, aFilterValues);
			aFilterPromotor.push(new sap.ui.model.Filter("TipoNps", "EQ", "PROMOTOR"));
			this.getView().getModel().read(sObjectEncantNPSPath, {
				filters: aFilterPromotor,
				success: function (oData) {
					if (typeof oData.results.length[0] !== "undefined") {
						lPCumpTot.setNumber(oData.results[0].CumpTot);
						lPQtdTot.setNumber(oData.results[0].QtdTot);
					}
				},
				error: function (oError) {}
			});

			var lNCumpTot = this.getView().byId("lNCumpTot");
			var lNQtdTot = this.getView().byId("lNQtdTot");
			var aFilterNeutro = this._createSearchFilterObject(aFilterFields, aFilterValues);
			aFilterNeutro.push(new sap.ui.model.Filter("TipoNps", "EQ", "NEUTRO"));
			this.getView().getModel().read(sObjectEncantNPSPath, {
				filters: aFilterNeutro,
				success: function (oData) {
					if (typeof oData.results.length[0] !== "undefined") {
						lNCumpTot.setNumber(oData.results[0].CumpTot);
						lNQtdTot.setNumber(oData.results[0].QtdTot);
					}
				},
				error: function (oError) {}
			});

			var lDCumpTot = this.getView().byId("lDCumpTot");
			var lDQtdTot = this.getView().byId("lDQtdTot");
			var aFilterDetrator = this._createSearchFilterObject(aFilterFields, aFilterValues);
			aFilterDetrator.push(new sap.ui.model.Filter("TipoNps", "EQ", "DETRATOR"));
			this.getView().getModel().read(sObjectEncantNPSPath, {
				filters: aFilterDetrator,
				success: function (oData) {
					if (typeof oData.results.length[0] !== "undefined") {
						lDCumpTot.setNumber(oData.results[0].CumpTot);
						lDQtdTot.setNumber(oData.results[0].QtdTot);
					}
				},
				error: function (oError) {}
			});
		},

		onEncantRadar: function (oParameters) {
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var radarChartDataCompr = {
				labels: [oResourceBundle.getText("lblAcolhimento"), oResourceBundle.getText("lblEmpatia"), oResourceBundle.getText(
					"lblEntusiasmo"), oResourceBundle.getText("lblTransparencia"), oResourceBundle.getText("lblAgradecimento")],
				datasets: [{
					label: "Dados",
					backgroundColor: "rgba(255,255,255,0.0)",
					borderColor: "rgba(179,181,198,1)",
					pointBackgroundColor: "rgba(179,181,198,1)",
					pointBorderColor: "#fff",
					pointHoverBackgroundColor: "#fff",
					pointHoverBorderColor: "rgba(179,181,198,1)",
					data: [0, 0, 0, 0, 0]
				}]
			};

			this.getView().setModel(new JSONModel({
				radarChartDataCompr: radarChartDataCompr
			}), "chartData");

			var sObjectPathCarac = "/EncantCaracFuncSet";
			var aFilterFields = ["CodLoja", "Ano", "Semana", "CodVendedor"];
			var aFilterValues = [oParameters.CodLoja, oParameters.Ano, oParameters.Semana, oParameters.CodVendedor];
			var aFilters = this._createSearchFilterObject(aFilterFields, aFilterValues);

			this.getView().getModel().read(sObjectPathCarac, {
				filters: aFilters,
				success: function (oData) {
					var oChartData = this.getView().getModel("chartData").getData();
					oData.results.forEach(function (oEncant) {
						switch (oEncant.Caracteristica) {
						case "ACOLHIMENTO":
							oChartData.radarChartDataCompr.datasets[0].data[0] = oEncant.CumpTot;
							break;
						case "EMPATIA":
							oChartData.radarChartDataCompr.datasets[0].data[1] = oEncant.CumpTot;
							break;
						case "ENTUSIASMO":
							oChartData.radarChartDataCompr.datasets[0].data[2] = oEncant.CumpTot;
							break;
						case "TRANSPARÊNCIA":
							oChartData.radarChartDataCompr.datasets[0].data[3] = oEncant.CumpTot;
							break;
						case "AGRADECIMENTO":
							oChartData.radarChartDataCompr.datasets[0].data[4] = oEncant.CumpTot;
							break;
						}
					}.bind(this));
					this.getView().getModel("chartData").refresh(true);
				}.bind(this),
				error: function (oError) {}
			});
		},
		onPerguntas: function (oParameters) {
			var aFilterFields = ["CodLoja", "Ano", "Semana", "CodVendedor"];
			var aFilterValues = [oParameters.CodLoja, oParameters.Ano, oParameters.Semana, oParameters.CodVendedor];
			var aFilters = this._createSearchFilterObject(aFilterFields, aFilterValues);

			var sObjectPathProced = "/PerguntProcedSet";
			var tProced = this.getView().byId("tPProced");
			this.getView().getModel().read(sObjectPathProced, {
				filters: aFilters,
				success: function (oData) {
					var oProced = {
						PerguntProcedSet: oData.results
					};
					var oProcedModel = new sap.ui.model.json.JSONModel(oProced);
					tProced.setModel(oProcedModel);
				},
				error: function (oError) {
					alert.log(oError);
				}
			});

			var sObjectPathEncant = "/PerguntEncantSet";
			var tEncat = this.getView().byId("tPEncant");
			this.getView().getModel().read(sObjectPathEncant, {
				filters: aFilters,
				success: function (oData) {
					var oEncant = {
						PerguntEncantSet: oData.results
					};
					var oEncantModel = new sap.ui.model.json.JSONModel(oEncant);
					tEncat.setModel(oEncantModel);
				},
				error: function (oError) {
					alert.log(oError);
				}
			});
		},
		onConversao: function (oParameters) {
			var aFilterFields = ["CodLoja", "Ano", "Semana", "CodVendedor"];
			var aFilterValues = [oParameters.CodLoja, oParameters.Ano, oParameters.Semana, oParameters.CodVendedor];
			var aFilters = this._createSearchFilterObject(aFilterFields, aFilterValues);

			var gConversao = this.getView().byId("gConversao");
			var sObjectPathConv = "/ConvLojaFuncSet";
			this.getView().getModel().read(sObjectPathConv, {
				filters: aFilters,
				success: function (oData) {
					var oConv = {
						ConvLojaFuncSet: oData.results
					};
					var oConvModel = new sap.ui.model.json.JSONModel(oConv);

					gConversao.setVizProperties({
						plotArea: {
							colorPalette: d3.scale.category20().range(),
							dataLabel: {
								visible: true,
								showTotal: true
							}
						},
						tooltip: {
							visible: true
						},
						title: {
							text: "Conversão Vendedor x Loja"
						}
					});
					gConversao.setModel(oConvModel);
				},
				error: function (oError) {
					alert.log(oError);
				}
			});

			var gConvMedia = this.getView().byId("gConvMedia");
			var sObjectPathConvMed = "/ConvMediaSet";
			this.getView().getModel().read(sObjectPathConvMed, {
				filters: aFilters,
				success: function (oData) {
					var oConvMed = {
						ConvMediaSet: oData.results
					};
					var oConvMediaModel = new sap.ui.model.json.JSONModel(oConvMed);
					gConvMedia.setVizProperties({
						plotArea: {
							colorPalette: d3.scale.category20().range(),
							dataLabel: {
								visible: true,
								showTotal: true
							}
						},
						tooltip: {
							visible: true
						},
						title: {
							text: "Média Vendedor x Loja"
						}
					});
					gConvMedia.setModel(oConvMediaModel);
				},
				error: function (oError) {
					alert.log(oError);
				}
			});

		},
		onFunil: function (oParameters) {
			var aFilterFields = ["CodLoja", "Ano", "Semana", "CodVendedor"];
			var aFilterValues = [oParameters.CodLoja, oParameters.Ano, oParameters.Semana, oParameters.CodVendedor];
			var aFilters = this._createSearchFilterObject(aFilterFields, aFilterValues);
			var sObjectPathPerdas = "/FunilPerdasFuncItemSet";
			var vizPerdas = this.getView().byId("idPerdasVendas");
			this.getView().getModel().read(sObjectPathPerdas, {
				filters: aFilters,
				success: function (oData) {
					var oPerdas = {
						FunilPerdasFuncItemSet: oData.results
					};
					var oPerdasModel = new sap.ui.model.json.JSONModel(oPerdas);
					vizPerdas.setVizProperties({
						plotArea: {
							dataLabel: {
								formatString: ChartFormatter.DefaultPattern.Percentage,
								visible: true
							},
							dataShape: {
								primaryAxis: ["line", "bar", "bar"]
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
						title: {
							text: "Maior Representatividade nas Perdas"
						}
					});
					vizPerdas.setModel(oPerdasModel);
				},
				error: function (oError) {
					sap.ui.console.log(oError);
				}
			});

			// var fFilters = aFilters;
			//fFilters.push(new Filter("FiltroOVP", FilterOperator.EQ, true));
			this.getView().byId("ovpList").getBinding("items").filter(new Filter(aFilters, true));
			this.getView().byId("hboxConversao").bindElement({
				path: "/FunilFuncSet(CodLoja='" + oParameters.CodLoja + "',Ano='" + oParameters.Ano + "',Semana='" + oParameters.Semana +
					"',Area='AGRADECER" + "',CodVendedor='" + oParameters.CodVendedor + "')/"
			});
		},
		/**
		 *@memberOf hodosovp.FolhaMagica.controller.Main
		 */
		gerarPDF: function (oEvent) {
			// //This code was generated by the layout editor.
			// //Step 1: Export chart content to svg
			// var oVizFrame = this.getView().byId("idVizFrame");
			// var sSVG = oVizFrame.exportToSVGString({
			// 	width: 800,
			// 	height: 600
			// });

			// // UI5 library bug fix:
			// //    Legend SVG created by UI5 library has transform attribute with extra space
			// //    eg:   transform="translate (-5,0)" but it should be without spaces in string quotes
			// //    tobe: transform="translate(-5,0)
			// sSVG = sSVG.replace(/translate /gm, "translate");

			// //Step 2: Create Canvas html Element to add SVG content
			// var oCanvasHTML = document.createElement("canvas");
			// canvg(oCanvasHTML, sSVG); // add SVG content to Canvas

			// // STEP 3: Get dataURL for content in Canvas as PNG/JPEG
			// var sImageData = oCanvasHTML.toDataURL("image/png");

			// // STEP 4: Create PDF using library jsPDF
			// var oPDF = new jsPDF();
			// oPDF.addImage(sImageData, "PNG", 15, 40, 180, 160);
			// oPDF.save("test.pdf");
		},

		onVendedorSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("CodVendedor", sap.ui.model.FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		onVendedorConfirm: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem"),
				oInput = this.byId("fdCodVendedor");

			if (oSelectedItem) {
				oInput.setValue(oSelectedItem.getTitle());
			}

			if (!oSelectedItem) {
				oInput.resetProperty("");
			}

			this.onLoad();
		},

		onCodVendedorChange: function (oEvent) {
			this.onLoad();
		}
	});
});