import { makeRequest } from "./utils.js";

export function toDoModel(id, note, completed) {
  return { id: id, note: note, completed: completed };
}

class ADataService {
  constructor() {
    if (this.constructor == ADataService) {
      throw new Error("Abstract classes can't be instantiated.");
    }
  }
  list() {
    throw new Error("Method 'list()' must be implemented.");
  }
  read(id) {
    throw new Error("Method 'read(id)' must be implemented.");
  }
  create(model) {
    throw new Error("Method 'create(model)' must be implemented.");
  }
  update(id, model) {
    throw new Error("Method 'update(id, model)' must be implemented.");
  }
  delete(id) {
    throw new Error("Method 'delete(id)' must be implemented.");
  }
}

export class RESTfulApiDataService extends ADataService {
  constructor(apiUrl) {
    super();
    this._apiUrl = apiUrl;
  }
  async list() {
    return await makeRequest("GET", this._apiUrl) || [];
  }
}

export class LocalStorageDataService extends ADataService {
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
    return this._data;
  }

  read(id) {
    return this._data.find(x => x.id == id);
  }

  delete(id) {
    let removeIndex = this._data.map(item => item.id).indexOf(id);
    ~removeIndex && this._data.splice(removeIndex, 1);
  }

  update(id, model) {
    this._data = this._data.map(item => {
      if (item.id == id) return model;
      return item;
    });
  }

  create(text) {
    let ids = this._data.map(x => x.id);
    var nextId = (Math.max(...ids) || 0) + 1;
    var model = toDoModel(nextId, text, false);
    this._data.push(model);
    return model;
  }
}
