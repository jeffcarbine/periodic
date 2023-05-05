import { base } from "./_dados.template.js";
import * as e from "../../elements/elements.js";
import { card } from "../../components/card/card.template.js";
import { modalTemplate } from "../../components/modal/modal.template.js";
import { toggleSwitchTemplate } from "../../components/toggleswitch/toggleswitch.template.js";
import { createEditDatasetTemplate } from "../templates/createEditDataset.template.js";

export default (data) => {
  return base(
    data,
    {
      children: [
        new e.H1([new e.ICON("globe"), "Global"]),
        new e.BTNCONTAINER(
          [
            {
              "data-modal": "addDataset",
              children: [new e.ICON("plus"), "Create Global Datapoint"],
            },
          ],
          "centered"
        ),
        modalTemplate(createEditDatasetTemplate(), "addDataset"),
        new e.SECTION({
          id: "datasets",
          class: "card-canvas",
        }),
      ],
    },
    [
      new e.MODULE("/periodic/elements/input/input.js"),
      new e.MODULE("/periodic/scripts/xhr/_xhrForm.js"),
      new e.MODULE("/admin/scripts/datasets.js"),
    ]
  );
};