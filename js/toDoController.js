import {
  TempDataService,
  RestfulApiDataService,
  toDoModel
} from "./dataServices.js";
import { onEnter, make } from "./utils.js";

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

  async delete(ele) {
    let id = ele.srcElement.data.id;
    await this._dataService.delete(id);
    let removeIndex = this._toDoList.map(item => item.id).indexOf(id);
    ~removeIndex && this._toDoList.splice(removeIndex, 1);
    await this.render();
  }

  async complete(ele) {
    let entry = ele.srcElement.parentNode.parentNode.parentNode;
    let id = ele.srcElement.data.id;
    this._toDoList.find(x => x.id == id).completed = ele.srcElement.checked;
    await this._dataService.update(id, this._toDoList.find(x => x.id == id));
    ele.srcElement.checked
      ? entry.children[1].classList.add("strike")
      : entry.children[1].classList.remove("strike");
  }

  async add(text) {
    let model = await this._dataService.create(toDoModel(0, text, false));
    this._divToDoListElement.appendChild(this.createEntry(model));
  }

  createEntry(todo) {
    let self = this;
    let inputCheckbox = make("input", {
      type: "checkbox",
      data: todo,
      onclick: ele => self.complete(ele)
    });
    inputCheckbox.checked = todo.completed;
    let wrapCheckbox = make("div", {
      classes: ["flex-small"],
      elements: [
        make("label", {
          elements: [inputCheckbox, make("span", { classes: ["checkable"] })]
        })
      ]
    });
    let wrapNote = make("div", {
      classes: ["col", "text-left", "todo-text"],
      html: todo.note
    });
    if (todo.completed) {
      wrapNote.classList.add("strike");
    }
    let buttonDelete = make("span", {
      classes: ["pseudo"],
      html: "x",
      data: todo,
      onclick: ele => self.delete(ele)
    });
    let elements = [
      wrapCheckbox,
      wrapNote,
      make("div", {
        classes: ["flex-small", "text-right"],
        elements: [buttonDelete]
      })
    ];
    return make("div", { classes: ["flex-grid"], elements: elements });
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
