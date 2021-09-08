import document from 'document';
import * as fs from 'fs';
import { today } from 'user-activity';

/// How many steps had been taken at the top of the hour.
let stepsOffset = today.adjusted.steps;
/// When stepsOffset was last set.
let offsetTime = new Date();
/// Handle on the timeout to call updateStepsOffset.
let timeoutHandle = null;

const MS_PER_SEC = 1000;
const MS_PER_MIN = 60 * MS_PER_SEC;
const MS_PER_HOUR = 60 * MS_PER_MIN;

/// Return how many ms will pass before we hit the next hour and reset
/// the offset.
function msToNextHour() {
  let now = new Date();
  return (
    MS_PER_HOUR -
    now.getMinutes() * MS_PER_MIN -
    now.getSeconds() * MS_PER_SEC -
    now.getMilliseconds()
  );
}

const STORAGE_FILENAME = "andv2_steps_offset.cbor";

/// Try to read the offset and time from the storage file.
/// Return true on success, false on failure.
function readOffsetFromFile() {
  console.log("Attempting to read hourly steps offset from file");
  let data;
  try {
    data = fs.readFileSync(STORAGE_FILENAME, "cbor");
  } catch (e) {
    console.log("Failed to read from file: " + e.message + e.stack);
    return false;
  }
  if (data.stepsOffset && data.offsetTime) {
    const prevTime = new Date(data.offsetTime);
    if (prevTime.getHours() !== (new Date()).getHours()) {
      // Failed to recover anything useful.
      console.log("Failed to read from file: mismatched hour");
      return false;
    }
    const prevOffset = data.stepsOffset;

    stepsOffset = prevOffset;
    offsetTime = prevTime;
    console.log("Read hourly steps offset from file: " + stepsOffset);
    return true;
  }
}

/// Write the offset and time to the storage file.
export function saveOffsetToFile() {
  console.log("Saving hourly steps offset to file");
  try {
    let data = fs.writeFileSync(STORAGE_FILENAME, {
      stepsOffset: stepsOffset,
      offsetTime: offsetTime.getTime(),
    }, "cbor");
  } catch {
  }
}

/// Return the number of steps that have been taken this hout.
export function getStepsThisHour() {
  return today.adjusted.steps - stepsOffset;
}

/// Update steps offset.
/// Must only be called at the top of the hour or on initialization.
/// Sets a timer to call itself again at the top of the next hour.
export function updateStepsOffset() {
  console.log('Updating steps offset');
  const doUpdate = timeoutHandle === null ? !readOffsetFromFile() : true;
  if (doUpdate) {
    clearTimeout(timeoutHandle);
    stepsOffset = today.adjusted.steps;
    offsetTime = new Date();
  }
  timeoutHandle = setTimeout(updateStepsOffset, msToNextHour() + 250);
}
