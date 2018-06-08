import { request, ADataService } from "./utils.js";

export function toDoModel(id, note, completed) {
  return { id: id, note: note, completed: completed };
}

export class RestfulApiDataService extends ADataService {
  constructor(apiUrl) {
    super();
    this._apiUrl = apiUrl;
  }

  list() {
    return request({ method: "GET", url: this._apiUrl });
  }

  get(id) {
    return request({ method: "GET", url: `${this._apiUrl}/${id}` });
  }

  delete(id) {
    return request({ method: "DELETE", url: `${this._apiUrl}/${id}` });
  }

  update(id, model) {
    return request({
      method: "PUT",
      url: `${this._apiUrl}/${id}`,
      payload: JSON.stringify(model)
    });
  }

  create(model) {
    const self = this;
    return request({
      method: "POST",
      url: `${this._apiUrl}`,
      payload: JSON.stringify(model)
    });
  }
}

export class TempDataService extends ADataService {
  constructor() {
    super();
    this._data = [
      toDoModel(1, "Buy milk", false),
      toDoModel(2, "Pickup dry cleaning", false),
      toDoModel(3, "Pay bills", false),
      toDoModel(4, "Schedule tee time", true)
    ];
  }

  list() {
    return new Promise((resolve, reject) => resolve(this._data));
  }

  get(id) {
    return new Promise((resolve, reject) =>
      resolve(this._data.find(x => x.id == id))
    );
  }

  delete(id) {
    var self = this;
    return new Promise(function(resolve, reject) {
      let removeIndex = self._data.map(item => item.id).indexOf(id);
      ~removeIndex && self._data.splice(removeIndex, 1);
      resolve();
    });
  }

  update(id, model) {
    var self = this;
    return new Promise(function(resolve, reject) {
      self._data = self._data.map(item => {
        if (item.id == id) return model;
        return item;
      });
      resolve();
    });
  }

  create(model) {
    var self = this;
    return new Promise(function(resolve, reject) {
      let ids = self._data.map(x => x.id);
      var nextId = (Math.max(...ids) || 0) + 1;
      model.id = nextId;
      self._data.push(model);
      resolve(model);
    });
  }
}
