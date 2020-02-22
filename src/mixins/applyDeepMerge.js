import diff from "deep-diff";
import { applyDiff } from "vue-deep-diff-apply";

// Merges all levels of an object

export default {
  methods: {
    applyDeepMerge(origObject, newValues) {
      function isObject(item) {
        return item && typeof item === "object" && !Array.isArray(item);
      }

      function deepMerge(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();

        if (isObject(target) && isObject(source)) {
          for (let key in source) {
            if (isObject(source[key])) {
              if (!target[key]) Object.assign(target, { [key]: {} });
              deepMerge(target[key], source[key]);
            } else {
              Object.assign(target, { [key]: source[key] });
            }
          }
        }

        return deepMerge(target, ...sources);
      }

      let updateTo = deepMerge({}, origObject, newValues);
      let differences = diff(origObject, updateTo);

      if (differences) {
        applyDiff(origObject, differences);
      }
    }
  }
};
