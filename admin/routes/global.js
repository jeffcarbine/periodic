import { P } from "../../elements/elements.js";
import Datapoint from "../models/Datapoint.js";
import { rez } from "../modules/rez.js";
import asyncLoop from "node-async-loop";

export const get__admin_global = (req, res, next) => {
  const renderGlobal = (datapoints) => {
    rez({
      req,
      res,
      template: "global",
      data: {
        title: "Global",
        datapoints,
        path: "/periodic/admin/global",
      },
    });
  };

  Datapoint.find({ global: true }).exec((err, datapoints) => {
    // loop through these and handle retrieveing group datapoints
    if (datapoints.length > 0) {
      asyncLoop(
        datapoints,
        (datapoint, next) => {
          if (datapoint.type === "group") {
            datapoint.datapoints = [];

            if (datapoint.group.length > 0) {
              // then we need to retrieve the children datapoints
              retrieveDatapoints(datapoint.group, datapoint.datapoints, next);
            } else {
              next();
            }
          } else {
            next();
          }
        },
        (err) => {
          if (err) {
            console.log(err);
          } else {
            renderGlobal(datapoints);
          }
        }
      );
    } else {
      renderGlobal([]);
    }
  });

  const retrieveDatapoints = (ids, parent, callback) => {
    asyncLoop(
      ids,
      (datapointId, next) => {
        Datapoint.findOne({ _id: datapointId }).exec((err, datapoint) => {
          parent.push(datapoint);

          // check if the datapoint is a group
          if (datapoint.type === "group") {
            datapoint.datapoints = [];

            if (datapoint.group.length > 0) {
              // then we need to retrieve the children datapoints
              retrieveDatapoints(datapoint.group, datapoint.datapoints, next);
            } else {
              next();
            }
          } else {
            next();
          }
        });
      },
      (err) => {
        if (err) {
          console.log(err);
        } else {
          callback();
        }
      }
    );
  };
};