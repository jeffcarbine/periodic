import { ELEMENT } from "../element.js";

export class BR extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "br";
  }
}
