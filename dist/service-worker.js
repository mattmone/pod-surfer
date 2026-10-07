// node_modules/workbox-precaching/_version.js
try {
  self["workbox:precaching:5.1.4"] && _();
} catch (e) {
}

// node_modules/workbox-precaching/utils/precachePlugins.js
var plugins = [];
var precachePlugins = {
  /*
   * @return {Array}
   * @private
   */
  get() {
    return plugins;
  },
  /*
   * @param {Array} newPlugins
   * @private
   */
  add(newPlugins) {
    plugins.push(...newPlugins);
  }
};

// node_modules/workbox-precaching/node_modules/workbox-core/_version.js
try {
  self["workbox:core:5.1.4"] && _();
} catch (e) {
}

// node_modules/workbox-precaching/node_modules/workbox-core/_private/cacheNames.js
var _cacheNameDetails = {
  googleAnalytics: "googleAnalytics",
  precache: "precache-v2",
  prefix: "workbox",
  runtime: "runtime",
  suffix: typeof registration !== "undefined" ? registration.scope : ""
};
var _createCacheName = (cacheName) => {
  return [_cacheNameDetails.prefix, cacheName, _cacheNameDetails.suffix].filter((value) => value && value.length > 0).join("-");
};
var eachCacheNameDetail = (fn) => {
  for (const key of Object.keys(_cacheNameDetails)) {
    fn(key);
  }
};
var cacheNames = {
  updateDetails: (details) => {
    eachCacheNameDetail((key) => {
      if (typeof details[key] === "string") {
        _cacheNameDetails[key] = details[key];
      }
    });
  },
  getGoogleAnalyticsName: (userCacheName) => {
    return userCacheName || _createCacheName(_cacheNameDetails.googleAnalytics);
  },
  getPrecacheName: (userCacheName) => {
    return userCacheName || _createCacheName(_cacheNameDetails.precache);
  },
  getPrefix: () => {
    return _cacheNameDetails.prefix;
  },
  getRuntimeName: (userCacheName) => {
    return userCacheName || _createCacheName(_cacheNameDetails.runtime);
  },
  getSuffix: () => {
    return _cacheNameDetails.suffix;
  }
};

// node_modules/workbox-precaching/node_modules/workbox-core/_private/getFriendlyURL.js
var getFriendlyURL = (url) => {
  const urlObj = new URL(String(url), location.href);
  return urlObj.href.replace(new RegExp(`^${location.origin}`), "");
};

// node_modules/workbox-precaching/node_modules/workbox-core/_private/logger.js
var logger = false ? null : (() => {
  if (!("__WB_DISABLE_DEV_LOGS" in self)) {
    self.__WB_DISABLE_DEV_LOGS = false;
  }
  let inGroup = false;
  const methodToColorMap = {
    debug: `#7f8c8d`,
    log: `#2ecc71`,
    warn: `#f39c12`,
    error: `#c0392b`,
    groupCollapsed: `#3498db`,
    groupEnd: null
  };
  const print = function(method, args) {
    if (self.__WB_DISABLE_DEV_LOGS) {
      return;
    }
    if (method === "groupCollapsed") {
      if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        console[method](...args);
        return;
      }
    }
    const styles = [
      `background: ${methodToColorMap[method]}`,
      `border-radius: 0.5em`,
      `color: white`,
      `font-weight: bold`,
      `padding: 2px 0.5em`
    ];
    const logPrefix = inGroup ? [] : ["%cworkbox", styles.join(";")];
    console[method](...logPrefix, ...args);
    if (method === "groupCollapsed") {
      inGroup = true;
    }
    if (method === "groupEnd") {
      inGroup = false;
    }
  };
  const api = {};
  const loggerMethods = Object.keys(methodToColorMap);
  for (const key of loggerMethods) {
    const method = key;
    api[method] = (...args) => {
      print(method, args);
    };
  }
  return api;
})();

// node_modules/workbox-precaching/node_modules/workbox-core/models/messages/messages.js
var messages = {
  "invalid-value": ({ paramName, validValueDescription, value }) => {
    if (!paramName || !validValueDescription) {
      throw new Error(`Unexpected input to 'invalid-value' error.`);
    }
    return `The '${paramName}' parameter was given a value with an unexpected value. ${validValueDescription} Received a value of ${JSON.stringify(value)}.`;
  },
  "not-an-array": ({ moduleName, className, funcName, paramName }) => {
    if (!moduleName || !className || !funcName || !paramName) {
      throw new Error(`Unexpected input to 'not-an-array' error.`);
    }
    return `The parameter '${paramName}' passed into '${moduleName}.${className}.${funcName}()' must be an array.`;
  },
  "incorrect-type": ({ expectedType, paramName, moduleName, className, funcName }) => {
    if (!expectedType || !paramName || !moduleName || !funcName) {
      throw new Error(`Unexpected input to 'incorrect-type' error.`);
    }
    return `The parameter '${paramName}' passed into '${moduleName}.${className ? className + "." : ""}${funcName}()' must be of type ${expectedType}.`;
  },
  "incorrect-class": ({ expectedClass, paramName, moduleName, className, funcName, isReturnValueProblem }) => {
    if (!expectedClass || !moduleName || !funcName) {
      throw new Error(`Unexpected input to 'incorrect-class' error.`);
    }
    if (isReturnValueProblem) {
      return `The return value from '${moduleName}.${className ? className + "." : ""}${funcName}()' must be an instance of class ${expectedClass.name}.`;
    }
    return `The parameter '${paramName}' passed into '${moduleName}.${className ? className + "." : ""}${funcName}()' must be an instance of class ${expectedClass.name}.`;
  },
  "missing-a-method": ({ expectedMethod, paramName, moduleName, className, funcName }) => {
    if (!expectedMethod || !paramName || !moduleName || !className || !funcName) {
      throw new Error(`Unexpected input to 'missing-a-method' error.`);
    }
    return `${moduleName}.${className}.${funcName}() expected the '${paramName}' parameter to expose a '${expectedMethod}' method.`;
  },
  "add-to-cache-list-unexpected-type": ({ entry }) => {
    return `An unexpected entry was passed to 'workbox-precaching.PrecacheController.addToCacheList()' The entry '${JSON.stringify(entry)}' isn't supported. You must supply an array of strings with one or more characters, objects with a url property or Request objects.`;
  },
  "add-to-cache-list-conflicting-entries": ({ firstEntry, secondEntry }) => {
    if (!firstEntry || !secondEntry) {
      throw new Error(`Unexpected input to 'add-to-cache-list-duplicate-entries' error.`);
    }
    return `Two of the entries passed to 'workbox-precaching.PrecacheController.addToCacheList()' had the URL ${firstEntry._entryId} but different revision details. Workbox is unable to cache and version the asset correctly. Please remove one of the entries.`;
  },
  "plugin-error-request-will-fetch": ({ thrownError }) => {
    if (!thrownError) {
      throw new Error(`Unexpected input to 'plugin-error-request-will-fetch', error.`);
    }
    return `An error was thrown by a plugins 'requestWillFetch()' method. The thrown error message was: '${thrownError.message}'.`;
  },
  "invalid-cache-name": ({ cacheNameId, value }) => {
    if (!cacheNameId) {
      throw new Error(`Expected a 'cacheNameId' for error 'invalid-cache-name'`);
    }
    return `You must provide a name containing at least one character for setCacheDetails({${cacheNameId}: '...'}). Received a value of '${JSON.stringify(value)}'`;
  },
  "unregister-route-but-not-found-with-method": ({ method }) => {
    if (!method) {
      throw new Error(`Unexpected input to 'unregister-route-but-not-found-with-method' error.`);
    }
    return `The route you're trying to unregister was not  previously registered for the method type '${method}'.`;
  },
  "unregister-route-route-not-registered": () => {
    return `The route you're trying to unregister was not previously registered.`;
  },
  "queue-replay-failed": ({ name }) => {
    return `Replaying the background sync queue '${name}' failed.`;
  },
  "duplicate-queue-name": ({ name }) => {
    return `The Queue name '${name}' is already being used. All instances of backgroundSync.Queue must be given unique names.`;
  },
  "expired-test-without-max-age": ({ methodName, paramName }) => {
    return `The '${methodName}()' method can only be used when the '${paramName}' is used in the constructor.`;
  },
  "unsupported-route-type": ({ moduleName, className, funcName, paramName }) => {
    return `The supplied '${paramName}' parameter was an unsupported type. Please check the docs for ${moduleName}.${className}.${funcName} for valid input types.`;
  },
  "not-array-of-class": ({ value, expectedClass, moduleName, className, funcName, paramName }) => {
    return `The supplied '${paramName}' parameter must be an array of '${expectedClass}' objects. Received '${JSON.stringify(value)},'. Please check the call to ${moduleName}.${className}.${funcName}() to fix the issue.`;
  },
  "max-entries-or-age-required": ({ moduleName, className, funcName }) => {
    return `You must define either config.maxEntries or config.maxAgeSecondsin ${moduleName}.${className}.${funcName}`;
  },
  "statuses-or-headers-required": ({ moduleName, className, funcName }) => {
    return `You must define either config.statuses or config.headersin ${moduleName}.${className}.${funcName}`;
  },
  "invalid-string": ({ moduleName, funcName, paramName }) => {
    if (!paramName || !moduleName || !funcName) {
      throw new Error(`Unexpected input to 'invalid-string' error.`);
    }
    return `When using strings, the '${paramName}' parameter must start with 'http' (for cross-origin matches) or '/' (for same-origin matches). Please see the docs for ${moduleName}.${funcName}() for more info.`;
  },
  "channel-name-required": () => {
    return `You must provide a channelName to construct a BroadcastCacheUpdate instance.`;
  },
  "invalid-responses-are-same-args": () => {
    return `The arguments passed into responsesAreSame() appear to be invalid. Please ensure valid Responses are used.`;
  },
  "expire-custom-caches-only": () => {
    return `You must provide a 'cacheName' property when using the expiration plugin with a runtime caching strategy.`;
  },
  "unit-must-be-bytes": ({ normalizedRangeHeader }) => {
    if (!normalizedRangeHeader) {
      throw new Error(`Unexpected input to 'unit-must-be-bytes' error.`);
    }
    return `The 'unit' portion of the Range header must be set to 'bytes'. The Range header provided was "${normalizedRangeHeader}"`;
  },
  "single-range-only": ({ normalizedRangeHeader }) => {
    if (!normalizedRangeHeader) {
      throw new Error(`Unexpected input to 'single-range-only' error.`);
    }
    return `Multiple ranges are not supported. Please use a  single start value, and optional end value. The Range header provided was "${normalizedRangeHeader}"`;
  },
  "invalid-range-values": ({ normalizedRangeHeader }) => {
    if (!normalizedRangeHeader) {
      throw new Error(`Unexpected input to 'invalid-range-values' error.`);
    }
    return `The Range header is missing both start and end values. At least one of those values is needed. The Range header provided was "${normalizedRangeHeader}"`;
  },
  "no-range-header": () => {
    return `No Range header was found in the Request provided.`;
  },
  "range-not-satisfiable": ({ size, start, end }) => {
    return `The start (${start}) and end (${end}) values in the Range are not satisfiable by the cached response, which is ${size} bytes.`;
  },
  "attempt-to-cache-non-get-request": ({ url, method }) => {
    return `Unable to cache '${url}' because it is a '${method}' request and only 'GET' requests can be cached.`;
  },
  "cache-put-with-no-response": ({ url }) => {
    return `There was an attempt to cache '${url}' but the response was not defined.`;
  },
  "no-response": ({ url, error }) => {
    let message = `The strategy could not generate a response for '${url}'.`;
    if (error) {
      message += ` The underlying error is ${error}.`;
    }
    return message;
  },
  "bad-precaching-response": ({ url, status }) => {
    return `The precaching request for '${url}' failed with an HTTP status of ${status}.`;
  },
  "non-precached-url": ({ url }) => {
    return `createHandlerBoundToURL('${url}') was called, but that URL is not precached. Please pass in a URL that is precached instead.`;
  },
  "add-to-cache-list-conflicting-integrities": ({ url }) => {
    return `Two of the entries passed to 'workbox-precaching.PrecacheController.addToCacheList()' had the URL ${url} with different integrity values. Please remove one of them.`;
  },
  "missing-precache-entry": ({ cacheName, url }) => {
    return `Unable to find a precached response in ${cacheName} for ${url}.`;
  }
};

// node_modules/workbox-precaching/node_modules/workbox-core/models/messages/messageGenerator.js
var generatorFunction = (code, details = {}) => {
  const message = messages[code];
  if (!message) {
    throw new Error(`Unable to find message for code '${code}'.`);
  }
  return message(details);
};
var messageGenerator = false ? fallback : generatorFunction;

// node_modules/workbox-precaching/node_modules/workbox-core/_private/WorkboxError.js
var WorkboxError = class extends Error {
  /**
   *
   * @param {string} errorCode The error code that
   * identifies this particular error.
   * @param {Object=} details Any relevant arguments
   * that will help developers identify issues should
   * be added as a key on the context object.
   */
  constructor(errorCode, details) {
    const message = messageGenerator(errorCode, details);
    super(message);
    this.name = errorCode;
    this.details = details;
  }
};

// node_modules/workbox-precaching/node_modules/workbox-core/_private/assert.js
var isArray = (value, details) => {
  if (!Array.isArray(value)) {
    throw new WorkboxError("not-an-array", details);
  }
};
var hasMethod = (object, expectedMethod, details) => {
  const type = typeof object[expectedMethod];
  if (type !== "function") {
    details["expectedMethod"] = expectedMethod;
    throw new WorkboxError("missing-a-method", details);
  }
};
var isType = (object, expectedType, details) => {
  if (typeof object !== expectedType) {
    details["expectedType"] = expectedType;
    throw new WorkboxError("incorrect-type", details);
  }
};
var isInstance = (object, expectedClass, details) => {
  if (!(object instanceof expectedClass)) {
    details["expectedClass"] = expectedClass;
    throw new WorkboxError("incorrect-class", details);
  }
};
var isOneOf = (value, validValues, details) => {
  if (!validValues.includes(value)) {
    details["validValueDescription"] = `Valid values are ${JSON.stringify(validValues)}.`;
    throw new WorkboxError("invalid-value", details);
  }
};
var isArrayOfClass = (value, expectedClass, details) => {
  const error = new WorkboxError("not-array-of-class", details);
  if (!Array.isArray(value)) {
    throw error;
  }
  for (const item of value) {
    if (!(item instanceof expectedClass)) {
      throw error;
    }
  }
};
var finalAssertExports = false ? null : {
  hasMethod,
  isArray,
  isInstance,
  isOneOf,
  isType,
  isArrayOfClass
};

// node_modules/workbox-precaching/node_modules/workbox-core/models/quotaErrorCallbacks.js
var quotaErrorCallbacks = /* @__PURE__ */ new Set();

// node_modules/workbox-precaching/node_modules/workbox-core/_private/executeQuotaErrorCallbacks.js
async function executeQuotaErrorCallbacks() {
  if (true) {
    logger.log(`About to run ${quotaErrorCallbacks.size} callbacks to clean up caches.`);
  }
  for (const callback of quotaErrorCallbacks) {
    await callback();
    if (true) {
      logger.log(callback, "is complete.");
    }
  }
  if (true) {
    logger.log("Finished running callbacks.");
  }
}

// node_modules/workbox-precaching/node_modules/workbox-core/utils/pluginUtils.js
var pluginUtils = {
  filter: (plugins2, callbackName) => {
    return plugins2.filter((plugin) => callbackName in plugin);
  }
};

// node_modules/workbox-precaching/node_modules/workbox-core/_private/cacheWrapper.js
var _getEffectiveRequest = async ({ request, mode, plugins: plugins2 = [] }) => {
  const cacheKeyWillBeUsedPlugins = pluginUtils.filter(
    plugins2,
    "cacheKeyWillBeUsed"
    /* CACHE_KEY_WILL_BE_USED */
  );
  let effectiveRequest = request;
  for (const plugin of cacheKeyWillBeUsedPlugins) {
    effectiveRequest = await plugin[
      "cacheKeyWillBeUsed"
      /* CACHE_KEY_WILL_BE_USED */
    ].call(plugin, { mode, request: effectiveRequest });
    if (typeof effectiveRequest === "string") {
      effectiveRequest = new Request(effectiveRequest);
    }
    if (true) {
      finalAssertExports.isInstance(effectiveRequest, Request, {
        moduleName: "Plugin",
        funcName: "cacheKeyWillBeUsed",
        isReturnValueProblem: true
      });
    }
  }
  return effectiveRequest;
};
var _isResponseSafeToCache = async ({ request, response, event, plugins: plugins2 = [] }) => {
  let responseToCache = response;
  let pluginsUsed = false;
  for (const plugin of plugins2) {
    if ("cacheWillUpdate" in plugin) {
      pluginsUsed = true;
      const pluginMethod = plugin[
        "cacheWillUpdate"
        /* CACHE_WILL_UPDATE */
      ];
      responseToCache = await pluginMethod.call(plugin, {
        request,
        response: responseToCache,
        event
      });
      if (true) {
        if (responseToCache) {
          finalAssertExports.isInstance(responseToCache, Response, {
            moduleName: "Plugin",
            funcName: "cacheWillUpdate",
            isReturnValueProblem: true
          });
        }
      }
      if (!responseToCache) {
        break;
      }
    }
  }
  if (!pluginsUsed) {
    if (true) {
      if (responseToCache) {
        if (responseToCache.status !== 200) {
          if (responseToCache.status === 0) {
            logger.warn(`The response for '${request.url}' is an opaque response. The caching strategy that you're using will not cache opaque responses by default.`);
          } else {
            logger.debug(`The response for '${request.url}' returned a status code of '${response.status}' and won't be cached as a result.`);
          }
        }
      }
    }
    responseToCache = responseToCache && responseToCache.status === 200 ? responseToCache : void 0;
  }
  return responseToCache ? responseToCache : null;
};
var matchWrapper = async ({ cacheName, request, event, matchOptions, plugins: plugins2 = [] }) => {
  const cache = await self.caches.open(cacheName);
  const effectiveRequest = await _getEffectiveRequest({
    plugins: plugins2,
    request,
    mode: "read"
  });
  let cachedResponse = await cache.match(effectiveRequest, matchOptions);
  if (true) {
    if (cachedResponse) {
      logger.debug(`Found a cached response in '${cacheName}'.`);
    } else {
      logger.debug(`No cached response found in '${cacheName}'.`);
    }
  }
  for (const plugin of plugins2) {
    if ("cachedResponseWillBeUsed" in plugin) {
      const pluginMethod = plugin[
        "cachedResponseWillBeUsed"
        /* CACHED_RESPONSE_WILL_BE_USED */
      ];
      cachedResponse = await pluginMethod.call(plugin, {
        cacheName,
        event,
        matchOptions,
        cachedResponse,
        request: effectiveRequest
      });
      if (true) {
        if (cachedResponse) {
          finalAssertExports.isInstance(cachedResponse, Response, {
            moduleName: "Plugin",
            funcName: "cachedResponseWillBeUsed",
            isReturnValueProblem: true
          });
        }
      }
    }
  }
  return cachedResponse;
};
var putWrapper = async ({ cacheName, request, response, event, plugins: plugins2 = [], matchOptions }) => {
  if (true) {
    if (request.method && request.method !== "GET") {
      throw new WorkboxError("attempt-to-cache-non-get-request", {
        url: getFriendlyURL(request.url),
        method: request.method
      });
    }
  }
  const effectiveRequest = await _getEffectiveRequest({
    plugins: plugins2,
    request,
    mode: "write"
  });
  if (!response) {
    if (true) {
      logger.error(`Cannot cache non-existent response for '${getFriendlyURL(effectiveRequest.url)}'.`);
    }
    throw new WorkboxError("cache-put-with-no-response", {
      url: getFriendlyURL(effectiveRequest.url)
    });
  }
  const responseToCache = await _isResponseSafeToCache({
    event,
    plugins: plugins2,
    response,
    request: effectiveRequest
  });
  if (!responseToCache) {
    if (true) {
      logger.debug(`Response '${getFriendlyURL(effectiveRequest.url)}' will not be cached.`, responseToCache);
    }
    return;
  }
  const cache = await self.caches.open(cacheName);
  const updatePlugins = pluginUtils.filter(
    plugins2,
    "cacheDidUpdate"
    /* CACHE_DID_UPDATE */
  );
  const oldResponse = updatePlugins.length > 0 ? await matchWrapper({ cacheName, matchOptions, request: effectiveRequest }) : null;
  if (true) {
    logger.debug(`Updating the '${cacheName}' cache with a new Response for ${getFriendlyURL(effectiveRequest.url)}.`);
  }
  try {
    await cache.put(effectiveRequest, responseToCache);
  } catch (error) {
    if (error.name === "QuotaExceededError") {
      await executeQuotaErrorCallbacks();
    }
    throw error;
  }
  for (const plugin of updatePlugins) {
    await plugin[
      "cacheDidUpdate"
      /* CACHE_DID_UPDATE */
    ].call(plugin, {
      cacheName,
      event,
      oldResponse,
      newResponse: responseToCache,
      request: effectiveRequest
    });
  }
};
var cacheWrapper = {
  put: putWrapper,
  match: matchWrapper
};

// node_modules/workbox-precaching/node_modules/workbox-core/_private/fetchWrapper.js
var wrappedFetch = async ({ request, fetchOptions, event, plugins: plugins2 = [] }) => {
  if (typeof request === "string") {
    request = new Request(request);
  }
  if (event instanceof FetchEvent && event.preloadResponse) {
    const possiblePreloadResponse = await event.preloadResponse;
    if (possiblePreloadResponse) {
      if (true) {
        logger.log(`Using a preloaded navigation response for '${getFriendlyURL(request.url)}'`);
      }
      return possiblePreloadResponse;
    }
  }
  if (true) {
    finalAssertExports.isInstance(request, Request, {
      paramName: "request",
      expectedClass: Request,
      moduleName: "workbox-core",
      className: "fetchWrapper",
      funcName: "wrappedFetch"
    });
  }
  const failedFetchPlugins = pluginUtils.filter(
    plugins2,
    "fetchDidFail"
    /* FETCH_DID_FAIL */
  );
  const originalRequest = failedFetchPlugins.length > 0 ? request.clone() : null;
  try {
    for (const plugin of plugins2) {
      if ("requestWillFetch" in plugin) {
        const pluginMethod = plugin[
          "requestWillFetch"
          /* REQUEST_WILL_FETCH */
        ];
        const requestClone = request.clone();
        request = await pluginMethod.call(plugin, {
          request: requestClone,
          event
        });
        if (true) {
          if (request) {
            finalAssertExports.isInstance(request, Request, {
              moduleName: "Plugin",
              funcName: "cachedResponseWillBeUsed",
              isReturnValueProblem: true
            });
          }
        }
      }
    }
  } catch (err) {
    throw new WorkboxError("plugin-error-request-will-fetch", {
      thrownError: err
    });
  }
  const pluginFilteredRequest = request.clone();
  try {
    let fetchResponse;
    if (request.mode === "navigate") {
      fetchResponse = await fetch(request);
    } else {
      fetchResponse = await fetch(request, fetchOptions);
    }
    if (true) {
      logger.debug(`Network request for '${getFriendlyURL(request.url)}' returned a response with status '${fetchResponse.status}'.`);
    }
    for (const plugin of plugins2) {
      if ("fetchDidSucceed" in plugin) {
        fetchResponse = await plugin[
          "fetchDidSucceed"
          /* FETCH_DID_SUCCEED */
        ].call(plugin, {
          event,
          request: pluginFilteredRequest,
          response: fetchResponse
        });
        if (true) {
          if (fetchResponse) {
            finalAssertExports.isInstance(fetchResponse, Response, {
              moduleName: "Plugin",
              funcName: "fetchDidSucceed",
              isReturnValueProblem: true
            });
          }
        }
      }
    }
    return fetchResponse;
  } catch (error) {
    if (true) {
      logger.error(`Network request for '${getFriendlyURL(request.url)}' threw an error.`, error);
    }
    for (const plugin of failedFetchPlugins) {
      await plugin[
        "fetchDidFail"
        /* FETCH_DID_FAIL */
      ].call(plugin, {
        error,
        event,
        originalRequest: originalRequest.clone(),
        request: pluginFilteredRequest.clone()
      });
    }
    throw error;
  }
};
var fetchWrapper = {
  fetch: wrappedFetch
};

// node_modules/workbox-precaching/node_modules/workbox-core/_private/canConstructResponseFromBodyStream.js
var supportStatus;
function canConstructResponseFromBodyStream() {
  if (supportStatus === void 0) {
    const testResponse = new Response("");
    if ("body" in testResponse) {
      try {
        new Response(testResponse.body);
        supportStatus = true;
      } catch (error) {
        supportStatus = false;
      }
    }
    supportStatus = false;
  }
  return supportStatus;
}

// node_modules/workbox-precaching/node_modules/workbox-core/copyResponse.js
async function copyResponse(response, modifier) {
  const clonedResponse = response.clone();
  const responseInit = {
    headers: new Headers(clonedResponse.headers),
    status: clonedResponse.status,
    statusText: clonedResponse.statusText
  };
  const modifiedResponseInit = modifier ? modifier(responseInit) : responseInit;
  const body = canConstructResponseFromBodyStream() ? clonedResponse.body : await clonedResponse.blob();
  return new Response(body, modifiedResponseInit);
}

// node_modules/workbox-precaching/utils/createCacheKey.js
var REVISION_SEARCH_PARAM = "__WB_REVISION__";
function createCacheKey(entry) {
  if (!entry) {
    throw new WorkboxError("add-to-cache-list-unexpected-type", { entry });
  }
  if (typeof entry === "string") {
    const urlObject = new URL(entry, location.href);
    return {
      cacheKey: urlObject.href,
      url: urlObject.href
    };
  }
  const { revision, url } = entry;
  if (!url) {
    throw new WorkboxError("add-to-cache-list-unexpected-type", { entry });
  }
  if (!revision) {
    const urlObject = new URL(url, location.href);
    return {
      cacheKey: urlObject.href,
      url: urlObject.href
    };
  }
  const cacheKeyURL = new URL(url, location.href);
  const originalURL = new URL(url, location.href);
  cacheKeyURL.searchParams.set(REVISION_SEARCH_PARAM, revision);
  return {
    cacheKey: cacheKeyURL.href,
    url: originalURL.href
  };
}

// node_modules/workbox-precaching/utils/printCleanupDetails.js
var logGroup = (groupTitle, deletedURLs) => {
  logger.groupCollapsed(groupTitle);
  for (const url of deletedURLs) {
    logger.log(url);
  }
  logger.groupEnd();
};
function printCleanupDetails(deletedURLs) {
  const deletionCount = deletedURLs.length;
  if (deletionCount > 0) {
    logger.groupCollapsed(`During precaching cleanup, ${deletionCount} cached request${deletionCount === 1 ? " was" : "s were"} deleted.`);
    logGroup("Deleted Cache Requests", deletedURLs);
    logger.groupEnd();
  }
}

