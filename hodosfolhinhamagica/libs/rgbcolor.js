! function (e) {
	function f(e) {
		this.ok = !1, "#" == e.charAt(0) && (e = e.substr(1, 6)), e = (e = e.replace(/ /g, "")).toLowerCase();
		var a = {
			aliceblue: "f0f8ff",
			antiquewhite: "faebd7",
			aqua: "00ffff",
			aquamarine: "7fffd4",
			azure: "f0ffff",
			beige: "f5f5dc",
			bisque: "ffe4c4",
			black: "000000",
			blanchedalmond: "ffebcd",
			blue: "0000ff",
			blueviolet: "8a2be2",
			brown: "a52a2a",
			burlywood: "deb887",
			cadetblue: "5f9ea0",
			chartreuse: "7fff00",
			chocolate: "d2691e",
			coral: "ff7f50",
			cornflowerblue: "6495ed",
			cornsilk: "fff8dc",
			crimson: "dc143c",
			cyan: "00ffff",
			darkblue: "00008b",
			darkcyan: "008b8b",
			darkgoldenrod: "b8860b",
			darkgray: "a9a9a9",
			darkgreen: "006400",
			darkkhaki: "bdb76b",
			darkmagenta: "8b008b",
			darkolivegreen: "556b2f",
			darkorange: "ff8c00",
			darkorchid: "9932cc",
			darkred: "8b0000",
			darksalmon: "e9967a",
			darkseagreen: "8fbc8f",
			darkslateblue: "483d8b",
			darkslategray: "2f4f4f",
			darkturquoise: "00ced1",
			darkviolet: "9400d3",
			deeppink: "ff1493",
			deepskyblue: "00bfff",
			dimgray: "696969",
			dodgerblue: "1e90ff",
			feldspar: "d19275",
			firebrick: "b22222",
			floralwhite: "fffaf0",
			forestgreen: "228b22",
			fuchsia: "ff00ff",
			gainsboro: "dcdcdc",
			ghostwhite: "f8f8ff",
			gold: "ffd700",
			goldenrod: "daa520",
			gray: "808080",
			green: "008000",
			greenyellow: "adff2f",
			honeydew: "f0fff0",
			hotpink: "ff69b4",
			indianred: "cd5c5c",
			indigo: "4b0082",
			ivory: "fffff0",
			khaki: "f0e68c",
			lavender: "e6e6fa",
			lavenderblush: "fff0f5",
			lawngreen: "7cfc00",
			lemonchiffon: "fffacd",
			lightblue: "add8e6",
			lightcoral: "f08080",
			lightcyan: "e0ffff",
			lightgoldenrodyellow: "fafad2",
			lightgrey: "d3d3d3",
			lightgreen: "90ee90",
			lightpink: "ffb6c1",
			lightsalmon: "ffa07a",
			lightseagreen: "20b2aa",
			lightskyblue: "87cefa",
			lightslateblue: "8470ff",
			lightslategray: "778899",
			lightsteelblue: "b0c4de",
			lightyellow: "ffffe0",
			lime: "00ff00",
			limegreen: "32cd32",
			linen: "faf0e6",
			magenta: "ff00ff",
			maroon: "800000",
			mediumaquamarine: "66cdaa",
			mediumblue: "0000cd",
			mediumorchid: "ba55d3",
			mediumpurple: "9370d8",
			mediumseagreen: "3cb371",
			mediumslateblue: "7b68ee",
			mediumspringgreen: "00fa9a",
			mediumturquoise: "48d1cc",
			mediumvioletred: "c71585",
			midnightblue: "191970",
			mintcream: "f5fffa",
			mistyrose: "ffe4e1",
			moccasin: "ffe4b5",
			navajowhite: "ffdead",
			navy: "000080",
			oldlace: "fdf5e6",
			olive: "808000",
			olivedrab: "6b8e23",
			orange: "ffa500",
			orangered: "ff4500",
			orchid: "da70d6",
			palegoldenrod: "eee8aa",
			palegreen: "98fb98",
			paleturquoise: "afeeee",
			palevioletred: "d87093",
			papayawhip: "ffefd5",
			peachpuff: "ffdab9",
			peru: "cd853f",
			pink: "ffc0cb",
			plum: "dda0dd",
			powderblue: "b0e0e6",
			purple: "800080",
			red: "ff0000",
			rosybrown: "bc8f8f",
			royalblue: "4169e1",
			saddlebrown: "8b4513",
			salmon: "fa8072",
			sandybrown: "f4a460",
			seagreen: "2e8b57",
			seashell: "fff5ee",
			sienna: "a0522d",
			silver: "c0c0c0",
			skyblue: "87ceeb",
			slateblue: "6a5acd",
			slategray: "708090",
			snow: "fffafa",
			springgreen: "00ff7f",
			steelblue: "4682b4",
			tan: "d2b48c",
			teal: "008080",
			thistle: "d8bfd8",
			tomato: "ff6347",
			turquoise: "40e0d0",
			violet: "ee82ee",
			violetred: "d02090",
			wheat: "f5deb3",
			white: "ffffff",
			whitesmoke: "f5f5f5",
			yellow: "ffff00",
			yellowgreen: "9acd32"
		};
		for (var r in a) e == r && (e = a[r]);
		for (var t = [{
				re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
				example: ["rgb(123, 234, 45)", "rgb(255,234,245)"],
				process: function (e) {
					return [parseInt(e[1]), parseInt(e[2]), parseInt(e[3])]
				}
			}, {
				re: /^(\w{2})(\w{2})(\w{2})$/,
				example: ["#00ff00", "336699"],
				process: function (e) {
					return [parseInt(e[1], 16), parseInt(e[2], 16), parseInt(e[3], 16)]
				}
			}, {
				re: /^(\w{1})(\w{1})(\w{1})$/,
				example: ["#fb0", "f0f"],
				process: function (e) {
					return [parseInt(e[1] + e[1], 16), parseInt(e[2] + e[2], 16), parseInt(e[3] + e[3], 16)]
				}
			}], d = 0; d < t.length; d++) {
			var n = t[d].re,
				i = t[d].process,
				l = n.exec(e);
			l && (channels = i(l), this.r = channels[0], this.g = channels[1], this.b = channels[2], this.ok = !0)
		}
		this.r = this.r < 0 || isNaN(this.r) ? 0 : this.r > 255 ? 255 : this.r, this.g = this.g < 0 || isNaN(this.g) ? 0 : this.g > 255 ? 255 :
			this.g, this.b = this.b < 0 || isNaN(this.b) ? 0 : this.b > 255 ? 255 : this.b, this.toRGB = function () {
				return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")"
			}, this.toHex = function () {
				var e = this.r.toString(16),
					f = this.g.toString(16),
					a = this.b.toString(16);
				return 1 == e.length && (e = "0" + e), 1 == f.length && (f = "0" + f), 1 == a.length && (a = "0" + a), "#" + e + f + a
			}, this.getHelpXML = function () {
				for (var e = new Array, r = 0; r < t.length; r++)
					for (var d = t[r].example, n = 0; n < d.length; n++) e[e.length] = d[n];
				for (var i in a) e[e.length] = i;
				var l = document.createElement("ul");
				l.setAttribute("id", "rgbcolor-examples");
				for (r = 0; r < e.length; r++) try {
					var o = document.createElement("li"),
						s = new f(e[r]),
						c = document.createElement("div");
					c.style.cssText = "margin: 3px; border: 1px solid black; background:" + s.toHex() + "; color:" + s.toHex(), c.appendChild(document.createTextNode(
						"test"));
					var b = document.createTextNode(" " + e[r] + " -> " + s.toRGB() + " -> " + s.toHex());
					o.appendChild(c), o.appendChild(b), l.appendChild(o)
				} catch (e) {}
				return l
			}
	}
	"undefined" != typeof define && define.amd ? define(function () {
		return f
	}) : "undefined" != typeof module && module.exports && (module.exports = f), e.RGBColor = f
}("undefined" != typeof window ? window : this);