import pxtorem from "postcss-pxtorem";

export default {
  plugins: [
    pxtorem({ rootValue: 75, propList: ["*"], selectorBlackList: ["html"] }),
  ],
};
