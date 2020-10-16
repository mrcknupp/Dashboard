sap.ui.define(["sap/ovp/cards/charts/analytical/Component"], function (Component) {
	return Component.extend("hodos.hodosovp.ext.cards.donut.Component", {

		getCustomPreprocessor: function () {
			return {
				controls: {
					_syncSupport: true,
					preprocessor: "hodos.hodosovp.ext.cards.donut.Preprocessor"
				}

			};
		}
	});
});