// node_modules/workbox-precaching/utils/printInstallDetails.js
function _nestedGroup(groupTitle, urls) {
  if (urls.length === 0) {
    return;
  }
  logger.groupCollapsed(groupTitle);
  for (const url of urls) {
    logger.log(url);
  }
  logger.groupEnd();
}
function printInstallDetails(urlsToPrecache, urlsAlreadyPrecached) {
  const precachedCount = urlsToPrecache.length;
  const alreadyPrecachedCount = urlsAlreadyPrecached.length;
  if (precachedCount || alreadyPrecachedCount) {
    let message = `Precaching ${precachedCount} file${precachedCount === 1 ? "" : "s"}.`;
    if (alreadyPrecachedCount > 0) {
      message += ` ${alreadyPrecachedCount} file${alreadyPrecachedCount === 1 ? " is" : "s are"} already cached.`;
    }
    logger.groupCollapsed(message);
    _nestedGroup(`View newly precached URLs.`, urlsToPrecache);
    _nestedGroup(`View previously precached URLs.`, urlsAlreadyPrecached);
    logger.groupEnd();
  }
}

// node_modules/workbox-precaching/PrecacheController.js
var PrecacheController = class {
  /**
   * Create a new PrecacheController.
   *
   * @param {string} [cacheName] An optional name for the cache, to override
   * the default precache name.
   */
  constructor(cacheName) {
    this._cacheName = cacheNames.getPrecacheName(cacheName);
    this._urlsToCacheKeys = /* @__PURE__ */ new Map();
    this._urlsToCacheModes = /* @__PURE__ */ new Map();
    this._cacheKeysToIntegrities = /* @__PURE__ */ new Map();
  }
  /**
   * This method will add items to the precache list, removing duplicates
   * and ensuring the information is valid.
   *
   * @param {
   * Array<module:workbox-precaching.PrecacheController.PrecacheEntry|string>
   * } entries Array of entries to precache.
   */
  addToCacheList(entries) {
    if (true) {
      finalAssertExports.isArray(entries, {
        moduleName: "workbox-precaching",
        className: "PrecacheController",
        funcName: "addToCacheList",
        paramName: "entries"
      });
    }
    const urlsToWarnAbout = [];
    for (const entry of entries) {
      if (typeof entry === "string") {
        urlsToWarnAbout.push(entry);
      } else if (entry && entry.revision === void 0) {
        urlsToWarnAbout.push(entry.url);
      }
      const { cacheKey, url } = createCacheKey(entry);
      const cacheMode = typeof entry !== "string" && entry.revision ? "reload" : "default";
      if (this._urlsToCacheKeys.has(url) && this._urlsToCacheKeys.get(url) !== cacheKey) {
        throw new WorkboxError("add-to-cache-list-conflicting-entries", {
          firstEntry: this._urlsToCacheKeys.get(url),
          secondEntry: cacheKey
        });
      }
      if (typeof entry !== "string" && entry.integrity) {
        if (this._cacheKeysToIntegrities.has(cacheKey) && this._cacheKeysToIntegrities.get(cacheKey) !== entry.integrity) {
          throw new WorkboxError("add-to-cache-list-conflicting-integrities", {
            url
          });
        }
        this._cacheKeysToIntegrities.set(cacheKey, entry.integrity);
      }
      this._urlsToCacheKeys.set(url, cacheKey);
      this._urlsToCacheModes.set(url, cacheMode);
      if (urlsToWarnAbout.length > 0) {
        const warningMessage = `Workbox is precaching URLs without revision info: ${urlsToWarnAbout.join(", ")}
This is generally NOT safe. Learn more at https://bit.ly/wb-precache`;
        if (false) {
          console.warn(warningMessage);
        } else {
          logger.warn(warningMessage);
        }
      }
    }
  }
  /**
   * Precaches new and updated assets. Call this method from the service worker
   * install event.
   *
   * @param {Object} options
   * @param {Event} [options.event] The install event (if needed).
   * @param {Array<Object>} [options.plugins] Plugins to be used for fetching
   * and caching during install.
   * @return {Promise<module:workbox-precaching.InstallResult>}
   */
  async install({ event, plugins: plugins2 } = {}) {
    if (true) {
      if (plugins2) {
        finalAssertExports.isArray(plugins2, {
          moduleName: "workbox-precaching",
          className: "PrecacheController",
          funcName: "install",
          paramName: "plugins"
        });
      }
    }
    const toBePrecached = [];
    const alreadyPrecached = [];
    const cache = await self.caches.open(this._cacheName);
    const alreadyCachedRequests = await cache.keys();
    const existingCacheKeys = new Set(alreadyCachedRequests.map((request) => request.url));
    for (const [url, cacheKey] of this._urlsToCacheKeys) {
      if (existingCacheKeys.has(cacheKey)) {
        alreadyPrecached.push(url);
      } else {
        toBePrecached.push({ cacheKey, url });
      }
    }
    const precacheRequests = toBePrecached.map(({ cacheKey, url }) => {
      const integrity = this._cacheKeysToIntegrities.get(cacheKey);
      const cacheMode = this._urlsToCacheModes.get(url);
      return this._addURLToCache({
        cacheKey,
        cacheMode,
        event,
        integrity,
        plugins: plugins2,
        url
      });
    });
    await Promise.all(precacheRequests);
    const updatedURLs = toBePrecached.map((item) => item.url);
    if (true) {
      printInstallDetails(updatedURLs, alreadyPrecached);
    }
    return {
      updatedURLs,
      notUpdatedURLs: alreadyPrecached
    };
  }
  /**
   * Deletes assets that are no longer present in the current precache manifest.
   * Call this method from the service worker activate event.
   *
   * @return {Promise<module:workbox-precaching.CleanupResult>}
   */
  async activate() {
    const cache = await self.caches.open(this._cacheName);
    const currentlyCachedRequests = await cache.keys();
    const expectedCacheKeys = new Set(this._urlsToCacheKeys.values());
    const deletedURLs = [];
    for (const request of currentlyCachedRequests) {
      if (!expectedCacheKeys.has(request.url)) {
        await cache.delete(request);
        deletedURLs.push(request.url);
      }
    }
    if (true) {
      printCleanupDetails(deletedURLs);
    }
    return { deletedURLs };
  }
  /**
   * Requests the entry and saves it to the cache if the response is valid.
   * By default, any response with a status code of less than 400 (including
   * opaque responses) is considered valid.
   *
   * If you need to use custom criteria to determine what's valid and what
   * isn't, then pass in an item in `options.plugins` that implements the
   * `cacheWillUpdate()` lifecycle event.
   *
   * @private
   * @param {Object} options
   * @param {string} options.cacheKey The string to use a cache key.
   * @param {string} options.url The URL to fetch and cache.
   * @param {string} [options.cacheMode] The cache mode for the network request.
   * @param {Event} [options.event] The install event (if passed).
   * @param {Array<Object>} [options.plugins] An array of plugins to apply to
   * fetch and caching.
   * @param {string} [options.integrity] The value to use for the `integrity`
   * field when making the request.
   */
  async _addURLToCache({ cacheKey, url, cacheMode, event, plugins: plugins2, integrity }) {
    const request = new Request(url, {
      integrity,
      cache: cacheMode,
      credentials: "same-origin"
    });
    let response = await fetchWrapper.fetch({
      event,
      plugins: plugins2,
      request
    });
    let cacheWillUpdatePlugin;
    for (const plugin of plugins2 || []) {
      if ("cacheWillUpdate" in plugin) {
        cacheWillUpdatePlugin = plugin;
      }
    }
    const isValidResponse = cacheWillUpdatePlugin ? (
      // Use a callback if provided. It returns a truthy value if valid.
      // NOTE: invoke the method on the plugin instance so the `this` context
      // is correct.
      await cacheWillUpdatePlugin.cacheWillUpdate({ event, request, response })
    ) : (
      // Otherwise, default to considering any response status under 400 valid.
      // This includes, by default, considering opaque responses valid.
      response.status < 400
    );
    if (!isValidResponse) {
      throw new WorkboxError("bad-precaching-response", {
        url,
        status: response.status
      });
    }
    if (response.redirected) {
      response = await copyResponse(response);
    }
    await cacheWrapper.put({
      event,
      plugins: plugins2,
      response,
      // `request` already uses `url`. We may be able to reuse it.
      request: cacheKey === url ? request : new Request(cacheKey),
      cacheName: this._cacheName,
      matchOptions: {
        ignoreSearch: true
      }
    });
  }
  /**
   * Returns a mapping of a precached URL to the corresponding cache key, taking
   * into account the revision information for the URL.
   *
   * @return {Map<string, string>} A URL to cache key mapping.
   */
  getURLsToCacheKeys() {
    return this._urlsToCacheKeys;
  }
  /**
   * Returns a list of all the URLs that have been precached by the current
   * service worker.
   *
   * @return {Array<string>} The precached URLs.
   */
  getCachedURLs() {
    return [...this._urlsToCacheKeys.keys()];
  }
  /**
   * Returns the cache key used for storing a given URL. If that URL is
   * unversioned, like `/index.html', then the cache key will be the original
   * URL with a search parameter appended to it.
   *
   * @param {string} url A URL whose cache key you want to look up.
   * @return {string} The versioned URL that corresponds to a cache key
   * for the original URL, or undefined if that URL isn't precached.
   */
  getCacheKeyForURL(url) {
    const urlObject = new URL(url, location.href);
    return this._urlsToCacheKeys.get(urlObject.href);
  }
  /**
   * This acts as a drop-in replacement for [`cache.match()`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/match)
   * with the following differences:
   *
   * - It knows what the name of the precache is, and only checks in that cache.
   * - It allows you to pass in an "original" URL without versioning parameters,
   * and it will automatically look up the correct cache key for the currently
   * active revision of that URL.
   *
   * E.g., `matchPrecache('index.html')` will find the correct precached
   * response for the currently active service worker, even if the actual cache
   * key is `'/index.html?__WB_REVISION__=1234abcd'`.
   *
   * @param {string|Request} request The key (without revisioning parameters)
   * to look up in the precache.
   * @return {Promise<Response|undefined>}
   */
  async matchPrecache(request) {
    const url = request instanceof Request ? request.url : request;
    const cacheKey = this.getCacheKeyForURL(url);
    if (cacheKey) {
      const cache = await self.caches.open(this._cacheName);
      return cache.match(cacheKey);
    }
    return void 0;
  }
  /**
   * Returns a function that can be used within a
   * {@link module:workbox-routing.Route} that will find a response for the
   * incoming request against the precache.
   *
   * If for an unexpected reason there is a cache miss for the request,
   * this will fall back to retrieving the `Response` via `fetch()` when
   * `fallbackToNetwork` is `true`.
   *
   * @param {boolean} [fallbackToNetwork=true] Whether to attempt to get the
   * response from the network if there's a precache miss.
   * @return {module:workbox-routing~handlerCallback}
   */
  createHandler(fallbackToNetwork = true) {
    return async ({ request }) => {
      try {
        const response = await this.matchPrecache(request);
        if (response) {
          return response;
        }
        throw new WorkboxError("missing-precache-entry", {
          cacheName: this._cacheName,
          url: request instanceof Request ? request.url : request
        });
      } catch (error) {
        if (fallbackToNetwork) {
          if (true) {
            logger.debug(`Unable to respond with precached response. Falling back to network.`, error);
          }
          return fetch(request);
        }
        throw error;
      }
    };
  }
  /**
   * Returns a function that looks up `url` in the precache (taking into
   * account revision information), and returns the corresponding `Response`.
   *
   * If for an unexpected reason there is a cache miss when looking up `url`,
   * this will fall back to retrieving the `Response` via `fetch()` when
   * `fallbackToNetwork` is `true`.
   *
   * @param {string} url The precached URL which will be used to lookup the
   * `Response`.
   * @param {boolean} [fallbackToNetwork=true] Whether to attempt to get the
   * response from the network if there's a precache miss.
   * @return {module:workbox-routing~handlerCallback}
   */
  createHandlerBoundToURL(url, fallbackToNetwork = true) {
    const cacheKey = this.getCacheKeyForURL(url);
    if (!cacheKey) {
      throw new WorkboxError("non-precached-url", { url });
    }
    const handler = this.createHandler(fallbackToNetwork);
    const request = new Request(url);
    return () => handler({ request });
  }
};

// node_modules/workbox-precaching/utils/getOrCreatePrecacheController.js
var precacheController;
var getOrCreatePrecacheController = () => {
  if (!precacheController) {
    precacheController = new PrecacheController();
  }
  return precacheController;
};

// node_modules/workbox-precaching/utils/removeIgnoredSearchParams.js
function removeIgnoredSearchParams(urlObject, ignoreURLParametersMatching = []) {
  for (const paramName of [...urlObject.searchParams.keys()]) {
    if (ignoreURLParametersMatching.some((regExp) => regExp.test(paramName))) {
      urlObject.searchParams.delete(paramName);
    }
  }
  return urlObject;
}

// node_modules/workbox-precaching/utils/generateURLVariations.js
function* generateURLVariations(url, { ignoreURLParametersMatching, directoryIndex, cleanURLs, urlManipulation } = {}) {
  const urlObject = new URL(url, location.href);
  urlObject.hash = "";
  yield urlObject.href;
  const urlWithoutIgnoredParams = removeIgnoredSearchParams(urlObject, ignoreURLParametersMatching);
  yield urlWithoutIgnoredParams.href;
  if (directoryIndex && urlWithoutIgnoredParams.pathname.endsWith("/")) {
    const directoryURL = new URL(urlWithoutIgnoredParams.href);
    directoryURL.pathname += directoryIndex;
    yield directoryURL.href;
  }
  if (cleanURLs) {
    const cleanURL = new URL(urlWithoutIgnoredParams.href);
    cleanURL.pathname += ".html";
    yield cleanURL.href;
  }
  if (urlManipulation) {
    const additionalURLs = urlManipulation({ url: urlObject });
    for (const urlToAttempt of additionalURLs) {
      yield urlToAttempt.href;
    }
  }
}

// node_modules/workbox-precaching/utils/getCacheKeyForURL.js
var getCacheKeyForURL = (url, options) => {
  const precacheController2 = getOrCreatePrecacheController();
  const urlsToCacheKeys = precacheController2.getURLsToCacheKeys();
  for (const possibleURL of generateURLVariations(url, options)) {
    const possibleCacheKey = urlsToCacheKeys.get(possibleURL);
    if (possibleCacheKey) {
      return possibleCacheKey;
    }
  }
};

// node_modules/workbox-precaching/utils/addFetchListener.js
var addFetchListener = ({ ignoreURLParametersMatching = [/^utm_/], directoryIndex = "index.html", cleanURLs = true, urlManipulation } = {}) => {
  const cacheName = cacheNames.getPrecacheName();
  self.addEventListener("fetch", (event) => {
    const precachedURL = getCacheKeyForURL(event.request.url, {
      cleanURLs,
      directoryIndex,
      ignoreURLParametersMatching,
      urlManipulation
    });
    if (!precachedURL) {
      if (true) {
        logger.debug(`Precaching did not find a match for ` + getFriendlyURL(event.request.url));
      }
      return;
    }
    let responsePromise = self.caches.open(cacheName).then((cache) => {
      return cache.match(precachedURL);
    }).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      if (true) {
        logger.warn(`The precached response for ${getFriendlyURL(precachedURL)} in ${cacheName} was not found. Falling back to the network instead.`);
      }
      return fetch(precachedURL);
    });
    if (true) {
      responsePromise = responsePromise.then((response) => {
        logger.groupCollapsed(`Precaching is responding to: ` + getFriendlyURL(event.request.url));
        logger.log(`Serving the precached url: ${precachedURL}`);
        logger.groupCollapsed(`View request details here.`);
        logger.log(event.request);
        logger.groupEnd();
        logger.groupCollapsed(`View response details here.`);
        logger.log(response);
        logger.groupEnd();
        logger.groupEnd();
        return response;
      });
    }
    event.respondWith(responsePromise);
  });
};

// node_modules/workbox-precaching/addRoute.js
var listenerAdded = false;
function addRoute(options) {
  if (!listenerAdded) {
    addFetchListener(options);
    listenerAdded = true;
  }
}

// node_modules/workbox-precaching/precache.js
var installListener = (event) => {
  const precacheController2 = getOrCreatePrecacheController();
  const plugins2 = precachePlugins.get();
  event.waitUntil(precacheController2.install({ event, plugins: plugins2 }).catch((error) => {
    if (true) {
      logger.error(`Service worker installation failed. It will be retried automatically during the next navigation.`);
    }
    throw error;
  }));
};
var activateListener = (event) => {
  const precacheController2 = getOrCreatePrecacheController();
  event.waitUntil(precacheController2.activate());
};
function precache(entries) {
  const precacheController2 = getOrCreatePrecacheController();
  precacheController2.addToCacheList(entries);
  if (entries.length > 0) {
    self.addEventListener("install", installListener);
    self.addEventListener("activate", activateListener);
  }
}

// node_modules/workbox-precaching/precacheAndRoute.js
function precacheAndRoute(entries, options) {
  precache(entries);
  addRoute(options);
}

// node_modules/workbox-routing/node_modules/workbox-core/_version.js
try {
  self["workbox:core:5.1.4"] && _();
} catch (e) {
}

// node_modules/workbox-routing/node_modules/workbox-core/models/messages/messages.js
var messages2 = {
  "invalid-value": ({ paramName, validValueDescription, value }) => {
    if (!paramName || !validValueDescription) {
      throw new Error(`Unexpected input to 'invalid-value' error.`);
    }
    return `The '${paramName}' parameter was given a value with an unexpected value. ${validValueDescription} Received a value of ${JSON.stringify(value)}.`;
  },
  "not-an-array": ({ moduleName, className, funcName, paramName }) => {
    if (!moduleName || !className || !funcName || !paramName) {
      throw new Error(`Unexpected input to 'not-an-array' error.`);
    }
    return `The parameter '${paramName}' passed into '${moduleName}.${className}.${funcName}()' must be an array.`;
  },
  "incorrect-type": ({ expectedType, paramName, moduleName, className, funcName }) => {
    if (!expectedType || !paramName || !moduleName || !funcName) {
      throw new Error(`Unexpected input to 'incorrect-type' error.`);
    }
    return `The parameter '${paramName}' passed into '${moduleName}.${className ? className + "." : ""}${funcName}()' must be of type ${expectedType}.`;
  },
  "incorrect-class": ({ expectedClass, paramName, moduleName, className, funcName, isReturnValueProblem }) => {
    if (!expectedClass || !moduleName || !funcName) {
      throw new Error(`Unexpected input to 'incorrect-class' error.`);
    }
    if (isReturnValueProblem) {
      return `The return value from '${moduleName}.${className ? className + "." : ""}${funcName}()' must be an instance of class ${expectedClass.name}.`;
    }
    return `The parameter '${paramName}' passed into '${moduleName}.${className ? className + "." : ""}${funcName}()' must be an instance of class ${expectedClass.name}.`;
  },
  "missing-a-method": ({ expectedMethod, paramName, moduleName, className, funcName }) => {
    if (!expectedMethod || !paramName || !moduleName || !className || !funcName) {
      throw new Error(`Unexpected input to 'missing-a-method' error.`);
    }
    return `${moduleName}.${className}.${funcName}() expected the '${paramName}' parameter to expose a '${expectedMethod}' method.`;
  },
  "add-to-cache-list-unexpected-type": ({ entry }) => {
    return `An unexpected entry was passed to 'workbox-precaching.PrecacheController.addToCacheList()' The entry '${JSON.stringify(entry)}' isn't supported. You must supply an array of strings with one or more characters, objects with a url property or Request objects.`;
  },
  "add-to-cache-list-conflicting-entries": ({ firstEntry, secondEntry }) => {
    if (!firstEntry || !secondEntry) {
      throw new Error(`Unexpected input to 'add-to-cache-list-duplicate-entries' error.`);
    }
    return `Two of the entries passed to 'workbox-precaching.PrecacheController.addToCacheList()' had the URL ${firstEntry._entryId} but different revision details. Workbox is unable to cache and version the asset correctly. Please remove one of the entries.`;
  },
  "plugin-error-request-will-fetch": ({ thrownError }) => {
    if (!thrownError) {
      throw new Error(`Unexpected input to 'plugin-error-request-will-fetch', error.`);
    }
    return `An error was thrown by a plugins 'requestWillFetch()' method. The thrown error message was: '${thrownError.message}'.`;
  },
  "invalid-cache-name": ({ cacheNameId, value }) => {
    if (!cacheNameId) {
      throw new Error(`Expected a 'cacheNameId' for error 'invalid-cache-name'`);
    }
    return `You must provide a name containing at least one character for setCacheDetails({${cacheNameId}: '...'}). Received a value of '${JSON.stringify(value)}'`;
  },
  "unregister-route-but-not-found-with-method": ({ method }) => {
    if (!method) {
      throw new Error(`Unexpected input to 'unregister-route-but-not-found-with-method' error.`);
    }
    return `The route you're trying to unregister was not  previously registered for the method type '${method}'.`;
  },
  "unregister-route-route-not-registered": () => {
    return `The route you're trying to unregister was not previously registered.`;
  },
  "queue-replay-failed": ({ name }) => {
    return `Replaying the background sync queue '${name}' failed.`;
  },
  "duplicate-queue-name": ({ name }) => {
    return `The Queue name '${name}' is already being used. All instances of backgroundSync.Queue must be given unique names.`;
  },
  "expired-test-without-max-age": ({ methodName, paramName }) => {
    return `The '${methodName}()' method can only be used when the '${paramName}' is used in the constructor.`;
  },
  "unsupported-route-type": ({ moduleName, className, funcName, paramName }) => {
    return `The supplied '${paramName}' parameter was an unsupported type. Please check the docs for ${moduleName}.${className}.${funcName} for valid input types.`;
  },
  "not-array-of-class": ({ value, expectedClass, moduleName, className, funcName, paramName }) => {
    return `The supplied '${paramName}' parameter must be an array of '${expectedClass}' objects. Received '${JSON.stringify(value)},'. Please check the call to ${moduleName}.${className}.${funcName}() to fix the issue.`;
  },
  "max-entries-or-age-required": ({ moduleName, className, funcName }) => {
    return `You must define either config.maxEntries or config.maxAgeSecondsin ${moduleName}.${className}.${funcName}`;
  },
  "statuses-or-headers-required": ({ moduleName, className, funcName }) => {
    return `You must define either config.statuses or config.headersin ${moduleName}.${className}.${funcName}`;
  },
  "invalid-string": ({ moduleName, funcName, paramName }) => {
    if (!paramName || !moduleName || !funcName) {
      throw new Error(`Unexpected input to 'invalid-string' error.`);
    }
    return `When using strings, the '${paramName}' parameter must start with 'http' (for cross-origin matches) or '/' (for same-origin matches). Please see the docs for ${moduleName}.${funcName}() for more info.`;
  },
  "channel-name-required": () => {
    return `You must provide a channelName to construct a BroadcastCacheUpdate instance.`;
  },
  "invalid-responses-are-same-args": () => {
    return `The arguments passed into responsesAreSame() appear to be invalid. Please ensure valid Responses are used.`;
  },
  "expire-custom-caches-only": () => {
    return `You must provide a 'cacheName' property when using the expiration plugin with a runtime caching strategy.`;
  },
  "unit-must-be-bytes": ({ normalizedRangeHeader }) => {
    if (!normalizedRangeHeader) {
      throw new Error(`Unexpected input to 'unit-must-be-bytes' error.`);
    }
    return `The 'unit' portion of the Range header must be set to 'bytes'. The Range header provided was "${normalizedRangeHeader}"`;
  },
  "single-range-only": ({ normalizedRangeHeader }) => {
    if (!normalizedRangeHeader) {
      throw new Error(`Unexpected input to 'single-range-only' error.`);
    }
    return `Multiple ranges are not supported. Please use a  single start value, and optional end value. The Range header provided was "${normalizedRangeHeader}"`;
  },
  "invalid-range-values": ({ normalizedRangeHeader }) => {
    if (!normalizedRangeHeader) {
      throw new Error(`Unexpected input to 'invalid-range-values' error.`);
    }
    return `The Range header is missing both start and end values. At least one of those values is needed. The Range header provided was "${normalizedRangeHeader}"`;
  },
  "no-range-header": () => {
    return `No Range header was found in the Request provided.`;
  },
  "range-not-satisfiable": ({ size, start, end }) => {
    return `The start (${start}) and end (${end}) values in the Range are not satisfiable by the cached response, which is ${size} bytes.`;
  },
  "attempt-to-cache-non-get-request": ({ url, method }) => {
    return `Unable to cache '${url}' because it is a '${method}' request and only 'GET' requests can be cached.`;
  },
  "cache-put-with-no-response": ({ url }) => {
    return `There was an attempt to cache '${url}' but the response was not defined.`;
  },
  "no-response": ({ url, error }) => {
    let message = `The strategy could not generate a response for '${url}'.`;
    if (error) {
      message += ` The underlying error is ${error}.`;
    }
    return message;
  },
  "bad-precaching-response": ({ url, status }) => {
    return `The precaching request for '${url}' failed with an HTTP status of ${status}.`;
  },
  "non-precached-url": ({ url }) => {
    return `createHandlerBoundToURL('${url}') was called, but that URL is not precached. Please pass in a URL that is precached instead.`;
  },
  "add-to-cache-list-conflicting-integrities": ({ url }) => {
    return `Two of the entries passed to 'workbox-precaching.PrecacheController.addToCacheList()' had the URL ${url} with different integrity values. Please remove one of them.`;
  },
  "missing-precache-entry": ({ cacheName, url }) => {
    return `Unable to find a precached response in ${cacheName} for ${url}.`;
  }
};

// node_modules/workbox-routing/node_modules/workbox-core/models/messages/messageGenerator.js
var generatorFunction2 = (code, details = {}) => {
  const message = messages2[code];
  if (!message) {
    throw new Error(`Unable to find message for code '${code}'.`);
  }
  return message(details);
};
var messageGenerator2 = false ? fallback : generatorFunction2;

// node_modules/workbox-routing/node_modules/workbox-core/_private/WorkboxError.js
var WorkboxError2 = class extends Error {
  /**
   *
   * @param {string} errorCode The error code that
   * identifies this particular error.
   * @param {Object=} details Any relevant arguments
   * that will help developers identify issues should
   * be added as a key on the context object.
   */
  constructor(errorCode, details) {
    const message = messageGenerator2(errorCode, details);
    super(message);
    this.name = errorCode;
    this.details = details;
  }
};

// node_modules/workbox-routing/node_modules/workbox-core/_private/assert.js
var isArray2 = (value, details) => {
  if (!Array.isArray(value)) {
    throw new WorkboxError2("not-an-array", details);
  }
};
var hasMethod2 = (object, expectedMethod, details) => {
  const type = typeof object[expectedMethod];
  if (type !== "function") {
    details["expectedMethod"] = expectedMethod;
    throw new WorkboxError2("missing-a-method", details);
  }
};
var isType2 = (object, expectedType, details) => {
  if (typeof object !== expectedType) {
    details["expectedType"] = expectedType;
    throw new WorkboxError2("incorrect-type", details);
  }
};
var isInstance2 = (object, expectedClass, details) => {
  if (!(object instanceof expectedClass)) {
    details["expectedClass"] = expectedClass;
    throw new WorkboxError2("incorrect-class", details);
  }
};
var isOneOf2 = (value, validValues, details) => {
  if (!validValues.includes(value)) {
    details["validValueDescription"] = `Valid values are ${JSON.stringify(validValues)}.`;
    throw new WorkboxError2("invalid-value", details);
  }
};
var isArrayOfClass2 = (value, expectedClass, details) => {
  const error = new WorkboxError2("not-array-of-class", details);
  if (!Array.isArray(value)) {
    throw error;
  }
  for (const item of value) {
    if (!(item instanceof expectedClass)) {
      throw error;
    }
  }
};
var finalAssertExports2 = false ? null : {
  hasMethod: hasMethod2,
  isArray: isArray2,
  isInstance: isInstance2,
  isOneOf: isOneOf2,
  isType: isType2,
  isArrayOfClass: isArrayOfClass2
};

