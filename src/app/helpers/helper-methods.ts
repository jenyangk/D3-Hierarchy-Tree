import { InternMap } from 'd3-array'

export class HelperMethods {
      /**
   * Groups and reduces the specified iterable of values into an InternMap from key to value
   *
   * @remarks
   * Please use d3.rollup if there are less than 3 keys needed.
   *
   * @privateRemarks
   * Implementation from D3-Array Group (ISC License): https://github.com/d3/d3-array/blob/main/src/group.js
   * This implementation is manually imported because the rollup
   * definition from DefinitelyTyped does not support an infinite list of keys.
   */
  public static rollup(values: any, reduce: Function, keys: any[]): InternMap {
    return (function regroup(values, i) {
      if (i >= keys.length) return reduce(values);
      const groups = new InternMap();
      const keyof = keys[i++];
      let index = -1;
      for (const value of values) {
        const key = keyof(value, ++index, values);
        const group = groups.get(key);
        if (group) group.push(value);
        else groups.set(key, [value]);
      }
      for (const [key, values] of groups) {
        groups.set(key, regroup(values, i));
      }
      return groups;
    })(values, 0);
  }
}