/**
 * Icon Bubble
 * Handles the showing/hiding of the IconBubble's content
 */

const toggleIconBubble = (button, event) => {
  // figure out whether or not it is open
  let bubble = button.nextElementSibling,
    isClickedOpen = bubble.classList.contains("clicked"),
    isHoveredOpen = bubble.classList.contains("hovered");

  const toggle = function (isOpen, className) {
    if (isOpen) {
      // close it
      close(isOpen, className);
    } else {
      // open it
      open(isOpen, className);
    }
  };

  const close = (isOpen, className) => {
    if (isOpen) {
      bubble.classList.remove(className);
    }
  };

  const open = (isOpen, className) => {
    if (!isOpen) {
      bubble.classList.add(className);
    }
  };

  if (event.type === "click") {
    toggle(isClickedOpen, "clicked");
  } else if (event.type === "mouseover") {
    open(isHoveredOpen, "hovered");
  } else if (event.type === "mouseout") {
    close(isHoveredOpen, "hovered");
  }
};

addEventDelegate(
  "click, mouseover, mouseout",
  ".iconbubble button",
  toggleIconBubble
);

// check the position of the iconbubble on the screen, so we
// know whether to left or right align it
const checkIconbubblePosition = (iconbubble) => {
  // get iconbubble's x position
  const xPos = iconbubble.getBoundingClientRect().left,
    // get screen size
    windowWidth = window.innerWidth,
    // and divide it in half so we can get our limit
    limit = windowWidth / 2;

  // if we are greater than the limit...
  if (xPos > limit) {
    // it's pointing to the left
    iconbubble.dataset.position = "left";
  } else {
    // otherwise, it's pointing to the right
    iconbubble.dataset.position = "right";
  }
};
