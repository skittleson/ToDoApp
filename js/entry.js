import { SettingsController } from "./settingsController.js";

window.settingsController = SettingsController.Init(
  document.getElementById("checkboxSettingsApiEnabled"),
  document.getElementById("checkboxSettingsApiUrl")
);
window.settingsController.render();
