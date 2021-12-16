const ref = (defaultValue) =>
  new Proxy(
    { 0: defaultValue },
    {
      get: (object) => object[0],
      set: (object, p, value) => {
        object[0] = value;
        return true;
      },
    },
  );

export const $entities = ref([]);
export const $players = ref([]);
export const $bombs = ref([]);
export const $effects = ref([]);
