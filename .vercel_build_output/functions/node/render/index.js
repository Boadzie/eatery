var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// .svelte-kit/vercel/entry.js
__export(exports, {
  default: () => entry_default
});

// node_modules/@sveltejs/kit/dist/install-fetch.js
var import_http = __toModule(require("http"));
var import_https = __toModule(require("https"));
var import_zlib = __toModule(require("zlib"));
var import_stream = __toModule(require("stream"));
var import_util = __toModule(require("util"));
var import_crypto = __toModule(require("crypto"));
var import_url = __toModule(require("url"));
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
var src = dataUriToBuffer;
var dataUriToBuffer$1 = src;
var { Readable } = import_stream.default;
var wm = new WeakMap();
async function* read(parts) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else {
      yield part;
    }
  }
}
var Blob = class {
  constructor(blobParts = [], options2 = {}) {
    let size = 0;
    const parts = blobParts.map((element) => {
      let buffer;
      if (element instanceof Buffer) {
        buffer = element;
      } else if (ArrayBuffer.isView(element)) {
        buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
      } else if (element instanceof ArrayBuffer) {
        buffer = Buffer.from(element);
      } else if (element instanceof Blob) {
        buffer = element;
      } else {
        buffer = Buffer.from(typeof element === "string" ? element : String(element));
      }
      size += buffer.length || buffer.size || 0;
      return buffer;
    });
    const type = options2.type === void 0 ? "" : String(options2.type).toLowerCase();
    wm.set(this, {
      type: /[^\u0020-\u007E]/.test(type) ? "" : type,
      size,
      parts
    });
  }
  get size() {
    return wm.get(this).size;
  }
  get type() {
    return wm.get(this).type;
  }
  async text() {
    return Buffer.from(await this.arrayBuffer()).toString();
  }
  async arrayBuffer() {
    const data = new Uint8Array(this.size);
    let offset = 0;
    for await (const chunk of this.stream()) {
      data.set(chunk, offset);
      offset += chunk.length;
    }
    return data.buffer;
  }
  stream() {
    return Readable.from(read(wm.get(this).parts));
  }
  slice(start = 0, end = this.size, type = "") {
    const { size } = this;
    let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
    let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
    const span = Math.max(relativeEnd - relativeStart, 0);
    const parts = wm.get(this).parts.values();
    const blobParts = [];
    let added = 0;
    for (const part of parts) {
      const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
      if (relativeStart && size2 <= relativeStart) {
        relativeStart -= size2;
        relativeEnd -= size2;
      } else {
        const chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
        blobParts.push(chunk);
        added += ArrayBuffer.isView(chunk) ? chunk.byteLength : chunk.size;
        relativeStart = 0;
        if (added >= span) {
          break;
        }
      }
    }
    const blob = new Blob([], { type: String(type).toLowerCase() });
    Object.assign(wm.get(blob), { size: span, parts: blobParts });
    return blob;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](object) {
    return object && typeof object === "object" && typeof object.stream === "function" && object.stream.length === 0 && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
  }
};
Object.defineProperties(Blob.prototype, {
  size: { enumerable: true },
  type: { enumerable: true },
  slice: { enumerable: true }
});
var fetchBlob = Blob;
var Blob$1 = fetchBlob;
var FetchBaseError = class extends Error {
  constructor(message, type) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.type = type;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
};
var FetchError = class extends FetchBaseError {
  constructor(message, type, systemError) {
    super(message, type);
    if (systemError) {
      this.code = this.errno = systemError.code;
      this.erroredSysCall = systemError.syscall;
    }
  }
};
var NAME = Symbol.toStringTag;
var isURLSearchParameters = (object) => {
  return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
};
var isBlob = (object) => {
  return typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
};
function isFormData(object) {
  return typeof object === "object" && typeof object.append === "function" && typeof object.set === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.delete === "function" && typeof object.keys === "function" && typeof object.values === "function" && typeof object.entries === "function" && typeof object.constructor === "function" && object[NAME] === "FormData";
}
var isAbortSignal = (object) => {
  return typeof object === "object" && object[NAME] === "AbortSignal";
};
var carriage = "\r\n";
var dashes = "-".repeat(2);
var carriageLength = Buffer.byteLength(carriage);
var getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
function getHeader(boundary, name, field) {
  let header = "";
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || "application/octet-stream"}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
var getBoundary = () => (0, import_crypto.randomBytes)(8).toString("hex");
async function* formDataIterator(form, boundary) {
  for (const [name, value] of form) {
    yield getHeader(boundary, name, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name, value));
    if (isBlob(value)) {
      length += value.size;
    } else {
      length += Buffer.byteLength(String(value));
    }
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
var INTERNALS$2 = Symbol("Body internals");
var Body = class {
  constructor(body, {
    size = 0
  } = {}) {
    let boundary = null;
    if (body === null) {
      body = null;
    } else if (isURLSearchParameters(body)) {
      body = Buffer.from(body.toString());
    } else if (isBlob(body))
      ;
    else if (Buffer.isBuffer(body))
      ;
    else if (import_util.types.isAnyArrayBuffer(body)) {
      body = Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof import_stream.default)
      ;
    else if (isFormData(body)) {
      boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
      body = import_stream.default.Readable.from(formDataIterator(body, boundary));
    } else {
      body = Buffer.from(String(body));
    }
    this[INTERNALS$2] = {
      body,
      boundary,
      disturbed: false,
      error: null
    };
    this.size = size;
    if (body instanceof import_stream.default) {
      body.on("error", (err) => {
        const error3 = err instanceof FetchBaseError ? err : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${err.message}`, "system", err);
        this[INTERNALS$2].error = error3;
      });
    }
  }
  get body() {
    return this[INTERNALS$2].body;
  }
  get bodyUsed() {
    return this[INTERNALS$2].disturbed;
  }
  async arrayBuffer() {
    const { buffer, byteOffset, byteLength } = await consumeBody(this);
    return buffer.slice(byteOffset, byteOffset + byteLength);
  }
  async blob() {
    const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
    const buf = await this.buffer();
    return new Blob$1([buf], {
      type: ct
    });
  }
  async json() {
    const buffer = await consumeBody(this);
    return JSON.parse(buffer.toString());
  }
  async text() {
    const buffer = await consumeBody(this);
    return buffer.toString();
  }
  buffer() {
    return consumeBody(this);
  }
};
Object.defineProperties(Body.prototype, {
  body: { enumerable: true },
  bodyUsed: { enumerable: true },
  arrayBuffer: { enumerable: true },
  blob: { enumerable: true },
  json: { enumerable: true },
  text: { enumerable: true }
});
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  let { body } = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body)) {
    body = body.stream();
  }
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (!(body instanceof import_stream.default)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const err = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(err);
        throw err;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error3) {
    if (error3 instanceof FetchBaseError) {
      throw error3;
    } else {
      throw new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error3.message}`, "system", error3);
    }
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error3) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error3.message}`, "system", error3);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
var clone = (instance, highWaterMark) => {
  let p1;
  let p2;
  let { body } = instance;
  if (instance.bodyUsed) {
    throw new Error("cannot clone body after it is used");
  }
  if (body instanceof import_stream.default && typeof body.getBoundary !== "function") {
    p1 = new import_stream.PassThrough({ highWaterMark });
    p2 = new import_stream.PassThrough({ highWaterMark });
    body.pipe(p1);
    body.pipe(p2);
    instance[INTERNALS$2].body = p1;
    body = p2;
  }
  return body;
};
var extractContentType = (body, request) => {
  if (body === null) {
    return null;
  }
  if (typeof body === "string") {
    return "text/plain;charset=UTF-8";
  }
  if (isURLSearchParameters(body)) {
    return "application/x-www-form-urlencoded;charset=UTF-8";
  }
  if (isBlob(body)) {
    return body.type || null;
  }
  if (Buffer.isBuffer(body) || import_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
    return null;
  }
  if (body && typeof body.getBoundary === "function") {
    return `multipart/form-data;boundary=${body.getBoundary()}`;
  }
  if (isFormData(body)) {
    return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
  }
  if (body instanceof import_stream.default) {
    return null;
  }
  return "text/plain;charset=UTF-8";
};
var getTotalBytes = (request) => {
  const { body } = request;
  if (body === null) {
    return 0;
  }
  if (isBlob(body)) {
    return body.size;
  }
  if (Buffer.isBuffer(body)) {
    return body.length;
  }
  if (body && typeof body.getLengthSync === "function") {
    return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
  }
  if (isFormData(body)) {
    return getFormDataLength(request[INTERNALS$2].boundary);
  }
  return null;
};
var writeToStream = (dest, { body }) => {
  if (body === null) {
    dest.end();
  } else if (isBlob(body)) {
    body.stream().pipe(dest);
  } else if (Buffer.isBuffer(body)) {
    dest.write(body);
    dest.end();
  } else {
    body.pipe(dest);
  }
};
var validateHeaderName = typeof import_http.default.validateHeaderName === "function" ? import_http.default.validateHeaderName : (name) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
    const err = new TypeError(`Header name must be a valid HTTP token [${name}]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
    throw err;
  }
};
var validateHeaderValue = typeof import_http.default.validateHeaderValue === "function" ? import_http.default.validateHeaderValue : (name, value) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
    const err = new TypeError(`Invalid character in header content ["${name}"]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_CHAR" });
    throw err;
  }
};
var Headers = class extends URLSearchParams {
  constructor(init2) {
    let result = [];
    if (init2 instanceof Headers) {
      const raw = init2.raw();
      for (const [name, values] of Object.entries(raw)) {
        result.push(...values.map((value) => [name, value]));
      }
    } else if (init2 == null)
      ;
    else if (typeof init2 === "object" && !import_util.types.isBoxedPrimitive(init2)) {
      const method = init2[Symbol.iterator];
      if (method == null) {
        result.push(...Object.entries(init2));
      } else {
        if (typeof method !== "function") {
          throw new TypeError("Header pairs must be iterable");
        }
        result = [...init2].map((pair) => {
          if (typeof pair !== "object" || import_util.types.isBoxedPrimitive(pair)) {
            throw new TypeError("Each header pair must be an iterable object");
          }
          return [...pair];
        }).map((pair) => {
          if (pair.length !== 2) {
            throw new TypeError("Each header pair must be a name/value tuple");
          }
          return [...pair];
        });
      }
    } else {
      throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    }
    result = result.length > 0 ? result.map(([name, value]) => {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return [String(name).toLowerCase(), String(value)];
    }) : void 0;
    super(result);
    return new Proxy(this, {
      get(target, p, receiver) {
        switch (p) {
          case "append":
          case "set":
            return (name, value) => {
              validateHeaderName(name);
              validateHeaderValue(name, String(value));
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase(), String(value));
            };
          case "delete":
          case "has":
          case "getAll":
            return (name) => {
              validateHeaderName(name);
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase());
            };
          case "keys":
            return () => {
              target.sort();
              return new Set(URLSearchParams.prototype.keys.call(target)).keys();
            };
          default:
            return Reflect.get(target, p, receiver);
        }
      }
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(name) {
    const values = this.getAll(name);
    if (values.length === 0) {
      return null;
    }
    let value = values.join(", ");
    if (/^content-encoding$/i.test(name)) {
      value = value.toLowerCase();
    }
    return value;
  }
  forEach(callback) {
    for (const name of this.keys()) {
      callback(this.get(name), name);
    }
  }
  *values() {
    for (const name of this.keys()) {
      yield this.get(name);
    }
  }
  *entries() {
    for (const name of this.keys()) {
      yield [name, this.get(name)];
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  raw() {
    return [...this.keys()].reduce((result, key) => {
      result[key] = this.getAll(key);
      return result;
    }, {});
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((result, key) => {
      const values = this.getAll(key);
      if (key === "host") {
        result[key] = values[0];
      } else {
        result[key] = values.length > 1 ? values : values[0];
      }
      return result;
    }, {});
  }
};
Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
  result[property] = { enumerable: true };
  return result;
}, {}));
function fromRawHeaders(headers = []) {
  return new Headers(headers.reduce((result, value, index2, array) => {
    if (index2 % 2 === 0) {
      result.push(array.slice(index2, index2 + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
var redirectStatus = new Set([301, 302, 303, 307, 308]);
var isRedirect = (code) => {
  return redirectStatus.has(code);
};
var INTERNALS$1 = Symbol("Response internals");
var Response = class extends Body {
  constructor(body = null, options2 = {}) {
    super(body, options2);
    const status = options2.status || 200;
    const headers = new Headers(options2.headers);
    if (body !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(body);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    this[INTERNALS$1] = {
      url: options2.url,
      status,
      statusText: options2.statusText || "",
      headers,
      counter: options2.counter,
      highWaterMark: options2.highWaterMark
    };
  }
  get url() {
    return this[INTERNALS$1].url || "";
  }
  get status() {
    return this[INTERNALS$1].status;
  }
  get ok() {
    return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
  }
  get redirected() {
    return this[INTERNALS$1].counter > 0;
  }
  get statusText() {
    return this[INTERNALS$1].statusText;
  }
  get headers() {
    return this[INTERNALS$1].headers;
  }
  get highWaterMark() {
    return this[INTERNALS$1].highWaterMark;
  }
  clone() {
    return new Response(clone(this, this.highWaterMark), {
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected,
      size: this.size
    });
  }
  static redirect(url, status = 302) {
    if (!isRedirect(status)) {
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    }
    return new Response(null, {
      headers: {
        location: new URL(url).toString()
      },
      status
    });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
};
Object.defineProperties(Response.prototype, {
  url: { enumerable: true },
  status: { enumerable: true },
  ok: { enumerable: true },
  redirected: { enumerable: true },
  statusText: { enumerable: true },
  headers: { enumerable: true },
  clone: { enumerable: true }
});
var getSearch = (parsedURL) => {
  if (parsedURL.search) {
    return parsedURL.search;
  }
  const lastOffset = parsedURL.href.length - 1;
  const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
  return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
};
var INTERNALS = Symbol("Request internals");
var isRequest = (object) => {
  return typeof object === "object" && typeof object[INTERNALS] === "object";
};
var Request = class extends Body {
  constructor(input, init2 = {}) {
    let parsedURL;
    if (isRequest(input)) {
      parsedURL = new URL(input.url);
    } else {
      parsedURL = new URL(input);
      input = {};
    }
    let method = init2.method || input.method || "GET";
    method = method.toUpperCase();
    if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
      throw new TypeError("Request with GET/HEAD method cannot have body");
    }
    const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
    super(inputBody, {
      size: init2.size || input.size || 0
    });
    const headers = new Headers(init2.headers || input.headers || {});
    if (inputBody !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(inputBody, this);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init2) {
      signal = init2.signal;
    }
    if (signal !== null && !isAbortSignal(signal)) {
      throw new TypeError("Expected signal to be an instanceof AbortSignal");
    }
    this[INTERNALS] = {
      method,
      redirect: init2.redirect || input.redirect || "follow",
      headers,
      parsedURL,
      signal
    };
    this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
    this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
    this.counter = init2.counter || input.counter || 0;
    this.agent = init2.agent || input.agent;
    this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
    this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
  }
  get method() {
    return this[INTERNALS].method;
  }
  get url() {
    return (0, import_url.format)(this[INTERNALS].parsedURL);
  }
  get headers() {
    return this[INTERNALS].headers;
  }
  get redirect() {
    return this[INTERNALS].redirect;
  }
  get signal() {
    return this[INTERNALS].signal;
  }
  clone() {
    return new Request(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
};
Object.defineProperties(Request.prototype, {
  method: { enumerable: true },
  url: { enumerable: true },
  headers: { enumerable: true },
  redirect: { enumerable: true },
  clone: { enumerable: true },
  signal: { enumerable: true }
});
var getNodeRequestOptions = (request) => {
  const { parsedURL } = request[INTERNALS];
  const headers = new Headers(request[INTERNALS].headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "*/*");
  }
  let contentLengthValue = null;
  if (request.body === null && /^(post|put)$/i.test(request.method)) {
    contentLengthValue = "0";
  }
  if (request.body !== null) {
    const totalBytes = getTotalBytes(request);
    if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
      contentLengthValue = String(totalBytes);
    }
  }
  if (contentLengthValue) {
    headers.set("Content-Length", contentLengthValue);
  }
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", "node-fetch");
  }
  if (request.compress && !headers.has("Accept-Encoding")) {
    headers.set("Accept-Encoding", "gzip,deflate,br");
  }
  let { agent } = request;
  if (typeof agent === "function") {
    agent = agent(parsedURL);
  }
  if (!headers.has("Connection") && !agent) {
    headers.set("Connection", "close");
  }
  const search = getSearch(parsedURL);
  const requestOptions = {
    path: parsedURL.pathname + search,
    pathname: parsedURL.pathname,
    hostname: parsedURL.hostname,
    protocol: parsedURL.protocol,
    port: parsedURL.port,
    hash: parsedURL.hash,
    search: parsedURL.search,
    query: parsedURL.query,
    href: parsedURL.href,
    method: request.method,
    headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
    insecureHTTPParser: request.insecureHTTPParser,
    agent
  };
  return requestOptions;
};
var AbortError = class extends FetchBaseError {
  constructor(message, type = "aborted") {
    super(message, type);
  }
};
var supportedSchemas = new Set(["data:", "http:", "https:"]);
async function fetch(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request(url, options_);
    const options2 = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options2.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${options2.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (options2.protocol === "data:") {
      const data = dataUriToBuffer$1(request.url);
      const response2 = new Response(data, { headers: { "Content-Type": data.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (options2.protocol === "https:" ? import_https.default : import_http.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error3 = new AbortError("The operation was aborted.");
      reject(error3);
      if (request.body && request.body instanceof import_stream.default.Readable) {
        request.body.destroy(error3);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error3);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(options2);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (err) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
      finalize();
    });
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              try {
                headers.set("Location", locationURL);
              } catch (error3) {
                reject(error3);
              }
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            resolve2(fetch(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
        }
      }
      response_.once("end", () => {
        if (signal) {
          signal.removeEventListener("abort", abortAndFinalize);
        }
      });
      let body = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error3) => {
        reject(error3);
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createGunzip(zlibOptions), (error3) => {
          reject(error3);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error3) => {
          reject(error3);
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflate(), (error3) => {
              reject(error3);
            });
          } else {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflateRaw(), (error3) => {
              reject(error3);
            });
          }
          response = new Response(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createBrotliDecompress(), (error3) => {
          reject(error3);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}

// node_modules/@sveltejs/kit/dist/adapter-utils.js
function isContentTypeTextual(content_type) {
  if (!content_type)
    return true;
  const [type] = content_type.split(";");
  return type === "text/plain" || type === "application/json" || type === "application/x-www-form-urlencoded" || type === "multipart/form-data";
}

// node_modules/@sveltejs/kit/dist/node.js
function getRawBody(req) {
  return new Promise((fulfil, reject) => {
    const h = req.headers;
    if (!h["content-type"]) {
      return fulfil("");
    }
    req.on("error", reject);
    const length = Number(h["content-length"]);
    if (isNaN(length) && h["transfer-encoding"] == null) {
      return fulfil("");
    }
    let data = new Uint8Array(length || 0);
    if (length > 0) {
      let offset = 0;
      req.on("data", (chunk) => {
        const new_len = offset + Buffer.byteLength(chunk);
        if (new_len > length) {
          return reject({
            status: 413,
            reason: 'Exceeded "Content-Length" limit'
          });
        }
        data.set(chunk, offset);
        offset = new_len;
      });
    } else {
      req.on("data", (chunk) => {
        const new_data = new Uint8Array(data.length + chunk.length);
        new_data.set(data, 0);
        new_data.set(chunk, data.length);
        data = new_data;
      });
    }
    req.on("end", () => {
      const [type] = (h["content-type"] || "").split(/;\s*/);
      if (isContentTypeTextual(type)) {
        const encoding = h["content-encoding"] || "utf-8";
        return fulfil(new TextDecoder(encoding).decode(data));
      }
      fulfil(data);
    });
  });
}

// node_modules/@sveltejs/kit/dist/ssr.js
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
function error(body) {
  return {
    status: 500,
    body,
    headers: {}
  };
}
function is_string(s2) {
  return typeof s2 === "string" || s2 instanceof String;
}
async function render_endpoint(request, route) {
  const mod = await route.load();
  const handler = mod[request.method.toLowerCase().replace("delete", "del")];
  if (!handler) {
    return;
  }
  const match = route.pattern.exec(request.path);
  if (!match) {
    return error("could not parse parameters from request path");
  }
  const params = route.params(match);
  const response = await handler({ ...request, params });
  const preface = `Invalid response from route ${request.path}`;
  if (!response) {
    return;
  }
  if (typeof response !== "object") {
    return error(`${preface}: expected an object, got ${typeof response}`);
  }
  let { status = 200, body, headers = {} } = response;
  headers = lowercase_keys(headers);
  const type = headers["content-type"];
  const is_type_textual = isContentTypeTextual(type);
  if (!is_type_textual && !(body instanceof Uint8Array || is_string(body))) {
    return error(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
  }
  let normalized_body;
  if ((typeof body === "object" || typeof body === "undefined") && !(body instanceof Uint8Array) && (!type || type.startsWith("application/json"))) {
    headers = { ...headers, "content-type": "application/json; charset=utf-8" };
    normalized_body = JSON.stringify(typeof body === "undefined" ? {} : body);
  } else {
    normalized_body = body;
  }
  return { status, body: normalized_body, headers };
}
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop() {
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
Promise.resolve();
var subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = [];
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (let i = 0; i < subscribers.length; i += 1) {
          const s2 = subscribers[i];
          s2[1]();
          subscriber_queue.push(s2, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.push(subscriber);
    if (subscribers.length === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      const index2 = subscribers.indexOf(subscriber);
      if (index2 !== -1) {
        subscribers.splice(index2, 1);
      }
      if (subscribers.length === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe };
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
var s$1 = JSON.stringify;
async function render_response({
  branch,
  options: options2,
  $session,
  page_config,
  status,
  error: error3,
  page
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error3) {
    error3.stack = options2.get_stack(error3);
  }
  if (page_config.ssr) {
    branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => css2.add(url));
      if (node.js)
        node.js.forEach((url) => js.add(url));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable($session);
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        session
      },
      page,
      components: branch.map(({ node }) => node.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 || rendered.css.code.length > 0 ? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error4) => {
      throw new Error(`Failed to serialize session data: ${error4.message}`);
    })},
				host: ${page && page.host ? s$1(page.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error3)},
					nodes: [
						${(branch || []).map(({ node }) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page && page.host ? s$1(page.host) : "location.host"}, // TODO this is redundant
						path: ${s$1(page && page.path)},
						query: new URLSearchParams(${page ? s$1(page.query.toString()) : ""}),
						params: ${page && s$1(page.params)}
					}
				}` : "null"}
			});
		<\/script>`;
  }
  if (options2.service_worker) {
    init2 += `<script>
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('${options2.service_worker}');
			}
		<\/script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({ url, body: body2, json }) => {
    let attributes = `type="application/json" data-type="svelte-data" data-url="${url}"`;
    if (body2)
      attributes += ` data-body="${hash(body2)}"`;
    return `<script ${attributes}>${json}<\/script>`;
  }).join("\n\n			")}
		`.replace(/^\t{2}/gm, "");
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers,
    body: options2.template({ head, body })
  };
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(err);
    return null;
  }
}
function serialize_error(error3) {
  if (!error3)
    return null;
  let serialized = try_serialize(error3);
  if (!serialized) {
    const { name, message, stack } = error3;
    serialized = try_serialize({ ...error3, name, message, stack });
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return {
        status: status || 500,
        error: new Error()
      };
    }
    const error3 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    if (!(error3 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error3}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error3 };
    }
    return { status, error: error3 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  return loaded;
}
var s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page,
  node,
  $session,
  context,
  prerender_enabled,
  is_leaf,
  is_error,
  status,
  error: error3
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  let loaded;
  const page_proxy = new Proxy(page, {
    get: (target, prop, receiver) => {
      if (prop === "query" && prerender_enabled) {
        throw new Error("Cannot access query on a page with prerendering enabled");
      }
      return Reflect.get(target, prop, receiver);
    }
  });
  if (module2.load) {
    const load_input = {
      page: page_proxy,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url;
        if (typeof resource === "string") {
          url = resource;
        } else {
          url = resource.url;
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts
          };
        }
        const resolved = resolve(request.path, url.split("?")[0]);
        let response;
        const filename = resolved.replace(options2.paths.assets, "").slice(1);
        const filename_html = `${filename}/index.html`;
        const asset = options2.manifest.assets.find((d) => d.file === filename || d.file === filename_html);
        if (asset) {
          response = options2.read ? new Response(options2.read(asset.file), {
            headers: asset.type ? {
              "content-type": asset.type
            } : {}
          }) : await fetch(`http://${page.host}/${asset.file}`, opts);
        } else if (resolved.startsWith(options2.paths.base || "/") && !resolved.startsWith("//")) {
          const relative = resolved.replace(options2.paths.base, "");
          const headers = { ...opts.headers };
          if (opts.credentials !== "omit") {
            uses_credentials = true;
            headers.cookie = request.headers.cookie;
            if (!headers.authorization) {
              headers.authorization = request.headers.authorization;
            }
          }
          if (opts.body && typeof opts.body !== "string") {
            throw new Error("Request body must be a string");
          }
          const search = url.includes("?") ? url.slice(url.indexOf("?") + 1) : "";
          const rendered = await respond({
            host: request.host,
            method: opts.method || "GET",
            headers,
            path: relative,
            rawBody: opts.body,
            query: new URLSearchParams(search)
          }, options2, {
            fetched: url,
            initiator: route
          });
          if (rendered) {
            if (state.prerender) {
              state.prerender.dependencies.set(relative, rendered);
            }
            response = new Response(rendered.body, {
              status: rendered.status,
              headers: rendered.headers
            });
          }
        } else {
          if (resolved.startsWith("//")) {
            throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
          }
          if (typeof request.host !== "undefined") {
            const { hostname: fetch_hostname } = new URL(url);
            const [server_hostname] = request.host.split(":");
            if (`.${fetch_hostname}`.endsWith(`.${server_hostname}`) && opts.credentials !== "omit") {
              uses_credentials = true;
              opts.headers = {
                ...opts.headers,
                cookie: request.headers.cookie
              };
            }
          }
          const external_request = new Request(url, opts);
          response = await options2.hooks.serverFetch.call(null, external_request);
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, receiver) {
              async function text() {
                const body = await response2.text();
                const headers = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 !== "etag" && key2 !== "set-cookie")
                    headers[key2] = value;
                }
                if (!opts.body || typeof opts.body === "string") {
                  fetched.push({
                    url,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":${escape(body)}}`
                  });
                }
                return body;
              }
              if (key === "text") {
                return text;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new Response("Not found", {
          status: 404
        });
      },
      context: { ...context }
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error3;
    }
    loaded = await module2.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  if (!loaded) {
    throw new Error(`${node.entry} - load must return a value except for page fall through`);
  }
  return {
    node,
    loaded: normalize(loaded),
    context: loaded.context || context,
    fetched,
    uses_credentials
  };
}
var escaped = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped) {
      result += escaped[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
var absolute = /^([a-z]+:)?\/?\//;
function resolve(base, path) {
  const base_match = absolute.exec(base);
  const path_match = absolute.exec(path);
  if (!base_match) {
    throw new Error(`bad base path: "${base}"`);
  }
  const baseparts = path_match ? [] : base.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
function coalesce_to_error(err) {
  return err instanceof Error ? err : new Error(JSON.stringify(err));
}
async function respond_with_error({ request, options: options2, state, $session, status, error: error3 }) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page,
    node: default_layout,
    $session,
    context: {},
    prerender_enabled: is_prerender_enabled(options2, default_error, state),
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page,
      node: default_error,
      $session,
      context: loaded ? loaded.context : {},
      prerender_enabled: is_prerender_enabled(options2, default_error, state),
      is_leaf: false,
      is_error: true,
      status,
      error: error3
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error3,
      branch,
      page
    });
  } catch (err) {
    const error4 = coalesce_to_error(err);
    options2.handle_error(error4);
    return {
      status: 500,
      headers: {},
      body: error4.stack
    };
  }
}
function is_prerender_enabled(options2, node, state) {
  return options2.prerender && (!!node.module.prerender || !!state.prerender && state.prerender.all);
}
async function respond$1(opts) {
  const { request, options: options2, state, $session, route } = opts;
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id ? options2.load_component(id) : void 0));
  } catch (err) {
    const error4 = coalesce_to_error(err);
    options2.handle_error(error4);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error4
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  let page_config = get_page_config(leaf, options2);
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: ""
    };
  }
  let branch = [];
  let status = 200;
  let error3;
  ssr:
    if (page_config.ssr) {
      let context = {};
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              ...opts,
              node,
              context,
              prerender_enabled: is_prerender_enabled(options2, node, state),
              is_leaf: i === nodes.length - 1,
              is_error: false
            });
            if (!loaded)
              return;
            if (loaded.loaded.redirect) {
              return {
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              };
            }
            if (loaded.loaded.error) {
              ({ status, error: error3 } = loaded.loaded);
            }
          } catch (err) {
            const e = coalesce_to_error(err);
            options2.handle_error(e);
            status = 500;
            error3 = e;
          }
          if (loaded && !error3) {
            branch.push(loaded);
          }
          if (error3) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  const error_loaded = await load_node({
                    ...opts,
                    node: error_node,
                    context: node_loaded.context,
                    prerender_enabled: is_prerender_enabled(options2, error_node, state),
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error3
                  });
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  page_config = get_page_config(error_node.module, options2);
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (err) {
                  const e = coalesce_to_error(err);
                  options2.handle_error(e);
                  continue;
                }
              }
            }
            return await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error3
            });
          }
        }
        if (loaded && loaded.loaded.context) {
          context = {
            ...context,
            ...loaded.loaded.context
          };
        }
      }
    }
  try {
    return await render_response({
      ...opts,
      page_config,
      status,
      error: error3,
      branch: branch.filter(Boolean)
    });
  } catch (err) {
    const error4 = coalesce_to_error(err);
    options2.handle_error(error4);
    return await respond_with_error({
      ...opts,
      status: 500,
      error: error4
    });
  }
}
function get_page_config(leaf, options2) {
  return {
    ssr: "ssr" in leaf ? !!leaf.ssr : options2.ssr,
    router: "router" in leaf ? !!leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? !!leaf.hydrate : options2.hydrate
  };
}
async function render_page(request, route, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const match = route.pattern.exec(request.path);
  const params = route.params(match);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  const $session = await options2.hooks.getSession(request);
  const response = await respond$1({
    request,
    options: options2,
    state,
    $session,
    route,
    page
  });
  if (response) {
    return response;
  }
  if (state.fetched) {
    return {
      status: 500,
      headers: {},
      body: `Bad request in load function: failed to fetch ${state.fetched}`
    };
  }
}
function read_only_form_data() {
  const map = new Map();
  return {
    append(key, value) {
      if (map.has(key)) {
        (map.get(key) || []).push(value);
      } else {
        map.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map)
  };
}
var ReadOnlyFormData = class {
  #map;
  constructor(map) {
    this.#map = map;
  }
  get(key) {
    const value = this.#map.get(key);
    return value && value[0];
  }
  getAll(key) {
    return this.#map.get(key);
  }
  has(key) {
    return this.#map.has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key] of this.#map)
      yield key;
  }
  *values() {
    for (const [, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield value[i];
      }
    }
  }
};
function parse_body(raw, headers) {
  if (!raw || typeof raw !== "string")
    return raw;
  const [type, ...directives] = headers["content-type"].split(/;\s*/);
  switch (type) {
    case "text/plain":
      return raw;
    case "application/json":
      return JSON.parse(raw);
    case "application/x-www-form-urlencoded":
      return get_urlencoded(raw);
    case "multipart/form-data": {
      const boundary = directives.find((directive) => directive.startsWith("boundary="));
      if (!boundary)
        throw new Error("Missing boundary");
      return get_multipart(raw, boundary.slice("boundary=".length));
    }
    default:
      throw new Error(`Invalid Content-Type ${type}`);
  }
}
function get_urlencoded(text) {
  const { data, append } = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    throw new Error("Malformed form data");
  }
  const { data, append } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    if (!match) {
      throw new Error("Malformed form data");
    }
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    const headers = {};
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      headers[name] = value;
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          throw new Error("Malformed form data");
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      throw new Error("Malformed form data");
    append(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !(incoming.path.split("/").pop() || "").includes(".")) {
      const path = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + "/";
      const q = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: encodeURI(path + (q ? `?${q}` : ""))
        }
      };
    }
  }
  try {
    const headers = lowercase_keys(incoming.headers);
    return await options2.hooks.handle({
      request: {
        ...incoming,
        headers,
        body: parse_body(incoming.rawBody, headers),
        params: {},
        locals: {}
      },
      resolve: async (request) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            branch: []
          });
        }
        for (const route of options2.manifest.routes) {
          if (!route.pattern.test(request.path))
            continue;
          const response = route.type === "endpoint" ? await render_endpoint(request, route) : await render_page(request, route, options2, state);
          if (response) {
            if (response.status === 200) {
              if (!/(no-store|immutable)/.test(response.headers["cache-control"])) {
                const etag = `"${hash(response.body || "")}"`;
                if (request.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: ""
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        const $session = await options2.hooks.getSession(request);
        return await respond_with_error({
          request,
          options: options2,
          state,
          $session,
          status: 404,
          error: new Error(`Not found: ${request.path}`)
        });
      }
    });
  } catch (err) {
    const e = coalesce_to_error(err);
    options2.handle_error(e);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}

// .svelte-kit/output/server/app.js
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
Promise.resolve();
var escaped2 = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape2(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped2[match]);
}
var missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
var on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(parent_component ? parent_component.$$.context : context || []),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function afterUpdate() {
}
var css$8 = {
  code: "#svelte-announcer.svelte-1pdgbjn{clip:rect(0 0 0 0);-webkit-clip-path:inset(50%);clip-path:inset(50%);height:1px;left:0;overflow:hidden;position:absolute;top:0;white-space:nowrap;width:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\texport let props_2 = null;\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title || 'untitled page';\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n<\/script>\\n\\n<svelte:component this={components[0]} {...(props_0 || {})}>\\n\\t{#if components[1]}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}>\\n\\t\\t\\t{#if components[2]}\\n\\t\\t\\t\\t<svelte:component this={components[2]} {...(props_2 || {})}/>\\n\\t\\t\\t{/if}\\n\\t\\t</svelte:component>\\n\\t{/if}\\n</svelte:component>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\t{title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>#svelte-announcer{clip:rect(0 0 0 0);-webkit-clip-path:inset(50%);clip-path:inset(50%);height:1px;left:0;overflow:hidden;position:absolute;top:0;white-space:nowrap;width:1px}</style>"],"names":[],"mappings":"AAqDO,gCAAiB,CAAC,KAAK,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,kBAAkB,MAAM,GAAG,CAAC,CAAC,UAAU,MAAM,GAAG,CAAC,CAAC,OAAO,GAAG,CAAC,KAAK,CAAC,CAAC,SAAS,MAAM,CAAC,SAAS,QAAQ,CAAC,IAAI,CAAC,CAAC,YAAY,MAAM,CAAC,MAAM,GAAG,CAAC"}`
};
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  $$result.css.add(css$8);
  {
    stores.page.set(page);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}` : ``}`
    })}` : ``}`
  })}

${``}`;
});
function set_paths(paths) {
}
function set_prerendering(value) {
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
var template = ({ head, body }) => '<!DOCTYPE html>\n<html lang="en">\n\n<head>\n	<meta charset="utf-8" />\n	<link rel="icon" href="/favicon.png" />\n	<link rel="preconnect" href="https://fonts.googleapis.com">\n	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n	<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=Raleway:wght@100&display=swap" rel="stylesheet"> \n		\n	<meta name="viewport" content="width=device-width, initial-scale=1" />\n	' + head + '\n</head>\n\n<body>\n	<div id="svelte">' + body + "</div>\n</body>\n\n</html>";
var options = null;
var default_settings = { paths: { "base": "", "assets": "/." } };
function init(settings = default_settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: "/./_app/start-046d64be.js",
      css: ["/./_app/assets/start-0826e215.css"],
      js: ["/./_app/start-046d64be.js", "/./_app/chunks/vendor-dfb0eb6e.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => "/./_app/" + entry_lookup[id],
    get_stack: (error22) => String(error22),
    handle_error: (error22) => {
      if (error22.frame) {
        console.error(error22.frame);
      }
      console.error(error22.stack);
      error22.stack = options.get_stack(error22);
    },
    hooks: get_hooks(user_hooks),
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    prerender: true,
    read: settings.read,
    root: Root,
    service_worker: null,
    router: true,
    ssr: true,
    target: "#svelte",
    template,
    trailing_slash: "never"
  };
}
var empty = () => ({});
var manifest = {
  assets: [{ "file": "favicon.png", "size": 1571, "type": "image/png" }, { "file": "img/bowl.png", "size": 17054, "type": "image/png" }, { "file": "img/calendar.png", "size": 13522, "type": "image/png" }, { "file": "img/champagne-glass.png", "size": 23442, "type": "image/png" }, { "file": "img/coffee-cup.png", "size": 18149, "type": "image/png" }, { "file": "img/fish.png", "size": 22764, "type": "image/png" }, { "file": "img/food-svgrepo-com.svg", "size": 4043, "type": "image/svg+xml" }, { "file": "img/salad.svg", "size": 7530, "type": "image/svg+xml" }, { "file": "img/toa.jpg", "size": 503172, "type": "image/jpeg" }],
  layout: "src/routes/__layout.svelte",
  error: ".svelte-kit/build/components/error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    }
  ]
};
var get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve: resolve2 }) => resolve2(request)),
  serverFetch: hooks.serverFetch || fetch
});
var module_lookup = {
  "src/routes/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout;
  }),
  ".svelte-kit/build/components/error.svelte": () => Promise.resolve().then(function() {
    return error2;
  }),
  "src/routes/index.svelte": () => Promise.resolve().then(function() {
    return index;
  })
};
var metadata_lookup = { "src/routes/__layout.svelte": { "entry": "/./_app/pages/__layout.svelte-0d0b04c5.js", "css": ["/./_app/assets/pages/__layout.svelte-a185b257.css"], "js": ["/./_app/pages/__layout.svelte-0d0b04c5.js", "/./_app/chunks/vendor-dfb0eb6e.js"], "styles": [] }, ".svelte-kit/build/components/error.svelte": { "entry": "/./_app/error.svelte-641afbf9.js", "css": [], "js": ["/./_app/error.svelte-641afbf9.js", "/./_app/chunks/vendor-dfb0eb6e.js"], "styles": [] }, "src/routes/index.svelte": { "entry": "/./_app/pages/index.svelte-832cd8f3.js", "css": ["/./_app/assets/pages/index.svelte-65507fef.css"], "js": ["/./_app/pages/index.svelte-832cd8f3.js", "/./_app/chunks/vendor-dfb0eb6e.js"], "styles": [] } };
async function load_component(file) {
  return {
    module: await module_lookup[file](),
    ...metadata_lookup[file]
  };
}
function render(request, {
  prerender
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender });
}
var css$7 = {
  code: "nav.svelte-1ykbcyh{color:#fff}a.svelte-1ykbcyh:hover{background-position:bottom;background-repeat:repeat-x;background-size:30%;border-bottom:10;border-radius:5px;padding-bottom:.3em;text-decoration:none}.tomato-bg.svelte-1ykbcyh,a.svelte-1ykbcyh:hover{background-color:tomato}.tomato-bg.svelte-1ykbcyh{border-radius:1px}.tomato-text.svelte-1ykbcyh{color:tomato}",
  map: `{"version":3,"file":"Nav.svelte","sources":["Nav.svelte"],"sourcesContent":["<script>\\n\\timport { onMount } from 'svelte';\\n\\n\\tonMount(() => {\\n\\t\\t(function toggle() {\\n\\t\\t\\tdocument.getElementById('nav-toggle').onclick = function () {\\n\\t\\t\\t\\tdocument.getElementById('nav-content').classList.toggle('hidden');\\n\\t\\t\\t};\\n\\t\\t})();\\n\\n\\t\\tconst navbar = document.querySelector('.navbar');\\n\\t\\twindow.onscroll = () => {\\n\\t\\t\\tif (window.scrollY > 200) {\\n\\t\\t\\t\\tnavbar.classList.add('bg-gray-800');\\n\\t\\t\\t} else {\\n\\t\\t\\t\\tnavbar.classList.remove('bg-gray-800');\\n\\t\\t\\t}\\n\\t\\t};\\n\\t});\\n<\/script>\\n\\n<nav\\n\\tclass=\\"fixed z-50 flex flex-wrap items-center justify-between w-full p-4 navbar bg-none sm green pin-t\\"\\n>\\n\\t<div class=\\"flex items-center mr-6 text-white flex-no-shrink\\" />\\n\\t<a\\n\\t\\tclass=\\"inline-block px-4 py-2 text-2xl font-extrabold no-underline hover:text-white hover:text-underline\\"\\n\\t\\thref=\\"/\\"\\n\\t>\\n\\t\\tElleven<span class=\\"tomato-text \\">15</span>\\n\\t</a>\\n\\t<div class=\\"block text-white lg:hidden\\">\\n\\t\\t<button\\n\\t\\t\\tid=\\"nav-toggle\\"\\n\\t\\t\\tclass=\\"flex items-center px-3 py-2 border rounded text-grey border-grey-dark hover:text-white hover:border-white\\"\\n\\t\\t>\\n\\t\\t\\t<svg class=\\"w-3 h-3 fill-current\\" viewBox=\\"0 0 20 20\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n\\t\\t\\t\\t<title>Menu</title>\\n\\t\\t\\t\\t<path d=\\"M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z\\" />\\n\\t\\t\\t</svg>\\n\\t\\t</button>\\n\\t</div>\\n\\n\\t<div\\n\\t\\tclass=\\"flex-grow hidden w-full pt-6 text-lg font-bold lg:flex lg:items-center lg:w-auto lg:pt-0\\"\\n\\t\\tid=\\"nav-content\\"\\n\\t>\\n\\t\\t<ul class=\\"items-center justify-center flex-1 text-lg list-reset lg:flex\\">\\n\\t\\t\\t<li class=\\"mr-3\\">\\n\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\thref=\\"#feature\\"\\n\\t\\t\\t\\t\\tclass=\\"inline-block px-4 py-2 no-underline text-grey-dark hover:text-grey-lighter hover:text-underline\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\tFeature\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t</li>\\n\\t\\t\\t<li class=\\"mr-3\\">\\n\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\thref=\\"#special\\"\\n\\t\\t\\t\\t\\tclass=\\"inline-block px-4 py-2 no-underline text-grey-dark hover:text-grey-lighter hover:text-underline\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\tSpecial\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t</li>\\n\\t\\t\\t<li class=\\"mr-3\\">\\n\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\thref=\\"#menu\\"\\n\\t\\t\\t\\t\\tclass=\\"inline-block px-4 py-2 no-underline text-grey-dark hover:text-grey-lighter hover:text-underline\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\tMenu\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t</li>\\n\\t\\t\\t<li class=\\"mr-3\\">\\n\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\thref=\\"#testimonials\\"\\n\\t\\t\\t\\t\\tclass=\\"inline-block px-4 py-2 no-underline text-grey-dark hover:text-grey-lighter hover:text-underline\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\tTestimonials\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t</li>\\n\\t\\t\\t<li class=\\"mr-3\\">\\n\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\thref=\\"#blog\\"\\n\\t\\t\\t\\t\\tclass=\\"inline-block px-4 py-2 no-underline text-grey-dark hover:text-grey-lighter hover:text-underline\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\tBlog\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t</li>\\n\\t\\t</ul>\\n\\t\\t<a\\n\\t\\t\\tclass=\\"inline-block px-4 py-2 text-lg no-underline tomato-bg hover:text-white hover:text-grey-lighter hover:text-underline\\"\\n\\t\\t\\thref=\\"/\\">Contact Us</a\\n\\t\\t>\\n\\t</div>\\n</nav>\\n\\n<style>nav{color:#fff}a:hover{background-position:bottom;background-repeat:repeat-x;background-size:30%;border-bottom:10;border-radius:5px;padding-bottom:.3em;text-decoration:none}.tomato-bg,a:hover{background-color:tomato}.tomato-bg{border-radius:1px}.tomato-text{color:tomato}</style>\\n"],"names":[],"mappings":"AAgGO,kBAAG,CAAC,MAAM,IAAI,CAAC,gBAAC,MAAM,CAAC,oBAAoB,MAAM,CAAC,kBAAkB,QAAQ,CAAC,gBAAgB,GAAG,CAAC,cAAc,EAAE,CAAC,cAAc,GAAG,CAAC,eAAe,IAAI,CAAC,gBAAgB,IAAI,CAAC,yBAAU,CAAC,gBAAC,MAAM,CAAC,iBAAiB,MAAM,CAAC,yBAAU,CAAC,cAAc,GAAG,CAAC,2BAAY,CAAC,MAAM,MAAM,CAAC"}`
};
var Nav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$7);
  return `<nav class="${"fixed z-50 flex flex-wrap items-center justify-between w-full p-4 navbar bg-none sm green pin-t svelte-1ykbcyh"}"><div class="${"flex items-center mr-6 text-white flex-no-shrink"}"></div>
	<a class="${"inline-block px-4 py-2 text-2xl font-extrabold no-underline hover:text-white hover:text-underline svelte-1ykbcyh"}" href="${"/"}">Elleven<span class="${"tomato-text  svelte-1ykbcyh"}">15</span></a>
	<div class="${"block text-white lg:hidden"}"><button id="${"nav-toggle"}" class="${"flex items-center px-3 py-2 border rounded text-grey border-grey-dark hover:text-white hover:border-white"}"><svg class="${"w-3 h-3 fill-current"}" viewBox="${"0 0 20 20"}" xmlns="${"http://www.w3.org/2000/svg"}"><title>Menu</title><path d="${"M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"}"></path></svg></button></div>

	<div class="${"flex-grow hidden w-full pt-6 text-lg font-bold lg:flex lg:items-center lg:w-auto lg:pt-0"}" id="${"nav-content"}"><ul class="${"items-center justify-center flex-1 text-lg list-reset lg:flex"}"><li class="${"mr-3"}"><a href="${"#feature"}" class="${"inline-block px-4 py-2 no-underline text-grey-dark hover:text-grey-lighter hover:text-underline svelte-1ykbcyh"}">Feature
				</a></li>
			<li class="${"mr-3"}"><a href="${"#special"}" class="${"inline-block px-4 py-2 no-underline text-grey-dark hover:text-grey-lighter hover:text-underline svelte-1ykbcyh"}">Special
				</a></li>
			<li class="${"mr-3"}"><a href="${"#menu"}" class="${"inline-block px-4 py-2 no-underline text-grey-dark hover:text-grey-lighter hover:text-underline svelte-1ykbcyh"}">Menu
				</a></li>
			<li class="${"mr-3"}"><a href="${"#testimonials"}" class="${"inline-block px-4 py-2 no-underline text-grey-dark hover:text-grey-lighter hover:text-underline svelte-1ykbcyh"}">Testimonials
				</a></li>
			<li class="${"mr-3"}"><a href="${"#blog"}" class="${"inline-block px-4 py-2 no-underline text-grey-dark hover:text-grey-lighter hover:text-underline svelte-1ykbcyh"}">Blog
				</a></li></ul>
		<a class="${"inline-block px-4 py-2 text-lg no-underline tomato-bg hover:text-white hover:text-grey-lighter hover:text-underline svelte-1ykbcyh"}" href="${"/"}">Contact Us</a></div>
</nav>`;
});
var css$6 = {
  code: ".tomato.svelte-1f9ne4u{color:tomato}",
  map: '{"version":3,"file":"Footer.svelte","sources":["Footer.svelte"],"sourcesContent":["<section class=\\"mx-auto bg-gray-800 py-14\\">\\n<div class=\\"flex items-center justify-center\\">\\n    <div class=\\"container grid grid-cols-1 gap-4 px-3 lg:grid-cols-3\\">\\n        <div class=\\"flex flex-col\\">\\n            <h2 class=\\"text-2xl font-extrabold text-white\\">About</h2>\\n            <p class=\\"py-4 text-white\\">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus et dolor blanditiis consequuntur ex voluptates perspiciatis omnis unde minima expedita.</p>\\n            <div class=\\"flex py-4 space-x-2\\">\\n             <svg xmlns=\\"http://www.w3.org/2000/svg\\" class=\\"px-2 bg-white rounded-full cursor-pointer hover:bg-transparent tomato icon icon-tabler icon-tabler-brand-twitter\\" width=\\"40\\" height=\\"40\\" viewBox=\\"0 0 24 24\\" stroke-width=\\"1.5\\" stroke=\\"tomato\\" fill=\\"none\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\">\\n                 <path stroke=\\"none\\" d=\\"M0 0h24v24H0z\\" fill=\\"none\\"/>\\n                 <path d=\\"M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c-.002 -.249 1.51 -2.772 1.818 -4.013z\\" />\\n               </svg>\\n               <svg xmlns=\\"http://www.w3.org/2000/svg\\" class=\\"px-2 bg-white rounded-full cursor-pointer hover:bg-transparent icon icon-tabler icon-tabler-brand-facebook\\" width=\\"40\\" height=\\"40\\" viewBox=\\"0 0 24 24\\" stroke-width=\\"1.5\\" stroke=\\"tomato\\" fill=\\"none\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\">\\n                 <path stroke=\\"none\\" d=\\"M0 0h24v24H0z\\" fill=\\"none\\"/>\\n                 <path d=\\"M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3\\" />\\n               </svg>\\n               <svg xmlns=\\"http://www.w3.org/2000/svg\\" class=\\"px-2 bg-white rounded-full cursor-pointer hover:bg-transparent icon icon-tabler icon-tabler-brand-linkedin\\" width=\\"40\\" height=\\"40\\" viewBox=\\"0 0 24 24\\" stroke-width=\\"1.5\\" stroke=\\"tomato\\" fill=\\"none\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\">\\n                 <path stroke=\\"none\\" d=\\"M0 0h24v24H0z\\" fill=\\"none\\"/>\\n                 <rect x=\\"4\\" y=\\"4\\" width=\\"16\\" height=\\"16\\" rx=\\"2\\" />\\n                 <line x1=\\"8\\" y1=\\"11\\" x2=\\"8\\" y2=\\"16\\" />\\n                 <line x1=\\"8\\" y1=\\"8\\" x2=\\"8\\" y2=\\"8.01\\" />\\n                 <line x1=\\"12\\" y1=\\"16\\" x2=\\"12\\" y2=\\"11\\" />\\n                 <path d=\\"M16 16v-3a2 2 0 0 0 -4 0\\" />\\n               </svg>\\n               <svg xmlns=\\"http://www.w3.org/2000/svg\\" class=\\"px-2 bg-white rounded-full cursor-pointer hover:bg-transparent icon icon-tabler icon-tabler-brand-instagram\\" width=\\"40\\" height=\\"40\\" viewBox=\\"0 0 24 24\\" stroke-width=\\"1.5\\" stroke=\\"tomato\\" fill=\\"none\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\">\\n                 <path stroke=\\"none\\" d=\\"M0 0h24v24H0z\\" fill=\\"none\\"/>\\n                 <rect x=\\"4\\" y=\\"4\\" width=\\"16\\" height=\\"16\\" rx=\\"4\\" />\\n                 <circle cx=\\"12\\" cy=\\"12\\" r=\\"3\\" />\\n                 <line x1=\\"16.5\\" y1=\\"7.5\\" x2=\\"16.5\\" y2=\\"7.501\\" />\\n               </svg>\\n            </div>\\n         </div>\\n         <div class=\\"flex flex-col \\">\\n             <h2 class=\\"text-2xl font-extrabold text-white\\">Opening Hours</h2>\\n             <p class=\\"py-3 font-bold text-gray-400\\">Sunday - Saturday <span class=\\"mx-2\\">8AM - 11:15PM</span></p>\\n     \\n             <h2 class=\\"py-3 text-2xl font-extrabold text-white\\">Contact Info</h2>\\n             <div class=\\"py-2 text-white\\">\\n                 <p class=\\"inline-block\\"><span class=\\"mr-1 text-lg font-extrabold\\">Address:</span> Lake Side Estate, Adjiringanor Accra, Ghana</p> \\n                 <p class=\\"inline-block\\"><span class=\\"mr-1 text-lg font-extrabold \\">Telephone:</span> +1 242 4942 290</p> \\n                 <p class=\\"inline-block\\"><span class=\\"mr-1 text-lg font-extrabold \\">Email:</span>elleven15@food.com</p> \\n                \\n             </div>\\n         </div>\\n         <div class=\\"flex flex-col\\">\\n             <h2 class=\\"py-3 text-2xl font-extrabold text-white\\">Quick Links</h2>\\n             <ul class=\\"flex flex-col space-y-2 text-white\\">\\n                 <li><a class=\\"font-bold text-red-400 hover:text-white\\" href=\\"/\\">About</a></li>\\n                 <li><a class=\\"font-bold text-red-400 hover:text-white\\" href=\\"/\\">Terms of Use</a></li>\\n                 <li><a class=\\"font-bold text-red-400 hover:text-white\\" href=\\"/\\">Disclaimers</a></li>\\n                 <li><a class=\\"font-bold text-red-400 hover:text-white\\" href=\\"/\\">Contact</a></li>\\n             </ul>\\n         </div>\\n     </div>\\n</div>\\n</section>\\n\\n<style>.tomato{color:tomato}</style>"],"names":[],"mappings":"AAwDO,sBAAO,CAAC,MAAM,MAAM,CAAC"}'
};
var Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$6);
  return `<section class="${"mx-auto bg-gray-800 py-14"}"><div class="${"flex items-center justify-center"}"><div class="${"container grid grid-cols-1 gap-4 px-3 lg:grid-cols-3"}"><div class="${"flex flex-col"}"><h2 class="${"text-2xl font-extrabold text-white"}">About</h2>
            <p class="${"py-4 text-white"}">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus et dolor blanditiis consequuntur ex voluptates perspiciatis omnis unde minima expedita.</p>
            <div class="${"flex py-4 space-x-2"}"><svg xmlns="${"http://www.w3.org/2000/svg"}" class="${"px-2 bg-white rounded-full cursor-pointer hover:bg-transparent tomato icon icon-tabler icon-tabler-brand-twitter svelte-1f9ne4u"}" width="${"40"}" height="${"40"}" viewBox="${"0 0 24 24"}" stroke-width="${"1.5"}" stroke="${"tomato"}" fill="${"none"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}"><path stroke="${"none"}" d="${"M0 0h24v24H0z"}" fill="${"none"}"></path><path d="${"M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c-.002 -.249 1.51 -2.772 1.818 -4.013z"}"></path></svg>
               <svg xmlns="${"http://www.w3.org/2000/svg"}" class="${"px-2 bg-white rounded-full cursor-pointer hover:bg-transparent icon icon-tabler icon-tabler-brand-facebook"}" width="${"40"}" height="${"40"}" viewBox="${"0 0 24 24"}" stroke-width="${"1.5"}" stroke="${"tomato"}" fill="${"none"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}"><path stroke="${"none"}" d="${"M0 0h24v24H0z"}" fill="${"none"}"></path><path d="${"M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3"}"></path></svg>
               <svg xmlns="${"http://www.w3.org/2000/svg"}" class="${"px-2 bg-white rounded-full cursor-pointer hover:bg-transparent icon icon-tabler icon-tabler-brand-linkedin"}" width="${"40"}" height="${"40"}" viewBox="${"0 0 24 24"}" stroke-width="${"1.5"}" stroke="${"tomato"}" fill="${"none"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}"><path stroke="${"none"}" d="${"M0 0h24v24H0z"}" fill="${"none"}"></path><rect x="${"4"}" y="${"4"}" width="${"16"}" height="${"16"}" rx="${"2"}"></rect><line x1="${"8"}" y1="${"11"}" x2="${"8"}" y2="${"16"}"></line><line x1="${"8"}" y1="${"8"}" x2="${"8"}" y2="${"8.01"}"></line><line x1="${"12"}" y1="${"16"}" x2="${"12"}" y2="${"11"}"></line><path d="${"M16 16v-3a2 2 0 0 0 -4 0"}"></path></svg>
               <svg xmlns="${"http://www.w3.org/2000/svg"}" class="${"px-2 bg-white rounded-full cursor-pointer hover:bg-transparent icon icon-tabler icon-tabler-brand-instagram"}" width="${"40"}" height="${"40"}" viewBox="${"0 0 24 24"}" stroke-width="${"1.5"}" stroke="${"tomato"}" fill="${"none"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}"><path stroke="${"none"}" d="${"M0 0h24v24H0z"}" fill="${"none"}"></path><rect x="${"4"}" y="${"4"}" width="${"16"}" height="${"16"}" rx="${"4"}"></rect><circle cx="${"12"}" cy="${"12"}" r="${"3"}"></circle><line x1="${"16.5"}" y1="${"7.5"}" x2="${"16.5"}" y2="${"7.501"}"></line></svg></div></div>
         <div class="${"flex flex-col "}"><h2 class="${"text-2xl font-extrabold text-white"}">Opening Hours</h2>
             <p class="${"py-3 font-bold text-gray-400"}">Sunday - Saturday <span class="${"mx-2"}">8AM - 11:15PM</span></p>
     
             <h2 class="${"py-3 text-2xl font-extrabold text-white"}">Contact Info</h2>
             <div class="${"py-2 text-white"}"><p class="${"inline-block"}"><span class="${"mr-1 text-lg font-extrabold"}">Address:</span> Lake Side Estate, Adjiringanor Accra, Ghana</p> 
                 <p class="${"inline-block"}"><span class="${"mr-1 text-lg font-extrabold "}">Telephone:</span> +1 242 4942 290</p> 
                 <p class="${"inline-block"}"><span class="${"mr-1 text-lg font-extrabold "}">Email:</span>elleven15@food.com</p></div></div>
         <div class="${"flex flex-col"}"><h2 class="${"py-3 text-2xl font-extrabold text-white"}">Quick Links</h2>
             <ul class="${"flex flex-col space-y-2 text-white"}"><li><a class="${"font-bold text-red-400 hover:text-white"}" href="${"/"}">About</a></li>
                 <li><a class="${"font-bold text-red-400 hover:text-white"}" href="${"/"}">Terms of Use</a></li>
                 <li><a class="${"font-bold text-red-400 hover:text-white"}" href="${"/"}">Disclaimers</a></li>
                 <li><a class="${"font-bold text-red-400 hover:text-white"}" href="${"/"}">Contact</a></li></ul></div></div></div>
</section>`;
});
var css$5 = {
  code: "body,html{font-family:Raleway,sans-serif;scroll-behavior:smooth}",
  map: `{"version":3,"file":"__layout.svelte","sources":["__layout.svelte"],"sourcesContent":["<script>\\n\\t\\n\\timport '../app.postcss';\\n\\timport Nav from '$lib/Nav.svelte';\\n\\timport Footer from '$lib/Footer.svelte';\\n\\n\\n<\/script>\\n\\n<Nav />\\n<main>\\n\\t<slot />\\n</main>\\n<Footer/>\\n<style>:global(body,html){font-family:Raleway,sans-serif;scroll-behavior:smooth}</style>\\n"],"names":[],"mappings":"AAce,SAAS,AAAC,CAAC,YAAY,OAAO,CAAC,UAAU,CAAC,gBAAgB,MAAM,CAAC"}`
};
var _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$5);
  return `${validate_component(Nav, "Nav").$$render($$result, {}, {}, {})}
<main>${slots.default ? slots.default({}) : ``}</main>
${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}`;
});
var __layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout
});
function load({ error: error22, status }) {
  return { props: { error: error22, status } };
}
var Error$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { status } = $$props;
  let { error: error22 } = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error22 !== void 0)
    $$bindings.error(error22);
  return `<h1>${escape2(status)}</h1>

<pre>${escape2(error22.message)}</pre>



${error22.frame ? `<pre>${escape2(error22.frame)}</pre>` : ``}
${error22.stack ? `<pre>${escape2(error22.stack)}</pre>` : ``}`;
});
var error2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Error$1,
  load
});
var css$4 = {
  code: ".tomato.svelte-1f9ne4u{color:tomato}",
  map: '{"version":3,"file":"Banner.svelte","sources":["Banner.svelte"],"sourcesContent":["<script>\\n\\t// import swiper and swiperslid\\n<\/script>\\n\\n<section class=\\"max-h-screen\\">\\n\\t<div class=\\"text-center bg-gray-100\\">\\n\\t\\t<div>\\n\\t\\t\\t<img\\n\\t\\t\\t\\tclass=\\"object-cover object-right w-full h-screen bg-gray-900 bg-opacity-75\\"\\n\\t\\t\\t\\tsrc=\\"https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80\\"\\n\\t\\t\\t\\talt=\\"banner\\"\\n\\t\\t\\t/>\\n\\t\\t\\t<div\\n\\t\\t\\t\\tclass=\\"absolute z-50 text-6xl text-white transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\t<h2 class=\\"text-5xl font-bold text-left lg:text-8xl\\">\\n\\t\\t\\t\\t\\tDelicious <span class=\\"tomato\\">Foods</span>\\n\\t\\t\\t\\t</h2>\\n\\t\\t\\t\\t<p class=\\"w-full py-3 text-lg font-light text-left lg:font-bold\\">\\n\\t\\t\\t\\t\\tYou can easily align form elements in the center using flex property in Tailwind CSS.\\n\\t\\t\\t\\t\\tTailwind uses justify-center and items-center property which is an alternative CSS.\\n\\t\\t\\t\\t</p>\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t</div>\\n</section>\\n\\n<style>.tomato{color:tomato}</style>\\n"],"names":[],"mappings":"AA2BO,sBAAO,CAAC,MAAM,MAAM,CAAC"}'
};
var Banner = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$4);
  return `<section class="${"max-h-screen"}"><div class="${"text-center bg-gray-100"}"><div><img class="${"object-cover object-right w-full h-screen bg-gray-900 bg-opacity-75"}" src="${"https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"}" alt="${"banner"}">
			<div class="${"absolute z-50 text-6xl text-white transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"}"><h2 class="${"text-5xl font-bold text-left lg:text-8xl"}">Delicious <span class="${"tomato svelte-1f9ne4u"}">Foods</span></h2>
				<p class="${"w-full py-3 text-lg font-light text-left lg:font-bold"}">You can easily align form elements in the center using flex property in Tailwind CSS.
					Tailwind uses justify-center and items-center property which is an alternative CSS.
				</p></div></div></div>
</section>`;
});
var css$3 = {
  code: ".tomato.svelte-1f9ne4u{color:tomato}",
  map: '{"version":3,"file":"Feature.svelte","sources":["Feature.svelte"],"sourcesContent":["<main>\\n\\t<div class=\\"bg-gray-100 text-white py-24\\">\\n\\t\\t<div class=\\"flex lg:mx-14 items-center justify-center\\">\\n\\t\\t\\t<div class=\\"grid md:grid-cols-2 grid-cols-1 lg:grid-cols-4 gap-2\\">\\n\\t\\t\\t\\t<div class=\\"bg-white items-center p-4 justify-center flex flex-col\\">\\n\\t\\t\\t\\t\\t<div class=\\"flex py-8 items-center justify-center\\">\\n\\t\\t\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"w-24 object-cover object-center\\"\\n\\t\\t\\t\\t\\t\\t\\tsrc=\\"img/champagne-glass.png\\"\\n\\t\\t\\t\\t\\t\\t\\talt=\\"drinks\\"\\n\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t<h2 class=\\"text-3xl font-bold tomato\\">Drinks</h2>\\n\\t\\t\\t\\t\\t<p class=\\"p-2 font-light text-gray-700\\">\\n\\t\\t\\t\\t\\t\\tLorem ipsum dolor sit amet consectetur adipisicing elit. Possimus architecto numquam\\n\\t\\t\\t\\t\\t\\tquibusdam accusamus, autem beatae unde nobis perferendis placeat. Recusandae aut, eaque\\n\\t\\t\\t\\t\\t\\tmollitia ab optio quas. Non tempora at illo.\\n\\t\\t\\t\\t\\t</p>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t<div class=\\"bg-white items-center p-4 justify-center flex flex-col\\">\\n\\t\\t\\t\\t\\t<div class=\\"flex py-8 items-center justify-center\\">\\n\\t\\t\\t\\t\\t\\t<img class=\\"w-24 object-cover object-center\\" src=\\"img/fish.png\\" alt=\\"\\" />\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t<h2 class=\\"text-3xl font-bold tomato\\">Sea Foods</h2>\\n\\t\\t\\t\\t\\t<p class=\\"p-2 font-light text-gray-700\\">\\n\\t\\t\\t\\t\\t\\tLorem ipsum dolor sit amet consectetur adipisicing elit. Possimus architecto numquam\\n\\t\\t\\t\\t\\t\\tquibusdam accusamus, autem beatae unde nobis perferendis placeat. Recusandae aut, eaque\\n\\t\\t\\t\\t\\t\\tmollitia ab optio quas. Non tempora at illo.\\n\\t\\t\\t\\t\\t</p>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t<div class=\\"bg-white items-center p-4 justify-center flex flex-col\\">\\n\\t\\t\\t\\t\\t<div class=\\"flex py-8 items-center justify-center\\">\\n\\t\\t\\t\\t\\t\\t<img class=\\"w-24 object-cover object-center\\" src=\\"img/coffee-cup.png\\" alt=\\"\\" />\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t<h2 class=\\"text-3xl font-bold tomato\\">Coffee</h2>\\n\\t\\t\\t\\t\\t<p class=\\"p-2 font-light text-gray-700\\">\\n\\t\\t\\t\\t\\t\\tLorem ipsum dolor sit amet consectetur adipisicing elit. Possimus architecto numquam\\n\\t\\t\\t\\t\\t\\tquibusdam accusamus, autem beatae unde nobis perferendis placeat. Recusandae aut, eaque\\n\\t\\t\\t\\t\\t\\tmollitia ab optio quas. Non tempora at illo.\\n\\t\\t\\t\\t\\t</p>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t<div class=\\"bg-white items-center p-4 justify-center flex flex-col\\">\\n\\t\\t\\t\\t\\t<div class=\\"flex py-8 items-center justify-center\\">\\n\\t\\t\\t\\t\\t\\t<img class=\\"w-24 object-cover object-center\\" src=\\"img/bowl.png\\" alt=\\"\\" />\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t<h2 class=\\"text-3xl font-bold tomato\\">Locals</h2>\\n\\t\\t\\t\\t\\t<p class=\\"p-2 font-light text-gray-700\\">\\n\\t\\t\\t\\t\\t\\tLorem ipsum dolor sit amet consectetur adipisicing elit. Possimus architecto numquam\\n\\t\\t\\t\\t\\t\\tquibusdam accusamus, autem beatae unde nobis perferendis placeat. Recusandae aut, eaque\\n\\t\\t\\t\\t\\t\\tmollitia ab optio quas. Non tempora at illo.\\n\\t\\t\\t\\t\\t</p>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t</div>\\n</main>\\n\\n<style>.tomato{color:tomato}</style>\\n"],"names":[],"mappings":"AAyDO,sBAAO,CAAC,MAAM,MAAM,CAAC"}'
};
var Feature = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$3);
  return `<main><div class="${"bg-gray-100 text-white py-24"}"><div class="${"flex lg:mx-14 items-center justify-center"}"><div class="${"grid md:grid-cols-2 grid-cols-1 lg:grid-cols-4 gap-2"}"><div class="${"bg-white items-center p-4 justify-center flex flex-col"}"><div class="${"flex py-8 items-center justify-center"}"><img class="${"w-24 object-cover object-center"}" src="${"img/champagne-glass.png"}" alt="${"drinks"}"></div>
					<h2 class="${"text-3xl font-bold tomato svelte-1f9ne4u"}">Drinks</h2>
					<p class="${"p-2 font-light text-gray-700"}">Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus architecto numquam
						quibusdam accusamus, autem beatae unde nobis perferendis placeat. Recusandae aut, eaque
						mollitia ab optio quas. Non tempora at illo.
					</p></div>
				<div class="${"bg-white items-center p-4 justify-center flex flex-col"}"><div class="${"flex py-8 items-center justify-center"}"><img class="${"w-24 object-cover object-center"}" src="${"img/fish.png"}" alt="${""}"></div>
					<h2 class="${"text-3xl font-bold tomato svelte-1f9ne4u"}">Sea Foods</h2>
					<p class="${"p-2 font-light text-gray-700"}">Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus architecto numquam
						quibusdam accusamus, autem beatae unde nobis perferendis placeat. Recusandae aut, eaque
						mollitia ab optio quas. Non tempora at illo.
					</p></div>
				<div class="${"bg-white items-center p-4 justify-center flex flex-col"}"><div class="${"flex py-8 items-center justify-center"}"><img class="${"w-24 object-cover object-center"}" src="${"img/coffee-cup.png"}" alt="${""}"></div>
					<h2 class="${"text-3xl font-bold tomato svelte-1f9ne4u"}">Coffee</h2>
					<p class="${"p-2 font-light text-gray-700"}">Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus architecto numquam
						quibusdam accusamus, autem beatae unde nobis perferendis placeat. Recusandae aut, eaque
						mollitia ab optio quas. Non tempora at illo.
					</p></div>
				<div class="${"bg-white items-center p-4 justify-center flex flex-col"}"><div class="${"flex py-8 items-center justify-center"}"><img class="${"w-24 object-cover object-center"}" src="${"img/bowl.png"}" alt="${""}"></div>
					<h2 class="${"text-3xl font-bold tomato svelte-1f9ne4u"}">Locals</h2>
					<p class="${"p-2 font-light text-gray-700"}">Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus architecto numquam
						quibusdam accusamus, autem beatae unde nobis perferendis placeat. Recusandae aut, eaque
						mollitia ab optio quas. Non tempora at illo.
					</p></div></div></div></div>
</main>`;
});
var css$2 = {
  code: ".tomato.svelte-1f9ne4u{color:tomato}",
  map: '{"version":3,"file":"Special.svelte","sources":["Special.svelte"],"sourcesContent":["<main>\\n\\t<div class=\\"py-24 text-white bg-white\\">\\n        <h2 class=\\"text-4xl font-bold text-center text-gray-500 lg:text-5xl\\">Special Menu</h2>\\n\\t\\t<div class=\\"flex items-center justify-center lg:mx-14\\">\\n\\t\\t\\t<div class=\\"grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3\\">\\n\\t\\t\\t\\t<div class=\\"relative flex flex-col items-center justify-center p-4 bg-white\\">\\n\\t\\t\\t\\t\\t<div class=\\"flex items-center justify-center py-8\\">\\n\\t\\t\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"object-cover object-center w-full overflow-hidden bg-gray-900 bg-cover rounded-sm bg-opacity-10 \\"\\n\\t\\t\\t\\t\\t\\t\\tsrc=\\"https://images.unsplash.com/photo-1606898425083-0e6915bf7870?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1061&q=80\\"\\n\\t\\t\\t\\t\\t\\t\\talt=\\"drinks\\"\\n\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t<div class=\\"absolute p-3 duration-300 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 opacity-0 bg-opacity-30 hover:opacity-100 z-60 top-1/2 left-1/2\\">\\n                        <h2 class=\\"text-3xl font-black tomato z-60\\">Burger King</h2>\\n\\t\\t\\t\\t\\t    <p class=\\"p-2 text-2xl font-black text-white z-60\\">\\n\\t\\t\\t\\t\\t\\t$54.56\\n\\t\\t\\t\\t\\t\\t\\n\\t\\t\\t\\t\\t</p>\\n                    </div>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t<div class=\\"relative z-0 flex flex-col items-center justify-center p-4 bg-white\\">\\n\\t\\t\\t\\t\\t<div class=\\"flex items-center justify-center py-8\\">\\n\\t\\t\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"z-0 w-full overflow-hidden bg-gray-900 bg-left-bottom bg-cover rounded-sm bg-opacity-90\\"\\n\\t\\t\\t\\t\\t\\t\\tsrc=\\"https://images.unsplash.com/photo-1565895405138-6c3a1555da6a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OTN8fGRpc2hlc3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60\\"\\n\\t\\t\\t\\t\\t\\t\\talt=\\"drinks\\"\\n\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t<div class=\\"absolute z-40 p-3 duration-300 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 opacity-0 bg-opacity-30 hover:opacity-100 top-1/2 left-1/2\\">\\n                        <h2 class=\\"z-50 text-4xl font-extrabold opacity-100 tomato\\">Jangle Rice</h2>\\n\\t\\t\\t\\t\\t    <p class=\\"z-50 p-2 text-2xl font-extrabold text-gray-100\\">\\n\\t\\t\\t\\t\\t\\t$12.34\\n\\t\\t\\t\\t\\t\\t\\n\\t\\t\\t\\t\\t</p>\\n                    </div>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t<div class=\\"relative flex flex-col items-center justify-center p-4 bg-white\\">\\n\\t\\t\\t\\t\\t<div class=\\"flex items-center justify-center py-8\\">\\n\\t\\t\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"object-cover object-center w-full overflow-hidden bg-gray-900 bg-cover rounded-sm bg-opacity-10 \\"\\n\\t\\t\\t\\t\\t\\t\\tsrc=\\"https://images.unsplash.com/photo-1608684363982-d2d470f0b4bc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80\\"\\n\\t\\t\\t\\t\\t\\t\\talt=\\"drinks\\"\\n\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t<div class=\\"absolute z-50 p-3 duration-300 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 opacity-0 bg-opacity-30 hover:opacity-100 top-1/2 left-1/2\\">\\n                        <h2 class=\\"text-3xl font-black text-left tomato z-60\\">Chicken Soup</h2>\\n\\t\\t\\t\\t\\t    <p class=\\"p-2 text-2xl font-black text-gray-100 z-60\\">\\n\\t\\t\\t\\t\\t\\t$14.43\\n\\t\\t\\t\\t\\t\\t\\n\\t\\t\\t\\t\\t</p>\\n                    </div>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t</div>\\n</main>\\n\\n<style>.tomato{color:tomato}</style>\\n"],"names":[],"mappings":"AA2DO,sBAAO,CAAC,MAAM,MAAM,CAAC"}'
};
var Special = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$2);
  return `<main><div class="${"py-24 text-white bg-white"}"><h2 class="${"text-4xl font-bold text-center text-gray-500 lg:text-5xl"}">Special Menu</h2>
		<div class="${"flex items-center justify-center lg:mx-14"}"><div class="${"grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3"}"><div class="${"relative flex flex-col items-center justify-center p-4 bg-white"}"><div class="${"flex items-center justify-center py-8"}"><img class="${"object-cover object-center w-full overflow-hidden bg-gray-900 bg-cover rounded-sm bg-opacity-10 "}" src="${"https://images.unsplash.com/photo-1606898425083-0e6915bf7870?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1061&q=80"}" alt="${"drinks"}"></div>
					<div class="${"absolute p-3 duration-300 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 opacity-0 bg-opacity-30 hover:opacity-100 z-60 top-1/2 left-1/2"}"><h2 class="${"text-3xl font-black tomato z-60 svelte-1f9ne4u"}">Burger King</h2>
					    <p class="${"p-2 text-2xl font-black text-white z-60"}">$54.56
						
					</p></div></div>
				<div class="${"relative z-0 flex flex-col items-center justify-center p-4 bg-white"}"><div class="${"flex items-center justify-center py-8"}"><img class="${"z-0 w-full overflow-hidden bg-gray-900 bg-left-bottom bg-cover rounded-sm bg-opacity-90"}" src="${"https://images.unsplash.com/photo-1565895405138-6c3a1555da6a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OTN8fGRpc2hlc3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60"}" alt="${"drinks"}"></div>
					<div class="${"absolute z-40 p-3 duration-300 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 opacity-0 bg-opacity-30 hover:opacity-100 top-1/2 left-1/2"}"><h2 class="${"z-50 text-4xl font-extrabold opacity-100 tomato svelte-1f9ne4u"}">Jangle Rice</h2>
					    <p class="${"z-50 p-2 text-2xl font-extrabold text-gray-100"}">$12.34
						
					</p></div></div>
				<div class="${"relative flex flex-col items-center justify-center p-4 bg-white"}"><div class="${"flex items-center justify-center py-8"}"><img class="${"object-cover object-center w-full overflow-hidden bg-gray-900 bg-cover rounded-sm bg-opacity-10 "}" src="${"https://images.unsplash.com/photo-1608684363982-d2d470f0b4bc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80"}" alt="${"drinks"}"></div>
					<div class="${"absolute z-50 p-3 duration-300 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 opacity-0 bg-opacity-30 hover:opacity-100 top-1/2 left-1/2"}"><h2 class="${"text-3xl font-black text-left tomato z-60 svelte-1f9ne4u"}">Chicken Soup</h2>
					    <p class="${"p-2 text-2xl font-black text-gray-100 z-60"}">$14.43
						
					</p></div></div></div></div></div>
</main>`;
});
var Swiper = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<section class="${"text-gray-600 body-font"}"><div class="${"container px-5 py-24 mx-auto"}"><h2 class="${"pb-12 text-4xl font-bold text-center text-gray-500 lg:text-5xl"}">What our Customers Say</h2>
   
    <div class="${"flex flex-wrap -m-4"}"><div class="${"lg:w-1/3 lg:mb-0 mb-6 p-4"}"><div class="${"h-full text-center"}"><img alt="${"testimonial"}" class="${"w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200 bg-gray-100"}" src="${"https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"}">
          <p class="${"leading-relaxed"}">I love your food soo much. Its yummy. Especially the Jangle Rice</p>
          <span class="${"inline-block h-1 w-10 rounded bg-red-400 mt-6 mb-4"}"></span>
          <h2 class="${"text-gray-900 font-medium title-font tracking-wider text-sm"}">Holden Causfield</h2>
          <p class="${"text-gray-500"}">Business Woman</p></div></div>
      <div class="${"lg:w-1/3 lg:mb-0 mb-6 p-4"}"><div class="${"h-full text-center"}"><img alt="${"testimonial"}" class="${"w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200 bg-gray-100"}" src="${"https://images.unsplash.com/photo-1554126807-6b10f6f6692a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"}">
          <p class="${"leading-relaxed"}">I love your food soo much. Its yummy. Especially the Jangle Rice.</p>
          <span class="${"inline-block h-1 w-10 rounded bg-red-400 mt-6 mb-4"}"></span>
          <h2 class="${"text-gray-900 font-medium title-font capitalize tracking-wider text-sm"}">Alper Kamu</h2>
          <p class="${"text-gray-500"}">Lawyer</p></div></div>
      <div class="${"lg:w-1/3 lg:mb-0 p-4"}"><div class="${"h-full text-center"}"><img alt="${"testimonial"}" class="${"w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200 bg-gray-100"}" src="${"https://images.unsplash.com/photo-1545912452-8aea7e25a3d3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"}">
          <p class="${"leading-relaxed"}">This is soo good. I love your food soo much. Its yummy.</p>
          <span class="${"inline-block h-1 w-10 rounded bg-red-400 mt-6 mb-4"}"></span>
          <h2 class="${"text-gray-900 font-medium title-font tracking-wider text-sm"}">Henry Letham</h2>
          <p class="${"text-gray-500"}">Teacher</p></div></div></div></div></section>`;
});
var css$1 = {
  code: ".tomato.svelte-1f9ne4u{color:tomato}",
  map: '{"version":3,"file":"Menu.svelte","sources":["Menu.svelte"],"sourcesContent":["<section class=\\"py-24 text-white bg-gray-100\\">\\n    <h2 class=\\"pb-8 text-4xl font-bold text-center text-gray-500 lg:text-5xl\\">Menu</h2>\\n\\t<div class=\\"flex items-center justify-center\\">\\n\\t\\t<div class=\\"grid grid-cols-1 mx-5 md:grid-cols-2 lg:grid-cols-4 lg:mx-14 gap-y-2\\">\\n\\t\\t\\t<div class=\\"flex flex-col justify-center bg-white\\">\\n\\t\\t\\t\\t<h2 class=\\"p-2 font-mono text-2xl text-gray-400 lg:text-3xl\\">Grilled Caesar salad</h2>\\n\\t\\t\\t\\t<p class=\\"p-3 text-lg font-bold text-gray-400\\">\\n\\t\\t\\t\\t\\tLorem ipsum dolor sit amet consectetur adipisicing elit. Architecto illo delectus...\\n\\t\\t\\t\\t</p>\\n\\t\\t\\t\\t<span class=\\"p-3 text-2xl font-extrabold tomato\\">$14.54</span>\\n\\t\\t\\t</div>\\n\\t\\t\\t<div>\\n\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\talt=\\"food\\"\\n\\t\\t\\t\\t\\tsrc=\\"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8Zm9vZHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60\\"\\n\\t\\t\\t\\t\\tclass=\\"object-cover object-center w-full h-64 overflow-hidden\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t</div>\\n\\t\\t\\t<div class=\\"flex flex-col justify-center bg-white \\">\\n\\t\\t\\t\\t<h2 class=\\"p-3 font-mono text-2xl text-gray-400 lg:text-3xl\\">Golden Spagetti</h2>\\n\\t\\t\\t\\t<p class=\\"p-3 text-lg font-bold text-gray-400\\">\\n\\t\\t\\t\\t\\tLorem ipsum dolor sit amet consectetur adipisicing elit. Architecto illo delectus...\\n\\t\\t\\t\\t</p>\\n\\t\\t\\t\\t<span class=\\"p-3 text-2xl font-extrabold tomato\\">$19.99</span>\\n\\t\\t\\t</div>\\n\\t\\t\\t<div>\\n\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\talt=\\"food\\"\\n\\t\\t\\t\\t\\tsrc=\\"https://images.unsplash.com/photo-1481931098730-318b6f776db0?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=637&q=80\\"\\n\\t\\t\\t\\t\\tclass=\\"object-cover object-center w-full h-64 overflow-hidden rounded-sm\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t</div>\\n            <div>\\n\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\talt=\\"food\\"\\n\\t\\t\\t\\t\\tsrc=\\"https://images.unsplash.com/photo-1548943487-a2e4e43b4853?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NzB8fGZvb2R8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60\\"\\n\\t\\t\\t\\t\\tclass=\\"object-cover object-center w-full h-64 overflow-hidden rounded-sm bg-middle\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t</div>\\n            <div class=\\"flex flex-col justify-center bg-white \\">\\n\\t\\t\\t\\t<h2 class=\\"p-3 font-mono text-2xl text-gray-400 lg:text-3xl\\">Jangle Salad</h2>\\n\\t\\t\\t\\t<p class=\\"p-3 text-lg font-bold text-gray-400\\">\\n\\t\\t\\t\\t\\tLorem ipsum dolor sit amet consectetur adipisicing elit. Architecto illo delectus...\\n\\t\\t\\t\\t</p>\\n\\t\\t\\t\\t<span class=\\"p-3 text-2xl font-extrabold tomato\\">$43.00</span>\\n\\t\\t\\t</div>\\n\\t\\t\\t\\n            <div>\\n\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\talt=\\"food\\"\\n\\t\\t\\t\\t\\tsrc=\\"https://images.unsplash.com/photo-1460306855393-0410f61241c7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8ODZ8fGZvb2R8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=60\\"\\n\\t\\t\\t\\t\\tclass=\\"object-cover object-center w-full h-64 overflow-hidden rounded-sm\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t</div>\\n            <div class=\\"flex flex-col justify-center bg-white \\">\\n\\t\\t\\t\\t<h2 class=\\"p-3 font-mono text-2xl text-gray-400 lg:text-2xl\\">Jangle Chips</h2>\\n\\t\\t\\t\\t<p class=\\"p-3 text-lg font-bold text-gray-400\\">\\n\\t\\t\\t\\t\\tLorem ipsum dolor sit amet consectetur adipisicing elit. Architecto illo delectus...\\n\\t\\t\\t\\t</p>\\n\\t\\t\\t\\t<span class=\\"p-3 text-2xl font-extrabold tomato\\">$15.50</span>\\n\\t\\t\\t</div>\\n\\t\\t\\t\\n\\t\\t</div>\\n\\t</div>\\n</section>\\n<style>.tomato{color:tomato}</style>"],"names":[],"mappings":"AAiEO,sBAAO,CAAC,MAAM,MAAM,CAAC"}'
};
var Menu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return `<section class="${"py-24 text-white bg-gray-100"}"><h2 class="${"pb-8 text-4xl font-bold text-center text-gray-500 lg:text-5xl"}">Menu</h2>
	<div class="${"flex items-center justify-center"}"><div class="${"grid grid-cols-1 mx-5 md:grid-cols-2 lg:grid-cols-4 lg:mx-14 gap-y-2"}"><div class="${"flex flex-col justify-center bg-white"}"><h2 class="${"p-2 font-mono text-2xl text-gray-400 lg:text-3xl"}">Grilled Caesar salad</h2>
				<p class="${"p-3 text-lg font-bold text-gray-400"}">Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto illo delectus...
				</p>
				<span class="${"p-3 text-2xl font-extrabold tomato svelte-1f9ne4u"}">$14.54</span></div>
			<div><img alt="${"food"}" src="${"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8Zm9vZHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60"}" class="${"object-cover object-center w-full h-64 overflow-hidden"}"></div>
			<div class="${"flex flex-col justify-center bg-white "}"><h2 class="${"p-3 font-mono text-2xl text-gray-400 lg:text-3xl"}">Golden Spagetti</h2>
				<p class="${"p-3 text-lg font-bold text-gray-400"}">Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto illo delectus...
				</p>
				<span class="${"p-3 text-2xl font-extrabold tomato svelte-1f9ne4u"}">$19.99</span></div>
			<div><img alt="${"food"}" src="${"https://images.unsplash.com/photo-1481931098730-318b6f776db0?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=637&q=80"}" class="${"object-cover object-center w-full h-64 overflow-hidden rounded-sm"}"></div>
            <div><img alt="${"food"}" src="${"https://images.unsplash.com/photo-1548943487-a2e4e43b4853?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NzB8fGZvb2R8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60"}" class="${"object-cover object-center w-full h-64 overflow-hidden rounded-sm bg-middle"}"></div>
            <div class="${"flex flex-col justify-center bg-white "}"><h2 class="${"p-3 font-mono text-2xl text-gray-400 lg:text-3xl"}">Jangle Salad</h2>
				<p class="${"p-3 text-lg font-bold text-gray-400"}">Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto illo delectus...
				</p>
				<span class="${"p-3 text-2xl font-extrabold tomato svelte-1f9ne4u"}">$43.00</span></div>
			
            <div><img alt="${"food"}" src="${"https://images.unsplash.com/photo-1460306855393-0410f61241c7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8ODZ8fGZvb2R8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=60"}" class="${"object-cover object-center w-full h-64 overflow-hidden rounded-sm"}"></div>
            <div class="${"flex flex-col justify-center bg-white "}"><h2 class="${"p-3 font-mono text-2xl text-gray-400 lg:text-2xl"}">Jangle Chips</h2>
				<p class="${"p-3 text-lg font-bold text-gray-400"}">Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto illo delectus...
				</p>
				<span class="${"p-3 text-2xl font-extrabold tomato svelte-1f9ne4u"}">$15.50</span></div></div></div>
