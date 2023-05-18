import * as e from "../../elements/elements.js";

export const accordionTemplate = ({
  className = "",
  title = "",
  body = "",
} = {}) => {
  const accordionBody = body;
  accordionBody.class += " accordion-body";

  return {
    class: "accordion " + className,
    children: [
      new e.BUTTON({
        class: "accordion-button",
        child: new e.SPAN(title),
      }),
      accordionBody,
    ],
  };
};
