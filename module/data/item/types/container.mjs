import { ItemConversion } from "../item.mjs";
import { convertModuleVolume, convertModuleWeight } from "../../../utils.mjs";
import { UNITS } from "../../../settings.mjs";

export class ContainerConversion extends ItemConversion {
  get needsConversion() {
    return super.needsConversion || this.capacityVolumeConversion || this.capacityWeightConversion;
  }

  /* -------------------------------------------- */

  get capacityVolumeConversion() {
    const { volume } = this.document.system.capacity;
    return !this.hasUnits(volume, UNITS.VOLUME);
  }

  /* -------------------------------------------- */

  get capacityWeightConversion() {
    const { weight } = this.document.system.capacity;
    return !this.hasUnits(weight, UNITS.WEIGHT);
  }

  /* -------------------------------------------- */

  prepareConversionData() {
    const convertedData = super.prepareConversionData();
    const { volume, weight } = this.document.system.capacity;

    if (this.capacityVolumeConversion)
      convertedData.add("system.capacity.volume", convertModuleVolume(volume));

    if (this.capacityWeightConversion)
      convertedData.add("system.capacity.weight", convertModuleWeight(weight));

    return convertedData;
  }
}
