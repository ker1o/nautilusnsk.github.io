/*
* Braze Web SDK v4.7.1
* (c) Braze, Inc. 2023 - http://braze.com
* License available at https://github.com/braze-inc/braze-web-sdk/blob/master/LICENSE
* Compiled on 2023-05-11
*/
'use strict';
const k = {
    P: function(a) {
        var b = "=".repeat((4 - a.length % 4) % 4);
        a = (a + b).replace(/\-/g, "+").replace(/_/g, "/");
        a = atob(a);
        b = new Uint8Array(a.length);
        for (let c = 0; c < a.length; ++c)
            b[c] = a.charCodeAt(c);
        return b
    }
};
const l = {
    H: ()=>{
        const a = b=>{
            const c = (Math.random().toString(16) + "000000000").substr(2, 8);
            return b ? "-" + c.substr(0, 4) + "-" + c.substr(4, 4) : c
        }
        ;
        return a() + a(!0) + a(!0) + a()
    }
};
function q(a) {
    if ("indexedDB"in a.G)
        return a.G.indexedDB
}
function r(a) {
    try {
        if (null == q(a))
            return !1;
        const b = q(a).open("Braze IndexedDB Support Test");
        b.onupgradeneeded = ()=>b.result.close();
        b.onsuccess = ()=>b.result.close();
        if ("undefined" !== typeof window) {
            const c = window.ra || window.qa || window.ta;
            if (c && c.O && c.O.id)
                return a.j.info("Not using IndexedDB for storage because we are running inside an extension"),
                !1
        }
        return !0
    } catch (b) {
        return a.j.info("Not using IndexedDB for storage due to following error: " + b),
        !1
    }
}
function t(a, b, c) {
    const f = q(a).open(a.h.l, a.h.VERSION);
    if (null == f)
        return "function" === typeof c && c(),
        !1;
    f.onupgradeneeded = e=>{
        a.j.info("Upgrading indexedDB " + a.h.l + " to v" + a.h.VERSION + "...");
        e = e.target.result;
        for (const d in a.h.g)
            a.h.g.hasOwnProperty(d) && !e.objectStoreNames.contains(a.h.g[d]) && e.createObjectStore(a.h.g[d])
    }
    ;
    f.onsuccess = e=>{
        const d = e.target.result;
        d.onversionchange = ()=>{
            d.close();
            "function" === typeof c && c();
            a.j.error("Needed to close the database unexpectedly because of an upgrade in another tab")
        }
        ;
        b(d)
    }
    ;
    f.onerror = e=>{
        a.j.info("Could not open indexedDB " + a.h.l + " v" + a.h.VERSION + ": " + e.target.errorCode);
        "function" === typeof c && c();
        return !0
    }
    ;
    return !0
}
function w(a, b, c, f) {
    r(a) ? t(a, e=>{
        if (e.objectStoreNames.contains(b)) {
            var d = e.transaction([b], "readonly");
            d.oncomplete = ()=>e.close();
            d = d.objectStore(b).openCursor(null, "prev");
            d.onerror = ()=>{
                a.j.error("Could not open cursor for " + b + " on indexedDB " + a.h.l);
                "function" === typeof f && f()
            }
            ;
            d.onsuccess = g=>{
                g = g.target.result;
                null != g && null != g.value && null != g.key ? c(g.key, g.value) : "function" === typeof f && f()
            }
        } else
            a.j.error("Could not retrieve last record from " + b + " on indexedDB " + a.h.l + " - " + b + " is not a valid objectStore"),
            "function" === typeof f && f(),
            e.close()
    }
    , f) : "function" === typeof f && f()
}
class x {
    constructor(a, b) {
        this.G = "undefined" === typeof window ? self : window;
        this.h = a;
        this.j = b
    }
    setItem(a, b, c, f, e) {
        if (!r(this))
            return "function" === typeof e && e(),
            !1;
        const d = this;
        return t(this, g=>{
            if (g.objectStoreNames.contains(a)) {
                var h = g.transaction([a], "readwrite");
                h.oncomplete = ()=>g.close();
                h = h.objectStore(a).put(c, b);
                h.onerror = ()=>{
                    d.j.error("Could not store object " + b + " in " + a + " on indexedDB " + d.h.l);
                    "function" === typeof e && e()
                }
                ;
                h.onsuccess = ()=>{
                    "function" === typeof f && f()
                }
            } else
                d.j.error("Could not store object " + b + " in " + a + " on indexedDB " + d.h.l + " - " + a + " is not a valid objectStore"),
                "function" === typeof e && e(),
                g.close()
        }
        , e)
    }
    getItem(a, b, c) {
        if (!r(this))
            return !1;
        const f = this;
        return t(this, e=>{
            if (e.objectStoreNames.contains(a)) {
                var d = e.transaction([a], "readonly");
                d.oncomplete = ()=>e.close();
                d = d.objectStore(a).get(b);
                d.onerror = ()=>{
                    f.j.error("Could not retrieve object " + b + " in " + a + " on indexedDB " + f.h.l)
                }
                ;
                d.onsuccess = g=>{
                    g = g.target.result;
                    null != g && c(g)
                }
            } else
                f.j.error("Could not retrieve object " + b + " in " + a + " on indexedDB " + f.h.l + " - " + a + " is not a valid objectStore"),
                e.close()
        }
        )
    }
    clearData() {
        if (!r(this))
            return !1;
        const a = [];
        for (const c in this.h.g)
            this.h.g.hasOwnProperty(c) && this.h.g[c] !== this.h.g.C && a.push(this.h.g[c]);
        const b = this;
        return t(this, function(c) {
            const f = c.transaction(a, "readwrite");
            f.oncomplete = ()=>c.close();
            for (let e = 0; e < a.length; e++)
                f.objectStore(a[e]).clear().onerror = function() {
                    b.j.error("Could not clear " + this.source.name + " on indexedDB " + b.h.l)
                }
                ;
            f.onerror = function() {
                b.j.error("Could not clear object stores on indexedDB " + b.h.l)
            }
        })
    }
}
;const y = {
    B: function(a) {
        if (void 0 !== a || void 0 === y.o)
            y.o = !!a;
        y.F || (y.F = !0)
    },
    sa: function() {
        y.F = !1;
        y.o = void 0;
        y.j = void 0
    },
    ua: function(a) {
        "function" !== typeof a ? y.info("Ignoring setLogger call since logger is not a function") : (y.B(),
        y.j = a)
    },
    va: function() {
        y.B();
        y.o ? (console.log("Disabling Braze logging"),
        y.o = !1) : (console.log("Enabled Braze logging"),
        y.o = !0)
    },
    info: function(a) {
        y.o && (a = "Braze: " + a,
        null != y.j ? y.j(a) : console.log(a))
    },
    warn: function(a) {
        y.o && (a = "Braze SDK Warning: " + a + " (v4.7.1)",
        null != y.j ? y.j(a) : console.warn(a))
    },
    error: function(a) {
        y.o && (a = "Braze SDK Error: " + a + " (v4.7.1)",
        null != y.j ? y.j(a) : console.error(a))
    }
};
var z = {
    CustomEvent: "ce",
    ga: "p",
    M: "pc",
    L: "ca",
    ia: "i",
    ha: "ie",
    W: "cci",
    X: "ccic",
    U: "ccc",
    V: "ccd",
    oa: "ss",
    na: "se",
    fa: "si",
    da: "sc",
    ca: "sbc",
    ea: "sfe",
    Y: "iec",
    la: "lr",
    R: "uae",
    T: "ci",
    S: "cc",
    ja: "lcaa",
    ka: "lcar",
    $: "inc",
    Z: "add",
    aa: "rem",
    ba: "set",
    ma: "ncam",
    pa: "sgu"
}
  , A = x
  , B = {
    m: {
        l: "AppboyServiceWorkerAsyncStorage",
        VERSION: 6,
        g: {
            s: "data",
            K: "pushClicks",
            D: "pushSubscribed",
            A: "fallbackDevice",
            I: "cardUpdates",
            C: "optOut",
            J: "pendingData",
            N: "sdkAuthenticationSignature"
        },
        v: 1
    }
}
  , E = y;
