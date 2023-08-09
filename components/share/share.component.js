import { BUTTON } from "../../components/btn/btn.element.js";
import { ICON } from "../icon/icon.component.js";

export const SHARE = ({ title, url, className = "" } = {}) => {
  return new BUTTON({
    child: new ICON("share"),
    class: "share " + className,
    "data-title": title,
    "data-url": url,
  });
};
