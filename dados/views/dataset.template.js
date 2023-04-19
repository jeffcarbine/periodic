import { base } from "./_dados.template.js";
import * as e from "../../elements/elements.js";
import { card } from "../../components/card/card.template.js";
import { modalTemplate } from "../../components/modal/modal.template.js";
import { toggleSwitchTemplate } from "../../components/toggleswitch/toggleswitch.template.js";
import { capitalize } from "../../scripts/formatString/formatString.js";

export default (data) => {
  const datapointForms = {
    text: [
      new e.LABEL({
        textContent: "Content",
        child: new e.TEXTAREA({ name: "text" }),
      }),
    ],
    event: [
      new e.TEXT({
        name: "venue",
        label: "Venue",
      }),
      new e.TEXT({
        name: "street",
        label: "Street",
      }),
      new e.TEXT({
        name: "city",
        label: "City",
      }),
      new e.TEXT({
        name: "region",
        label: "Region",
      }),
      new e.TEXT({
        name: "country",
        label: "Country",
      }),
      new e.DATE({
        label: "Show Date",
      }),
      new e.TEXT({
        name: "tickets",
        label: "Tickets",
      }),
    ],
    show: [
      new e.TEXT({
        name: "title",
        label: "Title",
      }),
      new e.TEXT({
        name: "rss",
        label: "RSS",
      }),
      new e.TEXT({
        name: "patreon",
        label: "Patreon",
      }),
      new e.TEXT({
        name: "spotify",
        label: "Spotify",
      }),
      new e.TEXT({
        name: "youTube",
        label: "YouTube",
      }),
      new e.TEXT({
        name: "apple",
        label: "Apple",
      }),
    ],
  };

  const generateDatapointForm = () => {
    const children = [
      new e.H2(
        "New " +
          (data.dataset.restricted
            ? capitalize(data.dataset.restrictedTo)
            : "Datapoint")
      ),
      new e.TEXT("name"),
    ];

    // if this is a restricted dataset, don't render the datasetSelector
    if (!data.dataset.restricted) {
      children.push(
        new e.LABEL({
          textContent: "Type",
          child: new e.SELECT({
            id: "datasetSelector",
            name: "datasetSelector",
            "data-targets": ".datapointForm",
            children: ["text", "event", "show"],
          }),
        })
      );
    }

    // loop through the different datapointForms and push where applicable
    for (let type in datapointForms) {
      if (!data.dataset.restricted || data.dataset.restrictedTo === type) {
        const datapointForm = datapointForms[type];
        children.push({
          id: type + "-form",
          class:
            type +
            " datapointForm" +
            (!data.dataset.restricted
              ? type !== "text"
                ? " hidden"
                : ""
              : ""),
          children: datapointForm,
        });
      }
    }

    return new e.FORM({
      method: "POST",
      action: "/admin/datasets/add",
      class: "style-inputs xhr",
      "data-redirect": "/admin/datasets",
      children,
    });
  };

  return base(
    data,
    {
      children: [
        new e.H1([
          new e.ICON("data"),
          new e.A({ href: "/admin/datasets", textContent: "Datasets" }),
          new e.ICON("chevronRight"),
          data.dataset.name,
        ]),
        new e.BTNCONTAINER(
          [
            {
              id: "editDataset",
              "data-modal": "editDatasetModal",
              children: [new e.ICON("edit"), "Edit Dataset"],
            },
            {
              id: "addDatapoint",
              "data-modal": "addDatapointModal",
              children: [new e.ICON("plus"), "Create New Datapoint"],
            },
          ],
          "centered"
        ),
        {
          id: "modals",
          children: [
            modalTemplate(
              new e.FORM({
                method: "POST",
                action: "/admin/datasets/add",
                class: "style-inputs xhr",
                children: [
                  new e.H2("Edit Dataset"),
                  new e.TEXT({ name: "name", value: data.dataset.name }),
                  toggleSwitchTemplate({
                    name: "restricted",
                    label: "Restrict to One Datapoint",
                    checked: data.dataset.restricted,
                  }),
                  new e.LABEL({
                    id: "restrictedTo",
                    class:
                      "active" + (data.dataset.restricted ? "" : " hidden"),
                    textContent: "Dataset Restricted To",
                    child: new e.SELECT({
                      name: "restrictedTo",
                      selected: data.dataset.restrictedTo.toString(),
                      children: ["text", "image", "event", "show"],
                    }),
                  }),
                  new e.BTN({
                    id: "createDataset",
                    textContent: "Saves Changes",
                  }),
                ],
              }),
              "editDatasetModal"
            ),
            modalTemplate(generateDatapointForm(), "addDatapointModal"),
          ],
        },

        new e.SECTION({
          id: "datapoints",
        }),
      ],
    },
    [
      new e.MODULE("/periodic/elements/input/_input.js"),
      new e.MODULE("/periodic/scripts/xhr/_xhrForm.js"),
      new e.MODULE("/admin/scripts/dataset.js"),
    ]
  );
};