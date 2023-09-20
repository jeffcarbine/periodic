import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";

export const datapointListTemplate = ({ datapointId, exclude = [] } = {}) => {
  return {
    class: "datapoint-list",
    "data-exclude": JSON.stringify(exclude),
    "data-id": datapointId,
  };
};

export const generateDatapointListItems = (datapoints, exclude, parentId) => {
  const children = [];

  datapoints.forEach((datapoint) => {
    if (!exclude.includes(datapoint._id)) {
      const iconName = type !== "group" ? datapoint.type : datapoint.groupType;
      children.push(
        new e.LI([
          {
            class: "datapoint-icon",
            child: new c.ICON(iconName),
          },
          {
            class: "datapoint-name",
            child: new e.SPAN({
              textContent: datapoint.name,
            }),
          },
          new c.BTN({
            class: "sm addExistingDatapoint",
            "data-id": datapoint._id,
            "data-parentid": parentId,
            children: [new c.ICON("plus"), "Add"],
          }),
        ])
      );
    }
  });

  return new e.UL({
    class: "list",
    children,
  });
};
