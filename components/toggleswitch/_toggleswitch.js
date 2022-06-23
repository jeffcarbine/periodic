﻿/////////////////
// TOGGLE SWITCH
/////////////////

function removeFocus(target) {
  let inputs = target.querySelectorAll("input");
  setTimeout(function() {
    for (var e = 0; e < inputs.length; e++) {
      let input = inputs[e];
      if (input === document.activeElement) {
        input.blur();
        break;
      }
    }
  });
}

addEventDelegate("mouseup", ".toggle", removeFocus);

function initContainedSwitches() {
  let containedSwitches = document.querySelectorAll(
    ".toggle.contained:not(.initialized)"
  );

  loop(containedSwitches, function(containedSwitch) {
    initContainedSwitch(containedSwitch);
  });
}

function initContainedSwitch(containedSwitch) {
  // first add the empty span element
  // that will be the animated background
  let span = document.createElement("span");
  span.className = "switch";

  containedSwitch.appendChild(span);

  let labels = containedSwitch.querySelectorAll("label");
  let inputs = containedSwitch.querySelectorAll("input");
  let children = containedSwitch.children;

  let division = 100 / labels.length;

  span.style.width = division + 1 + "%";

  for (var x = 0; x < labels.length; x++) {
    let label = children[x];

    label.style.flex = "0 0 " + division + "%";

    let position = x;
    let offset = division * position - 0.5 + "%";

    let input = inputs[x];

    input.addEventListener("change", function() {
      span.style.left = offset;
    });

    if (input.checked) {
      span.style.left = offset;
    }
  }

  containedSwitch.classList.add("initialized");
}

addEventDelegate("load", window, initContainedSwitches);
//addEventDelegate("childList", ".toggle.contained:not(.initialized)", initContainedSwitch);
