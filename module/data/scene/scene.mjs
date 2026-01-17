import { DocumentConversion } from "../abstract.mjs";
import { convertModuleLength } from "../../utils.mjs";
import { UNITS } from "../../settings.mjs";

export class SceneConversion extends DocumentConversion {
  static COLLECTION_NAME = "scenes";

  /* -------------------------------------------- */

  get needsConversion() {
    return this.gridConversion;
  }

  /* -------------------------------------------- */

  get gridConversion() {
    return !this.hasUnits(this.document.grid, UNITS.LENGTH);
  }

  /* -------------------------------------------- */

  prepareConversionData() {
    const convertedData = super.prepareConversionData();

    if (this.gridConversion)
      convertedData.add(
        "grid",
        convertModuleLength(this.document.grid, {
          keys: ["distance"],
        })
      );

    return convertedData;
  }
}
