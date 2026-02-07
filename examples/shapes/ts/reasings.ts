// Ported from examples/shapes/reasings.h (raylib easings library)

const PI = Math.PI;

export function EaseLinearNone(t: number, b: number, c: number, d: number): number {
  return (c * t / d + b);
}
export const EaseLinearIn = EaseLinearNone;
export const EaseLinearOut = EaseLinearNone;
export const EaseLinearInOut = EaseLinearNone;

export function EaseSineIn(t: number, b: number, c: number, d: number): number {
  return (-c * Math.cos(t / d * (PI / 2.0)) + c + b);
}
export function EaseSineOut(t: number, b: number, c: number, d: number): number {
  return (c * Math.sin(t / d * (PI / 2.0)) + b);
}
export function EaseSineInOut(t: number, b: number, c: number, d: number): number {
  return (-c / 2.0 * (Math.cos(PI * t / d) - 1.0) + b);
}

export function EaseCircIn(t: number, b: number, c: number, d: number): number {
  t /= d;
  return (-c * (Math.sqrt(1.0 - t * t) - 1.0) + b);
}
export function EaseCircOut(t: number, b: number, c: number, d: number): number {
  t = t / d - 1.0;
  return (c * Math.sqrt(1.0 - t * t) + b);
}
export function EaseCircInOut(t: number, b: number, c: number, d: number): number {
  t /= d / 2.0;
  if (t < 1.0) return (-c / 2.0 * (Math.sqrt(1.0 - t * t) - 1.0) + b);
  t -= 2.0;
  return (c / 2.0 * (Math.sqrt(1.0 - t * t) + 1.0) + b);
}

export function EaseCubicIn(t: number, b: number, c: number, d: number): number {
  t /= d;
  return (c * t * t * t + b);
}
export function EaseCubicOut(t: number, b: number, c: number, d: number): number {
  t = t / d - 1.0;
  return (c * (t * t * t + 1.0) + b);
}
export function EaseCubicInOut(t: number, b: number, c: number, d: number): number {
  t /= d / 2.0;
  if (t < 1.0) return (c / 2.0 * t * t * t + b);
  t -= 2.0;
  return (c / 2.0 * (t * t * t + 2.0) + b);
}

export function EaseQuadIn(t: number, b: number, c: number, d: number): number {
  t /= d;
  return (c * t * t + b);
}
export function EaseQuadOut(t: number, b: number, c: number, d: number): number {
  t /= d;
  return (-c * t * (t - 2.0) + b);
}
export function EaseQuadInOut(t: number, b: number, c: number, d: number): number {
  t /= d / 2.0;
  if (t < 1.0) return (c / 2.0 * (t * t) + b);
  return (-c / 2.0 * (((t - 1.0) * (t - 3.0)) - 1.0) + b);
}

export function EaseExpoIn(t: number, b: number, c: number, d: number): number {
  return (t === 0.0) ? b : (c * Math.pow(2.0, 10.0 * (t / d - 1.0)) + b);
}
export function EaseExpoOut(t: number, b: number, c: number, d: number): number {
  return (t === d) ? (b + c) : (c * (-Math.pow(2.0, -10.0 * t / d) + 1.0) + b);
}
export function EaseExpoInOut(t: number, b: number, c: number, d: number): number {
  if (t === 0.0) return b;
  if (t === d) return (b + c);
  t /= d / 2.0;
  if (t < 1.0) return (c / 2.0 * Math.pow(2.0, 10.0 * (t - 1.0)) + b);
  return (c / 2.0 * (-Math.pow(2.0, -10.0 * (t - 1.0)) + 2.0) + b);
}

export function EaseBackIn(t: number, b: number, c: number, d: number): number {
  let s = 1.70158;
  t /= d;
  return (c * t * t * ((s + 1.0) * t - s) + b);
}
export function EaseBackOut(t: number, b: number, c: number, d: number): number {
  let s = 1.70158;
  t = t / d - 1.0;
  return (c * (t * t * ((s + 1.0) * t + s) + 1.0) + b);
}
export function EaseBackInOut(t: number, b: number, c: number, d: number): number {
  let s = 1.70158;
  t /= d / 2.0;
  if (t < 1.0) {
    s *= 1.525;
    return (c / 2.0 * (t * t * ((s + 1.0) * t - s)) + b);
  }
  t -= 2.0;
  s *= 1.525;
  return (c / 2.0 * (t * t * ((s + 1.0) * t + s) + 2.0) + b);
}

export function EaseBounceOut(t: number, b: number, c: number, d: number): number {
  t /= d;
  if (t < (1.0 / 2.75)) {
    return (c * (7.5625 * t * t) + b);
  } else if (t < (2.0 / 2.75)) {
    t -= (1.5 / 2.75);
    return (c * (7.5625 * t * t + 0.75) + b);
  } else if (t < (2.5 / 2.75)) {
    t -= (2.25 / 2.75);
    return (c * (7.5625 * t * t + 0.9375) + b);
  }
  t -= (2.625 / 2.75);
  return (c * (7.5625 * t * t + 0.984375) + b);
}
export function EaseBounceIn(t: number, b: number, c: number, d: number): number {
  return (c - EaseBounceOut(d - t, 0.0, c, d) + b);
}
export function EaseBounceInOut(t: number, b: number, c: number, d: number): number {
  if (t < d / 2.0) return (EaseBounceIn(t * 2.0, 0.0, c, d) * 0.5 + b);
  return (EaseBounceOut(t * 2.0 - d, 0.0, c, d) * 0.5 + c * 0.5 + b);
}

export function EaseElasticIn(t: number, b: number, c: number, d: number): number {
  if (t === 0.0) return b;
  t /= d;
  if (t === 1.0) return (b + c);

  const p = d * 0.3;
  const a = c;
  const s = p / 4.0;
  const postFix = a * Math.pow(2.0, 10.0 * (t - 1.0));

  return (-(postFix * Math.sin((t * d - s) * (2.0 * PI) / p)) + b);
}
export function EaseElasticOut(t: number, b: number, c: number, d: number): number {
  if (t === 0.0) return b;
  t /= d;
  if (t === 1.0) return (b + c);

  const p = d * 0.3;
  const a = c;
  const s = p / 4.0;

  return (a * Math.pow(2.0, -10.0 * t) * Math.sin((t * d - s) * (2.0 * PI) / p) + c + b);
}
export function EaseElasticInOut(t: number, b: number, c: number, d: number): number {
  if (t === 0.0) return b;
  t /= d / 2.0;
  if (t === 2.0) return (b + c);

  const p = d * (0.3 * 1.5);
  const a = c;
  const s = p / 4.0;

  if (t < 1.0) {
    const postFix = a * Math.pow(2.0, 10.0 * (t - 1.0));
    return -0.5 * (postFix * Math.sin((t * d - s) * (2.0 * PI) / p)) + b;
  }

  const postFix = a * Math.pow(2.0, -10.0 * (t - 1.0));
  return (postFix * Math.sin((t * d - s) * (2.0 * PI) / p) * 0.5 + c + b);
}
