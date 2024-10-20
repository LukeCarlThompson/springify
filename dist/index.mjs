var X = Object.defineProperty;
var A = (h) => {
  throw TypeError(h);
};
var q = (h, s, i) => s in h ? X(h, s, { enumerable: !0, configurable: !0, writable: !0, value: i }) : h[s] = i;
var b = (h, s, i) => q(h, typeof s != "symbol" ? s + "" : s, i), E = (h, s, i) => s.has(h) || A("Cannot " + i);
var t = (h, s, i) => (E(h, s, "read from private field"), i ? i.call(h) : s.get(h)), a = (h, s, i) => s.has(h) ? A("Cannot add the same private member more than once") : s instanceof WeakSet ? s.add(h) : s.set(h, i), e = (h, s, i, n) => (E(h, s, "write to private field"), n ? n.call(h, i) : s.set(h, i), i);
var u, r, m, w, o, c, f, p, l, d, g, v, y, S, F;
class B {
  constructor({ input: s = 0, stiffness: i = 10, damping: n = 30, mass: T = 20 } = {}) {
    b(this, "stiffness");
    b(this, "damping");
    b(this, "mass");
    a(this, u);
    a(this, r);
    a(this, m, 0);
    a(this, w, 0);
    a(this, o);
    a(this, c);
    a(this, f);
    a(this, p);
    a(this, l);
    a(this, d, /* @__PURE__ */ new Set());
    a(this, g, /* @__PURE__ */ new Set());
    a(this, v, () => {
      t(this, o) || t(this, y).call(this);
    });
    a(this, y, () => {
      e(this, f, Date.now()), t(this, o) || e(this, c, t(this, f) - 1), e(this, p, t(this, f) - t(this, c)), e(this, c, t(this, f)), e(this, o, !0), t(this, F).call(this), t(this, d).forEach((s) => {
        s({ output: t(this, r), velocity: t(this, m) });
      }), e(this, o, !(Math.abs(t(this, m)) < 0.1 && Math.abs(t(this, r) - t(this, u)) < 0.01)), t(this, o) ? (cancelAnimationFrame(t(this, l)), e(this, l, requestAnimationFrame(t(this, y)))) : (e(this, o, !1), t(this, g).forEach((s) => {
        s({ output: t(this, r), velocity: t(this, m) });
      }));
    });
    /**
     * Takes a percent value and returns the number within min/max range
     * @param percent The input value to convert to a percentage.
     * @param min The minimum limit of the range.
     * @param max The maximum limit of the range.
     * @returns A value from 0 - 100 within the min and max
     */
    a(this, S, (s, i, n) => s * (n - i) / 100 + i);
    a(this, F, () => {
      const s = t(this, S).call(this, this.stiffness, -1, -300), i = t(this, S).call(this, this.damping, -0.4, -20), n = t(this, S).call(this, this.mass, 0.1, 10), T = s * (t(this, r) - t(this, u)), M = i * t(this, m);
      e(this, w, (T + M) / n), e(this, m, t(this, m) + t(this, w) * (t(this, p) / 1e3)), e(this, r, t(this, r) + t(this, m) * (t(this, p) / 1e3));
    });
    b(this, "subscribe", (s, i = "frame") => {
      let n;
      return i == "frame" ? (t(this, d).add(s), n = () => {
        t(this, d).delete(s);
      }) : (t(this, g).add(s), n = () => {
        t(this, g).delete(s);
      }), n;
    });
    e(this, o, !1), e(this, c, 0), e(this, f, 0), e(this, p, 0), e(this, l, 0), this.stiffness = i, this.damping = n, this.mass = T, e(this, u, s), e(this, r, s);
  }
  set input(s) {
    e(this, u, s), t(this, v).call(this);
  }
  get input() {
    return t(this, u);
  }
  get output() {
    return t(this, r);
  }
}
u = new WeakMap(), r = new WeakMap(), m = new WeakMap(), w = new WeakMap(), o = new WeakMap(), c = new WeakMap(), f = new WeakMap(), p = new WeakMap(), l = new WeakMap(), d = new WeakMap(), g = new WeakMap(), v = new WeakMap(), y = new WeakMap(), S = new WeakMap(), F = new WeakMap();
export {
  B as Springify
};