// node_modules/workbox-routing/node_modules/workbox-core/_private/logger.js
var logger2 = false ? null : (() => {
  if (!("__WB_DISABLE_DEV_LOGS" in self)) {
    self.__WB_DISABLE_DEV_LOGS = false;
  }
  let inGroup = false;
  const methodToColorMap = {
    debug: `#7f8c8d`,
    log: `#2ecc71`,
    warn: `#f39c12`,
    error: `#c0392b`,
    groupCollapsed: `#3498db`,
    groupEnd: null
  };
  const print = function(method, args) {
    if (self.__WB_DISABLE_DEV_LOGS) {
      return;
    }
    if (method === "groupCollapsed") {
      if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        console[method](...args);
        return;
      }
    }
    const styles = [
      `background: ${methodToColorMap[method]}`,
      `border-radius: 0.5em`,
      `color: white`,
      `font-weight: bold`,
      `padding: 2px 0.5em`
    ];
    const logPrefix = inGroup ? [] : ["%cworkbox", styles.join(";")];
    console[method](...logPrefix, ...args);
    if (method === "groupCollapsed") {
      inGroup = true;
    }
    if (method === "groupEnd") {
      inGroup = false;
    }
  };
  const api = {};
  const loggerMethods = Object.keys(methodToColorMap);
  for (const key of loggerMethods) {
    const method = key;
    api[method] = (...args) => {
      print(method, args);
    };
  }
  return api;
})();

// node_modules/workbox-routing/_version.js
try {
  self["workbox:routing:5.1.4"] && _();
} catch (e) {
}

// node_modules/workbox-routing/utils/constants.js
var defaultMethod = "GET";
var validMethods = [
  "DELETE",
  "GET",
  "HEAD",
  "PATCH",
  "POST",
  "PUT"
];

// node_modules/workbox-routing/utils/normalizeHandler.js
var normalizeHandler = (handler) => {
  if (handler && typeof handler === "object") {
    if (true) {
      finalAssertExports2.hasMethod(handler, "handle", {
        moduleName: "workbox-routing",
        className: "Route",
        funcName: "constructor",
        paramName: "handler"
      });
    }
    return handler;
  } else {
    if (true) {
      finalAssertExports2.isType(handler, "function", {
        moduleName: "workbox-routing",
        className: "Route",
        funcName: "constructor",
        paramName: "handler"
      });
    }
    return { handle: handler };
  }
};

// node_modules/workbox-routing/Route.js
var Route = class {
  /**
   * Constructor for Route class.
   *
   * @param {module:workbox-routing~matchCallback} match
   * A callback function that determines whether the route matches a given
   * `fetch` event by returning a non-falsy value.
   * @param {module:workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resolving to a Response.
   * @param {string} [method='GET'] The HTTP method to match the Route
   * against.
   */
  constructor(match, handler, method = defaultMethod) {
    if (true) {
      finalAssertExports2.isType(match, "function", {
        moduleName: "workbox-routing",
        className: "Route",
        funcName: "constructor",
        paramName: "match"
      });
      if (method) {
        finalAssertExports2.isOneOf(method, validMethods, { paramName: "method" });
      }
    }
    this.handler = normalizeHandler(handler);
    this.match = match;
    this.method = method;
  }
};

// node_modules/workbox-routing/RegExpRoute.js
var RegExpRoute = class extends Route {
  /**
   * If the regular expression contains
   * [capture groups]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#grouping-back-references},
   * the captured values will be passed to the
   * [handler's]{@link module:workbox-routing~handlerCallback} `params`
   * argument.
   *
   * @param {RegExp} regExp The regular expression to match against URLs.
   * @param {module:workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   * @param {string} [method='GET'] The HTTP method to match the Route
   * against.
   */
  constructor(regExp, handler, method) {
    if (true) {
      finalAssertExports2.isInstance(regExp, RegExp, {
        moduleName: "workbox-routing",
        className: "RegExpRoute",
        funcName: "constructor",
        paramName: "pattern"
      });
    }
    const match = ({ url }) => {
      const result = regExp.exec(url.href);
      if (!result) {
        return;
      }
      if (url.origin !== location.origin && result.index !== 0) {
        if (true) {
          logger2.debug(`The regular expression '${regExp}' only partially matched against the cross-origin URL '${url}'. RegExpRoute's will only handle cross-origin requests if they match the entire URL.`);
        }
        return;
      }
      return result.slice(1);
    };
    super(match, handler, method);
  }
};

// node_modules/workbox-routing/node_modules/workbox-core/_private/getFriendlyURL.js
var getFriendlyURL2 = (url) => {
  const urlObj = new URL(String(url), location.href);
  return urlObj.href.replace(new RegExp(`^${location.origin}`), "");
};

// node_modules/workbox-routing/Router.js
var Router = class {
  /**
   * Initializes a new Router.
   */
  constructor() {
    this._routes = /* @__PURE__ */ new Map();
  }
  /**
   * @return {Map<string, Array<module:workbox-routing.Route>>} routes A `Map` of HTTP
   * method name ('GET', etc.) to an array of all the corresponding `Route`
   * instances that are registered.
   */
  get routes() {
    return this._routes;
  }
  /**
   * Adds a fetch event listener to respond to events when a route matches
   * the event's request.
   */
  addFetchListener() {
    self.addEventListener("fetch", (event) => {
      const { request } = event;
      const responsePromise = this.handleRequest({ request, event });
      if (responsePromise) {
        event.respondWith(responsePromise);
      }
    });
  }
  /**
   * Adds a message event listener for URLs to cache from the window.
   * This is useful to cache resources loaded on the page prior to when the
   * service worker started controlling it.
   *
   * The format of the message data sent from the window should be as follows.
   * Where the `urlsToCache` array may consist of URL strings or an array of
   * URL string + `requestInit` object (the same as you'd pass to `fetch()`).
   *
   * ```
   * {
   *   type: 'CACHE_URLS',
   *   payload: {
   *     urlsToCache: [
   *       './script1.js',
   *       './script2.js',
   *       ['./script3.js', {mode: 'no-cors'}],
   *     ],
   *   },
   * }
   * ```
   */
  addCacheListener() {
    self.addEventListener("message", (event) => {
      if (event.data && event.data.type === "CACHE_URLS") {
        const { payload } = event.data;
        if (true) {
          logger2.debug(`Caching URLs from the window`, payload.urlsToCache);
        }
        const requestPromises = Promise.all(payload.urlsToCache.map((entry) => {
          if (typeof entry === "string") {
            entry = [entry];
          }
          const request = new Request(...entry);
          return this.handleRequest({ request });
        }));
        event.waitUntil(requestPromises);
        if (event.ports && event.ports[0]) {
          requestPromises.then(() => event.ports[0].postMessage(true));
        }
      }
    });
  }
  /**
   * Apply the routing rules to a FetchEvent object to get a Response from an
   * appropriate Route's handler.
   *
   * @param {Object} options
   * @param {Request} options.request The request to handle (this is usually
   *     from a fetch event, but it does not have to be).
   * @param {FetchEvent} [options.event] The event that triggered the request,
   *     if applicable.
   * @return {Promise<Response>|undefined} A promise is returned if a
   *     registered route can handle the request. If there is no matching
   *     route and there's no `defaultHandler`, `undefined` is returned.
   */
  handleRequest({ request, event }) {
    if (true) {
      finalAssertExports2.isInstance(request, Request, {
        moduleName: "workbox-routing",
        className: "Router",
        funcName: "handleRequest",
        paramName: "options.request"
      });
    }
    const url = new URL(request.url, location.href);
    if (!url.protocol.startsWith("http")) {
      if (true) {
        logger2.debug(`Workbox Router only supports URLs that start with 'http'.`);
      }
      return;
    }
    const { params, route } = this.findMatchingRoute({ url, request, event });
    let handler = route && route.handler;
    const debugMessages = [];
    if (true) {
      if (handler) {
        debugMessages.push([
          `Found a route to handle this request:`,
          route
        ]);
        if (params) {
          debugMessages.push([
            `Passing the following params to the route's handler:`,
            params
          ]);
        }
      }
    }
    if (!handler && this._defaultHandler) {
      if (true) {
        debugMessages.push(`Failed to find a matching route. Falling back to the default handler.`);
      }
      handler = this._defaultHandler;
    }
    if (!handler) {
      if (true) {
        logger2.debug(`No route found for: ${getFriendlyURL2(url)}`);
      }
      return;
    }
    if (true) {
      logger2.groupCollapsed(`Router is responding to: ${getFriendlyURL2(url)}`);
      debugMessages.forEach((msg) => {
        if (Array.isArray(msg)) {
          logger2.log(...msg);
        } else {
          logger2.log(msg);
        }
      });
      logger2.groupEnd();
    }
    let responsePromise;
    try {
      responsePromise = handler.handle({ url, request, event, params });
    } catch (err) {
      responsePromise = Promise.reject(err);
    }
    if (responsePromise instanceof Promise && this._catchHandler) {
      responsePromise = responsePromise.catch((err) => {
        if (true) {
          logger2.groupCollapsed(`Error thrown when responding to:  ${getFriendlyURL2(url)}. Falling back to Catch Handler.`);
          logger2.error(`Error thrown by:`, route);
          logger2.error(err);
          logger2.groupEnd();
        }
        return this._catchHandler.handle({ url, request, event });
      });
    }
    return responsePromise;
  }
  /**
   * Checks a request and URL (and optionally an event) against the list of
   * registered routes, and if there's a match, returns the corresponding
   * route along with any params generated by the match.
   *
   * @param {Object} options
   * @param {URL} options.url
   * @param {Request} options.request The request to match.
   * @param {Event} [options.event] The corresponding event (unless N/A).
   * @return {Object} An object with `route` and `params` properties.
   *     They are populated if a matching route was found or `undefined`
   *     otherwise.
   */
  findMatchingRoute({ url, request, event }) {
    if (true) {
      finalAssertExports2.isInstance(url, URL, {
        moduleName: "workbox-routing",
        className: "Router",
        funcName: "findMatchingRoute",
        paramName: "options.url"
      });
      finalAssertExports2.isInstance(request, Request, {
        moduleName: "workbox-routing",
        className: "Router",
        funcName: "findMatchingRoute",
        paramName: "options.request"
      });
    }
    const routes = this._routes.get(request.method) || [];
    for (const route of routes) {
      let params;
      const matchResult = route.match({ url, request, event });
      if (matchResult) {
        params = matchResult;
        if (Array.isArray(matchResult) && matchResult.length === 0) {
          params = void 0;
        } else if (matchResult.constructor === Object && Object.keys(matchResult).length === 0) {
          params = void 0;
        } else if (typeof matchResult === "boolean") {
          params = void 0;
        }
        return { route, params };
      }
    }
    return {};
  }
  /**
   * Define a default `handler` that's called when no routes explicitly
   * match the incoming request.
   *
   * Without a default handler, unmatched requests will go against the
   * network as if there were no service worker present.
   *
   * @param {module:workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   */
  setDefaultHandler(handler) {
    this._defaultHandler = normalizeHandler(handler);
  }
  /**
   * If a Route throws an error while handling a request, this `handler`
   * will be called and given a chance to provide a response.
   *
   * @param {module:workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   */
  setCatchHandler(handler) {
    this._catchHandler = normalizeHandler(handler);
  }
  /**
   * Registers a route with the router.
   *
   * @param {module:workbox-routing.Route} route The route to register.
   */
  registerRoute(route) {
    if (true) {
      finalAssertExports2.isType(route, "object", {
        moduleName: "workbox-routing",
        className: "Router",
        funcName: "registerRoute",
        paramName: "route"
      });
      finalAssertExports2.hasMethod(route, "match", {
        moduleName: "workbox-routing",
        className: "Router",
        funcName: "registerRoute",
        paramName: "route"
      });
      finalAssertExports2.isType(route.handler, "object", {
        moduleName: "workbox-routing",
        className: "Router",
        funcName: "registerRoute",
        paramName: "route"
      });
      finalAssertExports2.hasMethod(route.handler, "handle", {
        moduleName: "workbox-routing",
        className: "Router",
        funcName: "registerRoute",
        paramName: "route.handler"
      });
      finalAssertExports2.isType(route.method, "string", {
        moduleName: "workbox-routing",
        className: "Router",
        funcName: "registerRoute",
        paramName: "route.method"
      });
    }
    if (!this._routes.has(route.method)) {
      this._routes.set(route.method, []);
    }
    this._routes.get(route.method).push(route);
  }
  /**
   * Unregisters a route with the router.
   *
   * @param {module:workbox-routing.Route} route The route to unregister.
   */
  unregisterRoute(route) {
    if (!this._routes.has(route.method)) {
      throw new WorkboxError2("unregister-route-but-not-found-with-method", {
        method: route.method
      });
    }
    const routeIndex = this._routes.get(route.method).indexOf(route);
    if (routeIndex > -1) {
      this._routes.get(route.method).splice(routeIndex, 1);
    } else {
      throw new WorkboxError2("unregister-route-route-not-registered");
    }
  }
};

// node_modules/workbox-routing/utils/getOrCreateDefaultRouter.js
var defaultRouter;
var getOrCreateDefaultRouter = () => {
  if (!defaultRouter) {
    defaultRouter = new Router();
    defaultRouter.addFetchListener();
    defaultRouter.addCacheListener();
  }
  return defaultRouter;
};

// node_modules/workbox-routing/registerRoute.js
function registerRoute(capture, handler, method) {
  let route;
  if (typeof capture === "string") {
    const captureUrl = new URL(capture, location.href);
    if (true) {
      if (!(capture.startsWith("/") || capture.startsWith("http"))) {
        throw new WorkboxError2("invalid-string", {
          moduleName: "workbox-routing",
          funcName: "registerRoute",
          paramName: "capture"
        });
      }
      const valueToCheck = capture.startsWith("http") ? captureUrl.pathname : capture;
      const wildcards = "[*:?+]";
      if (new RegExp(`${wildcards}`).exec(valueToCheck)) {
        logger2.debug(`The '$capture' parameter contains an Express-style wildcard character (${wildcards}). Strings are now always interpreted as exact matches; use a RegExp for partial or wildcard matches.`);
      }
    }
    const matchCallback = ({ url }) => {
      if (true) {
        if (url.pathname === captureUrl.pathname && url.origin !== captureUrl.origin) {
          logger2.debug(`${capture} only partially matches the cross-origin URL ${url}. This route will only handle cross-origin requests if they match the entire URL.`);
        }
      }
      return url.href === captureUrl.href;
    };
    route = new Route(matchCallback, handler, method);
  } else if (capture instanceof RegExp) {
    route = new RegExpRoute(capture, handler, method);
  } else if (typeof capture === "function") {
    route = new Route(capture, handler, method);
  } else if (capture instanceof Route) {
    route = capture;
  } else {
    throw new WorkboxError2("unsupported-route-type", {
      moduleName: "workbox-routing",
      funcName: "registerRoute",
      paramName: "capture"
    });
  }
  const defaultRouter2 = getOrCreateDefaultRouter();
  defaultRouter2.registerRoute(route);
  return route;
}

// node_modules/workbox-routing/setCatchHandler.js
function setCatchHandler(handler) {
  const defaultRouter2 = getOrCreateDefaultRouter();
  defaultRouter2.setCatchHandler(handler);
}

// node_modules/workbox-strategies/node_modules/workbox-core/_version.js
try {
  self["workbox:core:5.1.4"] && _();
} catch (e) {
}

// node_modules/workbox-strategies/node_modules/workbox-core/models/messages/messages.js
var messages3 = {
  "invalid-value": ({ paramName, validValueDescription, value }) => {
    if (!paramName || !validValueDescription) {
      throw new Error(`Unexpected input to 'invalid-value' error.`);
    }
    return `The '${paramName}' parameter was given a value with an unexpected value. ${validValueDescription} Received a value of ${JSON.stringify(value)}.`;
  },
  "not-an-array": ({ moduleName, className, funcName, paramName }) => {
    if (!moduleName || !className || !funcName || !paramName) {
      throw new Error(`Unexpected input to 'not-an-array' error.`);
    }
    return `The parameter '${paramName}' passed into '${moduleName}.${className}.${funcName}()' must be an array.`;
  },
  "incorrect-type": ({ expectedType, paramName, moduleName, className, funcName }) => {
    if (!expectedType || !paramName || !moduleName || !funcName) {
      throw new Error(`Unexpected input to 'incorrect-type' error.`);
    }
    return `The parameter '${paramName}' passed into '${moduleName}.${className ? className + "." : ""}${funcName}()' must be of type ${expectedType}.`;
  },
  "incorrect-class": ({ expectedClass, paramName, moduleName, className, funcName, isReturnValueProblem }) => {
    if (!expectedClass || !moduleName || !funcName) {
      throw new Error(`Unexpected input to 'incorrect-class' error.`);
    }
    if (isReturnValueProblem) {
      return `The return value from '${moduleName}.${className ? className + "." : ""}${funcName}()' must be an instance of class ${expectedClass.name}.`;
    }
    return `The parameter '${paramName}' passed into '${moduleName}.${className ? className + "." : ""}${funcName}()' must be an instance of class ${expectedClass.name}.`;
  },
  "missing-a-method": ({ expectedMethod, paramName, moduleName, className, funcName }) => {
    if (!expectedMethod || !paramName || !moduleName || !className || !funcName) {
      throw new Error(`Unexpected input to 'missing-a-method' error.`);
    }
    return `${moduleName}.${className}.${funcName}() expected the '${paramName}' parameter to expose a '${expectedMethod}' method.`;
  },
  "add-to-cache-list-unexpected-type": ({ entry }) => {
    return `An unexpected entry was passed to 'workbox-precaching.PrecacheController.addToCacheList()' The entry '${JSON.stringify(entry)}' isn't supported. You must supply an array of strings with one or more characters, objects with a url property or Request objects.`;
  },
  "add-to-cache-list-conflicting-entries": ({ firstEntry, secondEntry }) => {
    if (!firstEntry || !secondEntry) {
      throw new Error(`Unexpected input to 'add-to-cache-list-duplicate-entries' error.`);
    }
    return `Two of the entries passed to 'workbox-precaching.PrecacheController.addToCacheList()' had the URL ${firstEntry._entryId} but different revision details. Workbox is unable to cache and version the asset correctly. Please remove one of the entries.`;
  },
  "plugin-error-request-will-fetch": ({ thrownError }) => {
    if (!thrownError) {
      throw new Error(`Unexpected input to 'plugin-error-request-will-fetch', error.`);
    }
    return `An error was thrown by a plugins 'requestWillFetch()' method. The thrown error message was: '${thrownError.message}'.`;
  },
  "invalid-cache-name": ({ cacheNameId, value }) => {
    if (!cacheNameId) {
      throw new Error(`Expected a 'cacheNameId' for error 'invalid-cache-name'`);
    }
    return `You must provide a name containing at least one character for setCacheDetails({${cacheNameId}: '...'}). Received a value of '${JSON.stringify(value)}'`;
  },
  "unregister-route-but-not-found-with-method": ({ method }) => {
    if (!method) {
      throw new Error(`Unexpected input to 'unregister-route-but-not-found-with-method' error.`);
    }
    return `The route you're trying to unregister was not  previously registered for the method type '${method}'.`;
  },
  "unregister-route-route-not-registered": () => {
    return `The route you're trying to unregister was not previously registered.`;
  },
  "queue-replay-failed": ({ name }) => {
    return `Replaying the background sync queue '${name}' failed.`;
  },
  "duplicate-queue-name": ({ name }) => {
    return `The Queue name '${name}' is already being used. All instances of backgroundSync.Queue must be given unique names.`;
  },
  "expired-test-without-max-age": ({ methodName, paramName }) => {
    return `The '${methodName}()' method can only be used when the '${paramName}' is used in the constructor.`;
  },
  "unsupported-route-type": ({ moduleName, className, funcName, paramName }) => {
    return `The supplied '${paramName}' parameter was an unsupported type. Please check the docs for ${moduleName}.${className}.${funcName} for valid input types.`;
  },
  "not-array-of-class": ({ value, expectedClass, moduleName, className, funcName, paramName }) => {
    return `The supplied '${paramName}' parameter must be an array of '${expectedClass}' objects. Received '${JSON.stringify(value)},'. Please check the call to ${moduleName}.${className}.${funcName}() to fix the issue.`;
  },
  "max-entries-or-age-required": ({ moduleName, className, funcName }) => {
    return `You must define either config.maxEntries or config.maxAgeSecondsin ${moduleName}.${className}.${funcName}`;
  },
  "statuses-or-headers-required": ({ moduleName, className, funcName }) => {
    return `You must define either config.statuses or config.headersin ${moduleName}.${className}.${funcName}`;
  },
  "invalid-string": ({ moduleName, funcName, paramName }) => {
    if (!paramName || !moduleName || !funcName) {
      throw new Error(`Unexpected input to 'invalid-string' error.`);
    }
    return `When using strings, the '${paramName}' parameter must start with 'http' (for cross-origin matches) or '/' (for same-origin matches). Please see the docs for ${moduleName}.${funcName}() for more info.`;
  },
  "channel-name-required": () => {
    return `You must provide a channelName to construct a BroadcastCacheUpdate instance.`;
  },
  "invalid-responses-are-same-args": () => {
    return `The arguments passed into responsesAreSame() appear to be invalid. Please ensure valid Responses are used.`;
  },
  "expire-custom-caches-only": () => {
    return `You must provide a 'cacheName' property when using the expiration plugin with a runtime caching strategy.`;
  },
  "unit-must-be-bytes": ({ normalizedRangeHeader }) => {
    if (!normalizedRangeHeader) {
      throw new Error(`Unexpected input to 'unit-must-be-bytes' error.`);
    }
    return `The 'unit' portion of the Range header must be set to 'bytes'. The Range header provided was "${normalizedRangeHeader}"`;
  },
  "single-range-only": ({ normalizedRangeHeader }) => {
    if (!normalizedRangeHeader) {
      throw new Error(`Unexpected input to 'single-range-only' error.`);
    }
    return `Multiple ranges are not supported. Please use a  single start value, and optional end value. The Range header provided was "${normalizedRangeHeader}"`;
  },
  "invalid-range-values": ({ normalizedRangeHeader }) => {
    if (!normalizedRangeHeader) {
      throw new Error(`Unexpected input to 'invalid-range-values' error.`);
    }
    return `The Range header is missing both start and end values. At least one of those values is needed. The Range header provided was "${normalizedRangeHeader}"`;
  },
  "no-range-header": () => {
    return `No Range header was found in the Request provided.`;
  },
  "range-not-satisfiable": ({ size, start, end }) => {
    return `The start (${start}) and end (${end}) values in the Range are not satisfiable by the cached response, which is ${size} bytes.`;
  },
  "attempt-to-cache-non-get-request": ({ url, method }) => {
    return `Unable to cache '${url}' because it is a '${method}' request and only 'GET' requests can be cached.`;
  },
  "cache-put-with-no-response": ({ url }) => {
    return `There was an attempt to cache '${url}' but the response was not defined.`;
  },
  "no-response": ({ url, error }) => {
    let message = `The strategy could not generate a response for '${url}'.`;
    if (error) {
      message += ` The underlying error is ${error}.`;
    }
    return message;
  },
  "bad-precaching-response": ({ url, status }) => {
    return `The precaching request for '${url}' failed with an HTTP status of ${status}.`;
  },
  "non-precached-url": ({ url }) => {
    return `createHandlerBoundToURL('${url}') was called, but that URL is not precached. Please pass in a URL that is precached instead.`;
  },
  "add-to-cache-list-conflicting-integrities": ({ url }) => {
    return `Two of the entries passed to 'workbox-precaching.PrecacheController.addToCacheList()' had the URL ${url} with different integrity values. Please remove one of them.`;
  },
  "missing-precache-entry": ({ cacheName, url }) => {
    return `Unable to find a precached response in ${cacheName} for ${url}.`;
  }
};

// node_modules/workbox-strategies/node_modules/workbox-core/models/messages/messageGenerator.js
var generatorFunction3 = (code, details = {}) => {
  const message = messages3[code];
  if (!message) {
    throw new Error(`Unable to find message for code '${code}'.`);
  }
  return message(details);
};
var messageGenerator3 = false ? fallback : generatorFunction3;

// node_modules/workbox-strategies/node_modules/workbox-core/_private/WorkboxError.js
var WorkboxError3 = class extends Error {
  /**
   *
   * @param {string} errorCode The error code that
   * identifies this particular error.
   * @param {Object=} details Any relevant arguments
   * that will help developers identify issues should
   * be added as a key on the context object.
   */
  constructor(errorCode, details) {
    const message = messageGenerator3(errorCode, details);
    super(message);
    this.name = errorCode;
    this.details = details;
  }
};

// node_modules/workbox-strategies/node_modules/workbox-core/_private/assert.js
var isArray3 = (value, details) => {
  if (!Array.isArray(value)) {
    throw new WorkboxError3("not-an-array", details);
  }
};
var hasMethod3 = (object, expectedMethod, details) => {
  const type = typeof object[expectedMethod];
  if (type !== "function") {
    details["expectedMethod"] = expectedMethod;
    throw new WorkboxError3("missing-a-method", details);
  }
};
var isType3 = (object, expectedType, details) => {
  if (typeof object !== expectedType) {
    details["expectedType"] = expectedType;
    throw new WorkboxError3("incorrect-type", details);
  }
};
var isInstance3 = (object, expectedClass, details) => {
  if (!(object instanceof expectedClass)) {
    details["expectedClass"] = expectedClass;
    throw new WorkboxError3("incorrect-class", details);
  }
};
var isOneOf3 = (value, validValues, details) => {
  if (!validValues.includes(value)) {
    details["validValueDescription"] = `Valid values are ${JSON.stringify(validValues)}.`;
    throw new WorkboxError3("invalid-value", details);
  }
};
var isArrayOfClass3 = (value, expectedClass, details) => {
  const error = new WorkboxError3("not-array-of-class", details);
  if (!Array.isArray(value)) {
    throw error;
  }
  for (const item of value) {
    if (!(item instanceof expectedClass)) {
      throw error;
    }
  }
};
var finalAssertExports3 = false ? null : {
  hasMethod: hasMethod3,
  isArray: isArray3,
  isInstance: isInstance3,
  isOneOf: isOneOf3,
  isType: isType3,
  isArrayOfClass: isArrayOfClass3
};

