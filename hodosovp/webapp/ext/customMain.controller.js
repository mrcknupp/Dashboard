sap.ui.define([
	"sap/ui/model/Filter",
	"sap/m/MessageToast",
	"sap/ui/generic/app/navigation/service/NavigationHandler",
	"sap/ui/generic/app/navigation/service/NavType"
], function (Filter, MessageToast, NavigationHandler, NavType) {
	"use strict";

	// controller for custom filter, navigation param, action(quick view and global filter), navigation target 
	return sap.ui.controller("hodos.hodosovp.ext.customMain", {

		/************************* Handler for custom navigation ************************************************
		 
		 * This function takes the standard navigation entry details (if present) for a particular card and context
		 * and return a new/modified custom navigation entry to the core. The core will then use the custom
		 * navigation entry to perform navigation
		 * @param sCardId  : Card id as defined in manifest for a card
		 * @param oContext : Context of line item that is clicked (empty for header click)
		 * @param oNavigationEntry : Custom navigation entry to be used for navigation
		 * @returns {object} : Properties are {type, semanticObject, action, url, label}
		 * @public 
		 * sample code for referance
		    var oCustomNavigationEntry;
		    var oEntity = oContext && oContext.sPath && oContext.getProperty && oContext.getProperty(oContext.sPath);
		    if (sCardId === "card001" && oEntity && oEntity.PurchaseOrder === "4500003575") {
		        oCustomNavigationEntry = {};
		        oCustomNavigationEntry.type = "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation";
		        oCustomNavigationEntry.semanticObject = "Action";
		        oCustomNavigationEntry.action = "toappnavsample";
		        oCustomNavigationEntry.url = ""; //Only required when type is DataFieldWithUrl
		        oCustomNavigationEntry.label = ""; //Optional
		    }
		    return oCustomNavigationEntry;
		 */
		onInit: function () {
			var that = this;
			//App state
			this._oAppState = {};
			this._firstTime = true;
			this._editableCodLoja = true;
			//Navigation handler
			this.oNavigationHandler = new NavigationHandler(that);
			this.oNavigationHandler
				.parseNavigation()
				.done(this.onNavigationDone.bind(that));

		},

		onNavigationDone: function (oAppData, oURLParameters, sNavType) {
			switch (sNavType) {
			case NavType.initial:
				break;
			case NavType.iAppState:
				//Set filter from app state
				this._oAppState = oAppData.customData;
				this.getView().byId("ovpGlobalFilter").setFilterData(oAppData.customData["sap.ovp.app.customData"].filter);
				//Set CodLoja as editable or not
				this.getView().byId("ovpGlobalFilter").determineFilterItemByName("CodLoja").getControl().setEditable(this._editableCodLoja);
				break;
			}
		},

		doCustomNavigation: function (sCardId, oContext, oNavigationEntry) {
			var oFilter = this.oGlobalFilter.getFilterData();

			switch (sCardId) {
			case "card00_Apontamentos":
				this.navigateToApp("ZHODOSAPONT", "display", oFilter, false);
				break;

			case "card01_TempoMedio":
				this.navigateToApp("ZHODOSTEMPO", "display", oFilter, false);
				break;

			case "card02_QtdCaixas":
				this.navigateToApp("ZHODOSQTDCX", "display", oFilter, false);
				break;

			case "card03_Estoque":
				this.navigateToApp("ZHODOSIDAESTQ", "display", oFilter, false);
				break;

			case "card04_Roteiro":
				this.navigateToApp("ZHODOSROTEIRO", "display", oFilter, false);
				break;

			case "card05_PProcedimento":
				break;
			case "card06_PEncantamento":
				break;
				
			case "card07_Encantamento":
				this.navigateToApp("ZHODOSENCANT", "display", oFilter, true);
				break;

			case "card08_Conversao":
				this.navigateToApp("ZHODOSCONVERSAO", "display", oFilter, false);
				break;

			case "card09_FunilVendas":
				this.navigateToApp("ZHODOSFUNILVENDAS", "display", oFilter, false);
				break;

			case "card10_FMagica":
				this.navigateToApp("ZHODOSFMAGICA", "display", oFilter, true);
				break;

			case "card11_FCA":
				this.navigateToApp("ZHODOSFCA", "display", oFilter, false);
				break;
			}
		},

		/*************************** Handler for custom filter *******************************************************
		 
		 * This method returns a filter object to the OVP library. If there are multiple filters, they should be clubbed into single Filter object.
		 * sample code for referance
		    var oValue1 = this.oView.byId("ProductID").getValue();
		    var oValue2 = this.oView.byId("SalesOrderID").getValue();
		    
		    var aFilters = [], oFilter1, oFilter2;

		    if (oValue1) {
		        oFilter1 = new Filter({
		            path: "ProductID",
		            operator: "EQ",
		            value1: oValue1
		        });
		        aFilters.push(oFilter1);
		    }

		    if (oValue2) {
		        oFilter2 = new Filter({
		            path: "SalesOrderID",
		            operator: "EQ",
		            value1: oValue2
		        });
		        aFilters.push(oFilter2);
		    }

		    if (aFilters && aFilters.length > 0) {
		        return (new Filter(aFilters, true));
		    }
		 */

		getCustomFilters: function () {
			return new sap.ui.model.Filter({
				path: "FiltroOVP",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: true
			});
		},

		/*************************** Handler to store custom app state data ******************************************************
		 
		 * the content of the custom field shall be stored in the app state, so that it can be restored later again e.g. after a back navigation.
		 * The developer has to ensure, that the content of the field is stored in the object that is returned by this method.
		 * @param oCustomData  : referance to the custome data expected by OVP library
		 * sample code for referance
		    var oCustomField1 = this.oView.byId("ProductID");
            var oCustomField2 = this.oView.byId("SalesOrderID");
            if (oCustomField1) {
                oCustomData.ProductID = oCustomField1.getValue();
            }
            if (oCustomField2) {
                oCustomData.SalesOrderID = oCustomField2.getValue();
            }
            return oCustomData;
		*/

		onBeforeRendering: function () {
			var that = this;
			var oOVPFilter = this.getView().byId("ovpGlobalFilter");
			var sUserId = sap.ushell.Container.getService("UserInfo").getId();

			var oModel = new sap.ui.model.odata.v2.ODataModel(this.getView().getModel().sServiceUrl);
			oModel.read("/DefaultFilterSet('" + sUserId + "')", {
				success: function (oData, response) {
					//check if its from app navigation
					if (that._firstTime) {
						oOVPFilter.setFilterData({
							Pais: oData.Pais,
							Geral: oData.Geral,
							Regional: oData.Regional,
							CodLoja: oData.CodLoja,
							Ano: oData.Ano,
							Mes: oData.Mes,
							Semana: oData.Semana
						});

						//Disable CodLoja if its filled
						if (oData.CodLoja) {
							that._editableCodLoja = false;
						} else {
							that._editableCodLoja = true;
						}

						oOVPFilter.determineFilterItemByName("Pais").getControl().setEditable(that._editableCodLoja);
						oOVPFilter.determineFilterItemByName("Geral").getControl().setEditable(that._editableCodLoja);
						oOVPFilter.determineFilterItemByName("Regional").getControl().setEditable(that._editableCodLoja);
						oOVPFilter.determineFilterItemByName("CodLoja").getControl().setEditable(that._editableCodLoja);

						that._filterInitialized = true;
						that._firstTime = false;
						oOVPFilter.validateMandatoryFields();
						oOVPFilter.search();
					} else {
						if (oData.CodLoja) {
							that._editableCodLoja = false;
						} else {
							that._editableCodLoja = true;
						}

						oOVPFilter.determineFilterItemByName("Pais").getControl().setEditable(that._editableCodLoja);
						oOVPFilter.determineFilterItemByName("Geral").getControl().setEditable(that._editableCodLoja);
						oOVPFilter.determineFilterItemByName("Regional").getControl().setEditable(that._editableCodLoja);
						oOVPFilter.determineFilterItemByName("CodLoja").getControl().setEditable(that._editableCodLoja);
					}
				},
				error: function (oError) {

				}
			});
		},

		getCustomAppStateDataExtension: function (oCustomData) {
			var oOVPFilter = this.getView().byId("ovpGlobalFilter");
			if (oOVPFilter.getFilterData()) {
				oCustomData.filter = oOVPFilter.getFilterData();
			}
			return oCustomData;
		},

		/*************************** Handler to restore custom app state data ******************************************************
		 
		 * in order to to restore the content of the custom field in the filter bar e.g. after a back navigation,
		 * The developer has to ensure, that the content of the field is stored in the object that is returned by this method.
		 * also, empty properties have to be set
		 * @param oCustomData  : referance to the custome data expected from OVP library
		 * sample code for referance
		     var oCustomField1 = this.oView.byId("ProductID");
            oCustomField1.setValue();

            var oCustomField2 = this.oView.byId("SalesOrderID");
            oCustomField2.setValue();

            if (oCustomData) {

                if (oCustomData.ProductID) {
                    oCustomField1.setValue(oCustomData.ProductID);
                }

                if (oCustomData.SalesOrderID) {
                    oCustomField2.setValue(oCustomData.SalesOrderID);
                }
            }
		*/

		restoreCustomAppStateDataExtension: function (oCustomData) {
			if (oCustomData) {
				this.getView().byId("ovpGlobalFilter").setFilterData(oCustomData);
			}
		},

		/*************************** Handler to modify the selection varient to be set to the smart filter bar *******************************
         
		 * Modifies the selection variant to be set to the SFB
		 * @param oCustomData  : referance to the custom selection variant expected by OVP library
		 * sample code for referance
		     oCustomSelectionVariant.addSelectOption("SupplierName", "I", "EQ", "Talpa");
		*/

		modifyStartupExtension: function (oCustomSelectionVariant) {},

		/*************************** Handler for custom action in quick view card *******************************
         
		 * handles the custom action in quick view card
		 * @param sCustomAction : press handler as a string
         * @returns  : press handler function defined in this custom controller
		 * sample code for referance
		     onCustomActionPress: function(sCustomAction) {
		            if (sCustomAction === "press1") {
		                return this.press1;
		            } else if (sCustomAction === "press2") {
		                return this.press2;
		            }
		        },
		
		        press1: function(oEvent) {
		            window.open("https://www.google.co.in");
		        },
		
		        press2: function(oEvent) {
		            window.open("http://www.sap.com/index.html");
		        },
		*/

		onCustomActionPress: function (sCustomAction) {

		},

		/*************************** Handler for custom navigation parameter *******************************
         
		 * @param sCustomAction : name of the custom parameter function
         * @returns  : same custom parameter function function defined in this custom controller
		 * sample code for referance
		    onCustomParams: function(sCustomParams) {
	            if (sCustomParams === "getParameters") {
	                return this.getParameters;
	            } else if (sCustomParams === "param2") {
	                return this.param2;
	            }
	        },
		    getParameters: function(oNavigateParams,oSelectionVariantParams) {
            var aCustomSelectionVariant = [];
            var aSelectOptions = oSelectionVariantParams.getSelectOptionsPropertyNames();
            if(aSelectOptions.indexOf("SupplierName")!=-1) {
                var aSupplierFilter = oSelectionVariantParams.getSelectOption("SupplierName");
                var sSupplierFilterValue = aSupplierFilter[0].Low;
                aSupplierFilter[0].Low = "";
            }
            var oSupplierName = {
              path: "SupplierName",
                operator: "EQ",
                value1: "",
                value2: null,
                sign: "I"
            };
            var oLandFilter = {
              path: "Land1",
                operator: "EQ",
                value1: sSupplierFilterValue,
                value2: null,
                sign: "I"
            };
            var oCustomSelectionVariant = {
                path: "TaxTarifCode",
                operator: "EQ",
                value1: 5,
                value2: null,
                sign: "I"
            };
            aCustomSelectionVariant.push(oCustomSelectionVariant);
            aCustomSelectionVariant.push(oLandFilter);
            aCustomSelectionVariant.push(oSupplierName);
            return {
                selectionVariant: aCustomSelectionVariant,
                ignoreEmptyString: true
            };
        },

        param2: function(oNavigateParams) {
            oNavigateParams.TaxTarifCode = '3';
            return oNavigateParams;
        },
		*/
		onCustomParams: function (sCustomParams) {

		},

		/*************************** Handler for custom global action *******************************
         
		 * hadles the custom global action 
		 * sample code for referance
		    handleCustomAction : function() {
	            var msg = 'Custom Global Action clicked';
	            MessageToast.show(msg);
            }
		 */

		handleCustomAction: function () {

		},

		navigateToApp: function (sSemanticObject, sAction, oFilterData, bExternal) {

			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			oCrossAppNavigator.isIntentSupported([sSemanticObject + "-" + sAction])
				.done(function (aResponses) {

				})
				.fail(function () {
					var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
					new sap.m.MessageToast(oResourceBundle.getText("noNavigationSupported"));
				});

			var sHash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
				target: {
					semanticObject: sSemanticObject,
					action: sAction
				},
				params: oFilterData
			})) || "";

			if (bExternal) {
				var sUrl = window.location.href.split('#')[0] + sHash;
				sap.m.URLHelper.redirect(sUrl, true);
			} else {
				oCrossAppNavigator.toExternal({
					target: {
						shellHash: sHash
					}
				});
			}
		}
	});
});