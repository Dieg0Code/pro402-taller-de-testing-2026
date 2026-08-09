const {
  warnIfSlideHasOverlaps,
  warnIfSlideElementsOutOfBounds,
} = require("../vendor/pptxgenjs_helpers/layout");

function validateSlide(slide, pptx) {
  warnIfSlideHasOverlaps(slide, pptx, { muteContainment: true });
  warnIfSlideElementsOutOfBounds(slide, pptx);
}

module.exports = {
  validateSlide,
};
