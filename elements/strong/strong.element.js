import { ELEMENT } from "../element.js";

export class STRONG extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "strong";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}
