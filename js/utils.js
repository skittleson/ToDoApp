export function onEnter(ele, func) {
  let isFunction = func && {}.toString.call(func) === "[object Function]";
  if (!isFunction) throw new Error("Must pass a function onEnter function");
  ele.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      func(event.srcElement);
    }
  });
}

export function make(
  elementName,
  config = {
    classes: [],
    elements: [],
    type,
    data,
    html,
    onclick
  }
) {
  let element = document.createElement(elementName);
  if (config.classes) {
    config.classes.forEach(x => element.classList.add(x));
  }
  if (config.elements) {
    config.elements.forEach(x => element.appendChild(x));
  }
  if (config.type) element.type = config.type;
  if (config.data) element.data = config.data;
  if (config.html) element.innerHTML = config.html;
  if (config.onclick) element.onclick = config.onclick;
  return element;
}

export function asyncXhrJsonRequest(
  config = { method, url, payload: null, headers: [] }
) {
  if (!config.method) throw Error("method undefined in request");
  if (!config.url) throw Error("url undefined in request");
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(config.method, config.url);
    if (config.headers) {
      config.headers.forEach(x => {
        xhr.setRequestHeader(x.key, x.value);
      });
    }
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        if (xhr.response && xhr.response.length > 0) {
          resolve(JSON.parse(xhr.response));
        } else {
          resolve();
        }
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
    xhr.send(config.payload);
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
  get(id) {
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
