sap.ui.define(["sap/ui/base/Object"], function (BaseObject) {

	var Preprocessor = BaseObject.extend("hodos.hodosovp.ext.cards.donut.Preprocessor", {

	});

	Preprocessor.process = function (oPromise) {

		var processView = function (oView) {
			var oChart = oView.byId("analyticalChart");
			oChart.setHeight("282px");
			oChart.setVizProperties({
				plotArea: {
					colorPalette: ['#ffcc66', '#DCDCDC']
				}
			});
		};

		if (oPromise instanceof Promise) {
			return oPromise.then(processView);
		} else {
			return processView(oPromise);
		}
	};

	return Preprocessor;
});