// node_modules/workbox-strategies/node_modules/workbox-core/_private/cacheNames.js
var _cacheNameDetails2 = {
  googleAnalytics: "googleAnalytics",
  precache: "precache-v2",
  prefix: "workbox",
  runtime: "runtime",
  suffix: typeof registration !== "undefined" ? registration.scope : ""
};
var _createCacheName2 = (cacheName) => {
  return [_cacheNameDetails2.prefix, cacheName, _cacheNameDetails2.suffix].filter((value) => value && value.length > 0).join("-");
};
var eachCacheNameDetail2 = (fn) => {
  for (const key of Object.keys(_cacheNameDetails2)) {
    fn(key);
  }
};
var cacheNames2 = {
  updateDetails: (details) => {
    eachCacheNameDetail2((key) => {
      if (typeof details[key] === "string") {
        _cacheNameDetails2[key] = details[key];
      }
    });
  },
  getGoogleAnalyticsName: (userCacheName) => {
    return userCacheName || _createCacheName2(_cacheNameDetails2.googleAnalytics);
  },
  getPrecacheName: (userCacheName) => {
    return userCacheName || _createCacheName2(_cacheNameDetails2.precache);
  },
  getPrefix: () => {
    return _cacheNameDetails2.prefix;
  },
  getRuntimeName: (userCacheName) => {
    return userCacheName || _createCacheName2(_cacheNameDetails2.runtime);
  },
  getSuffix: () => {
    return _cacheNameDetails2.suffix;
  }
};

// node_modules/workbox-strategies/node_modules/workbox-core/_private/logger.js
var logger3 = false ? null : (() => {
  if (!("__WB_DISABLE_DEV_LOGS" in self)) {
    self.__WB_DISABLE_DEV_LOGS = false;
  }
  let inGroup = false;
  const methodToColorMap = {
    debug: `#7f8c8d`,
    log: `#2ecc71`,
    warn: `#f39c12`,
    error: `#c0392b`,
    groupCollapsed: `#3498db`,
    groupEnd: null
  };
  const print = function(method, args) {
    if (self.__WB_DISABLE_DEV_LOGS) {
      return;
    }
    if (method === "groupCollapsed") {
      if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        console[method](...args);
        return;
      }
    }
    const styles = [
      `background: ${methodToColorMap[method]}`,
      `border-radius: 0.5em`,
      `color: white`,
      `font-weight: bold`,
      `padding: 2px 0.5em`
    ];
    const logPrefix = inGroup ? [] : ["%cworkbox", styles.join(";")];
    console[method](...logPrefix, ...args);
    if (method === "groupCollapsed") {
      inGroup = true;
    }
    if (method === "groupEnd") {
      inGroup = false;
    }
  };
  const api = {};
  const loggerMethods = Object.keys(methodToColorMap);
  for (const key of loggerMethods) {
    const method = key;
    api[method] = (...args) => {
      print(method, args);
    };
  }
  return api;
})();

// node_modules/workbox-strategies/node_modules/workbox-core/models/quotaErrorCallbacks.js
var quotaErrorCallbacks2 = /* @__PURE__ */ new Set();

// node_modules/workbox-strategies/node_modules/workbox-core/_private/executeQuotaErrorCallbacks.js
async function executeQuotaErrorCallbacks2() {
  if (true) {
    logger3.log(`About to run ${quotaErrorCallbacks2.size} callbacks to clean up caches.`);
  }
  for (const callback of quotaErrorCallbacks2) {
    await callback();
    if (true) {
      logger3.log(callback, "is complete.");
    }
  }
  if (true) {
    logger3.log("Finished running callbacks.");
  }
}

// node_modules/workbox-strategies/node_modules/workbox-core/_private/getFriendlyURL.js
var getFriendlyURL3 = (url) => {
  const urlObj = new URL(String(url), location.href);
  return urlObj.href.replace(new RegExp(`^${location.origin}`), "");
};

// node_modules/workbox-strategies/node_modules/workbox-core/utils/pluginUtils.js
var pluginUtils2 = {
  filter: (plugins2, callbackName) => {
    return plugins2.filter((plugin) => callbackName in plugin);
  }
};

// node_modules/workbox-strategies/node_modules/workbox-core/_private/cacheWrapper.js
var _getEffectiveRequest2 = async ({ request, mode, plugins: plugins2 = [] }) => {
  const cacheKeyWillBeUsedPlugins = pluginUtils2.filter(
    plugins2,
    "cacheKeyWillBeUsed"
    /* CACHE_KEY_WILL_BE_USED */
  );
  let effectiveRequest = request;
  for (const plugin of cacheKeyWillBeUsedPlugins) {
    effectiveRequest = await plugin[
      "cacheKeyWillBeUsed"
      /* CACHE_KEY_WILL_BE_USED */
    ].call(plugin, { mode, request: effectiveRequest });
    if (typeof effectiveRequest === "string") {
      effectiveRequest = new Request(effectiveRequest);
    }
    if (true) {
      finalAssertExports3.isInstance(effectiveRequest, Request, {
        moduleName: "Plugin",
        funcName: "cacheKeyWillBeUsed",
        isReturnValueProblem: true
      });
    }
  }
  return effectiveRequest;
};
var _isResponseSafeToCache2 = async ({ request, response, event, plugins: plugins2 = [] }) => {
  let responseToCache = response;
  let pluginsUsed = false;
  for (const plugin of plugins2) {
    if ("cacheWillUpdate" in plugin) {
      pluginsUsed = true;
      const pluginMethod = plugin[
        "cacheWillUpdate"
        /* CACHE_WILL_UPDATE */
      ];
      responseToCache = await pluginMethod.call(plugin, {
        request,
        response: responseToCache,
        event
      });
      if (true) {
        if (responseToCache) {
          finalAssertExports3.isInstance(responseToCache, Response, {
            moduleName: "Plugin",
            funcName: "cacheWillUpdate",
            isReturnValueProblem: true
          });
        }
      }
      if (!responseToCache) {
        break;
      }
    }
  }
  if (!pluginsUsed) {
    if (true) {
      if (responseToCache) {
        if (responseToCache.status !== 200) {
          if (responseToCache.status === 0) {
            logger3.warn(`The response for '${request.url}' is an opaque response. The caching strategy that you're using will not cache opaque responses by default.`);
          } else {
            logger3.debug(`The response for '${request.url}' returned a status code of '${response.status}' and won't be cached as a result.`);
          }
        }
      }
    }
    responseToCache = responseToCache && responseToCache.status === 200 ? responseToCache : void 0;
  }
  return responseToCache ? responseToCache : null;
};
var matchWrapper2 = async ({ cacheName, request, event, matchOptions, plugins: plugins2 = [] }) => {
  const cache = await self.caches.open(cacheName);
  const effectiveRequest = await _getEffectiveRequest2({
    plugins: plugins2,
    request,
    mode: "read"
  });
  let cachedResponse = await cache.match(effectiveRequest, matchOptions);
  if (true) {
    if (cachedResponse) {
      logger3.debug(`Found a cached response in '${cacheName}'.`);
    } else {
      logger3.debug(`No cached response found in '${cacheName}'.`);
    }
  }
  for (const plugin of plugins2) {
    if ("cachedResponseWillBeUsed" in plugin) {
      const pluginMethod = plugin[
        "cachedResponseWillBeUsed"
        /* CACHED_RESPONSE_WILL_BE_USED */
      ];
      cachedResponse = await pluginMethod.call(plugin, {
        cacheName,
        event,
        matchOptions,
        cachedResponse,
        request: effectiveRequest
      });
      if (true) {
        if (cachedResponse) {
          finalAssertExports3.isInstance(cachedResponse, Response, {
            moduleName: "Plugin",
            funcName: "cachedResponseWillBeUsed",
            isReturnValueProblem: true
          });
        }
      }
    }
  }
  return cachedResponse;
};
var putWrapper2 = async ({ cacheName, request, response, event, plugins: plugins2 = [], matchOptions }) => {
  if (true) {
    if (request.method && request.method !== "GET") {
      throw new WorkboxError3("attempt-to-cache-non-get-request", {
        url: getFriendlyURL3(request.url),
        method: request.method
      });
    }
  }
  const effectiveRequest = await _getEffectiveRequest2({
    plugins: plugins2,
    request,
    mode: "write"
  });
  if (!response) {
    if (true) {
      logger3.error(`Cannot cache non-existent response for '${getFriendlyURL3(effectiveRequest.url)}'.`);
    }
    throw new WorkboxError3("cache-put-with-no-response", {
      url: getFriendlyURL3(effectiveRequest.url)
    });
  }
  const responseToCache = await _isResponseSafeToCache2({
    event,
    plugins: plugins2,
    response,
    request: effectiveRequest
  });
  if (!responseToCache) {
    if (true) {
      logger3.debug(`Response '${getFriendlyURL3(effectiveRequest.url)}' will not be cached.`, responseToCache);
    }
    return;
  }
  const cache = await self.caches.open(cacheName);
  const updatePlugins = pluginUtils2.filter(
    plugins2,
    "cacheDidUpdate"
    /* CACHE_DID_UPDATE */
  );
  const oldResponse = updatePlugins.length > 0 ? await matchWrapper2({ cacheName, matchOptions, request: effectiveRequest }) : null;
  if (true) {
    logger3.debug(`Updating the '${cacheName}' cache with a new Response for ${getFriendlyURL3(effectiveRequest.url)}.`);
  }
  try {
    await cache.put(effectiveRequest, responseToCache);
  } catch (error) {
    if (error.name === "QuotaExceededError") {
      await executeQuotaErrorCallbacks2();
    }
    throw error;
  }
  for (const plugin of updatePlugins) {
    await plugin[
      "cacheDidUpdate"
      /* CACHE_DID_UPDATE */
    ].call(plugin, {
      cacheName,
      event,
      oldResponse,
      newResponse: responseToCache,
      request: effectiveRequest
    });
  }
};
var cacheWrapper2 = {
  put: putWrapper2,
  match: matchWrapper2
};

// node_modules/workbox-strategies/node_modules/workbox-core/_private/fetchWrapper.js
var wrappedFetch2 = async ({ request, fetchOptions, event, plugins: plugins2 = [] }) => {
  if (typeof request === "string") {
    request = new Request(request);
  }
  if (event instanceof FetchEvent && event.preloadResponse) {
    const possiblePreloadResponse = await event.preloadResponse;
    if (possiblePreloadResponse) {
      if (true) {
        logger3.log(`Using a preloaded navigation response for '${getFriendlyURL3(request.url)}'`);
      }
      return possiblePreloadResponse;
    }
  }
  if (true) {
    finalAssertExports3.isInstance(request, Request, {
      paramName: "request",
      expectedClass: Request,
      moduleName: "workbox-core",
      className: "fetchWrapper",
      funcName: "wrappedFetch"
    });
  }
  const failedFetchPlugins = pluginUtils2.filter(
    plugins2,
    "fetchDidFail"
    /* FETCH_DID_FAIL */
  );
  const originalRequest = failedFetchPlugins.length > 0 ? request.clone() : null;
  try {
    for (const plugin of plugins2) {
      if ("requestWillFetch" in plugin) {
        const pluginMethod = plugin[
          "requestWillFetch"
          /* REQUEST_WILL_FETCH */
        ];
        const requestClone = request.clone();
        request = await pluginMethod.call(plugin, {
          request: requestClone,
          event
        });
        if (true) {
          if (request) {
            finalAssertExports3.isInstance(request, Request, {
              moduleName: "Plugin",
              funcName: "cachedResponseWillBeUsed",
              isReturnValueProblem: true
            });
          }
        }
      }
    }
  } catch (err) {
    throw new WorkboxError3("plugin-error-request-will-fetch", {
      thrownError: err
    });
  }
  const pluginFilteredRequest = request.clone();
  try {
    let fetchResponse;
    if (request.mode === "navigate") {
      fetchResponse = await fetch(request);
    } else {
      fetchResponse = await fetch(request, fetchOptions);
    }
    if (true) {
      logger3.debug(`Network request for '${getFriendlyURL3(request.url)}' returned a response with status '${fetchResponse.status}'.`);
    }
    for (const plugin of plugins2) {
      if ("fetchDidSucceed" in plugin) {
        fetchResponse = await plugin[
          "fetchDidSucceed"
          /* FETCH_DID_SUCCEED */
        ].call(plugin, {
          event,
          request: pluginFilteredRequest,
          response: fetchResponse
        });
        if (true) {
          if (fetchResponse) {
            finalAssertExports3.isInstance(fetchResponse, Response, {
              moduleName: "Plugin",
              funcName: "fetchDidSucceed",
              isReturnValueProblem: true
            });
          }
        }
      }
    }
    return fetchResponse;
  } catch (error) {
    if (true) {
      logger3.error(`Network request for '${getFriendlyURL3(request.url)}' threw an error.`, error);
    }
    for (const plugin of failedFetchPlugins) {
      await plugin[
        "fetchDidFail"
        /* FETCH_DID_FAIL */
      ].call(plugin, {
        error,
        event,
        originalRequest: originalRequest.clone(),
        request: pluginFilteredRequest.clone()
      });
    }
    throw error;
  }
};
var fetchWrapper2 = {
  fetch: wrappedFetch2
};

// node_modules/workbox-strategies/_version.js
try {
  self["workbox:strategies:5.1.4"] && _();
} catch (e) {
}

// node_modules/workbox-strategies/utils/messages.js
var messages4 = {
  strategyStart: (strategyName, request) => `Using ${strategyName} to respond to '${getFriendlyURL3(request.url)}'`,
  printFinalResponse: (response) => {
    if (response) {
      logger3.groupCollapsed(`View the final response here.`);
      logger3.log(response || "[No response returned]");
      logger3.groupEnd();
    }
  }
};

// node_modules/workbox-strategies/CacheFirst.js
var CacheFirst = class {
  /**
   * @param {Object} options
   * @param {string} options.cacheName Cache name to store and retrieve
   * requests. Defaults to cache names provided by
   * [workbox-core]{@link module:workbox-core.cacheNames}.
   * @param {Array<Object>} options.plugins [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} options.fetchOptions Values passed along to the
   * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
   * of all fetch() requests made by this strategy.
   * @param {Object} options.matchOptions [`CacheQueryOptions`](https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions)
   */
  constructor(options = {}) {
    this._cacheName = cacheNames2.getRuntimeName(options.cacheName);
    this._plugins = options.plugins || [];
    this._fetchOptions = options.fetchOptions;
    this._matchOptions = options.matchOptions;
  }
  /**
   * This method will perform a request strategy and follows an API that
   * will work with the
   * [Workbox Router]{@link module:workbox-routing.Router}.
   *
   * @param {Object} options
   * @param {Request|string} options.request A request to run this strategy for.
   * @param {Event} [options.event] The event that triggered the request.
   * @return {Promise<Response>}
   */
  async handle({ event, request }) {
    const logs = [];
    if (typeof request === "string") {
      request = new Request(request);
    }
    if (true) {
      finalAssertExports3.isInstance(request, Request, {
        moduleName: "workbox-strategies",
        className: "CacheFirst",
        funcName: "makeRequest",
        paramName: "request"
      });
    }
    let response = await cacheWrapper2.match({
      cacheName: this._cacheName,
      request,
      event,
      matchOptions: this._matchOptions,
      plugins: this._plugins
    });
    let error;
    if (!response) {
      if (true) {
        logs.push(`No response found in the '${this._cacheName}' cache. Will respond with a network request.`);
      }
      try {
        response = await this._getFromNetwork(request, event);
      } catch (err) {
        error = err;
      }
      if (true) {
        if (response) {
          logs.push(`Got response from network.`);
        } else {
          logs.push(`Unable to get a response from the network.`);
        }
      }
    } else {
      if (true) {
        logs.push(`Found a cached response in the '${this._cacheName}' cache.`);
      }
    }
    if (true) {
      logger3.groupCollapsed(messages4.strategyStart("CacheFirst", request));
      for (const log of logs) {
        logger3.log(log);
      }
      messages4.printFinalResponse(response);
      logger3.groupEnd();
    }
    if (!response) {
      throw new WorkboxError3("no-response", { url: request.url, error });
    }
    return response;
  }
  /**
   * Handles the network and cache part of CacheFirst.
   *
   * @param {Request} request
   * @param {Event} [event]
   * @return {Promise<Response>}
   *
   * @private
   */
  async _getFromNetwork(request, event) {
    const response = await fetchWrapper2.fetch({
      request,
      event,
      fetchOptions: this._fetchOptions,
      plugins: this._plugins
    });
    const responseClone = response.clone();
    const cachePutPromise = cacheWrapper2.put({
      cacheName: this._cacheName,
      request,
      response: responseClone,
      event,
      plugins: this._plugins
    });
    if (event) {
      try {
        event.waitUntil(cachePutPromise);
      } catch (error) {
        if (true) {
          logger3.warn(`Unable to ensure service worker stays alive when updating cache for '${getFriendlyURL3(request.url)}'.`);
        }
      }
    }
    return response;
  }
};

// node_modules/workbox-strategies/plugins/cacheOkAndOpaquePlugin.js
var cacheOkAndOpaquePlugin = {
  /**
   * Returns a valid response (to allow caching) if the status is 200 (OK) or
   * 0 (opaque).
   *
   * @param {Object} options
   * @param {Response} options.response
   * @return {Response|null}
   *
   * @private
   */
  cacheWillUpdate: async ({ response }) => {
    if (response.status === 200 || response.status === 0) {
      return response;
    }
    return null;
  }
};

// node_modules/workbox-strategies/NetworkFirst.js
var NetworkFirst = class {
  /**
   * @param {Object} options
   * @param {string} options.cacheName Cache name to store and retrieve
   * requests. Defaults to cache names provided by
   * [workbox-core]{@link module:workbox-core.cacheNames}.
   * @param {Array<Object>} options.plugins [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} options.fetchOptions Values passed along to the
   * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
   * of all fetch() requests made by this strategy.
   * @param {Object} options.matchOptions [`CacheQueryOptions`](https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions)
   * @param {number} options.networkTimeoutSeconds If set, any network requests
   * that fail to respond within the timeout will fallback to the cache.
   *
   * This option can be used to combat
   * "[lie-fi]{@link https://developers.google.com/web/fundamentals/performance/poor-connectivity/#lie-fi}"
   * scenarios.
   */
  constructor(options = {}) {
    this._cacheName = cacheNames2.getRuntimeName(options.cacheName);
    if (options.plugins) {
      const isUsingCacheWillUpdate = options.plugins.some((plugin) => !!plugin.cacheWillUpdate);
      this._plugins = isUsingCacheWillUpdate ? options.plugins : [cacheOkAndOpaquePlugin, ...options.plugins];
    } else {
      this._plugins = [cacheOkAndOpaquePlugin];
    }
    this._networkTimeoutSeconds = options.networkTimeoutSeconds || 0;
    if (true) {
      if (this._networkTimeoutSeconds) {
        finalAssertExports3.isType(this._networkTimeoutSeconds, "number", {
          moduleName: "workbox-strategies",
          className: "NetworkFirst",
          funcName: "constructor",
          paramName: "networkTimeoutSeconds"
        });
      }
    }
    this._fetchOptions = options.fetchOptions;
    this._matchOptions = options.matchOptions;
  }
  /**
   * This method will perform a request strategy and follows an API that
   * will work with the
   * [Workbox Router]{@link module:workbox-routing.Router}.
   *
   * @param {Object} options
   * @param {Request|string} options.request A request to run this strategy for.
   * @param {Event} [options.event] The event that triggered the request.
   * @return {Promise<Response>}
   */
  async handle({ event, request }) {
    const logs = [];
    if (typeof request === "string") {
      request = new Request(request);
    }
    if (true) {
      finalAssertExports3.isInstance(request, Request, {
        moduleName: "workbox-strategies",
        className: "NetworkFirst",
        funcName: "handle",
        paramName: "makeRequest"
      });
    }
    const promises = [];
    let timeoutId;
    if (this._networkTimeoutSeconds) {
      const { id, promise } = this._getTimeoutPromise({ request, event, logs });
      timeoutId = id;
      promises.push(promise);
    }
    const networkPromise = this._getNetworkPromise({ timeoutId, request, event, logs });
    promises.push(networkPromise);
    let response = await Promise.race(promises);
    if (!response) {
      response = await networkPromise;
    }
    if (true) {
      logger3.groupCollapsed(messages4.strategyStart("NetworkFirst", request));
      for (const log of logs) {
        logger3.log(log);
      }
      messages4.printFinalResponse(response);
      logger3.groupEnd();
    }
    if (!response) {
      throw new WorkboxError3("no-response", { url: request.url });
    }
    return response;
  }
  /**
   * @param {Object} options
   * @param {Request} options.request
   * @param {Array} options.logs A reference to the logs array
   * @param {Event} [options.event]
   * @return {Promise<Response>}
   *
   * @private
   */
  _getTimeoutPromise({ request, logs, event }) {
    let timeoutId;
    const timeoutPromise = new Promise((resolve) => {
      const onNetworkTimeout = async () => {
        if (true) {
          logs.push(`Timing out the network response at ${this._networkTimeoutSeconds} seconds.`);
        }
        resolve(await this._respondFromCache({ request, event }));
      };
      timeoutId = setTimeout(onNetworkTimeout, this._networkTimeoutSeconds * 1e3);
    });
    return {
      promise: timeoutPromise,
      id: timeoutId
    };
  }
  /**
   * @param {Object} options
   * @param {number|undefined} options.timeoutId
   * @param {Request} options.request
   * @param {Array} options.logs A reference to the logs Array.
   * @param {Event} [options.event]
   * @return {Promise<Response>}
   *
   * @private
   */
  async _getNetworkPromise({ timeoutId, request, logs, event }) {
    let error;
    let response;
    try {
      response = await fetchWrapper2.fetch({
        request,
        event,
        fetchOptions: this._fetchOptions,
        plugins: this._plugins
      });
    } catch (err) {
      error = err;
    }
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (true) {
      if (response) {
        logs.push(`Got response from network.`);
      } else {
        logs.push(`Unable to get a response from the network. Will respond with a cached response.`);
      }
    }
    if (error || !response) {
      response = await this._respondFromCache({ request, event });
      if (true) {
        if (response) {
          logs.push(`Found a cached response in the '${this._cacheName}' cache.`);
        } else {
          logs.push(`No response found in the '${this._cacheName}' cache.`);
        }
      }
    } else {
      const responseClone = response.clone();
      const cachePut = cacheWrapper2.put({
        cacheName: this._cacheName,
        request,
        response: responseClone,
        event,
        plugins: this._plugins
      });
      if (event) {
        try {
          event.waitUntil(cachePut);
        } catch (err) {
          if (true) {
            logger3.warn(`Unable to ensure service worker stays alive when updating cache for '${getFriendlyURL3(request.url)}'.`);
          }
        }
      }
    }
    return response;
  }
  /**
   * Used if the network timeouts or fails to make the request.
   *
   * @param {Object} options
   * @param {Request} request The request to match in the cache
   * @param {Event} [options.event]
   * @return {Promise<Object>}
   *
   * @private
   */
  _respondFromCache({ event, request }) {
    return cacheWrapper2.match({
      cacheName: this._cacheName,
      request,
      event,
      matchOptions: this._matchOptions,
      plugins: this._plugins
    });
  }
};

// node_modules/workbox-strategies/StaleWhileRevalidate.js
var StaleWhileRevalidate = class {
  /**
   * @param {Object} options
   * @param {string} options.cacheName Cache name to store and retrieve
   * requests. Defaults to cache names provided by
   * [workbox-core]{@link module:workbox-core.cacheNames}.
   * @param {Array<Object>} options.plugins [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} options.fetchOptions Values passed along to the
   * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
   * of all fetch() requests made by this strategy.
   * @param {Object} options.matchOptions [`CacheQueryOptions`](https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions)
   */
  constructor(options = {}) {
    this._cacheName = cacheNames2.getRuntimeName(options.cacheName);
    this._plugins = options.plugins || [];
    if (options.plugins) {
      const isUsingCacheWillUpdate = options.plugins.some((plugin) => !!plugin.cacheWillUpdate);
      this._plugins = isUsingCacheWillUpdate ? options.plugins : [cacheOkAndOpaquePlugin, ...options.plugins];
    } else {
      this._plugins = [cacheOkAndOpaquePlugin];
    }
    this._fetchOptions = options.fetchOptions;
    this._matchOptions = options.matchOptions;
  }
  /**
   * This method will perform a request strategy and follows an API that
   * will work with the
   * [Workbox Router]{@link module:workbox-routing.Router}.
   *
   * @param {Object} options
   * @param {Request|string} options.request A request to run this strategy for.
   * @param {Event} [options.event] The event that triggered the request.
   * @return {Promise<Response>}
   */
  async handle({ event, request }) {
    const logs = [];
    if (typeof request === "string") {
      request = new Request(request);
    }
    if (true) {
      finalAssertExports3.isInstance(request, Request, {
        moduleName: "workbox-strategies",
        className: "StaleWhileRevalidate",
        funcName: "handle",
        paramName: "request"
      });
    }
    const fetchAndCachePromise = this._getFromNetwork({ request, event });
    let response = await cacheWrapper2.match({
      cacheName: this._cacheName,
      request,
      event,
      matchOptions: this._matchOptions,
      plugins: this._plugins
    });
    let error;
    if (response) {
      if (true) {
        logs.push(`Found a cached response in the '${this._cacheName}' cache. Will update with the network response in the background.`);
      }
      if (event) {
        try {
          event.waitUntil(fetchAndCachePromise);
        } catch (error2) {
          if (true) {
            logger3.warn(`Unable to ensure service worker stays alive when updating cache for '${getFriendlyURL3(request.url)}'.`);
          }
        }
      }
    } else {
      if (true) {
        logs.push(`No response found in the '${this._cacheName}' cache. Will wait for the network response.`);
      }
      try {
        response = await fetchAndCachePromise;
      } catch (err) {
        error = err;
      }
    }
    if (true) {
      logger3.groupCollapsed(messages4.strategyStart("StaleWhileRevalidate", request));
      for (const log of logs) {
        logger3.log(log);
      }
      messages4.printFinalResponse(response);
      logger3.groupEnd();
    }
    if (!response) {
      throw new WorkboxError3("no-response", { url: request.url, error });
    }
    return response;
  }
  /**
   * @param {Object} options
   * @param {Request} options.request
   * @param {Event} [options.event]
   * @return {Promise<Response>}
   *
   * @private
   */
  async _getFromNetwork({ request, event }) {
    const response = await fetchWrapper2.fetch({
      request,
      event,
      fetchOptions: this._fetchOptions,
      plugins: this._plugins
    });
    const cachePutPromise = cacheWrapper2.put({
      cacheName: this._cacheName,
      request,
      response: response.clone(),
      event,
      plugins: this._plugins
    });
    if (event) {
      try {
        event.waitUntil(cachePutPromise);
      } catch (error) {
        if (true) {
          logger3.warn(`Unable to ensure service worker stays alive when updating cache for '${getFriendlyURL3(request.url)}'.`);
        }
      }
    }
    return response;
  }
};

// node_modules/workbox-cacheable-response/node_modules/workbox-core/_version.js
try {
  self["workbox:core:5.1.4"] && _();
} catch (e) {
}

