import { SettingsController } from "./settingsController.js";

window.settingsController = SettingsController.initialize(
  document.getElementById("checkboxSettingsApiEnabled"),
  document.getElementById("inputSettingsApiUrl"),
  document.getElementById("inputSettingsApiKey")
);
window.settingsController.render();
