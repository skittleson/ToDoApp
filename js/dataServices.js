import { asyncXhrJsonRequest, ADataService } from "./utils.js";

export function toDoModel(id, note, completed) {
  return { id: id, note: note, completed: completed };
}

export class RestfulApiDataService extends ADataService {
  constructor(apiUri, apiKey) {
    super();
    this._apiUrl = apiUri;
    this._headers = [];
    if (apiKey && apiKey.length > 0) {
      this._headers.push({ key: "x-api-key", value: apiKey });
    }
  }

  list() {
    return asyncXhrJsonRequest({
      method: "GET",
      url: this._apiUrl,
      headers: this._headers
    });
  }

  get(id) {
    return asyncXhrJsonRequest({
      method: "GET",
      url: `${this._apiUrl}?id=${id}`,
      headers: this._headers
    });
  }

  delete(id) {
    return asyncXhrJsonRequest({
      method: "DELETE",
      url: `${this._apiUrl}?id=${id}`,
      headers: this._headers
    });
  }

  update(id, model) {
    return asyncXhrJsonRequest({
      method: "PUT",
      url: `${this._apiUrl}?id=${id}`,
      payload: JSON.stringify(model),
      headers: this._headers
    });
  }

  create(model) {
    return asyncXhrJsonRequest({
      method: "POST",
      url: `${this._apiUrl}`,
      payload: JSON.stringify(model),
      headers: this._headers
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
