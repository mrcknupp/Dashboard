sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	'sap/viz/ui5/format/ChartFormatter'
], function (Controller, JSONModel, History, ChartFormatter) {
	"use strict";

	return Controller.extend("hodos.hodostempomedio.controller.Main", {
		onInit: function () {
			this.getRouter().getRoute("main").attachPatternMatched(this._onRouteMatched.bind(this), this);
		},

		initStartParams: function () {
			// Startup Parameters
			var oParameters = {};
			if (this.getOwnerComponent().getComponentData()) {
				var oStartupParameters = this.getOwnerComponent().getComponentData().startupParameters;
				oParameters = {
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

			if (!oParameters.Geral) {
				oParameters.Geral = "";
			}

			if (!oParameters.Regional) {
				oParameters.Regional = "";
			}

			if (!oParameters.CodLoja) {
				oParameters.CodLoja = "";
			}

			if (!oParameters.CodVendedor) {
				oParameters.CodVendedor = "";
			}

			if (!oParameters.Semana) {
				oParameters.Semana = "";
			}
			this.getView().setModel(new JSONModel(oParameters), "filter");
			return oParameters;
		},

		initGraphs: function (oParameters) {

			//Atendimento Inicial
			var oGeneraData = {};
			var oView = this.getView(),
				oArguments = oView.getModel("filter").getData(),
				aFilterFields = [],
				aFilterValues = [],
				sObjectKey,
				sTargetEntity,
				sTargetTime = "Mes",
				sEntity,
				sVendEntity;

			//Verifica quais parâmetros foram preenchidos
			if (oArguments.Pais) {
				sTargetEntity = "Pais";
				aFilterFields.push("Pais");
				aFilterValues.push(oArguments.Pais);
			}
			if (oArguments.Geral) {
				sTargetEntity = "Geral";
				aFilterFields.push("Geral");
				aFilterValues.push(oArguments.Geral);
			}
			if (oArguments.Regional) {
				sTargetEntity = "Regional";
				aFilterFields.push("Regional");
				aFilterValues.push(oArguments.Regional);
			}
			if (oArguments.CodLoja) {
				sTargetEntity = "CodLoja";
				aFilterFields.push("CodLoja");
				aFilterValues.push(oArguments.CodLoja);
			}
			if (oArguments.CodVendedor) {
				sTargetEntity = "CodVendedor";
				aFilterFields.push("CodVendedor");
				aFilterValues.push(oArguments.CodVendedor);
			}
			if (oArguments.Ano) {
				aFilterFields.push("Ano");
				aFilterValues.push(oArguments.Ano);
			}
			if (oArguments.Mes) {
				aFilterFields.push("Mes");
				aFilterValues.push(oArguments.Mes);
			}
			if (oArguments.Semana) {
				sTargetTime = "Semana";
				aFilterFields.push("Semana");
				aFilterValues.push(oArguments.Semana);
			}

			//Seleciona entidade alvo a partir do preenchimento do filtro
			switch (sTargetEntity) {
			case "Pais":
				if (sTargetTime === "Semana") {
					sEntity = "/AverageTimePaisSet";
				} else {
					sEntity = "/AverageTimePaisMesSet";
				}

				break;
			case "Geral":
				if (sTargetTime === "Semana") {
					sEntity = "/AverageTimeGerSet";
				} else {
					sEntity = "/AverageTimeGerMesSet";
				}

				break;
			case "Regional":
				if (sTargetTime === "Semana") {
					sEntity = "/AverageTimeRegSet";
				} else {
					sEntity = "/AverageTimeRegMesSet";
				}

				break;
			case "CodLoja":
				if (sTargetTime === "Semana") {
					sEntity = "/AverageTimeSet";
				} else {
					sEntity = "/AverageTimeMesSet";
				}

				break;
			case "CodVendedor":
				if (sTargetTime === "Semana") {
					sEntity = "/AverageTimeFuncSet";
				} else {
					sEntity = "/AverageTimeFuncMesSet";
				}

				break;
			}

			//Entidade para vendedores
			sVendEntity = oArguments.Semana ? "AverageTimeFuncSet" : "AverageTimeFuncMesSet";

			//Monta chave do objeto
			sObjectKey = this.getView().getModel().createKey(sEntity, oArguments);

			this.getView().getModel().read(sObjectKey, {
				success: function (oData) {
					oGeneraData.SoldTime = this._convertSecondToHours(oData.TempMedVend);
					oGeneraData.NSoldTime = this._convertSecondToHours(oData.TempMedNVend);
					oGeneraData.TotalTime = this._convertSecondToHours(oData.TempMedTot);

					this.getView().setModel(new JSONModel(oGeneraData), "generalData");
					this.getView().getModel("generalData").refresh(true);
				}.bind(this),
				error: function (oError) {}
			});

			// Vendedores
			var aFilters = this._createSearchFilterObject(aFilterFields, aFilterValues);
			this.getView().getModel().read("/" + sVendEntity, {
				filters: aFilters,
				success: function (oData) {
					var oChartData = {
						data: []
					};

					oData.results.forEach(function (oTime) {
						oChartData.data.push({
							Employee: oTime.CodVendedor,
							Sold: parseInt(oTime.TempMedVend.trim().split(".")[0]),
							NSold: parseInt(oTime.TempMedNVend.trim().split(".")[0])
						});
					}.bind(this));

					this.getView().setModel(new JSONModel(oChartData), "chartData");
					this.getView().getModel("chartData").refresh(true);
				}.bind(this),
				error: function (oError) {}
			});
		},

		onLinkPress: function (oEvent) {
			this.getRouter().navTo("mediumtime");
		},

		_convertSecondToHours: function (sSeconds) {
			var oDate = new Date(null);
			oDate.setSeconds(sSeconds.trim().split(".")[0]);
			return oDate.toISOString().substr(11, 8);
		},

		onAfterRendering: function () {
			var oChartFormatter = ChartFormatter.getInstance();
			oChartFormatter.registerCustomFormatter("__UI5__Milliseconds2Hours", function (value) {
				return this._convertSecondToHours("" + value);
			}.bind(this));
			sap.viz.api.env.Format.numericFormatter(oChartFormatter);

			var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
			oVizFrame.setVizProperties({
				plotArea: {
					dataLabel: {
						formatString: "__UI5__Milliseconds2Hours",
						visible: true
					},
					colorPalette: ["#2B7D2B", "#BB0000"]
				},
				valueAxis: {
					label: {
						visible: false
					},
					title: {
						visible: false
					}
				},
				categoryAxis: {
					title: {
						visible: false
					}
				},
				legendGroup: {
					layout: {
						position: "bottom",
						alignment: "center"
					}
				},
				title: {
					visible: true,
					text: this.getView().getModel("i18n").getResourceBundle().getText("txtAvgTime")
				}
			});

		},

		onRenderComplete: function (oEvent) {},

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

		_onRouteMatched: function (oEvent) {
			var oParameters = this.initStartParams();
			this.initGraphs(oParameters);
		}
	});
});