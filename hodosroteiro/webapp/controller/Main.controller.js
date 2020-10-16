sap.ui.define(["hodos/hodosroteiro/controls/BaseController",
	"hodos/hodosroteiro/model/Formatter"
], function (BaseController,
	Formatter) {
	"use strict";

	return BaseController.extend("hodos.hodosroteiro.controller.Main", {
		formatter: Formatter,

		onInit: function () {
			this.attachRoute("toTargetMain", this.onRouteMatched);
			this._chartModel = this.getOwnerComponent().getModel("chart");
			this.getRouter().attachRouteMatched(this.onRouteMatched, this);
			this.getView().setModel(this._chartModel, "chart");

			var oImages = {
				ok: sap.ui.require.toUrl("hodos/hodosroteiro") + "/images/satisfacaoOk.jpg",
				media: sap.ui.require.toUrl("hodos/hodosroteiro") + "/images/satisfacaoMedia.jpg",
				ruim: sap.ui.require.toUrl("hodos/hodosroteiro") + "/images/satisfacaoRuim.jpg"
			};

			this.getView().setModel(new sap.ui.model.json.JSONModel({
				jpg: oImages
			}), "imgs");

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
			this.getRouter().getRoute(sRoute).attachPatternMatched(
				fRouteMatched, this);
		},

		onRouteMatched: function (oEvent) {
			var sRoute = oEvent.getParameter("name");

			if (sRoute === "toTargetMain" || sRoute === "toTargetMainV") {
				this._oArguments = this.sOperation = oEvent.getParameter("arguments");
				if (!oEvent.getParameter("arguments")) {
					this._oArguments = oEvent.getParameter("arguments");
				} else if (this.getOwnerComponent().getComponentData()) {
					var oStartupParameters = this.getOwnerComponent().getComponentData().startupParameters;

					this._oArguments = {
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

				if (!this._oArguments.Geral) {
					this._oArguments.Geral = "";
				}

				if (!this._oArguments.Regional) {
					this._oArguments.Regional = "";
				}

				if (!this._oArguments.CodLoja) {
					this._oArguments.CodLoja = "";
				}

				if (!this._oArguments.CodVendedor) {
					this._oArguments.CodVendedor = "";
					
				}

				if (!this._oArguments.Semana) {
					this._oArguments.Semana = "";
				}

				this.getView().setModel(new sap.ui.model.json.JSONModel(this._oArguments), "filter");
				this.readData();
			}
		},

		readData: function () {
			var oParameters = this._oArguments,
				sTargetEntity,
				sTargetTime,
				sObjectRoteiroPath,
				sObjectNPSPath,
				aFilterFields = [],
				aFilterValues = [];

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
					sObjectRoteiroPath = "RoteiroPaisSet";
					sObjectNPSPath = "EncantNPSPaisSet";
				} else {
					sObjectRoteiroPath = "RoteiroPaisMesSet";
					sObjectNPSPath = "EncantNPSPaisMesSet";
				}

				break;
			case "Geral":
				if (sTargetTime === "Semana") {
					sObjectRoteiroPath = "RoteiroGerSet";
					sObjectNPSPath = "EncantNPSGerSet";
				} else {
					sObjectRoteiroPath = "RoteiroGerMesSet";
					sObjectNPSPath = "EncantNPSGerMesSet";
				}

				break;
			case "Regional":
				if (sTargetTime === "Semana") {
					sObjectRoteiroPath = "RoteiroRegSet";
					sObjectNPSPath = "EncantNPSRegSet";
				} else {
					sObjectRoteiroPath = "RoteiroRegMesSet";
					sObjectNPSPath = "EncantNPSRegMesSet";
				}

				break;
			case "CodLoja":
				if (sTargetTime === "Semana") {
					sObjectRoteiroPath = "RoteiroSet";
					sObjectNPSPath = "EncantNPSSet";
				} else {
					sObjectRoteiroPath = "RoteiroMesSet";
					sObjectNPSPath = "EncantNPSMesSet";
				}

				break;
			case "CodVendedor":
				if (sTargetTime === "Semana") {
					sObjectRoteiroPath = "RoteiroFuncSet";
					sObjectNPSPath = "EncantNPSFuncSet";
				} else {
					sObjectRoteiroPath = "RoteiroFuncMesSet";
					sObjectNPSPath = "EncantNPSFuncMesSet";
				}

				break;
			}

			var aFilters = this.oGlobalFilter = this._createSearchFilterObject(aFilterFields, aFilterValues);

			var lCumpRot = this.getView().byId("lCumpRot");
			var PerProced = this.getView().byId("idPerProced");
			var PerEncant = this.getView().byId("idPerEncant");
			var rmRotProced = this.getView().byId("rmRotProced");
			var rmRotNProced = this.getView().byId("rmRotNProced");
			var rmRotEncant = this.getView().byId("rmRotEncant");
			var rmRotNEncant = this.getView().byId("rmRotNEncant");

			this.getView().getModel().read("/" + sObjectRoteiroPath, {
				filters: aFilters,
				success: function (oData) {

					lCumpRot.setText(oData.results[0].CumpRot + "%");
					PerProced.setText(oData.results[0].CumpProcTot + "%");
					PerEncant.setText(parseInt(oData.results[0].CumpEncTot) + "%");
					rmRotProced.setText(oData.results[0].CumpRotProcedimento + "%");
					rmRotNProced.setText(oData.results[0].CumpRotNProcedimento + "%");
					rmRotEncant.setText(parseInt(oData.results[0].CumpEncTotVendeu) + "%");
					rmRotNEncant.setText(parseInt(oData.results[0].CumpEncTotNVendeu) + "%");

					// this._chartModel.setData({
					// 	roteiro: d.results[0]
					// });
					// this._chartModel.refresh();
				}.bind(this),
				error: function (oError) {}
			});

			var aFilterPromotor = this._createSearchFilterObject(aFilterFields, aFilterValues);

			aFilterPromotor.push(new sap.ui.model.Filter("TipoNps", "EQ", "PROMOTOR"));
			var lPCumpTot = this.getView().byId("lPCumpTot");
			var lPNCumpTot = this.getView().byId("lPNCumpTot");

			this.getView().getModel().read("/" + sObjectNPSPath, {
				filters: aFilterPromotor,
				success: function (oData) {
					if (oData && oData.results.length > 0) {
						lPCumpTot.setText(oData.results[0].CumpTot + "%");
						lPNCumpTot.setText(oData.results[0].NCumpTot + "%");
					} else {
						lPCumpTot.setText("0%");
						lPNCumpTot.setText("0%");
					}
				}.bind(this),
				error: function (oError) {}
			});

			var aFilterNeutro = this._createSearchFilterObject(aFilterFields, aFilterValues);
			var lNCumpTot = this.getView().byId("lNCumpTot");
			var lNNCumpTot = this.getView().byId("lNNCumpTot");

			aFilterNeutro.push(new sap.ui.model.Filter("TipoNps", "EQ", "NEUTRO"));

			this.getView().getModel().read("/" + sObjectNPSPath, {
				filters: aFilterNeutro,
				success: function (oData) {
					if (oData && oData.results.length > 0) {
						lNCumpTot.setText(oData.results[0].CumpTot + "%");
						lNNCumpTot.setText(oData.results[0].NCumpTot + "%");
					} else {
						lNCumpTot.setText("0%");
						lNNCumpTot.setText("0%");
					}
				}.bind(this),
				error: function (oError) {}
			});

			var aFilterDetrator = this._createSearchFilterObject(aFilterFields, aFilterValues);
			var lDCumpTot = this.getView().byId("lDCumpTot");
			var lDNCumpTot = this.getView().byId("lDNCumpTot");

			aFilterDetrator.push(new sap.ui.model.Filter("TipoNps", "EQ", "DETRATOR"));

			this.getView().getModel().read("/" + sObjectNPSPath, {
				filters: aFilterDetrator,
				success: function (oData) {
					if (oData && oData.results.length > 0) {
						lDCumpTot.setText(oData.results[0].CumpTot + "%");
						lDNCumpTot.setText(oData.results[0].NCumpTot + "%");
					} else {
						lDCumpTot.setText("0%");
						lDNCumpTot.setText("0%");
					}
				}.bind(this),
				error: function (oError) {}
			});

		},

		_createSearchFilterObject: function (aFields, aValues) {
			var aFilters = [],
				iCount;

			var mOperator = sap.ui.model.FilterOperator;

			for (iCount = 0; iCount < aFields.length; iCount = iCount + 1) {
				aFilters.push(new sap.ui.model.Filter(aFields[iCount],
					mOperator.EQ, aValues[iCount], ""));
			}
			return aFilters;
		},

		onCheckList: function (oEvent) {
			this.getRouter().navTo("checkList");
		},

		onVision: function (e) {

			this.navigateToApp("ZHODOSENCANT", "display", this._oArguments);
		},

		navigateToApp: function (sSemanticObject, sAction, oFilterData) {

			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			oCrossAppNavigator.isIntentSupported([sSemanticObject + "-" + sAction]).done(function (aResponses) {}).fail(function () {
				new sap.m.MessageToast("Navegação não suportada");
			});

			var sHash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
				target: {
					semanticObject: sSemanticObject,
					action: sAction
				},
				params: oFilterData
			})) || "";

			var sUrl = window.location.href.split('#')[0] + sHash;
			sap.m.URLHelper.redirect(sUrl, true);
		}

	});
});