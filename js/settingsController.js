import { TempDataService, RestfulApiDataService } from "./dataServices.js";
import { ToDoController } from "./toDoController.js";

export class SettingsController {
  static initialize(checkboxUseRestApi, inputRestApi) {
    return new SettingsController(checkboxUseRestApi, inputRestApi);
  }

  constructor(checkboxUseRestApi, inputRestApi) {
    this._checkboxUseRestApi = checkboxUseRestApi;
    this._inputRestApi = inputRestApi;
    if (!this._checkboxUseRestApi) {
      throw new Error("Missing checkbox use rest api");
    }
    if (!this._inputRestApi) throw new Error("Missing input rest api");
  }

  save() {
    this.isRestfulApiServiceEnabled = this._checkboxUseRestApi.checked;
    this.restfulApiUri = this._inputRestApi.value;
    location.reload();
  }

  render() {
    let dataService = null;
    this._checkboxUseRestApi.checked = this.isRestfulApiServiceEnabled;
    this._inputRestApi.value = this.restfulApiUri;
    if (this.isRestfulApiServiceEnabled) {
      console.log(`restful api service enabled: ${this.restfulApiUri}`);
      dataService = new RestfulApiDataService(this.restfulApiUri);
    } else {
      dataService = new TempDataService();
    }
    this._toDoController = ToDoController.initialize(
      dataService,
      document.getElementById("txtNewToDo"),
      document.getElementById("toDoList")
    );
  }

  get isRestfulApiServiceEnabled() {
    return sessionStorage.getItem("todo.settings.useRestApi") == "true";
  }

  set isRestfulApiServiceEnabled(value) {
    sessionStorage.setItem("todo.settings.useRestApi", value);
  }

  get restfulApiUri() {
    return sessionStorage.getItem("todo.settings.restApiUri") || "";
  }

  set restfulApiUri(value) {
    sessionStorage.setItem("todo.settings.restApiUri", value);
  }
}
