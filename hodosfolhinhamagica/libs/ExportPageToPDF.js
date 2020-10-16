jQuery.sap.declare("hodosovp.FolhaMagica.libs.ExportPageToPDF");

jQuery.sap.require("hodosovp.FolhaMagica.libs.jsPDF");
jQuery.sap.require("hodosovp.FolhaMagica.libs.html2canvas");
jQuery.sap.require("hodosovp.FolhaMagica.libs.canvg");

hodosovp.FolhaMagica.libs.ExportPageToPDF = {

	generate: function (Context) {
		this.context = Context;
		this.nodesToRemove = [];
		this.nodesToRestore = [];
		var oScroll = this.context.getView().byId("idScrollContainer"),
			barId = oScroll.getId(),
			aItems = oScroll.getContent().filter(function (panel) {
				return panel.getVisible();
			}),
			aPromises = [],
			today = this.today(),
			filename = "FolhaMagica" + "-" + today + "-" + this.context.getView().byId("fdCodVendedor").getValue() + ".pdf";

		var showFilterBarInEveryPage = false,
			format = "a4",
			orientation = "p",
			mymeType = "image/png",
			imageFormat = "PNG";
		var pdf = new jsPDF(orientation, 'px', format),
			bMissingOnfirst = true;
		// TODO you can set the title if you want, just uncomment the code below
		pdf.setProperties({
			title: 'Folhinha Mágica'
		});
		pdf.viewerPreferences({
			'DisplayDocTitle': true
		});

		//Add the filter bar for the user to know what's being filtered
		var oFilterPromise = $.Deferred().resolve(); //this.screenshotFilterBar(pdf);
		var that = this;
		var count = 0,
			height = 0;
		$.when(oFilterPromise)
			.done(function (oFilterImage) {

				var fPanelPicker = function (panel) {
					var sId = panel.getId(),
						oDefSVG = $.Deferred();

					$.when.apply($, that._replaceSVGs(sId))
						.done(function () {
							html2canvas(document.getElementById(sId))
								.then(function (ret) {
									oDefSVG.resolve(ret);
								})
								.catch(function () {
									oDefSVG.reject();
								});
						});
					// return html2canvas(document.getElementById(sId));
					return oDefSVG;
				};
				that.setMessageStripsVisibility(false);
				$.when.apply($, that._replaceVizFrames())
					.done(function () {
						aPromises = aItems.map(fPanelPicker);

						var addFilterBar = function () {
							return bMissingOnfirst;
						}; // || showFilterBarInEveryPage;
						//calibrate as you see fit
						var margin = 0.95,
							top = 12,
							left = 12,
							right = 420;
						var fAddCanvasToPDF = function () {
							var fAddImage = function (image) {
								var oScalledMeasures = that.scaleImage(image, pdf, aItems.length);

								switch (count) {
								case 0:
									height = oScalledMeasures.height - 50;
									break;
								case 1:
									height = oScalledMeasures.height + 70;
									break;
								case 2:
									height = oScalledMeasures.height + 50;
									break;
								case 3:
									height = oScalledMeasures.height + 120;
									break;
								case 4:
									height = oScalledMeasures.height + 100;
									break;
								case 5:
									height = oScalledMeasures.height + 160;
									break;
								case 6:
									height = oScalledMeasures.height + 80;
									break;
								}

								// if ((top + oScalledMeasures.height) > pdf.internal.pageSize.getHeight()) {
								if ((top + height) > pdf.internal.pageSize.getHeight()) {
									pdf.addPage(format, orientation);
									top = 12;
									bMissingOnfirst = true;
								}

								// if (addFilterBar()) {
								// 	pdf.addImage(oFilterImage.b64, imageFormat, left, top, pdf.internal.pageSize.getWidth(), oFilterImage.height);
								// 	top += oFilterImage.height;
								// 	bMissingOnfirst = false;
								// }

								// pdf.addImage(image.toDataURL(mymeType), imageFormat, left, top, oScalledMeasures.width, oScalledMeasures.height);
								pdf.addImage(image.toDataURL(mymeType), imageFormat, left, top, right, height);
								// top += oScalledMeasures.height;
								top += height;
								count += 1;
							};

							if (arguments) {
								for (var ix = 0; ix < arguments.length; ix++) {
									fAddImage(arguments[ix]);
								}
							}
							return $.Deferred().resolve();

						};
						// Promise.all(aPromises)
						$.when.apply($, aPromises)
							.then(fAddCanvasToPDF)
							.then(function () {
								pdf.save(filename);
								return $.Deferred().resolve();
							})
							.then(that._undo.bind(that))
							.fail(function (error) {
								jQuery.sap.log.error(error);
							});
					});
			});
	},

	today: function () {
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth() + 1;
		var yyyy = today.getFullYear();
		if (dd < 10) {
			dd = '0' + dd;
		}
		if (mm < 10) {
			mm = '0' + mm;
		}
		today = dd + '_' + mm + '_' + yyyy;
		return today;
	},

	scaleImage: function (canvas, pdf, length) {
		// this is the regular process to scale the image to the PDF's page width
		// const margin = 0.95;
		// let hRatio = canvas.height / canvas.width,
		// 	width = pdf.internal.pageSize.getWidth() * margin,
		// 	height = width * hRatio;
		// return {
		// 	width: width,
		// 	height: height
		// };
		var wRatio = canvas.width / canvas.height,
			//todo you might want to adjust as you see fit
			//you can also divide numberOfPanels by 2 if you see there's too much
			//panels in the same page
			numberOfPanels = length, // + 1, // +1 for the filter bar
			height = Math.min(pdf.internal.pageSize.getHeight() / numberOfPanels, canvas.height),
			width = height * wRatio;
		return {
			width: width,
			height: height
		};
	},

	screenshotFilterBar: function (pdf) {
		var mymeType = "image/png",
			imageFormat = "PNG",
			sId = "idFilter";

		var oControl = this.context.getView().byId(sId),
			oElement = document.getElementById(oControl.getId()),
			imageFilter = $.Deferred();
		html2canvas(oElement)
			.then(function (canvas) {
				//calibrate as you see fit
				var margin = 0.95;
				var hRatio = canvas.height / canvas.width,
					width = pdf.internal.pageSize.getWidth() * margin,
					height = width * hRatio,
					b64 = canvas.toDataURL(mymeType);

				imageFilter.resolve({
					height: height,
					b64: b64
				});
			})
			.catch(function (error) {
				jQuery.sap.log.error(error);
				imageFilter.reject();
			});

		return imageFilter;
	},

	_replaceVizFrames: function () {
		var aIds = ["gEncant", "gConversao", "gConvMedia", "idPerdasVendas"],
			that = this;
		return aIds.map(function (frameId) {
			var oControl = that.context.getView().byId(frameId),
				oDef = $.Deferred();
			if (oControl) {
				var parentNode = document.getElementById(oControl.getId());
				if (!parentNode) {
					return;
				}
				var oSVG = parentNode.querySelector("svg");
				if (oSVG) {
					//var sSVG = oControl.exportToSVGString();
					var sSVG = (new XMLSerializer()).serializeToString(oSVG);
					//replace the error in the css property
					sSVG = sSVG.replace(/translate /gm, "translate");
					//remove any diacritic
					sSVG = sSVG.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
					var canvas = document.createElement("canvas");

					var width = oSVG.width.baseVal.value,
						height = oSVG.height.baseVal.value,
						img = new Image(width, height);
					canvas.setAttribute("width", width);
					canvas.setAttribute("height", height);
					img.onload = function () {
						// draw the image onto the canvas
						canvas.getContext('2d').drawImage(img, 0, 0, width, height);
						oDef.resolve();
					};
					img.src = 'data:image/svg+xml;base64,'.concat(btoa(sSVG));

					that.nodesToRemove.push({
						node: canvas,
						parent: oSVG.parentNode
					});
					that.nodesToRestore.push({
						node: oSVG,
						parent: oSVG.parentNode
					});
					oSVG.parentNode.appendChild(canvas);
					oSVG.parentNode.removeChild(oSVG);
				}
			} else {
				oDef.reject();
			}
			return oDef;
		});
	},

	_replaceSVGs: function (sId) {
		var parentNode = document.getElementById(sId);
		var svgElem = parentNode.querySelectorAll("svg");
		var t = this;
		var aDef = [];

		svgElem.forEach(function (node, index) {
			var width = node.parentNode.clientWidth,
				height = node.parentNode.clientHeight,
				oDefSVGinner = $.Deferred();
			var svg = (new XMLSerializer()).serializeToString(node);
			if (!node.hasAttribute("style")) {
				node.setAttribute("width", width);
				node.setAttribute("height", height);

				// we have to overwrite the string
				svg = (new XMLSerializer()).serializeToString(node);
				var indexS = svg.indexOf(">") + 1;
				if (indexS !== 0) {
					svg = svg.substring(0, indexS).concat(t.buildCssStyles(node), svg.substring(indexS));
					svg = svg.replace("\"=\"", "").replace("\" font-size", "font-size");
				}
			}

			var canvas = document.createElement('canvas');
			canvas.setAttribute("width", width);
			canvas.setAttribute("height", height);

			var b64image = "data:image/svg+xml;base64," + btoa(svg);
			var img = new Image(width, height);
			img.onload = function () {
				// draw the image onto the canvas
				canvas.getContext('2d').drawImage(img, 0, 0, width, height);
				oDefSVGinner.resolve();
			};
			img.src = b64image;

			t.nodesToRemove.push({
				node: canvas,
				parent: node.parentNode
			});
			t.nodesToRestore.push({
				node: node,
				parent: node.parentNode
			});

			node.parentNode.appendChild(canvas);
			node.parentNode.removeChild(node);

			aDef.push(oDefSVGinner);

		});

		return aDef;
	},

	_undo: function () {
		this.nodesToRestore.forEach(function (elem) {
			elem.parent.appendChild(elem.node);
		});
		this.nodesToRemove.forEach(function (elem) {
			elem.parent.removeChild(elem.node);
		});
		this.setMessageStripsVisibility(true);
	},

	buildCssStyles: function (_node) {
		var res = '<style type="text/css">';

		for (var i = 0; i < _node.classList.length; i++) {
			res += this.getCssText(_node.classList[i]);
		}

		for (var k = 0; k < _node.children.length; k++) {
			for (var j = 0; j < _node.children[k].classList.length; j++) {
				res += this.getCssText(_node.children[k].classList[j]);
			}
		}

		res += '</style>';
		return res;
	},

	getCssText: function (_class) {
		for (var i = 0; i < document.styleSheets.length; i++) {
			if (!document.styleSheets[i].cssRules) {
				continue;
			}
			for (var j = 0; j < document.styleSheets[i].cssRules.length; j++) {
				if (document.styleSheets[i].cssRules[j] && document.styleSheets[i].cssRules[j].selectorText && document.styleSheets[i].cssRules[j].selectorText
					.includes("." + _class)) {
					return document.styleSheets[i].cssRules[j].cssText || "";
				}
			}
		}
		return "";
	},

	setMessageStripsVisibility: function (isVisible) {
		//sap.m.MessageStrip has a css class called sapUiPseudoInvisibleText
		//that is not rendered but it appears in the screenshots

		document.querySelectorAll(".sapUiPseudoInvisibleText")
			.forEach(function (elem) {
				elem.style.display = isVisible ? "" : "none";
			});
	}
};