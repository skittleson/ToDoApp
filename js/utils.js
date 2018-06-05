export function onEnter(ele, func) {
  ele.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      func(event.srcElement);
    }
  });
}

export function c(elementName, classes = [], elements = []) {
  let element = document.createElement(elementName);
  if (classes) {
    classes.forEach(x => element.classList.add(x));
  }
  if (elements) {
    elements.forEach(x => element.appendChild(x));
  }
  return element;
}

export function makeRequest(method, url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function() {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send();
  });
}

export class ADataService {
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