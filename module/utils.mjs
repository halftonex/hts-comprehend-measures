/* -------------------------------------------- */
/*  System Utils                                */
/* -------------------------------------------- */

const { convertLength, convertWeight, convertTravelSpeed } = dnd5e.utils;

/* -------------------------------------------- */
/*  Conversions                                 */
/* -------------------------------------------- */

export function convertModuleLength(lenght, { keys = null, exceptions = [] } = {}) {
  if (!lenght) return;
  const units = lenght.units ?? CONFIG.DND5E.defaultUnits.length.imperial;
  if (units === defaultUnits("length") || units === defaultUnits("distance")) return;

  const to =
    units === defaultUnits("length", { inverse: true })
      ? defaultUnits("length")
      : defaultUnits("distance");

  const properties = keys ? keys : Object.keys(lenght);
  const entries = Object.entries(lenght).filter(
    ([k]) => properties.includes(k) && !exceptions.includes(k),
  );

  const convertedData = {};
  entries.forEach(([key, value]) => {
    if (value && Number(value)) {
      const convertedValue = convertLength(value, units, to);
      convertedData[key] = roundToTenth(convertedValue);
    }
  });

  return {
    ...lenght,
    ...convertedData,
    units: to,
  };
}

/* -------------------------------------------- */

export function convertModuleTravelSpeed(speed) {
  if (!speed) return;
  const { value, units } = speed;
  const to = defaultUnits("travel");
  if (units === to) return;

  const convertedData = value > 0 ? roundToTenth(convertTravelSpeed(value, units, to)) : value;

  return {
    value: convertedData,
    units: to,
  };
}

/* -------------------------------------------- */

export function convertModuleWeight(weight) {
  if (!weight) return;
  const { value, units } = weight;
  const to = defaultUnits("weight");
  if (units === to) return;

  return {
    value: value > 0 ? roundToTenth(convertWeight(value, units, to)) : value,
    units: to,
  };
}

/* -------------------------------------------- */

export function convertModuleVolume(volume) {
  if (!volume) return;
  const { value, units } = volume;
  const to = defaultUnits("volume");
  if (units === to) return;

  return {
    value: value > 0 ? roundToTenth(convertVolume(value, units, to)) : value,
    units: to,
  };
}

/* -------------------------------------------- */

export function defaultUnits(type, { inverse = false } = {}) {
  const settingKey =
    type === "travel" || type === "distance"
      ? "metricLengthUnits"
      : `metric${type.capitalize()}Units`;

  const isMetricSetting = game.settings.get("dnd5e", settingKey);
  const useMetric = inverse ? !isMetricSetting : isMetricSetting;

  return CONFIG.DND5E.defaultUnits[type]?.[useMetric ? "metric" : "imperial"];
}

/* -------------------------------------------- */

function convertVolume(value, from, to, { strict = true } = {}) {
  const message = (unit) => `Volume unit ${unit} not defined in CONFIG.DND5E.volumeUnits`;
  return convertSystemUnits(value, from, to, CONFIG.DND5E.volumeUnits, {
    message,
    strict,
  });
}

/* -------------------------------------------- */

function convertSystemUnits(value, from, to, config, { message, strict }) {
  if (from === to) return value;
  if (strict && !config[from]) throw new Error(message(from));
  if (strict && !config[to]) throw new Error(message(to));
  return (value * (config[from]?.conversion ?? 1)) / (config[to]?.conversion ?? 1);
}

/* -------------------------------------------- */

function roundToTenth(num) {
  return Math.round(num * 10) / 10;
}