</section>`;
});
var css = {
  code: ".tomato.svelte-48s0js{color:tomato}.tomato-bg.svelte-48s0js{background-color:tomato}",
  map: '{"version":3,"file":"Blog.svelte","sources":["Blog.svelte"],"sourcesContent":["<section class=\\"py-24 text-white bg-gray-100\\">\\n    <h2 class=\\"pb-8 text-4xl font-bold text-center text-gray-500 lg:text-5xl\\">Blog</h2>\\n    <div class=\\"grid grid-cols-1 gap-4 mx-5 lg:grid-cols-2 lg:mx-14\\">\\n        <div class=\\"flex flex-col p-2 bg-white lg:flex-row\\">\\n            <img class=\\"object-cover object-center w-full lg:w-1/2\\" src=\\"https://images.unsplash.com/photo-1604909052743-94e838986d24?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDl8fGJlZWYlMjBzYXVjZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60\\" alt=\\"\\">\\n            <div class=\\"flex flex-col px-4 py-4\\">\\n                <h2 class=\\"font-mono text-2xl text-gray-500 lg:text-3xl\\">How to cook beef steak with sauce</h2>\\n                <div class=\\"flex py-2 text-gray-400\\">\\n                    <img class=\\"object-center w-6 overflow-hidden bg-cover tomato\\" src=\\"img/calendar.png\\" alt=\\"calender\\">\\n                    <p class=\\"px-2 font-bold\\">April 22, 2018</p>\\n                </div>\\n                <p class=\\"py-3 text-lg font-extrabold text-gray-400\\">Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto illo delectus...</p>\\n                <button class=\\"p-2 font-bold text-white bg-red-400 hover:bg-red-300\\">Read More</button>\\n            </div>\\n        </div>\\n        <div class=\\"flex flex-col p-2 bg-white lg:flex-row\\">\\n            <img class=\\"object-cover object-center lg:w-1/2\\" src=\\"https://images.unsplash.com/photo-1625937759420-26d7e003e04c?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lYXQlMjBiYWxsc3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60\\" alt=\\"\\">\\n            <div class=\\"flex flex-col p-4\\">\\n                <h2 class=\\"font-mono text-2xl text-gray-500 lg:text-3xl\\">How to cook meat balls with sauce</h2>\\n                <div class=\\"flex py-2 text-gray-400\\">\\n                    <img class=\\"object-center w-6 overflow-hidden bg-cover tomato\\" src=\\"img/calendar.png\\" alt=\\"calender\\">\\n                    <p class=\\"px-2 font-bold\\">April 01, 2018</p>\\n                </div>\\n                <p class=\\"py-3 text-lg font-extrabold text-gray-400\\">Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto illo delectus...</p>\\n                <button class=\\"p-2 font-bold text-white bg-red-400 hover:bg-red-300\\">Read More</button>\\n            </div>\\n        </div>\\n    </div>\\n</section>\\n<section class=\\"px-4 bg-white py-14\\">\\n    <div class=\\"items-center justify-center w-full \\">\\n        <h2 class=\\"p-3 text-2xl font-extrabold text-left text-gray-500 lg:text-3xl lg:text-center\\">Subsribe Newsletter</h2>\\n         <p class=\\"w-full px-2 ml-auto mr-auto text-lg font-bold text-left text-gray-400 lg:w-1/2\\">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore ex temporibus magni ipsam inventore dolorum sunt, amet dolorum vel.</p>\\n         <div class=\\"flex w-full px-2 py-4 ml-auto mr-auto lg:w-2/6\\">\\n             <input class=\\"w-full px-2 text-gray-400 placeholder-current bg-white lg:mx-4 focus:outline-none hover:ring-2 ring-2 ring-red-400\\" placeholder=\\"Enter your email\\"type=\\"email\\"/>\\n             <button class=\\"p-3 font-extrabold text-white tomato-bg\\">Subscribe</button>\\n         </div>\\n        </div>\\n</section>\\n<style>.tomato{color:tomato}.tomato-bg{background-color:tomato}</style>"],"names":[],"mappings":"AAuCO,qBAAO,CAAC,MAAM,MAAM,CAAC,wBAAU,CAAC,iBAAiB,MAAM,CAAC"}'
};
var Blog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<section class="${"py-24 text-white bg-gray-100"}"><h2 class="${"pb-8 text-4xl font-bold text-center text-gray-500 lg:text-5xl"}">Blog</h2>
    <div class="${"grid grid-cols-1 gap-4 mx-5 lg:grid-cols-2 lg:mx-14"}"><div class="${"flex flex-col p-2 bg-white lg:flex-row"}"><img class="${"object-cover object-center w-full lg:w-1/2"}" src="${"https://images.unsplash.com/photo-1604909052743-94e838986d24?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDl8fGJlZWYlMjBzYXVjZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60"}" alt="${""}">
            <div class="${"flex flex-col px-4 py-4"}"><h2 class="${"font-mono text-2xl text-gray-500 lg:text-3xl"}">How to cook beef steak with sauce</h2>
                <div class="${"flex py-2 text-gray-400"}"><img class="${"object-center w-6 overflow-hidden bg-cover tomato svelte-48s0js"}" src="${"img/calendar.png"}" alt="${"calender"}">
                    <p class="${"px-2 font-bold"}">April 22, 2018</p></div>
                <p class="${"py-3 text-lg font-extrabold text-gray-400"}">Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto illo delectus...</p>
                <button class="${"p-2 font-bold text-white bg-red-400 hover:bg-red-300"}">Read More</button></div></div>
        <div class="${"flex flex-col p-2 bg-white lg:flex-row"}"><img class="${"object-cover object-center lg:w-1/2"}" src="${"https://images.unsplash.com/photo-1625937759420-26d7e003e04c?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lYXQlMjBiYWxsc3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60"}" alt="${""}">
            <div class="${"flex flex-col p-4"}"><h2 class="${"font-mono text-2xl text-gray-500 lg:text-3xl"}">How to cook meat balls with sauce</h2>
                <div class="${"flex py-2 text-gray-400"}"><img class="${"object-center w-6 overflow-hidden bg-cover tomato svelte-48s0js"}" src="${"img/calendar.png"}" alt="${"calender"}">
                    <p class="${"px-2 font-bold"}">April 01, 2018</p></div>
                <p class="${"py-3 text-lg font-extrabold text-gray-400"}">Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto illo delectus...</p>
                <button class="${"p-2 font-bold text-white bg-red-400 hover:bg-red-300"}">Read More</button></div></div></div></section>
<section class="${"px-4 bg-white py-14"}"><div class="${"items-center justify-center w-full "}"><h2 class="${"p-3 text-2xl font-extrabold text-left text-gray-500 lg:text-3xl lg:text-center"}">Subsribe Newsletter</h2>
         <p class="${"w-full px-2 ml-auto mr-auto text-lg font-bold text-left text-gray-400 lg:w-1/2"}">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore ex temporibus magni ipsam inventore dolorum sunt, amet dolorum vel.</p>
         <div class="${"flex w-full px-2 py-4 ml-auto mr-auto lg:w-2/6"}"><input class="${"w-full px-2 text-gray-400 placeholder-current bg-white lg:mx-4 focus:outline-none hover:ring-2 ring-2 ring-red-400"}" placeholder="${"Enter your email"}" type="${"email"}">
             <button class="${"p-3 font-extrabold text-white tomato-bg svelte-48s0js"}">Subscribe</button></div></div>
</section>`;
});
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<section>${validate_component(Banner, "Banner").$$render($$result, {}, {}, {})}</section>
<section id="${"feature"}">${validate_component(Feature, "Feature").$$render($$result, {}, {}, {})}</section>
<section id="${"special"}">${validate_component(Special, "Special").$$render($$result, {}, {}, {})}</section>
<section id="${"menu"}">${validate_component(Menu, "Menu").$$render($$result, {}, {}, {})}</section>
<section id="${"testimonials"}">${validate_component(Swiper, "Swiper").$$render($$result, {}, {}, {})}</section>
<section id="${"blog"}">${validate_component(Blog, "Blog").$$render($$result, {}, {}, {})}</section>`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes
});

// .svelte-kit/vercel/entry.js
init();
var entry_default = async (req, res) => {
  const { pathname, searchParams } = new URL(req.url || "", "http://localhost");
  let body;
  try {
    body = await getRawBody(req);
  } catch (err) {
    res.statusCode = err.status || 400;
    return res.end(err.reason || "Invalid request body");
  }
  const rendered = await render({
    method: req.method,
    headers: req.headers,
    path: pathname,
    query: searchParams,
    rawBody: body
  });
  if (rendered) {
    const { status, headers, body: body2 } = rendered;
    return res.writeHead(status, headers).end(body2);
  }
  return res.writeHead(404).end();
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
