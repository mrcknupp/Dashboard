/*global hodos*/
jQuery.sap.declare("hodos.hodosroteiro.model.Formatter");

hodos.hodosroteiro.model.Formatter = {

	availableState: function (total) {
		var sRes;
		if (total) {
			total = parseFloat(total, 10);
			if (total < 30) {
				sRes = 8;
			}
			if (total > 30 && total < 50) {
				sRes = 3;
			}
			if (total > 50) {
				sRes = 3;
			}
		}
		return sRes;
	},

	pergunta: function (value) {
		if (value && value != "") {
			return value + " - " + this.getResourceBundle().getText("notasChecklist.questao" + value);
		}
	},

	tipoPergunta: function (value) {
		if (value && value != "") {
			var sText = value.toLowerCase();
			return sText.charAt(0).toUpperCase() + sText.slice(1);
		}
	},

	parseFloat: function (value) {
		return parseFloat(value);
	},

	//	Color Scheme 1 - amrelo
	//	Color Scheme 2 - laranja
	//	Color Scheme 3 - vermelho
	//	Color Scheme 7 - verde

	//de 0-25%, vermelho, de 25-50%, laranja, 50-75%-amarelo, 75-100% verde

	colorCheck: function (valor) {
		var sRes;
		if (valor) {
			valor = parseFloat(valor, 10);
			if (valor < 25) {
				sRes = 3;
			}
			if (valor >= 25 && valor < 50) {
				sRes = 2;
			}
			if (valor >= 50 && valor < 75) {
				sRes = 1;
			}
			if (valor >= 75) {
				sRes = 8;
			}
		}
		return sRes;
	},

	showZero: function (value) {
		if (value && value != "") {
			return parseFloat(value, 10) + "%";
		} else {
			return 0 + "%";
		}
	},

	fnCollor: function (value) {
		var iColor = hodos.hodosroteiro.model.Formatter.colorCheck(value);
		switch (iColor) {
		case 1:
			break;
		case 2:
			break;
		case 3:
			break;
		default:
			return 1;
		}
	}
};