var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentQuery, _currentQueryInitialState, _currentResult, _currentResultState, _currentResultOptions, _currentThenable, _selectError, _selectFn, _selectResult, _lastQueryWithDefinedData, _staleTimeoutId, _refetchIntervalId, _currentRefetchInterval, _trackedProps, _QueryObserver_instances, executeFetch_fn, updateStaleTimeout_fn, computeRefetchInterval_fn, updateRefetchInterval_fn, updateTimers_fn, clearStaleTimeout_fn, clearRefetchInterval_fn, updateQuery_fn, notify_fn, _a;
import { P as ProtocolError, T as TimeoutWaitingForResponseErrorCode, q as utf8ToBytes, E as ExternalError, M as MissingRootKeyErrorCode, C as Certificate, t as lookupResultToBuffer, v as RequestStatusResponseStatus, U as UnknownError, w as RequestStatusDoneNoReplyErrorCode, x as RejectError, y as CertifiedRejectErrorCode, z as UNREACHABLE_ERROR, I as InputError, A as InvalidReadStateRequestErrorCode, B as ReadRequestType, D as Principal, F as IDL, G as MissingCanisterIdErrorCode, H as HttpAgent, J as encode, Q as QueryResponseStatus, K as UncertifiedRejectErrorCode, N as isV3ResponseBody, O as isV2ResponseBody, V as UncertifiedRejectUpdateErrorCode, W as UnexpectedErrorCode, X as decode, i as Subscribable, Y as pendingThenable, Z as resolveEnabled, s as shallowEqualObjects, _ as resolveStaleTime, m as noop, $ as environmentManager, a0 as isValidTimeout, a1 as timeUntilStale, a2 as timeoutManager, a3 as focusManager, a4 as fetchState, a5 as replaceData, n as notifyManager, r as reactExports, o as shouldThrowError, d as useQueryClient, u as useInternetIdentity, a6 as createActorWithConfig, j as jsxRuntimeExports, g as React, a7 as clsx, c as cn, a8 as Variant, a9 as Record, aa as Opt, ab as Vec, ac as Service, ad as Func, ae as Nat, af as Text, ag as Int, ah as Null, ai as Bool, aj as Principal$1 } from "./index-Bb6f_FCk.js";
const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1e3;
function defaultStrategy() {
  return chain(conditionalDelay(once(), 1e3), backoff(1e3, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
function once() {
  let first = true;
  return async () => {
    if (first) {
      first = false;
      return true;
    }
    return false;
  };
}
function conditionalDelay(condition, timeInMsec) {
  return async (canisterId, requestId, status) => {
    if (await condition(canisterId, requestId, status)) {
      return new Promise((resolve) => setTimeout(resolve, timeInMsec));
    }
  };
}
function timeout(timeInMsec) {
  const end = Date.now() + timeInMsec;
  return async (_canisterId, requestId, status) => {
    if (Date.now() > end) {
      throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Request timed out after ${timeInMsec} msec`, requestId, status));
    }
  };
}
function backoff(startingThrottleInMsec, backoffFactor) {
  let currentThrottling = startingThrottleInMsec;
  return () => new Promise((resolve) => setTimeout(() => {
    currentThrottling *= backoffFactor;
    resolve();
  }, currentThrottling));
}
function chain(...strategies) {
  return async (canisterId, requestId, status) => {
    for (const a of strategies) {
      await a(canisterId, requestId, status);
    }
  };
}
const DEFAULT_POLLING_OPTIONS = {
  preSignReadStateRequest: false
};
function hasProperty(value, property) {
  return Object.prototype.hasOwnProperty.call(value, property);
}
function isObjectWithProperty(value, property) {
  return value !== null && typeof value === "object" && hasProperty(value, property);
}
function hasFunction(value, property) {
  return hasProperty(value, property) && typeof value[property] === "function";
}
function isSignedReadStateRequestWithExpiry(value) {
  return isObjectWithProperty(value, "body") && isObjectWithProperty(value.body, "content") && value.body.content.request_type === ReadRequestType.ReadState && isObjectWithProperty(value.body.content, "ingress_expiry") && typeof value.body.content.ingress_expiry === "object" && value.body.content.ingress_expiry !== null && hasFunction(value.body.content.ingress_expiry, "toHash");
}
async function pollForResponse(agent, canisterId, requestId, options = {}) {
  const path = [utf8ToBytes("request_status"), requestId];
  let state;
  let currentRequest;
  const preSignReadStateRequest = options.preSignReadStateRequest ?? false;
  if (preSignReadStateRequest) {
    currentRequest = await constructRequest({
      paths: [path],
      agent,
      pollingOptions: options
    });
    state = await agent.readState(canisterId, { paths: [path] }, void 0, currentRequest);
  } else {
    state = await agent.readState(canisterId, { paths: [path] });
  }
  if (agent.rootKey == null) {
    throw ExternalError.fromCode(new MissingRootKeyErrorCode());
  }
  const cert = await Certificate.create({
    certificate: state.certificate,
    rootKey: agent.rootKey,
    canisterId,
    blsVerify: options.blsVerify,
    agent
  });
  const maybeBuf = lookupResultToBuffer(cert.lookup_path([...path, utf8ToBytes("status")]));
  let status;
  if (typeof maybeBuf === "undefined") {
    status = RequestStatusResponseStatus.Unknown;
  } else {
    status = new TextDecoder().decode(maybeBuf);
  }
  switch (status) {
    case RequestStatusResponseStatus.Replied: {
      return {
        reply: lookupResultToBuffer(cert.lookup_path([...path, "reply"])),
        certificate: cert
      };
    }
    case RequestStatusResponseStatus.Received:
    case RequestStatusResponseStatus.Unknown:
    case RequestStatusResponseStatus.Processing: {
      const strategy = options.strategy ?? defaultStrategy();
      await strategy(canisterId, requestId, status);
      return pollForResponse(agent, canisterId, requestId, {
        ...options,
        // Pass over either the strategy already provided or the new one created above
        strategy,
        request: currentRequest
      });
    }
    case RequestStatusResponseStatus.Rejected: {
      const rejectCode = new Uint8Array(lookupResultToBuffer(cert.lookup_path([...path, "reject_code"])))[0];
      const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(cert.lookup_path([...path, "reject_message"])));
      const errorCodeBuf = lookupResultToBuffer(cert.lookup_path([...path, "error_code"]));
      const errorCode = errorCodeBuf ? new TextDecoder().decode(errorCodeBuf) : void 0;
      throw RejectError.fromCode(new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, errorCode));
    }
    case RequestStatusResponseStatus.Done:
      throw UnknownError.fromCode(new RequestStatusDoneNoReplyErrorCode(requestId));
  }
  throw UNREACHABLE_ERROR;
}
async function constructRequest(options) {
  var _a2;
  const { paths, agent, pollingOptions } = options;
  if (pollingOptions.request && isSignedReadStateRequestWithExpiry(pollingOptions.request)) {
    return pollingOptions.request;
  }
  const request = await ((_a2 = agent.createReadStateRequest) == null ? void 0 : _a2.call(agent, {
    paths
  }, void 0));
  if (!isSignedReadStateRequestWithExpiry(request)) {
    throw InputError.fromCode(new InvalidReadStateRequestErrorCode(request));
  }
  return request;
}
const metadataSymbol = Symbol.for("ic-agent-metadata");
class Actor {
  /**
   * Get the Agent class this Actor would call, or undefined if the Actor would use
   * the default agent (global.ic.agent).
   * @param actor The actor to get the agent of.
   */
  static agentOf(actor) {
    return actor[metadataSymbol].config.agent;
  }
  /**
   * Get the interface of an actor, in the form of an instance of a Service.
   * @param actor The actor to get the interface of.
   */
  static interfaceOf(actor) {
    return actor[metadataSymbol].service;
  }
  static canisterIdOf(actor) {
    return Principal.from(actor[metadataSymbol].config.canisterId);
  }
  static createActorClass(interfaceFactory, options) {
    const service = interfaceFactory({ IDL });
    class CanisterActor extends Actor {
      constructor(config) {
        if (!config.canisterId) {
          throw InputError.fromCode(new MissingCanisterIdErrorCode(config.canisterId));
        }
        const canisterId = typeof config.canisterId === "string" ? Principal.fromText(config.canisterId) : config.canisterId;
        super({
          config: {
            ...DEFAULT_ACTOR_CONFIG,
            ...config,
            canisterId
          },
          service
        });
        for (const [methodName, func] of service._fields) {
          if (options == null ? void 0 : options.httpDetails) {
            func.annotations.push(ACTOR_METHOD_WITH_HTTP_DETAILS);
          }
          if (options == null ? void 0 : options.certificate) {
            func.annotations.push(ACTOR_METHOD_WITH_CERTIFICATE);
          }
          this[methodName] = _createActorMethod(this, methodName, func, config.blsVerify);
        }
      }
    }
    return CanisterActor;
  }
  /**
   * Creates an actor with the given interface factory and configuration.
   *
   * The [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package can be used to generate the interface factory for your canister.
   * @param interfaceFactory - the interface factory for the actor, typically generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package
   * @param configuration - the configuration for the actor
   * @returns an actor with the given interface factory and configuration
   * @example
   * Using the interface factory generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { Actor, HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { idlFactory } from './api/declarations/hello-world.did';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = Actor.createActor(idlFactory, {
   *   agent,
   *   canisterId,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   * @example
   * Using the `createActor` wrapper function generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { createActor } from './api/hello-world';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = createActor(canisterId, {
   *   agent,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   */
  static createActor(interfaceFactory, configuration) {
    if (!configuration.canisterId) {
      throw InputError.fromCode(new MissingCanisterIdErrorCode(configuration.canisterId));
    }
    return new (this.createActorClass(interfaceFactory))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @deprecated - use createActor with actorClassOptions instead
   */
  static createActorWithHttpDetails(interfaceFactory, configuration) {
    return new (this.createActorClass(interfaceFactory, { httpDetails: true }))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @param actorClassOptions - options for the actor class extended details to return with the result
   */
  static createActorWithExtendedDetails(interfaceFactory, configuration, actorClassOptions = {
    httpDetails: true,
    certificate: true
  }) {
    return new (this.createActorClass(interfaceFactory, actorClassOptions))(configuration);
  }
  constructor(metadata) {
    this[metadataSymbol] = Object.freeze(metadata);
  }
}
function decodeReturnValue(types, msg) {
  const returnValues = decode(types, msg);
  switch (returnValues.length) {
    case 0:
      return void 0;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
}
const DEFAULT_ACTOR_CONFIG = {
  pollingOptions: DEFAULT_POLLING_OPTIONS
};
const ACTOR_METHOD_WITH_HTTP_DETAILS = "http-details";
const ACTOR_METHOD_WITH_CERTIFICATE = "certificate";
function _createActorMethod(actor, methodName, func, blsVerify) {
  let caller;
  if (func.annotations.includes("query") || func.annotations.includes("composite_query")) {
    caller = async (options, ...args) => {
      var _a2, _b;
      options = {
        ...options,
        ...(_b = (_a2 = actor[metadataSymbol].config).queryTransform) == null ? void 0 : _b.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || new HttpAgent();
      const cid = Principal.from(options.canisterId || actor[metadataSymbol].config.canisterId);
      const arg = encode(func.argTypes, args);
      const result = await agent.query(cid, {
        methodName,
        arg,
        effectiveCanisterId: options.effectiveCanisterId
      });
      const httpDetails = {
        ...result.httpDetails,
        requestDetails: result.requestDetails
      };
      switch (result.status) {
        case QueryResponseStatus.Rejected: {
          const uncertifiedRejectErrorCode = new UncertifiedRejectErrorCode(result.requestId, result.reject_code, result.reject_message, result.error_code, result.signatures);
          uncertifiedRejectErrorCode.callContext = {
            canisterId: cid,
            methodName,
            httpDetails
          };
          throw RejectError.fromCode(uncertifiedRejectErrorCode);
        }
        case QueryResponseStatus.Replied:
          return func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS) ? {
            httpDetails,
            result: decodeReturnValue(func.retTypes, result.reply.arg)
          } : decodeReturnValue(func.retTypes, result.reply.arg);
      }
    };
  } else {
    caller = async (options, ...args) => {
      var _a2, _b;
      options = {
        ...options,
        ...(_b = (_a2 = actor[metadataSymbol].config).callTransform) == null ? void 0 : _b.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || HttpAgent.createSync();
      const { canisterId, effectiveCanisterId, pollingOptions } = {
        ...DEFAULT_ACTOR_CONFIG,
        ...actor[metadataSymbol].config,
        ...options
      };
      const cid = Principal.from(canisterId);
      const ecid = effectiveCanisterId !== void 0 ? Principal.from(effectiveCanisterId) : cid;
      const arg = encode(func.argTypes, args);
      const { requestId, response, requestDetails } = await agent.call(cid, {
        methodName,
        arg,
        effectiveCanisterId: ecid,
        nonce: options.nonce
      });
      let reply;
      let certificate;
      if (isV3ResponseBody(response.body)) {
        if (agent.rootKey == null) {
          throw ExternalError.fromCode(new MissingRootKeyErrorCode());
        }
        const cert = response.body.certificate;
        certificate = await Certificate.create({
          certificate: cert,
          rootKey: agent.rootKey,
          canisterId: ecid,
          blsVerify,
          agent
        });
        const path = [utf8ToBytes("request_status"), requestId];
        const status = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "status"])));
        switch (status) {
          case "replied":
            reply = lookupResultToBuffer(certificate.lookup_path([...path, "reply"]));
            break;
          case "rejected": {
            const rejectCode = new Uint8Array(lookupResultToBuffer(certificate.lookup_path([...path, "reject_code"])))[0];
            const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "reject_message"])));
            const error_code_buf = lookupResultToBuffer(certificate.lookup_path([...path, "error_code"]));
            const error_code = error_code_buf ? new TextDecoder().decode(error_code_buf) : void 0;
            const certifiedRejectErrorCode = new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, error_code);
            certifiedRejectErrorCode.callContext = {
              canisterId: cid,
              methodName,
              httpDetails: response
            };
            throw RejectError.fromCode(certifiedRejectErrorCode);
          }
        }
      } else if (isV2ResponseBody(response.body)) {
        const { reject_code, reject_message, error_code } = response.body;
        const errorCode = new UncertifiedRejectUpdateErrorCode(requestId, reject_code, reject_message, error_code);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails: response
        };
        throw RejectError.fromCode(errorCode);
      }
      if (response.status === 202) {
        const pollOptions = {
          ...pollingOptions,
          blsVerify
        };
        const response2 = await pollForResponse(agent, ecid, requestId, pollOptions);
        certificate = response2.certificate;
        reply = response2.reply;
      }
      const shouldIncludeHttpDetails = func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS);
      const shouldIncludeCertificate = func.annotations.includes(ACTOR_METHOD_WITH_CERTIFICATE);
      const httpDetails = { ...response, requestDetails };
      if (reply !== void 0) {
        if (shouldIncludeHttpDetails && shouldIncludeCertificate) {
          return {
            httpDetails,
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeCertificate) {
          return {
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeHttpDetails) {
          return {
            httpDetails,
            result: decodeReturnValue(func.retTypes, reply)
          };
        }
        return decodeReturnValue(func.retTypes, reply);
      } else {
        const errorCode = new UnexpectedErrorCode(`Call was returned undefined. We cannot determine if the call was successful or not. Return types: [${func.retTypes.map((t) => t.display()).join(",")}].`);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails
        };
        throw UnknownError.fromCode(errorCode);
      }
    };
  }
  const handler = (...args) => caller({}, ...args);
  handler.withOptions = (options) => (...args) => caller(options, ...args);
  return handler;
}
var QueryObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _QueryObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentQuery);
    __privateAdd(this, _currentQueryInitialState);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentResultState);
    __privateAdd(this, _currentResultOptions);
    __privateAdd(this, _currentThenable);
    __privateAdd(this, _selectError);
    __privateAdd(this, _selectFn);
    __privateAdd(this, _selectResult);
    // This property keeps track of the last query with defined data.
    // It will be used to pass the previous data and query to the placeholder function between renders.
    __privateAdd(this, _lastQueryWithDefinedData);
    __privateAdd(this, _staleTimeoutId);
    __privateAdd(this, _refetchIntervalId);
    __privateAdd(this, _currentRefetchInterval);
    __privateAdd(this, _trackedProps, /* @__PURE__ */ new Set());
    this.options = options;
    __privateSet(this, _client, client);
    __privateSet(this, _selectError, null);
    __privateSet(this, _currentThenable, pendingThenable());
    this.bindMethods();
    this.setOptions(options);
  }
  bindMethods() {
    this.refetch = this.refetch.bind(this);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      __privateGet(this, _currentQuery).addObserver(this);
      if (shouldFetchOnMount(__privateGet(this, _currentQuery), this.options)) {
        __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
      } else {
        this.updateResult();
      }
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.destroy();
    }
  }
  shouldFetchOnReconnect() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnReconnect
    );
  }
  shouldFetchOnWindowFocus() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnWindowFocus
    );
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
    __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
    __privateGet(this, _currentQuery).removeObserver(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    const prevQuery = __privateGet(this, _currentQuery);
    this.options = __privateGet(this, _client).defaultQueryOptions(options);
    if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== "boolean") {
      throw new Error(
        "Expected enabled to be a boolean or a callback that returns a boolean"
      );
    }
    __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
    __privateGet(this, _currentQuery).setOptions(this.options);
    if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getQueryCache().notify({
        type: "observerOptionsUpdated",
        query: __privateGet(this, _currentQuery),
        observer: this
      });
    }
    const mounted = this.hasListeners();
    if (mounted && shouldFetchOptionally(
      __privateGet(this, _currentQuery),
      prevQuery,
      this.options,
      prevOptions
    )) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
    this.updateResult();
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || resolveStaleTime(this.options.staleTime, __privateGet(this, _currentQuery)) !== resolveStaleTime(prevOptions.staleTime, __privateGet(this, _currentQuery)))) {
      __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
    }
    const nextRefetchInterval = __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this);
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || nextRefetchInterval !== __privateGet(this, _currentRefetchInterval))) {
      __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, nextRefetchInterval);
    }
  }
  getOptimisticResult(options) {
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), options);
    const result = this.createResult(query, options);
    if (shouldAssignObserverCurrentProperties(this, result)) {
      __privateSet(this, _currentResult, result);
      __privateSet(this, _currentResultOptions, this.options);
      __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    }
    return result;
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  trackResult(result, onPropTracked) {
    return new Proxy(result, {
      get: (target, key) => {
        this.trackProp(key);
        onPropTracked == null ? void 0 : onPropTracked(key);
        if (key === "promise") {
          this.trackProp("data");
          if (!this.options.experimental_prefetchInRender && __privateGet(this, _currentThenable).status === "pending") {
            __privateGet(this, _currentThenable).reject(
              new Error(
                "experimental_prefetchInRender feature flag is not enabled"
              )
            );
          }
        }
        return Reflect.get(target, key);
      }
    });
  }
  trackProp(key) {
    __privateGet(this, _trackedProps).add(key);
  }
  getCurrentQuery() {
    return __privateGet(this, _currentQuery);
  }
  refetch({ ...options } = {}) {
    return this.fetch({
      ...options
    });
  }
  fetchOptimistic(options) {
    const defaultedOptions = __privateGet(this, _client).defaultQueryOptions(options);
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), defaultedOptions);
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }
  fetch(fetchOptions) {
    return __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this, {
      ...fetchOptions,
      cancelRefetch: fetchOptions.cancelRefetch ?? true
    }).then(() => {
      this.updateResult();
      return __privateGet(this, _currentResult);
    });
  }
  createResult(query, options) {
    var _a2;
    const prevQuery = __privateGet(this, _currentQuery);
    const prevOptions = this.options;
    const prevResult = __privateGet(this, _currentResult);
    const prevResultState = __privateGet(this, _currentResultState);
    const prevResultOptions = __privateGet(this, _currentResultOptions);
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : __privateGet(this, _currentQueryInitialState);
    const { state } = query;
    let newState = { ...state };
    let isPlaceholderData = false;
    let data;
    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
      if (fetchOnMount || fetchOptionally) {
        newState = {
          ...newState,
          ...fetchState(state.data, query.options)
        };
      }
      if (options._optimisticResults === "isRestoring") {
        newState.fetchStatus = "idle";
      }
    }
    let { error, errorUpdatedAt, status } = newState;
    data = newState.data;
    let skipSelect = false;
    if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
      let placeholderData;
      if ((prevResult == null ? void 0 : prevResult.isPlaceholderData) && options.placeholderData === (prevResultOptions == null ? void 0 : prevResultOptions.placeholderData)) {
        placeholderData = prevResult.data;
        skipSelect = true;
      } else {
        placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(
          (_a2 = __privateGet(this, _lastQueryWithDefinedData)) == null ? void 0 : _a2.state.data,
          __privateGet(this, _lastQueryWithDefinedData)
        ) : options.placeholderData;
      }
      if (placeholderData !== void 0) {
        status = "success";
        data = replaceData(
          prevResult == null ? void 0 : prevResult.data,
          placeholderData,
          options
        );
        isPlaceholderData = true;
      }
    }
    if (options.select && data !== void 0 && !skipSelect) {
      if (prevResult && data === (prevResultState == null ? void 0 : prevResultState.data) && options.select === __privateGet(this, _selectFn)) {
        data = __privateGet(this, _selectResult);
      } else {
        try {
          __privateSet(this, _selectFn, options.select);
          data = options.select(data);
          data = replaceData(prevResult == null ? void 0 : prevResult.data, data, options);
          __privateSet(this, _selectResult, data);
          __privateSet(this, _selectError, null);
        } catch (selectError) {
          __privateSet(this, _selectError, selectError);
        }
      }
    }
    if (__privateGet(this, _selectError)) {
      error = __privateGet(this, _selectError);
      data = __privateGet(this, _selectResult);
      errorUpdatedAt = Date.now();
      status = "error";
    }
    const isFetching = newState.fetchStatus === "fetching";
    const isPending = status === "pending";
    const isError = status === "error";
    const isLoading = isPending && isFetching;
    const hasData = data !== void 0;
    const result = {
      status,
      fetchStatus: newState.fetchStatus,
      isPending,
      isSuccess: status === "success",
      isError,
      isInitialLoading: isLoading,
      isLoading,
      data,
      dataUpdatedAt: newState.dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: newState.fetchFailureCount,
      failureReason: newState.fetchFailureReason,
      errorUpdateCount: newState.errorUpdateCount,
      isFetched: query.isFetched(),
      isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isPending,
      isLoadingError: isError && !hasData,
      isPaused: newState.fetchStatus === "paused",
      isPlaceholderData,
      isRefetchError: isError && hasData,
      isStale: isStale(query, options),
      refetch: this.refetch,
      promise: __privateGet(this, _currentThenable),
      isEnabled: resolveEnabled(options.enabled, query) !== false
    };
    const nextResult = result;
    if (this.options.experimental_prefetchInRender) {
      const hasResultData = nextResult.data !== void 0;
      const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
      const finalizeThenableIfPossible = (thenable) => {
        if (isErrorWithoutData) {
          thenable.reject(nextResult.error);
        } else if (hasResultData) {
          thenable.resolve(nextResult.data);
        }
      };
      const recreateThenable = () => {
        const pending = __privateSet(this, _currentThenable, nextResult.promise = pendingThenable());
        finalizeThenableIfPossible(pending);
      };
      const prevThenable = __privateGet(this, _currentThenable);
      switch (prevThenable.status) {
        case "pending":
          if (query.queryHash === prevQuery.queryHash) {
            finalizeThenableIfPossible(prevThenable);
          }
          break;
        case "fulfilled":
          if (isErrorWithoutData || nextResult.data !== prevThenable.value) {
            recreateThenable();
          }
          break;
        case "rejected":
          if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) {
            recreateThenable();
          }
          break;
      }
    }
    return nextResult;
  }
  updateResult() {
    const prevResult = __privateGet(this, _currentResult);
    const nextResult = this.createResult(__privateGet(this, _currentQuery), this.options);
    __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    __privateSet(this, _currentResultOptions, this.options);
    if (__privateGet(this, _currentResultState).data !== void 0) {
      __privateSet(this, _lastQueryWithDefinedData, __privateGet(this, _currentQuery));
    }
    if (shallowEqualObjects(nextResult, prevResult)) {
      return;
    }
    __privateSet(this, _currentResult, nextResult);
    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }
      const { notifyOnChangeProps } = this.options;
      const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
      if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !__privateGet(this, _trackedProps).size) {
        return true;
      }
      const includedProps = new Set(
        notifyOnChangePropsValue ?? __privateGet(this, _trackedProps)
      );
      if (this.options.throwOnError) {
        includedProps.add("error");
      }
      return Object.keys(__privateGet(this, _currentResult)).some((key) => {
        const typedKey = key;
        const changed = __privateGet(this, _currentResult)[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };
    __privateMethod(this, _QueryObserver_instances, notify_fn).call(this, { listeners: shouldNotifyListeners() });
  }
  onQueryUpdate() {
    this.updateResult();
    if (this.hasListeners()) {
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
}, _client = new WeakMap(), _currentQuery = new WeakMap(), _currentQueryInitialState = new WeakMap(), _currentResult = new WeakMap(), _currentResultState = new WeakMap(), _currentResultOptions = new WeakMap(), _currentThenable = new WeakMap(), _selectError = new WeakMap(), _selectFn = new WeakMap(), _selectResult = new WeakMap(), _lastQueryWithDefinedData = new WeakMap(), _staleTimeoutId = new WeakMap(), _refetchIntervalId = new WeakMap(), _currentRefetchInterval = new WeakMap(), _trackedProps = new WeakMap(), _QueryObserver_instances = new WeakSet(), executeFetch_fn = function(fetchOptions) {
  __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
  let promise = __privateGet(this, _currentQuery).fetch(
    this.options,
    fetchOptions
  );
  if (!(fetchOptions == null ? void 0 : fetchOptions.throwOnError)) {
    promise = promise.catch(noop);
  }
  return promise;
}, updateStaleTimeout_fn = function() {
  __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
  const staleTime = resolveStaleTime(
    this.options.staleTime,
    __privateGet(this, _currentQuery)
  );
  if (environmentManager.isServer() || __privateGet(this, _currentResult).isStale || !isValidTimeout(staleTime)) {
    return;
  }
  const time = timeUntilStale(__privateGet(this, _currentResult).dataUpdatedAt, staleTime);
  const timeout2 = time + 1;
  __privateSet(this, _staleTimeoutId, timeoutManager.setTimeout(() => {
    if (!__privateGet(this, _currentResult).isStale) {
      this.updateResult();
    }
  }, timeout2));
}, computeRefetchInterval_fn = function() {
  return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(__privateGet(this, _currentQuery)) : this.options.refetchInterval) ?? false;
}, updateRefetchInterval_fn = function(nextInterval) {
  __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
  __privateSet(this, _currentRefetchInterval, nextInterval);
  if (environmentManager.isServer() || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) === false || !isValidTimeout(__privateGet(this, _currentRefetchInterval)) || __privateGet(this, _currentRefetchInterval) === 0) {
    return;
  }
  __privateSet(this, _refetchIntervalId, timeoutManager.setInterval(() => {
    if (this.options.refetchIntervalInBackground || focusManager.isFocused()) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
  }, __privateGet(this, _currentRefetchInterval)));
}, updateTimers_fn = function() {
  __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
  __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this));
}, clearStaleTimeout_fn = function() {
  if (__privateGet(this, _staleTimeoutId)) {
    timeoutManager.clearTimeout(__privateGet(this, _staleTimeoutId));
    __privateSet(this, _staleTimeoutId, void 0);
  }
}, clearRefetchInterval_fn = function() {
  if (__privateGet(this, _refetchIntervalId)) {
    timeoutManager.clearInterval(__privateGet(this, _refetchIntervalId));
    __privateSet(this, _refetchIntervalId, void 0);
  }
}, updateQuery_fn = function() {
  const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), this.options);
  if (query === __privateGet(this, _currentQuery)) {
    return;
  }
  const prevQuery = __privateGet(this, _currentQuery);
  __privateSet(this, _currentQuery, query);
  __privateSet(this, _currentQueryInitialState, query.state);
  if (this.hasListeners()) {
    prevQuery == null ? void 0 : prevQuery.removeObserver(this);
    query.addObserver(this);
  }
}, notify_fn = function(notifyOptions) {
  notifyManager.batch(() => {
    if (notifyOptions.listeners) {
      this.listeners.forEach((listener) => {
        listener(__privateGet(this, _currentResult));
      });
    }
    __privateGet(this, _client).getQueryCache().notify({
      query: __privateGet(this, _currentQuery),
      type: "observerResultsUpdated"
    });
  });
}, _a);
function shouldLoadOnMount(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
  if (resolveEnabled(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
    const value = typeof field === "function" ? field(query) : field;
    return value === "always" || value !== false && isStale(query, options);
  }
  return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return (query !== prevQuery || resolveEnabled(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
  if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) {
    return true;
  }
  return false;
}
var IsRestoringContext = reactExports.createContext(false);
var useIsRestoring = () => reactExports.useContext(IsRestoringContext);
IsRestoringContext.Provider;
function createValue() {
  let isReset = false;
  return {
    clearReset: () => {
      isReset = false;
    },
    reset: () => {
      isReset = true;
    },
    isReset: () => {
      return isReset;
    }
  };
}
var QueryErrorResetBoundaryContext = reactExports.createContext(createValue());
var useQueryErrorResetBoundary = () => reactExports.useContext(QueryErrorResetBoundaryContext);
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
  const throwOnError = (query == null ? void 0 : query.state.error) && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
  if (options.suspense || options.experimental_prefetchInRender || throwOnError) {
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
  reactExports.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
var getHasError = ({
  result,
  errorResetBoundary,
  throwOnError,
  query,
  suspense
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
var ensureSuspenseTimers = (defaultedOptions) => {
  if (defaultedOptions.suspense) {
    const MIN_SUSPENSE_TIME_MS = 1e3;
    const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
    const originalStaleTime = defaultedOptions.staleTime;
    defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
    if (typeof defaultedOptions.gcTime === "number") {
      defaultedOptions.gcTime = Math.max(
        defaultedOptions.gcTime,
        MIN_SUSPENSE_TIME_MS
      );
    }
  }
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => (defaultedOptions == null ? void 0 : defaultedOptions.suspense) && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
  errorResetBoundary.clearReset();
});
function useBaseQuery(options, Observer, queryClient) {
  var _a2, _b, _c, _d;
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const client = useQueryClient();
  const defaultedOptions = client.defaultQueryOptions(options);
  (_b = (_a2 = client.getDefaultOptions().queries) == null ? void 0 : _a2._experimental_beforeQuery) == null ? void 0 : _b.call(
    _a2,
    defaultedOptions
  );
  const query = client.getQueryCache().get(defaultedOptions.queryHash);
  defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  ensureSuspenseTimers(defaultedOptions);
  ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
  useClearResetErrorBoundary(errorResetBoundary);
  const isNewCacheEntry = !client.getQueryCache().get(defaultedOptions.queryHash);
  const [observer] = reactExports.useState(
    () => new Observer(
      client,
      defaultedOptions
    )
  );
  const result = observer.getOptimisticResult(defaultedOptions);
  const shouldSubscribe = !isRestoring && options.subscribed !== false;
  reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => {
        const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
        observer.updateResult();
        return unsubscribe;
      },
      [observer, shouldSubscribe]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  reactExports.useEffect(() => {
    observer.setOptions(defaultedOptions);
  }, [defaultedOptions, observer]);
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
  }
  if (getHasError({
    result,
    errorResetBoundary,
    throwOnError: defaultedOptions.throwOnError,
    query,
    suspense: defaultedOptions.suspense
  })) {
    throw result.error;
  }
  (_d = (_c = client.getDefaultOptions().queries) == null ? void 0 : _c._experimental_afterQuery) == null ? void 0 : _d.call(
    _c,
    defaultedOptions,
    result
  );
  if (defaultedOptions.experimental_prefetchInRender && !environmentManager.isServer() && willFetch(result, isRestoring)) {
    const promise = isNewCacheEntry ? (
      // Fetch immediately on render in order to ensure `.promise` is resolved even if the component is unmounted
      fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
    ) : (
      // subscribe to the "cache promise" so that we can finalize the currentThenable once data comes in
      query == null ? void 0 : query.promise
    );
    promise == null ? void 0 : promise.catch(noop).finally(() => {
      observer.updateResult();
    });
  }
  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
function useQuery(options, queryClient) {
  return useBaseQuery(options, QueryObserver);
}
function hasAccessControl(actor) {
  return typeof actor === "object" && actor !== null && "_initializeAccessControl" in actor;
}
const ACTOR_QUERY_KEY = "actor";
function useActor(createActor2) {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const actorQuery = useQuery({
    queryKey: [ACTOR_QUERY_KEY, identity == null ? void 0 : identity.getPrincipal().toString()],
    queryFn: async () => {
      const isAuthenticated = !!identity;
      if (!isAuthenticated) {
        return await createActorWithConfig(createActor2);
      }
      const actorOptions = {
        agentOptions: {
          identity
        }
      };
      const actor = await createActorWithConfig(createActor2, actorOptions);
      if (hasAccessControl(actor)) {
        await actor._initializeAccessControl();
      }
      return actor;
    },
    // Only refetch when identity changes
    staleTime: Number.POSITIVE_INFINITY,
    // This will cause the actor to be recreated when the identity changes
    enabled: true
  });
  reactExports.useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
    }
  }, [actorQuery.data, queryClient]);
  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching
  };
}
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup == "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup == "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
var REACT_LAZY_TYPE = Symbol.for("react.lazy");
var use = React[" use ".trim().toString()];
function isPromiseLike(value) {
  return typeof value === "object" && value !== null && "then" in value;
}
function isLazyComponent(element) {
  return element != null && typeof element === "object" && "$$typeof" in element && element.$$typeof === REACT_LAZY_TYPE && "_payload" in element && isPromiseLike(element._payload);
}
// @__NO_SIDE_EFFECTS__
function createSlot(ownerName) {
  const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
  const Slot2 = reactExports.forwardRef((props, forwardedRef) => {
    let { children, ...slotProps } = props;
    if (isLazyComponent(children) && typeof use === "function") {
      children = use(children._payload);
    }
    const childrenArray = reactExports.Children.toArray(children);
    const slottable = childrenArray.find(isSlottable);
    if (slottable) {
      const newElement = slottable.props.children;
      const newChildren = childrenArray.map((child) => {
        if (child === slottable) {
          if (reactExports.Children.count(newElement) > 1) return reactExports.Children.only(null);
          return reactExports.isValidElement(newElement) ? newElement.props.children : null;
        } else {
          return child;
        }
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children: reactExports.isValidElement(newElement) ? reactExports.cloneElement(newElement, void 0, newChildren) : null });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children });
  });
  Slot2.displayName = `${ownerName}.Slot`;
  return Slot2;
}
var Slot = /* @__PURE__ */ createSlot("Slot");
// @__NO_SIDE_EFFECTS__
function createSlotClone(ownerName) {
  const SlotClone = reactExports.forwardRef((props, forwardedRef) => {
    let { children, ...slotProps } = props;
    if (isLazyComponent(children) && typeof use === "function") {
      children = use(children._payload);
    }
    if (reactExports.isValidElement(children)) {
      const childrenRef = getElementRef(children);
      const props2 = mergeProps(slotProps, children.props);
      if (children.type !== reactExports.Fragment) {
        props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
      }
      return reactExports.cloneElement(children, props2);
    }
    return reactExports.Children.count(children) > 1 ? reactExports.Children.only(null) : null;
  });
  SlotClone.displayName = `${ownerName}.SlotClone`;
  return SlotClone;
}
var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
function isSlottable(child) {
  return reactExports.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
function mergeProps(slotProps, childProps) {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          const result = childPropValue(...args);
          slotPropValue(...args);
          return result;
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }
  return { ...slotProps, ...overrideProps };
}
function getElementRef(element) {
  var _a2, _b;
  let getter = (_a2 = Object.getOwnPropertyDescriptor(element.props, "ref")) == null ? void 0 : _a2.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = (_b = Object.getOwnPropertyDescriptor(element, "ref")) == null ? void 0 : _b.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}
const falsyToString = (value) => typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;
const cx = clsx;
const cva = (base, config) => (props) => {
  var _config_compoundVariants;
  if ((config === null || config === void 0 ? void 0 : config.variants) == null) return cx(base, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
  const { variants, defaultVariants } = config;
  const getVariantClassNames = Object.keys(variants).map((variant) => {
    const variantProp = props === null || props === void 0 ? void 0 : props[variant];
    const defaultVariantProp = defaultVariants === null || defaultVariants === void 0 ? void 0 : defaultVariants[variant];
    if (variantProp === null) return null;
    const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);
    return variants[variant][variantKey];
  });
  const propsWithoutUndefined = props && Object.entries(props).reduce((acc, param) => {
    let [key, value] = param;
    if (value === void 0) {
      return acc;
    }
    acc[key] = value;
    return acc;
  }, {});
  const getCompoundVariantClassNames = config === null || config === void 0 ? void 0 : (_config_compoundVariants = config.compoundVariants) === null || _config_compoundVariants === void 0 ? void 0 : _config_compoundVariants.reduce((acc, param) => {
    let { class: cvClass, className: cvClassName, ...compoundVariantOptions } = param;
    return Object.entries(compoundVariantOptions).every((param2) => {
      let [key, value] = param2;
      return Array.isArray(value) ? value.includes({
        ...defaultVariants,
        ...propsWithoutUndefined
      }[key]) : {
        ...defaultVariants,
        ...propsWithoutUndefined
      }[key] === value;
    }) ? [
      ...acc,
      cvClass,
      cvClassName
    ] : acc;
  }, []);
  return cx(base, getVariantClassNames, getCompoundVariantClassNames, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
};
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Icon = reactExports.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => reactExports.createElement(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",
      key: "j76jl0"
    }
  ],
  ["path", { d: "M22 10v6", key: "1lu8f3" }],
  ["path", { d: "M6 12.5V16a6 3 0 0 0 12 0v-3.5", key: "1r8lef" }]
];
const GraduationCap = createLucideIcon("graduation-cap", __iconNode);
const UserRole = Variant({
  "admin": Null,
  "user": Null,
  "guest": Null
});
const FeeStructureId = Nat;
const AssignmentId = Nat;
const PaymentStatus$1 = Variant({
  "pending": Null,
  "paid": Null,
  "overdue": Null,
  "waived": Null,
  "partial": Null
});
const StudentId = Nat;
const Timestamp = Int;
const FeeAssignment = Record({
  "id": AssignmentId,
  "status": PaymentStatus$1,
  "studentId": StudentId,
  "feeStructureId": FeeStructureId,
  "assignedAt": Timestamp,
  "waivedReason": Opt(Text),
  "updatedAt": Timestamp
});
const CsvStudentRow = Record({
  "studentId": Text,
  "name": Text,
  "email": Text,
  "group": Text
});
const ImportRowError = Record({
  "row": Nat,
  "field": Text,
  "value": Text,
  "message": Text
});
const ImportResult = Record({
  "imported": Nat,
  "errors": Vec(ImportRowError)
});
const FeePeriod$1 = Variant({
  "semester": Null,
  "term": Null,
  "annual": Null,
  "monthly": Null
});
const LatePenalty = Variant({
  "fixed": Nat,
  "percentage": Nat
});
const CreateFeeStructureInput = Record({
  "endDate": Timestamp,
  "period": FeePeriod$1,
  "name": Text,
  "latePenalty": Opt(LatePenalty),
  "dueDate": Timestamp,
  "description": Text,
  "amount": Nat,
  "startDate": Timestamp
});
const FeeStructure = Record({
  "id": FeeStructureId,
  "endDate": Timestamp,
  "period": FeePeriod$1,
  "name": Text,
  "createdAt": Timestamp,
  "latePenalty": Opt(LatePenalty),
  "dueDate": Timestamp,
  "description": Text,
  "updatedAt": Timestamp,
  "amount": Nat,
  "startDate": Timestamp
});
const CreateStudentInput = Record({
  "studentId": Text,
  "name": Text,
  "email": Text,
  "group": Text
});
const Student = Record({
  "id": StudentId,
  "studentId": Text,
  "name": Text,
  "createdAt": Timestamp,
  "email": Text,
  "updatedAt": Timestamp,
  "group": Text
});
const AgingBucket = Record({
  "count": Nat,
  "totalAmount": Nat,
  "bucket": Text
});
const AgingBucketDetail = Record({
  "daysOverdue": Nat,
  "feeStructureName": Text,
  "studentId": Text,
  "studentName": Text,
  "amountPaid": Nat,
  "amountDue": Nat
});
const StudentBalance = Record({
  "status": PaymentStatus$1,
  "feeStructureName": Text,
  "studentId": StudentId,
  "feeStructureId": FeeStructureId,
  "studentName": Text,
  "penaltyAmount": Nat,
  "dueDate": Timestamp,
  "totalAmount": Nat,
  "outstandingAmount": Nat,
  "totalWithPenalty": Nat,
  "paidAmount": Nat
});
const CollectionSummary = Record({
  "totalOverdue": Nat,
  "totalCollected": Nat,
  "totalOutstanding": Nat,
  "totalWaived": Nat,
  "totalOutstandingWithPenalty": Nat,
  "paymentCount": Nat
});
const CollectionTrends = Record({
  "previousPeriodTotal": Nat,
  "previousPeriodCount": Nat,
  "currentPeriodTotal": Nat,
  "currentPeriodCount": Nat
});
const PaymentMethodBreakdown = Record({
  "cash": Nat,
  "check": Nat,
  "transfer": Nat,
  "online": Nat
});
const PaymentId = Nat;
const PaymentMethod$1 = Variant({
  "cash": Null,
  "check": Null,
  "transfer": Null,
  "online": Null
});
const Payment = Record({
  "id": PaymentId,
  "method": PaymentMethod$1,
  "studentId": StudentId,
  "feeStructureId": FeeStructureId,
  "date": Timestamp,
  "createdAt": Timestamp,
  "notes": Text,
  "amount": Nat,
  "receiptNumber": Text
});
const RecordPaymentInput = Record({
  "method": PaymentMethod$1,
  "studentId": StudentId,
  "feeStructureId": FeeStructureId,
  "date": Timestamp,
  "notes": Text,
  "amount": Nat,
  "receiptNumber": Text
});
const RecordPaymentError$1 = Variant({
  "DuplicateReceipt": Null,
  "NotFound": Null
});
const UpdateFeeStructureInput = Record({
  "id": FeeStructureId,
  "endDate": Timestamp,
  "period": FeePeriod$1,
  "name": Text,
  "latePenalty": Opt(LatePenalty),
  "dueDate": Timestamp,
  "description": Text,
  "amount": Nat,
  "startDate": Timestamp
});
const UpdateStudentInput = Record({
  "id": StudentId,
  "studentId": Text,
  "name": Text,
  "email": Text,
  "group": Text
});
Service({
  "_initializeAccessControl": Func([], [], []),
  "assignCallerUserRole": Func([Principal$1, UserRole], [], []),
  "assignFeeToGroup": Func(
    [Text, FeeStructureId],
    [Vec(FeeAssignment)],
    []
  ),
  "assignFeeToStudent": Func(
    [StudentId, FeeStructureId],
    [FeeAssignment],
    []
  ),
  "bulkImportStudents": Func([Vec(CsvStudentRow)], [ImportResult], []),
  "checkReceiptExists": Func([Text], [Bool], ["query"]),
  "createFeeStructure": Func(
    [CreateFeeStructureInput],
    [FeeStructure],
    []
  ),
  "createStudent": Func([CreateStudentInput], [Student], []),
  "deleteFeeStructure": Func([FeeStructureId], [Bool], []),
  "deleteStudent": Func([StudentId], [Bool], []),
  "duplicateFeeStructure": Func(
    [FeeStructureId],
    [Opt(FeeStructure)],
    []
  ),
  "getAgingReport": Func([], [Vec(AgingBucket)], []),
  "getAgingReportDetail": Func(
    [Nat],
    [Vec(AgingBucketDetail)],
    []
  ),
  "getAllBalances": Func([], [Vec(StudentBalance)], ["query"]),
  "getCallerUserRole": Func([], [UserRole], ["query"]),
  "getCollectionSummary": Func([], [CollectionSummary], ["query"]),
  "getCollectionTrends": Func([], [CollectionTrends], ["query"]),
  "getFeeStructure": Func(
    [FeeStructureId],
    [Opt(FeeStructure)],
    ["query"]
  ),
  "getFeeStructureBalances": Func(
    [FeeStructureId],
    [Vec(StudentBalance)],
    ["query"]
  ),
  "getPaymentMethodBreakdown": Func(
    [],
    [PaymentMethodBreakdown],
    ["query"]
  ),
  "getPaymentsByDateRange": Func(
    [Timestamp, Timestamp],
    [Vec(Payment)],
    ["query"]
  ),
  "getStudent": Func([StudentId], [Opt(Student)], ["query"]),
  "getStudentBalances": Func(
    [StudentId],
    [Vec(StudentBalance)],
    ["query"]
  ),
  "isCallerAdmin": Func([], [Bool], ["query"]),
  "listFeeStructures": Func([], [Vec(FeeStructure)], ["query"]),
  "listStudents": Func([], [Vec(Student)], ["query"]),
  "listStudentsByGroup": Func([Text], [Vec(Student)], ["query"]),
  "recordPayment": Func(
    [RecordPaymentInput],
    [Variant({ "ok": Payment, "err": RecordPaymentError$1 })],
    []
  ),
  "unenrollStudent": Func([StudentId, FeeStructureId], [Bool], []),
  "updateFeeStructure": Func(
    [UpdateFeeStructureInput],
    [Opt(FeeStructure)],
    []
  ),
  "updateOverdueStatuses": Func([], [], []),
  "updateStudent": Func([UpdateStudentInput], [Opt(Student)], []),
  "waiveFee": Func(
    [StudentId, FeeStructureId, Text],
    [Opt(FeeAssignment)],
    []
  )
});
const idlFactory = ({ IDL: IDL2 }) => {
  const UserRole2 = IDL2.Variant({
    "admin": IDL2.Null,
    "user": IDL2.Null,
    "guest": IDL2.Null
  });
  const FeeStructureId2 = IDL2.Nat;
  const AssignmentId2 = IDL2.Nat;
  const PaymentStatus2 = IDL2.Variant({
    "pending": IDL2.Null,
    "paid": IDL2.Null,
    "overdue": IDL2.Null,
    "waived": IDL2.Null,
    "partial": IDL2.Null
  });
  const StudentId2 = IDL2.Nat;
  const Timestamp2 = IDL2.Int;
  const FeeAssignment2 = IDL2.Record({
    "id": AssignmentId2,
    "status": PaymentStatus2,
    "studentId": StudentId2,
    "feeStructureId": FeeStructureId2,
    "assignedAt": Timestamp2,
    "waivedReason": IDL2.Opt(IDL2.Text),
    "updatedAt": Timestamp2
  });
  const CsvStudentRow2 = IDL2.Record({
    "studentId": IDL2.Text,
    "name": IDL2.Text,
    "email": IDL2.Text,
    "group": IDL2.Text
  });
  const ImportRowError2 = IDL2.Record({
    "row": IDL2.Nat,
    "field": IDL2.Text,
    "value": IDL2.Text,
    "message": IDL2.Text
  });
  const ImportResult2 = IDL2.Record({
    "imported": IDL2.Nat,
    "errors": IDL2.Vec(ImportRowError2)
  });
  const FeePeriod2 = IDL2.Variant({
    "semester": IDL2.Null,
    "term": IDL2.Null,
    "annual": IDL2.Null,
    "monthly": IDL2.Null
  });
  const LatePenalty2 = IDL2.Variant({
    "fixed": IDL2.Nat,
    "percentage": IDL2.Nat
  });
  const CreateFeeStructureInput2 = IDL2.Record({
    "endDate": Timestamp2,
    "period": FeePeriod2,
    "name": IDL2.Text,
    "latePenalty": IDL2.Opt(LatePenalty2),
    "dueDate": Timestamp2,
    "description": IDL2.Text,
    "amount": IDL2.Nat,
    "startDate": Timestamp2
  });
  const FeeStructure2 = IDL2.Record({
    "id": FeeStructureId2,
    "endDate": Timestamp2,
    "period": FeePeriod2,
    "name": IDL2.Text,
    "createdAt": Timestamp2,
    "latePenalty": IDL2.Opt(LatePenalty2),
    "dueDate": Timestamp2,
    "description": IDL2.Text,
    "updatedAt": Timestamp2,
    "amount": IDL2.Nat,
    "startDate": Timestamp2
  });
  const CreateStudentInput2 = IDL2.Record({
    "studentId": IDL2.Text,
    "name": IDL2.Text,
    "email": IDL2.Text,
    "group": IDL2.Text
  });
  const Student2 = IDL2.Record({
    "id": StudentId2,
    "studentId": IDL2.Text,
    "name": IDL2.Text,
    "createdAt": Timestamp2,
    "email": IDL2.Text,
    "updatedAt": Timestamp2,
    "group": IDL2.Text
  });
  const AgingBucket2 = IDL2.Record({
    "count": IDL2.Nat,
    "totalAmount": IDL2.Nat,
    "bucket": IDL2.Text
  });
  const AgingBucketDetail2 = IDL2.Record({
    "daysOverdue": IDL2.Nat,
    "feeStructureName": IDL2.Text,
    "studentId": IDL2.Text,
    "studentName": IDL2.Text,
    "amountPaid": IDL2.Nat,
    "amountDue": IDL2.Nat
  });
  const StudentBalance2 = IDL2.Record({
    "status": PaymentStatus2,
    "feeStructureName": IDL2.Text,
    "studentId": StudentId2,
    "feeStructureId": FeeStructureId2,
    "studentName": IDL2.Text,
    "penaltyAmount": IDL2.Nat,
    "dueDate": Timestamp2,
    "totalAmount": IDL2.Nat,
    "outstandingAmount": IDL2.Nat,
    "totalWithPenalty": IDL2.Nat,
    "paidAmount": IDL2.Nat
  });
  const CollectionSummary2 = IDL2.Record({
    "totalOverdue": IDL2.Nat,
    "totalCollected": IDL2.Nat,
    "totalOutstanding": IDL2.Nat,
    "totalWaived": IDL2.Nat,
    "totalOutstandingWithPenalty": IDL2.Nat,
    "paymentCount": IDL2.Nat
  });
  const CollectionTrends2 = IDL2.Record({
    "previousPeriodTotal": IDL2.Nat,
    "previousPeriodCount": IDL2.Nat,
    "currentPeriodTotal": IDL2.Nat,
    "currentPeriodCount": IDL2.Nat
  });
  const PaymentMethodBreakdown2 = IDL2.Record({
    "cash": IDL2.Nat,
    "check": IDL2.Nat,
    "transfer": IDL2.Nat,
    "online": IDL2.Nat
  });
  const PaymentId2 = IDL2.Nat;
  const PaymentMethod2 = IDL2.Variant({
    "cash": IDL2.Null,
    "check": IDL2.Null,
    "transfer": IDL2.Null,
    "online": IDL2.Null
  });
  const Payment2 = IDL2.Record({
    "id": PaymentId2,
    "method": PaymentMethod2,
    "studentId": StudentId2,
    "feeStructureId": FeeStructureId2,
    "date": Timestamp2,
    "createdAt": Timestamp2,
    "notes": IDL2.Text,
    "amount": IDL2.Nat,
    "receiptNumber": IDL2.Text
  });
  const RecordPaymentInput2 = IDL2.Record({
    "method": PaymentMethod2,
    "studentId": StudentId2,
    "feeStructureId": FeeStructureId2,
    "date": Timestamp2,
    "notes": IDL2.Text,
    "amount": IDL2.Nat,
    "receiptNumber": IDL2.Text
  });
  const RecordPaymentError2 = IDL2.Variant({
    "DuplicateReceipt": IDL2.Null,
    "NotFound": IDL2.Null
  });
  const UpdateFeeStructureInput2 = IDL2.Record({
    "id": FeeStructureId2,
    "endDate": Timestamp2,
    "period": FeePeriod2,
    "name": IDL2.Text,
    "latePenalty": IDL2.Opt(LatePenalty2),
    "dueDate": Timestamp2,
    "description": IDL2.Text,
    "amount": IDL2.Nat,
    "startDate": Timestamp2
  });
  const UpdateStudentInput2 = IDL2.Record({
    "id": StudentId2,
    "studentId": IDL2.Text,
    "name": IDL2.Text,
    "email": IDL2.Text,
    "group": IDL2.Text
  });
  return IDL2.Service({
    "_initializeAccessControl": IDL2.Func([], [], []),
    "assignCallerUserRole": IDL2.Func([IDL2.Principal, UserRole2], [], []),
    "assignFeeToGroup": IDL2.Func(
      [IDL2.Text, FeeStructureId2],
      [IDL2.Vec(FeeAssignment2)],
      []
    ),
    "assignFeeToStudent": IDL2.Func(
      [StudentId2, FeeStructureId2],
      [FeeAssignment2],
      []
    ),
    "bulkImportStudents": IDL2.Func(
      [IDL2.Vec(CsvStudentRow2)],
      [ImportResult2],
      []
    ),
    "checkReceiptExists": IDL2.Func([IDL2.Text], [IDL2.Bool], ["query"]),
    "createFeeStructure": IDL2.Func(
      [CreateFeeStructureInput2],
      [FeeStructure2],
      []
    ),
    "createStudent": IDL2.Func([CreateStudentInput2], [Student2], []),
    "deleteFeeStructure": IDL2.Func([FeeStructureId2], [IDL2.Bool], []),
    "deleteStudent": IDL2.Func([StudentId2], [IDL2.Bool], []),
    "duplicateFeeStructure": IDL2.Func(
      [FeeStructureId2],
      [IDL2.Opt(FeeStructure2)],
      []
    ),
    "getAgingReport": IDL2.Func([], [IDL2.Vec(AgingBucket2)], []),
    "getAgingReportDetail": IDL2.Func(
      [IDL2.Nat],
      [IDL2.Vec(AgingBucketDetail2)],
      []
    ),
    "getAllBalances": IDL2.Func([], [IDL2.Vec(StudentBalance2)], ["query"]),
    "getCallerUserRole": IDL2.Func([], [UserRole2], ["query"]),
    "getCollectionSummary": IDL2.Func([], [CollectionSummary2], ["query"]),
    "getCollectionTrends": IDL2.Func([], [CollectionTrends2], ["query"]),
    "getFeeStructure": IDL2.Func(
      [FeeStructureId2],
      [IDL2.Opt(FeeStructure2)],
      ["query"]
    ),
    "getFeeStructureBalances": IDL2.Func(
      [FeeStructureId2],
      [IDL2.Vec(StudentBalance2)],
      ["query"]
    ),
    "getPaymentMethodBreakdown": IDL2.Func(
      [],
      [PaymentMethodBreakdown2],
      ["query"]
    ),
    "getPaymentsByDateRange": IDL2.Func(
      [Timestamp2, Timestamp2],
      [IDL2.Vec(Payment2)],
      ["query"]
    ),
    "getStudent": IDL2.Func([StudentId2], [IDL2.Opt(Student2)], ["query"]),
    "getStudentBalances": IDL2.Func(
      [StudentId2],
      [IDL2.Vec(StudentBalance2)],
      ["query"]
    ),
    "isCallerAdmin": IDL2.Func([], [IDL2.Bool], ["query"]),
    "listFeeStructures": IDL2.Func([], [IDL2.Vec(FeeStructure2)], ["query"]),
    "listStudents": IDL2.Func([], [IDL2.Vec(Student2)], ["query"]),
    "listStudentsByGroup": IDL2.Func([IDL2.Text], [IDL2.Vec(Student2)], ["query"]),
    "recordPayment": IDL2.Func(
      [RecordPaymentInput2],
      [IDL2.Variant({ "ok": Payment2, "err": RecordPaymentError2 })],
      []
    ),
    "unenrollStudent": IDL2.Func([StudentId2, FeeStructureId2], [IDL2.Bool], []),
    "updateFeeStructure": IDL2.Func(
      [UpdateFeeStructureInput2],
      [IDL2.Opt(FeeStructure2)],
      []
    ),
    "updateOverdueStatuses": IDL2.Func([], [], []),
    "updateStudent": IDL2.Func([UpdateStudentInput2], [IDL2.Opt(Student2)], []),
    "waiveFee": IDL2.Func(
      [StudentId2, FeeStructureId2, IDL2.Text],
      [IDL2.Opt(FeeAssignment2)],
      []
    )
  });
};
function candid_some(value) {
  return [
    value
  ];
}
function candid_none() {
  return [];
}
function record_opt_to_undefined(arg) {
  return arg == null ? void 0 : arg;
}
var FeePeriod = /* @__PURE__ */ ((FeePeriod2) => {
  FeePeriod2["semester"] = "semester";
  FeePeriod2["term"] = "term";
  FeePeriod2["annual"] = "annual";
  FeePeriod2["monthly"] = "monthly";
  return FeePeriod2;
})(FeePeriod || {});
var PaymentMethod = /* @__PURE__ */ ((PaymentMethod2) => {
  PaymentMethod2["cash"] = "cash";
  PaymentMethod2["check"] = "check";
  PaymentMethod2["transfer"] = "transfer";
  PaymentMethod2["online"] = "online";
  return PaymentMethod2;
})(PaymentMethod || {});
var PaymentStatus = /* @__PURE__ */ ((PaymentStatus2) => {
  PaymentStatus2["pending"] = "pending";
  PaymentStatus2["paid"] = "paid";
  PaymentStatus2["overdue"] = "overdue";
  PaymentStatus2["waived"] = "waived";
  PaymentStatus2["partial"] = "partial";
  return PaymentStatus2;
})(PaymentStatus || {});
var RecordPaymentError = /* @__PURE__ */ ((RecordPaymentError2) => {
  RecordPaymentError2["DuplicateReceipt"] = "DuplicateReceipt";
  RecordPaymentError2["NotFound"] = "NotFound";
  return RecordPaymentError2;
})(RecordPaymentError || {});
class Backend {
  constructor(actor, _uploadFile, _downloadFile, processError) {
    this.actor = actor;
    this._uploadFile = _uploadFile;
    this._downloadFile = _downloadFile;
    this.processError = processError;
  }
  async _initializeAccessControl() {
    if (this.processError) {
      try {
        const result = await this.actor._initializeAccessControl();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._initializeAccessControl();
      return result;
    }
  }
  async assignCallerUserRole(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.assignCallerUserRole(arg0, to_candid_UserRole_n1(this._uploadFile, this._downloadFile, arg1));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.assignCallerUserRole(arg0, to_candid_UserRole_n1(this._uploadFile, this._downloadFile, arg1));
      return result;
    }
  }
  async assignFeeToGroup(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.assignFeeToGroup(arg0, arg1);
        return from_candid_vec_n3(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.assignFeeToGroup(arg0, arg1);
      return from_candid_vec_n3(this._uploadFile, this._downloadFile, result);
    }
  }
  async assignFeeToStudent(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.assignFeeToStudent(arg0, arg1);
        return from_candid_FeeAssignment_n4(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.assignFeeToStudent(arg0, arg1);
      return from_candid_FeeAssignment_n4(this._uploadFile, this._downloadFile, result);
    }
  }
  async bulkImportStudents(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.bulkImportStudents(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.bulkImportStudents(arg0);
      return result;
    }
  }
  async checkReceiptExists(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.checkReceiptExists(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.checkReceiptExists(arg0);
      return result;
    }
  }
  async createFeeStructure(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createFeeStructure(to_candid_CreateFeeStructureInput_n9(this._uploadFile, this._downloadFile, arg0));
        return from_candid_FeeStructure_n15(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createFeeStructure(to_candid_CreateFeeStructureInput_n9(this._uploadFile, this._downloadFile, arg0));
      return from_candid_FeeStructure_n15(this._uploadFile, this._downloadFile, result);
    }
  }
  async createStudent(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createStudent(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createStudent(arg0);
      return result;
    }
  }
  async deleteFeeStructure(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteFeeStructure(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteFeeStructure(arg0);
      return result;
    }
  }
  async deleteStudent(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteStudent(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteStudent(arg0);
      return result;
    }
  }
  async duplicateFeeStructure(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.duplicateFeeStructure(arg0);
        return from_candid_opt_n22(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.duplicateFeeStructure(arg0);
      return from_candid_opt_n22(this._uploadFile, this._downloadFile, result);
    }
  }
  async getAgingReport() {
    if (this.processError) {
      try {
        const result = await this.actor.getAgingReport();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAgingReport();
      return result;
    }
  }
  async getAgingReportDetail(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getAgingReportDetail(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAgingReportDetail(arg0);
      return result;
    }
  }
  async getAllBalances() {
    if (this.processError) {
      try {
        const result = await this.actor.getAllBalances();
        return from_candid_vec_n23(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAllBalances();
      return from_candid_vec_n23(this._uploadFile, this._downloadFile, result);
    }
  }
  async getCallerUserRole() {
    if (this.processError) {
      try {
        const result = await this.actor.getCallerUserRole();
        return from_candid_UserRole_n26(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCallerUserRole();
      return from_candid_UserRole_n26(this._uploadFile, this._downloadFile, result);
    }
  }
  async getCollectionSummary() {
    if (this.processError) {
      try {
        const result = await this.actor.getCollectionSummary();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCollectionSummary();
      return result;
    }
  }
  async getCollectionTrends() {
    if (this.processError) {
      try {
        const result = await this.actor.getCollectionTrends();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCollectionTrends();
      return result;
    }
  }
  async getFeeStructure(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getFeeStructure(arg0);
        return from_candid_opt_n22(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getFeeStructure(arg0);
      return from_candid_opt_n22(this._uploadFile, this._downloadFile, result);
    }
  }
  async getFeeStructureBalances(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getFeeStructureBalances(arg0);
        return from_candid_vec_n23(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getFeeStructureBalances(arg0);
      return from_candid_vec_n23(this._uploadFile, this._downloadFile, result);
    }
  }
  async getPaymentMethodBreakdown() {
    if (this.processError) {
      try {
        const result = await this.actor.getPaymentMethodBreakdown();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getPaymentMethodBreakdown();
      return result;
    }
  }
  async getPaymentsByDateRange(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.getPaymentsByDateRange(arg0, arg1);
        return from_candid_vec_n28(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getPaymentsByDateRange(arg0, arg1);
      return from_candid_vec_n28(this._uploadFile, this._downloadFile, result);
    }
  }
  async getStudent(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getStudent(arg0);
        return from_candid_opt_n33(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getStudent(arg0);
      return from_candid_opt_n33(this._uploadFile, this._downloadFile, result);
    }
  }
  async getStudentBalances(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getStudentBalances(arg0);
        return from_candid_vec_n23(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getStudentBalances(arg0);
      return from_candid_vec_n23(this._uploadFile, this._downloadFile, result);
    }
  }
  async isCallerAdmin() {
    if (this.processError) {
      try {
        const result = await this.actor.isCallerAdmin();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.isCallerAdmin();
      return result;
    }
  }
  async listFeeStructures() {
    if (this.processError) {
      try {
        const result = await this.actor.listFeeStructures();
        return from_candid_vec_n34(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listFeeStructures();
      return from_candid_vec_n34(this._uploadFile, this._downloadFile, result);
    }
  }
  async listStudents() {
    if (this.processError) {
      try {
        const result = await this.actor.listStudents();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listStudents();
      return result;
    }
  }
  async listStudentsByGroup(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.listStudentsByGroup(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listStudentsByGroup(arg0);
      return result;
    }
  }
  async recordPayment(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.recordPayment(to_candid_RecordPaymentInput_n35(this._uploadFile, this._downloadFile, arg0));
        return from_candid_variant_n39(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.recordPayment(to_candid_RecordPaymentInput_n35(this._uploadFile, this._downloadFile, arg0));
      return from_candid_variant_n39(this._uploadFile, this._downloadFile, result);
    }
  }
  async unenrollStudent(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.unenrollStudent(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.unenrollStudent(arg0, arg1);
      return result;
    }
  }
  async updateFeeStructure(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.updateFeeStructure(to_candid_UpdateFeeStructureInput_n42(this._uploadFile, this._downloadFile, arg0));
        return from_candid_opt_n22(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateFeeStructure(to_candid_UpdateFeeStructureInput_n42(this._uploadFile, this._downloadFile, arg0));
      return from_candid_opt_n22(this._uploadFile, this._downloadFile, result);
    }
  }
  async updateOverdueStatuses() {
    if (this.processError) {
      try {
        const result = await this.actor.updateOverdueStatuses();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateOverdueStatuses();
      return result;
    }
  }
  async updateStudent(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.updateStudent(arg0);
        return from_candid_opt_n33(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateStudent(arg0);
      return from_candid_opt_n33(this._uploadFile, this._downloadFile, result);
    }
  }
  async waiveFee(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.waiveFee(arg0, arg1, arg2);
        return from_candid_opt_n44(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.waiveFee(arg0, arg1, arg2);
      return from_candid_opt_n44(this._uploadFile, this._downloadFile, result);
    }
  }
}
function from_candid_FeeAssignment_n4(_uploadFile, _downloadFile, value) {
  return from_candid_record_n5(_uploadFile, _downloadFile, value);
}
function from_candid_FeePeriod_n17(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n18(_uploadFile, _downloadFile, value);
}
function from_candid_FeeStructure_n15(_uploadFile, _downloadFile, value) {
  return from_candid_record_n16(_uploadFile, _downloadFile, value);
}
function from_candid_LatePenalty_n20(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n21(_uploadFile, _downloadFile, value);
}
function from_candid_PaymentMethod_n31(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n32(_uploadFile, _downloadFile, value);
}
function from_candid_PaymentStatus_n6(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n7(_uploadFile, _downloadFile, value);
}
function from_candid_Payment_n29(_uploadFile, _downloadFile, value) {
  return from_candid_record_n30(_uploadFile, _downloadFile, value);
}
function from_candid_RecordPaymentError_n40(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n41(_uploadFile, _downloadFile, value);
}
function from_candid_StudentBalance_n24(_uploadFile, _downloadFile, value) {
  return from_candid_record_n25(_uploadFile, _downloadFile, value);
}
function from_candid_UserRole_n26(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n27(_uploadFile, _downloadFile, value);
}
function from_candid_opt_n19(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_LatePenalty_n20(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n22(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_FeeStructure_n15(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n33(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n44(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_FeeAssignment_n4(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n8(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_record_n16(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    endDate: value.endDate,
    period: from_candid_FeePeriod_n17(_uploadFile, _downloadFile, value.period),
    name: value.name,
    createdAt: value.createdAt,
    latePenalty: record_opt_to_undefined(from_candid_opt_n19(_uploadFile, _downloadFile, value.latePenalty)),
    dueDate: value.dueDate,
    description: value.description,
    updatedAt: value.updatedAt,
    amount: value.amount,
    startDate: value.startDate
  };
}
function from_candid_record_n25(_uploadFile, _downloadFile, value) {
  return {
    status: from_candid_PaymentStatus_n6(_uploadFile, _downloadFile, value.status),
    feeStructureName: value.feeStructureName,
    studentId: value.studentId,
    feeStructureId: value.feeStructureId,
    studentName: value.studentName,
    penaltyAmount: value.penaltyAmount,
    dueDate: value.dueDate,
    totalAmount: value.totalAmount,
    outstandingAmount: value.outstandingAmount,
    totalWithPenalty: value.totalWithPenalty,
    paidAmount: value.paidAmount
  };
}
function from_candid_record_n30(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    method: from_candid_PaymentMethod_n31(_uploadFile, _downloadFile, value.method),
    studentId: value.studentId,
    feeStructureId: value.feeStructureId,
    date: value.date,
    createdAt: value.createdAt,
    notes: value.notes,
    amount: value.amount,
    receiptNumber: value.receiptNumber
  };
}
function from_candid_record_n5(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    status: from_candid_PaymentStatus_n6(_uploadFile, _downloadFile, value.status),
    studentId: value.studentId,
    feeStructureId: value.feeStructureId,
    assignedAt: value.assignedAt,
    waivedReason: record_opt_to_undefined(from_candid_opt_n8(_uploadFile, _downloadFile, value.waivedReason)),
    updatedAt: value.updatedAt
  };
}
function from_candid_variant_n18(_uploadFile, _downloadFile, value) {
  return "semester" in value ? "semester" : "term" in value ? "term" : "annual" in value ? "annual" : "monthly" in value ? "monthly" : value;
}
function from_candid_variant_n21(_uploadFile, _downloadFile, value) {
  return "fixed" in value ? {
    __kind__: "fixed",
    fixed: value.fixed
  } : "percentage" in value ? {
    __kind__: "percentage",
    percentage: value.percentage
  } : value;
}
function from_candid_variant_n27(_uploadFile, _downloadFile, value) {
  return "admin" in value ? "admin" : "user" in value ? "user" : "guest" in value ? "guest" : value;
}
function from_candid_variant_n32(_uploadFile, _downloadFile, value) {
  return "cash" in value ? "cash" : "check" in value ? "check" : "transfer" in value ? "transfer" : "online" in value ? "online" : value;
}
function from_candid_variant_n39(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: from_candid_Payment_n29(_uploadFile, _downloadFile, value.ok)
  } : "err" in value ? {
    __kind__: "err",
    err: from_candid_RecordPaymentError_n40(_uploadFile, _downloadFile, value.err)
  } : value;
}
function from_candid_variant_n41(_uploadFile, _downloadFile, value) {
  return "DuplicateReceipt" in value ? "DuplicateReceipt" : "NotFound" in value ? "NotFound" : value;
}
function from_candid_variant_n7(_uploadFile, _downloadFile, value) {
  return "pending" in value ? "pending" : "paid" in value ? "paid" : "overdue" in value ? "overdue" : "waived" in value ? "waived" : "partial" in value ? "partial" : value;
}
function from_candid_vec_n23(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_StudentBalance_n24(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n28(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Payment_n29(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n3(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_FeeAssignment_n4(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n34(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_FeeStructure_n15(_uploadFile, _downloadFile, x));
}
function to_candid_CreateFeeStructureInput_n9(_uploadFile, _downloadFile, value) {
  return to_candid_record_n10(_uploadFile, _downloadFile, value);
}
function to_candid_FeePeriod_n11(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n12(_uploadFile, _downloadFile, value);
}
function to_candid_LatePenalty_n13(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n14(_uploadFile, _downloadFile, value);
}
function to_candid_PaymentMethod_n37(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n38(_uploadFile, _downloadFile, value);
}
function to_candid_RecordPaymentInput_n35(_uploadFile, _downloadFile, value) {
  return to_candid_record_n36(_uploadFile, _downloadFile, value);
}
function to_candid_UpdateFeeStructureInput_n42(_uploadFile, _downloadFile, value) {
  return to_candid_record_n43(_uploadFile, _downloadFile, value);
}
function to_candid_UserRole_n1(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n2(_uploadFile, _downloadFile, value);
}
function to_candid_record_n10(_uploadFile, _downloadFile, value) {
  return {
    endDate: value.endDate,
    period: to_candid_FeePeriod_n11(_uploadFile, _downloadFile, value.period),
    name: value.name,
    latePenalty: value.latePenalty ? candid_some(to_candid_LatePenalty_n13(_uploadFile, _downloadFile, value.latePenalty)) : candid_none(),
    dueDate: value.dueDate,
    description: value.description,
    amount: value.amount,
    startDate: value.startDate
  };
}
function to_candid_record_n36(_uploadFile, _downloadFile, value) {
  return {
    method: to_candid_PaymentMethod_n37(_uploadFile, _downloadFile, value.method),
    studentId: value.studentId,
    feeStructureId: value.feeStructureId,
    date: value.date,
    notes: value.notes,
    amount: value.amount,
    receiptNumber: value.receiptNumber
  };
}
function to_candid_record_n43(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    endDate: value.endDate,
    period: to_candid_FeePeriod_n11(_uploadFile, _downloadFile, value.period),
    name: value.name,
    latePenalty: value.latePenalty ? candid_some(to_candid_LatePenalty_n13(_uploadFile, _downloadFile, value.latePenalty)) : candid_none(),
    dueDate: value.dueDate,
    description: value.description,
    amount: value.amount,
    startDate: value.startDate
  };
}
function to_candid_variant_n12(_uploadFile, _downloadFile, value) {
  return value == "semester" ? {
    semester: null
  } : value == "term" ? {
    term: null
  } : value == "annual" ? {
    annual: null
  } : value == "monthly" ? {
    monthly: null
  } : value;
}
function to_candid_variant_n14(_uploadFile, _downloadFile, value) {
  return value.__kind__ === "fixed" ? {
    fixed: value.fixed
  } : value.__kind__ === "percentage" ? {
    percentage: value.percentage
  } : value;
}
function to_candid_variant_n2(_uploadFile, _downloadFile, value) {
  return value == "admin" ? {
    admin: null
  } : value == "user" ? {
    user: null
  } : value == "guest" ? {
    guest: null
  } : value;
}
function to_candid_variant_n38(_uploadFile, _downloadFile, value) {
  return value == "cash" ? {
    cash: null
  } : value == "check" ? {
    check: null
  } : value == "transfer" ? {
    transfer: null
  } : value == "online" ? {
    online: null
  } : value;
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
  const agent = options.agent || HttpAgent.createSync({
    ...options.agentOptions
  });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
  }
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
export {
  Button as B,
  FeePeriod as F,
  GraduationCap as G,
  PaymentStatus as P,
  RecordPaymentError as R,
  Slot as S,
  createActor as a,
  PaymentMethod as b,
  createLucideIcon as c,
  useQuery as d,
  useComposedRefs as e,
  composeRefs as f,
  buttonVariants as g,
  createSlot as h,
  cva as i,
  useActor as u
};
