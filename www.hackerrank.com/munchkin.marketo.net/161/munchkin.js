/*
 * Copyright (c) 2007-2018, Marketo, Inc. All rights reserved.
 * See https://developers.marketo.com/MunchkinLicense.pdf for license terms
 * Marketo marketing automation web activity tracking script
 * Version: 161 r862
 */
(function(m) {
    if (!m.MunchkinTracker) {
        var h = m.document,
            p = h.location,
            C = encodeURIComponent,
            y = !1,
            q = null,
            t = null,
            D = !1,
            v = null,
            E = [],
            u = function(b, a, c, d) {
                try {
                    var e = function() {
                        try {
                            c.apply(this, arguments)
                        } catch (a) {}
                    };
                    b.addEventListener ? b.addEventListener(a, e, d || !1) : b.attachEvent && b.attachEvent("on" + a, e);
                    E.push([b, a, e, d])
                } catch (f) {}
            },
            U = function(b, a, c, d) {
                try {
                    b.removeEventListener ? b.removeEventListener(a, c, d || !1) : b.detachEvent && b.detachEvent("on" + a, c)
                } catch (e) {}
            },
            e = function(b) {
                return "undefined" !== typeof b && null !==
                    b
            },
            F = function(b, a) {
                return b.className.match(RegExp("(\\s|^)" + a + "(\\s|$)"))
            },
            V = e(m.XMLHttpRequest) && e((new m.XMLHttpRequest).withCredentials),
            s = function(b) {
                var a = null,
                    c;
                if (e(b))
                    if (0 === b.length) a = "";
                    else try {
                        a = decodeURIComponent(b)
                    } catch (d) {
                        c = b.indexOf("?");
                        if (-1 !== c) try {
                            a = decodeURIComponent(b.substr(0, c)) + b.substr(c)
                        } catch (g) {}
                        e(a) || (a = String(b))
                    }
                return a
            },
            G = function(b, a) {
                var c = {},
                    d = e(a) ? a : "=",
                    g = b.split("&"),
                    f = g.length,
                    h, n, m;
                for (h = 0; h < f; h += 1) n = g[h].split(d), e(n) && 1 < n.length && (m = n.shift(), n = n.join(d),
                    c[s(m)] = s(n));
                return c
            },
            H = function(b) {
                try {
                    var a = h.createElement("a");
                    a.href = b;
                    return G(a.search.substr(1))
                } catch (c) {
                    return null
                }
            },
            I = function(b, a) {
                var c = null,
                    d = [];
                if (e(b))
                    for (c in b) b.hasOwnProperty(c) && "function" !== typeof b[c] && null !== b[c] && d.push(C(c) + (e(a) ? a : "=") + C(b[c]));
                return d.join("&")
            },
            J = function(b, a) {
                var c = null;
                if (e(a) && e(b))
                    for (c in b) b.hasOwnProperty(c) && e(a[c]) && (b[c] = a[c])
            },
            K = function(b, a, c) {
                var d = b.split("."),
                    g = d.length,
                    f = 2;
                if (e(a)) f = a;
                else if (e(c) && c) "com" !== d[g - 1] && (a = RegExp("^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$"),
                    4 === g && a.test(b) ? f = 4 : 2 === d[g - 1].length && 1 < g && "co" === d[g - 2] && (f = 3));
                else if (2 < d[g - 1].length) f = 2;
                else if (2 === d[g - 1].length) f = 3;
                else return b;
                for (; d.length > f && 2 < d.length;) d.shift();
                return d.join(".")
            },
            w = function(b) {
                var a = h.cookie,
                    c, d, g = {
                        id: null,
                        token: null
                    };
                b = C(b);
                g.store = function(a, c, d, e) {
                    var g = b + "=" + I(this, ":"),
                        f = new Date;
                    0 < a ? f.setTime(f.getTime() + 864E5 * a) : f.setTime(f.getTime() - 1);
                    g += "; expires=" + f.toGMTString();
                    c && (g += "; path=" + c);
                    d && -1 !== d.indexOf(".") && (g += "; domain=" + d);
                    e && (g += "; secure");
                    h.cookie =
                        g
                };
                if ("" !== a)
                    for (a = a.split(";"), c = 0; c < a.length; c += 1)
                        if (d = a[c].replace(/^\s+|\s+$/g, ""), 0 === d.indexOf(b + "=")) {
                            a = d.substring(b.length + 1);
                            c = G(a);
                            e(c.id) && e(c.token) ? J(g, c) : J(g, G(a, ":"));
                            break
                        }
                return g
            },
            f = {
                customName: null,
                notifyPrefix: null,
                wsInfo: null,
                altIds: [],
                visitorToken: null,
                cookieLifeDays: 730,
                clickTime: 350,
                cookieAnon: !0,
                mkt_tok: null,
                domainLevel: null,
                domainSelectorV2: !1,
                replayDetectLimit: 5E3,
                httpsOnly: !1,
                asyncOnly: !1,
                useBeaconAPI: !0,
                anonymizeIP: !1,
                apiOnly: !1,
                externalSource: null,
                orgId: null,
                _ecid: null,
                _itpMitigationForAll: !1
            },
            k = null,
            l = null,
            W = m.navigator.cookieEnabled || h.hasOwnProperty("cookie") && (0 < h.cookie.length || -1 < (h.cookie = "testcookie=test; max-age=10000").indexOf.call(h.cookie, "testcookie=test;")),
            z = !1,
            A = [],
            L = null,
            X = function(b, a, c) {
                var d = new m.XMLHttpRequest;
                d.open("GET", b, !0 !== a);
                d.onreadystatechange = function() {
                    2 <= d.readyState && d.abort()
                };
                if (a) try {
                    d.timeout = c
                } catch (e) {}
                try {
                    d.send()
                } catch (f) {}
            },
            P = function(b, a, c, d, e) {
                b = b + a + "&" + I(c) + "&" + I(d);
                f.useBeaconAPI && window.navigator && window.navigator.sendBeacon ?
                    window.navigator.sendBeacon(b) : (c = (new Date).getTime(), e = !e && !f.asyncOnly, 0 === a.indexOf("webevents/visitWebPage?") && (e = !1), V ? X(b, e, f.clickTime) : (new m.Image(1, 1)).src = b, L = c + f.clickTime)
            },
            Y = function() {
                var b;
                return function(a, c) {
                    var d = {
                        x: a.clientX,
                        y: a.clientY,
                        el: c,
                        time: (new Date).getTime()
                    };
                    if (e(b) && d.x === b.x && d.y === b.y && d.el === b.el && d.time < b.time + f.replayDetectLimit) return !0;
                    b = d;
                    return !1
                }
            }(),
            Q = function() {
                var b = h.getElementsByName("_mkt_trk"),
                    a = 0,
                    c = "";
                e(l) && (c = "id:" + l.id + "&token:" + l.token);
                for (a = 0; a <
                    b.length; a += 1) "hidden" === b[a].type && (b[a].value = c)
            },
            x = function(b, a, c, d) {
                var g = null,
                    h;
                h = p.hostname;
                var m = p.protocol,
                    n = "webevents/" + b;
                if (z) {
                    var k;
                    if (k = window.navigator) a: {
                        k = window.navigator.userAgent;
                        if ("string" === typeof k && k) {
                            if (0 <= k.indexOf("AdsBot") || 0 <= k.indexOf("Wget") || 0 <= k.indexOf("msnbot")) {
                                k = !0;
                                break a
                            }
                            if (0 <= k.indexOf("Mozilla") && (0 <= k.indexOf("slurp") || 0 <= k.indexOf("bot"))) {
                                k = !0;
                                break a
                            }
                        }
                        k = !1
                    }
                    if (!k && e(l) && (a._mchId = l.id, a._mchTk = l.token, e(f.mkt_tok) && (a.mkt_tok = f.mkt_tok), e(f.wsInfo) && (a._mchWs =
                            f.wsInfo), "clickLink" === b && (a._mchCn = e(f.customName) ? f.customName : ""), a._mchHo = h, a._mchPo = p.port, e(a._mchRu) || (a._mchRu = s(p.pathname)), a._mchPc = m, a._mchVr = "161", e(h) && 0 !== h.length && "file:" !== m))
                        for (g in f.anonymizeIP && (a.aip = 1), e(f.externalSource) && (a._mchEs = f.externalSource), e(v) && (a._mchEcid = v), n += "?_mchNc=" + (new Date).getTime(), P(f.notifyPrefix, n, a, c, d), f.altIds) f.altIds.hasOwnProperty(g) && (h = f.altIds[g], a._mchId = h, P(f.notifyPrefix.replace(/\w{3}\-\w{3}\-\w{3}\.mktoresp\.com/i, h + ".mktoresp.com"),
                            n, a, c, d))
                } else A.push(["post", arguments])
            },
            R = function(b) {
                var a = b || m.event,
                    c = a.target || a.srcElement,
                    d = {},
                    f;
                f = a.which;
                var k = a.button;
                f = e(f) && (1 === f || 2 === f) || e(k) && (0 === k || 1 === k || 4 === k) ? !0 : !1;
                if (f && !a._mchDone) {
                    a._mchDone = !0;
                    a = c;
                    f = p.href || p;
                    for (-1 < f.indexOf("#") && (f = f.substring(0, f.indexOf("#")));
                        "A" !== a.tagName && "AREA" !== a.tagName && e(a.parentNode);) a = a.parentNode;
                    a === h || a === m || "A" !== a.tagName && "AREA" !== a.tagName ? a = null : (c = a.href.replace(/^\s+|\s+$/g, ""), a = e(c) && 0 < c.length && 0 !== c.indexOf("#") && 0 !== c.indexOf(f +
                        "#") && 0 !== c.indexOf("javascript") && 0 !== c.indexOf("mailto") && !F(a, "mchNoDecorate") ? a : null);
                    e(a) && !Y(b, a) && (d._mchHr = s(a.href), x("clickLink", d))
                }
            },
            B = function(b) {
                if (z) {
                    if (null !== l) return l;
                    var a = K(p.hostname, f.domainLevel, f.domainSelectorV2),
                        c = w("_mkto_trk"),
                        d = !1 !== f.httpsOnly;
                    if (e(c.id) || f.cookieAnon || b) {
                        if (c.id = k, e(c.token) || (e(f.visitorToken) && "VISITOR_MKTTOK_REPLACE" !== f.visitorToken ? c.token = f.visitorToken : c.token = "_mch-" + a + "-" + (new Date).getTime() + "-" + (Math.floor(9E4 * Math.random()) + 1E4)), c.store(f.cookieLifeDays,
                                "/", a, d), d && (c = w("_mkto_trk")), !d || e(c.id)) return l = c, Q(), c
                    } else return null
                } else A.push(["createTrackingCookie", arguments])
            },
            S = function() {
                B(!0)
            },
            Z = function(b) {
                var a = b.onclick;
                b.onclick = "function" === typeof a ? function() {
                    S.apply(b, arguments);
                    return a.apply(b, arguments)
                } : S
            },
            M = function(b) {
                var a = K(p.hostname, f.domainLevel, f.domainSelectorV2),
                    c = w("mkto_opt_out"),
                    d = !1 !== f.httpsOnly;
                b ? (c.id = !0, c.store(730, "/", a, d), b = w("_mkto_trk"), b.id && b.store(0, "/", a, d)) : c.store(0, "/", a, d)
            },
            T = function() {
                y && e(t) && D ? window.fetch("https://" +
                    t + "/getCookie?_mchId=" + k + "&_mchTd=" + q, {
                        credentials: "include"
                    }).then(function(b) {
                    window.localStorage.setItem("_mktoGetCookie_" + k + "_" + q, Date.now());
                    if (b.ok) return b.body;
                    throw Error("status ${response.status}");
                })["catch"](function(b) {
                    window.console.warn("getCookie failed - ", b);
                    window.localStorage.removeItem("_mktoLpDomain_" + k + "_" + q);
                    window.localStorage.removeItem("_mktoSecureLp_" + k);
                    window.localStorage.removeItem("_mktoGetCookie_" + k + "_" + q);
                    t = null
                })["finally"](N) : N()
            },
            N = function() {
                if (!z) {
                    z = !0;
                    var b =
                        B(e(f.mkt_tok)),
                        a, c;
                    c = {};
                    for (var d = {}; 0 < A.length;) switch (a = A.shift(), a[0]) {
                        case "createTrackingCookie":
                            b = B.apply(h, a[1]);
                            break;
                        case "post":
                            x.apply(h, a[1])
                    }
                    if (e(f._ecid)) v = f._ecid;
                    else a: {
                        a = f.orgId;
                        if (e(window.Visitor) && e(a)) try {
                            var g = window.Visitor.getInstance(a);
                            if (e(g)) {
                                v = a + ":" + g.getLocationHint() + ":" + g.getMarketingCloudVisitorID();
                                break a
                            }
                        } catch (k) {}
                        for (var g = RegExp("AMCV_([A-Za-z0-9]+%40AdobeOrg)=([^;]+)", "g"), r, n = []; null !== (r = g.exec(h.cookie));) {
                            var q = decodeURIComponent(r[1]),
                                l;
                            e(a) && q !== a ||
                                null === (l = /MCMID%7C([^%]+)/.exec(r[2])) || (r = /MCAAMLH-[^%]+%7C([0-9]+)/.exec(r[2]), n.push(q + ":" + (e(r) ? r[1] : "") + ":" + l[1]))
                        }
                        v = n.join(";")
                    }
                    if (e(b)) f.apiOnly || (c._mchCn = e(f.customName) ? f.customName : "", d._mchHa = s(p.hash), d._mchRe = s(h.referrer), d._mchQp = s(p.search.substr(1).replace(/&/g, "__-__")), x("visitWebPage", c, d, !0));
                    else if (!(f.cookieAnon || e(m.Mkto) && e(m.Mkto.formSubmit))) {
                        b = [];
                        c = h.forms;
                        d = c.length;
                        for (l = 0; l < d; l += 1)
                            if (F(c[l], "lpeRegForm"))
                                for (g = c[l].elements, n = g.length, a = 0; a < n; a += 1) "submit" !== g[a].type ||
                                    F(g[a], "mchNoDecorate") || b.push(g[a]);
                        for (c = 0; c < b.length; c += 1) Z(b[c])
                    }
                }
            },
            O = {
                CLICK_LINK: "clickLink",
                VISIT_WEB_PAGE: "visitWebPage",
                init: function(b, a) {
                    if (W && e(b) && 0 !== b.length) {
                        k = b;
                        k = k.toUpperCase();
                        var c = "",
                            d, g, l;
                        d = H(m.location.toString());
                        var r = null;
                        f.notifyPrefix = p.protocol + "//" + k + ".mktoresp.com/";
                        e(a) && (window.console.debug('Munchkin.init("%s") options:', b, a), J(f, a));
                        e(d) && (e(d.mkt_tok) && (f.mkt_tok = d.mkt_tok), e(d.lpview) && (c = d.lpview), e(d.marketo_opt_out) && (r = d.marketo_opt_out));
                        if (!e(f.mkt_tok))
                            if (d =
                                H(h.referrer), e(d.mkt_tok)) f.mkt_tok = d.mkt_tok;
                            else if (e(d.enid) && e(d.type))
                            for (l in d) d.hasOwnProperty(l) && "enid" !== l && "type" !== l && (-1 < l.indexOf("mkt_tok") || -1 < d[l].indexOf("mkt_tok")) && (g = H(l + "=" + d[l]), e(g.mkt_tok) && (f.mkt_tok = g.mkt_tok));
                        if ("preview" !== c || !/\/lpeditor\/preview$/.test(p.pathname)) {
                            if (null === r) {
                                if (c = w("mkto_opt_out"), e(c.id)) {
                                    M(!0);
                                    return
                                }
                            } else {
                                if ("true" === r) {
                                    M(!0);
                                    return
                                }
                                "false" === r && M(!1)
                            }
                            l = window.navigator.userAgent.toLowerCase();
                            c = -1 < l.indexOf("safari");
                            l = / version\/([0-9]+.[0-9]+)/.exec(l);
                            y = c && l && 12.1 <= parseFloat(l[1]) || f._itpMitigationForAll;
                            q = K(p.hostname, f.domainLevel, f.domainSelectorV2);
                            t = window.localStorage.getItem("_mktoLpDomain_" + k + "_" + q);
                            e(t) && -1 < h.cookie.indexOf("_mkto_trk=") && (c = window.localStorage.getItem("_mktoGetCookie_" + k + "_" + q)) && 828E5 > Date.now() - c && (y = !1);
                            y && window.fetch ? (D = "true" === window.localStorage.getItem("_mktoSecureLp_" + k), e(t) ? T() : window.fetch(p.protocol + "//" + k + ".mktoutil.com/mktoutil/lpDomain?_mchId=" + k + "&_mchTd=" + q).then(function(a) {
                                if (a.ok) return a.json();
                                throw Error("status ${response.status}");
                            })["catch"](function(a) {
                                window.console.warn("getLpDomain failed - ", a)
                            }).then(function(a) {
                                e(a) && e(a.domain) && (window.localStorage.setItem("_mktoLpDomain_" + k + "_" + q, t = a.domain), window.localStorage.setItem("_mktoSecureLp_" + k, D = a.isSecure))
                            })["finally"](T)) : N()
                        }
                    }
                },
                munchkinFunction: function(b, a) {
                    var c = {},
                        d = {};
                    switch (b) {
                        case "clickLink":
                            e(a.href) && (c._mchHr = c._mchLr = a.href, x("clickLink", c));
                            break;
                        case "visitWebPage":
                            e(a.url) && (c._mchRu = a.url), e(a.params) && (c._mchQp =
                                a.params), e(a.name) && (c._mchCn = a.name), d._mchRe = s(h.referrer), x("visitWebPage", c, d)
                    }
                },
                createTrackingCookie: function(b) {
                    B(b)
                }
            };
        Date.prototype.getTimeAlias = Date.prototype.getTime;
        u(m, "beforeunload", function() {
            for (var b; 0 < E.length;) b = E.shift(), U.apply(this, b);
            if (e(L)) {
                do b = new Date; while (b.getTimeAlias() < L)
            }
        });
        u(h, "click", R, !0);
        (function(b) {
            var a = !1,
                c = !0,
                d = h.documentElement,
                e = function(c) {
                    "readystatechange" === c.type && "complete" !== h.readyState || a || (a = !0, b.call(m, c.type || c))
                },
                f = null,
                f = function() {
                    try {
                        d.doScroll("left")
                    } catch (a) {
                        m.setTimeout(f,
                            50);
                        return
                    }
                    e("poll")
                };
            if ("complete" === h.readyState) b.call(m, "lazy");
            else {
                if (h.createEventObject && d.doScroll) {
                    try {
                        c = !m.frameElement
                    } catch (k) {}
                    c && f()
                }
                u(h, "DOMContentLoaded", e);
                u(h, "readystatechange", e);
                u(m, "load", e)
            }
        })(function() {
            Q();
            var b = 0;
            if (e(h.links))
                for (b = 0; b < h.links.length; b += 1) u(h.links[b], "click", R, !0)
        });
        m.MunchkinTracker = m.Munchkin = O;
        m.mktoMunchkin = O.init;
        m.mktoMunchkinFunction = O.munchkinFunction
    }
})(window);