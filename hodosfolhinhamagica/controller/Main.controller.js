sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/viz/ui5/format/ChartFormatter",
	"sap/viz/ui5/api/env/Format"
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
			if (this.getOwnerComponent().getComponentData()) {
				var oStartupParameters = this.getOwnerComponent().getComponentData().startupParameters;
				oParameters = {
					Pais: ((oStartupParameters.Pais && oStartupParameters.Pais[0]) ? oStartupParameters.Pais[0] : ""),
					Geral: ((oStartupParameters.Geral && oStartupParameters.Geral[0]) ? oStartupParameters.Geral[0] : ""),
					Regional: ((oStartupParameters.Regional && oStartupParameters.Regional[0]) ? oStartupParameters.Regional[0] : ""),
					CodLoja: ((oStartupParameters.CodLoja && oStartupParameters.CodLoja[0]) ? oStartupParameters.CodLoja[0] : ""),
					Ano: ((oStartupParameters.Ano && oStartupParameters.Ano[0]) ? oStartupParameters.Ano[0] : ""),
					Mes: ((oStartupParameters.Mes && oStartupParameters.Mes[0]) ? oStartupParameters.Mes[0] : ""),
					Semana: ((oStartupParameters.Semana && oStartupParameters.Semana[0]) ? oStartupParameters.Semana[0] : ""),
					CodVendedor: ((oStartupParameters.CodVendedor && oStartupParameters.CodVendedor[0]) ? oStartupParameters.CodVendedor[0] : "")
				};
			}

			// Valores Fixos para teste apatir da webide
			//var oParameters = {
			//		CodLoja: "0141",
			//		Ano: "2019",
			//		Semana: "07",
			//		CodVendedor: "79284" };
			this.getView().setModel(new JSONModel(oParameters), "filter");
			this.getView().byId("fdPais").setValue(oParameters.Pais);
			//this.onGetInfo(oParameters);
			this.getView().byId("fdGeral").setValue(oParameters.Geral);
			this.getView().byId("fdRegional").setValue(oParameters.Regional);
			this.getView().byId("fdCodLoja").setValue(oParameters.CodLoja);
			this.getView().byId("fdAno").setValue(oParameters.Ano);
			this.getView().byId("fdMes").setValue(oParameters.Mes);
			this.getView().byId("fdSemana").setValue(oParameters.Semana);
			this.getView().byId("fdCodVendedor").setValue(oParameters.CodVendedor);

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
			this.onLoad();
		},

		onLoad: function (oEvent) {
			// Lista Funcionários
			var oParameters = {
				Pais: this.getView().byId("fdPais").getValue(),
				Geral: 	this.getView().byId("fdGeral").getValue(), 
				Regional: this.getView().byId("fdRegional").getValue(), 
				CodLoja: this.getView().byId("fdCodLoja").getValue(),
				Ano: this.getView().byId("fdAno").getValue(),
				Mes: this.getView().byId("fdMes").getValue(),
				Semana: this.getView().byId("fdSemana").getValue(),
				CodVendedor: this.getView().byId("fdCodVendedor").getValue(),
				class: function () {
					var flag = 1,
						object = "";

					if (flag === 1 && this.Pais !== "" && this.Geral !== "" && this.Regional !== "" && this.CodLoja !== "" && this.Ano !== "" &&
						this.Mes !== "" && this.Semana !== "" && this.CodVendedor !== "") {
						object = "VendedorSemana";
						flag = 0;
					}
					if (flag === 1 && this.Pais !== "" && this.Geral !== "" && this.Regional !== "" && this.CodLoja !== "" && this.Ano !== "" &&
						this.Mes !== "" && this.CodVendedor !== "") {
						object = "VendedorMes";
						flag = 0;
					}
					if (flag === 1 && this.Pais !== "" && this.Geral !== "" && this.Regional !== "" && this.CodLoja !== "" && this.Ano !== "" &&
						this.Mes !== "" && this.Semana !== "") {
						object = "LojaSemana";
						flag = 0;
					}
					if (flag === 1 && this.Pais !== "" && this.Geral !== "" && this.Regional !== "" && this.CodLoja !== "" && this.Ano !== "" &&
						this.Mes !== "") {
						object = "LojaMes";
						flag = 0;
					}
					if (flag === 1 && this.Pais !== "" && this.Geral !== "" && this.Regional !== "" && this.Ano !== "" && this.Mes !== "" && this.Semana !==
						"") {
						object = "RegionalSemana";
						flag = 0;
					}
					if (flag === 1 && this.Pais !== "" && this.Geral !== "" && this.Regional !== "" && this.Ano !== "" && this.Mes !== "") {
						object = "RegionalMes";
						flag = 0;
					}
					if (flag === 1 && this.Pais !== "" && this.Geral !== "" && this.Ano !== "" && this.Mes !== "" && this.Semana !== "") {
						object = "GeralSemana";
						flag = 0;
					}
					if (flag === 1 && this.Pais !== "" && this.Geral !== "" && this.Ano !== "" && this.Mes !== "") {
						object = "GeralMes";
						flag = 0;
					}
					if (flag === 1 && this.Pais !== "" && this.Ano !== "" && this.Mes !== "" && this.Semana !== "") {
						object = "PaisSemana";
						flag = 0;
					}
					if (flag === 1 && this.Pais !== "" && this.Ano !== "" && this.Mes !== "") {
						object = "PaisMes";
						flag = 0;
					}
					return object;
				}
			};
			
			// var keyGeral = this.getView().byId("fdGeral").getSelectedKey();
			// if ( keyGeral !== "") {
			// 	this.getView().byId("fdGeral").setValue(keyGeral);
			// 	oParameters.Geral = keyGeral;	
			// }
			// var keyRegional = this.getView().byId("fdRegional").getSelectedKey();
			// if ( keyRegional !== "") {
			// 	this.getView().byId("fdRegional").setValue(keyRegional); 
			// 	oParameters.Regional = keyRegional;
			// }
			
			this.getView().setModel(new JSONModel(oParameters), "filter");
			this.onDBasico(oParameters);
			this.onMSEvolucao(oParameters);
			this.onMSProjecao(oParameters);
			this.onRoteiro(oParameters);
			// this.onEncantRadar(oParameters);  Não utilizado no momento...
			this.onEncantBar(oParameters);
			this.onPerguntas(oParameters);
			this.onConversao(oParameters);
			this.onFunil(oParameters);
		},

		onDefineEntity: function (name, oParameters) {
			var entity, classificacao = oParameters.class();
			switch (classificacao) {
			case "VendedorSemana":
				if (name === "Roteiro") {
					entity = "/RoteiroFuncSet";
				}
				if (name === "EncantaNPS") {
					entity = "/EncantNPSFuncSet";
				}
				if (name === "EncantCarac") {
					entity = "/EncantCaracFuncSet";
				}
				if (name === "FunilPerdas") {
					entity = "/FunilPerdasItemFuncSet";
				}
				if (name === "Funil") {
					entity = "/FunilFuncSet";
				}
				if (name === "Encantamento") {
					entity = "/PerguntEncantFuncSet";
				}
				if (name === "Procedimento") {
					entity = "/PerguntProcedFuncSet";
				}
				if (name === "Conversao") {
					entity = "/ConvLojaFuncSet";
				}
				if (name === "ConverMed") {
					entity = "/ConvMediaFuncSet";
				}

				break;
			case "VendedorMes":
				if (name === "Roteiro") {
					entity = "/RoteiroFuncMesSet";
				}
				if (name === "EncantaNPS") {
					entity = "/EncantNPSFuncMesSet";
				}
				if (name === "EncantCarac") {
					entity = "/EncantCaracFuncMesSet";
				}
				if (name === "FunilPerdas") {
					entity = "/FunilPerdasItemFuncMesSet";
				}
				if (name === "Funil") {
					entity = "/FunilFuncMesSet";
				}
				if (name === "Encantamento") {
					entity = "/PerguntEncantFuncMesSet";
				}
				if (name === "Procedimento") {
					entity = "/PerguntProcedFuncMesSet";
				}
				if (name === "Conversao") {
					entity = "/ConvLojaFuncSet";
				}
				if (name === "ConverMed") {
					entity = "/ConvMediaFuncSet";
				}

				break;
			case "LojaSemana":
				if (name === "Roteiro") {
					entity = "/RoteiroSet";
				}
				if (name === "EncantaNPS") {
					entity = "/EncantNPSSet";
				}
				if (name === "EncantCarac") {
					entity = "/EncantCaracSet";
				}
				if (name === "FunilPerdas") {
					entity = "/FunilPerdasItemSet";
				}
				if (name === "Funil") {
					entity = "/FunilSet";
				}
				if (name === "Encantamento") {
					entity = "/PerguntEncantSet";
				}
				if (name === "Procedimento") {
					entity = "/PerguntProcedSet";
				}
				if (name === "Conversao") {
					entity = "/ConvLojaSet";
				}
				if (name === "ConverMed") {
					entity = "/ConvMediaLojaSet";
				}

				break;
			case "LojaMes":
				if (name === "Roteiro") {
					entity = "/RoteiroMesSet";
				}
				if (name === "EncantaNPS") {
					entity = "/EncantNPSMesSet";
				}
				if (name === "EncantCarac") {
					entity = "/EncantCaracMesSet";
				}
				if (name === "FunilPerdas") {
					entity = "/FunilPerdasItemMesSet";
				}
				if (name === "Funil") {
					entity = "/FunilMesSet";
				}
				if (name === "Encantamento") {
					entity = "/PerguntEncantMesSet";
				}
				if (name === "Procedimento") {
					entity = "/PerguntProcedMesSet";
				}
				if (name === "Conversao") {
					entity = "/ConvLojaSet";
				}
				if (name === "ConverMed") {
					entity = "/ConvMediaLojaSet";
				}

				break;
			case "RegionalSemana":
				if (name === "Roteiro") {
					entity = "/RoteiroRegSet";
				}
				if (name === "EncantaNPS") {
					entity = "/EncantNPSRegSet";
				}
				if (name === "EncantCarac") {
					entity = "/EncantCaracRegSet";
				}
				if (name === "FunilPerdas") {
					entity = "/FunilPerdasItemRegSet";
				}
				if (name === "Funil") {
					entity = "/FunilRegSet";
				}
				if (name === "Encantamento") {
					entity = "/PerguntEncantRegSet";
				}
				if (name === "Procedimento") {
					entity = "/PerguntProcedRegSet";
				}
				if (name === "Conversao") {
					entity = "/ConvRegSet";
				}
				if (name === "ConverMed") {
					entity = "/ConvMediaRegSet";
				}

				break;
			case "RegionalMes":
				if (name === "Roteiro") {
					entity = "/RoteiroRegMesSet";
				}
				if (name === "EncantaNPS") {
					entity = "/EncantNPSRegMesSet";
				}
				if (name === "EncantCarac") {
					entity = "/EncantCaracRegMesSet";
				}
				if (name === "FunilPerdas") {
					entity = "/FunilPerdasItemRegMesSet";
				}
				if (name === "Funil") {
					entity = "/FunilRegMesSet";
				}
				if (name === "Encantamento") {
					entity = "/PerguntEncantRegMesSet";
				}
				if (name === "Procedimento") {
					entity = "/PerguntProcedRegMesSet";
				}
				if (name === "Conversao") {
					entity = "/ConvRegSet";
				}
				if (name === "ConverMed") {
					entity = "/ConvMediaRegSet";
				}

				break;
			case "GeralSemana":
				if (name === "Roteiro") {
					entity = "/RoteiroGerSet";
				}
				if (name === "EncantaNPS") {
					entity = "/EncantNPSGerSet";
				}
				if (name === "EncantCarac") {
					entity = "/EncantCaracGerSet";
				}
				if (name === "FunilPerdas") {
					entity = "/FunilPerdasItemGerSet";
				}
				if (name === "Funil") {
					entity = "/FunilGerSet";
				}
				if (name === "Encantamento") {
					entity = "/PerguntEncantGerSet";
				}
				if (name === "Procedimento") {
					entity = "/PerguntProcedGerSet";
				}
				if (name === "Conversao") {
					entity = "/ConvGeralSet";
				}
				if (name === "ConverMed") {
					entity = "/ConvMediaGerSet";
				}

				break;
			case "GeralMes":
				if (name === "Roteiro") {
					entity = "/RoteiroGerMesSet";
				}
				if (name === "EncantaNPS") {
					entity = "/EncantNPSGerMesSet";
				}
				if (name === "EncantCarac") {
					entity = "/EncantCaracGerMesSet";
				}
				if (name === "FunilPerdas") {
					entity = "/FunilPerdasItemGerMesSet";
				}
				if (name === "Funil") {
					entity = "/FunilGerMesSet";
				}
				if (name === "Encantamento") {
					entity = "/PerguntEncantGerMesSet";
				}
				if (name === "Procedimento") {
					entity = "/PerguntProcedGerMesSet";
				}
				if (name === "Conversao") {
					entity = "/ConvGeralSet";
				}
				if (name === "ConverMed") {
					entity = "/ConvMediaGerSet";
				}

				break;
			case "PaisSemana":
				if (name === "Roteiro") {
					entity = "/RoteiroPaisSet";
				}
				if (name === "EncantaNPS") {
					entity = "/EncantNPSPaisSet";
				}
				if (name === "EncantCarac") {
					entity = "/EncantCaracPaisSet";
				}
				if (name === "FunilPerdas") {
					entity = "/FunilPerdasItemPaisSet";
				}
				if (name === "Funil") {
					entity = "/FunilPaisSet";
				}
				if (name === "Encantamento") {
					entity = "/PerguntEncantPaisSet";
				}
				if (name === "Procedimento") {
					entity = "/PerguntProcedPaisSet";
				}
				if (name === "Conversao") {
					entity = "/ConvPaisSet";
				}
				if (name === "ConverMed") {
					entity = "/ConvMediaPaisSet";
				}

				break;
			case "PaisMes":
				if (name === "Roteiro") {
					entity = "/RoteiroPaisMesSet";
				}
				if (name === "EncantaNPS") {
					entity = "/EncantNPSPaisMesSet";
				}
				if (name === "EncantCarac") {
					entity = "/EncantCaracPaisMesSet";
				}
				if (name === "FunilPerdas") {
					entity = "/FunilPerdasItemPaisMesSet";
				}
				if (name === "Funil") {
					entity = "/FunilPaisMesSet";
				}
				if (name === "Encantamento") {
					entity = "/PerguntEncantPaisMesSet";
				}
				if (name === "Procedimento") {
					entity = "/PerguntProcedPaisMesSet";
				}
				if (name === "Conversao") {
					entity = "/ConvPaisSet";
				}
				if (name === "ConverMed") {
					entity = "/ConvMediaPaisSet";
				}

				break;
			default:
			}
			return entity;
		},

		onFields: function (fields, oParameters) {
			var object = oParameters.class();
			switch (object) {
			case "VendedorSemana":
				fields = ["Pais", "Geral", "Regional", "CodLoja", "Ano", "Mes", "Semana", "CodVendedor"];
				break;
			case "VendedorMes":
				fields = ["Pais", "Geral", "Regional", "CodLoja", "Ano", "Mes", "CodVendedor"];
				break;
			case "LojaSemana":
				fields = ["Pais", "Geral", "Regional", "CodLoja", "Ano", "Mes", "Semana"];
				break;
			case "LojaMes":
				fields = ["Pais", "Geral", "Regional", "CodLoja", "Ano", "Mes"];
				break;
			case "RegionalSemana":
				fields = ["Pais", "Geral", "Regional", "Ano", "Mes", "Semana"];
				break;
			case "RegionalMes":
				fields = ["Pais", "Geral", "Regional", "Ano", "Mes"];
				break;
			case "GeralSemana":
				fields = ["Pais", "Geral", "Ano", "Mes", "Semana"];
				break;
			case "GeralMes":
				fields = ["Pais", "Geral", "Ano", "Mes"];
				break;
			case "PaisSemana":
				fields = ["Pais", "Ano", "Mes", "Semana"];
				break;
			case "PaisMes":
				fields = ["Pais", "Ano", "Mes"];
				break;
			default:
			}
			return fields;
		},

		onValues: function (values, oParameters) {
			var object = oParameters.class();
			switch (object) {
			case "VendedorSemana":
				values = [oParameters.Pais, oParameters.Geral, oParameters.Regional, oParameters.CodLoja, oParameters.Ano, oParameters.Mes,
					oParameters.Semana, oParameters.CodVendedor];
				break;
			case "VendedorMes":
				values = [oParameters.Pais, oParameters.Geral, oParameters.Regional, oParameters.CodLoja, oParameters.Ano, oParameters.Mes,
					oParameters.CodVendedor];
				break;
			case "LojaSemana":
				values = [oParameters.Pais, oParameters.Geral, oParameters.Regional, oParameters.CodLoja, oParameters.Ano, oParameters.Mes,
					oParameters.Semana];
				break;
			case "LojaMes":
				values = [oParameters.Pais, oParameters.Geral, oParameters.Regional, oParameters.CodLoja, oParameters.Ano, oParameters.Mes];
				break;
			case "RegionalSemana":
				values = [oParameters.Pais, oParameters.Geral, oParameters.Regional, oParameters.Ano, oParameters.Mes, oParameters.Semana];
				break;
			case "RegionalMes":
				values = [oParameters.Pais, oParameters.Geral, oParameters.Regional, oParameters.Ano, oParameters.Mes];
				break;
			case "GeralSemana":
				values = [oParameters.Pais, oParameters.Geral, oParameters.Ano, oParameters.Mes, oParameters.Semana];
				break;
			case "GeralMes":
				values = [oParameters.Pais, oParameters.Geral, oParameters.Ano, oParameters.Mes];
				break;
			case "PaisSemana":
				values = [oParameters.Pais, oParameters.Ano, oParameters.Mes, oParameters.Semana];
				break;
			case "PaisMes":
				values = [oParameters.Pais, oParameters.Ano, oParameters.Mes];
				break;
			default:
			}
			return values;
		},

		onGetInfo: function (oParameters) {
			var aFilterFields = ["Geral", "Regional"];
			var aFilterValues = [oParameters.Geral, oParameters.Regional];
			var sObjectPathBasico = "/DBasicoSet";
			var aFilters = this._createSearchFilterObject(aFilterFields, aFilterValues);
			var geralDescr = this.getView().byId("fdGeral"),
				regionalDescr = this.getView().byId("fdRegional");
			this.getView().getModel().read(sObjectPathBasico, {
				filters: aFilters,
				success: function (oData) {
					geralDescr.setSelectedKey(oData.results[0].Geral);
					geralDescr.setValue(oData.results[0].DescGeral);
					regionalDescr.setSelectedKey(oData.results[0].Regional);
					regionalDescr.setValue(oData.results[0].DescRegional);
				},
				error: function (oError) {
					console.log(oError);
				}
			});
		},
		
		onDBasico: function (oParameters) {
			var aFilterFields = ["Pais", "Geral", "Regional", "CodLoja", "Ano", "Mes", "Semana", "CodVendedor"];
			var aFilterValues = [oParameters.Pais, oParameters.Geral, oParameters.Regional, oParameters.CodLoja, oParameters.Ano, oParameters.Mes,
				oParameters.Semana, oParameters.CodVendedor];
			var sObjectPathBasico = "/DBasicoSet";
			var aFilters = this._createSearchFilterObject(aFilterFields, aFilterValues);
			this.getView().byId("IdCodVendedor").setText("Matrícula: " + oParameters.CodVendedor);
			var semana = this.getView().byId("IdSemana");
			this.getView().getModel().read(sObjectPathBasico, {
				filters: aFilters,
				success: function (oData) {
					semana.setText("Semana: " + oData.results[0].Periodo);
				},
				error: function (oError) {
					console.log(oError);
				}
			});
		},

		onMSEvolucao: function (oParameters) {
			var aFilterFields = ["Pais", "Geral", "Regional", "CodLoja", "Ano", "Mes", "Semana", "CodVendedor"];
			var aFilterValues = [oParameters.Pais, oParameters.Geral, oParameters.Regional, oParameters.CodLoja, oParameters.Ano, oParameters.Mes,
				oParameters.Semana, oParameters.CodVendedor];
			var sObjectPathEvol = "/MSEvolucaoSet";
			var lidNome = this.getView().byId("IdNome");
			var txtProj = this.getView().byId("idMEvoProj");
			var aFilters = this._createSearchFilterObject(aFilterFields, aFilterValues);
			var tEvol = this.getView().byId("tEvol");
			this.getView().getModel().read(sObjectPathEvol, {
				filters: aFilters,
				success: function (oData) {
					if (typeof oData.results[0] !== 'undefined') {
						var oEvol = {
							MSEvolucaoSet: oData.results
						};
						lidNome.setText("Nome: " + oData.results[0].Vendedor);
						if (typeof oData.results[1] == 'undefined') {
							txtProj.setText(oData.results[0].Resumo);
						} else {
							txtProj.setText(oData.results[0].Resumo + oData.results[1].Resumo);
						}
						var oEvolModel = new sap.ui.model.json.JSONModel(oEvol);
						tEvol.setModel(oEvolModel);
					}
				},
				error: function (oError) {
					console.log(oError);
				}
			});
		},

		onMSProjecao: function (oParameters) {
			var aFilterFields = ["Pais", "Geral", "Regional", "CodLoja", "Ano", "Mes", "Semana", "CodVendedor"];
			var aFilterValues = [oParameters.Pais, oParameters.Geral, oParameters.Regional, oParameters.CodLoja, oParameters.Ano, oParameters.Mes,
				oParameters.Semana, oParameters.CodVendedor];
			var sObjectPathProj = "/MSProjecaoSet";
			var aFilters = this._createSearchFilterObject(aFilterFields, aFilterValues);
			var tProjr = this.getView().byId("tProjReal");
			var tProjs = this.getView().byId("tProjSimu");
			var tProjm = this.getView().byId("tProjMais");
			this.getView().getModel().read(sObjectPathProj, {
				filters: aFilters,
				success: function (oData) {
					if (typeof oData.results[0] !== 'undefined') {
						var oProj = {
							MSProjecaoSet: oData.results
						};
						var oProjModel = new sap.ui.model.json.JSONModel(oProj);
						tProjr.setModel(oProjModel);
						tProjs.setModel(oProjModel);
						tProjm.setModel(oProjModel);
					}
				},
				error: function (oError) {
					console.log(oError);
				}
			});
		},

		onRoteiro: function (oParameters) {
			var fields, values;
			var aFilterFields = this.onFields(fields, oParameters);
			var aFilterValues = this.onValues(values, oParameters);
			var sObjectRoteiroPath = this.onDefineEntity("Roteiro", oParameters);
			var sObjectEncantNPSPath = this.onDefineEntity("EncantaNPS", oParameters);
			var aFilters = this._createSearchFilterObject(aFilterFields, aFilterValues);

			var lCumpRot = this.getView().byId("lCumpRot");
			// var RotVendeu = this.getView().byId("rmRotVendeu");
			// var RotNVendeu = this.getView().byId("rmRotNVendeu");
			var PerProced = this.getView().byId("idPerProced");
			var PerEncant = this.getView().byId("idPerEncant");
			var rmRotProced = this.getView().byId("rmRotProced");
			var rmRotNProced = this.getView().byId("rmRotNProced");
			var rmRotEncant = this.getView().byId("rmRotEncant");
			var rmRotNEncant = this.getView().byId("rmRotNEncant");
			this.getView().getModel().read(sObjectRoteiroPath, {
				filters: aFilters,
				success: function (oData) {
					if (typeof oData.results[0] !== 'undefined') {
						lCumpRot.setText(oData.results[0].CumpRot + "%");
						PerProced.setText(oData.results[0].CumpProcTot + "%");
						PerEncant.setText(parseInt(oData.results[0].CumpEncTot) + "%");
						rmRotProced.setText(oData.results[0].CumpRotProcedimento + "%");
						rmRotNProced.setText(oData.results[0].CumpRotNProcedimento + "%");
						rmRotEncant.setText(parseInt(oData.results[0].CumpEncTotVendeu) + "%");
						rmRotNEncant.setText(parseInt(oData.results[0].CumpEncTotNVendeu) + "%");
					}
				},
				error: function (oError) {}
			});

			var lPCumpTot = this.getView().byId("lPCumpTot");
			var lPNCumpTot = this.getView().byId("lPNCumpTot");
			var aFilterPromotor = this._createSearchFilterObject(aFilterFields, aFilterValues);
			aFilterPromotor.push(new sap.ui.model.Filter("TipoNps", "EQ", "PROMOTOR"));
			this.getView().getModel().read(sObjectEncantNPSPath, {
				filters: aFilterPromotor,
				success: function (oData, response) {
					if (oData && oData.results.length > 0) {
						lPCumpTot.setText(oData.results[0].CumpTot + "%");
						lPNCumpTot.setText(oData.results[0].NCumpTot + "%");
					} else {
						lPCumpTot.setText("0%");
						lPNCumpTot.setText("0%");
					}
				},
				error: function (oError) {}
			});

			var lNCumpTot = this.getView().byId("lNCumpTot");
			var lNNCumpTot = this.getView().byId("lNNCumpTot");
			var aFilterNeutro = this._createSearchFilterObject(aFilterFields, aFilterValues);
			aFilterNeutro.push(new sap.ui.model.Filter("TipoNps", "EQ", "NEUTRO"));
			this.getView().getModel().read(sObjectEncantNPSPath, {
				filters: aFilterNeutro,
				success: function (oData, response) {
					if (oData && oData.results.length > 0) {
						lNCumpTot.setText(oData.results[0].CumpTot + "%");
						lNNCumpTot.setText(oData.results[0].NCumpTot + "%");
					} else {
						lNCumpTot.setText("0%");
						lNNCumpTot.setText("0%");
					}
				},
				error: function (oError) {}
			});

			var lDCumpTot = this.getView().byId("lDCumpTot");
			var lDNCumpTot = this.getView().byId("lDNCumpTot");
			var aFilterDetrator = this._createSearchFilterObject(aFilterFields, aFilterValues);
			aFilterDetrator.push(new sap.ui.model.Filter("TipoNps", "EQ", "DETRATOR"));
			this.getView().getModel().read(sObjectEncantNPSPath, {
				filters: aFilterDetrator,
				success: function (oData, response) {
					if (oData && oData.results.length > 0) {
						lDCumpTot.setText(oData.results[0].CumpTot + "%");
						lDNCumpTot.setText(oData.results[0].NCumpTot + "%");
					} else {
						lDCumpTot.setText("0%");
						lDNCumpTot.setText("0%");
					}
				},
				error: function (oError) {}
			});

		},

		onEncantBar: function (oParameters) {
			var fields, values;
			var aFilterFields = this.onFields(fields, oParameters);
			var aFilterValues = this.onValues(values, oParameters);
			var sObjectPathCarac = this.onDefineEntity("EncantCarac", oParameters);			
			var aFilters = this._createSearchFilterObject(aFilterFields, aFilterValues);			
			var gEncant = this.getView().byId("gEncant");
			
			this.getView().getModel().read(sObjectPathCarac, {
				filters: aFilters,
				success: function (oData) {
					var oEnc = {
						EncantCaracFuncSet: oData.results
					};
					var oEncantModel = new sap.ui.model.json.JSONModel(oEnc);					
					gEncant.setVizProperties({
						plotArea: {
							colorPalette: d3.scale.category20().range(),
							dataLabel: {
								visible: true,
								showTotal: true
							},
							colorPalette: ["#000000", "#dcdcdc"]
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
						tooltip: {
							visible: true
						},
		             		title: {
		                 		visible: false
		             		}
					});
					gEncant.setModel(oEncantModel);
				},
				error: function (oError) {
					console.log(oError);
				}
			});

		},

        // Não utilizado no momento...
		// onEncantRadar: function (oParameters) {
		// 	var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
		// 	var radarChartDataCompr = {
		// 		labels: [oResourceBundle.getText("lblAcolhimento"), oResourceBundle.getText("lblEmpatia"), oResourceBundle.getText(
		// 			"lblEntusiasmo"), oResourceBundle.getText("lblTransparencia"), oResourceBundle.getText("lblAgradecimento")],
		// 		datasets: [{
		// 			label: "Dados",
		// 			backgroundColor: "rgba(255,255,255,0.0)",
		// 			borderColor: "rgba(179,181,198,1)",
		// 			pointBackgroundColor: "rgba(179,181,198,1)",
		// 			pointBorderColor: "#fff",
		// 			pointHoverBackgroundColor: "#fff",
		// 			pointHoverBorderColor: "rgba(179,181,198,1)",
		// 			data: [0, 0, 0, 0, 0]
		// 		}]
		// 	};

		// 	this.getView().setModel(new JSONModel({
		// 		radarChartDataCompr: radarChartDataCompr
		// 	}), "chartData");

		// 	var fields, values;
		// 	var aFilterFields = this.onFields(fields, oParameters);
		// 	var aFilterValues = this.onValues(values, oParameters);
		// 	var sObjectPathCarac = this.onDefineEntity("EncantCarac", oParameters);
		// 	var aFilters = this._createSearchFilterObject(aFilterFields, aFilterValues);

		// 	this.getView().getModel().read(sObjectPathCarac, {
		// 		filters: aFilters,
		// 		success: function (oData) {
		// 			var oChartData = this.getView().getModel("chartData").getData();
		// 			oData.results.forEach(function (oEncant) {
		// 				switch (oEncant.Caracteristica) {
		// 				case "ACOLHIMENTO":
		// 					oChartData.radarChartDataCompr.datasets[0].data[0] = oEncant.CumpTot;
		// 					break;
		// 				case "EMPATIA":
		// 					oChartData.radarChartDataCompr.datasets[0].data[1] = oEncant.CumpTot;
		// 					break;
		// 				case "ENTUSIASMO":
		// 					oChartData.radarChartDataCompr.datasets[0].data[2] = oEncant.CumpTot;
		// 					break;
		// 				case "TRANSPARÊNCIA":
		// 					oChartData.radarChartDataCompr.datasets[0].data[3] = oEncant.CumpTot;
		// 					break;
		// 				case "AGRADECIMENTO":
		// 					oChartData.radarChartDataCompr.datasets[0].data[4] = oEncant.CumpTot;
		// 					break;
		// 				}
		// 			}.bind(this));
		// 			this.getView().getModel("chartData").refresh(true);
		// 		}.bind(this),
		// 		error: function (oError) {}
		// 	});
		// },

		onPerguntas: function (oParameters) {
			var fields, values;
			var aFilterFields = this.onFields(fields, oParameters);
			var aFilterValues = this.onValues(values, oParameters);
			var sObjectPathProced = this.onDefineEntity("Procedimento", oParameters);
			var aFilters = this._createSearchFilterObject(aFilterFields, aFilterValues);
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
					console.log(oError);
				}
			});

			var sObjectPathEncant = this.onDefineEntity("Encantamento", oParameters);
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
					console.log(oError);
				}
			});
		},

		onConversao: function (oParameters) {
			var fields, values;
			var aFilterFields = this.onFields(fields, oParameters);
			var aFilterValues = this.onValues(values, oParameters);
			var sObjectPathConv = this.onDefineEntity("Conversao", oParameters);
			var aFilters = this._createSearchFilterObject(aFilterFields, aFilterValues);

			var txtConver1 = this.getView().byId("idMConver1");
			var gConversao = this.getView().byId("gConversao");

			this.getView().getModel().read(sObjectPathConv, {
				filters: aFilters,
				success: function (oData) {
					if (typeof oData.results[0] !== 'undefined') {
						var oConv = {
							ConvLojaFuncSet: oData.results
						};
						var oConvModel = new sap.ui.model.json.JSONModel(oConv);
						txtConver1.setText(oData.results[0].Resumo);
						gConversao.setVizProperties({
							plotArea: {
								colorPalette: d3.scale.category20().range(),
								dataLabel: {
									visible: true,
									showTotal: true
								},
								colorPalette: ["#000000", "#dcdcdc"]
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
							tooltip: {
								visible: true
							},
							title: {
								text: "Conversão Vendedor x Equipe de Calçados"
							}
						});
						gConversao.setModel(oConvModel);
					}
				},
				error: function (oError) {
					console.log(oError);
				}
			});

			// var sObjectPathConvMed = "/ConvMediaSet";
			var sObjectPathConvMed = this.onDefineEntity("ConverMed", oParameters);
			var txtConver2 = this.getView().byId("idMConver2");
			var gConvMedia = this.getView().byId("gConvMedia");

			this.getView().getModel().read(sObjectPathConvMed, {
				filters: aFilters,
				success: function (oData) {
					if (typeof oData.results[0] !== 'undefined') {
						var oConvMed = {
							ConvMediaSet: oData.results
						};
						var oConvMediaModel = new sap.ui.model.json.JSONModel(oConvMed);
						txtConver2.setText(oData.results[0].Resumo);
						gConvMedia.setVizProperties({
							plotArea: {
								colorPalette: d3.scale.category20().range(),
								dataLabel: {
									visible: true,
									showTotal: true
								},
								colorPalette: ['#000000', '#dcdcdc']
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
							tooltip: {
								visible: true
							},
							title: {
								text: "Média Vendedor x Equipe de Calçados"
							}
						});
						gConvMedia.setModel(oConvMediaModel);
					}
				},
				error: function (oError) {
					console.log(oError);
				}
			});

		},

		onFunil: function (oParameters) {
			var fields, values;
			var aFilterFields = this.onFields(fields, oParameters);
			var aFilterValues = this.onValues(values, oParameters);
			var sObjectPathPerdas = this.onDefineEntity("FunilPerdas", oParameters);
			var aFilters = this._createSearchFilterObject(aFilterFields, aFilterValues);

			var vizPerdas = this.getView().byId("idPerdasVendas");
			this.getView().getModel().read(sObjectPathPerdas, {
				filters: aFilters,
				success: function (oData) {
					if (typeof oData.results[0] !== 'undefined') {
						var oPerdas = {
							FunilPerdasItemFuncSet: oData.results
						}; 
						var oPerdasModel = new sap.ui.model.json.JSONModel(oPerdas);
						vizPerdas.setVizProperties({
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
							valueAxis2: {
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
					}
				},
				error: function (oError) {
					console.log(oError);
				}
			});

			// var fFilters = aFilters;
			//fFilters.push(new Filter("FiltroOVP", FilterOperator.EQ, true));
			var sObjectPathFunil = this.onDefineEntity("Funil", oParameters);
			this.getView().byId("ovpList").getBinding("items").filter(new Filter(aFilters, true));
			// this.getView().byId("hboxConversao").bindElement({&nbsp;
			// 	path: "/FunilFuncSet(CodLoja='" + oParameters.CodLoja + "',Ano='" + oParameters.Ano + "',Semana='" + oParameters.Semana +
			// 		"',Area='AGRADECER" + "',CodVendedor='" + oParameters.CodVendedor + "')/"
			// });
			var pathFunil;
			switch (sObjectPathFunil) {
			case "/FunilFuncSet":
				pathFunil = "/FunilFuncSet(Pais='" + oParameters.Pais + "',Geral='" + oParameters.Geral + "',Regional='" + oParameters.Regional +
					"',CodLoja='" + oParameters.CodLoja + "',Ano='" + oParameters.Ano + "',Mes='" + oParameters.Mes + "',Semana='" + oParameters.Semana +
					"',CodVendedor='" + oParameters.CodVendedor + "',Area='AGRADECER" + "')/";
				break;
			case "/FunilFuncMesSet":
				pathFunil = "/FunilFuncMesSet(Pais='" + oParameters.Pais + "',Geral='" + oParameters.Geral + "',Regional='" + oParameters.Regional +
					"',CodLoja='" + oParameters.CodLoja + "',Ano='" + oParameters.Ano + "',Mes='" + oParameters.Mes + "',CodVendedor='" + oParameters
					.CodVendedor + "',Area='AGRADECER" + "')/";
				break;
			case "/FunilSet":
				pathFunil = "/FunilSet(Pais='" + oParameters.Pais + "',Geral='" + oParameters.Geral + "',Regional='" + oParameters.Regional +
					"',CodLoja='" + oParameters.CodLoja + "',Ano='" + oParameters.Ano + "',Mes='" + oParameters.Mes + "',Semana='" + oParameters.Semana +
					"',Area='AGRADECER" + "')/";
				break;
			case "/FunilMesSet":
				pathFunil = "/FunilMesSet(Pais='" + oParameters.Pais + "',Geral='" + oParameters.Geral + "',Regional='" + oParameters.Regional +
					"',CodLoja='" + oParameters.CodLoja + "',Ano='" + oParameters.Ano + "',Mes='" + oParameters.Mes + "',Area='AGRADECER" + "')/";
				break;
			case "/FunilRegSet":
				pathFunil = "/FunilRegSet(Pais='" + oParameters.Pais + "',Geral='" + oParameters.Geral + "',Regional='" + oParameters.Regional +
					"',Ano='" + oParameters.Ano + "',Mes='" + oParameters.Mes + "',Semana='" + oParameters.Semana + "',Area='AGRADECER" + "')/";
				break;
			case "/FunilRegMesSet":
				pathFunil = "/FunilRegMesSet(Pais='" + oParameters.Pais + "',Geral='" + oParameters.Geral + "',Regional='" + oParameters.Regional +
					"',Ano='" + oParameters.Ano + "',Mes='" + oParameters.Mes + "',Area='AGRADECER" + "')/";
				break;
			case "/FunilGerSet":
				pathFunil = "/FunilGerSet(Pais='" + oParameters.Pais + "',Geral='" + oParameters.Geral + "',Ano='" + oParameters.Ano + "',Mes='" +
					oParameters.Mes + "',Semana='" + oParameters.Semana + "',Area='AGRADECER" + "')/";
				break;
			case "/FunilGerMesSet":
				pathFunil = "/FunilGerMesSet(Pais='" + oParameters.Pais + "',Geral='" + oParameters.Geral + "',Ano='" + oParameters.Ano +
					"',Mes='" + oParameters.Mes + "',Area='AGRADECER" + "')/";
				break;
			case "/FunilPaisSet":
				pathFunil = "/FunilPaisSet(Pais='" + oParameters.Pais + "',Ano='" + oParameters.Ano + "',Mes='" + oParameters.Mes + "',Semana='" +
					oParameters.Semana + "',Area='AGRADECER" + "')/";
				break;
			case "/FunilPaisMesSet":
				pathFunil = "/FunilPaisMesSet(Pais='" + oParameters.Pais + "',Ano='" + oParameters.Ano + "',Mes='" + oParameters.Mes +
					"',Area='AGRADECER" + "')/";
				break;
			default:
			}
			this.getView().byId("hboxConversao").bindElement({
				path: pathFunil
			});
		},

		gerarPDF: function (oEvent) {
			jQuery.sap.require("hodosovp.FolhaMagica.libs.ExportPageToPDF");
			hodosovp.FolhaMagica.libs.ExportPageToPDF.generate(this);
		},

		onSearch: function (oEvent) {
			var parameters = this.getView().getModel("filter").getData();
			var aFilterFields, aFilterValues, aFilters, sGrowingThreshold;

			if (oEvent.mParameters.id.search("fdCodVendedor") != "-1") {
				this._oDialogVend = sap.ui.xmlfragment("hodosovp.FolhaMagica.fragment.Vendedores", this);
				this._oDialogVend.setModel(this.getView().getModel());
				this._oDialogVend.setMultiSelect(false);
				this._oDialogVend.setShowClearButton(true);
				this._oDialogVend.setGrowing(true);
				sGrowingThreshold = oEvent.getSource().data("threshold");
				if (sGrowingThreshold) {
					this._oDialogVend.setGrowingThreshold(parseInt(sGrowingThreshold));
				}
				// this._oDialogVend.getBinding("items").filter([]);
				aFilterFields = ["Pais", "Geral", "Regional", "CodLoja", "Ano", "Mes", "Semana", "CodVendedor"];
				aFilterValues = [parameters.Pais, parameters.Geral, parameters.Regional, parameters.CodLoja, parameters.Ano, parameters.Mes,
					parameters.Semana, parameters.CodVendedor
				];
				aFilters = this._createSearchFilterObject(aFilterFields, aFilterValues);
				this._oDialogVend.getBinding("items").filter(aFilters);
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogVend);
				this._oDialogVend.open();
			}
			if (oEvent.mParameters.id.search("fdCodLoja") != "-1") {
				this._oDialogLoja = sap.ui.xmlfragment("hodosovp.FolhaMagica.fragment.Lojas", this);
				this._oDialogLoja.setModel(this.getView().getModel());
				this._oDialogLoja.setMultiSelect(false);
				this._oDialogLoja.setShowClearButton(true);
				this._oDialogLoja.setGrowing(true);
				sGrowingThreshold = oEvent.getSource().data("threshold");
				if (sGrowingThreshold) {
					this._oDialogLoja.setGrowingThreshold(parseInt(sGrowingThreshold));
				}
				// this._oDialogLoja.getBinding("items").filter([]);
				aFilterFields = ["Pais", "Geral", "Regional", "CodLoja"];
				aFilterValues = [parameters.Pais, parameters.Geral, parameters.Regional, parameters.CodLoja];
				aFilters = this._createSearchFilterObject(aFilterFields, aFilterValues);
				this._oDialogLoja.getBinding("items").filter(aFilters);
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogLoja);
				this._oDialogLoja.open();
			}
			if (oEvent.mParameters.id.search("fdPais") != "-1") {
				this._oDialogPais = sap.ui.xmlfragment("hodosovp.FolhaMagica.fragment.Paises", this);
				this._oDialogPais.setModel(this.getView().getModel());
				this._oDialogPais.setMultiSelect(false);
				this._oDialogPais.setShowClearButton(true);
				this._oDialogPais.setGrowing(true);
				sGrowingThreshold = oEvent.getSource().data("threshold");
				if (sGrowingThreshold) {
					this._oDialogPais.setGrowingThreshold(parseInt(sGrowingThreshold));
				}
				// this._oDialogPais.getBinding("items").filter([]);
				aFilterFields = ["Pais"];
				aFilterValues = [parameters.Pais];
				aFilters = this._createSearchFilterObject(aFilterFields, aFilterValues);
				this._oDialogPais.getBinding("items").filter(aFilters);
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogPais);
				this._oDialogPais.open();
			}
			if (oEvent.mParameters.id.search("fdGeral") != "-1") {
				this._oDialogGera = sap.ui.xmlfragment("hodosovp.FolhaMagica.fragment.Gerais", this);
				this._oDialogGera.setModel(this.getView().getModel());
				this._oDialogGera.setMultiSelect(false);
				this._oDialogGera.setShowClearButton(true);
				this._oDialogGera.setGrowing(true);
				var sGrowingThreshold = oEvent.getSource().data("threshold");
				if (sGrowingThreshold) {
					this._oDialogGera.setGrowingThreshold(parseInt(sGrowingThreshold));
				}
				// this._oDialogGera.getBinding("items").filter([]);
				aFilterFields = ["Pais", "Geral"];
				aFilterValues = [parameters.Pais, parameters.Geral];
				aFilters = this._createSearchFilterObject(aFilterFields, aFilterValues);
				this._oDialogGera.getBinding("items").filter(aFilters);
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogGera);
				this._oDialogGera.open();
			}
			if (oEvent.mParameters.id.search("fdRegional") != "-1") {
				this._oDialogRegi = sap.ui.xmlfragment("hodosovp.FolhaMagica.fragment.Regionais", this);
				this._oDialogRegi.setModel(this.getView().getModel());
				this._oDialogRegi.setMultiSelect(false);
				this._oDialogRegi.setShowClearButton(true);
				this._oDialogRegi.setGrowing(true);
				sGrowingThreshold = oEvent.getSource().data("threshold");
				if (sGrowingThreshold) {
					this._oDialogRegi.setGrowingThreshold(parseInt(sGrowingThreshold));
				}
				// this._oDialogRegi.getBinding("items").filter([]);
				aFilterFields = ["Pais", "Geral", "Regional"];
				aFilterValues = [parameters.Pais, parameters.Geral, parameters.Regional];
				aFilters = this._createSearchFilterObject(aFilterFields, aFilterValues);
				this._oDialogRegi.getBinding("items").filter(aFilters);
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogRegi);
				this._oDialogRegi.open();
			}
			if (oEvent.mParameters.id.search("fdAno") != "-1") {
				this._oDialogAnos = sap.ui.xmlfragment("hodosovp.FolhaMagica.fragment.Anos", this);
				this._oDialogAnos.setModel(this.getView().getModel());
				this._oDialogAnos.setMultiSelect(false);
				this._oDialogAnos.setShowClearButton(true);
				this._oDialogAnos.setGrowing(true);
				sGrowingThreshold = oEvent.getSource().data("threshold");
				if (sGrowingThreshold) {
					this._oDialogAnos.setGrowingThreshold(parseInt(sGrowingThreshold));
				}
				// this._oDialogAnos.getBinding("items").filter([]);
				aFilterFields = ["Pais", "Geral", "Regional", "CodLoja", "Ano"];
				aFilterValues = [parameters.Pais, parameters.Geral, parameters.Regional, parameters.CodLoja, parameters.Ano];
				aFilters = this._createSearchFilterObject(aFilterFields, aFilterValues);
				this._oDialogAnos.getBinding("items").filter(aFilters);
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogAnos);
				this._oDialogAnos.open();
			}
			if (oEvent.mParameters.id.search("fdMes") != "-1") {
				this._oDialogMese = sap.ui.xmlfragment("hodosovp.FolhaMagica.fragment.Meses", this);
				this._oDialogMese.setModel(this.getView().getModel());
				this._oDialogMese.setMultiSelect(false);
				this._oDialogMese.setShowClearButton(true);
				this._oDialogMese.setGrowing(true);
				var sGrowingThreshold = oEvent.getSource().data("threshold");
				if (sGrowingThreshold) {
					this._oDialogMese.setGrowingThreshold(parseInt(sGrowingThreshold));
				}
				// this._oDialogMese.getBinding("items").filter([]);
				aFilterFields = ["Pais", "Geral", "Regional", "CodLoja", "Ano", "Mes"];
				aFilterValues = [parameters.Pais, parameters.Geral, parameters.Regional, parameters.CodLoja, parameters.Ano, parameters.Mes];
				aFilters = this._createSearchFilterObject(aFilterFields, aFilterValues);
				this._oDialogMese.getBinding("items").filter(aFilters);
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogMese);
				this._oDialogMese.open();
			}
			if (oEvent.mParameters.id.search("fdSemana") != "-1") {
				this._oDialogSema = sap.ui.xmlfragment("hodosovp.FolhaMagica.fragment.Semanas", this);
				this._oDialogSema.setModel(this.getView().getModel());
				this._oDialogSema.setMultiSelect(false);
				this._oDialogSema.setShowClearButton(true);
				this._oDialogSema.setGrowing(true);
				sGrowingThreshold = oEvent.getSource().data("threshold");
				if (sGrowingThreshold) {
					this._oDialogSema.setGrowingThreshold(parseInt(sGrowingThreshold));
				}
				// this._oDialogSema.getBinding("items").filter([]);
				aFilterFields = ["Pais", "Geral", "Regional", "CodLoja", "Ano", "Mes", "Semana"];
				aFilterValues = [parameters.Pais, parameters.Geral, parameters.Regional, parameters.CodLoja, parameters.Ano, parameters.Mes,
					parameters.Semana
				];
				aFilters = this._createSearchFilterObject(aFilterFields, aFilterValues);
				this._oDialogSema.getBinding("items").filter(aFilters);
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogSema);
				this._oDialogSema.open();
			}
		},

		onDialogSearch: function (oEvent) {
			var aFilterFields, aFilterValues;
			var parameters = this.getView().getModel("filter").getData();

			if (oEvent.mParameters.id.search("fdCodVendedor") != "-1") {
				aFilterFields = ["Pais", "Geral", "Regional", "CodLoja", "Ano", "Mes", "Semana", "CodVendedor"];
				aFilterValues = [parameters.Pais, parameters.Geral, parameters.Regional, parameters.CodLoja, parameters.Ano, parameters.Mes,
					parameters.Semana, parameters.CodVendedor
				];
			}
			if (oEvent.mParameters.id.search("fdCodLoja") != "-1") {
				aFilterFields = ["Pais", "Geral", "Regional", "CodLoja"];
				aFilterValues = [parameters.Pais, parameters.Geral, parameters.Regional, parameters.CodLoja];
			}
			if (oEvent.mParameters.id.search("fdPais") != "-1") {
				aFilterFields = ["Pais"];
				aFilterValues = [parameters.Pais];
			}
			if (oEvent.mParameters.id.search("fdGeral") != "-1") {
				aFilterFields = ["Pais", "Geral"];
				aFilterValues = [parameters.Pais, parameters.Geral];
			}
			if (oEvent.mParameters.id.search("fdRegional") != "-1") {
				aFilterFields = ["Pais", "Geral", "Regional"];
				aFilterValues = [parameters.Pais, parameters.Geral, parameters.Regional];
			}
			if (oEvent.mParameters.id.search("fdAno") != "-1") {
				aFilterFields = ["Pais", "Geral", "Regional", "CodLoja", "Ano"];
				aFilterValues = [parameters.Pais, parameters.Geral, parameters.Regional, parameters.CodLoja, parameters.Ano];
			}
			if (oEvent.mParameters.id.search("fdMes") != "-1") {
				aFilterFields = ["Pais", "Geral", "Regional", "CodLoja", "Ano", "Mes"];
				aFilterValues = [parameters.Pais, parameters.Geral, parameters.Regional, parameters.CodLoja, parameters.Ano, parameters.Mes];
			}
			if (oEvent.mParameters.id.search("fdSemana") != "-1") {
				aFilterFields = ["Pais", "Geral", "Regional", "CodLoja", "Ano", "Mes", "Semana"];
				aFilterValues = [parameters.Pais, parameters.Geral, parameters.Regional, parameters.CodLoja, parameters.Ano, parameters.Mes,
					parameters.Semana
				];
			}

			var aFilters = this._createSearchFilterObject(aFilterFields, aFilterValues);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(aFilters);
		},

		onValueConfirm: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem"),
				field = "N",
				oInput;

			if (oEvent.oSource.mBindingInfos.title.parts[0].path === "txtSelVendedor") {
				oInput = this.byId("fdCodVendedor");
			}
			if (oEvent.oSource.mBindingInfos.title.parts[0].path === "txtSelLoja") {
				oInput = this.byId("fdCodLoja");
			}
			if (oEvent.oSource.mBindingInfos.title.parts[0].path === "txtSelPais") {
				oInput = this.byId("fdPais");
			}
			if (oEvent.oSource.mBindingInfos.title.parts[0].path === "txtSelGeral") {
				oInput = this.byId("fdGeral");
				// field = "S";
			}
			if (oEvent.oSource.mBindingInfos.title.parts[0].path === "txtSelRegional") {
				oInput = this.byId("fdRegional");
				// field = "S";
			}
			if (oEvent.oSource.mBindingInfos.title.parts[0].path === "txtSelAno") {
				oInput = this.byId("fdAno");
			}
			if (oEvent.oSource.mBindingInfos.title.parts[0].path === "txtSelMes") {
				oInput = this.byId("fdMes");
			}
			if (oEvent.oSource.mBindingInfos.title.parts[0].path === "txtSelSemana") {
				oInput = this.byId("fdSemana");
			}

			if (oSelectedItem) {
				oInput.setValue(oSelectedItem.getTitle());
				// if (field === "S") {
				// 	// oInput.setSelectedKey(oSelectedItem.getTitle());
				// 	// oInput.setValue(oSelectedItem.getDescription());
				// } else {
				// 	oInput.setValue(oSelectedItem.getTitle());
				// }
			}

			if (!oSelectedItem) {
				oInput.resetProperty("");
			}

			this.onChangeFilter();
		},

		onChangeFilter: function (oEvent) {
			this.onLoad();
		}
	});
});