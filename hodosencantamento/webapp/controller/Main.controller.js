sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History"
], function (Controller, JSONModel, History) {
	"use strict";

	return Controller.extend("hodos.hodosencant.controller.Main", {
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
			var oView = this.getView(),
				oModel = oView.getModel(),
				sObjectPathEncant,
				sObjectPathCarac,
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
					sObjectPathEncant = "EncantPaisSet";
					sObjectPathCarac = "EncantCaracPaisSet";
				} else {
					sObjectPathEncant = "EncantPaisMesSet";
					sObjectPathCarac = "EncantCaracPaisMesSet";
				}

				break;
			case "Geral":
				if (sTargetTime === "Semana") {
					sObjectPathEncant = "EncantGerSet";
					sObjectPathCarac = "EncantCaracGerSet";
				} else {
					sObjectPathEncant = "EncantGerMesSet";
					sObjectPathCarac = "EncantCaracGerMesSet";
				}

				break;
			case "Regional":
				if (sTargetTime === "Semana") {
					sObjectPathEncant = "EncantRegSet";
					sObjectPathCarac = "EncantCaracRegSet";
				} else {
					sObjectPathEncant = "EncantRegMesSet";
					sObjectPathCarac = "EncantCaracRegMesSet";
				}

				break;
			case "CodLoja":
				if (sTargetTime === "Semana") {
					sObjectPathEncant = "EncantSet";
					sObjectPathCarac = "EncantCaracSet";
				} else {
					sObjectPathEncant = "EncantMesSet";
					sObjectPathCarac = "EncantCaracMesSet";
				}

				break;
			case "CodVendedor":
				if (sTargetTime === "Semana") {
					sObjectPathEncant = "EncantFuncSet";
					sObjectPathCarac = "EncantCaracFuncSet";
				} else {
					sObjectPathEncant = "EncantFuncMesSet";
					sObjectPathCarac = "EncantCaracFuncMesSet";
				}

				break;
			}

			var aFilterFieldsTot = aFilterFields.slice(0),
				aFilterFieldsNVendeu = aFilterFields.slice(0),
				aFilterFieldsVendeu = aFilterFields.slice(0),
				aFilterValuesTot = aFilterValues.slice(0),
				aFilterValuesNVendeu = aFilterValues.slice(0),
				aFilterValuesVendeu = aFilterValues.slice(0);

			aFilterFieldsTot.push("QtdComp");
			aFilterFieldsNVendeu.push("QtdComp");
			aFilterFieldsVendeu.push("QtdComp");
			aFilterValuesTot.push("CUMP_TOT");
			aFilterValuesNVendeu.push("CUMP_N_VENDEU");
			aFilterValuesVendeu.push("CUMP_VENDEU");

			var aFilters = this._createSearchFilterObject(aFilterFields, aFilterValues),
				aFiltersTot = this._createSearchFilterObject(aFilterFieldsTot, aFilterValuesTot),
				aFiltersNVendeu = this._createSearchFilterObject(aFilterFieldsNVendeu, aFilterValuesNVendeu),
				aFiltersVendeu = this._createSearchFilterObject(aFilterFieldsVendeu, aFilterValuesVendeu);

			oModel.read("/" + sObjectPathCarac, {
				filters: aFilters,
				success: function (oData, response) {
					oView.setModel(new sap.ui.model.json.JSONModel(oData.results), "carac");
				},
				error: function (oError) {

				}
			});

			oModel.read("/" + sObjectPathEncant, {
				filters: aFiltersTot,
				success: function (oData, response) {
					oView.setModel(new sap.ui.model.json.JSONModel(oData.results), "geral");
				},
				error: function (oError) {

				}
			});

			oModel.read("/" + sObjectPathEncant, {
				filters: aFiltersNVendeu,
				success: function (oData, response) {
					oView.setModel(new sap.ui.model.json.JSONModel(oData.results), "nvendeu");
				}
			});

			oModel.read("/" + sObjectPathEncant, {
				filters: aFiltersVendeu,
				success: function (oData, response) {
					oView.setModel(new sap.ui.model.json.JSONModel(oData.results), "vendeu");
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