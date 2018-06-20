import { SettingsController } from "./settingsController.js";

window.settingsController = SettingsController.initialize(
  document.getElementById("checkboxSettingsApiEnabled"),
  document.getElementById("checkboxSettingsApiUrl")
);
window.settingsController.render();
