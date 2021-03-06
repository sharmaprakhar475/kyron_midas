! function o(c, u, a) {
    function d(t, e) {
        if (!u[t]) {
            if (!c[t]) {
                var n = "function" == typeof require && require;
                if (!e && n) return n(t, !0);
                if (s) return s(t, !0);
                var i = new Error("Cannot find module '" + t + "'");
                throw i.code = "MODULE_NOT_FOUND", i
            }
            var r = u[t] = {
                exports: {}
            };
            c[t][0].call(r.exports, function(e) {
                return d(c[t][1][e] || e)
            }, r, r.exports, o, c, u, a)
        }
        return u[t].exports
    }
    for (var s = "function" == typeof require && require, e = 0; e < a.length; e++) d(a[e]);
    return d
}({
    1: [function(i, e, t) {
        ! function(e, t, n) {
            for (t = i("../src/trackable.js"), n = (e.trackable || {}).q || []; n.length;) t.apply(t, n.shift());
            e.trackable = t
        }(window)
    }, {
        "../src/trackable.js": 2
    }],
    2: [function(e, t, n) {
        var i = e("./util");

        function r() {
            var e = [].slice.call(arguments),
                t = e.shift();
            if (r[t]) return r[t].apply(r, e)
        }
        r.init = function(e, t, n) {
            e && (r.id || (t = t || {}, n = n || {}, r.id = e, r.rootUrl = n.rootUrl || "https://web.chtbl.com", r.debug = n.debug, r.skipPixel = n.skipPixel, r.pixelSynced = !1, r.limitedPixel = n.limitedPixel, r.uid = i.getUID(), r.sid = i.getSID(), r.pvid = i.generateUUID(), r.initAndSync(t)))
        }, r.initAndSync = function(e) {
            i.getPixelSync() && r.pixelSync(), i.sendEvent(r, "init", e, ["pageType"], function(e) {
                var t = !e.eu_country_code;
                1 == t && r.pixelSync(), i.setPixelSync(t)
            })
        }, r.pixelSync = function(e) {
            if (!r.skipPixel && !r.pixelSynced) {
                r.pixelSynced = !0;
                var t = 1e16 * Math.random(),
                    n = document.createElement("img");
                n.height = "1", n.width = "1", n.style = "display:none", n.src = "https://idsync.rlcdn.com/710854.gif?partner_uid=" + r.uid + "&_rand=" + t
            }
        }, r.pageview = function(e) {
            r.pvid = i.generateUUID();
            i.sendEvent(r, "init", e, ["pageType"])
        }, r.identify = function(e) {
            i.sendEvent(r, "identify", e, ["userId"])
        }, r.rb_identify = function(e) {
            i.sendEvent(r, "rb_identify", e, ["userId"])
        }, r.code = function(e) {
            i.sendEvent(r, "code", e, ["code", "codeType"])
        }, r.addToCart = function(e) {
            i.sendEvent(r, "addToCart", e, ["productId", "value", "currency", "quantity"])
        }, r.checkout = function(e) {
            i.sendEvent(r, "checkout", e, ["id", "value", "currency", "tag"])
        }, r.purchase = function(e) {
            i.sendEvent(r, "purchase", e, ["id", "value", "currency", "tag"])
        }, r.lead = function(e) {
            i.sendEvent(r, "lead", e, ["id", "productId", "value", "currency", "quantity", "tag"])
        }, t.exports = r
    }, {
        "./util": 3
    }],
    3: [function(e, t, n) {
        "use strict";
        var a = {
                uid: "_wchtbl_uid",
                sid: "_wchtbl_sid",
                pixelSync: "_wchtbl_pixel_sync",
                doNotProcess: "_wchtbl_do_not_process"
            },
            i = !0;

        function d() {
            var e = "SameSite=Strict;";
            return i && (e += " Secure;"), e
        }

        function r() {
            var n = (new Date).getTime();
            return "undefined" != typeof performance && "function" == typeof performance.now && (n += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e) {
                var t = (n + 16 * Math.random()) % 16 | 0;
                return n = Math.floor(n / 16), ("x" === e ? t : 3 & t | 8).toString(16)
            })
        }

        function s(e) {
            var t = document.cookie.match(new RegExp(e + "=([^;]+)"));
            if (t) return t[1]
        }
        t.exports = {
            cookieKeys: a,
            generateUUID: r,
            getCookie: s,
            getUID: function() {
                var e = s(a.uid);
                e = e || r();
                var t = new Date;
                return t.setFullYear(t.getFullYear() + 1), document.cookie = a.uid + "=" + e + "; path=/; expires=" + t.toUTCString() + "; " + d(), e
            },
            getSID: function() {
                var e = s(a.sid);
                return e || (e = r(), document.cookie = a.sid + "=" + e + "; path=/; " + d(), e)
            },
            sendEvent: function(e, t, n, i, r) {
                if (! function() {
                        var e = s(a.doNotProcess);
                        return "1" == e || "0" != e && null
                    }()) {
                    var o, c = new XMLHttpRequest,
                        u = {};
                    for (o in u.uid = e.uid, u.pvid = e.pvid, u.sid = e.sid, u.action = t, u.id = e.id, u.context = {
                            url: window.location.href
                        }, u.properties = {}, n) i.includes(o) ? u.properties[o] = n[o] : console.log(t + " does not allow parameter " + o);
                    e.debug && console.log(u), c.open("POST", e.rootUrl + "/track", !0), c.onreadystatechange = function() {
                        if (4 == c.readyState && 200 == c.status) {
                            var e = JSON.parse(c.responseText);
                            ! function(e) {
                                var t = new Date,
                                    n = t.getTime();
                                n += 36e5, t.setTime(n);
                                var i = e ? "1" : "0";
                                document.cookie = a.doNotProcess + "=" + i + "; expires=" + t.toUTCString() + "; path=/; " + d()
                            }(e.do_not_process), r && r(e)
                        }
                    }, c.setRequestHeader("Content-type", "application/json;charset=UTF-8"), c.send(JSON.stringify(u))
                }
            },
            getPixelSync: function() {
                var e = s(a.pixelSync);
                return "1" == e || "0" != e && null
            },
            setPixelSync: function(e) {
                var t = new Date,
                    n = t.getTime();
                n += 36e5, t.setTime(n);
                var i = e ? "1" : "0";
                document.cookie = a.pixelSync + "=" + i + "; expires=" + t.toUTCString() + "; path=/; " + d()
            },
            setUseSecure: function(e) {
                i = e
            }
        }
    }, {}]
}, {}, [1]);