// node_modules/workbox-cacheable-response/node_modules/workbox-core/models/messages/messages.js
var messages5 = {
  "invalid-value": ({ paramName, validValueDescription, value }) => {
    if (!paramName || !validValueDescription) {
      throw new Error(`Unexpected input to 'invalid-value' error.`);
    }
    return `The '${paramName}' parameter was given a value with an unexpected value. ${validValueDescription} Received a value of ${JSON.stringify(value)}.`;
  },
  "not-an-array": ({ moduleName, className, funcName, paramName }) => {
    if (!moduleName || !className || !funcName || !paramName) {
      throw new Error(`Unexpected input to 'not-an-array' error.`);
    }
    return `The parameter '${paramName}' passed into '${moduleName}.${className}.${funcName}()' must be an array.`;
  },
  "incorrect-type": ({ expectedType, paramName, moduleName, className, funcName }) => {
    if (!expectedType || !paramName || !moduleName || !funcName) {
      throw new Error(`Unexpected input to 'incorrect-type' error.`);
    }
    return `The parameter '${paramName}' passed into '${moduleName}.${className ? className + "." : ""}${funcName}()' must be of type ${expectedType}.`;
  },
  "incorrect-class": ({ expectedClass, paramName, moduleName, className, funcName, isReturnValueProblem }) => {
    if (!expectedClass || !moduleName || !funcName) {
      throw new Error(`Unexpected input to 'incorrect-class' error.`);
    }
    if (isReturnValueProblem) {
      return `The return value from '${moduleName}.${className ? className + "." : ""}${funcName}()' must be an instance of class ${expectedClass.name}.`;
    }
    return `The parameter '${paramName}' passed into '${moduleName}.${className ? className + "." : ""}${funcName}()' must be an instance of class ${expectedClass.name}.`;
  },
  "missing-a-method": ({ expectedMethod, paramName, moduleName, className, funcName }) => {
    if (!expectedMethod || !paramName || !moduleName || !className || !funcName) {
      throw new Error(`Unexpected input to 'missing-a-method' error.`);
    }
    return `${moduleName}.${className}.${funcName}() expected the '${paramName}' parameter to expose a '${expectedMethod}' method.`;
  },
  "add-to-cache-list-unexpected-type": ({ entry }) => {
    return `An unexpected entry was passed to 'workbox-precaching.PrecacheController.addToCacheList()' The entry '${JSON.stringify(entry)}' isn't supported. You must supply an array of strings with one or more characters, objects with a url property or Request objects.`;
  },
  "add-to-cache-list-conflicting-entries": ({ firstEntry, secondEntry }) => {
    if (!firstEntry || !secondEntry) {
      throw new Error(`Unexpected input to 'add-to-cache-list-duplicate-entries' error.`);
    }
    return `Two of the entries passed to 'workbox-precaching.PrecacheController.addToCacheList()' had the URL ${firstEntry._entryId} but different revision details. Workbox is unable to cache and version the asset correctly. Please remove one of the entries.`;
  },
  "plugin-error-request-will-fetch": ({ thrownError }) => {
    if (!thrownError) {
      throw new Error(`Unexpected input to 'plugin-error-request-will-fetch', error.`);
    }
    return `An error was thrown by a plugins 'requestWillFetch()' method. The thrown error message was: '${thrownError.message}'.`;
  },
  "invalid-cache-name": ({ cacheNameId, value }) => {
    if (!cacheNameId) {
      throw new Error(`Expected a 'cacheNameId' for error 'invalid-cache-name'`);
    }
    return `You must provide a name containing at least one character for setCacheDetails({${cacheNameId}: '...'}). Received a value of '${JSON.stringify(value)}'`;
  },
  "unregister-route-but-not-found-with-method": ({ method }) => {
    if (!method) {
      throw new Error(`Unexpected input to 'unregister-route-but-not-found-with-method' error.`);
    }
    return `The route you're trying to unregister was not  previously registered for the method type '${method}'.`;
  },
  "unregister-route-route-not-registered": () => {
    return `The route you're trying to unregister was not previously registered.`;
  },
  "queue-replay-failed": ({ name }) => {
    return `Replaying the background sync queue '${name}' failed.`;
  },
  "duplicate-queue-name": ({ name }) => {
    return `The Queue name '${name}' is already being used. All instances of backgroundSync.Queue must be given unique names.`;
  },
  "expired-test-without-max-age": ({ methodName, paramName }) => {
    return `The '${methodName}()' method can only be used when the '${paramName}' is used in the constructor.`;
  },
  "unsupported-route-type": ({ moduleName, className, funcName, paramName }) => {
    return `The supplied '${paramName}' parameter was an unsupported type. Please check the docs for ${moduleName}.${className}.${funcName} for valid input types.`;
  },
  "not-array-of-class": ({ value, expectedClass, moduleName, className, funcName, paramName }) => {
    return `The supplied '${paramName}' parameter must be an array of '${expectedClass}' objects. Received '${JSON.stringify(value)},'. Please check the call to ${moduleName}.${className}.${funcName}() to fix the issue.`;
  },
  "max-entries-or-age-required": ({ moduleName, className, funcName }) => {
    return `You must define either config.maxEntries or config.maxAgeSecondsin ${moduleName}.${className}.${funcName}`;
  },
  "statuses-or-headers-required": ({ moduleName, className, funcName }) => {
    return `You must define either config.statuses or config.headersin ${moduleName}.${className}.${funcName}`;
  },
  "invalid-string": ({ moduleName, funcName, paramName }) => {
    if (!paramName || !moduleName || !funcName) {
      throw new Error(`Unexpected input to 'invalid-string' error.`);
    }
    return `When using strings, the '${paramName}' parameter must start with 'http' (for cross-origin matches) or '/' (for same-origin matches). Please see the docs for ${moduleName}.${funcName}() for more info.`;
  },
  "channel-name-required": () => {
    return `You must provide a channelName to construct a BroadcastCacheUpdate instance.`;
  },
  "invalid-responses-are-same-args": () => {
    return `The arguments passed into responsesAreSame() appear to be invalid. Please ensure valid Responses are used.`;
  },
  "expire-custom-caches-only": () => {
    return `You must provide a 'cacheName' property when using the expiration plugin with a runtime caching strategy.`;
  },
  "unit-must-be-bytes": ({ normalizedRangeHeader }) => {
    if (!normalizedRangeHeader) {
      throw new Error(`Unexpected input to 'unit-must-be-bytes' error.`);
    }
    return `The 'unit' portion of the Range header must be set to 'bytes'. The Range header provided was "${normalizedRangeHeader}"`;
  },
  "single-range-only": ({ normalizedRangeHeader }) => {
    if (!normalizedRangeHeader) {
      throw new Error(`Unexpected input to 'single-range-only' error.`);
    }
    return `Multiple ranges are not supported. Please use a  single start value, and optional end value. The Range header provided was "${normalizedRangeHeader}"`;
  },
  "invalid-range-values": ({ normalizedRangeHeader }) => {
    if (!normalizedRangeHeader) {
      throw new Error(`Unexpected input to 'invalid-range-values' error.`);
    }
    return `The Range header is missing both start and end values. At least one of those values is needed. The Range header provided was "${normalizedRangeHeader}"`;
  },
  "no-range-header": () => {
    return `No Range header was found in the Request provided.`;
  },
  "range-not-satisfiable": ({ size, start, end }) => {
    return `The start (${start}) and end (${end}) values in the Range are not satisfiable by the cached response, which is ${size} bytes.`;
  },
  "attempt-to-cache-non-get-request": ({ url, method }) => {
    return `Unable to cache '${url}' because it is a '${method}' request and only 'GET' requests can be cached.`;
  },
  "cache-put-with-no-response": ({ url }) => {
    return `There was an attempt to cache '${url}' but the response was not defined.`;
  },
  "no-response": ({ url, error }) => {
    let message = `The strategy could not generate a response for '${url}'.`;
    if (error) {
      message += ` The underlying error is ${error}.`;
    }
    return message;
  },
  "bad-precaching-response": ({ url, status }) => {
    return `The precaching request for '${url}' failed with an HTTP status of ${status}.`;
  },
  "non-precached-url": ({ url }) => {
    return `createHandlerBoundToURL('${url}') was called, but that URL is not precached. Please pass in a URL that is precached instead.`;
  },
  "add-to-cache-list-conflicting-integrities": ({ url }) => {
    return `Two of the entries passed to 'workbox-precaching.PrecacheController.addToCacheList()' had the URL ${url} with different integrity values. Please remove one of them.`;
  },
  "missing-precache-entry": ({ cacheName, url }) => {
    return `Unable to find a precached response in ${cacheName} for ${url}.`;
  }
};

// node_modules/workbox-cacheable-response/node_modules/workbox-core/models/messages/messageGenerator.js
var generatorFunction4 = (code, details = {}) => {
  const message = messages5[code];
  if (!message) {
    throw new Error(`Unable to find message for code '${code}'.`);
  }
  return message(details);
};
var messageGenerator4 = false ? fallback : generatorFunction4;

// node_modules/workbox-cacheable-response/node_modules/workbox-core/_private/WorkboxError.js
var WorkboxError4 = class extends Error {
  /**
   *
   * @param {string} errorCode The error code that
   * identifies this particular error.
   * @param {Object=} details Any relevant arguments
   * that will help developers identify issues should
   * be added as a key on the context object.
   */
  constructor(errorCode, details) {
    const message = messageGenerator4(errorCode, details);
    super(message);
    this.name = errorCode;
    this.details = details;
  }
};

// node_modules/workbox-cacheable-response/node_modules/workbox-core/_private/assert.js
var isArray4 = (value, details) => {
  if (!Array.isArray(value)) {
    throw new WorkboxError4("not-an-array", details);
  }
};
var hasMethod4 = (object, expectedMethod, details) => {
  const type = typeof object[expectedMethod];
  if (type !== "function") {
    details["expectedMethod"] = expectedMethod;
    throw new WorkboxError4("missing-a-method", details);
  }
};
var isType4 = (object, expectedType, details) => {
  if (typeof object !== expectedType) {
    details["expectedType"] = expectedType;
    throw new WorkboxError4("incorrect-type", details);
  }
};
var isInstance4 = (object, expectedClass, details) => {
  if (!(object instanceof expectedClass)) {
    details["expectedClass"] = expectedClass;
    throw new WorkboxError4("incorrect-class", details);
  }
};
var isOneOf4 = (value, validValues, details) => {
  if (!validValues.includes(value)) {
    details["validValueDescription"] = `Valid values are ${JSON.stringify(validValues)}.`;
    throw new WorkboxError4("invalid-value", details);
  }
};
var isArrayOfClass4 = (value, expectedClass, details) => {
  const error = new WorkboxError4("not-array-of-class", details);
  if (!Array.isArray(value)) {
    throw error;
  }
  for (const item of value) {
    if (!(item instanceof expectedClass)) {
      throw error;
    }
  }
};
var finalAssertExports4 = false ? null : {
  hasMethod: hasMethod4,
  isArray: isArray4,
  isInstance: isInstance4,
  isOneOf: isOneOf4,
  isType: isType4,
  isArrayOfClass: isArrayOfClass4
};

// node_modules/workbox-cacheable-response/node_modules/workbox-core/_private/getFriendlyURL.js
var getFriendlyURL4 = (url) => {
  const urlObj = new URL(String(url), location.href);
  return urlObj.href.replace(new RegExp(`^${location.origin}`), "");
};

// node_modules/workbox-cacheable-response/node_modules/workbox-core/_private/logger.js
var logger4 = false ? null : (() => {
  if (!("__WB_DISABLE_DEV_LOGS" in self)) {
    self.__WB_DISABLE_DEV_LOGS = false;
  }
  let inGroup = false;
  const methodToColorMap = {
    debug: `#7f8c8d`,
    log: `#2ecc71`,
    warn: `#f39c12`,
    error: `#c0392b`,
    groupCollapsed: `#3498db`,
    groupEnd: null
  };
  const print = function(method, args) {
    if (self.__WB_DISABLE_DEV_LOGS) {
      return;
    }
    if (method === "groupCollapsed") {
      if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        console[method](...args);
        return;
      }
    }
    const styles = [
      `background: ${methodToColorMap[method]}`,
      `border-radius: 0.5em`,
      `color: white`,
      `font-weight: bold`,
      `padding: 2px 0.5em`
    ];
    const logPrefix = inGroup ? [] : ["%cworkbox", styles.join(";")];
    console[method](...logPrefix, ...args);
    if (method === "groupCollapsed") {
      inGroup = true;
    }
    if (method === "groupEnd") {
      inGroup = false;
    }
  };
  const api = {};
  const loggerMethods = Object.keys(methodToColorMap);
  for (const key of loggerMethods) {
    const method = key;
    api[method] = (...args) => {
      print(method, args);
    };
  }
  return api;
})();

// node_modules/workbox-cacheable-response/_version.js
try {
  self["workbox:cacheable-response:5.1.4"] && _();
} catch (e) {
}

// node_modules/workbox-cacheable-response/CacheableResponse.js
var CacheableResponse = class {
  /**
   * To construct a new CacheableResponse instance you must provide at least
   * one of the `config` properties.
   *
   * If both `statuses` and `headers` are specified, then both conditions must
   * be met for the `Response` to be considered cacheable.
   *
   * @param {Object} config
   * @param {Array<number>} [config.statuses] One or more status codes that a
   * `Response` can have and be considered cacheable.
   * @param {Object<string,string>} [config.headers] A mapping of header names
   * and expected values that a `Response` can have and be considered cacheable.
   * If multiple headers are provided, only one needs to be present.
   */
  constructor(config = {}) {
    if (true) {
      if (!(config.statuses || config.headers)) {
        throw new WorkboxError4("statuses-or-headers-required", {
          moduleName: "workbox-cacheable-response",
          className: "CacheableResponse",
          funcName: "constructor"
        });
      }
      if (config.statuses) {
        finalAssertExports4.isArray(config.statuses, {
          moduleName: "workbox-cacheable-response",
          className: "CacheableResponse",
          funcName: "constructor",
          paramName: "config.statuses"
        });
      }
      if (config.headers) {
        finalAssertExports4.isType(config.headers, "object", {
          moduleName: "workbox-cacheable-response",
          className: "CacheableResponse",
          funcName: "constructor",
          paramName: "config.headers"
        });
      }
    }
    this._statuses = config.statuses;
    this._headers = config.headers;
  }
  /**
   * Checks a response to see whether it's cacheable or not, based on this
   * object's configuration.
   *
   * @param {Response} response The response whose cacheability is being
   * checked.
   * @return {boolean} `true` if the `Response` is cacheable, and `false`
   * otherwise.
   */
  isResponseCacheable(response) {
    if (true) {
      finalAssertExports4.isInstance(response, Response, {
        moduleName: "workbox-cacheable-response",
        className: "CacheableResponse",
        funcName: "isResponseCacheable",
        paramName: "response"
      });
    }
    let cacheable = true;
    if (this._statuses) {
      cacheable = this._statuses.includes(response.status);
    }
    if (this._headers && cacheable) {
      cacheable = Object.keys(this._headers).some((headerName) => {
        return response.headers.get(headerName) === this._headers[headerName];
      });
    }
    if (true) {
      if (!cacheable) {
        logger4.groupCollapsed(`The request for '${getFriendlyURL4(response.url)}' returned a response that does not meet the criteria for being cached.`);
        logger4.groupCollapsed(`View cacheability criteria here.`);
        logger4.log(`Cacheable statuses: ` + JSON.stringify(this._statuses));
        logger4.log(`Cacheable headers: ` + JSON.stringify(this._headers, null, 2));
        logger4.groupEnd();
        const logFriendlyHeaders = {};
        response.headers.forEach((value, key) => {
          logFriendlyHeaders[key] = value;
        });
        logger4.groupCollapsed(`View response status and headers here.`);
        logger4.log(`Response status: ` + response.status);
        logger4.log(`Response headers: ` + JSON.stringify(logFriendlyHeaders, null, 2));
        logger4.groupEnd();
        logger4.groupCollapsed(`View full response details here.`);
        logger4.log(response.headers);
        logger4.log(response);
        logger4.groupEnd();
        logger4.groupEnd();
      }
    }
    return cacheable;
  }
};

// node_modules/workbox-expiration/node_modules/workbox-core/_version.js
try {
  self["workbox:core:5.1.4"] && _();
} catch (e) {
}

// node_modules/workbox-expiration/node_modules/workbox-core/models/messages/messages.js
var messages6 = {
  "invalid-value": ({ paramName, validValueDescription, value }) => {
    if (!paramName || !validValueDescription) {
      throw new Error(`Unexpected input to 'invalid-value' error.`);
    }
    return `The '${paramName}' parameter was given a value with an unexpected value. ${validValueDescription} Received a value of ${JSON.stringify(value)}.`;
  },
  "not-an-array": ({ moduleName, className, funcName, paramName }) => {
    if (!moduleName || !className || !funcName || !paramName) {
      throw new Error(`Unexpected input to 'not-an-array' error.`);
    }
    return `The parameter '${paramName}' passed into '${moduleName}.${className}.${funcName}()' must be an array.`;
  },
  "incorrect-type": ({ expectedType, paramName, moduleName, className, funcName }) => {
    if (!expectedType || !paramName || !moduleName || !funcName) {
      throw new Error(`Unexpected input to 'incorrect-type' error.`);
    }
    return `The parameter '${paramName}' passed into '${moduleName}.${className ? className + "." : ""}${funcName}()' must be of type ${expectedType}.`;
  },
  "incorrect-class": ({ expectedClass, paramName, moduleName, className, funcName, isReturnValueProblem }) => {
    if (!expectedClass || !moduleName || !funcName) {
      throw new Error(`Unexpected input to 'incorrect-class' error.`);
    }
    if (isReturnValueProblem) {
      return `The return value from '${moduleName}.${className ? className + "." : ""}${funcName}()' must be an instance of class ${expectedClass.name}.`;
    }
    return `The parameter '${paramName}' passed into '${moduleName}.${className ? className + "." : ""}${funcName}()' must be an instance of class ${expectedClass.name}.`;
  },
  "missing-a-method": ({ expectedMethod, paramName, moduleName, className, funcName }) => {
    if (!expectedMethod || !paramName || !moduleName || !className || !funcName) {
      throw new Error(`Unexpected input to 'missing-a-method' error.`);
    }
    return `${moduleName}.${className}.${funcName}() expected the '${paramName}' parameter to expose a '${expectedMethod}' method.`;
  },
  "add-to-cache-list-unexpected-type": ({ entry }) => {
    return `An unexpected entry was passed to 'workbox-precaching.PrecacheController.addToCacheList()' The entry '${JSON.stringify(entry)}' isn't supported. You must supply an array of strings with one or more characters, objects with a url property or Request objects.`;
  },
  "add-to-cache-list-conflicting-entries": ({ firstEntry, secondEntry }) => {
    if (!firstEntry || !secondEntry) {
      throw new Error(`Unexpected input to 'add-to-cache-list-duplicate-entries' error.`);
    }
    return `Two of the entries passed to 'workbox-precaching.PrecacheController.addToCacheList()' had the URL ${firstEntry._entryId} but different revision details. Workbox is unable to cache and version the asset correctly. Please remove one of the entries.`;
  },
  "plugin-error-request-will-fetch": ({ thrownError }) => {
    if (!thrownError) {
      throw new Error(`Unexpected input to 'plugin-error-request-will-fetch', error.`);
    }
    return `An error was thrown by a plugins 'requestWillFetch()' method. The thrown error message was: '${thrownError.message}'.`;
  },
  "invalid-cache-name": ({ cacheNameId, value }) => {
    if (!cacheNameId) {
      throw new Error(`Expected a 'cacheNameId' for error 'invalid-cache-name'`);
    }
    return `You must provide a name containing at least one character for setCacheDetails({${cacheNameId}: '...'}). Received a value of '${JSON.stringify(value)}'`;
  },
  "unregister-route-but-not-found-with-method": ({ method }) => {
    if (!method) {
      throw new Error(`Unexpected input to 'unregister-route-but-not-found-with-method' error.`);
    }
    return `The route you're trying to unregister was not  previously registered for the method type '${method}'.`;
  },
  "unregister-route-route-not-registered": () => {
    return `The route you're trying to unregister was not previously registered.`;
  },
  "queue-replay-failed": ({ name }) => {
    return `Replaying the background sync queue '${name}' failed.`;
  },
  "duplicate-queue-name": ({ name }) => {
    return `The Queue name '${name}' is already being used. All instances of backgroundSync.Queue must be given unique names.`;
  },
  "expired-test-without-max-age": ({ methodName, paramName }) => {
    return `The '${methodName}()' method can only be used when the '${paramName}' is used in the constructor.`;
  },
  "unsupported-route-type": ({ moduleName, className, funcName, paramName }) => {
    return `The supplied '${paramName}' parameter was an unsupported type. Please check the docs for ${moduleName}.${className}.${funcName} for valid input types.`;
  },
  "not-array-of-class": ({ value, expectedClass, moduleName, className, funcName, paramName }) => {
    return `The supplied '${paramName}' parameter must be an array of '${expectedClass}' objects. Received '${JSON.stringify(value)},'. Please check the call to ${moduleName}.${className}.${funcName}() to fix the issue.`;
  },
  "max-entries-or-age-required": ({ moduleName, className, funcName }) => {
    return `You must define either config.maxEntries or config.maxAgeSecondsin ${moduleName}.${className}.${funcName}`;
  },
  "statuses-or-headers-required": ({ moduleName, className, funcName }) => {
    return `You must define either config.statuses or config.headersin ${moduleName}.${className}.${funcName}`;
  },
  "invalid-string": ({ moduleName, funcName, paramName }) => {
    if (!paramName || !moduleName || !funcName) {
      throw new Error(`Unexpected input to 'invalid-string' error.`);
    }
    return `When using strings, the '${paramName}' parameter must start with 'http' (for cross-origin matches) or '/' (for same-origin matches). Please see the docs for ${moduleName}.${funcName}() for more info.`;
  },
  "channel-name-required": () => {
    return `You must provide a channelName to construct a BroadcastCacheUpdate instance.`;
  },
  "invalid-responses-are-same-args": () => {
    return `The arguments passed into responsesAreSame() appear to be invalid. Please ensure valid Responses are used.`;
  },
  "expire-custom-caches-only": () => {
    return `You must provide a 'cacheName' property when using the expiration plugin with a runtime caching strategy.`;
  },
  "unit-must-be-bytes": ({ normalizedRangeHeader }) => {
    if (!normalizedRangeHeader) {
      throw new Error(`Unexpected input to 'unit-must-be-bytes' error.`);
    }
    return `The 'unit' portion of the Range header must be set to 'bytes'. The Range header provided was "${normalizedRangeHeader}"`;
  },
  "single-range-only": ({ normalizedRangeHeader }) => {
    if (!normalizedRangeHeader) {
      throw new Error(`Unexpected input to 'single-range-only' error.`);
    }
    return `Multiple ranges are not supported. Please use a  single start value, and optional end value. The Range header provided was "${normalizedRangeHeader}"`;
  },
  "invalid-range-values": ({ normalizedRangeHeader }) => {
    if (!normalizedRangeHeader) {
      throw new Error(`Unexpected input to 'invalid-range-values' error.`);
    }
    return `The Range header is missing both start and end values. At least one of those values is needed. The Range header provided was "${normalizedRangeHeader}"`;
  },
  "no-range-header": () => {
    return `No Range header was found in the Request provided.`;
  },
  "range-not-satisfiable": ({ size, start, end }) => {
    return `The start (${start}) and end (${end}) values in the Range are not satisfiable by the cached response, which is ${size} bytes.`;
  },
  "attempt-to-cache-non-get-request": ({ url, method }) => {
    return `Unable to cache '${url}' because it is a '${method}' request and only 'GET' requests can be cached.`;
  },
  "cache-put-with-no-response": ({ url }) => {
    return `There was an attempt to cache '${url}' but the response was not defined.`;
  },
  "no-response": ({ url, error }) => {
    let message = `The strategy could not generate a response for '${url}'.`;
    if (error) {
      message += ` The underlying error is ${error}.`;
    }
    return message;
  },
  "bad-precaching-response": ({ url, status }) => {
    return `The precaching request for '${url}' failed with an HTTP status of ${status}.`;
  },
  "non-precached-url": ({ url }) => {
    return `createHandlerBoundToURL('${url}') was called, but that URL is not precached. Please pass in a URL that is precached instead.`;
  },
  "add-to-cache-list-conflicting-integrities": ({ url }) => {
    return `Two of the entries passed to 'workbox-precaching.PrecacheController.addToCacheList()' had the URL ${url} with different integrity values. Please remove one of them.`;
  },
  "missing-precache-entry": ({ cacheName, url }) => {
    return `Unable to find a precached response in ${cacheName} for ${url}.`;
  }
};

// node_modules/workbox-expiration/node_modules/workbox-core/models/messages/messageGenerator.js
var generatorFunction5 = (code, details = {}) => {
  const message = messages6[code];
  if (!message) {
    throw new Error(`Unable to find message for code '${code}'.`);
  }
  return message(details);
};
var messageGenerator5 = false ? fallback : generatorFunction5;

// node_modules/workbox-expiration/node_modules/workbox-core/_private/WorkboxError.js
var WorkboxError5 = class extends Error {
  /**
   *
   * @param {string} errorCode The error code that
   * identifies this particular error.
   * @param {Object=} details Any relevant arguments
   * that will help developers identify issues should
   * be added as a key on the context object.
   */
  constructor(errorCode, details) {
    const message = messageGenerator5(errorCode, details);
    super(message);
    this.name = errorCode;
    this.details = details;
  }
};

// node_modules/workbox-expiration/node_modules/workbox-core/_private/assert.js
var isArray5 = (value, details) => {
  if (!Array.isArray(value)) {
    throw new WorkboxError5("not-an-array", details);
  }
};
var hasMethod5 = (object, expectedMethod, details) => {
  const type = typeof object[expectedMethod];
  if (type !== "function") {
    details["expectedMethod"] = expectedMethod;
    throw new WorkboxError5("missing-a-method", details);
  }
};
var isType5 = (object, expectedType, details) => {
  if (typeof object !== expectedType) {
    details["expectedType"] = expectedType;
    throw new WorkboxError5("incorrect-type", details);
  }
};
var isInstance5 = (object, expectedClass, details) => {
  if (!(object instanceof expectedClass)) {
    details["expectedClass"] = expectedClass;
    throw new WorkboxError5("incorrect-class", details);
  }
};
var isOneOf5 = (value, validValues, details) => {
  if (!validValues.includes(value)) {
    details["validValueDescription"] = `Valid values are ${JSON.stringify(validValues)}.`;
    throw new WorkboxError5("invalid-value", details);
  }
};
var isArrayOfClass5 = (value, expectedClass, details) => {
  const error = new WorkboxError5("not-array-of-class", details);
  if (!Array.isArray(value)) {
    throw error;
  }
  for (const item of value) {
    if (!(item instanceof expectedClass)) {
      throw error;
    }
  }
};
var finalAssertExports5 = false ? null : {
  hasMethod: hasMethod5,
  isArray: isArray5,
  isInstance: isInstance5,
  isOneOf: isOneOf5,
  isType: isType5,
  isArrayOfClass: isArrayOfClass5
};

// node_modules/workbox-expiration/node_modules/workbox-core/_private/dontWaitFor.js
function dontWaitFor(promise) {
  promise.then(() => {
  });
}

// node_modules/workbox-expiration/node_modules/workbox-core/_private/logger.js
var logger5 = false ? null : (() => {
  if (!("__WB_DISABLE_DEV_LOGS" in self)) {
    self.__WB_DISABLE_DEV_LOGS = false;
  }
  let inGroup = false;
  const methodToColorMap = {
    debug: `#7f8c8d`,
    log: `#2ecc71`,
    warn: `#f39c12`,
    error: `#c0392b`,
    groupCollapsed: `#3498db`,
    groupEnd: null
  };
  const print = function(method, args) {
    if (self.__WB_DISABLE_DEV_LOGS) {
      return;
    }
    if (method === "groupCollapsed") {
      if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        console[method](...args);
        return;
      }
    }
    const styles = [
      `background: ${methodToColorMap[method]}`,
      `border-radius: 0.5em`,
      `color: white`,
      `font-weight: bold`,
      `padding: 2px 0.5em`
    ];
    const logPrefix = inGroup ? [] : ["%cworkbox", styles.join(";")];
    console[method](...logPrefix, ...args);
    if (method === "groupCollapsed") {
      inGroup = true;
    }
    if (method === "groupEnd") {
      inGroup = false;
    }
  };
  const api = {};
  const loggerMethods = Object.keys(methodToColorMap);
  for (const key of loggerMethods) {
    const method = key;
    api[method] = (...args) => {
      print(method, args);
    };
  }
  return api;
})();

