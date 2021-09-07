import document from "document";
import { today } from "user-activity";

let stepsOffset = today.adjusted.steps;

export function getStepsThisHour() {
  return today.adjusted.steps - stepsOffset;
}

export function updateStepsThisHour(date) {
  if (date.getMinutes() === 0 && date.getSeconds() < 5) {
    stepsOffset = today.adjusted.steps;
  }
}
