sap.ui.define(["hodos/hodosroteiro/controls/BaseController"], function (
	BaseController) {
	"use strict";

	return BaseController.extend("hodos.hodosroteiro.controller.CheckList", {

		onInit: function () {
			this.attachRoute("checkList", this.onRouteMatched);
			this._chartModel = this.getOwnerComponent().getModel("chart");
			this.getRouter().attachRouteMatched(this.onRouteMatched, this);
			this.getView().setModel(this._chartModel, "check");

			this.getView().byId("tableChecklist").attachUpdateFinished(function () {
				this.getItems().forEach(function (oRow) {
					if (oRow.getBindingContext("check") && oRow.getBindingContext("check").getObject().TipoPergunta === "Encantamento") {
						oRow.addStyleClass("itemEncantamento");
					}
				});
			});
		},

		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;
			oHistory = sap.ui.core.routing.History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("toTargetMain", {}, true);
			}
		},

		attachRoute: function (sRoute, fRouteMatched) {
			this.getRouter().getRoute(sRoute).attachPatternMatched(
				fRouteMatched, this);
		},

		onRouteMatched: function (oEvent) {
			var sRoute = oEvent.getParameter("name");

			if (sRoute === "checkList") {

				if (!this._oArguments) {
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

				this.readData(this._oArguments);
				this.getView().setModel(new sap.ui.model.json.JSONModel(this._oArguments), "filter");
			}
		},

		readData: function (oParameters) {
			var sTargetEntity,
				sTargetTime,
				sObjectPath,
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
					sObjectPath = "ChecklistPaisSet";
				} else {
					sObjectPath = "ChecklistPaisMesSet";
				}

				break;
			case "Geral":
				if (sTargetTime === "Semana") {
					sObjectPath = "ChecklistGerSet";
				} else {
					sObjectPath = "ChecklistGerMesSet";
				}

				break;
			case "Regional":
				if (sTargetTime === "Semana") {
					sObjectPath = "ChecklistRegSet";
				} else {
					sObjectPath = "ChecklistRegMesSet";
				}

				break;
			case "CodLoja":
				if (sTargetTime === "Semana") {
					sObjectPath = "ChecklistSet";
				} else {
					sObjectPath = "ChecklistMesSet";
				}

				break;
			case "CodVendedor":
				if (sTargetTime === "Semana") {
					sObjectPath = "ChecklistFuncSet";
				} else {
					sObjectPath = "ChecklistFuncMesSet";
				}

				break;
			}

			var aFilters = this._createSearchFilterObject(aFilterFields, aFilterValues);
			this.getView().getModel().read("/" + sObjectPath, {
				filters: aFilters,
				success: function (d) {
					for (var i = 0; i < d.results.length; i++) {
						d.results[i].Item = parseInt(d.results[i].Item);
						if (d.results[i].Item <= 4) {
							d.results[i].Grupo = this.getResourceBundle().getText("notasChecklist.Acolher");
						}
						if (d.results[i].Item <= 10 && d.results[i].Item > 4) { //Descobrir				
							d.results[i].Grupo = this.getResourceBundle().getText("notasChecklist.Descobrir");
						}
						if (d.results[i].Item <= 17 && d.results[i].Item > 10) { //Apresentar				
							d.results[i].Grupo = this.getResourceBundle().getText("notasChecklist.Apresentar");
						}
						if (d.results[i].Item <= 20 && d.results[i].Item > 17) { //Incentivar
							d.results[i].Grupo = this.getResourceBundle().getText("notasChecklist.Incentivar");
						}
						if (d.results[i].Item > 20) { //Agradecer
							d.results[i].Grupo = this.getResourceBundle().getText("notasChecklist.Agradecer");
						}
					}
					this._chartModel.setData({
						list: d.results
					});
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

		getGroup: function (oContext) {
			var sKey = oContext.getProperty("Grupo");
			return {
				key: sKey,
				title: sKey
			};
		},

		getGroupHeader: function (oGroup) {

			return new sap.m.GroupHeaderListItem({
				title: oGroup.title,
				upperCase: true
			});
		}
	});
});