// node_modules/workbox-expiration/node_modules/workbox-core/_private/DBWrapper.js
var DBWrapper = class {
  /**
   * @param {string} name
   * @param {number} version
   * @param {Object=} [callback]
   * @param {!Function} [callbacks.onupgradeneeded]
   * @param {!Function} [callbacks.onversionchange] Defaults to
   *     DBWrapper.prototype._onversionchange when not specified.
   * @private
   */
  constructor(name, version, { onupgradeneeded, onversionchange } = {}) {
    this._db = null;
    this._name = name;
    this._version = version;
    this._onupgradeneeded = onupgradeneeded;
    this._onversionchange = onversionchange || (() => this.close());
  }
  /**
   * Returns the IDBDatabase instance (not normally needed).
   * @return {IDBDatabase|undefined}
   *
   * @private
   */
  get db() {
    return this._db;
  }
  /**
   * Opens a connected to an IDBDatabase, invokes any onupgradedneeded
   * callback, and added an onversionchange callback to the database.
   *
   * @return {IDBDatabase}
   * @private
   */
  async open() {
    if (this._db)
      return;
    this._db = await new Promise((resolve, reject) => {
      let openRequestTimedOut = false;
      setTimeout(() => {
        openRequestTimedOut = true;
        reject(new Error("The open request was blocked and timed out"));
      }, this.OPEN_TIMEOUT);
      const openRequest = indexedDB.open(this._name, this._version);
      openRequest.onerror = () => reject(openRequest.error);
      openRequest.onupgradeneeded = (evt) => {
        if (openRequestTimedOut) {
          openRequest.transaction.abort();
          openRequest.result.close();
        } else if (typeof this._onupgradeneeded === "function") {
          this._onupgradeneeded(evt);
        }
      };
      openRequest.onsuccess = () => {
        const db = openRequest.result;
        if (openRequestTimedOut) {
          db.close();
        } else {
          db.onversionchange = this._onversionchange.bind(this);
          resolve(db);
        }
      };
    });
    return this;
  }
  /**
   * Polyfills the native `getKey()` method. Note, this is overridden at
   * runtime if the browser supports the native method.
   *
   * @param {string} storeName
   * @param {*} query
   * @return {Array}
   * @private
   */
  async getKey(storeName, query) {
    return (await this.getAllKeys(storeName, query, 1))[0];
  }
  /**
   * Polyfills the native `getAll()` method. Note, this is overridden at
   * runtime if the browser supports the native method.
   *
   * @param {string} storeName
   * @param {*} query
   * @param {number} count
   * @return {Array}
   * @private
   */
  async getAll(storeName, query, count) {
    return await this.getAllMatching(storeName, { query, count });
  }
  /**
   * Polyfills the native `getAllKeys()` method. Note, this is overridden at
   * runtime if the browser supports the native method.
   *
   * @param {string} storeName
   * @param {*} query
   * @param {number} count
   * @return {Array}
   * @private
   */
  async getAllKeys(storeName, query, count) {
    const entries = await this.getAllMatching(storeName, { query, count, includeKeys: true });
    return entries.map((entry) => entry.key);
  }
  /**
   * Supports flexible lookup in an object store by specifying an index,
   * query, direction, and count. This method returns an array of objects
   * with the signature .
   *
   * @param {string} storeName
   * @param {Object} [opts]
   * @param {string} [opts.index] The index to use (if specified).
   * @param {*} [opts.query]
   * @param {IDBCursorDirection} [opts.direction]
   * @param {number} [opts.count] The max number of results to return.
   * @param {boolean} [opts.includeKeys] When true, the structure of the
   *     returned objects is changed from an array of values to an array of
   *     objects in the form {key, primaryKey, value}.
   * @return {Array}
   * @private
   */
  async getAllMatching(storeName, {
    index,
    query = null,
    // IE/Edge errors if query === `undefined`.
    direction = "next",
    count,
    includeKeys = false
  } = {}) {
    return await this.transaction([storeName], "readonly", (txn, done) => {
      const store = txn.objectStore(storeName);
      const target = index ? store.index(index) : store;
      const results = [];
      const request = target.openCursor(query, direction);
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          results.push(includeKeys ? cursor : cursor.value);
          if (count && results.length >= count) {
            done(results);
          } else {
            cursor.continue();
          }
        } else {
          done(results);
        }
      };
    });
  }
  /**
   * Accepts a list of stores, a transaction type, and a callback and
   * performs a transaction. A promise is returned that resolves to whatever
   * value the callback chooses. The callback holds all the transaction logic
   * and is invoked with two arguments:
   *   1. The IDBTransaction object
   *   2. A `done` function, that's used to resolve the promise when
   *      when the transaction is done, if passed a value, the promise is
   *      resolved to that value.
   *
   * @param {Array<string>} storeNames An array of object store names
   *     involved in the transaction.
   * @param {string} type Can be `readonly` or `readwrite`.
   * @param {!Function} callback
   * @return {*} The result of the transaction ran by the callback.
   * @private
   */
  async transaction(storeNames, type, callback) {
    await this.open();
    return await new Promise((resolve, reject) => {
      const txn = this._db.transaction(storeNames, type);
      txn.onabort = () => reject(txn.error);
      txn.oncomplete = () => resolve();
      callback(txn, (value) => resolve(value));
    });
  }
  /**
   * Delegates async to a native IDBObjectStore method.
   *
   * @param {string} method The method name.
   * @param {string} storeName The object store name.
   * @param {string} type Can be `readonly` or `readwrite`.
   * @param {...*} args The list of args to pass to the native method.
   * @return {*} The result of the transaction.
   * @private
   */
  async _call(method, storeName, type, ...args) {
    const callback = (txn, done) => {
      const objStore = txn.objectStore(storeName);
      const request = objStore[method].apply(objStore, args);
      request.onsuccess = () => done(request.result);
    };
    return await this.transaction([storeName], type, callback);
  }
  /**
   * Closes the connection opened by `DBWrapper.open()`. Generally this method
   * doesn't need to be called since:
   *   1. It's usually better to keep a connection open since opening
   *      a new connection is somewhat slow.
   *   2. Connections are automatically closed when the reference is
   *      garbage collected.
   * The primary use case for needing to close a connection is when another
   * reference (typically in another tab) needs to upgrade it and would be
   * blocked by the current, open connection.
   *
   * @private
   */
  close() {
    if (this._db) {
      this._db.close();
      this._db = null;
    }
  }
};
DBWrapper.prototype.OPEN_TIMEOUT = 2e3;
var methodsToWrap = {
  readonly: ["get", "count", "getKey", "getAll", "getAllKeys"],
  readwrite: ["add", "put", "clear", "delete"]
};
for (const [mode, methods] of Object.entries(methodsToWrap)) {
  for (const method of methods) {
    if (method in IDBObjectStore.prototype) {
      DBWrapper.prototype[method] = async function(storeName, ...args) {
        return await this._call(method, storeName, mode, ...args);
      };
    }
  }
}

// node_modules/workbox-expiration/node_modules/workbox-core/_private/deleteDatabase.js
var deleteDatabase = async (name) => {
  await new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(name);
    request.onerror = () => {
      reject(request.error);
    };
    request.onblocked = () => {
      reject(new Error("Delete blocked"));
    };
    request.onsuccess = () => {
      resolve();
    };
  });
};

// node_modules/workbox-expiration/_version.js
try {
  self["workbox:expiration:5.1.4"] && _();
} catch (e) {
}

// node_modules/workbox-expiration/models/CacheTimestampsModel.js
var DB_NAME = "workbox-expiration";
var OBJECT_STORE_NAME = "cache-entries";
var normalizeURL = (unNormalizedUrl) => {
  const url = new URL(unNormalizedUrl, location.href);
  url.hash = "";
  return url.href;
};
var CacheTimestampsModel = class {
  /**
   *
   * @param {string} cacheName
   *
   * @private
   */
  constructor(cacheName) {
    this._cacheName = cacheName;
    this._db = new DBWrapper(DB_NAME, 1, {
      onupgradeneeded: (event) => this._handleUpgrade(event)
    });
  }
  /**
   * Should perform an upgrade of indexedDB.
   *
   * @param {Event} event
   *
   * @private
   */
  _handleUpgrade(event) {
    const db = event.target.result;
    const objStore = db.createObjectStore(OBJECT_STORE_NAME, { keyPath: "id" });
    objStore.createIndex("cacheName", "cacheName", { unique: false });
    objStore.createIndex("timestamp", "timestamp", { unique: false });
    deleteDatabase(this._cacheName);
  }
  /**
   * @param {string} url
   * @param {number} timestamp
   *
   * @private
   */
  async setTimestamp(url, timestamp) {
    url = normalizeURL(url);
    const entry = {
      url,
      timestamp,
      cacheName: this._cacheName,
      // Creating an ID from the URL and cache name won't be necessary once
      // Edge switches to Chromium and all browsers we support work with
      // array keyPaths.
      id: this._getId(url)
    };
    await this._db.put(OBJECT_STORE_NAME, entry);
  }
  /**
   * Returns the timestamp stored for a given URL.
   *
   * @param {string} url
   * @return {number}
   *
   * @private
   */
  async getTimestamp(url) {
    const entry = await this._db.get(OBJECT_STORE_NAME, this._getId(url));
    return entry.timestamp;
  }
  /**
   * Iterates through all the entries in the object store (from newest to
   * oldest) and removes entries once either `maxCount` is reached or the
   * entry's timestamp is less than `minTimestamp`.
   *
   * @param {number} minTimestamp
   * @param {number} maxCount
   * @return {Array<string>}
   *
   * @private
   */
  async expireEntries(minTimestamp, maxCount) {
    const entriesToDelete = await this._db.transaction(OBJECT_STORE_NAME, "readwrite", (txn, done) => {
      const store = txn.objectStore(OBJECT_STORE_NAME);
      const request = store.index("timestamp").openCursor(null, "prev");
      const entriesToDelete2 = [];
      let entriesNotDeletedCount = 0;
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          const result = cursor.value;
          if (result.cacheName === this._cacheName) {
            if (minTimestamp && result.timestamp < minTimestamp || maxCount && entriesNotDeletedCount >= maxCount) {
              entriesToDelete2.push(cursor.value);
            } else {
              entriesNotDeletedCount++;
            }
          }
          cursor.continue();
        } else {
          done(entriesToDelete2);
        }
      };
    });
    const urlsDeleted = [];
    for (const entry of entriesToDelete) {
      await this._db.delete(OBJECT_STORE_NAME, entry.id);
      urlsDeleted.push(entry.url);
    }
    return urlsDeleted;
  }
  /**
   * Takes a URL and returns an ID that will be unique in the object store.
   *
   * @param {string} url
   * @return {string}
   *
   * @private
   */
  _getId(url) {
    return this._cacheName + "|" + normalizeURL(url);
  }
};

// node_modules/workbox-expiration/CacheExpiration.js
var CacheExpiration = class {
  /**
   * To construct a new CacheExpiration instance you must provide at least
   * one of the `config` properties.
   *
   * @param {string} cacheName Name of the cache to apply restrictions to.
   * @param {Object} config
   * @param {number} [config.maxEntries] The maximum number of entries to cache.
   * Entries used the least will be removed as the maximum is reached.
   * @param {number} [config.maxAgeSeconds] The maximum age of an entry before
   * it's treated as stale and removed.
   */
  constructor(cacheName, config = {}) {
    this._isRunning = false;
    this._rerunRequested = false;
    if (true) {
      finalAssertExports5.isType(cacheName, "string", {
        moduleName: "workbox-expiration",
        className: "CacheExpiration",
        funcName: "constructor",
        paramName: "cacheName"
      });
      if (!(config.maxEntries || config.maxAgeSeconds)) {
        throw new WorkboxError5("max-entries-or-age-required", {
          moduleName: "workbox-expiration",
          className: "CacheExpiration",
          funcName: "constructor"
        });
      }
      if (config.maxEntries) {
        finalAssertExports5.isType(config.maxEntries, "number", {
          moduleName: "workbox-expiration",
          className: "CacheExpiration",
          funcName: "constructor",
          paramName: "config.maxEntries"
        });
      }
      if (config.maxAgeSeconds) {
        finalAssertExports5.isType(config.maxAgeSeconds, "number", {
          moduleName: "workbox-expiration",
          className: "CacheExpiration",
          funcName: "constructor",
          paramName: "config.maxAgeSeconds"
        });
      }
    }
    this._maxEntries = config.maxEntries;
    this._maxAgeSeconds = config.maxAgeSeconds;
    this._cacheName = cacheName;
    this._timestampModel = new CacheTimestampsModel(cacheName);
  }
  /**
   * Expires entries for the given cache and given criteria.
   */
  async expireEntries() {
    if (this._isRunning) {
      this._rerunRequested = true;
      return;
    }
    this._isRunning = true;
    const minTimestamp = this._maxAgeSeconds ? Date.now() - this._maxAgeSeconds * 1e3 : 0;
    const urlsExpired = await this._timestampModel.expireEntries(minTimestamp, this._maxEntries);
    const cache = await self.caches.open(this._cacheName);
    for (const url of urlsExpired) {
      await cache.delete(url);
    }
    if (true) {
      if (urlsExpired.length > 0) {
        logger5.groupCollapsed(`Expired ${urlsExpired.length} ${urlsExpired.length === 1 ? "entry" : "entries"} and removed ${urlsExpired.length === 1 ? "it" : "them"} from the '${this._cacheName}' cache.`);
        logger5.log(`Expired the following ${urlsExpired.length === 1 ? "URL" : "URLs"}:`);
        urlsExpired.forEach((url) => logger5.log(`    ${url}`));
        logger5.groupEnd();
      } else {
        logger5.debug(`Cache expiration ran and found no entries to remove.`);
      }
    }
    this._isRunning = false;
    if (this._rerunRequested) {
      this._rerunRequested = false;
      dontWaitFor(this.expireEntries());
    }
  }
  /**
   * Update the timestamp for the given URL. This ensures the when
   * removing entries based on maximum entries, most recently used
   * is accurate or when expiring, the timestamp is up-to-date.
   *
   * @param {string} url
   */
  async updateTimestamp(url) {
    if (true) {
      finalAssertExports5.isType(url, "string", {
        moduleName: "workbox-expiration",
        className: "CacheExpiration",
        funcName: "updateTimestamp",
        paramName: "url"
      });
    }
    await this._timestampModel.setTimestamp(url, Date.now());
  }
  /**
   * Can be used to check if a URL has expired or not before it's used.
   *
   * This requires a look up from IndexedDB, so can be slow.
   *
   * Note: This method will not remove the cached entry, call
   * `expireEntries()` to remove indexedDB and Cache entries.
   *
   * @param {string} url
   * @return {boolean}
   */
  async isURLExpired(url) {
    if (!this._maxAgeSeconds) {
      if (true) {
        throw new WorkboxError5(`expired-test-without-max-age`, {
          methodName: "isURLExpired",
          paramName: "maxAgeSeconds"
        });
      }
      return false;
    } else {
      const timestamp = await this._timestampModel.getTimestamp(url);
      const expireOlderThan = Date.now() - this._maxAgeSeconds * 1e3;
      return timestamp < expireOlderThan;
    }
  }
  /**
   * Removes the IndexedDB object store used to keep track of cache expiration
   * metadata.
   */
  async delete() {
    this._rerunRequested = false;
    await this._timestampModel.expireEntries(Infinity);
  }
};

// node_modules/workbox-expiration/node_modules/workbox-core/_private/cacheNames.js
var _cacheNameDetails3 = {
  googleAnalytics: "googleAnalytics",
  precache: "precache-v2",
  prefix: "workbox",
  runtime: "runtime",
  suffix: typeof registration !== "undefined" ? registration.scope : ""
};
var _createCacheName3 = (cacheName) => {
  return [_cacheNameDetails3.prefix, cacheName, _cacheNameDetails3.suffix].filter((value) => value && value.length > 0).join("-");
};
var eachCacheNameDetail3 = (fn) => {
  for (const key of Object.keys(_cacheNameDetails3)) {
    fn(key);
  }
};
var cacheNames3 = {
  updateDetails: (details) => {
    eachCacheNameDetail3((key) => {
      if (typeof details[key] === "string") {
        _cacheNameDetails3[key] = details[key];
      }
    });
  },
  getGoogleAnalyticsName: (userCacheName) => {
    return userCacheName || _createCacheName3(_cacheNameDetails3.googleAnalytics);
  },
  getPrecacheName: (userCacheName) => {
    return userCacheName || _createCacheName3(_cacheNameDetails3.precache);
  },
  getPrefix: () => {
    return _cacheNameDetails3.prefix;
  },
  getRuntimeName: (userCacheName) => {
    return userCacheName || _createCacheName3(_cacheNameDetails3.runtime);
  },
  getSuffix: () => {
    return _cacheNameDetails3.suffix;
  }
};

// node_modules/workbox-expiration/node_modules/workbox-core/_private/getFriendlyURL.js
var getFriendlyURL5 = (url) => {
  const urlObj = new URL(String(url), location.href);
  return urlObj.href.replace(new RegExp(`^${location.origin}`), "");
};

// node_modules/workbox-expiration/node_modules/workbox-core/models/quotaErrorCallbacks.js
var quotaErrorCallbacks3 = /* @__PURE__ */ new Set();

// node_modules/workbox-expiration/node_modules/workbox-core/registerQuotaErrorCallback.js
function registerQuotaErrorCallback(callback) {
  if (true) {
    finalAssertExports5.isType(callback, "function", {
      moduleName: "workbox-core",
      funcName: "register",
      paramName: "callback"
    });
  }
  quotaErrorCallbacks3.add(callback);
  if (true) {
    logger5.log("Registered a callback to respond to quota errors.", callback);
  }
}

// node_modules/workbox-expiration/ExpirationPlugin.js
var ExpirationPlugin = class {
  /**
   * @param {Object} config
   * @param {number} [config.maxEntries] The maximum number of entries to cache.
   * Entries used the least will be removed as the maximum is reached.
   * @param {number} [config.maxAgeSeconds] The maximum age of an entry before
   * it's treated as stale and removed.
   * @param {boolean} [config.purgeOnQuotaError] Whether to opt this cache in to
   * automatic deletion if the available storage quota has been exceeded.
   */
  constructor(config = {}) {
    this.cachedResponseWillBeUsed = async ({ event, request, cacheName, cachedResponse }) => {
      if (!cachedResponse) {
        return null;
      }
      const isFresh = this._isResponseDateFresh(cachedResponse);
      const cacheExpiration = this._getCacheExpiration(cacheName);
      dontWaitFor(cacheExpiration.expireEntries());
      const updateTimestampDone = cacheExpiration.updateTimestamp(request.url);
      if (event) {
        try {
          event.waitUntil(updateTimestampDone);
        } catch (error) {
          if (true) {
            if ("request" in event) {
              logger5.warn(`Unable to ensure service worker stays alive when updating cache entry for '${getFriendlyURL5(event.request.url)}'.`);
            }
          }
        }
      }
      return isFresh ? cachedResponse : null;
    };
    this.cacheDidUpdate = async ({ cacheName, request }) => {
      if (true) {
        finalAssertExports5.isType(cacheName, "string", {
          moduleName: "workbox-expiration",
          className: "Plugin",
          funcName: "cacheDidUpdate",
          paramName: "cacheName"
        });
        finalAssertExports5.isInstance(request, Request, {
          moduleName: "workbox-expiration",
          className: "Plugin",
          funcName: "cacheDidUpdate",
          paramName: "request"
        });
      }
      const cacheExpiration = this._getCacheExpiration(cacheName);
      await cacheExpiration.updateTimestamp(request.url);
      await cacheExpiration.expireEntries();
    };
    if (true) {
      if (!(config.maxEntries || config.maxAgeSeconds)) {
        throw new WorkboxError5("max-entries-or-age-required", {
          moduleName: "workbox-expiration",
          className: "Plugin",
          funcName: "constructor"
        });
      }
      if (config.maxEntries) {
        finalAssertExports5.isType(config.maxEntries, "number", {
          moduleName: "workbox-expiration",
          className: "Plugin",
          funcName: "constructor",
          paramName: "config.maxEntries"
        });
      }
      if (config.maxAgeSeconds) {
        finalAssertExports5.isType(config.maxAgeSeconds, "number", {
          moduleName: "workbox-expiration",
          className: "Plugin",
          funcName: "constructor",
          paramName: "config.maxAgeSeconds"
        });
      }
    }
    this._config = config;
    this._maxAgeSeconds = config.maxAgeSeconds;
    this._cacheExpirations = /* @__PURE__ */ new Map();
    if (config.purgeOnQuotaError) {
      registerQuotaErrorCallback(() => this.deleteCacheAndMetadata());
    }
  }
  /**
   * A simple helper method to return a CacheExpiration instance for a given
   * cache name.
   *
   * @param {string} cacheName
   * @return {CacheExpiration}
   *
   * @private
   */
  _getCacheExpiration(cacheName) {
    if (cacheName === cacheNames3.getRuntimeName()) {
      throw new WorkboxError5("expire-custom-caches-only");
    }
    let cacheExpiration = this._cacheExpirations.get(cacheName);
    if (!cacheExpiration) {
      cacheExpiration = new CacheExpiration(cacheName, this._config);
      this._cacheExpirations.set(cacheName, cacheExpiration);
    }
    return cacheExpiration;
  }
  /**
   * @param {Response} cachedResponse
   * @return {boolean}
   *
   * @private
   */
  _isResponseDateFresh(cachedResponse) {
    if (!this._maxAgeSeconds) {
      return true;
    }
    const dateHeaderTimestamp = this._getDateHeaderTimestamp(cachedResponse);
    if (dateHeaderTimestamp === null) {
      return true;
    }
    const now = Date.now();
    return dateHeaderTimestamp >= now - this._maxAgeSeconds * 1e3;
  }
  /**
   * This method will extract the data header and parse it into a useful
   * value.
   *
   * @param {Response} cachedResponse
   * @return {number|null}
   *
   * @private
   */
  _getDateHeaderTimestamp(cachedResponse) {
    if (!cachedResponse.headers.has("date")) {
      return null;
    }
    const dateHeader = cachedResponse.headers.get("date");
    const parsedDate = new Date(dateHeader);
    const headerTime = parsedDate.getTime();
    if (isNaN(headerTime)) {
      return null;
    }
    return headerTime;
  }
  /**
   * This is a helper method that performs two operations:
   *
   * - Deletes *all* the underlying Cache instances associated with this plugin
   * instance, by calling caches.delete() on your behalf.
   * - Deletes the metadata from IndexedDB used to keep track of expiration
   * details for each Cache instance.
   *
   * When using cache expiration, calling this method is preferable to calling
   * `caches.delete()` directly, since this will ensure that the IndexedDB
   * metadata is also cleanly removed and open IndexedDB instances are deleted.
   *
   * Note that if you're *not* using cache expiration for a given cache, calling
   * `caches.delete()` and passing in the cache's name should be sufficient.
   * There is no Workbox-specific method needed for cleanup in that case.
   */
  async deleteCacheAndMetadata() {
    for (const [cacheName, cacheExpiration] of this._cacheExpirations) {
      await self.caches.delete(cacheName);
      await cacheExpiration.delete();
    }
    this._cacheExpirations = /* @__PURE__ */ new Map();
  }
};

// node_modules/workbox-background-sync/node_modules/workbox-core/_version.js
try {
  self["workbox:core:5.1.4"] && _();
} catch (e) {
}

