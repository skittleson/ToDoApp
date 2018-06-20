import { TempDataService, RestfulApiDataService } from "./dataServices.js";
import { ToDoController } from "./toDoController.js";

export class SettingsController {
  static initialize(checkboxUseRestApi, inputRestApi, inputRestApiKey) {
    return new SettingsController(checkboxUseRestApi, inputRestApi, inputRestApiKey);
  }

  constructor(checkboxUseRestApi, inputRestApiUri, inputRestApiKey) {
    this._checkboxUseRestApi = checkboxUseRestApi;
    this._inputRestApiUri = inputRestApiUri;
    this._inputRestApiKey = inputRestApiKey;
    if (!this._checkboxUseRestApi) {
      throw new Error("Missing checkbox use rest api");
    }
    if (!this._inputRestApiUri) throw new Error("Missing input rest api");
  }

  save() {
    this.isRestfulApiServiceEnabled = this._checkboxUseRestApi.checked;
    this.restfulApiUri = this._inputRestApiUri.value;
    this.restfulApiKey = this._inputRestApiKey.value;
    location.reload();
  }

  render() {
    let dataService = null;
    this._checkboxUseRestApi.checked = this.isRestfulApiServiceEnabled;
    this._inputRestApiUri.value = this.restfulApiUri;
    this._inputRestApiKey.value = this.restfulApiKey;
    if (this.isRestfulApiServiceEnabled) {
      console.log(`restful api service enabled: ${this.restfulApiUri}`);
      dataService = new RestfulApiDataService(this.restfulApiUri, this.restfulApiKey);
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

  get restfulApiKey() {
    return sessionStorage.getItem("todo.settings.restApiKey") || "";
  }

  set restfulApiKey(value) {
    sessionStorage.setItem("todo.settings.restApiKey", value);
  }
}
