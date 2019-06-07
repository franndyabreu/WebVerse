"use strict";

const parsePayload = payload => {
  if (payload instanceof Buffer) {
    payload = payload.toString("utf8");
    console.log(payload);
  }

  try {
    payload = JSON.parse(payload);
  } catch (err) {
    payload = null;
  }

  return payload;
};

module.exports = {
  parsePayload
};