// node_modules/workbox-background-sync/node_modules/workbox-core/models/messages/messages.js
var messages7 = {
  "invalid-value": ({ paramName, validValueDescription, value }) => {
    if (!paramName || !validValueDescription) {
      throw new Error(`Unexpected input to 'invalid-value' error.`);
    }
    return `The '${paramName}' parameter was given a value with an unexpected value. ${validValueDescription} Received a value of ${JSON.stringify(value)}.`;
  },
  "not-an-array": ({ moduleName, className, funcName, paramName }) => {
    if (!moduleName || !className || !funcName || !paramName) {
      throw new Error(`Unexpected input to 'not-an-array' error.`);
    }
    return `The parameter '${paramName}' passed into '${moduleName}.${className}.${funcName}()' must be an array.`;
  },
  "incorrect-type": ({ expectedType, paramName, moduleName, className, funcName }) => {
    if (!expectedType || !paramName || !moduleName || !funcName) {
      throw new Error(`Unexpected input to 'incorrect-type' error.`);
    }
    return `The parameter '${paramName}' passed into '${moduleName}.${className ? className + "." : ""}${funcName}()' must be of type ${expectedType}.`;
  },
  "incorrect-class": ({ expectedClass, paramName, moduleName, className, funcName, isReturnValueProblem }) => {
    if (!expectedClass || !moduleName || !funcName) {
      throw new Error(`Unexpected input to 'incorrect-class' error.`);
    }
    if (isReturnValueProblem) {
      return `The return value from '${moduleName}.${className ? className + "." : ""}${funcName}()' must be an instance of class ${expectedClass.name}.`;
    }
    return `The parameter '${paramName}' passed into '${moduleName}.${className ? className + "." : ""}${funcName}()' must be an instance of class ${expectedClass.name}.`;
  },
  "missing-a-method": ({ expectedMethod, paramName, moduleName, className, funcName }) => {
    if (!expectedMethod || !paramName || !moduleName || !className || !funcName) {
      throw new Error(`Unexpected input to 'missing-a-method' error.`);
    }
    return `${moduleName}.${className}.${funcName}() expected the '${paramName}' parameter to expose a '${expectedMethod}' method.`;
  },
  "add-to-cache-list-unexpected-type": ({ entry }) => {
    return `An unexpected entry was passed to 'workbox-precaching.PrecacheController.addToCacheList()' The entry '${JSON.stringify(entry)}' isn't supported. You must supply an array of strings with one or more characters, objects with a url property or Request objects.`;
  },
  "add-to-cache-list-conflicting-entries": ({ firstEntry, secondEntry }) => {
    if (!firstEntry || !secondEntry) {
      throw new Error(`Unexpected input to 'add-to-cache-list-duplicate-entries' error.`);
    }
    return `Two of the entries passed to 'workbox-precaching.PrecacheController.addToCacheList()' had the URL ${firstEntry._entryId} but different revision details. Workbox is unable to cache and version the asset correctly. Please remove one of the entries.`;
  },
  "plugin-error-request-will-fetch": ({ thrownError }) => {
    if (!thrownError) {
      throw new Error(`Unexpected input to 'plugin-error-request-will-fetch', error.`);
    }
    return `An error was thrown by a plugins 'requestWillFetch()' method. The thrown error message was: '${thrownError.message}'.`;
  },
  "invalid-cache-name": ({ cacheNameId, value }) => {
    if (!cacheNameId) {
      throw new Error(`Expected a 'cacheNameId' for error 'invalid-cache-name'`);
    }
    return `You must provide a name containing at least one character for setCacheDetails({${cacheNameId}: '...'}). Received a value of '${JSON.stringify(value)}'`;
  },
  "unregister-route-but-not-found-with-method": ({ method }) => {
    if (!method) {
      throw new Error(`Unexpected input to 'unregister-route-but-not-found-with-method' error.`);
    }
    return `The route you're trying to unregister was not  previously registered for the method type '${method}'.`;
  },
  "unregister-route-route-not-registered": () => {
    return `The route you're trying to unregister was not previously registered.`;
  },
  "queue-replay-failed": ({ name }) => {
    return `Replaying the background sync queue '${name}' failed.`;
  },
  "duplicate-queue-name": ({ name }) => {
    return `The Queue name '${name}' is already being used. All instances of backgroundSync.Queue must be given unique names.`;
  },
  "expired-test-without-max-age": ({ methodName, paramName }) => {
    return `The '${methodName}()' method can only be used when the '${paramName}' is used in the constructor.`;
  },
  "unsupported-route-type": ({ moduleName, className, funcName, paramName }) => {
    return `The supplied '${paramName}' parameter was an unsupported type. Please check the docs for ${moduleName}.${className}.${funcName} for valid input types.`;
  },
  "not-array-of-class": ({ value, expectedClass, moduleName, className, funcName, paramName }) => {
    return `The supplied '${paramName}' parameter must be an array of '${expectedClass}' objects. Received '${JSON.stringify(value)},'. Please check the call to ${moduleName}.${className}.${funcName}() to fix the issue.`;
  },
  "max-entries-or-age-required": ({ moduleName, className, funcName }) => {
    return `You must define either config.maxEntries or config.maxAgeSecondsin ${moduleName}.${className}.${funcName}`;
  },
  "statuses-or-headers-required": ({ moduleName, className, funcName }) => {
    return `You must define either config.statuses or config.headersin ${moduleName}.${className}.${funcName}`;
  },
  "invalid-string": ({ moduleName, funcName, paramName }) => {
    if (!paramName || !moduleName || !funcName) {
      throw new Error(`Unexpected input to 'invalid-string' error.`);
    }
    return `When using strings, the '${paramName}' parameter must start with 'http' (for cross-origin matches) or '/' (for same-origin matches). Please see the docs for ${moduleName}.${funcName}() for more info.`;
  },
  "channel-name-required": () => {
    return `You must provide a channelName to construct a BroadcastCacheUpdate instance.`;
  },
  "invalid-responses-are-same-args": () => {
    return `The arguments passed into responsesAreSame() appear to be invalid. Please ensure valid Responses are used.`;
  },
  "expire-custom-caches-only": () => {
    return `You must provide a 'cacheName' property when using the expiration plugin with a runtime caching strategy.`;
  },
  "unit-must-be-bytes": ({ normalizedRangeHeader }) => {
    if (!normalizedRangeHeader) {
      throw new Error(`Unexpected input to 'unit-must-be-bytes' error.`);
    }
    return `The 'unit' portion of the Range header must be set to 'bytes'. The Range header provided was "${normalizedRangeHeader}"`;
  },
  "single-range-only": ({ normalizedRangeHeader }) => {
    if (!normalizedRangeHeader) {
      throw new Error(`Unexpected input to 'single-range-only' error.`);
    }
    return `Multiple ranges are not supported. Please use a  single start value, and optional end value. The Range header provided was "${normalizedRangeHeader}"`;
  },
  "invalid-range-values": ({ normalizedRangeHeader }) => {
    if (!normalizedRangeHeader) {
      throw new Error(`Unexpected input to 'invalid-range-values' error.`);
    }
    return `The Range header is missing both start and end values. At least one of those values is needed. The Range header provided was "${normalizedRangeHeader}"`;
  },
  "no-range-header": () => {
    return `No Range header was found in the Request provided.`;
  },
  "range-not-satisfiable": ({ size, start, end }) => {
    return `The start (${start}) and end (${end}) values in the Range are not satisfiable by the cached response, which is ${size} bytes.`;
  },
  "attempt-to-cache-non-get-request": ({ url, method }) => {
    return `Unable to cache '${url}' because it is a '${method}' request and only 'GET' requests can be cached.`;
  },
  "cache-put-with-no-response": ({ url }) => {
    return `There was an attempt to cache '${url}' but the response was not defined.`;
  },
  "no-response": ({ url, error }) => {
    let message = `The strategy could not generate a response for '${url}'.`;
    if (error) {
      message += ` The underlying error is ${error}.`;
    }
    return message;
  },
  "bad-precaching-response": ({ url, status }) => {
    return `The precaching request for '${url}' failed with an HTTP status of ${status}.`;
  },
  "non-precached-url": ({ url }) => {
    return `createHandlerBoundToURL('${url}') was called, but that URL is not precached. Please pass in a URL that is precached instead.`;
  },
  "add-to-cache-list-conflicting-integrities": ({ url }) => {
    return `Two of the entries passed to 'workbox-precaching.PrecacheController.addToCacheList()' had the URL ${url} with different integrity values. Please remove one of them.`;
  },
  "missing-precache-entry": ({ cacheName, url }) => {
    return `Unable to find a precached response in ${cacheName} for ${url}.`;
  }
};

// node_modules/workbox-background-sync/node_modules/workbox-core/models/messages/messageGenerator.js
var generatorFunction6 = (code, details = {}) => {
  const message = messages7[code];
  if (!message) {
    throw new Error(`Unable to find message for code '${code}'.`);
  }
  return message(details);
};
var messageGenerator6 = false ? fallback : generatorFunction6;

// node_modules/workbox-background-sync/node_modules/workbox-core/_private/WorkboxError.js
var WorkboxError6 = class extends Error {
  /**
   *
   * @param {string} errorCode The error code that
   * identifies this particular error.
   * @param {Object=} details Any relevant arguments
   * that will help developers identify issues should
   * be added as a key on the context object.
   */
  constructor(errorCode, details) {
    const message = messageGenerator6(errorCode, details);
    super(message);
    this.name = errorCode;
    this.details = details;
  }
};

// node_modules/workbox-background-sync/node_modules/workbox-core/_private/logger.js
var logger6 = false ? null : (() => {
  if (!("__WB_DISABLE_DEV_LOGS" in self)) {
    self.__WB_DISABLE_DEV_LOGS = false;
  }
  let inGroup = false;
  const methodToColorMap = {
    debug: `#7f8c8d`,
    log: `#2ecc71`,
    warn: `#f39c12`,
    error: `#c0392b`,
    groupCollapsed: `#3498db`,
    groupEnd: null
  };
  const print = function(method, args) {
    if (self.__WB_DISABLE_DEV_LOGS) {
      return;
    }
    if (method === "groupCollapsed") {
      if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        console[method](...args);
        return;
      }
    }
    const styles = [
      `background: ${methodToColorMap[method]}`,
      `border-radius: 0.5em`,
      `color: white`,
      `font-weight: bold`,
      `padding: 2px 0.5em`
    ];
    const logPrefix = inGroup ? [] : ["%cworkbox", styles.join(";")];
    console[method](...logPrefix, ...args);
    if (method === "groupCollapsed") {
      inGroup = true;
    }
    if (method === "groupEnd") {
      inGroup = false;
    }
  };
  const api = {};
  const loggerMethods = Object.keys(methodToColorMap);
  for (const key of loggerMethods) {
    const method = key;
    api[method] = (...args) => {
      print(method, args);
    };
  }
  return api;
})();

// node_modules/workbox-background-sync/node_modules/workbox-core/_private/assert.js
var isArray6 = (value, details) => {
  if (!Array.isArray(value)) {
    throw new WorkboxError6("not-an-array", details);
  }
};
var hasMethod6 = (object, expectedMethod, details) => {
  const type = typeof object[expectedMethod];
  if (type !== "function") {
    details["expectedMethod"] = expectedMethod;
    throw new WorkboxError6("missing-a-method", details);
  }
};
var isType6 = (object, expectedType, details) => {
  if (typeof object !== expectedType) {
    details["expectedType"] = expectedType;
    throw new WorkboxError6("incorrect-type", details);
  }
};
var isInstance6 = (object, expectedClass, details) => {
  if (!(object instanceof expectedClass)) {
    details["expectedClass"] = expectedClass;
    throw new WorkboxError6("incorrect-class", details);
  }
};
var isOneOf6 = (value, validValues, details) => {
  if (!validValues.includes(value)) {
    details["validValueDescription"] = `Valid values are ${JSON.stringify(validValues)}.`;
    throw new WorkboxError6("invalid-value", details);
  }
};
var isArrayOfClass6 = (value, expectedClass, details) => {
  const error = new WorkboxError6("not-array-of-class", details);
  if (!Array.isArray(value)) {
    throw error;
  }
  for (const item of value) {
    if (!(item instanceof expectedClass)) {
      throw error;
    }
  }
};
var finalAssertExports6 = false ? null : {
  hasMethod: hasMethod6,
  isArray: isArray6,
  isInstance: isInstance6,
  isOneOf: isOneOf6,
  isType: isType6,
  isArrayOfClass: isArrayOfClass6
};

// node_modules/workbox-background-sync/node_modules/workbox-core/_private/getFriendlyURL.js
var getFriendlyURL6 = (url) => {
  const urlObj = new URL(String(url), location.href);
  return urlObj.href.replace(new RegExp(`^${location.origin}`), "");
};

// node_modules/workbox-background-sync/node_modules/workbox-core/_private/DBWrapper.js
var DBWrapper2 = class {
  /**
   * @param {string} name
   * @param {number} version
   * @param {Object=} [callback]
   * @param {!Function} [callbacks.onupgradeneeded]
   * @param {!Function} [callbacks.onversionchange] Defaults to
   *     DBWrapper.prototype._onversionchange when not specified.
   * @private
   */
  constructor(name, version, { onupgradeneeded, onversionchange } = {}) {
    this._db = null;
    this._name = name;
    this._version = version;
    this._onupgradeneeded = onupgradeneeded;
    this._onversionchange = onversionchange || (() => this.close());
  }
  /**
   * Returns the IDBDatabase instance (not normally needed).
   * @return {IDBDatabase|undefined}
   *
   * @private
   */
  get db() {
    return this._db;
  }
  /**
   * Opens a connected to an IDBDatabase, invokes any onupgradedneeded
   * callback, and added an onversionchange callback to the database.
   *
   * @return {IDBDatabase}
   * @private
   */
  async open() {
    if (this._db)
      return;
    this._db = await new Promise((resolve, reject) => {
      let openRequestTimedOut = false;
      setTimeout(() => {
        openRequestTimedOut = true;
        reject(new Error("The open request was blocked and timed out"));
      }, this.OPEN_TIMEOUT);
      const openRequest = indexedDB.open(this._name, this._version);
      openRequest.onerror = () => reject(openRequest.error);
      openRequest.onupgradeneeded = (evt) => {
        if (openRequestTimedOut) {
          openRequest.transaction.abort();
          openRequest.result.close();
        } else if (typeof this._onupgradeneeded === "function") {
          this._onupgradeneeded(evt);
        }
      };
      openRequest.onsuccess = () => {
        const db = openRequest.result;
        if (openRequestTimedOut) {
          db.close();
        } else {
          db.onversionchange = this._onversionchange.bind(this);
          resolve(db);
        }
      };
    });
    return this;
  }
  /**
   * Polyfills the native `getKey()` method. Note, this is overridden at
   * runtime if the browser supports the native method.
   *
   * @param {string} storeName
   * @param {*} query
   * @return {Array}
   * @private
   */
  async getKey(storeName, query) {
    return (await this.getAllKeys(storeName, query, 1))[0];
  }
  /**
   * Polyfills the native `getAll()` method. Note, this is overridden at
   * runtime if the browser supports the native method.
   *
   * @param {string} storeName
   * @param {*} query
   * @param {number} count
   * @return {Array}
   * @private
   */
  async getAll(storeName, query, count) {
    return await this.getAllMatching(storeName, { query, count });
  }
  /**
   * Polyfills the native `getAllKeys()` method. Note, this is overridden at
   * runtime if the browser supports the native method.
   *
   * @param {string} storeName
   * @param {*} query
   * @param {number} count
   * @return {Array}
   * @private
   */
  async getAllKeys(storeName, query, count) {
    const entries = await this.getAllMatching(storeName, { query, count, includeKeys: true });
    return entries.map((entry) => entry.key);
  }
  /**
   * Supports flexible lookup in an object store by specifying an index,
   * query, direction, and count. This method returns an array of objects
   * with the signature .
   *
   * @param {string} storeName
   * @param {Object} [opts]
   * @param {string} [opts.index] The index to use (if specified).
   * @param {*} [opts.query]
   * @param {IDBCursorDirection} [opts.direction]
   * @param {number} [opts.count] The max number of results to return.
   * @param {boolean} [opts.includeKeys] When true, the structure of the
   *     returned objects is changed from an array of values to an array of
   *     objects in the form {key, primaryKey, value}.
   * @return {Array}
   * @private
   */
  async getAllMatching(storeName, {
    index,
    query = null,
    // IE/Edge errors if query === `undefined`.
    direction = "next",
    count,
    includeKeys = false
  } = {}) {
    return await this.transaction([storeName], "readonly", (txn, done) => {
      const store = txn.objectStore(storeName);
      const target = index ? store.index(index) : store;
      const results = [];
      const request = target.openCursor(query, direction);
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          results.push(includeKeys ? cursor : cursor.value);
          if (count && results.length >= count) {
            done(results);
          } else {
            cursor.continue();
          }
        } else {
          done(results);
        }
      };
    });
  }
  /**
   * Accepts a list of stores, a transaction type, and a callback and
   * performs a transaction. A promise is returned that resolves to whatever
   * value the callback chooses. The callback holds all the transaction logic
   * and is invoked with two arguments:
   *   1. The IDBTransaction object
   *   2. A `done` function, that's used to resolve the promise when
   *      when the transaction is done, if passed a value, the promise is
   *      resolved to that value.
   *
   * @param {Array<string>} storeNames An array of object store names
   *     involved in the transaction.
   * @param {string} type Can be `readonly` or `readwrite`.
   * @param {!Function} callback
   * @return {*} The result of the transaction ran by the callback.
   * @private
   */
  async transaction(storeNames, type, callback) {
    await this.open();
    return await new Promise((resolve, reject) => {
      const txn = this._db.transaction(storeNames, type);
      txn.onabort = () => reject(txn.error);
      txn.oncomplete = () => resolve();
      callback(txn, (value) => resolve(value));
    });
  }
  /**
   * Delegates async to a native IDBObjectStore method.
   *
   * @param {string} method The method name.
   * @param {string} storeName The object store name.
   * @param {string} type Can be `readonly` or `readwrite`.
   * @param {...*} args The list of args to pass to the native method.
   * @return {*} The result of the transaction.
   * @private
   */
  async _call(method, storeName, type, ...args) {
    const callback = (txn, done) => {
      const objStore = txn.objectStore(storeName);
      const request = objStore[method].apply(objStore, args);
      request.onsuccess = () => done(request.result);
    };
    return await this.transaction([storeName], type, callback);
  }
  /**
   * Closes the connection opened by `DBWrapper.open()`. Generally this method
   * doesn't need to be called since:
   *   1. It's usually better to keep a connection open since opening
   *      a new connection is somewhat slow.
   *   2. Connections are automatically closed when the reference is
   *      garbage collected.
   * The primary use case for needing to close a connection is when another
   * reference (typically in another tab) needs to upgrade it and would be
   * blocked by the current, open connection.
   *
   * @private
   */
  close() {
    if (this._db) {
      this._db.close();
      this._db = null;
    }
  }
};
DBWrapper2.prototype.OPEN_TIMEOUT = 2e3;
var methodsToWrap2 = {
  readonly: ["get", "count", "getKey", "getAll", "getAllKeys"],
  readwrite: ["add", "put", "clear", "delete"]
};
for (const [mode, methods] of Object.entries(methodsToWrap2)) {
  for (const method of methods) {
    if (method in IDBObjectStore.prototype) {
      DBWrapper2.prototype[method] = async function(storeName, ...args) {
        return await this._call(method, storeName, mode, ...args);
      };
    }
  }
}

// node_modules/workbox-background-sync/_version.js
try {
  self["workbox:background-sync:5.1.4"] && _();
} catch (e) {
}

// node_modules/workbox-background-sync/lib/QueueStore.js
var DB_VERSION = 3;
var DB_NAME2 = "workbox-background-sync";
var OBJECT_STORE_NAME2 = "requests";
var INDEXED_PROP = "queueName";
var QueueStore = class {
  /**
   * Associates this instance with a Queue instance, so entries added can be
   * identified by their queue name.
   *
   * @param {string} queueName
   * @private
   */
  constructor(queueName) {
    this._queueName = queueName;
    this._db = new DBWrapper2(DB_NAME2, DB_VERSION, {
      onupgradeneeded: this._upgradeDb
    });
  }
  /**
   * Append an entry last in the queue.
   *
   * @param {Object} entry
   * @param {Object} entry.requestData
   * @param {number} [entry.timestamp]
   * @param {Object} [entry.metadata]
   * @private
   */
  async pushEntry(entry) {
    if (true) {
      finalAssertExports6.isType(entry, "object", {
        moduleName: "workbox-background-sync",
        className: "QueueStore",
        funcName: "pushEntry",
        paramName: "entry"
      });
      finalAssertExports6.isType(entry.requestData, "object", {
        moduleName: "workbox-background-sync",
        className: "QueueStore",
        funcName: "pushEntry",
        paramName: "entry.requestData"
      });
    }
    delete entry.id;
    entry.queueName = this._queueName;
    await this._db.add(OBJECT_STORE_NAME2, entry);
  }
  /**
   * Prepend an entry first in the queue.
   *
   * @param {Object} entry
   * @param {Object} entry.requestData
   * @param {number} [entry.timestamp]
   * @param {Object} [entry.metadata]
   * @private
   */
  async unshiftEntry(entry) {
    if (true) {
      finalAssertExports6.isType(entry, "object", {
        moduleName: "workbox-background-sync",
        className: "QueueStore",
        funcName: "unshiftEntry",
        paramName: "entry"
      });
      finalAssertExports6.isType(entry.requestData, "object", {
        moduleName: "workbox-background-sync",
        className: "QueueStore",
        funcName: "unshiftEntry",
        paramName: "entry.requestData"
      });
    }
    const [firstEntry] = await this._db.getAllMatching(OBJECT_STORE_NAME2, {
      count: 1
    });
    if (firstEntry) {
      entry.id = firstEntry.id - 1;
    } else {
      delete entry.id;
    }
    entry.queueName = this._queueName;
    await this._db.add(OBJECT_STORE_NAME2, entry);
  }
  /**
   * Removes and returns the last entry in the queue matching the `queueName`.
   *
   * @return {Promise<Object>}
   * @private
   */
  async popEntry() {
    return this._removeEntry({ direction: "prev" });
  }
  /**
   * Removes and returns the first entry in the queue matching the `queueName`.
   *
   * @return {Promise<Object>}
   * @private
   */
  async shiftEntry() {
    return this._removeEntry({ direction: "next" });
  }
  /**
   * Returns all entries in the store matching the `queueName`.
   *
   * @param {Object} options See {@link module:workbox-background-sync.Queue~getAll}
   * @return {Promise<Array<Object>>}
   * @private
   */
  async getAll() {
    return await this._db.getAllMatching(OBJECT_STORE_NAME2, {
      index: INDEXED_PROP,
      query: IDBKeyRange.only(this._queueName)
    });
  }
  /**
   * Deletes the entry for the given ID.
   *
   * WARNING: this method does not ensure the deleted enry belongs to this
   * queue (i.e. matches the `queueName`). But this limitation is acceptable
   * as this class is not publicly exposed. An additional check would make
   * this method slower than it needs to be.
   *
   * @private
   * @param {number} id
   */
  async deleteEntry(id) {
    await this._db.delete(OBJECT_STORE_NAME2, id);
  }
  /**
   * Removes and returns the first or last entry in the queue (based on the
   * `direction` argument) matching the `queueName`.
   *
   * @return {Promise<Object>}
   * @private
   */
  async _removeEntry({ direction }) {
    const [entry] = await this._db.getAllMatching(OBJECT_STORE_NAME2, {
      direction,
      index: INDEXED_PROP,
      query: IDBKeyRange.only(this._queueName),
      count: 1
    });
    if (entry) {
      await this.deleteEntry(entry.id);
      return entry;
    }
  }
  /**
   * Upgrades the database given an `upgradeneeded` event.
   *
   * @param {Event} event
   * @private
   */
  _upgradeDb(event) {
    const db = event.target.result;
    if (event.oldVersion > 0 && event.oldVersion < DB_VERSION) {
      if (db.objectStoreNames.contains(OBJECT_STORE_NAME2)) {
        db.deleteObjectStore(OBJECT_STORE_NAME2);
      }
    }
    const objStore = db.createObjectStore(OBJECT_STORE_NAME2, {
      autoIncrement: true,
      keyPath: "id"
    });
    objStore.createIndex(INDEXED_PROP, INDEXED_PROP, { unique: false });
  }
};

// node_modules/workbox-background-sync/lib/StorableRequest.js
var serializableProperties = [
  "method",
  "referrer",
  "referrerPolicy",
  "mode",
  "credentials",
  "cache",
  "redirect",
  "integrity",
  "keepalive"
];
var StorableRequest = class _StorableRequest {
  /**
   * Accepts an object of request data that can be used to construct a
   * `Request` but can also be stored in IndexedDB.
   *
   * @param {Object} requestData An object of request data that includes the
   *     `url` plus any relevant properties of
   *     [requestInit]{@link https://fetch.spec.whatwg.org/#requestinit}.
   * @private
   */
  constructor(requestData) {
    if (true) {
      finalAssertExports6.isType(requestData, "object", {
        moduleName: "workbox-background-sync",
        className: "StorableRequest",
        funcName: "constructor",
        paramName: "requestData"
      });
      finalAssertExports6.isType(requestData.url, "string", {
        moduleName: "workbox-background-sync",
        className: "StorableRequest",
        funcName: "constructor",
        paramName: "requestData.url"
      });
    }
    if (requestData["mode"] === "navigate") {
      requestData["mode"] = "same-origin";
    }
    this._requestData = requestData;
  }
  /**
   * Converts a Request object to a plain object that can be structured
   * cloned or JSON-stringified.
   *
   * @param {Request} request
   * @return {Promise<StorableRequest>}
   *
   * @private
   */
  static async fromRequest(request) {
    const requestData = {
      url: request.url,
      headers: {}
    };
    if (request.method !== "GET") {
      requestData.body = await request.clone().arrayBuffer();
    }
    for (const [key, value] of request.headers.entries()) {
      requestData.headers[key] = value;
    }
    for (const prop of serializableProperties) {
      if (request[prop] !== void 0) {
        requestData[prop] = request[prop];
      }
    }
    return new _StorableRequest(requestData);
  }
  /**
   * Returns a deep clone of the instances `_requestData` object.
   *
   * @return {Object}
   *
   * @private
   */
  toObject() {
    const requestData = Object.assign({}, this._requestData);
    requestData.headers = Object.assign({}, this._requestData.headers);
    if (requestData.body) {
      requestData.body = requestData.body.slice(0);
    }
    return requestData;
  }
  /**
   * Converts this instance to a Request.
   *
   * @return {Request}
   *
   * @private
   */
  toRequest() {
    return new Request(this._requestData.url, this._requestData);
  }
  /**
   * Creates and returns a deep clone of the instance.
   *
   * @return {StorableRequest}
   *
   * @private
   */
  clone() {
    return new _StorableRequest(this.toObject());
  }
};

