import { BTN, ICON } from "../components.js";

export const CLICKTOCOPY = (text) => {
  return {
    "data-component": "clickToCopy",
    class: "clickToCopy",
    children: [
      {
        class: "text",
        child: {
          textContent: text,
        },
      },
      new BTN({
        class: "copy icon-only",
        child: new ICON("copy"),
        "data-text": text,
      }),
    ],
  };
};
