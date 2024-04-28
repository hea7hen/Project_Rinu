window.R = {},
R.iLerp = (t,i,e)=>R.Clamp((e - t) / (i - t), 0, 1),
R.Lerp = (t,i,e)=>t * (1 - e) + i * e,
R.Damp = (t,i,e)=>R.Lerp(t, i, 1 - Math.exp(Math.log(1 - e) * RD)),
R.Remap = (t,i,e,s,r)=>R.Lerp(e, s, R.iLerp(t, i, r)),
R.M = class {
    constructor(t) {
        R.BM(this, ["gRaf", "run", "uSvg", "uLine", "uProp"]),
        this.v = this.vInit(t),
        this.r = new R.RafR(this.run)
    }
    vInit(i) {
        const r = {
            el: R.Select.el(i.el),
            e: {
                curve: i.e || "linear"
            },
            d: {
                origin: i.d || 0,
                curr: 0
            },
            delay: i.delay || 0,
            cb: i.cb || !1,
            r: i.r || 2,
            prog: 0,
            progE: 0,
            elapsed: 0
        };
        r.elL = r.el.length,
        R.Has(i, "update") ? r.up = t=>{
            i.update(r)
        }
        : R.Has(i, "svg") ? r.up = this.uSvg : R.Has(i, "line") ? r.up = this.uLine : r.up = this.uProp;
        var e = i.p || !1
          , t = i.svg || !1
          , a = i.line || !1;
        let s = !1;
        if (e) {
            r.prop = {},
            r.propI = [];
            var h = Object.keys(e);
            r.propL = h.length;
            let t = r.propL;
            for (; t--; ) {
                var o = h[t]
                  , o = (r.prop[t] = {
                    name: o,
                    origin: {
                        start: e[o][0],
                        end: e[o][1]
                    },
                    curr: e[o][0],
                    start: e[o][0],
                    end: e[o][1],
                    unit: e[o][2] || "%"
                },
                o.charAt(0))
                  , l = "r" === o && s ? "r2" : o;
                s = "r" === o,
                r.propI[l] = t
            }
        } else if (t)
            r.svg = {
                type: t.type,
                attr: "polygon" === t.type ? "points" : "d",
                end: t.end,
                originArr: {},
                arr: {},
                val: []
            },
            r.svg.start = t.start || R.Ga(r.el[0], r.svg.attr),
            r.svg.curr = r.svg.start,
            r.svg.originArr.start = R.Svg.split(r.svg.start),
            r.svg.originArr.end = R.Svg.split(r.svg.end),
            r.svg.arr.start = r.svg.originArr.start,
            r.svg.arr.end = r.svg.originArr.end,
            r.svg.arrL = r.svg.arr.start.length;
        else if (a) {
            r.line = {
                dashed: a.dashed,
                coeff: {
                    start: R.Is.def(a.start) ? (100 - a.start) / 100 : 1,
                    end: R.Is.def(a.end) ? (100 - a.end) / 100 : 0
                },
                shapeL: [],
                origin: {
                    start: [],
                    end: []
                },
                curr: [],
                start: [],
                end: []
            };
            for (let s = 0; s < r.elL; s++) {
                var n = a.elWL || r.el[s];
                r.line.shapeL[s] = R.Svg.shapeL(n);
                let t;
                if (r.line.dashed) {
                    var p = r.line.dashed;
                    let i = 0;
                    var d = p.split(/[\s,]/)
                      , c = d.length;
                    for (let t = 0; t < c; t++)
                        i += parseFloat(d[t]) || 0;
                    let e = "";
                    var g = Math.ceil(r.line.shapeL[s] / i);
                    for (let t = 0; t < g; t++)
                        e += p + " ";
                    t = e + "0 " + r.line.shapeL[s]
                } else
                    t = r.line.shapeL[s];
                r.el[s].style.strokeDasharray = t,
                r.line.origin.start[s] = r.line.coeff.start * r.line.shapeL[s],
                r.line.origin.end[s] = r.line.coeff.end * r.line.shapeL[s],
                r.line.curr[s] = r.line.origin.start[s],
                r.line.start[s] = r.line.origin.start[s],
                r.line.end[s] = r.line.origin.end[s]
            }
        }
        return r
    }
    play(t) {
        this.pause(),
        this.vUpd(t),
        this.delay.run()
    }
    pause() {
        this.r.stop(),
        this.delay && this.delay.stop()
    }
    vUpd(t) {
        var i = t || {}
          , e = R.Has(i, "reverse") ? "start" : "end";
        if (R.Has(this.v, "prop")) {
            let t = this.v.propL;
            for (; t--; )
                this.v.prop[t].end = this.v.prop[t].origin[e],
                this.v.prop[t].start = this.v.prop[t].curr,
                R.Has(i, "p") && R.Has(i.p, this.v.prop[t].name) && (R.Has(i.p[this.v.prop[t].name], "newEnd") && (this.v.prop[t].end = i.p[this.v.prop[t].name].newEnd),
                R.Has(i.p[this.v.prop[t].name], "newStart")) && (this.v.prop[t].start = i.p[this.v.prop[t].name].newStart)
        } else if (R.Has(this.v, "svg"))
            R.Has(i, "svg") && R.Has(i.svg, "start") ? this.v.svg.arr.start = i.svg.start : this.v.svg.arr.start = R.Svg.split(this.v.svg.curr),
            R.Has(i, "svg") && R.Has(i.svg, "end") ? this.v.svg.arr.end = i.svg.end : this.v.svg.arr.end = this.v.svg.originArr[e];
        else if (R.Has(this.v, "line")) {
            for (let t = 0; t < this.v.elL; t++)
                this.v.line.start[t] = this.v.line.curr[t];
            if (R.Has(i, "line") && R.Has(i.line, "end")) {
                this.v.line.coeff.end = (100 - i.line.end) / 100;
                for (let t = 0; t < this.v.elL; t++)
                    this.v.line.end[t] = this.v.line.coeff.end * this.v.line.shapeL[t]
            } else
                for (let t = 0; t < this.v.elL; t++)
                    this.v.line.end[t] = this.v.line.origin[e][t]
        }
        this.v.d.curr = R.Has(i, "d") ? i.d : R.R(this.v.d.origin - this.v.d.curr + this.v.elapsed),
        this.v.e.curve = i.e || this.v.e.curve,
        this.v.e.calc = R.Is.str(this.v.e.curve) ? R.Ease[this.v.e.curve] : R.Ease4(this.v.e.curve),
        this.v.delay = (R.Has(i, "delay") ? i : this.v).delay,
        this.v.cb = (R.Has(i, "cb") ? i : this.v).cb,
        this.v.prog = this.v.progE = 0 === this.v.d.curr ? 1 : 0,
        this.delay = new R.Delay(this.gRaf,this.v.delay)
    }
    gRaf() {
        this.r.run()
    }
    run(t) {
        1 === this.v.prog ? (this.pause(),
        this.v.up(),
        this.v.cb && this.v.cb()) : (this.v.elapsed = R.Clamp(t, 0, this.v.d.curr),
        this.v.prog = R.Clamp(this.v.elapsed / this.v.d.curr, 0, 1),
        this.v.progE = this.v.e.calc(this.v.prog),
        this.v.up())
    }
    uProp() {
        var t = this.v.prop
          , i = this.v.propI;
        let e = this.v.propL;
        for (; e--; )
            t[e].curr = this.lerp(t[e].start, t[e].end);
        var s = R.Has(i, "x") ? t[i.x].curr + t[i.x].unit : 0
          , r = R.Has(i, "y") ? t[i.y].curr + t[i.y].unit : 0
          , s = s + r === 0 ? 0 : "translate3d(" + s + "," + r + ",0)"
          , r = R.Has(i, "r") ? t[i.r].name + "(" + t[i.r].curr + "deg)" : 0
          , a = R.Has(i, "r2") ? t[i.r2].name + "(" + t[i.r2].curr + "deg)" : 0
          , h = R.Has(i, "s") ? t[i.s].name + "(" + t[i.s].curr + ")" : 0
          , o = s + r + a + h === 0 ? 0 : [s, r, a, h].filter(t=>0 !== t).join(" ")
          , l = R.Has(i, "o") ? t[i.o].curr : -1;
        let n = this.v.elL;
        for (; n-- && !R.Is.und(this.v.el[n]); )
            0 !== o && (this.v.el[n].style.transform = o),
            0 <= l && (this.v.el[n].style.opacity = l)
    }
    uSvg() {
        var i = this.v.svg;
        i.currTemp = "";
        for (let t = 0; t < i.arrL; t++)
            i.val[t] = isNaN(i.arr.start[t]) ? i.arr.start[t] : this.lerp(i.arr.start[t], i.arr.end[t]),
            i.currTemp += i.val[t] + " ",
            i.curr = i.currTemp.trim();
        for (let t = 0; t < this.v.elL && !R.Is.und(this.v.el[t]); t++)
            this.v.el[t].setAttribute(i.attr, i.curr)
    }
    uLine() {
        var i = this.v.line;
        for (let t = 0; t < this.v.elL; t++) {
            var e = this.v.el[t].style;
            i.curr[t] = this.lerp(i.start[t], i.end[t]),
            e.strokeDashoffset = i.curr[t],
            0 === this.v.prog && (e.opacity = 1)
        }
    }
    lerp(t, i) {
        return R.R(R.Lerp(t, i, this.v.progE), this.v.r)
    }
}
,
R.TL = class {
    constructor() {
        this._ = [],
        this.d = 0
    }
    from(t) {
        this.d += R.Has(t, "delay") ? t.delay : 0,
        t.delay = this.d,
        this._.push(new R.M(t))
    }
    play(t) {
        this.run("play", t)
    }
    pause() {
        this.run("pause")
    }
    run(t, i) {
        let e = 0;
        for (var s = this._.length, r = i || void 0; e < s; )
            this._[e][t](r),
            e++
    }
}
,
R.BM = (t,i)=>{
    let e = i.length;
    for (; e--; )
        t[i[e]] = t[i[e]].bind(t)
}
,
R.Clamp = (t,i,e)=>t < i ? i : e < t ? e : t,
R.Clone = t=>JSON.parse(JSON.stringify(t)),
R.Delay = class {
    constructor(t, i) {
        this.cb = t,
        this.d = i,
        R.BM(this, ["loop"]),
        this.r = new R.RafR(this.loop)
    }
    run() {
        0 === this.d ? this.cb() : this.r.run()
    }
    stop() {
        this.r.stop()
    }
    loop(t) {
        t = R.Clamp(t, 0, this.d);
        1 === R.Clamp(t / this.d, 0, 1) && (this.stop(),
        this.cb())
    }
}
,
R.Dist = (t,i)=>Math.sqrt(t * t + i * i),
R.Ease = {
    linear: t=>t,
    i1: t=>1 - Math.cos(t * (.5 * Math.PI)),
    o1: t=>Math.sin(t * (.5 * Math.PI)),
    io1: t=>-.5 * (Math.cos(Math.PI * t) - 1),
    i2: t=>t * t,
    o2: t=>t * (2 - t),
    io2: t=>t < .5 ? 2 * t * t : (4 - 2 * t) * t - 1,
    i3: t=>t * t * t,
    o3: t=>--t * t * t + 1,
    io3: t=>t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    i4: t=>t * t * t * t,
    o4: t=>1 - --t * t * t * t,
    io4: t=>t < .5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
    i5: t=>t * t * t * t * t,
    o5: t=>1 + --t * t * t * t * t,
    io5: t=>t < .5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
    i6: t=>0 === t ? 0 : 2 ** (10 * (t - 1)),
    o6: t=>1 === t ? 1 : 1 - 2 ** (-10 * t),
    io6: t=>0 === t || 1 === t ? t : (t /= .5) < 1 ? .5 * 2 ** (10 * (t - 1)) : .5 * (2 - 2 ** (-10 * --t))
},
R.r0 = (t,i)=>1 - 3 * i + 3 * t,
R.r1 = (t,i)=>3 * i - 6 * t,
R.r2 = (t,i,e)=>((R.r0(i, e) * t + R.r1(i, e)) * t + 3 * i) * t,
R.r3 = (t,i,e)=>3 * R.r0(i, e) * t * t + 2 * R.r1(i, e) * t + 3 * i,
R.r4 = (t,i,e,s,r)=>{
    let a, h, o = 0;
    for (; h = i + .5 * (e - i),
    0 < (a = R.r2(h, s, r) - t) ? e = h : i = h,
    1e-7 < Math.abs(a) && ++o < 10; )
        ;
    return h
}
,
R.r5 = (i,e,s,r)=>{
    for (let t = 0; t < 4; ++t) {
        var a = R.r3(e, s, r);
        if (0 === a)
            return e;
        e -= (R.r2(e, s, r) - i) / a
    }
    return e
}
,
R.Ease4 = t=>{
    const a = t[0]
      , i = t[1]
      , h = t[2]
      , e = t[3];
    let o = new Float32Array(11);
    if (a !== i || h !== e)
        for (let t = 0; t < 11; ++t)
            o[t] = R.r2(.1 * t, a, h);
    return t=>a === i && h === e || (0 === t || 1 === t) ? t : R.r2(function(t) {
        let i = 0;
        for (var e = 1; 10 !== e && o[e] <= t; ++e)
            i += .1;
        --e;
        var s = (t - o[e]) / (o[e + 1] - o[e])
          , s = i + .1 * s
          , r = R.r3(s, a, h);
        return .001 <= r ? R.r5(t, s, a, h) : 0 === r ? s : R.r4(t, r, r + .1, a, h)
    }(t), i, e)
}
,
R.Fetch = i=>{
    var t = "json" === i.type;
    const e = t ? "json" : "text";
    var s = {
        method: t ? "POST" : "GET",
        headers: new Headers({
            "Content-type": t ? "application/x-www-form-urlencoded" : "text/html"
        }),
        mode: "same-origin"
    };
    t && (s.body = i.body),
    fetch(i.url, s).then(t=>{
        if (t.ok)
            return t[e]();
        i.error && i.error()
    }
    ).then(t=>{
        i.success(t)
    }
    )
}
,
R.Has = (t,i)=>t.hasOwnProperty(i),
R.Is = {
    str: t=>"string" == typeof t,
    obj: t=>t === Object(t),
    arr: t=>t.constructor === Array,
    def: t=>void 0 !== t,
    und: t=>void 0 === t
},
R.Mod = (t,i)=>(t % i + i) % i,
R.Pad = (t,i)=>("000" + t).slice(-i),
R.PCurve = (t,i,e)=>{
    return (i + e) ** (i + e) / (i ** i * e ** e) * t ** i * (1 - t) ** e
}
,
R.R = (t,i)=>{
    i = R.Is.und(i) ? 100 : 10 ** i;
    return Math.round(t * i) / i
}
,
R.Select = {
    el: t=>{
        let i = [];
        var e;
        return R.Is.str(t) ? (e = t.substring(1),
        "#" === t.charAt(0) ? i[0] = R.G.id(e) : i = R.G.class(e)) : i[0] = t,
        i
    }
    ,
    type: t=>"#" === t.charAt(0) ? "id" : "class",
    name: t=>t.substring(1)
},
R.L = (t,i,e,s)=>{
    var r = R.Select.el(t)
      , a = r.length;
    let h = !1;
    var t = e.substring(0, 3)
      , o = ("whe" !== t && "mou" !== t && "tou" !== t && "poi" !== t || (h = {
        passive: !1
    }),
    "a" === i ? "add" : "remove");
    for (let t = 0; t < a; t++)
        r[t][o + "EventListener"](e, s, h)
}
;
const Tab = class {
    constructor() {
        this._ = [],
        this.pause = 0,
        R.BM(this, ["v"]),
        R.L(document, "a", "visibilitychange", this.v)
    }
    add(t) {
        this._.push(t)
    }
    v() {
        var t = performance.now();
        let i, e, s = (e = document.hidden ? (this.pause = t,
        "stop") : (i = t - this.pause,
        "start"),
        this._.length);
        for (; s--; )
            this._[s][e](i)
    }
}
;
R.Tab = new Tab;
let RD = 0;
const FR = 1e3 / 60
  , Raf = (R.Raf = class {
    constructor() {
        this._ = [],
        this.on = !0,
        R.BM(this, ["loop", "tOff", "tOn"]),
        R.Tab.add({
            stop: this.tOff,
            start: this.tOn
        }),
        this.raf()
    }
    tOff() {
        this.on = !1
    }
    tOn(t) {
        this.t = null;
        let i = this.l();
        for (; i--; )
            this._[i].sT += t;
        this.on = !0
    }
    add(t) {
        this._.push(t)
    }
    remove(t) {
        let i = this.l();
        for (; i--; )
            if (this._[i].id === t)
                return void this._.splice(i, 1)
    }
    loop(i) {
        if (this.on) {
            this.t || (this.t = i),
            RD = (i - this.t) / FR,
            this.t = i;
            let t = this.l();
            for (; t--; ) {
                var e, s = this._[t];
                R.Is.def(s) && (s.sT || (s.sT = i),
                e = i - s.sT,
                s.cb(e))
            }
        }
        this.raf()
    }
    raf() {
        requestAnimationFrame(this.loop)
    }
    l() {
        return this._.length
    }
}
,
new R.Raf);
let RafId = 0;
R.RafR = class {
    constructor(t) {
        this.cb = t,
        this.on = !1,
        this.id = RafId,
        RafId++
    }
    run() {
        this.on || (Raf.add({
            id: this.id,
            cb: this.cb
        }),
        this.on = !0)
    }
    stop() {
        this.on && (Raf.remove(this.id),
        this.on = !1)
    }
}
,
R.Rand = {
    range: (t,i,e)=>R.R(Math.random() * (i - t) + t, e),
    uniq: i=>{
        var e = [];
        for (let t = 0; t < i; t++)
            e[t] = t;
        let t = i;
        for (var s, r; t--; )
            s = ~~(Math.random() * (t + 1)),
            r = e[t],
            e[t] = e[s],
            e[s] = r;
        return e
    }
},
R.Snif = {
    uA: navigator.userAgent.toLowerCase(),
    get iPadIOS13() {
        return "MacIntel" === navigator.platform && 1 < navigator.maxTouchPoints
    },
    get isMobile() {
        return /mobi|android|tablet|ipad|iphone/.test(this.uA) || this.iPadIOS13
    },
    get isFirefox() {
        return -1 < this.uA.indexOf("firefox")
    }
},
R.Svg = {
    shapeL: s=>{
        var t, i, e, r;
        if ("circle" === s.tagName)
            return 2 * R.Ga(s, "r") * Math.PI;
        if ("line" === s.tagName)
            return t = R.Ga(s, "x1"),
            i = R.Ga(s, "x2"),
            e = R.Ga(s, "y1"),
            r = R.Ga(s, "y2"),
            Math.sqrt((i -= t) * i + (r -= e) * r);
        if ("polyline" !== s.tagName)
            return s.getTotalLength();
        {
            let i = 0
              , e = 0;
            var a = s.points.numberOfItems;
            for (let t = 0; t < a; t++) {
                var h = s.points.getItem(t);
                0 < t && (i += R.Dist(h.x - e.x, h.y - e.y)),
                e = h
            }
            return i
        }
    }
    ,
    split: t=>{
        var i = []
          , e = t.split(" ")
          , s = e.length;
        for (let t = 0; t < s; t++) {
            var r = e[t].split(",")
              , a = r.length;
            for (let t = 0; t < a; t++) {
                var h = r[t]
                  , h = isNaN(h) ? h : +h;
                i.push(h)
            }
        }
        return i
    }
},
R.Timer = class {
    constructor(t) {
        this._ = new R.Delay(t.cb,t.delay)
    }
    run() {
        this._.stop(),
        this._.run()
    }
}
,
R.Une = (t,i,e)=>0 !== R.R(Math.abs(t - i), e),
R.Cr = t=>document.createElement(t),
R.g = (t,i,e)=>{
    return (t || document)["getElement" + i](e)
}
,
R.G = {
    id: (t,i)=>R.g(i, "ById", t),
    class: (t,i)=>R.g(i, "sByClassName", t),
    tag: (t,i)=>R.g(i, "sByTagName", t)
},
R.Ga = (t,i)=>t.getAttribute(i),
R.index = (i,e)=>{
    var s = e.length;
    for (let t = 0; t < s; t++)
        if (i === e[t])
            return t;
    return -1
}
,
R.Index = {
    list: t=>R.index(t, t.parentNode.children),
    class: (t,i,e)=>R.index(t, R.G.class(i, e))
},
R.PD = t=>{
    t.cancelable && t.preventDefault()
}
,
R.RO = class {
    constructor() {
        this.eT = R.Snif.isMobile ? "orientationchange" : "resize",
        this.tick = !1,
        this._ = [],
        R.BM(this, ["fn", "gRaf", "run"]),
        this.t = new R.Timer({
            delay: 40,
            cb: this.gRaf
        }),
        this.r = new R.RafR(this.run),
        R.L(window, "a", this.eT, this.fn)
    }
    add(t) {
        this._.push(t)
    }
    remove(t) {
        let i = this._.length;
        for (; i--; )
            if (this._[i].id === t)
                return void this._.splice(i, 1)
    }
    fn(t) {
        this.e = t,
        this.t.run()
    }
    gRaf() {
        this.tick || (this.tick = !0,
        this.r.run())
    }
    run() {
        let t = 0;
        for (var i = this._.length; t < i; )
            this._[t].cb(this.e),
            t++;
        this.r.stop(),
        this.tick = !1
    }
}
;
const Ro = new R.RO;
let RoId = 0;
function Router(t) {
    var i = _A
      , e = i.config.routes[t].page
      , s = i.route.new
      , r = i.route.old;
    i.route.old = s,
    i.route.new = {
        url: t,
        page: e
    },
    i.is[s.page] = !1,
    i.is[e] = !0,
    r.page && (i.was[r.page] = !1),
    i.was[s.page] = !0
}
R.ROR = class {
    constructor(t) {
        this.cb = t,
        this.id = RoId,
        RoId++
    }
    on() {
        Ro.add({
            id: this.id,
            cb: this.cb
        })
    }
    off() {
        Ro.remove(this.id)
    }
}
,
R.O = (t,i)=>{
    t.style.opacity = i
}
,
R.pe = (t,i)=>{
    t.style.pointerEvents = i
}
,
R.PE = {
    all: t=>{
        R.pe(t, "all")
    }
    ,
    none: t=>{
        R.pe(t, "none")
    }
},
R.T = (t,i,e,s)=>{
    s = R.Is.und(s) ? "%" : s;
    t.style.transform = "translate3d(" + i + s + "," + e + s + ",0)"
}
;
class Win {
    constructor(t) {
        _A.win = {
            w: 0,
            h: 0
        },
        this.d = t,
        R.BM(this, ["resize"]),
        new R.ROR(this.resize).on(),
        this.resize()
    }
    resize() {
        var t = _A
          , i = innerWidth
          , e = innerHeight
          , s = (t.win = {
            w: i,
            h: e
        },
        t.winSemi = {
            w: .5 * i,
            h: .5 * e
        },
        t.winRatio = {
            wh: i / e
        },
        t.isOver169 = t.winRatio.wh > 16 / 9,
        t.config.psd[this.d]);
        t.psd = {
            h: s.h,
            w: s.w
        },
        t.winWpsdW = i / t.psd.w,
        t.winHpsdH = e / t.psd.h,
        t.sFxS = .9 * t.win.h
    }
}
class Rotate {
    constructor() {
        this.inDom = !1,
        R.BM(this, ["resize"]),
        new R.ROR(this.resize).on(),
        this.resize()
    }
    resize() {
        var t = 1 < _A.winRatio.wh;
        t && !this.inDom ? this.a() : !t && this.inDom && this.r()
    }
    a() {
        this.issW = R.Cr("div"),
        this.issW.className = "iss-w";
        var t = R.Cr("div");
        t.className = "iss",
        t.textContent = "Please rotate your device.",
        this.issW.appendChild(t),
        document.body.prepend(this.issW),
        this.inDom = !0
    }
    r() {
        this.issW.parentNode.removeChild(this.issW),
        this.inDom = !1
    }
}
class Controller {
    constructor(t) {
        var i = _A;
        i.is[404] || (i.mutating = !0,
        i.page = {},
        i.fromBack = !1,
        this.transitionM = t.transition.mutation,
        this.device = t.device,
        R.BM(this, ["eD"]),
        new Win(this.device),
        "m" === this.device && new Rotate,
        i.e = new t.engine,
        this.onPopstate(),
        R.L(document.body, "a", "click", this.eD),
        new t.transition.intro(t=>{
            this.intro(t)
        }
        ))
    }
    onPopstate() {
        const i = document
          , e = "complete";
        let s = i.readyState !== e;
        onload = t=>{
            setTimeout(t=>{
                s = !1
            }
            , 0)
        }
        ,
        onpopstate = t=>{
            s && i.readyState === e && (R.PD(t),
            t.stopImmediatePropagation());
            t = _A;
            R.Is.und(t.config.routes) || (t.mutating ? this.hPS() : (t.mutating = !0,
            this.out(location.pathname, "back")))
        }
    }
    eD(t) {
        var i, e, s = _A;
        let r = t.target
          , a = !1
          , h = !1;
        for (; r; ) {
            var o = r.tagName;
            if ("A" === o) {
                a = !0;
                break
            }
            if (("INPUT" === o || "BUTTON" === o) && "submit" === r.type) {
                h = !0;
                break
            }
            r = r.parentNode
        }
        a ? (e = (i = r.href).substring(0, 3),
        r.hasAttribute("target") || "mai" === e || "tel" === e || (R.PD(t),
        s.mutating) || ((e = i.replace(/^.*\/\/[^/]+/, "")) !== s.route.new.url ? (s.mutating = !0,
        this.out(e, r)) : "nav-logo" === r.id && (location.href = "/"))) : h && R.PD(t)
    }
    intro(i) {
        const e = _A;
        R.Fetch({
            url: e.route.new.url + "?webp=" + e.webp + "&device=" + this.device,
            type: "html",
            success: t=>{
                t = JSON.parse(t);
                e.config.routes = t.routes,
                e.data = t.data,
                this.cache = t.cache,
                this.add(document.body, "afterbegin", t.body),
                this.main = R.G.id("main"),
                this.transitionM = new this.transitionM,
                i()
            }
        })
    }
    out(t, i) {
        Router(t);
        t = _A;
        t.target = i,
        t.fromBack = "back" === i,
        t.page.update = t=>{
            this.in()
        }
        ,
        this.transitionM.out()
    }
    in() {
        var t = _A;
        const i = this.cache[t.route.new.url];
        document.title = i.title,
        "back" !== t.target && this.hPS(),
        t.page.insertNew = t=>{
            this.add(this.main, "beforeend", i.html)
        }
        ,
        t.page.removeOld = t=>{
            var i = this.main.children[0];
            i.parentNode.removeChild(i)
        }
        ,
        this.transitionM.in()
    }
    add(t, i, e) {
        t.insertAdjacentHTML(i, e)
    }
    hPS() {
        var t = _A.route.new.url;
        history.pushState({
            page: t
        }, "", t)
    }
}
class SVirtual {
    constructor(t) {
        this.cbFn = t.cb,
        this.isOn = !1,
        this.isFF = R.Snif.isFirefox,
        R.BM(this, ["fn"]);
        var t = document
          , i = ["wheel", "keydown"]
          , e = [t.body, t];
        for (let t = 0; t < 2; t++)
            R.L(e[t], "a", i[t], this.fn)
    }
    init(t) {
        this.isX = t.isX
    }
    on() {
        this.tick = !1,
        this.isOn = !0
    }
    off() {
        this.isOn = !1
    }
    resize() {
        this.spaceGap = _A.win.h - 40
    }
    fn(t) {
        this.e = t,
        this.eT = t.type,
        this.eK = t.key,
        "keydown" === this.eT && "Tab" !== this.eK || R.PD(t),
        this.isOn && !this.tick && (this.tick = !0,
        this.run())
    }
    run() {
        var t = this.eT;
        "wheel" === t ? this.w() : "keydown" === t && this.key()
    }
    w() {
        var t = this.e;
        let i;
        var e, s = t.wheelDeltaY || -1 * t.deltaY;
        i = this.isX && (e = t.wheelDeltaX || -1 * t.deltaX,
        Math.abs(e) >= Math.abs(s)) ? e : s,
        this.isFF && 1 === t.deltaMode ? i *= .75 : i *= .556,
        this.s = -i,
        this.cb()
    }
    key() {
        var i = this.eK
          , e = "ArrowUp" === i || "ArrowLeft" === i
          , t = "ArrowDown" === i || "ArrowRight" === i
          , i = " " === i;
        if (e || t || i) {
            var s = _A;
            if ("in" === s.mode && s.is.ho)
                s.e.ho.gl.arrowSlide(t || i ? 1 : -1),
                this.tick = !1;
            else {
                let t = 100;
                e ? t *= -1 : i && (s = this.e.shiftKey ? -1 : 1,
                t = this.spaceGap * s),
                this.s = t,
                this.cb()
            }
        } else
            this.tick = !1
    }
    cb() {
        this.cbFn(this.s),
        this.tick = !1
    }
}
class SVTo {
    constructor(t) {
        this.isSTo = !1,
        this.sUp = t.sUp,
        R.BM(this, ["wFooterFn", "aLeftFn", "wPreviewFn", "wHeroScrollFn"])
    }
    init() {
        var t = _A;
        this.url = t.route.new.url,
        this.isAbout = t.is.ab,
        this.isWork = t.is.wo
    }
    stop() {
        this.isSTo && (this.anim.pause(),
        this.isSTo = !1)
    }
    wFooterFn() {
        this.stop();
        var t = _A.e.s
          , i = R.R(t._[this.url].curr)
          , t = t.max
          , e = Math.abs(t - i)
          , e = 0 === e ? 0 : R.Lerp(100, 500, R.Clamp(e / 3e3, 0, 1));
        this.play({
            start: i,
            end: t,
            d: e,
            e: "io1"
        })
    }
    aLeftFn(t) {
        this.stop();
        var i, e, s, r = _A, a = r.e.s;
        a.isDragging || (i = R.R(a._[this.url].curr),
        e = R.G.id("a-l"),
        s = R.G.id("a-r").offsetHeight / e.offsetHeight,
        t = R.Clamp((t.pageY - e.getBoundingClientRect().top) * s - r.winSemi.h, 0, a.max),
        s = 0 === (e = Math.abs(t - i)) ? 0 : R.Lerp(100, 400, R.Clamp(e / 3e3, 0, 1)),
        this.play({
            start: i,
            end: t,
            d: s,
            e: "io1"
        }))
    }
    wPreviewFn(t) {
        this.stop();
        var i = _A
          , e = i.e.s
          , e = R.R(e._[this.url].step)
          , s = R.G.class("w-preview-w")
          , s = s[s.length - 1]
          , t = R.Index.class(t.target, "w-preview", s)
          , s = R.G.class("w-s")
          , s = s[s.length - 1].children[t]
          , t = s.getBoundingClientRect().top - this.y(s) - i.e.wo.preview.areaRight
          , s = Math.abs(t - e)
          , i = 0 === s ? 0 : R.Lerp(100, 400, R.Clamp(s / 3e3, 0, 1));
        this.play({
            start: e,
            end: t,
            d: i,
            e: "io1"
        })
    }
    y(t) {
        t = t.style.transform.match(/^translate3d\((.+)\)$/)[1].split(", ");
        return parseFloat(t[1])
    }
    wHeroScrollFn() {
        this.stop();
        var t = _A
          , i = t.e.s
          , i = R.R(i._[this.url].step)
          , t = t.win.h
          , e = Math.abs(t - i)
          , e = 0 === e ? 0 : R.Lerp(100, 500, R.Clamp(e / 3e3, 0, 1));
        this.play({
            start: i,
            end: t,
            d: e,
            e: "io1"
        })
    }
    play(t) {
        const i = t.start
          , e = t.end;
        this.anim = new R.M({
            d: t.d,
            e: t.e,
            update: t=>{
                t = R.Lerp(i, e, t.progE);
                this.sUp(t)
            }
        }),
        this.isSTo = !0,
        this.anim.play()
    }
    on() {
        this.l("a")
    }
    off() {
        this.l("r")
    }
    l(t) {
        var i = "click";
        this.isAbout ? R.L("#a-l-w", t, i, this.aLeftFn) : this.isWork && (R.L(".w-footer-link", t, i, this.wFooterFn),
        R.L(".w-preview", t, i, this.wPreviewFn),
        R.L(".w-hero-scroll", t, i, this.wHeroScrollFn))
    }
}
class MM {
    constructor(t) {
        this.cb = t.cb,
        this.el = R.Has(t, "el") ? R.Select.el(t.el)[0] : document,
        R.BM(this, ["run"])
    }
    on() {
        this.l("a")
    }
    off() {
        this.l("r")
    }
    l(t) {
        R.L(this.el, t, "mousemove", this.run)
    }
    run(t) {
        this.cb(t.pageX, t.pageY, t)
    }
}
class Scroll {
    constructor() {
        _A.cursor = {
            x: -1,
            y: -1
        },
        this.rqd = !1,
        this.min = 0,
        this.maxStep = 0,
        this.isDown = !1,
        this.isDragging = !1,
        this.prev = 0,
        this.step = 0,
        R.BM(this, ["sFn", "sUp", "move", "down", "up"]),
        this.scrollV = new SVirtual({
            cb: this.sFn
        }),
        this.sVTo = new SVTo({
            sUp: this.sUp
        }),
        this.mm = new MM({
            cb: this.move
        })
    }
    intro() {
        var t = _A
          , t = (this._ = {},
        t.config.routes)
          , i = Object.keys(t)
          , e = i.length;
        for (let t = 0; t < e; t++) {
            var s = i[t];
            this._[s] = {
                curr: 0,
                targ: 0,
                step: 0,
                expand: 0
            }
        }
    }
    init(t) {
        var i = _A;
        this.url = i.route.new.url,
        this.isHome = i.is.ho,
        this.isWork = i.is.wo,
        this.isX = t.isX,
        this.scrollV.init(t),
        this.sVTo.init();
        let e = 0;
        this.isHome && "out" === i.mode && (t = i.e.ho.gl.data,
        e = (t.out.w + t.out.gap.x) * i.index),
        this.sUpAll(e),
        this.resize()
    }
    resize() {
        var t, i = _A, i = (this.scrollV.resize(),
        this.step = 1.5 * i.win.h,
        this.isHome ? this.max = i.e.ho.gl.max : (t = (i = R.G.class("page")).length,
        this.max = Math.max(i[t - 1].offsetHeight - _A.win.h, 0),
        this.maxStep = this.max,
        this.isWork && (this.max += this.step),
        this.maxZero = 0 === this.max),
        this.clamp(this._[this.url].targ));
        this.sUpAll(i)
    }
    expand(t, i) {
        return 0 === this.step ? 0 : (t = R.Clamp(t - i, 0, this.step) / this.step,
        i = R.iLerp(.15, 1, t),
        R.Ease.i2(i))
    }
    sFn(t) {
        var i;
        this.isDown || (this.sVTo.stop(),
        i = _A,
        this.isHome && "in" === i.mode ? i.e.ho.gl.change("out") : this.sUp(this.clamp(this._[this.url].targ + t)))
    }
    sUp(t) {
        var i = this.url;
        this._[i].targ = t
    }
    down(t) {
        t.ctrlKey || "A" === t.target.tagName || 0 !== t.button ? R.PD(t) : (this.isDown = !0,
        this.isDragging = !1,
        this.start = this.isX ? t.pageX : t.pageY,
        this.targ = this._[this.url].targ,
        this.targPrev = this.targ)
    }
    move(t, i, e) {
        R.PD(e);
        var s, e = _A;
        e.cursor.x = t,
        e.cursor.y = i,
        this.isDown && (s = e.mode,
        i = this.isX ? t : i,
        Math.abs(i - this.start) < 15 || (this.isHome && "out" !== s || (i > this.prev && this.targ === this.min ? this.start = i - (this.targPrev - this.min) / 3 : i < this.prev && this.targ === this.max && (this.start = i - (this.targPrev - this.max) / 3),
        this.prev = i,
        this.targ = 3 * -(i - this.start) + this.targPrev,
        this.targ = this.clamp(this.targ),
        this.sUp(this.targ)),
        this.isDragging = 10 < Math.abs(t - this.start),
        this.isHome && "in" === s && this.isDragging && e.e.ho.gl.change("out")))
    }
    up(t) {
        var i, e, s;
        this.isDown && (this.isDown = !1,
        this.isDragging || (e = (i = _A).mode,
        this.isHome && (s = i.e.ho.gl,
        "out" === e ? -1 < s.indexOver && (i.index = s.indexOver,
        s.change("in")) : "in" === e && s.inSlide(t))))
    }
    loop() {
        var t, i, e = _A.lerpP;
        this.rqd = this.unequal(),
        this.rqd && (t = this.url,
        this._[t].curr = R.Damp(this._[t].curr, this._[t].targ, e),
        i = this.clampStep(this._[t].targ),
        this._[t].step = R.Damp(this._[t].step, i, e),
        this._[t].expand = this.expand(this._[t].curr, this._[t].step),
        this.isWork) && this._[t].curr >= this.max - 2 && (this.sVTo.off(),
        R.G.class("w-footer-a")[0].click())
    }
    unequal() {
        var t = this.url;
        return 0 !== R.R(Math.abs(this._[t].curr - this._[t].targ))
    }
    sUpAll(t) {
        var i = this.clampStep(t)
          , e = this.url;
        this._[e].targ = t,
        this._[e].curr = t,
        this._[e].step = i,
        this._[e].expand = this.expand(t, i),
        this.targ = t,
        this.targPrev = t
    }
    clamp(t) {
        return R.R(R.Clamp(t, this.min, this.max))
    }
    clampStep(t) {
        return R.R(R.Clamp(t, this.min, this.maxStep))
    }
    l(t) {
        var i = document;
        R.L(i, t, "mousedown", this.down),
        R.L(i, t, "mouseup", this.up)
    }
    on() {
        this.maxZero || (this.sVTo.on(),
        this.scrollV.on(),
        this.mm.on(),
        this.l("a"))
    }
    off() {
        this.maxZero || (this.sVTo.off(),
        this.scrollV.off(),
        this.mm.off(),
        this.l("r"))
    }
}
class SIntersect {
    constructor() {
        var t = _A;
        if (this.arr = [],
        this.arrL = 0,
        this.notRequired = t.is.ho,
        !this.notRequired) {
            this.isWork = t.is.wo;
            var e = t.is.ab
              , t = t.route.new
              , t = (this.url = t.url,
            R.G.class("page"));
            let i = t[t.length - 1].children;
            var s = (i = e ? i[0].children : i).length;
            for (let t = 0; t < s; t++) {
                var r = i[t];
                if (r.classList.contains("w-s")) {
                    var a = r.children
                      , h = a.length;
                    for (let t = 0; t < h; t++)
                        this.arr[this.arrL] = {
                            dom: a[t],
                            inside: {}
                        },
                        this.arrL++
                } else
                    r.classList.contains("_ns") || (this.arr[this.arrL] = {
                        dom: r,
                        inside: {}
                    },
                    this.arrL++)
            }
            this.resize()
        }
    }
    resize() {
        if (!this.notRequired) {
            const a = _A;
            var t = this.isWork ? "step" : "curr"
              , i = R.R(a.e.s._[this.url][t])
              , e = a.win.h;
            for (let t = 0; t < this.arrL; t++) {
                const a = this.arr[t];
                this.draw(a, -i);
                var s = a.dom.getBoundingClientRect().top - i - e
                  , r = Math.min(s, 0) + a.dom.offsetHeight + e;
                a.inside.start = s,
                a.inside.end = r + Math.max(s, 0),
                a.isOut = !1
            }
            this.run()
        }
    }
    run() {
        if (!this.notRequired) {
            var t = this.isWork ? "step" : "curr"
              , i = R.R(_A.e.s._[this.url][t]);
            for (let t = 0; t < this.arrL; t++) {
                var e = this.arr[t];
                i > e.inside.start && i <= e.inside.end ? (e.isOut && (e.isOut = !1),
                this.draw(e, i)) : e.isOut || (e.isOut = !0,
                this.draw(e, i))
            }
        }
    }
    draw(t, i) {
        R.T(t.dom, 0, R.R(-i), "px")
    }
}
class LZ {
    initA() {
        var t = _A;
        if (this.notRequired = !t.is.wo,
        !this.notRequired) {
            this.url = t.route.new.url,
            this.img = [],
            this.imgI = [];
            var t = R.G.class("page")
              , t = t[t.length - 1]
              , i = R.G.class("_lz", t);
            this.lzL = i.length;
            for (let t = 0; t < this.lzL; t++) {
                var e = i[t];
                this.img[t] = {
                    src: e.dataset.src,
                    dom: e
                }
            }
            for (let t = 0; t < this.lzL; t++)
                this.img[t].decode = !1,
                this.img[t].show = !1;
            this.resizeA()
        }
    }
    resizeA() {
        if (!this.notRequired) {
            var t = _A
              , i = t.e.s._[this.url].step
              , e = t.win.h;
            for (let t = 0; t < this.lzL; t++) {
                var s = this.img[t].dom;
                R.Is.def(s) && (s = s.getBoundingClientRect().top + i,
                this.img[t].limit = {
                    decode: Math.max(s - 2 * e, 0),
                    show: Math.max(s - .8 * e, 0)
                })
            }
        }
    }
    loop() {
        if (!this.notRequired) {
            var i = _A.e.s._[this.url].step;
            for (let t = 0; t < this.lzL; t++) {
                var e = this.img[t];
                i > e.limit.decode && !e.decode && (this.img[t].decode = !0,
                this.decode(t)),
                i > e.limit.show && !e.show && (this.img[t].show = !0,
                this.show(t))
            }
        }
    }
    show(t) {
        this.img[t].dom.classList.add("fx")
    }
    decode(t) {
        const i = this.img[t].dom
          , e = this.img[t].src;
        this.imgI[t] = new Image,
        this.imgI[t].src = e,
        this.imgI[t].decode().then(t=>{
            R.Is.def(i) && (i.src = e,
            delete i.dataset.src)
        }
        )
    }
    off() {
        if (!this.notRequired) {
            var i = this.imgI.length;
            for (let t = 0; t < i; t++)
                R.Is.def(this.imgI[t]) && (this.imgI[t].src = "data:,")
        }
    }
}
class Load {
    constructor() {
        this.moving = !1
    }
    intro() {
        var t = _A
          , t = (this.url = t.route.new.url,
        this.isHome = t.is.ho,
        this.isWork = t.is.wo,
        this.isAbout = t.is.ab,
        t.rgl._)
          , i = t.load;
        this.texLoad = i.plane,
        this.texL = i.planeL,
        this.tex = [],
        this.y = [],
        this.isHome ? (this.texLarge = t.large.plane,
        this.texMain = this.texLarge[0]) : this.isWork ? this.texMain = t[this.url].plane[0] : this.isAbout && (this.texMain = this.texLoad[12]),
        this.isHome && (i = t.small,
        this.texSmall = i.plane,
        this.texSmallL = i.planeL),
        this.resizeA()
    }
    resizeA() {
        var t = _A;
        if (t.introducing) {
            var i = t.win.w
              , e = t.win.h
              , s = 30 * t.winWpsdW
              , r = (i - 4 * s) / 4
              , a = r * e / i
              , h = a + s
              , o = r + s
              , l = .5 * h
              , n = e + .5 * (5 * a + 4 * s - e)
              , p = 12 * a
              , d = i + 2
              , c = e + 2
              , s = s * d / r
              , g = c + s
              , u = d + s;
            for (let t = 0; t < this.texL; t++) {
                var m = 12 === t
                  , v = Math.floor(t / 5)
                  , f = v % 2 == 1
                  , v = v - 2
                  , R = Math.abs(v)
                  , x = t % 5
                  , w = x - 2
                  , x = (this.y[t] = f ? -(n - l + (4 - x) * p + R * a + 20) : n + x * p + R * a + 20,
                .5 * (i - r) + v * o)
                  , R = .5 * (i - d) + v * u
                  , v = .5 * (e - c) + w * g - (f ? .5 * g : 0)
                  , x = (this.tex[t] = {
                    x: x - R,
                    y: .5 * (e - a) + w * h - (f ? l : 0) - v,
                    w: r - d,
                    h: a - c,
                    scale: m ? .5 : 0
                },
                m ? this.texMain : this.texLoad[t]);
                x.lerp.x = R,
                x.lerp.y = v,
                x.lerp.w = d,
                x.lerp.h = c,
                x.intro.x = this.tex[t].x,
                x.intro.y = this.tex[t].y,
                x.intro.w = this.tex[t].w,
                x.intro.h = this.tex[t].h,
                x.intro.scale = this.tex[t].scale
            }
            this.isHome && (s = t.e.ho.gl.data.in.small,
            this.bottomY = e + s.gap.x - s.y)
        }
    }
    fx(t) {
        var i = _A.config.isLocal;
        if (this.isHome)
            for (let t = 0; t < this.texSmallL; t++)
                (0 === t ? this.texSmall : this.texLarge)[9 * t].intro.y = this.bottomY;
        let e = 5e3
          , s = t.delay;
        i && (e = 1,
        s = 0);
        const a = R.Ease4([.8, 0, .1, 1])
          , h = R.Ease4([.72, 0, .11, 1]);
        this.introFx = new R.M({
            d: e,
            e: "linear",
            delay: s,
            update: t=>{
                this.moving = !0;
                var t = t.prog
                  , i = a(R.iLerp(0, .65, t))
                  , e = h(R.iLerp(.4, 1, t));
                for (let t = 0; t < this.texL; t++) {
                    var s = 12 === t ? this.texMain : this.texLoad[t]
                      , r = R.Lerp(this.y[t], 0, i);
                    s.intro.x = R.Lerp(this.tex[t].x, 0, e),
                    s.intro.y = R.Lerp(this.tex[t].y, 0, e) + r,
                    s.intro.w = R.Lerp(this.tex[t].w, 0, e),
                    s.intro.h = R.Lerp(this.tex[t].h, 0, e),
                    s.intro.scale = R.Lerp(this.tex[t].scale, 0, e)
                }
            }
            ,
            cb: t=>{
                this.moving = !1
            }
        });
        let r = [];
        if (this.isHome) {
            let t = 1500
              , e = 3200
              , s = 50;
            i && (t = 1,
            e = 0,
            s = 0);
            for (let i = 0; i < this.texSmallL; i++)
                r[i] = new R.M({
                    d: t,
                    e: "o6",
                    delay: e + s * i,
                    update: t=>{
                        this.moving = !0,
                        (0 === i ? this.texSmall : this.texLarge)[9 * i].intro.y = R.Lerp(this.bottomY, 0, t.progE)
                    }
                    ,
                    cb: t=>{
                        this.moving = !1
                    }
                })
        }
        return {
            play: t=>{
                if (this.introFx.play(),
                this.isHome)
                    for (let t = 0; t < this.texSmallL; t++)
                        r[t].play()
            }
        }
    }
}
class Active {
    constructor() {
        this.page = ["ho", "ab"]
    }
    intro() {
        this.nav = R.G.class("nav-a"),
        this.up()
    }
    up() {
        var t = _A
          , i = t.route.old.page
          , i = (i && this.upC(i, "remove"),
        t.route.new.page);
        this.upC(i, "add")
    }
    upC(t, i) {
        t = this.page.indexOf(t);
        -1 < t && (R.PE["add" === i ? "none" : "all"](this.nav[t]),
        this.nav[t].classList[i]("on"))
    }
}
class Obj {
    constructor(t) {
        var i = t.index
          , e = t.delay;
        this.propArr = t.prop,
        this.propArrL = this.propArr.length,
        this.prop = [],
        this.prog = {
            show: {
                start: i * e,
                end: 1 - (t.length - 1 - i) * e
            },
            hide: {
                start: 0,
                end: 1
            }
        },
        this.curr = [];
        for (let t = 0; t < this.propArrL; t++) {
            var s = this.propArr[t];
            this.curr[t] = s[1],
            this.prop[t] = {
                round: "y" === s[0] || "x" === s[0] ? 3 : 6
            }
        }
    }
    prepare(i) {
        this.isShow = i.isShow;
        var e = i.isRunning;
        for (let t = 0; t < this.propArrL; t++) {
            var s = this.propArr[t]
              , r = s[1]
              , a = s[2];
            "opacity" === s[0] ? this.isShow ? (this.prop[t].start = e ? this.curr[t] : r,
            this.prop[t].end = a) : (this.prop[t].start = this.curr[t],
            this.prop[t].end = r) : this.isShow ? (this.prop[t].start = e ? this.curr[t] : r,
            this.prop[t].end = 0) : (this.prop[t].start = this.curr[t],
            this.prop[t].end = i.propEndIsEnd ? a : r)
        }
        var t = this.isShow && !e ? this.prog.show : this.prog.hide;
        this.prog.start = t.start,
        this.prog.end = t.end
    }
    loop(t) {
        var i = t.el
          , e = t.elL
          , s = [0, 0]
          , r = R.Remap(this.prog.start, this.prog.end, 0, 1, t.prog)
          , a = t.rEase(r);
        let h = ""
          , o = "";
        for (let t = 0; t < this.propArrL; t++) {
            var l = this.propArr[t][0]
              , n = this.prop[t];
            this.curr[t] = R.R(R.Lerp(n.start, n.end, a), n.round),
            "y" === l ? s[1] = this.curr[t] : "x" === l ? s[0] = this.curr[t] : "rotateX" === l ? h = " rotateX(" + this.curr[t] + "deg)" : "opacity" === l && (o = this.curr[t])
        }
        for (let t = 0; t < e; t++) {
            var p = i[t].style;
            p.transform = "translate3d(" + s[0] + "%," + s[1] + "%,0)" + h,
            "" !== o && (p.opacity = o)
        }
    }
}
class ObjArr {
    constructor(t) {
        this.a = _A,
        this.delay = t.delay;
        var i = t.el
          , e = t.descendant
          , s = t.prop
          , r = t.indexStart
          , a = (this.random = t.random,
        this.length = t.length,
        this.element = [],
        this.elementL = [],
        this.obj = [],
        this.objL = i.length,
        this.randUniq = [],
        t.objLength);
        for (let t = 0; t < this.objL; t++)
            this.element[t] = 2 === e ? i[t].children : [i[t]],
            this.elementL[t] = this.element[t].length,
            this.obj[t] = new Obj({
                index: r + t,
                length: a,
                delay: this.delay,
                prop: s
            }),
            this.randUniq[t] = t
    }
    prepare(i) {
        !i.isRunning && this.random && (this.randUniq = R.Rand.uniq(this.objL));
        for (let t = 0; t < this.objL; t++)
            this.obj[t].prepare(i)
    }
    loop(t) {
        var i = t.prog
          , e = t.rEase;
        for (let t = 0; t < this.objL; t++)
            this.obj[t].loop({
                el: this.element[this.randUniq[t]],
                elL: this.elementL[t],
                prog: i,
                rEase: e
            })
    }
}
class Anima {
    constructor(t) {
        this.a = _A,
        this.delay = t.delay || 0;
        var i = t.lineStartTogether || !1
          , e = t.descendant
          , s = t.random || !1;
        let r = t.el;
        R.Is.und(r.length) && (r = [r]),
        this.lineL = r.length;
        var a = t.prop
          , t = (this.start = a[0][1],
        this.objLength = this.lineL,
        r[0].children);
        0 < e && 1 === this.lineL && 1 < t.length && (this.objLength = t.length),
        this.line = [];
        let h = 0;
        for (let t = 0; t < this.lineL; t++) {
            var o = 0 === e ? [r[t]] : r[t].children;
            this.line[t] = new ObjArr({
                length: this.lineL,
                objLength: this.objLength,
                indexStart: h,
                descendant: e,
                el: o,
                prop: a,
                delay: this.delay,
                random: s
            }),
            i || (h += this.line[t].objL)
        }
    }
    motion(t) {
        R.Is.def(this.letterAnim) && this.letterAnim.pause();
        var i = "show" === t.action
          , e = t.d;
        const s = R.Ease[t.e]
          , r = this.line
          , a = this.lineL;
        var h = r[0].obj[0].curr[0];
        let o = !1
          , l = (i || (o = this.start < 0 && 0 < h || 0 < this.start && h < 0 || Math.abs(h) < Math.abs(.3 * this.start)),
        t.delay);
        i && this.isRunning && (l = 0);
        for (let t = 0; t < a; t++)
            r[t].prepare({
                isShow: i,
                isRunning: this.isRunning,
                propEndIsEnd: o
            });
        h = i ? 1 - (this.objLength - 1) * this.delay : 1;
        return this.letterAnim = new R.M({
            delay: l,
            d: e / h,
            update: t=>{
                var i = t.prog;
                for (let t = 0; t < a; t++)
                    r[t].loop({
                        prog: i,
                        rEase: s
                    })
            }
            ,
            cb: t=>{
                this.isRunning = !1
            }
        }),
        {
            play: t=>{
                this.isRunning = !0,
                this.letterAnim.play()
            }
        }
    }
}
let Fx$3 = class {
    intro() {
        var t = R.G.id("nav");
        this.fx = new Anima({
            descendant: 2,
            el: t,
            prop: [["y", 110, -110]],
            delay: .05
        })
    }
    show(t) {
        var i = _A
          , e = i.config.isLocal && i.introducing
          , s = t.mutation;
        let r = t.delay
          , a = 1500;
        (s && i.fromBack || e) && (r = 0,
        a = 0);
        const h = this.fx.motion({
            action: "show",
            d: a,
            e: "o6",
            delay: r,
            reverse: !1
        });
        return {
            play: t=>{
                h.play()
            }
        }
    }
    hide(t) {
        var i = _A
          , e = t.mutation;
        let s = t.delay
          , r = 500
          , a = "o2";
        e && (i.fromBack ? (s = 0,
        r = 0) : (r = 600,
        a = "i3"));
        const h = this.fx.motion({
            action: "hide",
            d: r,
            e: a,
            delay: s,
            reverse: !1
        });
        return {
            play: t=>{
                h.play()
            }
        }
    }
}
;
class Nav {
    constructor() {
        this.active = new Active,
        this.fx = new Fx$3
    }
    intro() {
        this.active.intro(),
        this.fx.intro()
    }
}
class GLData {
    init() {
        var t = _A
          , t = (this.url = t.route.new.url,
        t.rgl._);
        this.largeL = t.large.planeL,
        this.smallL = t.small.planeL
    }
    resize() {
        var t = _A
          , i = t.win
          , i = (this.winW = i.w,
        this.winH = i.h,
        t.isOver169 ? t.winHpsdH : t.winWpsdW)
          , t = R.R(76 * i, 0)
          , e = R.R(9 * t / 16);
        this.in = {
            large: {
                x: -1,
                y: -1,
                w: this.winW + 2,
                h: this.winH + 2
            },
            small: {
                x: R.R(this.winW - 40 - t, 0),
                y: R.R(this.winH - 40 - e, 0),
                w: t,
                h: e,
                gap: {
                    x: R.R(5 * i, 0)
                }
            }
        },
        this.out = {
            gap: {
                x: R.R(30 * i, 0)
            },
            w: R.R(350 * i, 0),
            h: R.R(500 * i, 0)
        },
        this.out.y = .5 * (this.winH - this.out.h),
        this.out.x = .5 * (this.winW - this.out.w),
        this.out.gapXW = this.out.w + this.out.gap.x,
        this.out.max = this.out.w * (this.smallL - 1) + this.out.gap.x * (this.smallL - 1)
    }
    _in(t) {
        var i = _A.index
          , e = this.in.large
          , s = this.in.small
          , r = t.delay
          , a = [];
        for (let t = 0; t < this.largeL; t++) {
            var h = t % this.smallL
              , o = Math.floor(t / this.smallL)
              , l = a[t] = {
                scale: 1,
                opacity: 1,
                pY: 0,
                _delay: 0
            };
            r && (l._delay = 40 * Math.max(Math.abs(h - i) - 1, 0)),
            o === i ? (l.y = e.y,
            l.h = e.h,
            h === i ? (l.x = e.x,
            l.w = e.w) : (l.x = h < i ? e.x : e.x + e.w,
            l.w = 0)) : (l.x = s.x - (s.w + s.gap.x) * (this.smallL - 1 - o),
            l.y = s.y,
            l.h = s.h,
            l.w = h === o ? s.w : 0)
        }
        var n = [];
        for (let t = 0; t < this.smallL; t++) {
            var p = n[t] = {};
            p.x = s.x - (s.w + s.gap.x) * (this.smallL - 1 - t),
            p.w = s.w,
            p.h = s.h,
            p.scale = 1,
            p.opacity = 1,
            t === i ? p.y = s.y : p.y = this.winH + s.gap.x,
            p.pY = 0,
            p._delay = 0,
            r && (p._delay = 240)
        }
        return {
            large: a,
            small: n
        }
    }
    _out(t) {
        var i = _A.index
          , e = this.in.small
          , s = this.out
          , r = t.delay
          , a = [];
        for (let t = 0; t < this.largeL; t++) {
            var h = t % this.smallL
              , o = Math.floor(t / this.smallL)
              , l = a[t] = {};
            l.y = s.y,
            h === o ? (l.w = s.w,
            l.x = s.x + (s.w + s.gap.x) * o) : (l.w = 0,
            l.x = i < h ? s.x + (s.w + s.gap.x) * o + s.w : s.x + (s.w + s.gap.x) * o),
            l.h = s.h,
            l.scale = 1.25,
            l.opacity = 1,
            l.pY = 0,
            l._delay = 0,
            r && (l._delay = o === i ? 0 : 40 * h)
        }
        var n = [];
        for (let t = 0; t < this.smallL; t++) {
            var p = n[t] = {};
            p.x = e.x - (e.w + e.gap.x) * (this.smallL - 1 - t),
            p.y = this.winH + e.gap.x,
            p.w = e.w,
            p.h = e.h,
            p.scale = 1,
            p.opacity = 1,
            p.pY = 0,
            p._delay = 0
        }
        return {
            large: a,
            small: n
        }
    }
}
let GL$1 = class {
    constructor() {
        this.moving = !1,
        this.easing = !1,
        this.data = new GLData
    }
    initB() {
        var t = _A
          , i = (this.url = t.route.new.url,
        t.rgl._.large)
          , t = t.rgl._.small;
        this.texLarge = i.plane,
        this.texLargeL = i.planeL,
        this.texSmall = t.plane,
        this.texSmallL = t.planeL,
        this.prop = i.lerp.prop,
        this.propL = i.lerp.propL,
        this.unequal = i.unequal,
        this.small = {
            curr: [],
            targ: [],
            _delay: []
        },
        this.large = {
            curr: [],
            targ: [],
            _delay: []
        },
        this.pgn = R.G.id("h-pgn-left"),
        this._pgn = {
            curr: 0,
            targ: 0
        },
        this.cross = R.G.id("h-cross").children,
        this.crossR = 0,
        this.indexOver = -1,
        this.mutationFx = [],
        this.pX = {
            curr: [],
            targ: []
        };
        for (let t = 0; t < this.texSmallL; t++)
            this.pX.curr[t] = 0,
            this.pX.targ[t] = 0;
        this.zIndex(),
        this.data.init(),
        this.resizeB()
    }
    initA() {
        this.resizeA()
    }
    resizeB() {
        var t = _A
          , t = (this.data.resize(),
        this.outGapXW = this.data.out.gapXW,
        this.prlxNorm = t.winSemi.w + .5 * this.data.out.w,
        this.max = this.data.out.max,
        _A.index);
        this.pgnH = this.pgn.parentNode.offsetHeight,
        this._pgn.curr = t * this.pgnH,
        this._pgn.targ = t * this.pgnH
    }
    resizeA() {
        var t = _A;
        this._set({
            _: ["curr", "targ"],
            value: this.data["_" + t.mode]({
                delay: !1
            }),
            delay: !1
        }),
        this.texSet()
    }
    over() {
        var t = _A
          , e = t.index
          , s = t.mode
          , r = t.cursor.x
          , a = t.cursor.y;
        this.indexOver = -1;
        for (let i = 0; i < this.texSmallL; i++) {
            let t;
            var h = r >= (t = (i === e && "in" === s ? this.texSmall[i] : (h = i * this.texSmallL + i,
            this.texLarge[h])).lerp).x && r <= t.x + t.w
              , o = a >= t.y && a <= t.y + t.h;
            if (h && o) {
                if ("in" === s) {
                    this.indexOver = i;
                    break
                }
                if ("out" === s) {
                    this.indexOver = i;
                    break
                }
            }
        }
    }
    inSlide(i) {
        var e = _A
          , s = e.index;
        if (this.indexOver !== s) {
            let t;
            -1 < this.indexOver ? (t = this.indexOver,
            this.slide(t)) : i.pageX > e.winSemi.w ? s < 7 && (t = s + 1,
            this.slide(t)) : 0 < s && (t = s - 1,
            this.slide(t))
        }
    }
    arrowSlide(t) {
        var i = _A.index;
        0 === i && -1 === t || 7 === i && 1 === t || this.slide(i + t)
    }
    slide(e) {
        var t = _A
          , i = t.mode
          , s = t.index
          , r = e;
        for (let t = 0; t < this.propL; t++) {
            var a = r
              , h = 8 * r + r
              , o = this.prop[t];
            this.small.curr[a][o] = this.large.curr[h][o],
            this.small.targ[a][o] = this.large.targ[h][o]
        }
        var e = 8 * r
          , l = 8 + e;
        for (let t = e; t < l; t++) {
            var n = t
              , p = t - 8 * (r - s);
            for (let t = 0; t < this.propL; t++) {
                var d = this.prop[t];
                this.large.curr[n][d] = this.large.curr[p][d],
                this.large.targ[n][d] = this.large.targ[p][d]
            }
        }
        var e = 8 * s
          , c = 8 + e;
        for (let i = e; i < c; i++) {
            var g = i % this.texSmallL
              , u = Math.floor(i / this.texSmallL);
            for (let t = 0; t < this.propL; t++) {
                var m = this.prop[t];
                "w" === m ? (this.large.curr[i][m] = u === g ? this.small.curr[s][m] : 0,
                this.large.targ[i][m] = u === g ? this.small.targ[s][m] : 0) : (this.large.curr[i][m] = this.small.curr[s][m],
                this.large.targ[i][m] = this.small.targ[s][m])
            }
        }
        var e = _A.win.h + this.data.in.small.gap.x
          , e = (this.small.curr[s].y = e,
        this.small.targ[s].y = e,
        t.index = r,
        this.zIndex(),
        s < r ? 1 : -1)
          , e = (this.crossR += 90 * e,
        this.cross[0].style.transform = "rotate(" + this.crossR + "deg)",
        this.cross[1].style.transform = "rotate(" + this.crossR + "deg)",
        t.e.ho.fxTitle.hide({
            index: s,
            delay: 0
        }))
          , v = t.e.ho.fxTitle.show({
            index: r,
            delay: 300
        });
        this._pgn.targ = r * this.pgnH,
        R.Is.def(t.e.load.introFx) && (t.e.load.introFx.pause(),
        (t = this.texLarge[0]).intro.x = 0,
        t.intro.y = 0,
        t.intro.w = 0,
        t.intro.h = 0,
        t.intro.scale = 0),
        this._set({
            _: ["targ"],
            value: this.data["_" + i]({
                delay: !1
            }),
            delay: !1
        }),
        e.play(),
        v.play()
    }
    change(t) {
        var i = _A
          , e = i.index
          , s = "in" === t
          , t = (i.mode = t,
        this._pgn.targ = e * this.pgnH,
        s ? "show" : "hide")
          , t = i.e.ho.fxTitle[t]({
            index: e,
            delay: s ? 240 : 0
        })
          , r = s ? 500 : 0
          , a = s ? "show" : "hide"
          , h = i.e.ho.fxCross.middle({
            a: s ? "hide" : "show",
            delay: s ? 0 : 300
        })
          , a = i.e.ho.fxCross.side({
            a: a,
            delay: r
        });
        this.zIndex();
        let o;
        s ? (o = -R.R(i.e.s._[this.url].curr),
        i.e.s.sUpAll(0)) : (o = R.Clamp(this.outGapXW * e, 0, this.data.out.max),
        i.e.s.sUpAll(o));
        for (let t = 0; t < this.texLargeL; t++)
            this.large.curr[t].x += o,
            this.large.targ[t].x += o;
        this._set({
            _: ["targ"],
            value: this.data["_" + i.mode]({
                delay: !0
            }),
            delay: !0
        }),
        h.play(),
        a.play(),
        t.play()
    }
    loop() {
        this.over(),
        this.texSet()
    }
    texSet() {
        var t = _A
          , i = "out" === t.mode
          , e = t.lerpP
          , s = t.e.s._[this.url].curr;
        i && (t = Math.floor(s / (this.data.out.w + this.data.out.gap.x) + .5),
        this._pgn.targ = t * this.pgnH),
        this._pgn.curr = R.Damp(this._pgn.curr, this._pgn.targ, e),
        R.T(this.pgn, 0, R.R(-this._pgn.curr), "px"),
        this.moving = this.easing;
        for (let t = 0; t < this.texLargeL; t++) {
            var r = this.texLarge[t]
              , a = this.large.curr[t]
              , h = this.large.targ[t];
            for (let t = 0; t < this.propL; t++) {
                var o = this.prop[t];
                this.unequal({
                    prop: o,
                    a: a,
                    b: h
                }) && (a[o] = R.Damp(a[o], h[o], e),
                this.moving = !0),
                r.lerp[o] = a[o],
                "x" === o && (r.lerp[o] -= s)
            }
        }
        for (let t = 0; t < this.texSmallL; t++) {
            var l = this.texSmall[t]
              , n = this.small.curr[t]
              , p = this.small.targ[t];
            for (let t = 0; t < this.propL; t++) {
                var d = this.prop[t];
                this.unequal({
                    prop: d,
                    a: n,
                    b: p
                }) && (n[d] = R.Damp(n[d], p[d], e),
                this.moving = !0),
                l.lerp[d] = n[d]
            }
        }
        for (let t = 0; t < this.texSmallL; t++) {
            i ? (this.pX.targ[t] = -.25 * R.Clamp((s - this.data.out.gapXW * t) / this.prlxNorm, -1, 1),
            this.pX.curr[t] = this.pX.targ[t]) : (this.pX.targ[t] = 0,
            this.pX.curr[t] = R.Damp(this.pX.curr[t], this.pX.targ[t], e)),
            0 !== R.R(Math.abs(this.pX.curr[t] - this.pX.targ[t]), 6) && (this.moving = !0);
            var c = t * this.texSmallL + t;
            this.texLarge[c].lerp.pX = this.pX.curr[t]
        }
    }
    _set(t) {
        var i = t._
          , s = i.length
          , r = t.value
          , a = t.delay;
        for (let e = 0; e < this.texSmallL; e++) {
            const p = r.small[e];
            var h = a ? p._delay : 0;
            for (let t = 0; t < s; t++) {
                const d = this.small[i[t]];
                var o = this.small._delay;
                R.Is.def(o[e]) && o[e].stop(),
                o[e] = new R.Delay(t=>{
                    d[e] = {};
                    for (let t = 0; t < this.propL; t++) {
                        var i = this.prop[t];
                        d[e][i] = p[i]
                    }
                }
                ,h),
                o[e].run()
            }
        }
        for (let e = 0; e < this.texLargeL; e++) {
            const c = r.large[e];
            var l = a ? c._delay : 0;
            for (let t = 0; t < s; t++) {
                const g = this.large[i[t]];
                var n = this.large._delay;
                R.Is.def(n[e]) && n[e].stop(),
                n[e] = new R.Delay(t=>{
                    g[e] = {};
                    for (let t = 0; t < this.propL; t++) {
                        var i = this.prop[t];
                        g[e][i] = c[i]
                    }
                }
                ,l),
                n[e].run()
            }
        }
    }
    hide() {
        var i = _A;
        const a = i.win.h
          , h = "in" === i.mode
          , o = (h || (i.index = Math.floor(i.e.s._[this.url].curr / (this.data.out.w + this.data.out.gap.x) + .5)),
        i.index)
          , l = a + this.data.in.small.gap.x - this.data.in.small.y
          , n = -(this.data.out.y + this.data.out.h + this.data.out.gap.x);
        let e = 1300;
        i.fromBack && (e = 1);
        var s = [];
        let r = 0
          , p = 0;
        for (let t = 0; t < this.texSmallL; t++) {
            var d = t === this.texSmallL - 1;
            i.fromBack ? s[t] = d ? 1 : 0 : h ? s[t] = 40 * t : s[t] = 20 * Math.abs(t - Math.max(o - 2, 0)),
            s[t] >= p && (p = s[t],
            r = t)
        }
        var c = t=>{
            this.reset()
        }
        ;
        this.mutationFxPause();
        const g = [];
        for (let t = 0; t < this.texSmallL; t++)
            g[t] = this.texSmall[t].ease.y;
        const u = [];
        for (let t = 0; t < this.texLargeL; t++)
            u[t] = this.texLarge[t].ease.y;
        for (let t = 0; t < this.texSmallL; t++) {
            var m = t === r && c;
            const v = this.texSmallL * t;
            this.mutationFx[t] = new R.M({
                d: e,
                e: [.64, 0, .12, 1],
                delay: s[t],
                update: i=>{
                    if (this.easing = !0,
                    this.moving = !0,
                    this.texSmall[t].ease.y = R.Lerp(g[t], l, i.progE),
                    h) {
                        if (0 === t)
                            for (let t = 0; t < this.texSmallL; t++) {
                                var e = t + this.texSmallL * o;
                                this.texLarge[e].ease.y = R.Lerp(u[e], -(a + 2), i.progE),
                                this.texLarge[e].ease.pY = R.Lerp(0, -.6, i.progE)
                            }
                        if (t !== o)
                            for (let t = 0; t < this.texSmallL; t++) {
                                var s = t + v;
                                this.texLarge[s].ease.y = R.Lerp(u[s], l, i.progE)
                            }
                    } else
                        for (let t = 0; t < this.texSmallL; t++) {
                            var r = t + v;
                            this.texLarge[r].ease.y = R.Lerp(u[r], n, i.progE)
                        }
                }
                ,
                cb: m
            })
        }
        return {
            play: t=>{
                for (let t = 0; t < this.texSmallL; t++)
                    this.mutationFx[t].play()
            }
        }
    }
    show() {
        const a = _A;
        var i = a.index
          , t = a.win.h;
        const h = "in" === a.mode;
        var e = this.data.in.small;
        const o = t + e.gap.x - e.y
          , l = this.data.out.y + this.data.out.h;
        let s = 1300;
        a.fromBack && (s = 1);
        var r = [];
        let n = 0
          , p = 0;
        for (let t = 0; t < this.texSmallL; t++) {
            var d = t === this.texSmallL - 1;
            a.fromBack ? r[t] = d ? 1 : 0 : h ? r[t] = 40 * t : r[t] = 20 * Math.abs(t - Math.max(i - 2, 0)),
            r[t] >= p && (p = r[t],
            n = t)
        }
        const c = this.texSmallL * i + i;
        h && (this.texLarge[c].ease.scale = .15);
        var g = t=>{
            this.reset()
        }
        ;
        this.mutationFxPause();
        for (let t = 0; t < this.texSmallL; t++) {
            var u = t === n && g;
            const f = this.texSmallL * t;
            if (this.texSmall[t].ease.y = o,
            h) {
                if (t !== i)
                    for (let t = 0; t < this.texSmallL; t++) {
                        var m = t + f;
                        this.texLarge[m].ease.y = o
                    }
            } else
                for (let t = 0; t < this.texSmallL; t++) {
                    var v = t + f;
                    this.texLarge[v].ease.y = l
                }
            this.mutationFx[t] = new R.M({
                d: s,
                e: "o6",
                delay: r[t],
                update: i=>{
                    if (this.easing = !0,
                    this.moving = !0,
                    this.texSmall[t].ease.y = R.Lerp(o, 0, i.progE),
                    h) {
                        if (0 === t) {
                            for (let t = 0; t < this.texSmallL; t++) {
                                var e = t + this.texSmallL * a.index;
                                this.texLarge[e].ease.y = 0,
                                this.texLarge[e].ease.pY = 0
                            }
                            this.texLarge[c].ease.scale = R.Lerp(.15, 0, i.progE)
                        }
                        if (t !== a.index)
                            for (let t = 0; t < this.texSmallL; t++) {
                                var s = t + f;
                                this.texLarge[s].ease.y = R.Lerp(o, 0, i.progE)
                            }
                    } else
                        for (let t = 0; t < this.texSmallL; t++) {
                            var r = t + f;
                            this.texLarge[r].ease.y = R.Lerp(l, 0, i.progE)
                        }
                }
                ,
                cb: u
            })
        }
        return {
            play: t=>{
                for (let t = 0; t < this.texSmallL; t++)
                    this.mutationFx[t].play()
            }
        }
    }
    mutationFxPause() {
        for (let t = 0; t < this.texSmallL; t++)
            R.Is.def(this.mutationFx[t]) && this.mutationFx[t].pause()
    }
    reset() {
        for (let t = 0; t < this.texLargeL; t++)
            this.texLarge[t].lerp.h = 0,
            this.texLarge[t].ease.y = 0,
            this.texLarge[t].ease.pY = 0,
            this.texLarge[t].ease.scale = 0;
        for (let t = 0; t < this.texSmallL; t++)
            this.texSmall[t].lerp.h = 0,
            this.texSmall[t].ease.y = 0,
            this.texSmall[t].ease.pY = 0,
            this.texLarge[t].ease.scale = 0;
        this.moving = !1,
        this.easing = !1
    }
    zIndex() {
        for (let t = 0; t < this.texLargeL; t++) {
            var i = Math.floor(t / this.texSmallL);
            this.texLarge[t].zIndex = i === _A.index ? 0 : 1
        }
    }
}
;
class FxTitle {
    init() {
        this.title = R.G.class("h-title"),
        this.fx = [];
        for (let t = 0; t < 8; t++)
            this.fx[t] = new Anima({
                descendant: 1,
                el: this.title[t],
                prop: [["y", 140, -140]]
            })
    }
    show(i) {
        var t = _A
          , e = t.config.isLocal && t.introducing
          , s = i.mutation;
        let r = i.delay
          , a = 1500;
        (s && t.fromBack || e) && (r = 0,
        a = 0);
        const h = this.fx[i.index].motion({
            action: "show",
            d: a,
            e: "o6",
            delay: r,
            reverse: !1
        });
        return {
            play: t=>{
                R.PE.all(this.title[i.index]),
                h.play()
            }
        }
    }
    hide(i) {
        var t = _A
          , e = i.mutation;
        let s = i.delay
          , r = 500
          , a = "o2";
        e && (t.fromBack ? (s = 0,
        r = 0) : (r = 600,
        a = "i3"));
        const h = this.fx[i.index].motion({
            action: "hide",
            d: r,
            e: a,
            delay: s,
            reverse: !1
        });
        return {
            play: t=>{
                R.PE.none(this.title[i.index]),
                h.play()
            }
        }
    }
}
class FxCross {
    init() {
        this.svg = R.G.id("h-cross").children,
        this.coord = {
            hide: ["11,11.75 11,11.75 11,10.249 11,10.249 11,11", "11.75,11 11.75,11 10.249,11 10.249,11 11,10.999"],
            show: ["22,11.751 0,11.751 0,10.249 22,10.249 22,11", "11.751,0 11.751,22 10.249,22 10.249,0 11,0"]
        },
        this.morph = [];
        for (let t = 0; t < 3; t++)
            this.morph[t] = []
    }
    middle(i) {
        var t = _A
          , e = "show" === i.a
          , s = i.mutation
          , r = t.config.isLocal && t.introducing;
        let a = i.delay
          , h = e ? 1200 : 250;
        var o = e ? "o6" : "o2";
        (s && t.fromBack || r) && (a = 0,
        h = 0);
        for (let t = 0; t < 2; t++)
            R.Is.def(this.morph[2][t]) && this.morph[2][t].pause(),
            this.morph[2][t] = new R.M({
                el: this.svg[2].children[0].children[t],
                svg: {
                    type: "polygon",
                    end: this.coord[i.a][t]
                },
                d: h,
                e: o,
                delay: a,
                r: 6
            });
        return {
            play: t=>{
                for (let t = 0; t < 2; t++)
                    this.morph[2][t].play()
            }
        }
    }
    side(e) {
        var t = _A
          , i = "show" === e.a
          , s = e.mutation
          , r = t.config.isLocal && t.introducing;
        let a = e.delay
          , h = i ? 1200 : 250;
        var o = i ? "o6" : "o2";
        (s && t.fromBack || r) && (a = 0,
        h = 0);
        for (let i = 0; i < 2; i++)
            for (let t = 0; t < 2; t++)
                R.Is.def(this.morph[i][t]) && this.morph[i][t].pause(),
                this.morph[i][t] = new R.M({
                    el: this.svg[i].children[0].children[t],
                    svg: {
                        type: "polygon",
                        end: this.coord[e.a][t]
                    },
                    d: h,
                    e: o,
                    delay: a,
                    r: 6
                });
        return {
            play: t=>{
                for (let i = 0; i < 2; i++)
                    for (let t = 0; t < 2; t++)
                        this.morph[i][t].play()
            }
        }
    }
}
class FxPgn {
    init() {
        this.left = new Anima({
            descendant: 0,
            el: R.G.id("h-pgn-left-w"),
            prop: [["x", -110, -110]],
            delay: 0
        }),
        this.right = new Anima({
            descendant: 0,
            el: R.G.id("h-pgn-right"),
            prop: [["x", 110, 110]],
            delay: 0
        }),
        this.scale = new R.M({
            el: "#h-pgn-middle",
            p: {
                scaleX: [0, 1]
            },
            r: 6
        })
    }
    show(t) {
        var i = _A
          , e = t.mutation
          , s = i.config.isLocal && i.introducing;
        let r = t.delay
          , a = 1500;
        (e && i.fromBack || s) && (r = 0,
        a = 0);
        const h = this.left.motion({
            action: "show",
            d: a,
            e: "o6",
            delay: r,
            reverse: !1
        })
          , o = this.right.motion({
            action: "show",
            d: a,
            e: "o6",
            delay: r,
            reverse: !1
        });
        return {
            play: t=>{
                this.scale.play({
                    d: a,
                    e: "o6",
                    delay: r
                }),
                h.play(),
                o.play()
            }
        }
    }
    hide(t) {
        var i = _A
          , e = t.mutation;
        let s = t.delay
          , r = 500
          , a = "o2";
        e && (i.fromBack ? (s = 0,
        r = 0) : (r = 600,
        a = "i3"));
        const h = this.left.motion({
            action: "hide",
            d: r,
            e: a,
            delay: s,
            reverse: !1
        })
          , o = this.right.motion({
            action: "hide",
            d: r,
            e: a,
            delay: s,
            reverse: !1
        });
        return {
            play: t=>{
                this.scale.play({
                    d: r,
                    e: a,
                    delay: s,
                    reverse: !0
                }),
                h.play(),
                o.play()
            }
        }
    }
}
class Over {
    constructor() {
        R.BM(this, ["fn"])
    }
    init() {
        this.no = R.G.class("h-title-no"),
        this.fx = [],
        this.visible = [];
        for (let t = 0; t < 8; t++)
            this.fx[t] = new Anima({
                descendant: 1,
                el: this.no[t],
                prop: [["y", 112, -112]]
            }),
            this.visible[t] = !1
    }
    fn(t) {
        var i = "mouseenter" === t.type
          , t = R.Index.class(t.target, "h-title-a")
          , e = i ? "show" : "hide"
          , s = i ? 1200 : 300
          , r = i ? "o6" : "o2";
        this.visible[t] = i,
        this.fx[t].motion({
            action: e,
            d: s,
            e: r,
            delay: 0,
            reverse: !1
        }).play()
    }
    hide(t) {
        var i = _A
          , e = t.index;
        if (!this.visible[e])
            return {
                play: t=>{}
            };
        let s = 600;
        t.mutation && i.fromBack && (s = 0);
        const r = this.fx[e].motion({
            action: "hide",
            d: s,
            e: "i3",
            delay: 0,
            reverse: !1
        })
          , a = new R.M({
            el: this.no[e],
            p: {
                y: [0, -300]
            },
            d: s,
            e: "i3"
        });
        return {
            play: t=>{
                r.play(),
                a.play()
            }
        }
    }
    on() {
        this.l("a")
    }
    off() {
        this.l("r")
    }
    l(t) {
        R.L(".h-title-a", t, "mouseenter", this.fn),
        R.L(".h-title-a", t, "mouseleave", this.fn)
    }
}
class Home {
    constructor() {
        this.gl = new GL$1,
        this.fxTitle = new FxTitle,
        this.fxCross = new FxCross,
        this.fxPgn = new FxPgn,
        this.over = new Over
    }
    initB() {
        this.notRequired = !_A.is.ho,
        this.notRequired || this.gl.initB()
    }
    initA() {
        this.notRequired || (this.gl.initA(),
        this.fxTitle.init(),
        this.fxCross.init(),
        this.fxPgn.init(),
        this.over.init())
    }
    resizeB() {
        this.notRequired || this.gl.resizeB()
    }
    resizeA() {
        this.notRequired || this.gl.resizeA()
    }
    loop() {
        this.notRequired && !this.gl.moving || this.gl.loop()
    }
    on() {
        this.over.on()
    }
    off() {
        this.over.off()
    }
}
class GL {
    constructor() {
        this.moving = !1,
        this.easing = !1
    }
    initB() {
        var t = _A
          , t = (this.url = t.route.new.url,
        t.rgl._[this.url])
          , t = (this.tex = t.plane,
        this.texL = t.planeL,
        this.prop = t.lerp.prop,
        this.propL = t.lerp.propL,
        this.unequal = t.unequal,
        R.G.class("w-footer"))
          , i = R.G.class("w-progress")
          , e = R.G.class("w-footer-exp")
          , s = t.length - 1;
        this.footer = t[s],
        this.progress = i[s],
        this.footerExp = e[s].children[0],
        this.footerExpValue = 0,
        R.T(this.progress, 0, -100),
        this.targ = [],
        this.expand = []
    }
    initA() {
        this.resizeA()
    }
    resizeA() {
        var t = _A
          , i = t.e.s._[this.url].step
          , e = t.win.w
          , s = t.win.h
          , t = t.isOver169 ? t.winHpsdH : t.winWpsdW
          , r = (this.targ[0] = {
            x: 0,
            y: 0,
            w: e,
            h: s,
            scale: 1,
            opacity: 1,
            pY: 0
        },
        this.expand[0] = {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            scale: 0,
            opacity: 0,
            pY: 0
        },
        350 * t)
          , t = 500 * t
          , a = .5 * (e - r)
          , i = this.footer.getBoundingClientRect().top + i + .5 * (s - t)
          , e = e + 2 - r
          , h = s + 2 - t
          , o = -a - 1
          , s = .5 * -(s + 2 - t);
        this.targ[1] = {
            x: a,
            y: i,
            w: r,
            h: t,
            scale: 1.25,
            opacity: 1,
            pY: 0
        },
        this.expand[1] = {
            x: o,
            y: s,
            w: e,
            h: h,
            scale: -.25,
            opacity: 0,
            pY: 0
        },
        this.texSet()
    }
    loop() {
        this.texSet();
        var t = _A
          , i = t.e.s._[this.url]
          , e = t.win.h;
        R.T(this.progress, 0, R.R(R.Lerp(-100, 0, i.curr / t.e.s.max))),
        this.tex[0].lerp.pY = R.Lerp(0, -.3, R.Clamp(i.step, 0, e) / e)
    }
    texSet() {
        var t = _A.e.s._[this.url]
          , i = t.step
          , e = t.expand
          , t = (this.moving = this.easing,
        R.R(100 * e, 0));
        this.footerExpValue !== t && (this.footerExpValue = t,
        this.footerExp.textContent = t);
        for (let t = 0; t < this.texL; t++) {
            var s = this.tex[t]
              , r = this.targ[t]
              , a = this.expand[t];
            for (let t = 0; t < this.propL; t++) {
                var h = this.prop[t];
                s.lerp[h] = r[h] + a[h] * e,
                "y" === h && (s.lerp[h] -= i)
            }
        }
    }
    hide() {
        const i = _A.win.h
          , e = this.tex[0]
          , s = this.tex[1];
        return this.mutationFxPause(),
        {
            play: t=>{
                e.ease.y = i,
                e.ease.pY = 0,
                e.lerp.h = 0,
                s.lerp.h = 0
            }
        }
    }
    showFromHome() {
        var t = _A;
        const i = t.win.h
          , e = this.tex[0];
        let s = 1290;
        return t.fromBack && (s = 1),
        this.mutationFxPause(),
        this.mutationFx = new R.M({
            d: s,
            e: [.64, 0, .12, 1],
            update: t=>{
                this.easing = !0,
                this.moving = !0,
                e.ease.y = R.Lerp(i, 0, t.progE),
                e.ease.pY = R.Lerp(.6, 0, t.progE)
            }
            ,
            cb: t=>{
                this.easing = !1,
                this.moving = !1
            }
        }),
        {
            play: t=>{
                this.mutationFx.play()
            }
        }
    }
    showFromWork() {
        var t = _A;
        const i = t.win.h
          , e = t.rgl._[t.route.new.url].plane[0]
          , s = t.rgl._[t.route.old.url].plane[1];
        let r = 1290;
        t.fromBack && (r = 1),
        this.mutationFxPause(),
        s.ease.y = 0,
        s.ease.pY = 0,
        e.ease.y = i,
        e.ease.pY = .6;
        const a = R.G.class("w-progress")[0];
        return this.mutationFx = new R.M({
            d: r,
            e: [.64, 0, .12, 1],
            update: t=>{
                this.easing = !0,
                this.moving = !0,
                R.T(a, 0, R.Lerp(0, -100, t.progE)),
                s.ease.y = R.Lerp(0, -(i + 2), t.progE),
                s.ease.pY = R.Lerp(0, -.6, t.progE);
                t = R.Ease4([.64, 0, .12, 1])(R.iLerp(0, .99, t.prog));
                e.ease.y = R.Lerp(i, 0, t),
                e.ease.pY = R.Lerp(.6, 0, t)
            }
            ,
            cb: t=>{
                s.lerp.h = 0,
                s.ease.y = 0,
                s.ease.pY = 0,
                this.easing = !1,
                this.moving = !1
            }
        }),
        {
            play: t=>{
                this.mutationFx.play()
            }
        }
    }
    mutationFxPause() {
        R.Is.def(this.mutationFx) && this.mutationFx.pause()
    }
}
class SLine {
    constructor(t) {
        this.el = R.Select.el(t.el)[0],
        this.txt = this.el.innerHTML;
        var t = R.Cr("div")
          , i = (t.innerHTML = this.txt,
        t.childNodes)
          , e = i.length;
        this.arr = [];
        let s = 0;
        for (let t = 0; t < e; t++) {
            var r, a = i[t];
            if (3 === a.nodeType) {
                var h = a.nodeValue.split(" ")
                  , o = h.length;
                for (let t = 0; t < o; t++) {
                    var l = "" === h[t] ? " " : h[t];
                    this.arr[s] = {
                        type: "txt",
                        word: l
                    },
                    s++
                }
            } else
                "BR" === a.tagName ? (this.arr[s] = {
                    type: "br"
                },
                s++) : "A" === a.tagName && (r = a.outerHTML,
                a = a.textContent,
                r = r.split(a),
                this.arr[s] = {
                    type: "a",
                    start: r[0],
                    end: r[1],
                    word: a.split(" ")
                },
                s++)
        }
        this.arrL = this.arr.length
    }
    resize(t) {
        this.el.innerHTML = this.txt;
        var e = this.el.offsetWidth
          , s = R.Cr("div")
          , i = s.style
          , r = (i.visibility = "hidden",
        i.position = "absolute",
        i.whiteSpace = "nowrap",
        window.getComputedStyle(this.el));
        i.fontFamily = this.gPV(r, "font-family"),
        i.fontSize = this.gPV(r, "font-size"),
        i.fontWeight = this.gPV(r, "font-weight"),
        i.letterSpacing = this.gPV(r, "letter-spacing"),
        document.body.prepend(s);
        let a = "";
        var h = [];
        let o = 0
          , l = ""
          , n = "";
        for (let t = 0; t < this.arrL; t++) {
            var p = this.arr[t];
            if ("txt" === p.type) {
                var d = p.word
                  , c = " " === d ? "" : " ";
                s.innerHTML = l + d,
                n = s.offsetWidth >= e ? (h[o++] = n.trim(),
                l = d + c) : (l = l + d + c,
                n + d + c)
            } else if ("a" === p.type) {
                var g = p.start
                  , u = p.end
                  , m = p.word
                  , v = m.length
                  , f = v - 1;
                l = this.rLS(l),
                n = this.rLS(n);
                for (let i = 0; i < v; i++) {
                    var x = m[i]
                      , w = i === f ? "" : " ";
                    if (s.innerHTML = l + x,
                    s.offsetWidth >= e)
                        0 === i ? h[o++] = n.trim() : (n = n.trim() + u,
                        h[o++] = n),
                        l = x + w,
                        n = i === f ? g + x + u + w : g + x + w;
                    else {
                        l = l + x + w;
                        let t = x;
                        0 === i && (t = g + t),
                        i === f && (t += u),
                        n = n + t + w
                    }
                }
            } else
                "br" === p.type && (h[o++] = n.trim(),
                l = "",
                n = "")
        }
        n !== h[o - 1] && "" !== (i = n.trim()) && (h[o++] = i);
        var y = t.tag.start
          , L = t.tag.end;
        for (let t = 0; t < o; t++) {
            var _ = "" === h[t] ? "&nbsp;" : h[t];
            a += y + _ + L
        }
        s.parentNode.removeChild(s),
        this.el.innerHTML = a
    }
    rLS(t) {
        return t.replace(/\s?$/, "")
    }
    gPV(t, i) {
        return t.getPropertyValue(i)
    }
}
class FxHero {
    init() {
        var t = (t = R.G.class("page"))[t.length - 1];
        this.h1 = R.G.class("w-hero-txt-h1", t),
        this.h1L = this.h1.length,
        this.pgnLeft = R.G.class("w-hero-pgn-left", t)[0],
        this.pgnMiddle = R.G.class("w-hero-pgn-middle", t)[0],
        this.pgnRight = R.G.class("w-hero-pgn-right", t)[0],
        this.roleTitle = R.G.class("w-hero-txt-role-title", t)[0].children[0],
        this.roleP = new SLine({
            el: R.G.class("w-hero-txt-role-p", t)[0]
        }),
        this.team = R.G.class("w-hero-txt-team", t),
        this.teamL = this.team.length,
        this.scroll = R.G.class("w-hero-txt-scroll", t)[0].children[0],
        this.arrow = R.G.class("w-hero-txt-icon-arrow", t)[0],
        this.border = R.G.class("w-hero-txt-icon-border-path", t)[0],
        this.visible = !1,
        this.resizeA()
    }
    resizeA() {
        var t = this.visible ? 0 : 110;
        this.roleP.resize({
            tag: {
                start: '<span class="w-hero-txt-role-p-fx"><span style="transform: translate3d(0,' + t + '%,0);">',
                end: "</span></span>"
            }
        }),
        this.pFx = R.G.class("w-hero-txt-role-p-fx", this.roleP.el),
        this.pFxL = this.pFx.length
    }
    show(t) {
        var i = _A
          , e = i.config.isLocal && i.introducing
          , s = t.mutation;
        let r = t.delay
          , a = 70
          , h = 1500
          , o = 1600;
        var l = "o6";
        (s && i.fromBack || e) && (r = 0,
        a = 0,
        h = 0,
        o = 1);
        const n = new R.TL;
        for (let t = 0; t < this.h1L; t++) {
            var p = 0 === t ? r : a;
            n.from({
                el: this.h1[t],
                p: {
                    y: [110, 0]
                },
                d: h,
                e: l,
                delay: p
            })
        }
        n.from({
            el: this.roleTitle,
            p: {
                y: [110, 0]
            },
            d: h,
            e: l,
            delay: a
        });
        for (let t = 0; t < this.pFxL; t++)
            n.from({
                el: this.pFx[t].children[0],
                p: {
                    y: [110, 0]
                },
                d: h,
                e: l,
                delay: a
            });
        for (let t = 0; t < this.teamL; t++)
            n.from({
                el: this.team[t],
                p: {
                    y: [110, 0]
                },
                d: h,
                e: l,
                delay: a
            });
        n.from({
            el: this.scroll,
            p: {
                y: [110, 0]
            },
            d: h,
            e: l
        }),
        n.from({
            el: this.arrow,
            p: {
                opacity: [0, 1]
            },
            d: h,
            e: "o1"
        }),
        n.from({
            el: this.arrow,
            p: {
                y: [-14, 0, "px"]
            },
            d: h,
            e: l
        });
        const d = new R.TL
          , c = (d.from({
            el: this.pgnLeft,
            p: {
                x: [-110, 0]
            },
            d: h,
            e: l,
            delay: r + 2 * a
        }),
        d.from({
            el: this.pgnMiddle,
            p: {
                scaleX: [0, 1]
            },
            d: h,
            e: l,
            r: 6
        }),
        d.from({
            el: this.pgnRight,
            p: {
                x: [110, 0]
            },
            d: h,
            e: l
        }),
        new R.M({
            el: this.border,
            line: {
                start: 0,
                end: 100
            },
            d: o,
            e: "io5",
            delay: r
        }));
        return {
            play: t=>{
                this.visible = !0,
                n.play(),
                d.play(),
                c.play()
            }
        }
    }
}
class FxFooter {
    init() {
        var t = R.G.class("w-footer-link-title")[0].children[0]
          , i = R.G.class("w-footer-link-tagline")[0].children[0]
          , e = R.G.class("w-footer-exp")[0].children[0];
        this.fx0 = new R.M({
            el: e,
            p: {
                y: [0, -110]
            }
        }),
        this.fx1 = new R.M({
            el: i,
            p: {
                y: [0, -110]
            }
        }),
        this.fx2 = new R.M({
            el: t,
            p: {
                y: [0, -110]
            }
        })
    }
    hide(t) {
        var i = _A
          , e = t.mutation;
        let s = t.delay
          , r = t.delay + 20
          , a = t.delay + 26
          , h = 600;
        return e && i.fromBack && (s = 0,
        r = 0,
        a = 0,
        h = 0),
        {
            play: t=>{
                this.fx0.play({
                    d: h,
                    e: "i3",
                    delay: s
                }),
                this.fx1.play({
                    d: h,
                    e: "i3",
                    delay: r
                }),
                this.fx2.play({
                    d: h,
                    e: "i3",
                    delay: a
                })
            }
        }
    }
}
class FxBack {
    init() {
        var t = R.G.class("w-back");
        this.back = t[t.length - 1],
        this.fx = new Anima({
            descendant: 1,
            el: this.back,
            prop: [["y", 110, -110]]
        })
    }
    show(t) {
        var i = _A
          , e = i.config.isLocal && i.introducing
          , s = t.mutation;
        let r = t.delay
          , a = 1500;
        (s && i.fromBack || e) && (r = 0,
        a = 0);
        const h = this.fx.motion({
            action: "show",
            d: a,
            e: "o6",
            delay: r,
            reverse: !1
        });
        return {
            play: t=>{
                R.PE.all(this.back),
                h.play()
            }
        }
    }
    hide(t) {
        var i = _A
          , e = t.mutation;
        let s = t.delay
          , r = 500;
        e && i.fromBack && (s = 0,
        r = 0);
        const a = this.fx.motion({
            action: "hide",
            d: r,
            e: "o2",
            delay: s,
            reverse: !1
        });
        return {
            play: t=>{
                R.PE.none(this.back),
                a.play()
            }
        }
    }
}
let Preview$1 = class {
    init() {
        this.url = _A.route.new.url;
        var t = R.G.class("w-preview-w")
          , t = (this.preview = t[t.length - 1],
        R.G.class("w-preview-area"))
          , t = (this.area = t[t.length - 1],
        R.G.class("w-s"));
        this.section = t[t.length - 1],
        this.resizeA()
    }
    resizeA() {
        var t = _A
          , i = t.win.h
          , t = t.win.w
          , e = parseInt(getComputedStyle(this.section).marginTop, 10)
          , s = this.preview.offsetHeight
          , r = this.section.offsetHeight
          , t = (this.areaRight = t - (this.preview.getBoundingClientRect().left + this.preview.offsetWidth),
        this.prlx = Math.max(s + 2 * this.areaRight - i, 0),
        s / r);
        this.area.style.height = i * t + 7 + "px",
        this.previewMax = r - s,
        this.previewStart = i + e - this.areaRight,
        this.previewEnd = this.previewStart + this.previewMax + this.prlx,
        0 < this.prlx ? this.areaMax = r - (i - 2 * this.areaRight) : this.areaMax = this.previewMax,
        this.areaMax *= t
    }
    loop() {
        var t = _A.e.s._[this.url].step;
        t < this.previewStart ? (R.T(this.preview, 0, -R.R(t), "px"),
        R.T(this.area, 0, -R.R(t), "px")) : t >= this.previewStart && t <= this.previewEnd ? (R.T(this.preview, 0, -R.R(this.previewStart + R.Remap(this.previewStart, this.previewEnd, 0, this.prlx, t)), "px"),
        R.T(this.area, 0, -R.R(this.previewStart - R.Remap(this.previewStart, this.previewEnd, 0, this.areaMax - this.prlx, t)), "px")) : t > this.previewEnd && (R.T(this.preview, 0, -R.R(t - this.previewMax), "px"),
        R.T(this.area, 0, -R.R(t - this.previewMax - this.areaMax), "px"))
    }
}
;
class Work {
    constructor() {
        this.gl = new GL,
        this.fxHero = new FxHero,
        this.fxFooter = new FxFooter,
        this.fxBack = new FxBack,
        this.preview = new Preview$1
    }
    initB() {
        this.notRequired = !_A.is.wo,
        this.notRequired || this.gl.initB()
    }
    initA() {
        this.notRequired || (this.gl.initA(),
        this.fxHero.init(),
        this.fxFooter.init(),
        this.fxBack.init(),
        this.preview.init())
    }
    resizeA() {
        this.notRequired || (this.gl.resizeA(),
        this.preview.resizeA(),
        this.fxHero.resizeA())
    }
    loop() {
        this.notRequired && !this.gl.moving || (this.gl.loop(),
        this.preview.loop())
    }
}
let Fx$2 = class {
    init() {
        this.left = R.G.id("a-l"),
        this.leftPreview = R.G.id("a-lp"),
        this.leftSection = R.G.class("a-l-s"),
        this.leftSectionL = this.leftSection.length
    }
    show(t) {
        var i = _A
          , e = i.config.isLocal && i.introducing
          , s = t.mutation;
        let r = t.delay
          , a = 1500;
        let h = 200
          , o = 50
          , l = 500;
        (s && i.fromBack || e) && (r = 0,
        a = 0,
        h = 0,
        o = 0,
        l = 0);
        const n = new R.TL;
        for (let t = 0; t < this.leftSectionL; t++) {
            var p = 0 === t ? r + h : o;
            n.from({
                el: this.leftSection[t],
                p: {
                    opacity: [0, .85]
                },
                d: a,
                e: "o1",
                delay: p
            }),
            n.from({
                el: this.leftSection[t],
                p: {
                    y: [80, 0, "px"]
                },
                d: a,
                e: "o6"
            })
        }
        const d = new R.TL;
        return d.from({
            el: this.leftPreview,
            p: {
                opacity: [0, .85]
            },
            d: a,
            e: "o1",
            delay: r + l
        }),
        {
            play: t=>{
                n.play(),
                d.play()
            }
        }
    }
}
;
class SFx {
    init() {
        this.url = _A.route.new.url,
        this.trigger = [],
        this.tl = [],
        this.isVisible = [],
        this.limit = [],
        this.first = !0,
        this.heroP = R.G.id("a-r-hero").children,
        this.heroPL = this.heroP.length,
        this.slineHeroP = [];
        for (let t = 0; t < this.heroPL; t++)
            this.slineHeroP[t] = new SLine({
                el: this.heroP[t]
            });
        var t = R.G.id("a-r-experience")
          , t = (this.expH2 = R.G.tag("h2", t)[0].children[0],
        this.expLi = R.G.tag("ul", t)[0].children,
        this.expLiL = this.expLi.length,
        R.G.id("a-r-recognition"))
          , t = (this.recoH2 = R.G.tag("h2", t)[0].children[0],
        this.recoLi = R.G.tag("ul", t)[0].children,
        this.recoLiL = this.recoLi.length,
        R.G.id("a-r-clients"))
          , t = (this.clientsH2 = R.G.tag("h2", t)[0].children[0],
        this.clientsLi = R.G.tag("ul", t)[0].children,
        this.clientsLiL = this.clientsLi.length,
        R.G.id("a-r-contact"))
          , t = (this.contactH2 = R.G.tag("h2", t)[0].children[0],
        this.contactLi = R.G.tag("ul", t)[0].children,
        this.contactLiL = this.contactLi.length,
        R.G.id("a-r-credits"));
        this.creditsH2 = R.G.tag("h2", t)[0].children[0],
        this.creditsLi = R.G.tag("ul", t)[0].children,
        this.creditsLiL = this.creditsLi.length,
        this.resize()
    }
    resize() {
        let i = 0;
        var e = 1500
          , s = "o6";
        for (let t = 0; t < this.heroPL; t++) {
            this.trigger[i] = this.heroP[t];
            var r = this.limitSet(i)
              , a = r.delay
              , h = r.fromBack ? 0 : e
              , o = r.fromBack ? 0 : 100
              , r = this.isVisible[i] ? 0 : 110
              , l = (this.slineHeroP[t].resize({
                tag: {
                    start: '<span class="sfx-y"><span style="transform: translate3d(0,' + r + '%,0);">',
                    end: "</span></span>"
                }
            }),
            R.G.class("sfx-y", this.slineHeroP[t].el))
              , n = l.length;
            if (!this.isVisible[i]) {
                this.tl[i] = new R.TL;
                for (let t = 0; t < n; t++) {
                    var p = 0 === t ? a : o;
                    this.tl[i].from({
                        el: l[t].children[0],
                        p: {
                            y: [110, 0]
                        },
                        d: h,
                        e: s,
                        delay: p
                    })
                }
            }
            i++
        }
        this.trigger[i] = this.expH2;
        var t = this.limitSet(i)
          , d = t.delay
          , t = t.fromBack ? 0 : e;
        this.isVisible[i] || (this.tl[i] = new R.TL,
        this.tl[i].from({
            el: this.expH2,
            p: {
                y: [110, 0]
            },
            d: t,
            e: s,
            delay: d
        })),
        i++;
        for (let t = 0; t < this.expLiL; t++) {
            this.trigger[i] = this.expLi[t];
            var c = this.limitSet(i)
              , g = c.delay
              , u = c.fromBack ? 0 : e
              , m = c.fromBack ? 0 : 100
              , v = R.G.class("sfx-y", this.expLi[t])
              , f = v.length;
            if (!this.isVisible[i]) {
                this.tl[i] = new R.TL;
                for (let t = 0; t < f; t++) {
                    var x = 0 === t ? g : m;
                    this.tl[i].from({
                        el: v[t].children[0],
                        p: {
                            y: [110, 0]
                        },
                        d: u,
                        e: s,
                        delay: x
                    })
                }
            }
            i++
        }
        this.trigger[i] = this.recoH2;
        t = this.limitSet(i),
        d = t.delay,
        t = t.fromBack ? 0 : e;
        this.isVisible[i] || (this.tl[i] = new R.TL,
        this.tl[i].from({
            el: this.recoH2,
            p: {
                y: [110, 0]
            },
            d: t,
            e: s,
            delay: d
        })),
        i++;
        for (let t = 0; t < this.recoLiL; t++) {
            this.trigger[i] = this.recoLi[t];
            var w = this.limitSet(i)
              , y = w.delay
              , L = w.fromBack ? 0 : e
              , _ = w.fromBack ? 0 : 100
              , A = R.G.class("sfx-y", this.recoLi[t])
              , b = A.length;
            if (!this.isVisible[i]) {
                this.tl[i] = new R.TL;
                for (let t = 0; t < b; t++) {
                    var S = 0 === t ? y : _;
                    this.tl[i].from({
                        el: A[t].children[0],
                        p: {
                            y: [110, 0]
                        },
                        d: L,
                        e: s,
                        delay: S
                    })
                }
            }
            i++
        }
        this.trigger[i] = this.clientsH2;
        t = this.limitSet(i),
        d = t.delay,
        t = t.fromBack ? 0 : e;
        this.isVisible[i] || (this.tl[i] = new R.TL,
        this.tl[i].from({
            el: this.clientsH2,
            p: {
                y: [110, 0]
            },
            d: t,
            e: s,
            delay: d
        })),
        i++;
        for (let t = 0; t < this.clientsLiL; t++) {
            this.trigger[i] = this.clientsLi[t];
            var M = this.limitSet(i)
              , T = M.delay
              , F = M.fromBack ? 0 : e
              , H = M.fromBack ? 0 : 100
              , P = R.G.class("sfx-y", this.clientsLi[t])
              , G = P.length;
            if (!this.isVisible[i]) {
                this.tl[i] = new R.TL;
                for (let t = 0; t < G; t++) {
                    var I = 0 === t ? T : H;
                    this.tl[i].from({
                        el: P[t].children[0],
                        p: {
                            y: [110, 0]
                        },
                        d: F,
                        e: s,
                        delay: I
                    })
                }
            }
            i++
        }
        this.trigger[i] = this.contactH2;
        t = this.limitSet(i),
        d = t.delay,
        t = t.fromBack ? 0 : e;
        this.isVisible[i] || (this.tl[i] = new R.TL,
        this.tl[i].from({
            el: this.contactH2,
            p: {
                y: [110, 0]
            },
            d: t,
            e: s,
            delay: d
        })),
        i++;
        for (let t = 0; t < this.contactLiL; t++) {
            this.trigger[i] = this.contactLi[t];
            var B = this.limitSet(i)
              , C = B.delay
              , O = B.fromBack ? 0 : e
              , D = B.fromBack ? 0 : 100
              , E = R.G.class("sfx-y", this.contactLi[t])
              , W = E.length;
            if (!this.isVisible[i]) {
                this.tl[i] = new R.TL;
                for (let t = 0; t < W; t++) {
                    var N = 0 === t ? C : D;
                    this.tl[i].from({
                        el: E[t].children[0],
                        p: {
                            y: [110, 0]
                        },
                        d: O,
                        e: s,
                        delay: N
                    })
                }
            }
            i++
        }
        this.trigger[i] = this.creditsH2;
        t = this.limitSet(i),
        d = t.delay,
        t = t.fromBack ? 0 : e;
        this.isVisible[i] || (this.tl[i] = new R.TL,
        this.tl[i].from({
            el: this.creditsH2,
            p: {
                y: [110, 0]
            },
            d: t,
            e: s,
            delay: d
        })),
        i++;
        for (let t = 0; t < this.creditsLiL; t++) {
            this.trigger[i] = this.creditsLi[t];
            var k = this.limitSet(i)
              , q = k.delay
              , V = k.fromBack ? 0 : e
              , U = k.fromBack ? 0 : 100
              , z = R.G.class("sfx-y", this.creditsLi[t])
              , X = z.length;
            if (!this.isVisible[i]) {
                this.tl[i] = new R.TL;
                for (let t = 0; t < X; t++) {
                    var j = 0 === t ? q : U;
                    this.tl[i].from({
                        el: z[t].children[0],
                        p: {
                            y: [110, 0]
                        },
                        d: V,
                        e: s,
                        delay: j
                    })
                }
            }
            i++
        }
        if (this.triggerL = this.trigger.length,
        this.first) {
            for (let t = 0; t < this.triggerL; t++)
                this.isVisible[t] = !1;
            this.first = !1
        }
    }
    loop() {
        var i = _A.e.s._[this.url].curr;
        for (let t = 0; t < this.triggerL; t++)
            i > this.limit[t] && !this.isVisible[t] && (this.isVisible[t] = !0,
            this.tl[t].play())
    }
    limitSet(t) {
        var i = _A
          , e = i.config.isLocal && i.introducing
          , s = i.fromBack
          , r = this.trigger[t].getBoundingClientRect().top + i.e.s._[this.url].curr
          , a = r < i.win.h;
        this.limit[t] = a ? -1 : r - i.sFxS;
        let h = !a || s || e ? 0 : 700 + 200 * t;
        return {
            fromBack: a && s,
            delay: h
        }
    }
}
class Preview {
    init() {
        this.url = _A.route.new.url,
        this.leftW = R.G.id("a-l-w"),
        this.left = R.G.id("a-l"),
        this.preview = R.G.id("a-lp"),
        this.resize()
    }
    resize() {
        var t = _A
          , i = t.win.h
          , e = (R.T(this.leftW, 0, 0, "px"),
        R.T(this.preview, 0, 0, "px"),
        this.left.offsetHeight)
          , s = this.left.getBoundingClientRect().top;
        this.leftArea = i < s + e ? t.win.h - s : s + e - s,
        this.max = e - this.leftArea,
        this.maxP = this.leftArea - this.preview.offsetHeight
    }
    loop() {
        var t = _A
          , i = t.e.s._[this.url].curr
          , t = t.e.s.max
          , e = R.Remap(0, t, 0, this.max, i)
          , t = R.Remap(0, t, 0, this.maxP, i);
        R.T(this.leftW, 0, -R.R(e), "px"),
        R.T(this.preview, 0, R.R(t), "px")
    }
}
class About {
    constructor() {
        this.fx = new Fx$2,
        this.sFx = new SFx,
        this.preview = new Preview
    }
    init() {
        var t = _A;
        this.notRequired = !t.is.ab,
        this.notRequired || (this.fx.init(),
        this.sFx.init(),
        this.preview.init())
    }
    resize() {
        this.notRequired || (this.sFx.resize(),
        this.preview.resize())
    }
    loop() {
        this.notRequired || (this.sFx.loop(),
        this.preview.loop())
    }
}
class E {
    constructor() {
        var t = _A;
        t.lerpP = .083,
        t.index = 0,
        t.mode = "in",
        R.BM(this, ["resize", "loop"]),
        this.raf = new R.RafR(this.loop),
        this.s = new Scroll,
        this.lz = new LZ,
        this.load = new Load,
        this.nav = new Nav,
        this.ho = new Home,
        this.wo = new Work,
        this.ab = new About
    }
    intro() {
        this.s.intro(),
        this.nav.intro()
    }
    init() {
        var t = _A
          , t = (t.is.wo && (t.index = t.config.routes[t.route.new.url].index),
        this.ho.initB(),
        this.wo.initB(),
        {
            isX: t.is.ho
        });
        this.s.init(t),
        this.sIntersect = new SIntersect,
        this.lz.initA(),
        this.ho.initA(),
        this.wo.initA(),
        this.ab.init()
    }
    resize() {
        this.ho.resizeB(),
        this.s.resize(),
        this.sIntersect.resize(),
        this.ho.resizeA(),
        this.wo.resizeA(),
        this.ab.resize(),
        this.load.resizeA(),
        this.lz.resizeA()
    }
    run() {
        new R.ROR(this.resize).on(),
        this.raf.run()
    }
    on() {
        this.ho.on(),
        this.s.on()
    }
    loop() {
        this.s.loop(),
        this.lz.loop(),
        this.wo.loop(),
        this.ho.loop(),
        this.ab.loop(),
        this.s.rqd && this.sIntersect.run()
    }
    off() {
        this.s.off(),
        this.lz.off(),
        this.ho.off()
    }
}
class Page {
    constructor(i) {
        const s = _A
          , r = s.e;
        var e = s.config.isLocal
          , i = i.intro
          , a = s.fromBack
          , t = s.is.ho
          , h = s.is.wo
          , o = s.is.ab
          , l = s.was.ho
          , n = s.was.wo;
        const p = [];
        if (i) {
            if (t) {
                i = 3200;
                let t = e ? 0 : 4e3;
                p.push(r.load.fx({
                    delay: 0
                })),
                p.push(r.ho.fxTitle.show({
                    index: s.index,
                    delay: i
                })),
                p.push(r.ho.fxCross.side({
                    a: "show",
                    delay: 3500
                })),
                p.push(r.ho.fxPgn.show({
                    mutation: !1,
                    delay: 3800
                })),
                p.push(r.nav.fx.show({
                    mutation: !1,
                    delay: 3800
                })),
                new R.Delay(t=>{
                    r.on(),
                    R.PE.none(R.G.id("load")),
                    s.mutating = !1,
                    s.introducing = !1
                }
                ,t).run()
            } else if (h) {
                let t = e ? 0 : 4e3;
                p.push(r.load.fx({
                    delay: 0
                })),
                p.push(r.wo.fxHero.show({
                    delay: 3400
                })),
                p.push(r.wo.fxBack.show({
                    delay: 3800
                })),
                new R.Delay(t=>{
                    r.on(),
                    s.mutating = !1,
                    s.introducing = !1,
                    R.PE.none(R.G.id("load"))
                }
                ,t).run()
            } else if (o) {
                let t = e ? 0 : 1200;
                p.push(r.ab.fx.show({
                    mutation: !1,
                    delay: 1e3
                })),
                p.push(r.nav.fx.show({
                    mutation: !1,
                    delay: 1e3
                })),
                new R.Delay(t=>{
                    r.on(),
                    s.mutating = !1,
                    s.introducing = !1,
                    R.PE.none(R.G.id("load"))
                }
                ,t).run()
            }
        } else if (t) {
            let t = 200
              , i = 300;
            a && (t = 1,
            i = 1),
            n && (p.push(r.wo.gl.hide()),
            p.push(r.nav.fx.show({
                mutation: !0,
                delay: 0
            }))),
            p.push(r.ho.gl.show()),
            "out" === s.mode ? p.push(r.ho.fxCross.middle({
                mutation: !0,
                a: "show",
                delay: t
            })) : (p.push(r.ho.fxTitle.show({
                mutation: !0,
                index: s.index,
                delay: 0
            })),
            p.push(r.ho.fxCross.side({
                mutation: !0,
                a: "show",
                delay: t
            }))),
            p.push(r.ho.fxPgn.show({
                mutation: !0,
                delay: 0
            })),
            new R.Delay(t=>{
                r.on(),
                s.mutating = !1
            }
            ,i).run()
        } else if (h) {
            let t = 800
              , i = t + 300
              , e = 1300;
            a && (t = 1,
            i = 1,
            e = 1),
            l ? (p.push(r.nav.fx.hide({
                mutation: !0,
                delay: 0
            })),
            p.push(r.ho.fxCross.side({
                mutation: !0,
                a: "hide",
                delay: 0
            })),
            p.push(r.ho.fxTitle.hide({
                mutation: !0,
                index: s.index,
                delay: 0
            })),
            p.push(r.ho.over.hide({
                mutation: !0,
                index: s.index
            })),
            p.push(r.ho.fxPgn.hide({
                mutation: !0,
                delay: 0
            })),
            p.push(r.ho.gl.hide()),
            p.push(r.wo.gl.showFromHome())) : n && (p.push(r.wo.fxFooter.hide({
                mutation: !0,
                delay: 0
            })),
            p.push(r.wo.gl.showFromWork())),
            p.push(r.wo.fxHero.show({
                mutation: !0,
                delay: t
            })),
            p.push(r.wo.fxBack.show({
                mutation: !0,
                delay: i
            })),
            new R.Delay(t=>{
                s.page.removeOld(),
                r.on(),
                s.mutating = !1
            }
            ,e).run()
        } else if (l && o) {
            let t = 800
              , i = 1300;
            a && (t = 1,
            i = 1),
            "out" === s.mode ? p.push(r.ho.fxCross.middle({
                mutation: !0,
                a: "hide",
                delay: 0
            })) : (p.push(r.ho.fxCross.side({
                mutation: !0,
                a: "hide",
                delay: 0
            })),
            p.push(r.ho.fxTitle.hide({
                mutation: !0,
                index: s.index,
                delay: 0
            }))),
            p.push(r.ho.fxPgn.hide({
                mutation: !0,
                delay: 0
            })),
            p.push(r.ho.gl.hide()),
            p.push(r.ab.fx.show({
                mutation: !0,
                delay: t
            })),
            new R.Delay(t=>{
                s.page.removeOld(),
                r.on(),
                s.mutating = !1
            }
            ,i).run()
        }
        const d = p.length;
        return {
            play: t=>{
                for (let t = 0; t < d; t++)
                    p[t].play()
            }
        }
    }
}
let Fx$1 = class {
    constructor() {
        this.no = R.G.id("load-no").children[0],
        this.bg = R.G.id("load-bg")
    }
    run() {
        let t = 1e3;
        _A.config.isLocal && (t = 0);
        var i = new Page({
            intro: !0
        })
          , e = new R.TL;
        e.from({
            el: this.no,
            p: {
                y: [0, -110]
            },
            d: t,
            e: "i4"
        }),
        i.play(),
        e.play(),
        R.O(this.bg, 0)
    }
}
;
function create() {
    var t = new Float32Array(16);
    return t[0] = 1,
    t[5] = 1,
    t[10] = 1,
    t[15] = 1,
    t
}
function identity(t) {
    return t[0] = 1,
    t[1] = 0,
    t[2] = 0,
    t[3] = 0,
    t[4] = 0,
    t[5] = 1,
    t[6] = 0,
    t[7] = 0,
    t[8] = 0,
    t[9] = 0,
    t[10] = 1,
    t[11] = 0,
    t[12] = 0,
    t[13] = 0,
    t[14] = 0,
    t[15] = 1,
    t
}
function invert(t, i) {
    var e = i[0]
      , s = i[1]
      , r = i[2]
      , a = i[3]
      , h = i[4]
      , o = i[5]
      , l = i[6]
      , n = i[7]
      , p = i[8]
      , d = i[9]
      , c = i[10]
      , g = i[11]
      , u = i[12]
      , m = i[13]
      , v = i[14]
      , i = i[15]
      , f = c * i
      , R = v * g
      , x = l * i
      , w = v * n
      , y = l * g
      , L = c * n
      , _ = r * i
      , A = v * a
      , b = r * g
      , S = c * a
      , M = r * n
      , T = l * a
      , F = p * m
      , H = u * d
      , P = h * m
      , G = u * o
      , B = h * d
      , E = p * o
      , k = e * m
      , z = u * s
      , I = e * d
      , C = p * s
      , O = e * o
      , D = h * s
      , W = f * o + w * d + y * m - (R * o + x * d + L * m)
      , N = R * s + _ * d + S * m - (f * s + A * d + b * m)
      , m = x * s + A * o + M * m - (w * s + _ * o + T * m)
      , s = L * s + b * o + T * d - (y * s + S * o + M * d)
      , o = 1 / (e * W + h * N + p * m + u * s);
    return t[0] = o * W,
    t[1] = o * N,
    t[2] = o * m,
    t[3] = o * s,
    t[4] = o * (R * h + x * p + L * u - (f * h + w * p + y * u)),
    t[5] = o * (f * e + A * p + b * u - (R * e + _ * p + S * u)),
    t[6] = o * (w * e + _ * h + T * u - (x * e + A * h + M * u)),
    t[7] = o * (y * e + S * h + M * p - (L * e + b * h + T * p)),
    t[8] = o * (F * n + G * g + B * i - (H * n + P * g + E * i)),
    t[9] = o * (H * a + k * g + C * i - (F * a + z * g + I * i)),
    t[10] = o * (P * a + z * n + O * i - (G * a + k * n + D * i)),
    t[11] = o * (E * a + I * n + D * g - (B * a + C * n + O * g)),
    t[12] = o * (P * c + E * v + H * l - (B * v + F * l + G * c)),
    t[13] = o * (I * v + F * r + z * c - (k * c + C * v + H * r)),
    t[14] = o * (k * l + D * v + G * r - (O * v + P * r + z * l)),
    t[15] = o * (O * c + B * r + C * l - (I * l + D * c + E * r)),
    t
}
function perspective(t, i, e, s, r) {
    var i = 1 / Math.tan(.5 * i)
      , a = 1 / (s - r);
    return t[0] = i / e,
    t[1] = 0,
    t[2] = 0,
    t[3] = 0,
    t[4] = 0,
    t[5] = i,
    t[6] = 0,
    t[7] = 0,
    t[8] = 0,
    t[9] = 0,
    t[10] = (r + s) * a,
    t[11] = -1,
    t[12] = 0,
    t[13] = 0,
    t[14] = 2 * r * s * a,
    t[15] = 0,
    t
}
function multiplyFn(t, i) {
    return multiply(t, t, i)
}
function multiply(t, i, e) {
    var s = e[0]
      , r = e[1]
      , a = e[2]
      , h = e[3]
      , o = e[4]
      , l = e[5]
      , n = e[6]
      , p = e[7]
      , d = e[8]
      , c = e[9]
      , g = e[10]
      , u = e[11]
      , m = e[12]
      , v = e[13]
      , f = e[14]
      , e = e[15]
      , R = i[0]
      , x = i[1]
      , w = i[2]
      , y = i[3]
      , L = i[4]
      , _ = i[5]
      , A = i[6]
      , b = i[7]
      , S = i[8]
      , M = i[9]
      , T = i[10]
      , F = i[11]
      , H = i[12]
      , P = i[13]
      , G = i[14]
      , i = i[15];
    return t[0] = s * R + r * L + a * S + h * H,
    t[1] = s * x + r * _ + a * M + h * P,
    t[2] = s * w + r * A + a * T + h * G,
    t[3] = s * y + r * b + a * F + h * i,
    t[4] = o * R + l * L + n * S + p * H,
    t[5] = o * x + l * _ + n * M + p * P,
    t[6] = o * w + l * A + n * T + p * G,
    t[7] = o * y + l * b + n * F + p * i,
    t[8] = d * R + c * L + g * S + u * H,
    t[9] = d * x + c * _ + g * M + u * P,
    t[10] = d * w + c * A + g * T + u * G,
    t[11] = d * y + c * b + g * F + u * i,
    t[12] = m * R + v * L + f * S + e * H,
    t[13] = m * x + v * _ + f * M + e * P,
    t[14] = m * w + v * A + f * T + e * G,
    t[15] = m * y + v * b + f * F + e * i,
    t
}
function translateFn(t, i) {
    return translate(t, t, i)
}
function translate(t, i, e) {
    var s, r, a, h, o, l, n, p, d, c, g, u, m = e[0], v = e[1], e = e[2];
    return i === t ? (t[12] = i[0] * m + i[4] * v + i[8] * e + i[12],
    t[13] = i[1] * m + i[5] * v + i[9] * e + i[13],
    t[14] = i[2] * m + i[6] * v + i[10] * e + i[14],
    t[15] = i[3] * m + i[7] * v + i[11] * e + i[15]) : (s = i[0],
    r = i[1],
    a = i[2],
    h = i[3],
    o = i[4],
    l = i[5],
    n = i[6],
    p = i[7],
    d = i[8],
    c = i[9],
    g = i[10],
    u = i[11],
    t[0] = s,
    t[1] = r,
    t[2] = a,
    t[3] = h,
    t[4] = o,
    t[5] = l,
    t[6] = n,
    t[7] = p,
    t[8] = d,
    t[9] = c,
    t[10] = g,
    t[11] = u,
    t[12] = s * m + o * v + d * e + i[12],
    t[13] = r * m + l * v + c * e + i[13],
    t[14] = a * m + n * v + g * e + i[14],
    t[15] = h * m + p * v + u * e + i[15]),
    t
}
function scaleFn(t, i) {
    return scale(t, t, i)
}
function scale(t, i, e) {
    var s = e[0]
      , r = e[1]
      , e = e[2];
    return t[0] = i[0] * s,
    t[1] = i[1] * s,
    t[2] = i[2] * s,
    t[3] = i[3] * s,
    t[4] = i[4] * r,
    t[5] = i[5] * r,
    t[6] = i[6] * r,
    t[7] = i[7] * r,
    t[8] = i[8] * e,
    t[9] = i[9] * e,
    t[10] = i[10] * e,
    t[11] = i[11] * e,
    t[12] = i[12],
    t[13] = i[13],
    t[14] = i[14],
    t[15] = i[15],
    t
}
class Camera {
    constructor() {
        this.near = 1,
        this.far = 2e3,
        this.fov = 45,
        this.aspect = 1,
        this.projectionMatrix = create(),
        this.matrixCamera = create()
    }
    resize(t) {
        t && (this.aspect = t.aspect);
        var t = Math.PI
          , i = this.fov * (t / 180)
          , i = (this.projectionMatrix = perspective(this.projectionMatrix, i, this.aspect, this.near, this.far),
        _A.winSemi);
        this.posOrigin = {
            x: i.w,
            y: -i.h,
            z: i.h / Math.tan(t * this.fov / 360)
        },
        _A.rgl.uProjectionMatrix(this.projectionMatrix)
    }
    render(t) {
        return this.matrixCamera = identity(this.matrixCamera),
        this.matrixCamera = translateFn(this.matrixCamera, [this.posOrigin.x + t.x, this.posOrigin.y + t.y, this.posOrigin.z + t.z]),
        invert(this.matrixCamera, this.matrixCamera)
    }
}
class Texture {
    constructor(t) {
        this.gl = t,
        this.tex = {}
    }
    run(t) {
        var i = _A
          , t = (this.cb = t,
        i.route)
          , e = t.new.url
          , s = (this.dom = R.G.id("load-no").children[0],
        this.no = 0,
        this.prevNo = 0,
        R.BM(this, ["loop"]),
        this.raf = new R.RafR(this.loop),
        i.data)
          , r = Object.keys(s)
          , a = r.length;
        for (let t = this.texL = 0; t < a; t++) {
            var h = r[t]
              , o = s[h];
            !o.preload && e !== h || this.imgSet({
                media: o,
                url: h,
                gl: !0,
                ext: !1
            })
        }
        this.raf.run()
    }
    imgSet(t) {
        var i = t.ext ? "" : _A.img.jpg
          , e = t.url
          , s = t.gl
          , t = t.media
          , r = t.tex
          , a = t.texL;
        s && (this.tex[e] = []);
        for (let t = 0; t < a; t++)
            this.imgSetOne({
                src: r[t] + i,
                index: t,
                url: e,
                gl: s
            }),
            this.texL++
    }
    imgSetOne(t) {
        var i = t.src;
        const e = t.url
          , s = t.gl
          , r = t.index
          , a = new Image;
        a.onload = t=>{
            var i;
            s && (i = this.texInit(a),
            this.tex[e][r] = {
                attrib: i,
                element: a,
                type: "img"
            }),
            this.no++
        }
        ,
        a.src = i
    }
    texInit(t) {
        var i = this.gl
          , e = i.createTexture()
          , s = (i.bindTexture(i.TEXTURE_2D, e),
        i.texImage2D(i.TEXTURE_2D, 0, i.RGBA, i.RGBA, i.UNSIGNED_BYTE, t),
        [["WRAP_S", "CLAMP_TO_EDGE"], ["WRAP_T", "CLAMP_TO_EDGE"], ["MIN_FILTER", "LINEAR"], ["MAG_FILTER", "LINEAR"]]);
        for (let t = 0; t < 4; t++)
            i.texParameteri(i.TEXTURE_2D, i["TEXTURE_" + s[t][0]], i[s[t][1]]);
        return e
    }
    loop() {
        this.no !== this.prevNo && (this.prevNo = this.no,
        this.dom.textContent = Math.round(100 / this.texL * this.no) + "%"),
        this.no === this.texL && (this.raf.stop(),
        this.cb())
    }
}
class Renderer {
    constructor(t) {
        this.gl = _A.rgl.gl,
        this.page = t.page,
        this.state = {
            depthTest: null,
            cullFace: null
        },
        this.setBlendFunc();
        var i = this.gl.getExtension("OES_vertex_array_object")
          , e = ["create", "bind"];
        this.vertexArray = {};
        for (let t = 0; t < 2; t++) {
            var s = e[t];
            this.vertexArray[s] = i[s + "VertexArrayOES"].bind(i)
        }
        this.programCurrId = null,
        this.viewport = {
            width: null,
            height: null
        },
        this.camera = new Camera,
        this.texture = new Texture(this.gl),
        this.texture.run(t.cb)
    }
    setFaceCulling(t) {
        this.state.cullFace !== t && (this.state.cullFace = t,
        this.gl.enable(this.gl.CULL_FACE),
        this.gl.cullFace(this.gl[t]))
    }
    setBlendFunc() {
        this.gl.enable(this.gl.BLEND),
        this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA)
    }
    resize() {
        var t = _A
          , i = t.win
          , e = 600 < i.w ? 1.5 : 3
          , i = (this.width = i.w,
        this.height = i.h,
        this.gl.canvas.width = this.width * e,
        this.gl.canvas.height = this.height * e,
        this.camera.resize({
            aspect: this.gl.canvas.width / this.gl.canvas.height
        }),
        t.rgl.clear(),
        this.width * e)
          , t = this.height * e;
        this.resizing = !0,
        this.viewport.width === i && this.viewport.height === t || (this.viewport.width = i,
        this.viewport.height = t,
        this.gl.viewport(0, 0, i, t),
        this.viewMatrix = this.camera.render({
            x: 0,
            y: 0,
            z: 0
        }))
    }
    render(i) {
        var t = _A
          , e = t.route
          , s = e.old.page
          , r = e.new.page
          , a = this.page.includes(r)
          , h = this.page.includes(s);
        let o = this.resizing || t.e.s.rqd;
        this.resizing && (this.resizing = !1),
        (o = o || t.e.load.moving) || h && t.e[s].gl.moving && (o = !0),
        o || a && t.e[r].gl.moving && (o = !0);
        var l = []
          , n = (h ? (a && l.push(e.new.url),
        (t.mutating || t.e[s].gl.moving) && l.push(e.old.url)) : (t.e.load.moving && l.push("load"),
        a && l.push(e.new.url)),
        l.length);
        for (let t = 0; t < n; t++)
            ("/" === l[t] ? (i.large.draw(o),
            i.small) : i[l[t]]).draw(o)
    }
}
let ID = 1;
class Program {
    constructor(t) {
        var i = _A.rgl;
        this.gl = i.gl,
        this.renderer = i.renderer,
        this.uniform = t.uniform || {},
        this.id = ID++,
        this.program = this.crP();
        const e = this.uniform;
        e.g = {
            type: "Matrix4fv"
        },
        e.h = {
            type: "Matrix4fv"
        },
        this.getL(e, "Uniform"),
        i.uProjectionMatrix = t=>{
            e.g.value = t
        }
    }
    crP() {
        var t = this.gl
          , i = this.crS("precision highp float;attribute vec2 c;attribute vec2 f;varying vec2 a;uniform vec2 d;uniform vec2 e;uniform mat4 g;uniform mat4 h;void main(){gl_Position=g*h*vec4(c.x,c.y,0,1);a=(f-.5)/d+.5+e;}", t.VERTEX_SHADER)
          , e = this.crS("precision highp float;varying vec2 a;uniform sampler2D b;void main(){gl_FragColor=texture2D(b,a);}", t.FRAGMENT_SHADER)
          , s = t.createProgram();
        return t.attachShader(s, i),
        t.attachShader(s, e),
        t.linkProgram(s),
        t.deleteShader(i),
        t.deleteShader(e),
        s
    }
    crS(t, i) {
        i = this.gl.createShader(i);
        return this.gl.shaderSource(i, t),
        this.gl.compileShader(i),
        i
    }
    getL(t, i) {
        for (const e in t)
            R.Has(t, e) && (t[e].location = this.gl["get" + i + "Location"](this.program, e))
    }
    setUniform() {
        for (const s in this.uniform) {
            var t, i, e;
            R.Has(this.uniform, s) && (i = (t = this.uniform[s]).location,
            e = "uniform" + t.type,
            "Matrix" === t.type.substring(0, 6) ? this.gl[e](i, !1, t.value) : this.gl[e](i, t.value))
        }
    }
    run() {
        this.renderer.programCurrId !== this.id && (this.gl.useProgram(this.program),
        this.renderer.programCurrId = this.id)
    }
}
class Geo {
    constructor(t) {
        var i = _A.rgl;
        this.gl = i.gl,
        this.renderer = i.renderer,
        this.program = t.program,
        this.mode = t.mode,
        this.face = t.face,
        this.attrib = t.attrib,
        this.renderer.vertexArray.bind(null),
        this.program.getL(this.attrib, "Attrib"),
        this.modelMatrix = create()
    }
    setVAO() {
        var t = this.renderer;
        this.vao = t.vertexArray.create(),
        t.vertexArray.bind(this.vao),
        this.setAttrib(),
        t.vertexArray.bind(null)
    }
    setAttrib() {
        var t, i, e, s = this.gl;
        for (const r in this.attrib)
            R.Has(this.attrib, r) && (t = this.attrib[r],
            i = "index" === r,
            (e = t.data.constructor) === Float32Array ? t.type = s.FLOAT : e === Uint16Array ? t.type = s.UNSIGNED_SHORT : t.type = s.UNSIGNED_INT,
            t.count = t.data.length / t.size,
            t.target = i ? s.ELEMENT_ARRAY_BUFFER : s.ARRAY_BUFFER,
            t.normalize = !1,
            s.bindBuffer(t.target, s.createBuffer()),
            s.bufferData(t.target, t.data, s.STATIC_DRAW),
            i || (s.enableVertexAttribArray(t.location),
            s.vertexAttribPointer(t.location, t.size, t.type, t.normalize, 0, 0)))
    }
    draw(t) {
        var i = this.gl
          , e = this.renderer
          , s = (e.setFaceCulling(this.face),
        this.program.run(),
        this.modelMatrix = identity(this.modelMatrix),
        e.viewMatrix)
          , s = multiplyFn(this.modelMatrix, s)
          , r = t.lerp
          , a = t.ease
          , h = t.intro
          , o = r.x + h.x
          , l = r.y + a.y + h.y
          , n = r.w + h.w
          , p = r.h + h.h
          , h = r.scale + h.scale + a.scale
          , o = (s = scaleFn(translateFn(s, [o, -l, 0]), [n, p, 1]),
        this.program.uniform);
        let d = 1
          , c = t.media.ratio.wh / (n / p);
        c < 1 && (d = 1 / c,
        c = 1),
        o.d.value = [c * h, d * h],
        o.e.value = [r.pX, (r.pY + a.pY) / d],
        o.h.value = s,
        this.program.setUniform(),
        i.bindTexture(i.TEXTURE_2D, this.attrib.f.tex),
        e.vertexArray.bind(this.vao);
        l = this.attrib.index;
        i.drawElements(i[this.mode], l.count, l.type, 0)
    }
}
function Plane(t) {
    var t = t.p
      , i = {};
    const e = t.pts.h
      , s = t.pts.v
      , r = e - 1
      , a = s - 1
      , h = 1 / r
      , o = 1 / a;
    var l = [];
    let n = 0;
    for (let t = 0; t < s; t++) {
        var p = t * o - 1;
        for (let t = 0; t < e; t++)
            l[n++] = t * h,
            l[n++] = p
    }
    i.pos = l;
    var d = [];
    let c = 0;
    var g = s - 1
      , u = s - 2
      , m = e - 1;
    for (let i = 0; i < g; i++) {
        var v = e * i
          , f = v + e;
        for (let t = 0; t < e; t++) {
            var R = f + t;
            d[c++] = v + t,
            d[c++] = R,
            t === m && i < u && (d[c++] = R,
            d[c++] = e * (i + 1))
        }
    }
    i.index = d;
    var x = [];
    let w = 0;
    for (let t = 0; t < s; t++) {
        var y = 1 - t / a;
        for (let t = 0; t < e; t++)
            x[w++] = t / r,
            x[w++] = y
    }
    return i.texture = x,
    i
}
class PlaneTex {
    constructor(t) {
        var i = t.p
          , e = t.url
          , s = _A.rgl.renderer.texture.tex[e]
          , r = s.length
          , a = (this.planeL = r,
        R.Is.def(t.isHomeLarge) && (this.planeL = this.planeL * this.planeL),
        {
            h: 2,
            v: 2
        })
          , h = (this.lerp = {
            prop: ["x", "y", "w", "h", "scale", "opacity", "pY"],
            r6: ["scale", "opacity", "pY"]
        },
        this.lerp.propL = this.lerp.prop.length,
        {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            opacity: 1,
            scale: 1,
            pY: 0,
            pX: 0
        })
          , o = {
            y: 0,
            pY: 0,
            scale: 0
        }
          , l = {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            scale: 0
        };
        R.BM(this, ["unequal"]),
        this.plane = [];
        for (let t = 0; t < this.planeL; t++) {
            var n = s[t % r]
              , p = n.element
              , d = p.width
              , c = p.height
              , p = {
                pts: a,
                zIndex: 0,
                lerp: {
                    ...h
                },
                ease: {
                    ...o
                },
                intro: {
                    ...l
                },
                tex: n,
                media: {
                    obj: p,
                    dimension: {
                        width: d,
                        height: c
                    },
                    ratio: {
                        wh: d / c,
                        hw: c / d
                    }
                },
                out: !1,
                geo: new Geo({
                    program: i,
                    mode: "TRIANGLE_STRIP",
                    face: "FRONT",
                    attrib: {
                        c: {
                            size: 2
                        },
                        index: {
                            size: 1
                        },
                        f: {
                            size: 2,
                            tex: n.attrib
                        }
                    }
                })
            }
              , c = Plane({
                p: p,
                tex: !0
            })
              , d = p.geo.attrib;
            d.c.data = new Float32Array(c.pos),
            d.index.data = new Uint16Array(c.index),
            d.f.data = new Float32Array(c.texture),
            p.geo.setVAO(),
            this.plane[t] = p
        }
    }
    draw(e) {
        var s = _A
          , r = s.win.w
          , a = s.win.h;
        for (let i = 0; i < 2; i++)
            for (let t = 0; t < this.planeL; t++) {
                var h, o, l, n, p, d = this.plane[t];
                d.zIndex === i && (p = d.lerp,
                o = d.ease,
                n = d.intro,
                h = p.x + n.x,
                o = p.y + o.y + n.y,
                l = p.w + n.w,
                n = p.h + n.h,
                p = 0 < p.opacity && 0 < n && 0 < l,
                h < r && 0 < h + l && o < a && 0 < o + n && p && (e || s.mutating) ? (d.out && (d.out = !1),
                d.geo.draw(d)) : d.out || (d.out = !0,
                d.geo.draw(d)))
            }
    }
    unequal(t) {
        var i = t.prop
          , e = this.lerp.r6.includes(i) ? 6 : 2;
        return 0 !== R.R(Math.abs(t.a[i] - t.b[i]), e)
    }
}
class RGL {
    constructor() {
        var t = R.G.id("gl");
        this.gl = t.getContext("webgl", {
            antialias: !0,
            alpha: !0
        }),
        this._ = {},
        R.BM(this, ["resize", "loop"]),
        this.raf = new R.RafR(this.loop)
    }
    load(t) {
        this.renderer = new Renderer({
            page: ["ho", "wo"],
            cb: t
        }),
        this.program = new Program({
            uniform: {
                d: {
                    type: "2fv",
                    value: [1, 1]
                },
                e: {
                    type: "2fv",
                    value: [0, 0]
                }
            }
        })
    }
    intro() {
        var t = _A.data
          , i = Object.keys(t)
          , e = i.length;
        this._.load = new PlaneTex({
            p: this.program,
            url: "load"
        }),
        this._.large = new PlaneTex({
            p: this.program,
            url: "/",
            isHomeLarge: !0
        }),
        this._.small = new PlaneTex({
            p: this.program,
            url: "/"
        });
        for (let t = 0; t < e; t++) {
            var s = i[t];
            "/" !== s && "load" !== s && (this._[s] = new PlaneTex({
                p: this.program,
                url: s
            }))
        }
    }
    run() {
        new R.ROR(this.resize).on(),
        this.resize(),
        this.raf.run()
    }
    resize() {
        this.renderer.resize()
    }
    loop() {
        this.renderer.render(this._)
    }
    clear() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    }
}
class Intro {
    constructor(t) {
        const i = _A;
        i.introducing = !0,
        R.T(R.G.id("load-no").children[0], 0, 0),
        this.introFx = new Fx$1,
        t(t=>{
            i.rgl = new RGL,
            i.rgl.load(t=>{
                this.cb()
            }
            )
        }
        )
    }
    cb() {
        var t = _A;
        t.rgl.intro(),
        t.e.intro(),
        t.e.init(),
        t.e.load.intro(),
        t.rgl.run(),
        t.e.run(),
        this.introFx.run()
    }
}
class Fx {
    constructor() {
        this.sail = R.G.id("sail"),
        this.sailFx = new R.M({
            el: this.sail,
            p: {
                opacity: [0, 1]
            }
        })
    }
    fadeOut(t) {
        var i = _A.fromBack;
        this.sailFx.play({
            d: i ? 0 : 400,
            e: "linear",
            cb: t.cb
        })
    }
    fadeIn() {
        var t = _A.fromBack ? 0 : 1e3;
        new Page({
            intro: !1
        }).play(),
        this.sailFx.play({
            reverse: !0,
            d: t,
            e: "o3",
            cb: !1
        })
    }
    tr() {
        new Page({
            intro: !1
        }).play()
    }
}
class Mutation {
    constructor() {
        this.mutationFx = new Fx
    }
    out() {
        const i = _A;
        var t = i.is
          , e = i.was;
        this.hToW = e.ho && t.wo,
        this.wToW = e.wo && t.wo,
        this.hToA = e.ho && t.ab,
        i.e.off(),
        (t.ho || t.ab) && i.e.nav.active.up(),
        this.hToW || this.wToW || this.hToA ? (this.wToW && i.e.wo.fxBack.hide({
            mutation: !0,
            delay: 0
        }).play(),
        i.page.update()) : (e.wo && i.e.wo.fxBack.hide({
            mutation: !0,
            delay: 0
        }).play(),
        this.mutationFx.fadeOut({
            cb: t=>{
                i.page.update()
            }
        }))
    }
    in() {
        var t = _A;
        this.hToW || this.wToW || this.hToA ? (t.page.insertNew(),
        t.e.init(),
        this.mutationFx.tr()) : (t.page.removeOld(),
        t.page.insertNew(),
        t.e.init(),
        this.mutationFx.fadeIn())
    }
}
new Controller({
    device: "d",
    engine: E,
    transition: {
        intro: Intro,
        mutation: Mutation
    }
});