// node_modules/workbox-background-sync/Queue.js
var TAG_PREFIX = "workbox-background-sync";
var MAX_RETENTION_TIME = 60 * 24 * 7;
var queueNames = /* @__PURE__ */ new Set();
var convertEntry = (queueStoreEntry) => {
  const queueEntry = {
    request: new StorableRequest(queueStoreEntry.requestData).toRequest(),
    timestamp: queueStoreEntry.timestamp
  };
  if (queueStoreEntry.metadata) {
    queueEntry.metadata = queueStoreEntry.metadata;
  }
  return queueEntry;
};
var Queue = class {
  /**
   * Creates an instance of Queue with the given options
   *
   * @param {string} name The unique name for this queue. This name must be
   *     unique as it's used to register sync events and store requests
   *     in IndexedDB specific to this instance. An error will be thrown if
   *     a duplicate name is detected.
   * @param {Object} [options]
   * @param {Function} [options.onSync] A function that gets invoked whenever
   *     the 'sync' event fires. The function is invoked with an object
   *     containing the `queue` property (referencing this instance), and you
   *     can use the callback to customize the replay behavior of the queue.
   *     When not set the `replayRequests()` method is called.
   *     Note: if the replay fails after a sync event, make sure you throw an
   *     error, so the browser knows to retry the sync event later.
   * @param {number} [options.maxRetentionTime=7 days] The amount of time (in
   *     minutes) a request may be retried. After this amount of time has
   *     passed, the request will be deleted from the queue.
   */
  constructor(name, { onSync, maxRetentionTime } = {}) {
    this._syncInProgress = false;
    this._requestsAddedDuringSync = false;
    if (queueNames.has(name)) {
      throw new WorkboxError6("duplicate-queue-name", { name });
    } else {
      queueNames.add(name);
    }
    this._name = name;
    this._onSync = onSync || this.replayRequests;
    this._maxRetentionTime = maxRetentionTime || MAX_RETENTION_TIME;
    this._queueStore = new QueueStore(this._name);
    this._addSyncListener();
  }
  /**
   * @return {string}
   */
  get name() {
    return this._name;
  }
  /**
   * Stores the passed request in IndexedDB (with its timestamp and any
   * metadata) at the end of the queue.
   *
   * @param {Object} entry
   * @param {Request} entry.request The request to store in the queue.
   * @param {Object} [entry.metadata] Any metadata you want associated with the
   *     stored request. When requests are replayed you'll have access to this
   *     metadata object in case you need to modify the request beforehand.
   * @param {number} [entry.timestamp] The timestamp (Epoch time in
   *     milliseconds) when the request was first added to the queue. This is
   *     used along with `maxRetentionTime` to remove outdated requests. In
   *     general you don't need to set this value, as it's automatically set
   *     for you (defaulting to `Date.now()`), but you can update it if you
   *     don't want particular requests to expire.
   */
  async pushRequest(entry) {
    if (true) {
      finalAssertExports6.isType(entry, "object", {
        moduleName: "workbox-background-sync",
        className: "Queue",
        funcName: "pushRequest",
        paramName: "entry"
      });
      finalAssertExports6.isInstance(entry.request, Request, {
        moduleName: "workbox-background-sync",
        className: "Queue",
        funcName: "pushRequest",
        paramName: "entry.request"
      });
    }
    await this._addRequest(entry, "push");
  }
  /**
   * Stores the passed request in IndexedDB (with its timestamp and any
   * metadata) at the beginning of the queue.
   *
   * @param {Object} entry
   * @param {Request} entry.request The request to store in the queue.
   * @param {Object} [entry.metadata] Any metadata you want associated with the
   *     stored request. When requests are replayed you'll have access to this
   *     metadata object in case you need to modify the request beforehand.
   * @param {number} [entry.timestamp] The timestamp (Epoch time in
   *     milliseconds) when the request was first added to the queue. This is
   *     used along with `maxRetentionTime` to remove outdated requests. In
   *     general you don't need to set this value, as it's automatically set
   *     for you (defaulting to `Date.now()`), but you can update it if you
   *     don't want particular requests to expire.
   */
  async unshiftRequest(entry) {
    if (true) {
      finalAssertExports6.isType(entry, "object", {
        moduleName: "workbox-background-sync",
        className: "Queue",
        funcName: "unshiftRequest",
        paramName: "entry"
      });
      finalAssertExports6.isInstance(entry.request, Request, {
        moduleName: "workbox-background-sync",
        className: "Queue",
        funcName: "unshiftRequest",
        paramName: "entry.request"
      });
    }
    await this._addRequest(entry, "unshift");
  }
  /**
   * Removes and returns the last request in the queue (along with its
   * timestamp and any metadata). The returned object takes the form:
   * `{request, timestamp, metadata}`.
   *
   * @return {Promise<Object>}
   */
  async popRequest() {
    return this._removeRequest("pop");
  }
  /**
   * Removes and returns the first request in the queue (along with its
   * timestamp and any metadata). The returned object takes the form:
   * `{request, timestamp, metadata}`.
   *
   * @return {Promise<Object>}
   */
  async shiftRequest() {
    return this._removeRequest("shift");
  }
  /**
   * Returns all the entries that have not expired (per `maxRetentionTime`).
   * Any expired entries are removed from the queue.
   *
   * @return {Promise<Array<Object>>}
   */
  async getAll() {
    const allEntries = await this._queueStore.getAll();
    const now = Date.now();
    const unexpiredEntries = [];
    for (const entry of allEntries) {
      const maxRetentionTimeInMs = this._maxRetentionTime * 60 * 1e3;
      if (now - entry.timestamp > maxRetentionTimeInMs) {
        await this._queueStore.deleteEntry(entry.id);
      } else {
        unexpiredEntries.push(convertEntry(entry));
      }
    }
    return unexpiredEntries;
  }
  /**
   * Adds the entry to the QueueStore and registers for a sync event.
   *
   * @param {Object} entry
   * @param {Request} entry.request
   * @param {Object} [entry.metadata]
   * @param {number} [entry.timestamp=Date.now()]
   * @param {string} operation ('push' or 'unshift')
   * @private
   */
  async _addRequest({ request, metadata, timestamp = Date.now() }, operation) {
    const storableRequest = await StorableRequest.fromRequest(request.clone());
    const entry = {
      requestData: storableRequest.toObject(),
      timestamp
    };
    if (metadata) {
      entry.metadata = metadata;
    }
    await this._queueStore[`${operation}Entry`](entry);
    if (true) {
      logger6.log(`Request for '${getFriendlyURL6(request.url)}' has been added to background sync queue '${this._name}'.`);
    }
    if (this._syncInProgress) {
      this._requestsAddedDuringSync = true;
    } else {
      await this.registerSync();
    }
  }
  /**
   * Removes and returns the first or last (depending on `operation`) entry
   * from the QueueStore that's not older than the `maxRetentionTime`.
   *
   * @param {string} operation ('pop' or 'shift')
   * @return {Object|undefined}
   * @private
   */
  async _removeRequest(operation) {
    const now = Date.now();
    const entry = await this._queueStore[`${operation}Entry`]();
    if (entry) {
      const maxRetentionTimeInMs = this._maxRetentionTime * 60 * 1e3;
      if (now - entry.timestamp > maxRetentionTimeInMs) {
        return this._removeRequest(operation);
      }
      return convertEntry(entry);
    } else {
      return void 0;
    }
  }
  /**
   * Loops through each request in the queue and attempts to re-fetch it.
   * If any request fails to re-fetch, it's put back in the same position in
   * the queue (which registers a retry for the next sync event).
   */
  async replayRequests() {
    let entry;
    while (entry = await this.shiftRequest()) {
      try {
        await fetch(entry.request.clone());
        if (true) {
          logger6.log(`Request for '${getFriendlyURL6(entry.request.url)}'has been replayed in queue '${this._name}'`);
        }
      } catch (error) {
        await this.unshiftRequest(entry);
        if (true) {
          logger6.log(`Request for '${getFriendlyURL6(entry.request.url)}'failed to replay, putting it back in queue '${this._name}'`);
        }
        throw new WorkboxError6("queue-replay-failed", { name: this._name });
      }
    }
    if (true) {
      logger6.log(`All requests in queue '${this.name}' have successfully replayed; the queue is now empty!`);
    }
  }
  /**
   * Registers a sync event with a tag unique to this instance.
   */
  async registerSync() {
    if ("sync" in self.registration) {
      try {
        await self.registration.sync.register(`${TAG_PREFIX}:${this._name}`);
      } catch (err) {
        if (true) {
          logger6.warn(`Unable to register sync event for '${this._name}'.`, err);
        }
      }
    }
  }
  /**
   * In sync-supporting browsers, this adds a listener for the sync event.
   * In non-sync-supporting browsers, this will retry the queue on service
   * worker startup.
   *
   * @private
   */
  _addSyncListener() {
    if ("sync" in self.registration) {
      self.addEventListener("sync", (event) => {
        if (event.tag === `${TAG_PREFIX}:${this._name}`) {
          if (true) {
            logger6.log(`Background sync for tag '${event.tag}'has been received`);
          }
          const syncComplete = async () => {
            this._syncInProgress = true;
            let syncError;
            try {
              await this._onSync({ queue: this });
            } catch (error) {
              syncError = error;
              throw syncError;
            } finally {
              if (this._requestsAddedDuringSync && !(syncError && !event.lastChance)) {
                await this.registerSync();
              }
              this._syncInProgress = false;
              this._requestsAddedDuringSync = false;
            }
          };
          event.waitUntil(syncComplete());
        }
      });
    } else {
      if (true) {
        logger6.log(`Background sync replaying without background sync event`);
      }
      this._onSync({ queue: this });
    }
  }
  /**
   * Returns the set of queue names. This is primarily used to reset the list
   * of queue names in tests.
   *
   * @return {Set}
   *
   * @private
   */
  static get _queueNames() {
    return queueNames;
  }
};

// node_modules/workbox-background-sync/BackgroundSyncPlugin.js
var BackgroundSyncPlugin = class {
  /**
   * @param {string} name See the [Queue]{@link module:workbox-background-sync.Queue}
   *     documentation for parameter details.
   * @param {Object} [options] See the
   *     [Queue]{@link module:workbox-background-sync.Queue} documentation for
   *     parameter details.
   */
  constructor(name, options) {
    this.fetchDidFail = async ({ request }) => {
      await this._queue.pushRequest({ request });
    };
    this._queue = new Queue(name, options);
  }
};

// node_modules/workbox-range-requests/node_modules/workbox-core/_version.js
try {
  self["workbox:core:5.1.4"] && _();
} catch (e) {
}

// node_modules/workbox-range-requests/node_modules/workbox-core/models/messages/messages.js
var messages8 = {
  "invalid-value": ({ paramName, validValueDescription, value }) => {
    if (!paramName || !validValueDescription) {
      throw new Error(`Unexpected input to 'invalid-value' error.`);
    }
    return `The '${paramName}' parameter was given a value with an unexpected value. ${validValueDescription} Received a value of ${JSON.stringify(value)}.`;
  },
  "not-an-array": ({ moduleName, className, funcName, paramName }) => {
    if (!moduleName || !className || !funcName || !paramName) {
      throw new Error(`Unexpected input to 'not-an-array' error.`);
    }
    return `The parameter '${paramName}' passed into '${moduleName}.${className}.${funcName}()' must be an array.`;
  },
  "incorrect-type": ({ expectedType, paramName, moduleName, className, funcName }) => {
    if (!expectedType || !paramName || !moduleName || !funcName) {
      throw new Error(`Unexpected input to 'incorrect-type' error.`);
    }
    return `The parameter '${paramName}' passed into '${moduleName}.${className ? className + "." : ""}${funcName}()' must be of type ${expectedType}.`;
  },
  "incorrect-class": ({ expectedClass, paramName, moduleName, className, funcName, isReturnValueProblem }) => {
    if (!expectedClass || !moduleName || !funcName) {
      throw new Error(`Unexpected input to 'incorrect-class' error.`);
    }
    if (isReturnValueProblem) {
      return `The return value from '${moduleName}.${className ? className + "." : ""}${funcName}()' must be an instance of class ${expectedClass.name}.`;
    }
    return `The parameter '${paramName}' passed into '${moduleName}.${className ? className + "." : ""}${funcName}()' must be an instance of class ${expectedClass.name}.`;
  },
  "missing-a-method": ({ expectedMethod, paramName, moduleName, className, funcName }) => {
    if (!expectedMethod || !paramName || !moduleName || !className || !funcName) {
      throw new Error(`Unexpected input to 'missing-a-method' error.`);
    }
    return `${moduleName}.${className}.${funcName}() expected the '${paramName}' parameter to expose a '${expectedMethod}' method.`;
  },
  "add-to-cache-list-unexpected-type": ({ entry }) => {
    return `An unexpected entry was passed to 'workbox-precaching.PrecacheController.addToCacheList()' The entry '${JSON.stringify(entry)}' isn't supported. You must supply an array of strings with one or more characters, objects with a url property or Request objects.`;
  },
  "add-to-cache-list-conflicting-entries": ({ firstEntry, secondEntry }) => {
    if (!firstEntry || !secondEntry) {
      throw new Error(`Unexpected input to 'add-to-cache-list-duplicate-entries' error.`);
    }
    return `Two of the entries passed to 'workbox-precaching.PrecacheController.addToCacheList()' had the URL ${firstEntry._entryId} but different revision details. Workbox is unable to cache and version the asset correctly. Please remove one of the entries.`;
  },
  "plugin-error-request-will-fetch": ({ thrownError }) => {
    if (!thrownError) {
      throw new Error(`Unexpected input to 'plugin-error-request-will-fetch', error.`);
    }
    return `An error was thrown by a plugins 'requestWillFetch()' method. The thrown error message was: '${thrownError.message}'.`;
  },
  "invalid-cache-name": ({ cacheNameId, value }) => {
    if (!cacheNameId) {
      throw new Error(`Expected a 'cacheNameId' for error 'invalid-cache-name'`);
    }
    return `You must provide a name containing at least one character for setCacheDetails({${cacheNameId}: '...'}). Received a value of '${JSON.stringify(value)}'`;
  },
  "unregister-route-but-not-found-with-method": ({ method }) => {
    if (!method) {
      throw new Error(`Unexpected input to 'unregister-route-but-not-found-with-method' error.`);
    }
    return `The route you're trying to unregister was not  previously registered for the method type '${method}'.`;
  },
  "unregister-route-route-not-registered": () => {
    return `The route you're trying to unregister was not previously registered.`;
  },
  "queue-replay-failed": ({ name }) => {
    return `Replaying the background sync queue '${name}' failed.`;
  },
  "duplicate-queue-name": ({ name }) => {
    return `The Queue name '${name}' is already being used. All instances of backgroundSync.Queue must be given unique names.`;
  },
  "expired-test-without-max-age": ({ methodName, paramName }) => {
    return `The '${methodName}()' method can only be used when the '${paramName}' is used in the constructor.`;
  },
  "unsupported-route-type": ({ moduleName, className, funcName, paramName }) => {
    return `The supplied '${paramName}' parameter was an unsupported type. Please check the docs for ${moduleName}.${className}.${funcName} for valid input types.`;
  },
  "not-array-of-class": ({ value, expectedClass, moduleName, className, funcName, paramName }) => {
    return `The supplied '${paramName}' parameter must be an array of '${expectedClass}' objects. Received '${JSON.stringify(value)},'. Please check the call to ${moduleName}.${className}.${funcName}() to fix the issue.`;
  },
  "max-entries-or-age-required": ({ moduleName, className, funcName }) => {
    return `You must define either config.maxEntries or config.maxAgeSecondsin ${moduleName}.${className}.${funcName}`;
  },
  "statuses-or-headers-required": ({ moduleName, className, funcName }) => {
    return `You must define either config.statuses or config.headersin ${moduleName}.${className}.${funcName}`;
  },
  "invalid-string": ({ moduleName, funcName, paramName }) => {
    if (!paramName || !moduleName || !funcName) {
      throw new Error(`Unexpected input to 'invalid-string' error.`);
    }
    return `When using strings, the '${paramName}' parameter must start with 'http' (for cross-origin matches) or '/' (for same-origin matches). Please see the docs for ${moduleName}.${funcName}() for more info.`;
  },
  "channel-name-required": () => {
    return `You must provide a channelName to construct a BroadcastCacheUpdate instance.`;
  },
  "invalid-responses-are-same-args": () => {
    return `The arguments passed into responsesAreSame() appear to be invalid. Please ensure valid Responses are used.`;
  },
  "expire-custom-caches-only": () => {
    return `You must provide a 'cacheName' property when using the expiration plugin with a runtime caching strategy.`;
  },
  "unit-must-be-bytes": ({ normalizedRangeHeader }) => {
    if (!normalizedRangeHeader) {
      throw new Error(`Unexpected input to 'unit-must-be-bytes' error.`);
    }
    return `The 'unit' portion of the Range header must be set to 'bytes'. The Range header provided was "${normalizedRangeHeader}"`;
  },
  "single-range-only": ({ normalizedRangeHeader }) => {
    if (!normalizedRangeHeader) {
      throw new Error(`Unexpected input to 'single-range-only' error.`);
    }
    return `Multiple ranges are not supported. Please use a  single start value, and optional end value. The Range header provided was "${normalizedRangeHeader}"`;
  },
  "invalid-range-values": ({ normalizedRangeHeader }) => {
    if (!normalizedRangeHeader) {
      throw new Error(`Unexpected input to 'invalid-range-values' error.`);
    }
    return `The Range header is missing both start and end values. At least one of those values is needed. The Range header provided was "${normalizedRangeHeader}"`;
  },
  "no-range-header": () => {
    return `No Range header was found in the Request provided.`;
  },
  "range-not-satisfiable": ({ size, start, end }) => {
    return `The start (${start}) and end (${end}) values in the Range are not satisfiable by the cached response, which is ${size} bytes.`;
  },
  "attempt-to-cache-non-get-request": ({ url, method }) => {
    return `Unable to cache '${url}' because it is a '${method}' request and only 'GET' requests can be cached.`;
  },
  "cache-put-with-no-response": ({ url }) => {
    return `There was an attempt to cache '${url}' but the response was not defined.`;
  },
  "no-response": ({ url, error }) => {
    let message = `The strategy could not generate a response for '${url}'.`;
    if (error) {
      message += ` The underlying error is ${error}.`;
    }
    return message;
  },
  "bad-precaching-response": ({ url, status }) => {
    return `The precaching request for '${url}' failed with an HTTP status of ${status}.`;
  },
  "non-precached-url": ({ url }) => {
    return `createHandlerBoundToURL('${url}') was called, but that URL is not precached. Please pass in a URL that is precached instead.`;
  },
  "add-to-cache-list-conflicting-integrities": ({ url }) => {
    return `Two of the entries passed to 'workbox-precaching.PrecacheController.addToCacheList()' had the URL ${url} with different integrity values. Please remove one of them.`;
  },
  "missing-precache-entry": ({ cacheName, url }) => {
    return `Unable to find a precached response in ${cacheName} for ${url}.`;
  }
};

// node_modules/workbox-range-requests/node_modules/workbox-core/models/messages/messageGenerator.js
var generatorFunction7 = (code, details = {}) => {
  const message = messages8[code];
  if (!message) {
    throw new Error(`Unable to find message for code '${code}'.`);
  }
  return message(details);
};
var messageGenerator7 = false ? fallback : generatorFunction7;

// node_modules/workbox-range-requests/node_modules/workbox-core/_private/WorkboxError.js
var WorkboxError7 = class extends Error {
  /**
   *
   * @param {string} errorCode The error code that
   * identifies this particular error.
   * @param {Object=} details Any relevant arguments
   * that will help developers identify issues should
   * be added as a key on the context object.
   */
  constructor(errorCode, details) {
    const message = messageGenerator7(errorCode, details);
    super(message);
    this.name = errorCode;
    this.details = details;
  }
};

// node_modules/workbox-range-requests/node_modules/workbox-core/_private/assert.js
var isArray7 = (value, details) => {
  if (!Array.isArray(value)) {
    throw new WorkboxError7("not-an-array", details);
  }
};
var hasMethod7 = (object, expectedMethod, details) => {
  const type = typeof object[expectedMethod];
  if (type !== "function") {
    details["expectedMethod"] = expectedMethod;
    throw new WorkboxError7("missing-a-method", details);
  }
};
var isType7 = (object, expectedType, details) => {
  if (typeof object !== expectedType) {
    details["expectedType"] = expectedType;
    throw new WorkboxError7("incorrect-type", details);
  }
};
var isInstance7 = (object, expectedClass, details) => {
  if (!(object instanceof expectedClass)) {
    details["expectedClass"] = expectedClass;
    throw new WorkboxError7("incorrect-class", details);
  }
};
var isOneOf7 = (value, validValues, details) => {
  if (!validValues.includes(value)) {
    details["validValueDescription"] = `Valid values are ${JSON.stringify(validValues)}.`;
    throw new WorkboxError7("invalid-value", details);
  }
};
var isArrayOfClass7 = (value, expectedClass, details) => {
  const error = new WorkboxError7("not-array-of-class", details);
  if (!Array.isArray(value)) {
    throw error;
  }
  for (const item of value) {
    if (!(item instanceof expectedClass)) {
      throw error;
    }
  }
};
var finalAssertExports7 = false ? null : {
  hasMethod: hasMethod7,
  isArray: isArray7,
  isInstance: isInstance7,
  isOneOf: isOneOf7,
  isType: isType7,
  isArrayOfClass: isArrayOfClass7
};

// node_modules/workbox-range-requests/node_modules/workbox-core/_private/logger.js
var logger7 = false ? null : (() => {
  if (!("__WB_DISABLE_DEV_LOGS" in self)) {
    self.__WB_DISABLE_DEV_LOGS = false;
  }
  let inGroup = false;
  const methodToColorMap = {
    debug: `#7f8c8d`,
    log: `#2ecc71`,
    warn: `#f39c12`,
    error: `#c0392b`,
    groupCollapsed: `#3498db`,
    groupEnd: null
  };
  const print = function(method, args) {
    if (self.__WB_DISABLE_DEV_LOGS) {
      return;
    }
    if (method === "groupCollapsed") {
      if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        console[method](...args);
        return;
      }
    }
    const styles = [
      `background: ${methodToColorMap[method]}`,
      `border-radius: 0.5em`,
      `color: white`,
      `font-weight: bold`,
      `padding: 2px 0.5em`
    ];
    const logPrefix = inGroup ? [] : ["%cworkbox", styles.join(";")];
    console[method](...logPrefix, ...args);
    if (method === "groupCollapsed") {
      inGroup = true;
    }
    if (method === "groupEnd") {
      inGroup = false;
    }
  };
  const api = {};
  const loggerMethods = Object.keys(methodToColorMap);
  for (const key of loggerMethods) {
    const method = key;
    api[method] = (...args) => {
      print(method, args);
    };
  }
  return api;
})();

// node_modules/workbox-range-requests/_version.js
try {
  self["workbox:range-requests:5.1.4"] && _();
} catch (e) {
}

// node_modules/workbox-range-requests/utils/calculateEffectiveBoundaries.js
function calculateEffectiveBoundaries(blob, start, end) {
  if (true) {
    finalAssertExports7.isInstance(blob, Blob, {
      moduleName: "workbox-range-requests",
      funcName: "calculateEffectiveBoundaries",
      paramName: "blob"
    });
  }
  const blobSize = blob.size;
  if (end && end > blobSize || start && start < 0) {
    throw new WorkboxError7("range-not-satisfiable", {
      size: blobSize,
      end,
      start
    });
  }
  let effectiveStart;
  let effectiveEnd;
  if (start !== void 0 && end !== void 0) {
    effectiveStart = start;
    effectiveEnd = end + 1;
  } else if (start !== void 0 && end === void 0) {
    effectiveStart = start;
    effectiveEnd = blobSize;
  } else if (end !== void 0 && start === void 0) {
    effectiveStart = blobSize - end;
    effectiveEnd = blobSize;
  }
  return {
    start: effectiveStart,
    end: effectiveEnd
  };
}

// node_modules/workbox-range-requests/utils/parseRangeHeader.js
function parseRangeHeader(rangeHeader) {
  if (true) {
    finalAssertExports7.isType(rangeHeader, "string", {
      moduleName: "workbox-range-requests",
      funcName: "parseRangeHeader",
      paramName: "rangeHeader"
    });
  }
  const normalizedRangeHeader = rangeHeader.trim().toLowerCase();
  if (!normalizedRangeHeader.startsWith("bytes=")) {
    throw new WorkboxError7("unit-must-be-bytes", { normalizedRangeHeader });
  }
  if (normalizedRangeHeader.includes(",")) {
    throw new WorkboxError7("single-range-only", { normalizedRangeHeader });
  }
  const rangeParts = /(\d*)-(\d*)/.exec(normalizedRangeHeader);
  if (!rangeParts || !(rangeParts[1] || rangeParts[2])) {
    throw new WorkboxError7("invalid-range-values", { normalizedRangeHeader });
  }
  return {
    start: rangeParts[1] === "" ? void 0 : Number(rangeParts[1]),
    end: rangeParts[2] === "" ? void 0 : Number(rangeParts[2])
  };
}

// node_modules/workbox-range-requests/createPartialResponse.js
async function createPartialResponse(request, originalResponse) {
  try {
    if (true) {
      finalAssertExports7.isInstance(request, Request, {
        moduleName: "workbox-range-requests",
        funcName: "createPartialResponse",
        paramName: "request"
      });
      finalAssertExports7.isInstance(originalResponse, Response, {
        moduleName: "workbox-range-requests",
        funcName: "createPartialResponse",
        paramName: "originalResponse"
      });
    }
    if (originalResponse.status === 206) {
      return originalResponse;
    }
    const rangeHeader = request.headers.get("range");
    if (!rangeHeader) {
      throw new WorkboxError7("no-range-header");
    }
    const boundaries = parseRangeHeader(rangeHeader);
    const originalBlob = await originalResponse.blob();
    const effectiveBoundaries = calculateEffectiveBoundaries(originalBlob, boundaries.start, boundaries.end);
    const slicedBlob = originalBlob.slice(effectiveBoundaries.start, effectiveBoundaries.end);
    const slicedBlobSize = slicedBlob.size;
    const slicedResponse = new Response(slicedBlob, {
      // Status code 206 is for a Partial Content response.
      // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/206
      status: 206,
      statusText: "Partial Content",
      headers: originalResponse.headers
    });
    slicedResponse.headers.set("Content-Length", String(slicedBlobSize));
    slicedResponse.headers.set("Content-Range", `bytes ${effectiveBoundaries.start}-${effectiveBoundaries.end - 1}/` + originalBlob.size);
    return slicedResponse;
  } catch (error) {
    if (true) {
      logger7.warn(`Unable to construct a partial response; returning a 416 Range Not Satisfiable response instead.`);
      logger7.groupCollapsed(`View details here.`);
      logger7.log(error);
      logger7.log(request);
      logger7.log(originalResponse);
      logger7.groupEnd();
    }
    return new Response("", {
      status: 416,
      statusText: "Range Not Satisfiable"
    });
  }
}

// node_modules/workbox-range-requests/RangeRequestsPlugin.js
var RangeRequestsPlugin = class {
  constructor() {
    this.cachedResponseWillBeUsed = async ({ request, cachedResponse }) => {
      if (cachedResponse && request.headers.has("range")) {
        return await createPartialResponse(request, cachedResponse);
      }
      return cachedResponse;
    };
  }
};

// src/service-worker.js
precacheAndRoute([
  ...self.__WB_MANIFEST,
  {
    url: "https://ga.jspm.io/npm:@js-temporal/polyfill@0.4.4/dist/index.esm.js",
    revision: null
  },
  {
    url: "https://ga.jspm.io/npm:idb-keyval@6.2.1/dist/index.js",
    revision: null
  },
  {
    url: "https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js",
    revision: null
  },
  { url: "https://ga.jspm.io/npm:jsbi@4.3.0/dist/jsbi-umd.js", revision: null }
]);
setCatchHandler(({ event, request }) => {
  console.log(event, request);
});
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
self.addEventListener("push", function(event) {
  if (!event.data) {
    console.log("This push event has no data.");
    return;
  }
  if (!self.registration) {
    console.log("Service worker does not control the page");
    return;
  }
  if (!self.registration || !self.registration.pushManager) {
    console.log("Push is not supported");
    return;
  }
  const eventText = event.data.text();
  let options = {
    badge: "./badge.png",
    icon: "./badge.png",
    image: "./icon512_maskable.png"
  };
  let title = "";
  if (eventText.substr(0, 1) === "{") {
    const eventData = JSON.parse(eventText);
    title = eventData.title;
    if (eventData.options) {
      options = Object.assign(options, eventData.options);
    }
    if (eventData.expires && Date.now() > eventData.expires) {
      console.log("Push notification has expired");
      return;
    }
  } else {
    title = eventText;
  }
  const promiseChain = self.registration.showNotification(title, options);
  event.waitUntil(promiseChain);
});
registerRoute(
  ({ request }) => request.destination === "audio",
  new CacheFirst({
    cacheName: "audio-cache",
    plugins: [
      new CacheableResponse({
        statuses: [200]
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 60
      }),
      new BackgroundSyncPlugin(),
      new RangeRequestsPlugin()
    ]
  })
);
registerRoute(
  ({ url }) => /oracle.mone.dev\/podsurfer\/$/.test(url.toString()),
  new StaleWhileRevalidate({
    cacheName: "podcast-cache",
    plugins: [
      new CacheableResponse({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 60
      }),
      {
        cacheDidUpdate: async ({ request, event, cacheName }) => {
          const freshResponse = await caches.match(request, { cacheName });
          const responseJson = await freshResponse.json();
          const client = await self.clients.get(event.clientId);
          if (!client) return;
          client.postMessage({
            type: "PODCAST_CACHE_UPDATE",
            podcasts: responseJson
          });
        }
      }
    ]
  })
);
registerRoute(
  ({ url }) => /oracle.mone.dev\/podsurfer\/episode/.test(url.toString()),
  new NetworkFirst({
    cacheName: "episode-cache",
    plugins: [
      new CacheableResponse({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 60,
        maxEntries: 60
      })
    ]
  })
);
registerRoute(
  ({ url }) => /oracle.mone.dev\/podsurfer\/recent/.test(url.toString()),
  new NetworkFirst({
    cacheName: "recent-cache",
    plugins: [
      new CacheableResponse({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 60
      })
    ]
  })
);
registerRoute(
  ({ request }) => {
    console.log(request.destination);
    return request.destination === "image";
  },
  new CacheFirst({
    cacheName: "image-cache",
    plugins: [
      {
        requestWillFetch: async ({ request }) => {
          console.log(`requesting, url: ${request.url}`);
          return new Request(
            `https://oracle.mone.dev/image/?url=${request.url}`,
            { ...request }
          );
        }
      },
      new CacheableResponse({
        headers: {
          "Cross-Origin-Resource-Policy": "cross-origin"
        },
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 60
      })
    ]
  })
);
