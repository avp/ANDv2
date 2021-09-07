import document from "document";
import { today } from "user-activity";

let stepsThisHour = 0;
let stepsOffset = today.adjusted.steps;

export function getStepsThisHour() {
  return stepsThisHour;
}

export function updateStepsThisHour(date) {
  if (date.getMinutes() === 0 && date.getSeconds() < 10) {
    stepsThisHour = 0;
    stepsOffset = today.adjusted.steps;
  } else {
    stepsThisHour = today.adjusted.steps - stepsOffset;
  }
}