function F() {
    return new Promise(function(a, b) {
        const c = B.m;
        w(new A(c,E), c.g.C, b, a)
    }
    )
}
;function G() {
    return new Promise(a=>{
        const b = B.m;
        w(new A(b,E), b.g.N, (c,f)=>{
            a(f)
        }
        , ()=>{
            a(null)
        }
        )
    }
    )
}
function H(a, b, c) {
    E.info(`${b} due to SDK Authentication failure with error code ${c.error_code}. The data will be logged on the user's next session start.`);
    b = B.m;
    (new A(b,E)).setItem(b.g.J, l.H(), a)
}
;function I(a, b, c) {
    return new Promise(function(f, e) {
        const d = {};
        d.time = Math.floor((new Date).valueOf() / 1E3);
        d.device_id = c;
        d.api_key = a;
        d.sdk_version = "4.7.1";
        d.sdk_flavor = "amp";
        d.respond_with = {
            config: {
                config_time: 0
            }
        };
        fetch(b + "/data/", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "X-Braze-Api-Key": a
            },
            body: JSON.stringify(d)
        }).then(function(g) {
            g.ok || E.error("Unable to get config: " + g.status);
            return g.json()
        }).then(function(g) {
            g.error && (E.error("Unable to get config: " + g.error),
            e());
            g.auth_error && (E.error("Unable to get config due to authentication error. SDK Authentication does not support AMP pages."),
            e());
            g.error || g.auth_error || (g = {
                userVisibleOnly: !0,
                applicationServerKey: k.P(g.config.vapid_public_key)
            },
            f(g))
        }).catch(function(g) {
            E.error("Unable to get config: " + g);
            e()
        })
    }
    )
}
function J(a, b, c, f, e, d, g, h, m) {
    return G().then(n=>new Promise(function(C, D) {
        const u = {};
        u.device_id = c;
        u.api_key = a;
        u.sdk_version = "4.7.1";
        null != d && (u.sdk_flavor = d);
        var v = null;
        let K = null
          , L = null;
        e && (L = e.endpoint,
        e.getKey && (v = btoa(String.fromCharCode.apply(null, new Uint8Array(e.getKey("p256dh")))),
        K = btoa(String.fromCharCode.apply(null, new Uint8Array(e.getKey("auth"))))));
        u.time = Math.floor((new Date).valueOf() / 1E3);
        u.attributes = [{
            user_id: f,
            push_token: L,
            custom_push_public_key: v,
            custom_push_user_auth: K
        }];
        v = {
            "Content-type": "application/json",
            "X-Braze-Api-Key": u.api_key
        };
        n && m && (v["X-Braze-Auth-Signature"] = n);
        fetch(b + "/data/", {
            method: "POST",
            headers: v,
            body: JSON.stringify(u)
        }).then(function(p) {
            p.ok || E.error(h + " " + p.status);
            return p.json()
        }).then(function(p) {
            p.error && (E.error(h + " " + p.error),
            D());
            p.auth_error && (H(u, h, p.auth_error),
            D());
            p.error || p.auth_error || (E.info(g),
            C())
        }).catch(function(p) {
            E.error(h + " " + p);
            D()
        })
    }
    ))
}
function M(a, b) {
    return F().then(function() {
        return G()
    }).then(function(c) {
        const f = B.m;
        w(new A(f,E), f.g.s, function(e, d) {
            e = Math.floor((new Date).valueOf() / 1E3);
            const g = d.data;
            g.time = e;
            a.time = e;
            a.user_id = d.userId;
            g.events = [a];
            g.sdk_version = "4.7.1";
            e = {
                "Content-Type": "application/json",
                "X-Braze-Api-Key": g.api_key
            };
            c && d.sdkAuthEnabled && (e["X-Braze-Auth-Signature"] = c);
            fetch(d.baseUrl + "/data/", {
                method: "POST",
                headers: e,
                body: JSON.stringify(g)
            }).then(function(h) {
                h.ok || E.error("Unable to log " + b + ": " + h.status);
                return h.json()
            }).then(function(h) {
                h.error && E.error("Unable to log " + b + ":", h.error);
                h.auth_error && H(g, "Unable to log " + b, h.auth_error);
                h.error || h.auth_error || E.info("Successfully logged " + b);
                return Promise.resolve()
            }).catch(function(h) {
                E.error("Unable to log " + b + ":", h);
                return Promise.resolve()
            })
        })
    }).catch(function() {
        return Promise.reject("Not sending data to Braze backend due to opt-out.")
    })
}
;function N() {
    const a = self.location.search.match(/apiKey=([^&]+)/i);
    if (a)
        return a[1];
    E.error("Missing API key in query params.");
    return null
}
function O() {
    const a = self.location.search.match(/baseUrl=([^&]+)/i);
    if (a)
        return a[1];
    E.error("Missing base URL in query params.");
    return null
}
;function P(a, b) {
    self.clients.matchAll().then(function(c) {
        for (let f = 0; f < c.length; f++)
            c[f].postMessage({
                command: a,
                payload: b
            })
    })
}
function Q(a, b, c, f, e) {
    return I(a, b, c).then(function(d) {
        return self.registration.pushManager.subscribe(d)
    }).then(function(d) {
        P("amp-web-push-subscribe", null);
        return J(a, b, c, f, d, "amp", "Successfully sent AMP push subscription to Braze backend.", "Unable to send AMP push subscription to Braze backend.", e)
    }).catch(function() {
        E.error("Failed to subscribe for AMP push.");
        return Promise.reject()
    })
}
function R() {
    self.registration.pushManager.getSubscription().then(function(a) {
        return a ? self.registration.pushManager.permissionState(a.options) : null
    }).then(function(a) {
        P("amp-web-push-subscription-state", "granted" === a)
    })
}
function S() {
    const a = B.m
      , b = new A(a,E);
    return (new Promise(function(c, f) {
        w(b, a.g.s, function(e, d) {
            Q(d.data.api_key, d.baseUrl, d.data.device_id, d.userId, d.sdkAuthEnabled).then(function() {
                c()
            }).catch(function() {
                f()
            })
        }, function() {
            const e = N()
              , d = O();
            w(b, a.g.A, function(g, h) {
                Q(e, d, h, null).then(function() {
                    c()
                }).catch(function() {
                    f()
                })
            }, function() {
                const g = l.H();
                (new Promise(function(h, m) {
                    b.setItem(a.g.A, a.v, g, h, m)
                }
                )).then(function() {
                    return Q(e, d, g, null)
                }).then(function() {
                    c()
                }).catch(function() {
                    f()
                })
            })
        })
    }
    )).then(function() {
        return new Promise(function(c, f) {
            b.setItem(a.g.D, a.v, !0, c, f)
        }
        )
    })
}
function T() {
    return self.registration.pushManager.getSubscription().then(function(a) {
        return a.unsubscribe()
    }).then(function() {
        P("amp-web-push-unsubscribe", null);
        const a = B.m
          , b = new A(a,E);
        return (new Promise(function(c, f) {
            w(b, a.g.s, function(e, d) {
                J(d.data.api_key, d.baseUrl, d.data.device_id, d.userId, null, "amp", "Successfully sent AMP push unsubscription to Braze backend.", "Unable to send AMP push unsubscription to Braze backend.", d.sdkAuthEnabled).then(function() {
                    c()
                }).catch(function() {
                    f()
                })
            }, function() {
                w(b, a.g.A, function(e, d) {
                    e = N();
                    const g = O();
                    J(e, g, d, null, null, "amp", "Successfully sent AMP push unsubscription to Braze backend.", "Unable to send AMP push unsubscription to Braze backend.", null).then(function() {
                        c()
                    }).catch(function() {
                        f()
                    })
                }, function() {
                    E.error("No device found during unsubscription.");
                    f()
                })
            })
        }
        )).then(function() {
            return new Promise(function(c, f) {
                b.setItem(a.g.D, a.v, !1, c, f)
            }
            )
        })
    }).catch(function() {
        E.error("Failed to unsubscribe for AMP push.");
        return Promise.reject()
    })
}
;function U(a, b) {
    a.waitUntil(b.catch(function(c) {
        c && E.info(c)
    }))
}
;E.B(!0);
function V(a) {
    if (null == a || 0 === Object.keys(a).length)
        return Promise.reject("Server has no pending push message for this registration. Ignoring push event.");
    const b = a.t
      , c = a.a
      , f = a.i
      , e = a.img
      , d = {
        url: a.u,
        ab_ids: {
            cid: a.cid
        },
        extra: a.e
    }
      , g = a.ri;
    a.ab_push_fetch_test_triggers_key && (E.info("Service worker 4.7.1 found trigger fetch key in push payload."),
    d.fetchTriggers = !0);
    var h = a.ab_cd;
    if (null != h) {
        var m = B.m;
        (new A(m,E)).setItem(m.g.I, (new Date).valueOf(), {
            userId: a.ab_cd_uid,
            card: h
        })
    }
    a = a.pab || [];
    h = {};
    for (m = 0; m < a.length; m++)
        if (null != a[m] && null != a[m].action) {
            let n;
            switch (a[m].a) {
            case "ab_none":
                n = null;
                break;
            case "ab_uri":
                if (n = a[m].u,
                null == n || "" === n)
                    n = "/"
            }
            h[a[m].action] = n
        }
    d.actionTargets = h;
    E.info("Displaying push notification!");
    return self.registration.showNotification(b, {
        body: c,
        icon: f,
        image: e,
        data: d,
        actions: a,
        requireInteraction: g
    }).catch(function(n) {
        E.info(n)
    })
}
self.addEventListener("install", function(a) {
    a.waitUntil(self.skipWaiting())
});
self.addEventListener("activate", function() {
    return self.clients.claim()
});
self.addEventListener("push", function(a) {
    E.info("Service worker 4.7.1 received push");
    null != a.data && null != a.data.json ? U(a, V(a.data.json())) : U(a, new Promise(function(b, c) {
        const f = B.m;
        w(new A(f,E), f.g.s, function(e, d) {
            const g = d.data;
            F().then(function() {
                return fetch(d.baseUrl + "/web_push/", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        "X-Braze-Api-Key": g.api_key
                    },
                    body: JSON.stringify(g)
                })
            }).then(function(h) {
                return h.ok ? h.json() : (E.error("Unable to retrieve push payload from server: " + h.status),
                Promise.reject())
            }).then(function(h) {
                E.info("Retrieved push payload from server");
                b(V(h))
            }).catch(function(h) {
                c("Unable to retrieve push payload from server or user has opt-out: " + h)
            })
        })
    }
    ))
});
self.addEventListener("notificationclick", function(a) {
    if (a && a.notification && (a.notification.close(),
    null != Notification && Notification.prototype.hasOwnProperty("data") && a.notification.data && a.notification.data.ab_ids)) {
        var b = null != a.action && "" !== a.action;
        var c = b ? M({
            name: z.L,
            data: {
                cid: a.notification.data.ab_ids.cid,
                a: a.action
            }
        }, "push button click") : M({
            name: z.M,
            data: {
                cid: a.notification.data.ab_ids.cid
            }
        }, "push click");
        if (!b) {
            const g = {
                lastClick: (new Date).valueOf(),
                trackingString: a.notification.data.ab_ids.cid
            };
            a.notification.data.fetchTriggers && (g.fetchTriggers = !0);
            const h = B.m
              , m = new A(h,E);
            var f = c.then(function() {
                return new Promise(function(n, C) {
                    m.setItem(h.g.K, h.v, g, n, C)
                }
                )
            }).catch(function() {
                E.info("Not storing push click due to no click event being created.");
                return Promise.resolve()
            })
        }
        if (b)
            var e = a.notification.data.actionTargets[a.action];
        else if (e = a.notification.data.url,
        null == e || "" === e)
            e = "/";
        var d;
        null != e && "" !== e && (d = clients.matchAll({
            type: "window"
        }).then(function() {
			for (client of clientList) {
				if (client.focus) {
					client.focus();
				}
				if (client.postMessage) {
					client.postMessage(e);
				}
			}
			return Promise.reslove();
            //if (clients.openWindow) {
            //    return clients.openWindow(e)
			//}
        }));
        U(a, Promise.all([d, f]))
    }
});
self.addEventListener("pushsubscriptionchange", function(a) {
    U(a, F().then(function() {
        let b = {
            userVisibleOnly: !0
        };
        null != a.oldSubscription && (b = a.oldSubscription.options);
        return self.registration.pushManager.subscribe(b)
    }).then(function(b) {
        const c = B.m;
        return new Promise(function(f, e) {
            w(new A(c,E), c.g.s, function(d, g) {
                J(g.data.api_key, g.baseUrl, g.data.device_id, g.userId, b, null, "Successfully resubscribed user after expiration", "Unable to resubscribe user", g.sdkAuthEnabled).then(function() {
                    f()
                }).catch(function() {
                    e()
                })
            })
        }
        )
    }).catch(function() {
        return Promise.reject("Not resubscribing user for push due to opt-out.")
    }))
});
self.addEventListener("message", function(a) {
    a.waitUntil && a.data.command && a.waitUntil(F().then(function() {
        switch (a.data.command) {
        case "amp-web-push-subscription-state":
            return R(),
            Promise.resolve();
        case "amp-web-push-subscribe":
            return S();
        case "amp-web-push-unsubscribe":
            return T();
        default:
            return Promise.resolve()
        }
    }).catch(function() {
        E.info("Ignoring message from amp-web-push due to opt-out.");
        return Promise.resolve()
    }))
});
