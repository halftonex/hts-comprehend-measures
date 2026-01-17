import { ActorConversion, ItemConversion, SceneConversion } from "./module/data/_module.mjs";
import { Settings } from "./module/settings.mjs";

/* -------------------------------------------- */
/*  Status Hooks                                */
/* -------------------------------------------- */

Hooks.once("init", () => {
  console.log("Initializing HT's Comprehend Measures Module");

  Settings.register();
  Settings.config();
});

/* -------------------------------------------- */

Hooks.once("ready", async () => {
  const conversions = [ActorConversion, ItemConversion, SceneConversion];

  if (
    !game.user.isGM ||
    !Settings.get("startupConversion") ||
    !conversions.some((c) => c.worldNeedsConversion)
  )
    return;

  const proceed = await Settings.conversionDialog();
  if (proceed) await Promise.all(conversions.map((c) => c.worldConversion()));
});

/* -------------------------------------------- */
/*  PreCreation Hooks                           */
/* -------------------------------------------- */

Hooks.on("preCreateActor", (actor) => {
  new ActorConversion(actor).updateSource();
});

Hooks.on("preCreateItem", (item) => {
  new ItemConversion(item).updateSource();
});

Hooks.on("preCreateScene", (scene) => {
  new SceneConversion(scene).updateSource();
});

/* -------------------------------------------- */
/*  HeaderControls Hooks                        */
/* -------------------------------------------- */

Hooks.on("getHeaderControlsBaseActorSheet", (sheet, controls) => {
  new ActorConversion(sheet.document).headerControl(controls);
});

Hooks.on("getHeaderControlsItemSheet5e", (sheet, controls) => {
  new ItemConversion(sheet.document).headerControl(controls);
});

Hooks.on("getHeaderControlsSceneConfig", (sheet, controls) => {
  new SceneConversion(sheet.document).headerControl(controls);
});

/* -------------------------------------------- */
/*  ContextOptions Hooks                        */
/* -------------------------------------------- */

Hooks.on("getActorContextOptions", (app, options) => {
  ActorConversion.contextOption(options);
});

Hooks.on("getItemContextOptions", (app, options) => {
  ItemConversion.contextOption(options);
});

Hooks.on("getSceneContextOptions", (app, options) => {
  SceneConversion.contextOption(options);
});
