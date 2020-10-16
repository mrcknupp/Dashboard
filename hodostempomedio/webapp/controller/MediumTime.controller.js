sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	'sap/viz/ui5/format/ChartFormatter'
], function (Controller, JSONModel, History, ChartFormatter) {
	"use strict";

	return Controller.extend("hodos.hodostempomedio.controller.MediumTime", {
		onInit: function () {
			this.getRouter().getRoute("mediumtime").attachPatternMatched(this._onRouteMatched.bind(this), this);
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
			// Atendimento Inicial
			var oGeneraData = {},
				oArguments = this.getView().getModel("filter").getData(),
				aFilterFields = [],
				aFilterValues = [],
				sTargetEntity,
				sTargetTime = "Mes",
				sEntity;

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
					sEntity = "/AverageTimeNoSellPaisSet";
				} else {
					sEntity = "/AverageTimeNoSellPaisMesSet";
				}

				break;
			case "Geral":
				if (sTargetTime === "Semana") {
					sEntity = "/AverageTimeNoSellGerSet";
				} else {
					sEntity = "/AverageTimeNoSellGerMesSet";
				}

				break;
			case "Regional":
				if (sTargetTime === "Semana") {
					sEntity = "/AverageTimeNoSellRegSet";
				} else {
					sEntity = "/AverageTimeNoSellRegMesSet";
				}

				break;
			case "CodLoja":
				if (sTargetTime === "Semana") {
					sEntity = "/AverageTimeNoSellSet";
				} else {
					sEntity = "/AverageTimeNoSellMesSet";
				}

				break;
			case "CodVendedor":
				if (sTargetTime === "Semana") {
					sEntity = "/AverageTimeNoSellFuncSet";
				} else {
					sEntity = "/AverageTimeNoSellFuncMesSet";
				}

				break;
			}

			// Preenchimento Inicial
			oGeneraData.Acolher = this._convertSecondToHours("0");
			oGeneraData.Apresentar = this._convertSecondToHours("0");
			oGeneraData.Descobrir = this._convertSecondToHours("0");
			oGeneraData.Incentivar = this._convertSecondToHours("0");
			oGeneraData.Agradecer = this._convertSecondToHours("0");

			var aFilters = this._createSearchFilterObject(aFilterFields, aFilterValues);

			this.getView().getModel().read(sEntity, {
				filters: aFilters,
				success: function (oData) {
					if (oData.results) {
						oData.results.forEach(function (oTime) {
							switch (oTime.Etapa) {
							case "ACOLHER":
								oGeneraData.Acolher = this._convertSecondToHours(oTime.TempMed);
								break;
							case "APRESENTAR":
								oGeneraData.Apresentar = this._convertSecondToHours(oTime.TempMed);
								break;
							case "DESCOBRIR":
								oGeneraData.Descobrir = this._convertSecondToHours(oTime.TempMed);
								break;
							case "INCENTIVAR":
								oGeneraData.Incentivar = this._convertSecondToHours(oTime.TempMed);
								break;
							case "AGRADECER":
								oGeneraData.Agradecer = this._convertSecondToHours(oTime.TempMed);
								break;
							}
						}.bind(this));
					}
					this.getView().setModel(new JSONModel(oGeneraData), "generalData");
					this.getView().getModel("generalData").refresh(true);
				}.bind(this),
				error: function (oError) {}
			});
		},

		_convertSecondToHours: function (sSeconds) {
			var oDate = new Date(null);
			oDate.setSeconds(sSeconds.trim().split(".")[0]);
			return oDate.toISOString().substr(11, 8);
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