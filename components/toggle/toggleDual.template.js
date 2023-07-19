import * as e from "../../elements/elements.js";
import {
  camelize,
  capitalizeAll,
} from "../../modules/formatString/formatString.js";

export const toggleDualTemplate = ({
  name,
  label1,
  id1 = camelize(label1),
  value1 = camelize(label1),
  labelFor1 = camelize(label1),
  dataTargets1,
  label2,
  id2 = camelize(label2),
  value2 = camelize(label2),
  labelFor2 = camelize(label2),
  checked2 = false,
  dataTargets2,
  checked1 = !checked2,
} = {}) => {
  const radioData1 = {
    type: "radio",
    id: id1,
    name,
    value: value1,
  };

  if (checked1) {
    radioData1.checked = checked1;
  }

  if (dataTargets1 !== undefined) {
    radioData1["data-targets"] = dataTargets1;
  }

  const radioData2 = {
    type: "radio",
    id: id2,
    name,
    value: value2,
  };

  if (checked2) {
    radioData2.checked = checked2;
  }

  if (dataTargets2 !== undefined) {
    radioData2["data-targets"] = dataTargets2;
  }

  return {
    class: "toggle dual",
    children: [
      new e.INPUT(radioData1),
      new e.LABEL({
        textContent: capitalizeAll(label1),
        for: labelFor1,
      }),
      new e.INPUT(radioData2),
      new e.LABEL({
        textContent: capitalizeAll(label2),
        for: labelFor2,
      }),
    ],
  };
};
