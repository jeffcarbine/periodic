import { addEventDelegate } from "/periodic/modules/eventDelegate/eventDelegate.js";
import { detectSwipe } from "../../modules/detectSwipe/detectSwipe.js";

const changeSlider = (button) => {
  const direction = button.dataset.direction,
    slider = button.parentNode.previousElementSibling;

  if (direction === "next") {
    changeActive(slider, true);
  } else {
    changeActive(slider, false);
  }
};

const changeActive = (slider, forwards) => {
  let activeSlide = parseInt(slider.dataset.active),
    slideCount = parseInt(slider.dataset.count);

  if (!forwards) {
    // increase the slide value
    if (activeSlide == slideCount) {
      activeSlide = 0;
    } else {
      activeSlide++;
    }
  } else {
    // decrease the slide value
    if (activeSlide == 0) {
      activeSlide = slideCount;
    } else {
      activeSlide--;
    }
  }

  slider.dataset.active = activeSlide;
};

const slideForwards = (slider) => {
  const slides = slider.querySelector(".slides");
  changeActive(slides, true);
};

const slideBackwards = (slider) => {
  const slides = slider.querySelector(".slides");
  changeActive(slides, false);
};

addEventDelegate("click", "button.slider-control", changeSlider);

detectSwipe({
  target: ".slider",
  left: slideForwards,
  right: slideBackwards,
});

const slide = (slidesList) => {
  const activeSlide = parseInt(slidesList.dataset.active),
    slideCount = parseInt(slidesList.dataset.count),
    slides = slidesList.childNodes;

  slides.forEach((slide) => {
    const i = slide.dataset.index;

    if (i == activeSlide) {
      slide.dataset.state = "active";
    } else if (i == (activeSlide + 1 > slideCount ? 0 : activeSlide + 1)) {
      slide.dataset.state = "next";
    } else if (i == (activeSlide - 1 < 0 ? slideCount : activeSlide - 1)) {
      slide.dataset.state = "prev";
    } else if (
      i ==
        (activeSlide + 2 > slideCount
          ? activeSlide === slideCount
            ? 1
            : 0
          : activeSlide + 2) &&
      slides.length >= 5
    ) {
      slide.dataset.state = "farNext";
    } else if (
      i ==
        (activeSlide - 2 < 0
          ? slideCount + (activeSlide - 1)
          : activeSlide - 2) &&
      slides.length >= 5
    ) {
      slide.dataset.state = "farPrev";
    } else if (
      i ==
        (activeSlide + 3 > slideCount
          ? activeSlide === slideCount
            ? 2
            : activeSlide === slideCount - 1
            ? 1
            : 0
          : activeSlide + 3) &&
      slides.length >= 7
    ) {
      slide.dataset.state = "farFarNext";
    } else if (
      i ==
        (activeSlide - 3 < 0
          ? slideCount + (activeSlide - 2)
          : activeSlide - 3) &&
      slides.length >= 7
    ) {
      slide.dataset.state = "farFarPrev";
    } else {
      slide.dataset.state = "inactive";
    }
  });
};

addEventDelegate("attributes:data-active", ".slider .slides", slide);
