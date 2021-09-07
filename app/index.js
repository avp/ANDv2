import document from "document";
import { display } from "display";
import clock from "clock";

import * as device from "./device.js"
// import * as bm from "./bm.js";
import * as date from "./date.js"
import * as battery from "./battery.js"
import * as time from "./time.js"
import * as hr from "./hr.js"
import * as activity from "./activity.js"
import * as hrstep from "./hrstep.js"
import * as settings from "./settings.js"
import * as state from "./state.js"
import * as weather from "./weather.js"
import * as barometer from "./barometer.js"

import { today } from "user-activity";

var stepLastHr = 0;
updateStepHr();

function updateStepHr() {
  let stepsValue = today.adjusted.steps;
  stepLastHr = stepsValue;
  timerStepHr();
}

function timerStepHr() {
  let tday = new Date();
  let mins = tday.getMinutes();
  let secs = tday.getSeconds();
  let secondsToNextHour = ((60 - mins) * 60) - secs;
  setTimeout(updateStepHr, secondsToNextHour * 1000);
}


clock.granularity = "seconds";
settings.loadSettings();
display.onchange = state.applyState;
barometer.start();
device.deviceSetup();
clock.ontick = (evt) => {
  time.drawTime(evt.date);
  date.drawDate(evt.date, settings.language);
  activity.drawAllProgress();
  // console.log(stepLastHr);
  // hrstep.drawHrStep(stepLastHr);
  battery.drawBat();
}
