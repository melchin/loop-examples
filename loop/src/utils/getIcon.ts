// Negatives
import checkboxOff from "images/svg/checkbox-off.svg";

// Positives
import checkboxOn from "images/svg/checkbox-on.svg";

export default (positive: boolean) => ({
  checkbox: positive ? checkboxOn : checkboxOff,
});
