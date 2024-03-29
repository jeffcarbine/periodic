import { generateUniqueId } from "../../modules/generateUniqueId/generateUniqueId.js";
import { camelize } from "../../modules/formatString/formatString.js";
import { SQUARE, ICON } from "../components.js";
import {
  BUTTON,
  IMG,
  LI,
  SPAN,
  UL,
  ULLI,
  INPUT,
  LABEL,
} from "../../elements/elements.js";

export class FIELD__ARRAYENTRY {
  constructor(params = "") {
    this.class = "arrayEntry";
    this.children = [
      params,
      new BUTTON({
        type: "button",
        class: "arrayEntry__remove",
        child: new ICON("close"),
      }),
    ];
  }
}

export class FIELD {
  constructor(params = {}) {
    // if there is an if param, check if it is true
    // if not, return null
    if (params.if !== undefined && params.if === false) {
      return null;
    }

    // set the data-component attribute
    this["data-component"] = "field";

    // set the data-name attribute
    this["data-name"] = params.name;

    // default to text type if no type is provided
    const type = params.type || "text";

    // check to see if this is a typed input
    const typedTypes = [
      "text",
      "password",
      "email",
      "number",
      "date",
      "time",
      "richtext",
      "url",
      "tel",
      "textarea",
      "select",
      "array",
      "file",
      "simplecurrency",
      "simpledate",
    ];

    const typed = typedTypes.includes(type);

    // set the class name for object
    this.class = `field ${type}-field ${typed ? "typed" : ""} ${
      params.className || ""
    }`;

    // create the input/textarea element
    let input = {
      tagName: "input",
    };

    // if it is a date, format the value
    if (type === "date") {
      params.value = params.value
        ? new Date(params.value).toISOString().split("T")[0]
        : "";
    }

    // if type is textarea, change the input to a textarea
    if (type === "textarea" || type === "richtext") {
      input.tagName = "textarea";
      input.innerHTML = params.value;

      // if no rows, default to 4
      if (!params.rows) {
        params.rows = 6;
      }
      // if the type is select, change the input to a select
    } else if (type === "select") {
      input.tagName = "select";
    } else {
      // assign the type attribute
      input.type = type;
    }

    // if no id, but name then id = name
    if (!params.id && params.name) {
      params.id = params.name;
    } else {
      // otherwise generate a unique id
      params.id = generateUniqueId();
    }

    // all the keys we want to skip
    const skipKeys = ["type", "label", "preview", "options", "selected"];

    // assign all other params to the input
    for (let key in params) {
      if (!skipKeys.includes(key)) {
        input[key] = params[key];
      }
    }

    // put that inside of the input wrapper
    const wrapper = {
      class: `wrapper ${typed ? "typed" : ""} ${
        params.label ? "hasLabel" : "noLabel"
      }`,
      "data-emit": `${params.name}--validation`,
      "data-emit-neq": "",
      "data-emit-to": "class",
      "data-emit-value": "invalid",
      children: [input],
    };

    const focus = {
      tag: "span",
      class: "focus",
    };

    // insert the focus into the wrapper children if it is a typed input
    if (typed) {
      wrapper.children.push(focus);
    }

    // if there is a buttonIcon, add it to the wrapper
    if (params.buttonIcon) {
      wrapper.class += " hasButton";

      wrapper.children.push({
        tagName: "button",
        type: "button",
        class: `inputButton ${params.buttonClass || ""}`,
        child: new ICON(params.buttonIcon),
      });
    }

    //
    //
    //
    // MODIFICATIONS
    // these are modifications to the field depending on type
    //
    //
    //

    //
    //
    // SELECT
    // if a select field, create the options
    if (type === "select") {
      input.children = [];

      const optionValue = (option) => {
        if (typeof option === "string") {
          return camelize(option);
        } else if (typeof option === "number") {
          return option;
        } else {
          return option.value;
        }
      };

      const fauxSelectData = {
        class: "faux-select",
      };

      params.options.forEach((option, index) => {
        const optionParams = {
          tagName: "option",
          value: optionValue(option),
          textContent:
            typeof option === "string" || typeof option === "number"
              ? option
              : option.name,
        };

        if (index === 0 && option.help !== undefined) {
          // set theh params.help to the first one, which will be overwritten if there is a selected option
          params.help = option.help;
        }

        // if there is a disabled option, add it
        if (option.disabled !== undefined && option.disabled === true) {
          optionParams.disabled = true;
        }

        // if there is a help value, add it
        if (option.help !== undefined) {
          optionParams["data-help"] = option.help;
        }

        if (params.selected !== undefined) {
          if (option === params.selected || option.value === params.selected) {
            optionParams.selected = true;
            params.help = option.help;
            fauxSelectData.textContent = optionParams.textContent;
          }
        }

        input.children.push(optionParams);
      });

      // and add the faux select span
      const fauxSelect = new SPAN(fauxSelectData);

      wrapper.children.push(fauxSelect);
    }

    //
    //
    // FILE
    // if this is a file, we need to create the base64file input
    if (type === "file") {
      const base64file = {
        tagName: "input",
        type: "hidden",
        name: params.name,
        value: params.value,
      };

      // and change the input's name to
      input.name = `${params.name}__File`;

      wrapper.children.push(base64file);
    }

    //
    //
    // SIMPLEDATE
    // if this is a simpledate, we need to create the hidden input
    if (type === "simpledate") {
      const hidden = {
        tagName: "input",
        type: "hidden",
        name: params.name,
        value: params.value,
      };

      // and change the input's name to
      input.name = `${params.name}__Date`;

      // and the type to date
      input.type = "date";

      // and add a data attribute
      input["data-simpledate"] = params.name;

      // and convert the YYYYMMDD number to YYYY-MM-DD string
      if (params.value) {
        const year = params.value.toString().slice(0, 4),
          month = params.value.toString().slice(4, 6),
          day = params.value.toString().slice(6, 8);

        input.value = `${year}-${month}-${day}`;
      }

      wrapper.children.push(hidden);
    }

    //
    //
    // CURRENCY OR SIMPLECURRENCY
    // if this is a currency, we need to add the prefix
    if (type === "currency" || type === "simplecurrency") {
      wrapper.children.unshift({
        class: "prefix",
        textContent: "$",
      });

      // add the has-prefix class to the wrapper
      wrapper.class += " has-prefix";

      // and change the type to number
      input.type = "number";

      // and convert the cents to dollars
      if (params.value) {
        input.value = (params.value / 100).toFixed(2);
      }
    }

    //
    //
    // SIMPLECURRENCY
    if (type === "simplecurrency") {
      // if simplecurrency, we need to add the hidden input
      const hidden = {
        tagName: "input",
        type: "hidden",
        name: params.name,
        value: params.value,
      };

      wrapper.children.push(hidden);

      // and change the input's name to
      input.name = `${params.name}__Number`;

      // and add a data attribute
      input["data-simplecurrency"] = params.name;
    }

    //
    //
    // FULLCHECKBOX OR FULLRADIO
    if (type === "fullcheckbox" || type === "fullradio") {
      input.type = type.replace("full", "");
      wrapper.class += ` ${type}`;
    }

    //
    //
    // CHECKBOX, FULLCHECKBOX, RADIO OR FULLRADIO
    if (
      type === "checkbox" ||
      type === "fullcheckbox" ||
      type === "radio" ||
      type === "fullradio" ||
      type === "togglesingle"
    ) {
      wrapper["data-checked"] = params.checked;

      if (type === "checkbox" || type === "radio") {
        // add the pseudo checkbox/radio/toggle after the input
        // but before the focus span
        wrapper.children.splice(1, 0, {
          class: "pseudo",
        });
      }

      if (params.checked == false) {
        delete input.checked;
      }
    }

    //
    //
    // ARRAY
    if (type === "array") {
      // then we need to create multiple checkbox/label pairs out of
      // the comma-separated array param and place them inside the wrapper
      // and make the input hidden
      input.type = "hidden";
      // conver the array to comma separated string
      input.value = params?.value?.join(",") || "";

      // if options are provided, then generate a series of checkboxes
      // for each of the predetermined options
      if (params.options) {
        wrapper.class += " hasOptions";

        const arr = Array.isArray(params.options)
          ? params.options
          : params.options.split(",");

        arr.forEach((item) => {
          const subField = new FIELD({
            type: "checkbox",
            name: `${params.name}__${item}`,
            label: item,
            "data-input": params.name,
            checked: params.value.includes(item),
            value: item,
          });

          wrapper.children.push(subField);
        });
      } else {
        // otherwise, create a holder for the array tags
        const arrayEntries = {
          class: `arrayEntries ${params.style === "tag" ? "tag-style" : ""}`,
          children: [],
        };

        // and process any of the values, if any, that are already in the array
        // and add them as FIELD__ARRAYENTRY
        if (params.value) {
          params.value.forEach((item) => {
            const subField = new FIELD__ARRAYENTRY(item);

            arrayEntries.children.push(subField);
          });
        }

        // and a text input for adding new values to the array
        const subField = new FIELD({
          type: "text",
          name: `${params.name}__new`,
          label: "Add New",
          "data-input": params.name,
          buttonIcon: "plus",
          buttonClass: "array__add",
        });

        wrapper.children.push(arrayEntries, subField);
      }

      // then make the wrapper a fieldset
      wrapper.tagName = "fieldset";

      // create a legend inside the wrapper
      wrapper.children.unshift({
        tagName: "legend",
        textContent: params.label,
      });

      // and then null out the label so it doesn't render
      params.label = null;
    }

    //
    //
    // TOGGLESINGLE
    if (type === "togglesingle") {
      // then we need to create a single checkbox
      // using the input as the value

      // modify the input
      input.type = "checkbox";

      if (params.checked) {
        input.checked = params.checked;
      }

      // and create the toggle element
      const toggle = {
        class: "toggle",
      };

      // check to see if there is a checkedIcon and uncheckedIcon value
      // and add them to the toggle as children
      if (params.checkedIcon) {
        if (!toggle.children) toggle.children = [];

        toggle.children.push({
          class: "checkedIcon",
          child: new ICON(params.checkedIcon),
        });
      }

      if (params.uncheckedIcon) {
        if (!toggle.children) toggle.children = [];

        toggle.children.push({
          class: "uncheckedIcon",
          child: new ICON(params.uncheckedIcon),
        });
      }

      // put the label and input into the wrapper
      wrapper.children.push(toggle);
    }

    //
    //
    // TOGGLEDUAL
    if (type === "toggledual") {
      // then we need to create two radio buttons
      // using the input as the first value and
      // a new input as a second value

      // modify the first input
      input.type = "radio";
      input.value = params.values[0];
      input.id = `${params.id}--${params.values[0]}`;
      input["data-number"] = 1;

      // create the first label
      const label1 = {
        tagName: "label",
        textContent: params.labels[0],
        for: `${params.id}--${params.values[0]}`,
      };

      // create the second input
      const input2 = {
        tagName: "input",
        type: "radio",
        name: params.name,
        value: params.values[1],
        id: `${params.id}--${params.values[1]}`,
        "data-number": 2,
      };

      // if the checked value is the same as the second value
      // then set the input to checked and the wrapper data-toggled
      if (params.checked === params.values[1]) {
        input2.checked = true;
        wrapper["data-toggled"] = 2;
      } else {
        // set it to the first value
        input.checked = true;
        wrapper["data-toggled"] = 1;
      }

      // create the second label
      const label2 = {
        tagName: "label",
        textContent: params.labels[1],
        for: `${params.id}--${params.values[1]}`,
      };

      // and create the toggle element
      const toggle = {
        class: "toggle",
      };

      // put all four elements into the wrapper
      wrapper.children.push(label1, toggle, input2, label2);

      // and move the focus element to index 5
      wrapper.children.splice(5, 0, wrapper.children.splice(1, 1)[0]);
    }

    //
    //
    // RICHTEXT
    if (type === "richtext") {
      input.rows = 8;

      // create the rich text editor
      const richText = {
        class: "richText",
        "data-input": params.name,
        child: {
          class: "quill",
          innerHTML: params.value || "",
        },
      };

      // and add it to the wrapper
      wrapper.children.unshift(richText);
    }

    //
    //
    // END MODIFICATIONS
    //
    //

    // create the label element
    let label;

    // if there is a label, create it
    if (params.label) {
      label = {
        tagName: "label",
        textContent: params.label,
        for: params.id,
      };

      if (params.required === false) {
        label.append = new SPAN("(Optional)");
      }
    }

    // create the validation element
    const validation = {
      tagName: "span",
      class: "validation",
      "data-emit": `${params.name}--validation`,
    };

    // create the help element
    const help = {
      tagName: "span",
      class: "help",
      "data-emit": `${params.name}--help`,
    };

    // check the type of help that is coming in
    if (typeof params.help === "string") {
      help.textContent = params.help;
    } else if (Array.isArray(params.help)) {
      help.children = params.help;
    } else if (typeof params.help === "object") {
      help.child = params.help;
    }

    // set the children
    this.children = [wrapper, help, validation];

    // put the label second if checkbox or radio or togglesingle
    if (type === "checkbox" || type === "radio" || type === "togglesingle") {
      // if label, put it at index 1
      if (label) {
        this.children.splice(1, 0, label);
      }
    } else if (type === "fullradio" || type === "fullcheckbox") {
      // if label, put inside the wrapper as index 1
      if (label) {
        wrapper.children.splice(1, 0, label);
      }
    } else {
      // if label, put it at index 0
      if (label) {
        this.children.splice(0, 0, label);
      }
    }

    // if there is a preview, prepend it to the children
    if (type === "file" && params.preview === true) {
      input.class = `${
        input.class !== undefined ? input.class : ""
      } hasPreview`;

      const preview = {
        class: "preview",
        children: [
          new IMG({
            class: "imagePreview",
            style: params.value !== undefined ? "opacity: 1" : "",
            src: params.value || "",
          }),
          {
            class: "placeholder",
            children: [new ICON("image")],
            style: params.value !== undefined ? "opacity: 0" : "",
          },
        ],
      };

      // place the preview before the wrapper
      this.children.splice(1, 0, preview);
    }

    // if this is a reordder, then make the input hidden
    // and add the reorganize ui
    if (type === "reorder") {
      input.type = "hidden";

      // if the params.value is an array of objects, then we need to
      // reduce it to an array of the object's values and pass that as
      // the input value
      if (Array.isArray(params.value)) {
        input.value = params.value.map((item) => item.value).join(",");
      }

      const generateReorderListItems = () => {
        const arr = Array.isArray(params.value)
            ? params.value
            : params.value.split(","),
          reorderListItems = [];

        arr.forEach((item, index) => {
          const listItem = new LI({
            class: "reorderItem",
            "data-originalindex": index,
            "data-value": item.value || item,
            children: [
              {
                class: "handle",
                role: "button",
                "aria-label": "Drag item",
                child: new ICON("dragHandle"),
              },
              new SPAN(item.name || item),
            ],
          });

          reorderListItems.push(listItem);
        });

        return reorderListItems;
      };

      const reorganizeList = new UL({
        class: "reorderList",
        children: generateReorderListItems(),
      });

      // and add it to the wrapper
      wrapper.children.unshift(reorganizeList);

      // and add an overflow-visible class
      wrapper.class += " overflow-visible";
    }
  }
}
