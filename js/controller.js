import {
  LocalStorageDataService,
  RESTfulApiDataService,
  toDoModel
} from "./dataServices.js";
import { onEnter, c } from "./utils.js";

("use strict");

export class ToDoController {
  static Init(dataService, inputToDoElement, divToDoListElement) {
    return new ToDoController(
      dataService,
      inputToDoElement,
      divToDoListElement
    );
  }

  constructor(dataService, inputToDoElement, divToDoListElement) {
    this._dataService = dataService;
    this._inputToDoElement = inputToDoElement;
    this._divToDoListElement = divToDoListElement;
    if (!this._inputToDoElement) throw new Error("Missing ToDo input element");
    if (!this._divToDoListElement) throw new Error("Missing ToDo list element");
    if (!this._dataService) throw new Error("Missing data service");
    this.render();
  }

  delete(ele) {
    let id = ele.srcElement.data.id;
    this._dataService.delete(id);
    let removeIndex = this._toDoList.map(item => item.id).indexOf(id);
    ~removeIndex && this._toDoList.splice(removeIndex, 1);
    this.render();
  }

  complete(ele) {
    let entry = ele.srcElement.parentNode.parentNode.parentNode;
    let id = ele.srcElement.data.id;
    this._toDoList.find(x => x.id == id).completed = ele.srcElement.checked;
    this._dataService.update(id, this._toDoList.find(x => x.id == id));
    ele.srcElement.checked
      ? entry.children[1].classList.add("strike")
      : entry.children[1].classList.remove("strike");
  }

  add(text) {
    let model = this._dataService.create(text);
    this._divToDoListElement.appendChild(this.createEntry(model));
  }

  createEntry(todo) {
    let self = this;
    let inputCheckbox = c("input");
    inputCheckbox.type = "checkbox";
    inputCheckbox.data = todo;
    inputCheckbox.onclick = ele => this.complete(ele);
    inputCheckbox.checked = todo.completed;
    let wrapCheckbox = c(
      "div",
      ["flex-small"],
      [c("label", [], [inputCheckbox, c("span", ["checkable"])])]
    );
    let wrapNote = c("div", ["col", "text-left", "todo-text"]);
    if (todo.completed) {
      wrapNote.classList.add("strike");
    }
    wrapNote.innerHTML = todo.note;
    let buttonDelete = c("span", ["pseudo"]);
    buttonDelete.innerHTML = "x";
    buttonDelete.data = todo;
    buttonDelete.onclick = ele => this.delete(ele);
    let elements = [
      wrapCheckbox,
      wrapNote,
      c("div", ["flex-small", "text-right"], [buttonDelete])
    ];
    return c("div", ["flex-grid"], elements);
  }

  async render() {
    this._divToDoListElement.innerHTML = "";
    this._toDoList = await this._dataService.list();
    onEnter(this._inputToDoElement, ele => {
      if (ele && ele.value && ele.value.length >= 1) {
        this.add(ele.value);
        ele.value = "";
      }
    });
    this._toDoList.forEach(x =>
      this._divToDoListElement.appendChild(this.createEntry(x))
    );
  }
}

export class SettingsController {
  static Init(checkboxUseRestApi, inputRestApi) {
    return new SettingsController(checkboxUseRestApi, inputRestApi);
  }

  constructor(checkboxUseRestApi, inputRestApi) {
    this._checkboxUseRestApi = checkboxUseRestApi;
    this._inputRestApi = inputRestApi;
    if (!this._checkboxUseRestApi)
      throw new Error("Missing checkbox use rest api");
    if (!this._inputRestApi) throw new Error("Missing input rest api");
  }

  save() {
    let dataService = null;
    if (this._checkboxUseRestApi.checked) {
      dataService = new RESTfulApiDataService(this._inputRestApi.value);
    } else {
      dataService = new LocalStorageDataService();
    }
    window.controller = ToDoController.Init(
      dataService,
      document.getElementById("txtNewToDo"),
      document.getElementById("toDoList")
    );
  }
}

window.settingsController = SettingsController.Init(
  document.getElementById("checkboxSettingsApiEnabled"),
  document.getElementById("checkboxSettingsApiUrl")
);

//init load of settings
window.settingsController.save();
