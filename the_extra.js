var Module = typeof Module !=
  "undefined" ? Module : {};
var moduleOverrides = Object.assign({},
  Module);
var arguments_ = [];
var thisProgram = "./this.program";
var quit_ = (status, toThrow) => {
  throw toThrow
};
var ENVIRONMENT_IS_WEB =
  typeof window == "object";
var ENVIRONMENT_IS_WORKER =
  typeof importScripts == "function";
var ENVIRONMENT_IS_NODE =
  typeof process == "object" &&
  typeof process.versions == "object" &&
  typeof process.versions.node ==
  "string";
var scriptDirectory = "";

function locateFile(path) {
  if (Module["locateFile"]) {
    return Module["locateFile"](path,
      scriptDirectory)
  }
  return scriptDirectory + path
}
var read_, readAsync, readBinary;
if (ENVIRONMENT_IS_NODE) {
  var fs = require("fs");
  var nodePath = require("path");
  if (ENVIRONMENT_IS_WORKER) {
    scriptDirectory = nodePath.dirname(
      scriptDirectory) + "/"
  } else {
    scriptDirectory = __dirname + "/"
  }
  read_ = (filename, binary) => {
    filename = isFileURI(filename) ?
      new URL(filename) : nodePath
      .normalize(filename);
    return fs.readFileSync(filename,
      binary ? undefined : "utf8")
  };
  readBinary = filename => {
    var ret = read_(filename, true);
    if (!ret.buffer) {
      ret = new Uint8Array(ret)
    }
    return ret
  };
  readAsync = (filename, onload,
    onerror, binary = true) => {
    filename = isFileURI(filename) ?
      new URL(filename) : nodePath
      .normalize(filename);
    fs.readFile(filename, binary ?
      undefined : "utf8", (err,
        data) => {
        if (err) onerror(err);
        else onload(binary ? data
          .buffer : data)
      })
  };
  if (!Module["thisProgram"] && process
    .argv.length > 1) {
    thisProgram = process.argv[1]
      .replace(/\\/g, "/")
  }
  arguments_ = process.argv.slice(2);
  if (typeof module != "undefined") {
    module["exports"] = Module
  }
  process.on("uncaughtException",
  ex => {
    if (ex !== "unwind" && !(
        ex instanceof ExitStatus) &&
      !(ex
        .context instanceof ExitStatus
        )) {
      throw ex
    }
  });
  quit_ = (status, toThrow) => {
    process.exitCode = status;
    throw toThrow
  }
} else if (ENVIRONMENT_IS_WEB ||
  ENVIRONMENT_IS_WORKER) {
  if (ENVIRONMENT_IS_WORKER) {
    scriptDirectory = self.location.href
  } else if (typeof document !=
    "undefined" && document
    .currentScript) {
    scriptDirectory = document
      .currentScript.src
  }
  if (scriptDirectory.startsWith(
      "blob:")) {
    scriptDirectory = ""
  } else {
    scriptDirectory = scriptDirectory
      .substr(0, scriptDirectory
        .replace(/[?#].*/, "")
        .lastIndexOf("/") + 1)
  } {
    read_ = url => {
      var xhr = new XMLHttpRequest;
      xhr.open("GET", url, false);
      xhr.send(null);
      return xhr.responseText
    };
    if (ENVIRONMENT_IS_WORKER) {
      readBinary = url => {
        var xhr = new XMLHttpRequest;
        xhr.open("GET", url, false);
        xhr.responseType =
          "arraybuffer";
        xhr.send(null);
        return new Uint8Array(xhr
          .response)
      }
    }
    readAsync = (url, onload,
      onerror) => {
        var xhr = new XMLHttpRequest;
        xhr.open("GET", url, true);
        xhr.responseType =
        "arraybuffer";
        xhr.onload = () => {
          if (xhr.status == 200 || xhr
            .status == 0 && xhr
            .response) {
            onload(xhr.response);
            return
          }
          onerror()
        };
        xhr.onerror = onerror;
        xhr.send(null)
      }
  }
} else {}
var out = Module["print"] || console.log
  .bind(console);
var err = Module["printErr"] || console
  .error.bind(console);
Object.assign(Module, moduleOverrides);
moduleOverrides = null;
if (Module["arguments"]) arguments_ =
  Module["arguments"];
if (Module["thisProgram"]) thisProgram =
  Module["thisProgram"];
if (Module["quit"]) quit_ = Module[
  "quit"];
var wasmBinary;
if (Module["wasmBinary"]) wasmBinary =
  Module["wasmBinary"];
if (typeof WebAssembly != "object") {
  abort(
    "no native wasm support detected")
}
var wasmMemory;
var ABORT = false;
var EXITSTATUS;

function assert(condition, text) {
  if (!condition) {
    abort(text)
  }
}
var HEAP8, HEAPU8, HEAP16, HEAPU16,
  HEAP32, HEAPU32, HEAPF32, HEAPF64;
/* EDITED BY CHAT GPT => 'cant read 'buffer' fix' */
 /* function updateMemoryViews() {
  var b = wasmMemory.buffer;
  Module["HEAP8"] = HEAP8 =
    new Int8Array(b);
  Module["HEAP16"] = HEAP16 =
    new Int16Array(b);
  Module["HEAPU8"] = HEAPU8 =
    new Uint8Array(b);
  Module["HEAPU16"] = HEAPU16 =
    new Uint16Array(b);
  Module["HEAP32"] = HEAP32 =
    new Int32Array(b);
  Module["HEAPU32"] = HEAPU32 =
    new Uint32Array(b);
  Module["HEAPF32"] = HEAPF32 =
    new Float32Array(b);
  Module["HEAPF64"] = HEAPF64 =
    new Float64Array(b)
}
var __ATPRERUN__ = [];
var __ATINIT__ = [];
var __ATMAIN__ = [];
var __ATPOSTRUN__ = [];
var runtimeInitialized = false; */

var wasmMemory;
var ABORT = false;
var EXITSTATUS;

function assert(condition, text) {
  if (!condition) {
    abort(text);
  }
}

// Declare typed arrays for memory views
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

/* EDITED BY CHAT GPT => 'cant read 'buffer' fix' */
function updateMemoryViews() {
  // Check if wasmMemory is initialized and has a buffer
  if (!wasmMemory || !wasmMemory.buffer) {
    console.error("wasmMemory is not initialized or the buffer is not accessible.");
    return;
  }

  // Get the memory buffer and create views for different data types
  var b = wasmMemory.buffer;
  Module["HEAP8"] = HEAP8 = new Int8Array(b);
  Module["HEAP16"] = HEAP16 = new Int16Array(b);
  Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
  Module["HEAPU16"] = HEAPU16 = new Uint16Array(b);
  Module["HEAP32"] = HEAP32 = new Int32Array(b);
  Module["HEAPU32"] = HEAPU32 = new Uint32Array(b);
  Module["HEAPF32"] = HEAPF32 = new Float32Array(b);
  Module["HEAPF64"] = HEAPF64 = new Float64Array(b);
}

var __ATPRERUN__ = [];
var __ATINIT__ = [];
var __ATMAIN__ = [];
var __ATPOSTRUN__ = [];
var runtimeInitialized = false;

// Example initialization of wasmMemory (this should be part of your actual WebAssembly setup)
function initializeWasmMemory() {
  wasmMemory = new WebAssembly.Memory({ initial: 256, maximum: 512 });
  updateMemoryViews();  // Update memory views after initializing wasmMemory
}

// Call initializeWasmMemory when appropriate in your application flow
initializeWasmMemory();


function preRun() {
  if (Module["preRun"]) {
    if (typeof Module["preRun"] ==
      "function") Module["preRun"] = [
      Module["preRun"]
    ];
    while (Module["preRun"].length) {
      addOnPreRun(Module["preRun"]
        .shift())
    }
  }
  callRuntimeCallbacks(__ATPRERUN__)
}

function initRuntime() {
  runtimeInitialized = true;
  if (!Module["noFSInit"] && !FS.init
    .initialized) FS.init();
  FS.ignorePermissions = false;
  TTY.init();
  callRuntimeCallbacks(__ATINIT__)
}

function preMain() {
  callRuntimeCallbacks(__ATMAIN__)
}

function postRun() {
  if (Module["postRun"]) {
    if (typeof Module["postRun"] ==
      "function") Module["postRun"] = [
      Module["postRun"]
    ];
    while (Module["postRun"].length) {
      addOnPostRun(Module["postRun"]
        .shift())
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__)
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb)
}

function addOnInit(cb) {
  __ATINIT__.unshift(cb)
}

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb)
}
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null;

function getUniqueRunDependency(id) {
  return id
}

function addRunDependency(id) {
  runDependencies++;
  Module["monitorRunDependencies"]?.(
    runDependencies)
}

function removeRunDependency(id) {
  runDependencies--;
  Module["monitorRunDependencies"]?.(
    runDependencies);
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(
        runDependencyWatcher);
      runDependencyWatcher = null
    }
    if (dependenciesFulfilled) {
      var callback =
        dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback()
    }
  }
}

function abort(what) {
  Module["onAbort"]?.(what);
  what = "Aborted(" + what + ")";
  err(what);
  ABORT = true;
  EXITSTATUS = 1;
  what +=
    ". Build with -sASSERTIONS for more info.";
  var e = new WebAssembly.RuntimeError(
    what);
  throw e
}
var dataURIPrefix =
  "data:application/octet-stream;base64,";
var isDataURI = filename => filename
  .startsWith(dataURIPrefix);
var isFileURI = filename => filename
  .startsWith("file://");
var wasmBinaryFile;
wasmBinaryFile =
  "mupen64plus_next_libretro.wasm";
if (!isDataURI(wasmBinaryFile)) {
  wasmBinaryFile = locateFile(
    wasmBinaryFile)
}

function getBinarySync(file) {
  if (file == wasmBinaryFile &&
    wasmBinary) {
    return new Uint8Array(wasmBinary)
  }
  if (readBinary) {
    return readBinary(file)
  }
  throw "both async and sync fetching of the wasm failed"
}

function getBinaryPromise(binaryFile) {
  if (!wasmBinary && (
      ENVIRONMENT_IS_WEB ||
      ENVIRONMENT_IS_WORKER)) {
    if (typeof fetch == "function" && !
      isFileURI(binaryFile)) {
      return fetch(binaryFile, {
        credentials: "same-origin"
      }).then(response => {
        if (!response["ok"]) {
          throw `failed to load wasm binary file at '${binaryFile}'`
        }
        return response[
          "arrayBuffer"]()
      }).catch(() => getBinarySync(
        binaryFile))
    } else if (readAsync) {
      return new Promise((resolve,
        reject) => {
        readAsync(binaryFile,
          response => resolve(
            new Uint8Array(
              response)), reject)
      })
    }
  }
  return Promise.resolve().then(() =>
    getBinarySync(binaryFile))
}

function instantiateArrayBuffer(
  binaryFile, imports, receiver) {
  return getBinaryPromise(binaryFile)
    .then(binary => WebAssembly
      .instantiate(binary, imports))
    .then(receiver, reason => {
      err(
        `failed to asynchronously prepare wasm: ${reason}`);
      abort(reason)
    })
}

function instantiateAsync(binary,
  binaryFile, imports, callback) {
  if (!binary && typeof WebAssembly
    .instantiateStreaming ==
    "function" && !isDataURI(
    binaryFile) && !isFileURI(
      binaryFile) && !
    ENVIRONMENT_IS_NODE &&
    typeof fetch == "function") {
    return fetch(binaryFile, {
      credentials: "same-origin"
    }).then(response => {
      var result = WebAssembly
        .instantiateStreaming(
          response, imports);
      return result.then(callback,
        function(reason) {
          err(
            `wasm streaming compile failed: ${reason}`);
          err(
            "falling back to ArrayBuffer instantiation");
          return instantiateArrayBuffer(
            binaryFile, imports,
            callback)
        })
    })
  }
  return instantiateArrayBuffer(
    binaryFile, imports, callback)
}

function createWasm() {
  var info = {
    "a": wasmImports
  };

  function receiveInstance(instance,
    module) {
    wasmExports = instance.exports;
    wasmExports = Asyncify
      .instrumentWasmExports(
        wasmExports);
    wasmMemory = wasmExports["ki"];
    updateMemoryViews();
    wasmTable = wasmExports["mi"];
    addOnInit(wasmExports["li"]);
    removeRunDependency(
      "wasm-instantiate");
    return wasmExports
  }
  addRunDependency("wasm-instantiate");

  function receiveInstantiationResult(
    result) {
    receiveInstance(result["instance"])
  }
  if (Module["instantiateWasm"]) {
    try {
      return Module["instantiateWasm"](
        info, receiveInstance)
    } catch (e) {
      err(
        `Module.instantiateWasm callback failed with error: ${e}`);
      return false
    }
  }
  instantiateAsync(wasmBinary,
    wasmBinaryFile, info,
    receiveInstantiationResult);
  return {}
}
var tempDouble;
var tempI64;
var ASM_CONSTS = {
  1283876: () => {
    specialHTMLTargets["!canvas"] =
      Module.canvas
  }
};

function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message =
    `Program terminated with exit(${status})`;
  this.status = status
}
var callRuntimeCallbacks =
callbacks => {
  while (callbacks.length > 0) {
    callbacks.shift()(Module)
  }
};

function getValue(ptr, type = "i8") {
  if (type.endsWith("*")) type = "*";
  switch (type) {
    case "i1":
      return HEAP8[ptr];
    case "i8":
      return HEAP8[ptr];
    case "i16":
      return HEAP16[ptr >> 1];
    case "i32":
      return HEAP32[ptr >> 2];
    case "i64":
      abort(
        "to do getValue(i64) use WASM_BIGINT"
        );
    case "float":
      return HEAPF32[ptr >> 2];
    case "double":
      return HEAPF64[ptr >> 3];
    case "*":
      return HEAPU32[ptr >> 2];
    default:
      abort(
        `invalid type for getValue: ${type}`
        )
  }
}
var noExitRuntime = Module[
  "noExitRuntime"] || true;
var RWC = {
  RETRO_CAMERA_BUFFER_OPENGL_TEXTURE: 0
  , RETRO_CAMERA_BUFFER_RAW_FRAMEBUFFER: 1
  , tmp: null
  , contexts: []
  , counter: 0
  , ready: function(data) {
    return RWC.contexts[data]
      .runMode == 2 && !RWC
      .contexts[data].videoElement
      .paused && RWC.contexts[data]
      .videoElement.videoWidth !=
      0 && RWC.contexts[data]
      .videoElement.videoHeight != 0
  }
};

function _RWebCamFree(data) {
  RWC.contexts[data].videoElement
  .pause();
  URL.revokeObjectURL(RWC.contexts[data]
    .videoElement.src);
  RWC.contexts[data].videoElement =
  null;
  RWC.contexts[data] = null
}

function _RWebCamInit(caps1, caps2,
  width, height) {
  if (!navigator) return 0;
  navigator.getMedia = navigator
    .getUserMedia || navigator
    .webkitGetUserMedia || navigator
    .mozGetUserMedia || navigator
    .msGetUserMedia;
  if (!navigator.getMedia) return 0;
  var c = ++RWC.counter;
  RWC.contexts[c] = [];
  RWC.contexts[c].videoElement =
    document.createElement("video");
  if (width !== 0 && height !== 0) {
    RWC.contexts[c].videoElement.width =
      width;
    RWC.contexts[c].videoElement
      .height = height
  }
  RWC.contexts[c].runMode = 1;
  RWC.contexts[c].glTex = caps1 & 1 <<
    RWC
    .RETRO_CAMERA_BUFFER_OPENGL_TEXTURE;
  RWC.contexts[c].rawFb = caps1 & 1 <<
    RWC
    .RETRO_CAMERA_BUFFER_RAW_FRAMEBUFFER;
  navigator.getMedia({
    video: true
    , audio: false
  }, function(stream) {
    RWC.contexts[c].videoElement
      .autoplay = true;
    RWC.contexts[c].videoElement
      .src = URL.createObjectURL(
        stream);
    RWC.contexts[c].runMode = 2
  }, function(err) {
    console.log(
      "webcam request failed", err
      );
    RWC.runMode = 0
  });
  if (!RWC.tmp) RWC.tmp = _malloc(4);
  return c
}
var
  webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance =
  ctx => !!(ctx.dibvbi = ctx
    .getExtension(
      "WEBGL_draw_instanced_base_vertex_base_instance"
      ));
var
  webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance =
  ctx => !!(ctx.mdibvbi = ctx
    .getExtension(
      "WEBGL_multi_draw_instanced_base_vertex_base_instance"
      ));
var webgl_enable_WEBGL_multi_draw =
  ctx => !!(ctx.multiDrawWebgl = ctx
    .getExtension("WEBGL_multi_draw"));
var getEmscriptenSupportedExtensions =
  ctx => {
    var supportedExtensions = [
      "EXT_color_buffer_float",
      "EXT_conservative_depth",
      "EXT_disjoint_timer_query_webgl2",
      "EXT_texture_norm16",
      "NV_shader_noperspective_interpolation",
      "WEBGL_clip_cull_distance",
      "EXT_color_buffer_half_float",
      "EXT_depth_clamp",
      "EXT_float_blend",
      "EXT_texture_compression_bptc",
      "EXT_texture_compression_rgtc",
      "EXT_texture_filter_anisotropic",
      "KHR_parallel_shader_compile",
      "OES_texture_float_linear",
      "WEBGL_blend_func_extended",
      "WEBGL_compressed_texture_astc",
      "WEBGL_compressed_texture_etc",
      "WEBGL_compressed_texture_etc1",
      "WEBGL_compressed_texture_s3tc",
      "WEBGL_compressed_texture_s3tc_srgb",
      "WEBGL_debug_renderer_info",
      "WEBGL_debug_shaders",
      "WEBGL_lose_context",
      "WEBGL_multi_draw"
    ];
    return (ctx
      .getSupportedExtensions() || [])
      .filter(ext => supportedExtensions
        .includes(ext))
  };
var UTF8Decoder = typeof TextDecoder !=
  "undefined" ? new TextDecoder(
  "utf8") : undefined;
var UTF8ArrayToString = (heapOrArray,
  idx, maxBytesToRead) => {
  var endIdx = idx + maxBytesToRead;
  var endPtr = idx;
  while (heapOrArray[endPtr] && !(
      endPtr >= endIdx)) ++endPtr;
  if (endPtr - idx > 16 && heapOrArray
    .buffer && UTF8Decoder) {
    return UTF8Decoder.decode(
      heapOrArray.subarray(idx,
        endPtr))
  }
  var str = "";
  while (idx < endPtr) {
    var u0 = heapOrArray[idx++];
    if (!(u0 & 128)) {
      str += String.fromCharCode(u0);
      continue
    }
    var u1 = heapOrArray[idx++] & 63;
    if ((u0 & 224) == 192) {
      str += String.fromCharCode((u0 &
        31) << 6 | u1);
      continue
    }
    var u2 = heapOrArray[idx++] & 63;
    if ((u0 & 240) == 224) {
      u0 = (u0 & 15) << 12 | u1 << 6 |
        u2
    } else {
      u0 = (u0 & 7) << 18 | u1 << 12 |
        u2 << 6 | heapOrArray[idx++] &
        63
    }
    if (u0 < 65536) {
      str += String.fromCharCode(u0)
    } else {
      var ch = u0 - 65536;
      str += String.fromCharCode(
        55296 | ch >> 10, 56320 |
        ch & 1023)
    }
  }
  return str
};
var UTF8ToString = (ptr,
  maxBytesToRead) => ptr ?
  UTF8ArrayToString(HEAPU8, ptr,
    maxBytesToRead) : "";
var GL = {
  counter: 1
  , buffers: []
  , mappedBuffers: {}
  , programs: []
  , framebuffers: []
  , renderbuffers: []
  , textures: []
  , shaders: []
  , vaos: []
  , contexts: []
  , offscreenCanvases: {}
  , queries: []
  , samplers: []
  , transformFeedbacks: []
  , syncs: []
  , byteSizeByTypeRoot: 5120
  , byteSizeByType: [1, 1, 2, 2, 4, 4,
    4, 2, 3, 4, 8
  ]
  , stringCache: {}
  , stringiCache: {}
  , unpackAlignment: 4
  , recordError: errorCode => {
    if (!GL.lastError) {
      GL.lastError = errorCode
    }
  }
  , getNewId: table => {
    var ret = GL.counter++;
    for (var i = table.length; i <
      ret; i++) {
      table[i] = null
    }
    return ret
  }
  , genObject: (n, buffers,
    createFunction, objectTable
    ) => {
    for (var i = 0; i < n; i++) {
      var buffer = GLctx[
        createFunction]();
      var id = buffer && GL
        .getNewId(objectTable);
      if (buffer) {
        buffer.name = id;
        objectTable[id] = buffer
      } else {
        GL.recordError(1282)
      }
      HEAP32[buffers + i * 4 >> 2] =
        id
    }
  }
  , MAX_TEMP_BUFFER_SIZE: 2097152
  , numTempVertexBuffersPerSize: 64
  , log2ceilLookup: i => 32 - Math
    .clz32(i === 0 ? 0 : i - 1)
  , generateTempBuffers: (quads,
    context) => {
    var largestIndex = GL
      .log2ceilLookup(GL
        .MAX_TEMP_BUFFER_SIZE);
    context
      .tempVertexBufferCounters1 = [];
    context
      .tempVertexBufferCounters2 = [];
    context
      .tempVertexBufferCounters1
      .length = context
      .tempVertexBufferCounters2
      .length = largestIndex + 1;
    context.tempVertexBuffers1 = [];
    context.tempVertexBuffers2 = [];
    context.tempVertexBuffers1
      .length = context
      .tempVertexBuffers2.length =
      largestIndex + 1;
    context.tempIndexBuffers = [];
    context.tempIndexBuffers
      .length = largestIndex + 1;
    for (var i = 0; i <=
      largestIndex; ++i) {
      context.tempIndexBuffers[i] =
        null;
      context
        .tempVertexBufferCounters1[
          i] = context
        .tempVertexBufferCounters2[
          i] = 0;
      var ringbufferLength = GL
        .numTempVertexBuffersPerSize;
      context.tempVertexBuffers1[
        i] = [];
      context.tempVertexBuffers2[
        i] = [];
      var ringbuffer1 = context
        .tempVertexBuffers1[i];
      var ringbuffer2 = context
        .tempVertexBuffers2[i];
      ringbuffer1.length =
        ringbuffer2.length =
        ringbufferLength;
      for (var j = 0; j <
        ringbufferLength; ++j) {
        ringbuffer1[j] =
          ringbuffer2[j] = null
      }
    }
    if (quads) {
      context.tempQuadIndexBuffer =
        GLctx.createBuffer();
      context.GLctx.bindBuffer(
        34963, context
        .tempQuadIndexBuffer);
      var numIndexes = GL
        .MAX_TEMP_BUFFER_SIZE >> 1;
      var quadIndexes =
        new Uint16Array(numIndexes);
      var i = 0
        , v = 0;
      while (1) {
        quadIndexes[i++] = v;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 1;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 2;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 2;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 3;
        if (i >= numIndexes) break;
        v += 4
      }
      context.GLctx.bufferData(
        34963, quadIndexes, 35044);
      context.GLctx.bindBuffer(
        34963, null)
    }
  }
  , getTempVertexBuffer: sizeBytes => {
    var idx = GL.log2ceilLookup(
      sizeBytes);
    var ringbuffer = GL
      .currentContext
      .tempVertexBuffers1[idx];
    var nextFreeBufferIndex = GL
      .currentContext
      .tempVertexBufferCounters1[
        idx];
    GL.currentContext
      .tempVertexBufferCounters1[
        idx] = GL.currentContext
      .tempVertexBufferCounters1[
        idx] + 1 & GL
      .numTempVertexBuffersPerSize -
      1;
    var vbo = ringbuffer[
      nextFreeBufferIndex];
    if (vbo) {
      return vbo
    }
    var prevVBO = GLctx
      .getParameter(34964);
    ringbuffer[
      nextFreeBufferIndex] = GLctx
      .createBuffer();
    GLctx.bindBuffer(34962,
      ringbuffer[
        nextFreeBufferIndex]);
    GLctx.bufferData(34962, 1 <<
      idx, 35048);
    GLctx.bindBuffer(34962,
    prevVBO);
    return ringbuffer[
      nextFreeBufferIndex]
  }
  , getTempIndexBuffer: sizeBytes => {
    var idx = GL.log2ceilLookup(
      sizeBytes);
    var ibo = GL.currentContext
      .tempIndexBuffers[idx];
    if (ibo) {
      return ibo
    }
    var prevIBO = GLctx
      .getParameter(34965);
    GL.currentContext
      .tempIndexBuffers[idx] = GLctx
      .createBuffer();
    GLctx.bindBuffer(34963, GL
      .currentContext
      .tempIndexBuffers[idx]);
    GLctx.bufferData(34963, 1 <<
      idx, 35048);
    GLctx.bindBuffer(34963,
    prevIBO);
    return GL.currentContext
      .tempIndexBuffers[idx]
  }
  , newRenderingFrameStarted: () => {
    if (!GL.currentContext) {
      return
    }
    var vb = GL.currentContext
      .tempVertexBuffers1;
    GL.currentContext
      .tempVertexBuffers1 = GL
      .currentContext
      .tempVertexBuffers2;
    GL.currentContext
      .tempVertexBuffers2 = vb;
    vb = GL.currentContext
      .tempVertexBufferCounters1;
    GL.currentContext
      .tempVertexBufferCounters1 =
      GL.currentContext
      .tempVertexBufferCounters2;
    GL.currentContext
      .tempVertexBufferCounters2 =
      vb;
    var largestIndex = GL
      .log2ceilLookup(GL
        .MAX_TEMP_BUFFER_SIZE);
    for (var i = 0; i <=
      largestIndex; ++i) {
      GL.currentContext
        .tempVertexBufferCounters1[
          i] = 0
    }
  }
  , getSource: (shader, count, string,
    length) => {
    var source = "";
    for (var i = 0; i < count; ++
      i) {
      var len = length ? HEAPU32[
          length + i * 4 >> 2] :
        undefined;
      source += UTF8ToString(
        HEAPU32[string + i * 4 >>
          2], len)
    }
    return source
  }
  , calcBufLength: (size, type,
    stride, count) => {
    if (stride > 0) {
      return count * stride
    }
    var typeSize = GL
      .byteSizeByType[type - GL
        .byteSizeByTypeRoot];
    return size * typeSize * count
  }
  , usedTempBuffers: []
  , preDrawHandleClientVertexAttribBindings: count => {
    GL.resetBufferBinding = false;
    for (var i = 0; i < GL
      .currentContext
      .maxVertexAttribs; ++i) {
      var cb = GL.currentContext
        .clientBuffers[i];
      if (!cb.clientside || !cb
        .enabled) continue;
      GL.resetBufferBinding = true;
      var size = GL.calcBufLength(cb
        .size, cb.type, cb.stride,
        count);
      var buf = GL
        .getTempVertexBuffer(size);
      GLctx.bindBuffer(34962, buf);
      GLctx.bufferSubData(34962, 0,
        HEAPU8.subarray(cb.ptr, cb
          .ptr + size));
      cb.vertexAttribPointerAdaptor
        .call(GLctx, i, cb.size, cb
          .type, cb.normalized, cb
          .stride, 0)
    }
  }
  , postDrawHandleClientVertexAttribBindings: () => {
    if (GL.resetBufferBinding) {
      GLctx.bindBuffer(34962, GL
        .buffers[GLctx
          .currentArrayBufferBinding
          ])
    }
  }
  , createContext: (canvas,
    webGLContextAttributes) => {
    if (!canvas
      .getContextSafariWebGL2Fixed
      ) {
      canvas
        .getContextSafariWebGL2Fixed =
        canvas.getContext;

      function fixedGetContext(ver,
        attrs) {
        var gl = canvas
          .getContextSafariWebGL2Fixed(
            ver, attrs);
        return ver == "webgl" ==
          gl instanceof WebGLRenderingContext ?
          gl : null
      }
      canvas.getContext =
        fixedGetContext
    }
    var ctx = canvas.getContext(
      "webgl2",
      webGLContextAttributes);
    if (!ctx) return 0;
    var handle = GL.registerContext(
      ctx, webGLContextAttributes);
    return handle
  }
  , registerContext: (ctx,
    webGLContextAttributes) => {
    var handle = GL.getNewId(GL
      .contexts);
    var context = {
      handle: handle
      , attributes: webGLContextAttributes
      , version: webGLContextAttributes
        .majorVersion
      , GLctx: ctx
    };
    if (ctx.canvas) ctx.canvas
      .GLctxObject = context;
    GL.contexts[handle] = context;
    if (
      typeof webGLContextAttributes
      .enableExtensionsByDefault ==
      "undefined" ||
      webGLContextAttributes
      .enableExtensionsByDefault) {
      GL.initExtensions(context)
    }
    context.maxVertexAttribs =
      context.GLctx.getParameter(
        34921);
    context.clientBuffers = [];
    for (var i = 0; i < context
      .maxVertexAttribs; i++) {
      context.clientBuffers[i] = {
        enabled: false
        , clientside: false
        , size: 0
        , type: 0
        , normalized: 0
        , stride: 0
        , ptr: 0
        , vertexAttribPointerAdaptor: null
      }
    }
    GL.generateTempBuffers(false,
      context);
    return handle
  }
  , makeContextCurrent: contextHandle => {
    GL.currentContext = GL.contexts[
      contextHandle];
    Module.ctx = GLctx = GL
      .currentContext?.GLctx;
    return !(contextHandle && !
      GLctx)
  }
  , getContext: contextHandle => GL
    .contexts[contextHandle]
  , deleteContext: contextHandle => {
    if (GL.currentContext === GL
      .contexts[contextHandle]) {
      GL.currentContext = null
    }
    if (typeof JSEvents ==
      "object") {
      JSEvents
        .removeAllHandlersOnTarget(
          GL.contexts[contextHandle]
          .GLctx.canvas)
    }
    if (GL.contexts[
      contextHandle] && GL.contexts[
        contextHandle].GLctx.canvas
      ) {
      GL.contexts[contextHandle]
        .GLctx.canvas.GLctxObject =
        undefined
    }
    GL.contexts[contextHandle] =
      null
  }
  , initExtensions: context => {
    context ||= GL.currentContext;
    if (context.initExtensionsDone)
      return;
    context.initExtensionsDone =
      true;
    var GLctx = context.GLctx;
    webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance
      (GLctx);
    webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance
      (GLctx);
    if (context.version >= 2) {
      GLctx.disjointTimerQueryExt =
        GLctx.getExtension(
          "EXT_disjoint_timer_query_webgl2"
          )
    }
    if (context.version < 2 || !
      GLctx.disjointTimerQueryExt) {
      GLctx.disjointTimerQueryExt =
        GLctx.getExtension(
          "EXT_disjoint_timer_query"
          )
    }
    webgl_enable_WEBGL_multi_draw(
      GLctx);
    getEmscriptenSupportedExtensions
      (GLctx).forEach(ext => {
        if (!ext.includes(
            "lose_context") && !
          ext.includes("debug")) {
          GLctx.getExtension(ext)
        }
      })
  }
};
var _glBindTexture = (target,
  texture) => {
    GLctx.bindTexture(target, GL
      .textures[texture])
  };
var writeI53ToI64 = (ptr, num) => {
  HEAPU32[ptr >> 2] = num;
  var lower = HEAPU32[ptr >> 2];
  HEAPU32[ptr + 4 >> 2] = (num -
    lower) / 4294967296
};
var webglGetExtensions =
  function $webglGetExtensions() {
    var exts =
      getEmscriptenSupportedExtensions(
        GLctx);
    exts = exts.concat(exts.map(e =>
      "GL_" + e));
    return exts
  };
var emscriptenWebGLGet = (name_, p,
  type) => {
  if (!p) {
    GL.recordError(1281);
    return
  }
  var ret = undefined;
  switch (name_) {
    case 36346:
      ret = 1;
      break;
    case 36344:
      if (type != 0 && type != 1) {
        GL.recordError(1280)
      }
      return;
    case 34814:
    case 36345:
      ret = 0;
      break;
    case 34466:
      var formats = GLctx
        .getParameter(34467);
      ret = formats ? formats.length :
        0;
      break;
    case 33309:
      if (GL.currentContext.version <
        2) {
        GL.recordError(1282);
        return
      }
      ret = webglGetExtensions()
        .length;
      break;
    case 33307:
    case 33308:
      if (GL.currentContext.version <
        2) {
        GL.recordError(1280);
        return
      }
      ret = name_ == 33307 ? 3 : 0;
      break
  }
  if (ret === undefined) {
    var result = GLctx.getParameter(
      name_);
    switch (typeof result) {
      case "number":
        ret = result;
        break;
      case "boolean":
        ret = result ? 1 : 0;
        break;
      case "string":
        GL.recordError(1280);
        return;
      case "object":
        if (result === null) {
          switch (name_) {
            case 34964:
            case 35725:
            case 34965:
            case 36006:
            case 36007:
            case 32873:
            case 34229:
            case 36662:
            case 36663:
            case 35053:
            case 35055:
            case 36010:
            case 35097:
            case 35869:
            case 32874:
            case 36389:
            case 35983:
            case 35368:
            case 34068: {
              ret = 0;
              break
            }
            default: {
              GL.recordError(1280);
              return
            }
          }
        } else if (
          result instanceof Float32Array ||
          result instanceof Uint32Array ||
          result instanceof Int32Array ||
          result instanceof Array) {
          for (var i = 0; i < result
            .length; ++i) {
            switch (type) {
              case 0:
                HEAP32[p + i * 4 >>
                  2] = result[i];
                break;
              case 2:
                HEAPF32[p + i * 4 >>
                  2] = result[i];
                break;
              case 4:
                HEAP8[p + i] = result[
                  i] ? 1 : 0;
                break
            }
          }
          return
        } else {
          try {
            ret = result.name | 0
          } catch (e) {
            GL.recordError(1280);
            err(
              `GL_INVALID_ENUM in glGet${type}v: Unknown object returned from WebGL getParameter(${name_})! (error: ${e})`);
            return
          }
        }
        break;
      default:
        GL.recordError(1280);
        err(
          `GL_INVALID_ENUM in glGet${type}v: Native code calling glGet${type}v(${name_}) and it returns ${result} of type ${typeof result}!`);
        return
    }
  }
  switch (type) {
    case 1:
      writeI53ToI64(p, ret);
      break;
    case 0:
      HEAP32[p >> 2] = ret;
      break;
    case 2:
      HEAPF32[p >> 2] = ret;
      break;
    case 4:
      HEAP8[p] = ret ? 1 : 0;
      break
  }
};
var _glGetIntegerv = (name_, p) =>
  emscriptenWebGLGet(name_, p, 0);

function _RWebCamPoll(data,
  frame_raw_cb, frame_gl_cb) {
  if (!RWC.ready(data)) return 0;
  var ret = 0;
  if (RWC.contexts[data].glTexId !==
    0 && frame_gl_cb !== 0) {
    _glGetIntegerv(32873, RWC.tmp);
    var prev = HEAP32[RWC.tmp >> 2];
    _glBindTexture(3553, RWC.contexts[
      data].glTexId);
    if (RWC.contexts[data]
      .glFirstFrame) {
      Module.ctx.texImage2D(Module.ctx
        .TEXTURE_2D, 0, Module.ctx
        .RGB, Module.ctx.RGB, Module
        .ctx.UNSIGNED_BYTE, RWC
        .contexts[data].videoElement);
      RWC.contexts[data].glFirstFrame =
        false
    } else {
      Module.ctx.texSubImage2D(Module
        .ctx.TEXTURE_2D, 0, 0, 0,
        Module.ctx.RGB, Module.ctx
        .UNSIGNED_BYTE, RWC.contexts[
          data].videoElement)
    }
    _glBindTexture(3553, prev);
    Runtime.dynCall("viii", frame_gl_cb,
      [RWC.contexts[data].glTexId,
        3553, 0
      ]);
    ret = 1
  }
  if (RWC.contexts[data].rawFbCanvas &&
    frame_raw_cb !== 0) {
    if (!RWC.contexts[data]
      .rawFbCanvasCtx) {
      RWC.contexts[data].rawFbCanvas
        .width = RWC.contexts[data]
        .videoElement.videoWidth;
      RWC.contexts[data].rawFbCanvas
        .height = RWC.contexts[data]
        .videoElement.videoHeight;
      RWC.contexts[data]
        .rawFbCanvasCtx = RWC.contexts[
          data].rawFbCanvas.getContext(
          "2d");
      RWC.contexts[data].rawBuffer =
        _malloc(RWC.contexts[data]
          .videoElement.videoWidth * RWC
          .contexts[data].videoElement
          .videoHeight * 4)
    }
    RWC.contexts[data].rawFbCanvasCtx
      .drawImage(RWC.contexts[data]
        .videoElement, 0, 0, RWC
        .contexts[data].rawFbCanvas
        .width, RWC.contexts[data]
        .rawFbCanvas.height);
    var image = RWC.contexts[data]
      .rawFbCanvasCtx.getImageData(0, 0,
        RWC.contexts[data].videoElement
        .videoWidth, RWC.contexts[data]
        .videoElement.videoHeight);
    Module.HEAPU8.set(image.data, RWC
      .contexts[data].rawBuffer);
    Runtime.dynCall("viiii",
      frame_raw_cb, [RWC.contexts[
          data].rawBuffer, RWC
        .contexts[data].videoElement
        .videoWidth, RWC.contexts[
          data].videoElement
        .videoHeight, RWC.contexts[
          data].videoElement
        .videoWidth * 4
      ]);
    ret = 1
  }
  return ret
}
var _glGenTextures = (n, textures) => {
  GL.genObject(n, textures,
    "createTexture", GL.textures)
};
var _glTexParameteri = (x0, x1, x2) =>
  GLctx.texParameteri(x0, x1, x2);

function _RWebCamStart(data) {
  var ret = 0;
  if (RWC.contexts[data].glTex) {
    _glGenTextures(1, RWC.tmp);
    RWC.contexts[data].glTexId = HEAP32[
      RWC.tmp >> 2];
    if (RWC.contexts[data].glTexId !==
      0) {
      _glGetIntegerv(32873, RWC.tmp);
      var prev = HEAP32[RWC.tmp >> 2];
      _glBindTexture(3553, RWC.contexts[
        data].glTexId);
      _glTexParameteri(3553, 10240,
        9729);
      _glTexParameteri(3553, 10241,
        9729);
      _glTexParameteri(3553, 10242,
        33071);
      _glTexParameteri(3553, 10243,
        33071);
      _glBindTexture(3553, prev);
      RWC.contexts[data].glFirstFrame =
        true;
      ret = 1
    }
  }
  if (RWC.contexts[data].rawFb) {
    RWC.contexts[data].rawFbCanvas =
      document.createElement("canvas");
    ret = 1
  }
  return ret
}
var _glDeleteTextures = (n,
textures) => {
  for (var i = 0; i < n; i++) {
    var id = HEAP32[textures + i *
      4 >> 2];
    var texture = GL.textures[id];
    if (!texture) continue;
    GLctx.deleteTexture(texture);
    texture.name = 0;
    GL.textures[id] = null
  }
};

function _RWebCamStop(data) {
  if (RWC.contexts[data].glTexId) {
    _glDeleteTextures(1, RWC.contexts[
      data].glTexId)
  }
  if (RWC.contexts[data].rawFbCanvas) {
    if (RWC.contexts[data].rawBuffer) {
      _free(RWC.contexts[data]
        .rawBuffer);
      RWC.contexts[data].rawBuffer = 0;
      RWC.contexts[data]
        .rawFbCanvasCtx = null
    }
    RWC.contexts[data].rawFbCanvas =
      null
  }
}
var ___assert_fail = (condition,
  filename, line, func) => {
  abort(
    `Assertion failed: ${UTF8ToString(condition)}, at: ` +
    [filename ? UTF8ToString(
        filename) :
      "unknown filename", line,
      func ? UTF8ToString(func) :
      "unknown function"
    ])
};
class ExceptionInfo {
  constructor(excPtr) {
    this.excPtr = excPtr;
    this.ptr = excPtr - 24
  }
  set_type(type) {
    HEAPU32[this.ptr + 4 >> 2] = type
  }
  get_type() {
    return HEAPU32[this.ptr + 4 >> 2]
  }
  set_destructor(destructor) {
    HEAPU32[this.ptr + 8 >> 2] =
      destructor
  }
  get_destructor() {
    return HEAPU32[this.ptr + 8 >> 2]
  }
  set_caught(caught) {
    caught = caught ? 1 : 0;
    HEAP8[this.ptr + 12] = caught
  }
  get_caught() {
    return HEAP8[this.ptr + 12] != 0
  }
  set_rethrown(rethrown) {
    rethrown = rethrown ? 1 : 0;
    HEAP8[this.ptr + 13] = rethrown
  }
  get_rethrown() {
    return HEAP8[this.ptr + 13] != 0
  }
  init(type, destructor) {
    this.set_adjusted_ptr(0);
    this.set_type(type);
    this.set_destructor(destructor)
  }
  set_adjusted_ptr(adjustedPtr) {
    HEAPU32[this.ptr + 16 >> 2] =
      adjustedPtr
  }
  get_adjusted_ptr() {
    return HEAPU32[this.ptr + 16 >> 2]
  }
  get_exception_ptr() {
    var isPointer =
      ___cxa_is_pointer_type(this
        .get_type());
    if (isPointer) {
      return HEAPU32[this.excPtr >> 2]
    }
    var adjusted = this
      .get_adjusted_ptr();
    if (adjusted !== 0)
    return adjusted;
    return this.excPtr
  }
}
var exceptionLast = 0;
var uncaughtExceptionCount = 0;
var ___cxa_throw = (ptr, type,
  destructor) => {
  var info = new ExceptionInfo(ptr);
  info.init(type, destructor);
  exceptionLast = ptr;
  uncaughtExceptionCount++;
  throw exceptionLast
};
var PATH = {
  isAbs: path => path.charAt(0) ===
    "/"
  , splitPath: filename => {
    var splitPathRe =
      /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
    return splitPathRe.exec(
      filename).slice(1)
  }
  , normalizeArray: (parts,
    allowAboveRoot) => {
    var up = 0;
    for (var i = parts.length -
      1; i >= 0; i--) {
      var last = parts[i];
      if (last === ".") {
        parts.splice(i, 1)
      } else if (last === "..") {
        parts.splice(i, 1);
        up++
      } else if (up) {
        parts.splice(i, 1);
        up--
      }
    }
    if (allowAboveRoot) {
      for (; up; up--) {
        parts.unshift("..")
      }
    }
    return parts
  }
  , normalize: path => {
    var isAbsolute = PATH.isAbs(
        path)
      , trailingSlash = path.substr(
        -1) === "/";
    path = PATH.normalizeArray(path
      .split("/").filter(p => !!
      p), !isAbsolute).join("/");
    if (!path && !isAbsolute) {
      path = "."
    }
    if (path && trailingSlash) {
      path += "/"
    }
    return (isAbsolute ? "/" : "") +
      path
  }
  , dirname: path => {
    var result = PATH.splitPath(
        path)
      , root = result[0]
      , dir = result[1];
    if (!root && !dir) {
      return "."
    }
    if (dir) {
      dir = dir.substr(0, dir
        .length - 1)
    }
    return root + dir
  }
  , basename: path => {
    if (path === "/") return "/";
    path = PATH.normalize(path);
    path = path.replace(/\/$/, "");
    var lastSlash = path
      .lastIndexOf("/");
    if (lastSlash === -1)
    return path;
    return path.substr(lastSlash +
      1)
  }
  , join: (...paths) => PATH
    .normalize(paths.join("/"))
  , join2: (l, r) => PATH.normalize(
    l + "/" + r)
};
var initRandomFill = () => {
  if (typeof crypto == "object" &&
    typeof crypto[
    "getRandomValues"] == "function"
    ) {
    return view => crypto
      .getRandomValues(view)
  } else if (ENVIRONMENT_IS_NODE) {
    try {
      var crypto_module = require(
        "crypto");
      var randomFillSync =
        crypto_module[
          "randomFillSync"];
      if (randomFillSync) {
        return view => crypto_module[
          "randomFillSync"](view)
      }
      var randomBytes = crypto_module[
        "randomBytes"];
      return view => (view.set(
        randomBytes(view
          .byteLength)), view)
    } catch (e) {}
  }
  abort("initRandomDevice")
};
var randomFill = view => (randomFill =
  initRandomFill())(view);
var PATH_FS = {
  resolve: (...args) => {
    var resolvedPath = ""
      , resolvedAbsolute = false;
    for (var i = args.length -
      1; i >= -1 && !
      resolvedAbsolute; i--) {
      var path = i >= 0 ? args[i] :
        FS.cwd();
      if (typeof path != "string") {
        throw new TypeError(
          "Arguments to path.resolve must be strings"
          )
      } else if (!path) {
        return ""
      }
      resolvedPath = path + "/" +
        resolvedPath;
      resolvedAbsolute = PATH.isAbs(
        path)
    }
    resolvedPath = PATH
      .normalizeArray(resolvedPath
        .split("/").filter(p => !!
        p), !resolvedAbsolute).join(
        "/");
    return (resolvedAbsolute ? "/" :
      "") + resolvedPath || "."
  }
  , relative: (from, to) => {
    from = PATH_FS.resolve(from)
      .substr(1);
    to = PATH_FS.resolve(to).substr(
      1);

    function trim(arr) {
      var start = 0;
      for (; start < arr
        .length; start++) {
        if (arr[start] !== "") break
      }
      var end = arr.length - 1;
      for (; end >= 0; end--) {
        if (arr[end] !== "") break
      }
      if (start > end) return [];
      return arr.slice(start, end -
        start + 1)
    }
    var fromParts = trim(from.split(
      "/"));
    var toParts = trim(to.split(
      "/"));
    var length = Math.min(fromParts
      .length, toParts.length);
    var samePartsLength = length;
    for (var i = 0; i <
      length; i++) {
      if (fromParts[i] !== toParts[
          i]) {
        samePartsLength = i;
        break
      }
    }
    var outputParts = [];
    for (var i =
      samePartsLength; i < fromParts
      .length; i++) {
      outputParts.push("..")
    }
    outputParts = outputParts
      .concat(toParts.slice(
        samePartsLength));
    return outputParts.join("/")
  }
};
var FS_stdin_getChar_buffer = [];
var lengthBytesUTF8 = str => {
  var len = 0;
  for (var i = 0; i < str.length; ++
    i) {
    var c = str.charCodeAt(i);
    if (c <= 127) {
      len++
    } else if (c <= 2047) {
      len += 2
    } else if (c >= 55296 && c <=
      57343) {
      len += 4;
      ++i
    } else {
      len += 3
    }
  }
  return len
};
var stringToUTF8Array = (str, heap,
  outIdx, maxBytesToWrite) => {
  if (!(maxBytesToWrite > 0))
return 0;
  var startIdx = outIdx;
  var endIdx = outIdx +
    maxBytesToWrite - 1;
  for (var i = 0; i < str.length; ++
    i) {
    var u = str.charCodeAt(i);
    if (u >= 55296 && u <= 57343) {
      var u1 = str.charCodeAt(++i);
      u = 65536 + ((u & 1023) << 10) |
        u1 & 1023
    }
    if (u <= 127) {
      if (outIdx >= endIdx) break;
      heap[outIdx++] = u
    } else if (u <= 2047) {
      if (outIdx + 1 >= endIdx) break;
      heap[outIdx++] = 192 | u >> 6;
      heap[outIdx++] = 128 | u & 63
    } else if (u <= 65535) {
      if (outIdx + 2 >= endIdx) break;
      heap[outIdx++] = 224 | u >> 12;
      heap[outIdx++] = 128 | u >> 6 &
        63;
      heap[outIdx++] = 128 | u & 63
    } else {
      if (outIdx + 3 >= endIdx) break;
      heap[outIdx++] = 240 | u >> 18;
      heap[outIdx++] = 128 | u >> 12 &
        63;
      heap[outIdx++] = 128 | u >> 6 &
        63;
      heap[outIdx++] = 128 | u & 63
    }
  }
  heap[outIdx] = 0;
  return outIdx - startIdx
};

function intArrayFromString(stringy,
  dontAddNull, length) {
  var len = length > 0 ? length :
    lengthBytesUTF8(stringy) + 1;
  var u8array = new Array(len);
  var numBytesWritten =
    stringToUTF8Array(stringy, u8array,
      0, u8array.length);
  if (dontAddNull) u8array.length =
    numBytesWritten;
  return u8array
}
var FS_stdin_getChar = () => {
  if (!FS_stdin_getChar_buffer
    .length) {
    var result = null;
    if (ENVIRONMENT_IS_NODE) {
      var BUFSIZE = 256;
      var buf = Buffer.alloc(BUFSIZE);
      var bytesRead = 0;
      var fd = process.stdin.fd;
      try {
        bytesRead = fs.readSync(fd,
          buf)
      } catch (e) {
        if (e.toString().includes(
            "EOF")) bytesRead = 0;
        else throw e
      }
      if (bytesRead > 0) {
        result = buf.slice(0,
          bytesRead).toString(
          "utf-8")
      } else {
        result = null
      }
    } else if (typeof window !=
      "undefined" && typeof window
      .prompt == "function") {
      result = window.prompt(
        "Input: ");
      if (result !== null) {
        result += "\n"
      }
    } else if (typeof readline ==
      "function") {
      result = readline();
      if (result !== null) {
        result += "\n"
      }
    }
    if (!result) {
      return null
    }
    FS_stdin_getChar_buffer =
      intArrayFromString(result, true)
  }
  return FS_stdin_getChar_buffer
    .shift()
};
var TTY = {
  ttys: []
  , init() {}
  , shutdown() {}
  , register(dev, ops) {
    TTY.ttys[dev] = {
      input: []
      , output: []
      , ops: ops
    };
    FS.registerDevice(dev, TTY
      .stream_ops)
  }
  , stream_ops: {
    open(stream) {
      var tty = TTY.ttys[stream.node
        .rdev];
      if (!tty) {
        throw new FS.ErrnoError(43)
      }
      stream.tty = tty;
      stream.seekable = false
    }
    , close(stream) {
      stream.tty.ops.fsync(stream.tty)
    }
    , fsync(stream) {
      stream.tty.ops.fsync(stream.tty)
    }
    , read(stream, buffer, offset,
      length, pos) {
      if (!stream.tty || !stream.tty
        .ops.get_char) {
        throw new FS.ErrnoError(60)
      }
      var bytesRead = 0;
      for (var i = 0; i <
        length; i++) {
        var result;
        try {
          result = stream.tty.ops
            .get_char(stream.tty)
        } catch (e) {
          throw new FS.ErrnoError(29)
        }
        if (result === undefined &&
          bytesRead === 0) {
          throw new FS.ErrnoError(6)
        }
        if (result === null ||
          result === undefined) break;
        bytesRead++;
        buffer[offset + i] = result
      }
      if (bytesRead) {
        stream.node.timestamp = Date
          .now()
      }
      return bytesRead
    }
    , write(stream, buffer, offset,
      length, pos) {
      if (!stream.tty || !stream.tty
        .ops.put_char) {
        throw new FS.ErrnoError(60)
      }
      try {
        for (var i = 0; i <
          length; i++) {
          stream.tty.ops.put_char(
            stream.tty, buffer[
              offset + i])
        }
      } catch (e) {
        throw new FS.ErrnoError(29)
      }
      if (length) {
        stream.node.timestamp = Date
          .now()
      }
      return i
    }
  }
  , default_tty_ops: {
    get_char(tty) {
      return FS_stdin_getChar()
    }
    , put_char(tty, val) {
      if (val === null || val ===
        10) {
        out(UTF8ArrayToString(tty
          .output, 0));
        tty.output = []
      } else {
        if (val != 0) tty.output.push(
          val)
      }
    }
    , fsync(tty) {
      if (tty.output && tty.output
        .length > 0) {
        out(UTF8ArrayToString(tty
          .output, 0));
        tty.output = []
      }
    }
    , ioctl_tcgets(tty) {
      return {
        c_iflag: 25856
        , c_oflag: 5
        , c_cflag: 191
        , c_lflag: 35387
        , c_cc: [3, 28, 127, 21, 4, 0,
          1, 0, 17, 19, 26, 0, 18,
          15, 23, 22, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0
        ]
      }
    }
    , ioctl_tcsets(tty,
      optional_actions, data) {
      return 0
    }
    , ioctl_tiocgwinsz(tty) {
      return [24, 80]
    }
  }
  , default_tty1_ops: {
    put_char(tty, val) {
      if (val === null || val ===
        10) {
        err(UTF8ArrayToString(tty
          .output, 0));
        tty.output = []
      } else {
        if (val != 0) tty.output.push(
          val)
      }
    }
    , fsync(tty) {
      if (tty.output && tty.output
        .length > 0) {
        err(UTF8ArrayToString(tty
          .output, 0));
        tty.output = []
      }
    }
  }
};
var mmapAlloc = size => {
  abort()
};
var MEMFS = {
  ops_table: null
  , mount(mount) {
    return MEMFS.createNode(null, "/",
      16384 | 511, 0)
  }
  , createNode(parent, name, mode,
    dev) {
    if (FS.isBlkdev(mode) || FS
      .isFIFO(mode)) {
      throw new FS.ErrnoError(63)
    }
    MEMFS.ops_table ||= {
      dir: {
        node: {
          getattr: MEMFS.node_ops
            .getattr
          , setattr: MEMFS.node_ops
            .setattr
          , lookup: MEMFS.node_ops
            .lookup
          , mknod: MEMFS.node_ops
            .mknod
          , rename: MEMFS.node_ops
            .rename
          , unlink: MEMFS.node_ops
            .unlink
          , rmdir: MEMFS.node_ops
            .rmdir
          , readdir: MEMFS.node_ops
            .readdir
          , symlink: MEMFS.node_ops
            .symlink
        }
        , stream: {
          llseek: MEMFS.stream_ops
            .llseek
        }
      }
      , file: {
        node: {
          getattr: MEMFS.node_ops
            .getattr
          , setattr: MEMFS.node_ops
            .setattr
        }
        , stream: {
          llseek: MEMFS.stream_ops
            .llseek
          , read: MEMFS.stream_ops
            .read
          , write: MEMFS.stream_ops
            .write
          , allocate: MEMFS
            .stream_ops.allocate
          , mmap: MEMFS.stream_ops
            .mmap
          , msync: MEMFS.stream_ops
            .msync
        }
      }
      , link: {
        node: {
          getattr: MEMFS.node_ops
            .getattr
          , setattr: MEMFS.node_ops
            .setattr
          , readlink: MEMFS.node_ops
            .readlink
        }
        , stream: {}
      }
      , chrdev: {
        node: {
          getattr: MEMFS.node_ops
            .getattr
          , setattr: MEMFS.node_ops
            .setattr
        }
        , stream: FS
          .chrdev_stream_ops
      }
    };
    var node = FS.createNode(parent,
      name, mode, dev);
    if (FS.isDir(node.mode)) {
      node.node_ops = MEMFS.ops_table
        .dir.node;
      node.stream_ops = MEMFS
        .ops_table.dir.stream;
      node.contents = {}
    } else if (FS.isFile(node.mode)) {
      node.node_ops = MEMFS.ops_table
        .file.node;
      node.stream_ops = MEMFS
        .ops_table.file.stream;
      node.usedBytes = 0;
      node.contents = null
    } else if (FS.isLink(node.mode)) {
      node.node_ops = MEMFS.ops_table
        .link.node;
      node.stream_ops = MEMFS
        .ops_table.link.stream
    } else if (FS.isChrdev(node
      .mode)) {
      node.node_ops = MEMFS.ops_table
        .chrdev.node;
      node.stream_ops = MEMFS
        .ops_table.chrdev.stream
    }
    node.timestamp = Date.now();
    if (parent) {
      parent.contents[name] = node;
      parent.timestamp = node
        .timestamp
    }
    return node
  }
  , getFileDataAsTypedArray(node) {
    if (!node.contents)
    return new Uint8Array(0);
    if (node.contents.subarray)
    return node.contents.subarray(0,
        node.usedBytes);
    return new Uint8Array(node
      .contents)
  }
  , expandFileStorage(node,
    newCapacity) {
    var prevCapacity = node.contents ?
      node.contents.length : 0;
    if (prevCapacity >= newCapacity)
      return;
    var CAPACITY_DOUBLING_MAX = 1024 *
      1024;
    newCapacity = Math.max(
      newCapacity, prevCapacity * (
        prevCapacity <
        CAPACITY_DOUBLING_MAX ? 2 :
        1.125) >>> 0);
    if (prevCapacity != 0)
      newCapacity = Math.max(
        newCapacity, 256);
    var oldContents = node.contents;
    node.contents = new Uint8Array(
      newCapacity);
    if (node.usedBytes > 0) node
      .contents.set(oldContents
        .subarray(0, node.usedBytes),
        0)
  }
  , resizeFileStorage(node, newSize) {
    if (node.usedBytes == newSize)
      return;
    if (newSize == 0) {
      node.contents = null;
      node.usedBytes = 0
    } else {
      var oldContents = node.contents;
      node.contents = new Uint8Array(
        newSize);
      if (oldContents) {
        node.contents.set(oldContents
          .subarray(0, Math.min(
            newSize, node
            .usedBytes)))
      }
      node.usedBytes = newSize
    }
  }
  , node_ops: {
    getattr(node) {
      var attr = {};
      attr.dev = FS.isChrdev(node
        .mode) ? node.id : 1;
      attr.ino = node.id;
      attr.mode = node.mode;
      attr.nlink = 1;
      attr.uid = 0;
      attr.gid = 0;
      attr.rdev = node.rdev;
      if (FS.isDir(node.mode)) {
        attr.size = 4096
      } else if (FS.isFile(node
        .mode)) {
        attr.size = node.usedBytes
      } else if (FS.isLink(node
        .mode)) {
        attr.size = node.link.length
      } else {
        attr.size = 0
      }
      attr.atime = new Date(node
        .timestamp);
      attr.mtime = new Date(node
        .timestamp);
      attr.ctime = new Date(node
        .timestamp);
      attr.blksize = 4096;
      attr.blocks = Math.ceil(attr
        .size / attr.blksize);
      return attr
    }
    , setattr(node, attr) {
      if (attr.mode !== undefined) {
        node.mode = attr.mode
      }
      if (attr.timestamp !==
        undefined) {
        node.timestamp = attr
          .timestamp
      }
      if (attr.size !== undefined) {
        MEMFS.resizeFileStorage(node,
          attr.size)
      }
    }
    , lookup(parent, name) {
      throw FS.genericErrors[44]
    }
    , mknod(parent, name, mode, dev) {
      return MEMFS.createNode(parent,
        name, mode, dev)
    }
    , rename(old_node, new_dir,
      new_name) {
      if (FS.isDir(old_node.mode)) {
        var new_node;
        try {
          new_node = FS.lookupNode(
            new_dir, new_name)
        } catch (e) {}
        if (new_node) {
          for (var i in new_node
              .contents) {
            throw new FS.ErrnoError(
              55)
          }
        }
      }
      delete old_node.parent.contents[
        old_node.name];
      old_node.parent.timestamp = Date
        .now();
      old_node.name = new_name;
      new_dir.contents[new_name] =
        old_node;
      new_dir.timestamp = old_node
        .parent.timestamp;
      old_node.parent = new_dir
    }
    , unlink(parent, name) {
      delete parent.contents[name];
      parent.timestamp = Date.now()
    }
    , rmdir(parent, name) {
      var node = FS.lookupNode(parent,
        name);
      for (var i in node.contents) {
        throw new FS.ErrnoError(55)
      }
      delete parent.contents[name];
      parent.timestamp = Date.now()
    }
    , readdir(node) {
      var entries = [".", ".."];
      for (var key of Object.keys(node
          .contents)) {
        entries.push(key)
      }
      return entries
    }
    , symlink(parent, newname,
      oldpath) {
      var node = MEMFS.createNode(
        parent, newname, 511 |
        40960, 0);
      node.link = oldpath;
      return node
    }
    , readlink(node) {
      if (!FS.isLink(node.mode)) {
        throw new FS.ErrnoError(28)
      }
      return node.link
    }
  }
  , stream_ops: {
    read(stream, buffer, offset,
      length, position) {
      var contents = stream.node
        .contents;
      if (position >= stream.node
        .usedBytes) return 0;
      var size = Math.min(stream.node
        .usedBytes - position,
        length);
      if (size > 8 && contents
        .subarray) {
        buffer.set(contents.subarray(
          position, position +
          size), offset)
      } else {
        for (var i = 0; i < size; i++)
          buffer[offset + i] =
          contents[position + i]
      }
      return size
    }
    , write(stream, buffer, offset,
      length, position, canOwn) {
      if (buffer.buffer === HEAP8
        .buffer) {
        canOwn = false
      }
      if (!length) return 0;
      var node = stream.node;
      node.timestamp = Date.now();
      if (buffer.subarray && (!node
          .contents || node.contents
          .subarray)) {
        if (canOwn) {
          node.contents = buffer
            .subarray(offset, offset +
              length);
          node.usedBytes = length;
          return length
        } else if (node.usedBytes ===
          0 && position === 0) {
          node.contents = buffer
            .slice(offset, offset +
              length);
          node.usedBytes = length;
          return length
        } else if (position +
          length <= node.usedBytes) {
          node.contents.set(buffer
            .subarray(offset,
              offset + length),
            position);
          return length
        }
      }
      MEMFS.expandFileStorage(node,
        position + length);
      if (node.contents.subarray &&
        buffer.subarray) {
        node.contents.set(buffer
          .subarray(offset, offset +
            length), position)
      } else {
        for (var i = 0; i <
          length; i++) {
          node.contents[position +
            i] = buffer[offset + i]
        }
      }
      node.usedBytes = Math.max(node
        .usedBytes, position +
        length);
      return length
    }
    , llseek(stream, offset, whence) {
      var position = offset;
      if (whence === 1) {
        position += stream.position
      } else if (whence === 2) {
        if (FS.isFile(stream.node
            .mode)) {
          position += stream.node
            .usedBytes
        }
      }
      if (position < 0) {
        throw new FS.ErrnoError(28)
      }
      return position
    }
    , allocate(stream, offset,
    length) {
      MEMFS.expandFileStorage(stream
        .node, offset + length);
      stream.node.usedBytes = Math
        .max(stream.node.usedBytes,
          offset + length)
    }
    , mmap(stream, length, position,
      prot, flags) {
      if (!FS.isFile(stream.node
        .mode)) {
        throw new FS.ErrnoError(43)
      }
      var ptr;
      var allocated;
      var contents = stream.node
        .contents;
      if (!(flags & 2) && contents
        .buffer === HEAP8.buffer) {
        allocated = false;
        ptr = contents.byteOffset
      } else {
        if (position > 0 || position +
          length < contents.length) {
          if (contents.subarray) {
            contents = contents
              .subarray(position,
                position + length)
          } else {
            contents = Array.prototype
              .slice.call(contents,
                position, position +
                length)
          }
        }
        allocated = true;
        ptr = mmapAlloc(length);
        if (!ptr) {
          throw new FS.ErrnoError(48)
        }
        HEAP8.set(contents, ptr)
      }
      return {
        ptr: ptr
        , allocated: allocated
      }
    }
    , msync(stream, buffer, offset,
      length, mmapFlags) {
      MEMFS.stream_ops.write(stream,
        buffer, 0, length, offset,
        false);
      return 0
    }
  }
};
var asyncLoad = (url, onload, onerror,
  noRunDep) => {
  var dep = !noRunDep ?
    getUniqueRunDependency(
      `al ${url}`) : "";
  readAsync(url, arrayBuffer => {
    onload(new Uint8Array(
      arrayBuffer));
    if (dep) removeRunDependency(
      dep)
  }, event => {
    if (onerror) {
      onerror()
    } else {
      throw `Loading data file "${url}" failed.`
    }
  });
  if (dep) addRunDependency(dep)
};
var FS_createDataFile = (parent, name,
    fileData, canRead, canWrite, canOwn
    ) => {
    FS.createDataFile(parent, name,
      fileData, canRead, canWrite,
      canOwn)
  };
var preloadPlugins = Module[
  "preloadPlugins"] || [];
var FS_handledByPreloadPlugin = (
  byteArray, fullname, finish, onerror
  ) => {
  if (typeof Browser != "undefined")
    Browser.init();
  var handled = false;
  preloadPlugins.forEach(plugin => {
    if (handled) return;
    if (plugin["canHandle"](
        fullname)) {
      plugin["handle"](byteArray,
        fullname, finish,
        onerror);
      handled = true
    }
  });
  return handled
};
var FS_createPreloadedFile = (parent,
  name, url, canRead, canWrite,
  onload, onerror, dontCreateFile,
  canOwn, preFinish) => {
  var fullname = name ? PATH_FS
    .resolve(PATH.join2(parent,
    name)) : parent;
  var dep = getUniqueRunDependency(
    `cp ${fullname}`);

  function processData(byteArray) {
    function finish(byteArray) {
      preFinish?.();
      if (!dontCreateFile) {
        FS_createDataFile(parent,
          name, byteArray, canRead,
          canWrite, canOwn)
      }
      onload?.();
      removeRunDependency(dep)
    }
    if (FS_handledByPreloadPlugin(
        byteArray, fullname, finish,
        () => {
          onerror?.();
          removeRunDependency(dep)
        })) {
      return
    }
    finish(byteArray)
  }
  addRunDependency(dep);
  if (typeof url == "string") {
    asyncLoad(url, processData,
      onerror)
  } else {
    processData(url)
  }
};
var FS_modeStringToFlags = str => {
  var flagModes = {
    "r": 0
    , "r+": 2
    , "w": 512 | 64 | 1
    , "w+": 512 | 64 | 2
    , "a": 1024 | 64 | 1
    , "a+": 1024 | 64 | 2
  };
  var flags = flagModes[str];
  if (typeof flags == "undefined") {
    throw new Error(
      `Unknown file open mode: ${str}`
      )
  }
  return flags
};
var FS_getMode = (canRead,
canWrite) => {
  var mode = 0;
  if (canRead) mode |= 292 | 73;
  if (canWrite) mode |= 146;
  return mode
};
var IDBFS = {
  dbs: {}
  , indexedDB: () => {
    if (typeof indexedDB !=
      "undefined") return indexedDB;
    var ret = null;
    if (typeof window == "object")
      ret = window.indexedDB ||
      window.mozIndexedDB || window
      .webkitIndexedDB || window
      .msIndexedDB;
    assert(ret,
      "IDBFS used, but indexedDB not supported"
      );
    return ret
  }
  , DB_VERSION: 21
  , DB_STORE_NAME: "FILE_DATA"
  , mount: (...args) => MEMFS.mount(
    ...args)
  , syncfs: (mount, populate,
    callback) => {
    IDBFS.getLocalSet(mount, (err,
      local) => {
      if (err) return callback(
        err);
      IDBFS.getRemoteSet(mount,
        (err, remote) => {
          if (err)
          return callback(
              err);
          var src = populate ?
            remote : local;
          var dst = populate ?
            local : remote;
          IDBFS.reconcile(src,
            dst, callback)
        })
    })
  }
  , quit: () => {
    Object.values(IDBFS.dbs)
      .forEach(value => value
      .close());
    IDBFS.dbs = {}
  }
  , getDB: (name, callback) => {
    var db = IDBFS.dbs[name];
    if (db) {
      return callback(null, db)
    }
    var req;
    try {
      req = IDBFS.indexedDB().open(
        name, IDBFS.DB_VERSION)
    } catch (e) {
      return callback(e)
    }
    if (!req) {
      return callback(
        "Unable to connect to IndexedDB"
        )
    }
    req.onupgradeneeded = e => {
      var db = e.target.result;
      var transaction = e.target
        .transaction;
      var fileStore;
      if (db.objectStoreNames
        .contains(IDBFS
          .DB_STORE_NAME)) {
        fileStore = transaction
          .objectStore(IDBFS
            .DB_STORE_NAME)
      } else {
        fileStore = db
          .createObjectStore(IDBFS
            .DB_STORE_NAME)
      }
      if (!fileStore.indexNames
        .contains("timestamp")) {
        fileStore.createIndex(
          "timestamp",
          "timestamp", {
            unique: false
          })
      }
    };
    req.onsuccess = () => {
      db = req.result;
      IDBFS.dbs[name] = db;
      callback(null, db)
    };
    req.onerror = e => {
      callback(e.target.error);
      e.preventDefault()
    }
  }
  , getLocalSet: (mount,
  callback) => {
    var entries = {};

    function isRealDir(p) {
      return p !== "." && p !== ".."
    }

    function toAbsolute(root) {
      return p => PATH.join2(root,
        p)
    }
    var check = FS.readdir(mount
      .mountpoint).filter(
      isRealDir).map(toAbsolute(
      mount.mountpoint));
    while (check.length) {
      var path = check.pop();
      var stat;
      try {
        stat = FS.stat(path)
      } catch (e) {
        return callback(e)
      }
      if (FS.isDir(stat.mode)) {
        check.push(...FS.readdir(
          path).filter(
          isRealDir).map(
          toAbsolute(path)))
      }
      entries[path] = {
        "timestamp": stat.mtime
      }
    }
    return callback(null, {
      type: "local"
      , entries: entries
    })
  }
  , getRemoteSet: (mount,
  callback) => {
    var entries = {};
    IDBFS.getDB(mount.mountpoint, (
      err, db) => {
      if (err) return callback(
        err);
      try {
        var transaction = db
          .transaction([IDBFS
            .DB_STORE_NAME
          ], "readonly");
        transaction.onerror =
          e => {
            callback(e.target
              .error);
            e.preventDefault()
          };
        var store = transaction
          .objectStore(IDBFS
            .DB_STORE_NAME);
        var index = store.index(
          "timestamp");
        index.openKeyCursor()
          .onsuccess =
          event => {
            var cursor = event
              .target.result;
            if (!cursor) {
              return callback(
                null, {
                  type: "remote"
                  , db: db
                  , entries: entries
                })
            }
            entries[cursor
              .primaryKey] = {
              "timestamp": cursor
                .key
            };
            cursor.continue()
          }
      } catch (e) {
        return callback(e)
      }
    })
  }
  , loadLocalEntry: (path,
    callback) => {
      var stat, node;
      try {
        var lookup = FS.lookupPath(
          path);
        node = lookup.node;
        stat = FS.stat(path)
      } catch (e) {
        return callback(e)
      }
      if (FS.isDir(stat.mode)) {
        return callback(null, {
          "timestamp": stat.mtime
          , "mode": stat.mode
        })
      } else if (FS.isFile(stat
        .mode)) {
        node.contents = MEMFS
          .getFileDataAsTypedArray(
            node);
        return callback(null, {
          "timestamp": stat.mtime
          , "mode": stat.mode
          , "contents": node
            .contents
        })
      } else {
        return callback(new Error(
          "node type not supported"
          ))
      }
    }
  , storeLocalEntry: (path, entry,
    callback) => {
    try {
      if (FS.isDir(entry["mode"])) {
        FS.mkdirTree(path, entry[
          "mode"])
      } else if (FS.isFile(entry[
          "mode"])) {
        FS.writeFile(path, entry[
          "contents"], {
          canOwn: true
        })
      } else {
        return callback(new Error(
          "node type not supported"
          ))
      }
      FS.chmod(path, entry["mode"]);
      FS.utime(path, entry[
        "timestamp"], entry[
        "timestamp"])
    } catch (e) {
      return callback(e)
    }
    callback(null)
  }
  , removeLocalEntry: (path,
    callback) => {
      try {
        var stat = FS.stat(path);
        if (FS.isDir(stat.mode)) {
          FS.rmdir(path)
        } else if (FS.isFile(stat
            .mode)) {
          FS.unlink(path)
        }
      } catch (e) {
        return callback(e)
      }
      callback(null)
    }
  , loadRemoteEntry: (store, path,
    callback) => {
    var req = store.get(path);
    req.onsuccess = event =>
      callback(null, event.target
        .result);
    req.onerror = e => {
      callback(e.target.error);
      e.preventDefault()
    }
  }
  , storeRemoteEntry: (store, path,
    entry, callback) => {
    try {
      var req = store.put(entry,
        path)
    } catch (e) {
      callback(e);
      return
    }
    req.onsuccess = event =>
      callback();
    req.onerror = e => {
      callback(e.target.error);
      e.preventDefault()
    }
  }
  , removeRemoteEntry: (store, path,
    callback) => {
    var req = store.delete(path);
    req.onsuccess = event =>
      callback();
    req.onerror = e => {
      callback(e.target.error);
      e.preventDefault()
    }
  }
  , reconcile: (src, dst,
  callback) => {
    var total = 0;
    var create = [];
    Object.keys(src.entries)
      .forEach(function(key) {
        var e = src.entries[key];
        var e2 = dst.entries[key];
        if (!e2 || e["timestamp"]
          .getTime() != e2[
            "timestamp"].getTime()
          ) {
          create.push(key);
          total++
        }
      });
    var remove = [];
    Object.keys(dst.entries)
      .forEach(function(key) {
        if (!src.entries[key]) {
          remove.push(key);
          total++
        }
      });
    if (!total) {
      return callback(null)
    }
    var errored = false;
    var db = src.type === "remote" ?
      src.db : dst.db;
    var transaction = db
      .transaction([IDBFS
        .DB_STORE_NAME
      ], "readwrite");
    var store = transaction
      .objectStore(IDBFS
        .DB_STORE_NAME);

    function done(err) {
      if (err && !errored) {
        errored = true;
        return callback(err)
      }
    }
    transaction.onerror =
      transaction.onabort = e => {
        done(e.target.error);
        e.preventDefault()
      };
    transaction.oncomplete = e => {
      if (!errored) {
        callback(null)
      }
    };
    create.sort().forEach(path => {
      if (dst.type ===
        "local") {
        IDBFS.loadRemoteEntry(
          store, path, (err,
            entry) => {
            if (err)
            return done(err);
            IDBFS
              .storeLocalEntry(
                path, entry,
                done)
          })
      } else {
        IDBFS.loadLocalEntry(
          path, (err,
          entry) => {
            if (err)
            return done(err);
            IDBFS
              .storeRemoteEntry(
                store, path,
                entry, done)
          })
      }
    });
    remove.sort().reverse().forEach(
      path => {
        if (dst.type ===
          "local") {
          IDBFS.removeLocalEntry(
            path, done)
        } else {
          IDBFS.removeRemoteEntry(
            store, path, done)
        }
      })
  }
};
var FS = {
  root: null
  , mounts: []
  , devices: {}
  , streams: []
  , nextInode: 1
  , nameTable: null
  , currentPath: "/"
  , initialized: false
  , ignorePermissions: true
  , ErrnoError: class {
    constructor(errno) {
      this.name = "ErrnoError";
      this.errno = errno
    }
  }
  , genericErrors: {}
  , filesystems: null
  , syncFSRequests: 0
  , lookupPath(path, opts = {}) {
    path = PATH_FS.resolve(path);
    if (!path) return {
      path: ""
      , node: null
    };
    var defaults = {
      follow_mount: true
      , recurse_count: 0
    };
    opts = Object.assign(defaults,
      opts);
    if (opts.recurse_count > 8) {
      throw new FS.ErrnoError(32)
    }
    var parts = path.split("/")
      .filter(p => !!p);
    var current = FS.root;
    var current_path = "/";
    for (var i = 0; i < parts
      .length; i++) {
      var islast = i === parts
        .length - 1;
      if (islast && opts.parent) {
        break
      }
      current = FS.lookupNode(current,
        parts[i]);
      current_path = PATH.join2(
        current_path, parts[i]);
      if (FS.isMountpoint(current)) {
        if (!islast || islast && opts
          .follow_mount) {
          current = current.mounted
            .root
        }
      }
      if (!islast || opts.follow) {
        var count = 0;
        while (FS.isLink(current
          .mode)) {
          var link = FS.readlink(
            current_path);
          current_path = PATH_FS
            .resolve(PATH.dirname(
              current_path), link);
          var lookup = FS.lookupPath(
            current_path, {
              recurse_count: opts
                .recurse_count + 1
            });
          current = lookup.node;
          if (count++ > 40) {
            throw new FS.ErrnoError(
              32)
          }
        }
      }
    }
    return {
      path: current_path
      , node: current
    }
  }
  , getPath(node) {
    var path;
    while (true) {
      if (FS.isRoot(node)) {
        var mount = node.mount
          .mountpoint;
        if (!path) return mount;
        return mount[mount.length -
          1] !== "/" ?
          `${mount}/${path}` : mount +
          path
      }
      path = path ?
        `${node.name}/${path}` : node
        .name;
      node = node.parent
    }
  }
  , hashName(parentid, name) {
    var hash = 0;
    for (var i = 0; i < name
      .length; i++) {
      hash = (hash << 5) - hash + name
        .charCodeAt(i) | 0
    }
    return (parentid + hash >>> 0) %
      FS.nameTable.length
  }
  , hashAddNode(node) {
    var hash = FS.hashName(node.parent
      .id, node.name);
    node.name_next = FS.nameTable[
      hash];
    FS.nameTable[hash] = node
  }
  , hashRemoveNode(node) {
    var hash = FS.hashName(node.parent
      .id, node.name);
    if (FS.nameTable[hash] === node) {
      FS.nameTable[hash] = node
        .name_next
    } else {
      var current = FS.nameTable[
      hash];
      while (current) {
        if (current.name_next ===
          node) {
          current.name_next = node
            .name_next;
          break
        }
        current = current.name_next
      }
    }
  }
  , lookupNode(parent, name) {
    var errCode = FS.mayLookup(
    parent);
    if (errCode) {
      throw new FS.ErrnoError(errCode)
    }
    var hash = FS.hashName(parent.id,
      name);
    for (var node = FS.nameTable[
      hash]; node; node = node
      .name_next) {
      var nodeName = node.name;
      if (node.parent.id === parent
        .id && nodeName === name) {
        return node
      }
    }
    return FS.lookup(parent, name)
  }
  , createNode(parent, name, mode,
    rdev) {
    var node = new FS.FSNode(parent,
      name, mode, rdev);
    FS.hashAddNode(node);
    return node
  }
  , destroyNode(node) {
    FS.hashRemoveNode(node)
  }
  , isRoot(node) {
    return node === node.parent
  }
  , isMountpoint(node) {
    return !!node.mounted
  }
  , isFile(mode) {
    return (mode & 61440) === 32768
  }
  , isDir(mode) {
    return (mode & 61440) === 16384
  }
  , isLink(mode) {
    return (mode & 61440) === 40960
  }
  , isChrdev(mode) {
    return (mode & 61440) === 8192
  }
  , isBlkdev(mode) {
    return (mode & 61440) === 24576
  }
  , isFIFO(mode) {
    return (mode & 61440) === 4096
  }
  , isSocket(mode) {
    return (mode & 49152) === 49152
  }
  , flagsToPermissionString(flag) {
    var perms = ["r", "w", "rw"][
      flag & 3
    ];
    if (flag & 512) {
      perms += "w"
    }
    return perms
  }
  , nodePermissions(node, perms) {
    if (FS.ignorePermissions) {
      return 0
    }
    if (perms.includes("r") && !(node
        .mode & 292)) {
      return 2
    } else if (perms.includes("w") &&
      !(node.mode & 146)) {
      return 2
    } else if (perms.includes("x") &&
      !(node.mode & 73)) {
      return 2
    }
    return 0
  }
  , mayLookup(dir) {
    if (!FS.isDir(dir.mode))
  return 54;
    var errCode = FS.nodePermissions(
      dir, "x");
    if (errCode) return errCode;
    if (!dir.node_ops.lookup)
  return 2;
    return 0
  }
  , mayCreate(dir, name) {
    try {
      var node = FS.lookupNode(dir,
        name);
      return 20
    } catch (e) {}
    return FS.nodePermissions(dir,
      "wx")
  }
  , mayDelete(dir, name, isdir) {
    var node;
    try {
      node = FS.lookupNode(dir, name)
    } catch (e) {
      return e.errno
    }
    var errCode = FS.nodePermissions(
      dir, "wx");
    if (errCode) {
      return errCode
    }
    if (isdir) {
      if (!FS.isDir(node.mode)) {
        return 54
      }
      if (FS.isRoot(node) || FS
        .getPath(node) === FS.cwd()) {
        return 10
      }
    } else {
      if (FS.isDir(node.mode)) {
        return 31
      }
    }
    return 0
  }
  , mayOpen(node, flags) {
    if (!node) {
      return 44
    }
    if (FS.isLink(node.mode)) {
      return 32
    } else if (FS.isDir(node.mode)) {
      if (FS.flagsToPermissionString(
          flags) !== "r" || flags &
        512) {
        return 31
      }
    }
    return FS.nodePermissions(node, FS
      .flagsToPermissionString(
        flags))
  }
  , MAX_OPEN_FDS: 4096
  , nextfd() {
    for (var fd = 0; fd <= FS
      .MAX_OPEN_FDS; fd++) {
      if (!FS.streams[fd]) {
        return fd
      }
    }
    throw new FS.ErrnoError(33)
  }
  , getStreamChecked(fd) {
    var stream = FS.getStream(fd);
    if (!stream) {
      throw new FS.ErrnoError(8)
    }
    return stream
  }
  , getStream: fd => FS.streams[fd]
  , createStream(stream, fd = -1) {
    if (!FS.FSStream) {
      FS.FSStream = function() {
        this.shared = {}
      };
      FS.FSStream.prototype = {};
      Object.defineProperties(FS
        .FSStream.prototype, {
          object: {
            get() {
              return this.node
            }
            , set(val) {
              this.node = val
            }
          }
          , isRead: {
            get() {
              return (this.flags &
                2097155) !== 1
            }
          }
          , isWrite: {
            get() {
              return (this.flags &
                2097155) !== 0
            }
          }
          , isAppend: {
            get() {
              return this.flags &
                1024
            }
          }
          , flags: {
            get() {
              return this.shared
                .flags
            }
            , set(val) {
              this.shared.flags =
                val
            }
          }
          , position: {
            get() {
              return this.shared
                .position
            }
            , set(val) {
              this.shared
                .position = val
            }
          }
        })
    }
    stream = Object.assign(new FS
      .FSStream, stream);
    if (fd == -1) {
      fd = FS.nextfd()
    }
    stream.fd = fd;
    FS.streams[fd] = stream;
    return stream
  }
  , closeStream(fd) {
    FS.streams[fd] = null
  }
  , chrdev_stream_ops: {
    open(stream) {
      var device = FS.getDevice(stream
        .node.rdev);
      stream.stream_ops = device
        .stream_ops;
      stream.stream_ops.open?.(stream)
    }
    , llseek() {
      throw new FS.ErrnoError(70)
    }
  }
  , major: dev => dev >> 8
  , minor: dev => dev & 255
  , makedev: (ma, mi) => ma << 8 | mi
  , registerDevice(dev, ops) {
    FS.devices[dev] = {
      stream_ops: ops
    }
  }
  , getDevice: dev => FS.devices[dev]
  , getMounts(mount) {
    var mounts = [];
    var check = [mount];
    while (check.length) {
      var m = check.pop();
      mounts.push(m);
      check.push(...m.mounts)
    }
    return mounts
  }
  , syncfs(populate, callback) {
    if (typeof populate ==
      "function") {
      callback = populate;
      populate = false
    }
    FS.syncFSRequests++;
    if (FS.syncFSRequests > 1) {
      err(
        `warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`)
    }
    var mounts = FS.getMounts(FS.root
      .mount);
    var completed = 0;

    function doCallback(errCode) {
      FS.syncFSRequests--;
      return callback(errCode)
    }

    function done(errCode) {
      if (errCode) {
        if (!done.errored) {
          done.errored = true;
          return doCallback(errCode)
        }
        return
      }
      if (++completed >= mounts
        .length) {
        doCallback(null)
      }
    }
    mounts.forEach(mount => {
      if (!mount.type.syncfs) {
        return done(null)
      }
      mount.type.syncfs(mount,
        populate, done)
    })
  }
  , mount(type, opts, mountpoint) {
    var root = mountpoint === "/";
    var pseudo = !mountpoint;
    var node;
    if (root && FS.root) {
      throw new FS.ErrnoError(10)
    } else if (!root && !pseudo) {
      var lookup = FS.lookupPath(
        mountpoint, {
          follow_mount: false
        });
      mountpoint = lookup.path;
      node = lookup.node;
      if (FS.isMountpoint(node)) {
        throw new FS.ErrnoError(10)
      }
      if (!FS.isDir(node.mode)) {
        throw new FS.ErrnoError(54)
      }
    }
    var mount = {
      type: type
      , opts: opts
      , mountpoint: mountpoint
      , mounts: []
    };
    var mountRoot = type.mount(mount);
    mountRoot.mount = mount;
    mount.root = mountRoot;
    if (root) {
      FS.root = mountRoot
    } else if (node) {
      node.mounted = mount;
      if (node.mount) {
        node.mount.mounts.push(mount)
      }
    }
    return mountRoot
  }
  , unmount(mountpoint) {
    var lookup = FS.lookupPath(
      mountpoint, {
        follow_mount: false
      });
    if (!FS.isMountpoint(lookup
      .node)) {
      throw new FS.ErrnoError(28)
    }
    var node = lookup.node;
    var mount = node.mounted;
    var mounts = FS.getMounts(mount);
    Object.keys(FS.nameTable).forEach(
      hash => {
        var current = FS.nameTable[
          hash];
        while (current) {
          var next = current
            .name_next;
          if (mounts.includes(
              current.mount)) {
            FS.destroyNode(current)
          }
          current = next
        }
      });
    node.mounted = null;
    var idx = node.mount.mounts
      .indexOf(mount);
    node.mount.mounts.splice(idx, 1)
  }
  , lookup(parent, name) {
    return parent.node_ops.lookup(
      parent, name)
  }
  , mknod(path, mode, dev) {
    var lookup = FS.lookupPath(path, {
      parent: true
    });
    var parent = lookup.node;
    var name = PATH.basename(path);
    if (!name || name === "." ||
      name === "..") {
      throw new FS.ErrnoError(28)
    }
    var errCode = FS.mayCreate(parent,
      name);
    if (errCode) {
      throw new FS.ErrnoError(errCode)
    }
    if (!parent.node_ops.mknod) {
      throw new FS.ErrnoError(63)
    }
    return parent.node_ops.mknod(
      parent, name, mode, dev)
  }
  , create(path, mode) {
    mode = mode !== undefined ? mode :
      438;
    mode &= 4095;
    mode |= 32768;
    return FS.mknod(path, mode, 0)
  }
  , mkdir(path, mode) {
    mode = mode !== undefined ? mode :
      511;
    mode &= 511 | 512;
    mode |= 16384;
    return FS.mknod(path, mode, 0)
  }
  , mkdirTree(path, mode) {
    var dirs = path.split("/");
    var d = "";
    for (var i = 0; i < dirs
      .length; ++i) {
      if (!dirs[i]) continue;
      d += "/" + dirs[i];
      try {
        FS.mkdir(d, mode)
      } catch (e) {
        if (e.errno != 20) throw e
      }
    }
  }
  , mkdev(path, mode, dev) {
    if (typeof dev == "undefined") {
      dev = mode;
      mode = 438
    }
    mode |= 8192;
    return FS.mknod(path, mode, dev)
  }
  , symlink(oldpath, newpath) {
    if (!PATH_FS.resolve(oldpath)) {
      throw new FS.ErrnoError(44)
    }
    var lookup = FS.lookupPath(
      newpath, {
        parent: true
      });
    var parent = lookup.node;
    if (!parent) {
      throw new FS.ErrnoError(44)
    }
    var newname = PATH.basename(
      newpath);
    var errCode = FS.mayCreate(parent,
      newname);
    if (errCode) {
      throw new FS.ErrnoError(errCode)
    }
    if (!parent.node_ops.symlink) {
      throw new FS.ErrnoError(63)
    }
    return parent.node_ops.symlink(
      parent, newname, oldpath)
  }
  , rename(old_path, new_path) {
    var old_dirname = PATH.dirname(
      old_path);
    var new_dirname = PATH.dirname(
      new_path);
    var old_name = PATH.basename(
      old_path);
    var new_name = PATH.basename(
      new_path);
    var lookup, old_dir, new_dir;
    lookup = FS.lookupPath(old_path, {
      parent: true
    });
    old_dir = lookup.node;
    lookup = FS.lookupPath(new_path, {
      parent: true
    });
    new_dir = lookup.node;
    if (!old_dir || !new_dir)
    throw new FS.ErrnoError(44);
    if (old_dir.mount !== new_dir
      .mount) {
      throw new FS.ErrnoError(75)
    }
    var old_node = FS.lookupNode(
      old_dir, old_name);
    var relative = PATH_FS.relative(
      old_path, new_dirname);
    if (relative.charAt(0) !== ".") {
      throw new FS.ErrnoError(28)
    }
    relative = PATH_FS.relative(
      new_path, old_dirname);
    if (relative.charAt(0) !== ".") {
      throw new FS.ErrnoError(55)
    }
    var new_node;
    try {
      new_node = FS.lookupNode(
        new_dir, new_name)
    } catch (e) {}
    if (old_node === new_node) {
      return
    }
    var isdir = FS.isDir(old_node
      .mode);
    var errCode = FS.mayDelete(
      old_dir, old_name, isdir);
    if (errCode) {
      throw new FS.ErrnoError(errCode)
    }
    errCode = new_node ? FS.mayDelete(
        new_dir, new_name, isdir) : FS
      .mayCreate(new_dir, new_name);
    if (errCode) {
      throw new FS.ErrnoError(errCode)
    }
    if (!old_dir.node_ops.rename) {
      throw new FS.ErrnoError(63)
    }
    if (FS.isMountpoint(old_node) ||
      new_node && FS.isMountpoint(
        new_node)) {
      throw new FS.ErrnoError(10)
    }
    if (new_dir !== old_dir) {
      errCode = FS.nodePermissions(
        old_dir, "w");
      if (errCode) {
        throw new FS.ErrnoError(
          errCode)
      }
    }
    FS.hashRemoveNode(old_node);
    try {
      old_dir.node_ops.rename(
        old_node, new_dir, new_name)
    } catch (e) {
      throw e
    } finally {
      FS.hashAddNode(old_node)
    }
  }
  , rmdir(path) {
    var lookup = FS.lookupPath(path, {
      parent: true
    });
    var parent = lookup.node;
    var name = PATH.basename(path);
    var node = FS.lookupNode(parent,
      name);
    var errCode = FS.mayDelete(parent,
      name, true);
    if (errCode) {
      throw new FS.ErrnoError(errCode)
    }
    if (!parent.node_ops.rmdir) {
      throw new FS.ErrnoError(63)
    }
    if (FS.isMountpoint(node)) {
      throw new FS.ErrnoError(10)
    }
    parent.node_ops.rmdir(parent,
      name);
    FS.destroyNode(node)
  }
  , readdir(path) {
    var lookup = FS.lookupPath(path, {
      follow: true
    });
    var node = lookup.node;
    if (!node.node_ops.readdir) {
      throw new FS.ErrnoError(54)
    }
    return node.node_ops.readdir(node)
  }
  , unlink(path) {
    var lookup = FS.lookupPath(path, {
      parent: true
    });
    var parent = lookup.node;
    if (!parent) {
      throw new FS.ErrnoError(44)
    }
    var name = PATH.basename(path);
    var node = FS.lookupNode(parent,
      name);
    var errCode = FS.mayDelete(parent,
      name, false);
    if (errCode) {
      throw new FS.ErrnoError(errCode)
    }
    if (!parent.node_ops.unlink) {
      throw new FS.ErrnoError(63)
    }
    if (FS.isMountpoint(node)) {
      throw new FS.ErrnoError(10)
    }
    parent.node_ops.unlink(parent,
      name);
    FS.destroyNode(node)
  }
  , readlink(path) {
    var lookup = FS.lookupPath(path);
    var link = lookup.node;
    if (!link) {
      throw new FS.ErrnoError(44)
    }
    if (!link.node_ops.readlink) {
      throw new FS.ErrnoError(28)
    }
    return PATH_FS.resolve(FS.getPath(
        link.parent), link.node_ops
      .readlink(link))
  }
  , stat(path, dontFollow) {
    var lookup = FS.lookupPath(path, {
      follow: !dontFollow
    });
    var node = lookup.node;
    if (!node) {
      throw new FS.ErrnoError(44)
    }
    if (!node.node_ops.getattr) {
      throw new FS.ErrnoError(63)
    }
    return node.node_ops.getattr(node)
  }
  , lstat(path) {
    return FS.stat(path, true)
  }
  , chmod(path, mode, dontFollow) {
    var node;
    if (typeof path == "string") {
      var lookup = FS.lookupPath(path,
      {
        follow: !dontFollow
      });
      node = lookup.node
    } else {
      node = path
    }
    if (!node.node_ops.setattr) {
      throw new FS.ErrnoError(63)
    }
    node.node_ops.setattr(node, {
      mode: mode & 4095 | node
        .mode & ~4095
      , timestamp: Date.now()
    })
  }
  , lchmod(path, mode) {
    FS.chmod(path, mode, true)
  }
  , fchmod(fd, mode) {
    var stream = FS.getStreamChecked(
      fd);
    FS.chmod(stream.node, mode)
  }
  , chown(path, uid, gid,
  dontFollow) {
    var node;
    if (typeof path == "string") {
      var lookup = FS.lookupPath(path,
      {
        follow: !dontFollow
      });
      node = lookup.node
    } else {
      node = path
    }
    if (!node.node_ops.setattr) {
      throw new FS.ErrnoError(63)
    }
    node.node_ops.setattr(node, {
      timestamp: Date.now()
    })
  }
  , lchown(path, uid, gid) {
    FS.chown(path, uid, gid, true)
  }
  , fchown(fd, uid, gid) {
    var stream = FS.getStreamChecked(
      fd);
    FS.chown(stream.node, uid, gid)
  }
  , truncate(path, len) {
    if (len < 0) {
      throw new FS.ErrnoError(28)
    }
    var node;
    if (typeof path == "string") {
      var lookup = FS.lookupPath(path,
      {
        follow: true
      });
      node = lookup.node
    } else {
      node = path
    }
    if (!node.node_ops.setattr) {
      throw new FS.ErrnoError(63)
    }
    if (FS.isDir(node.mode)) {
      throw new FS.ErrnoError(31)
    }
    if (!FS.isFile(node.mode)) {
      throw new FS.ErrnoError(28)
    }
    var errCode = FS.nodePermissions(
      node, "w");
    if (errCode) {
      throw new FS.ErrnoError(errCode)
    }
    node.node_ops.setattr(node, {
      size: len
      , timestamp: Date.now()
    })
  }
  , ftruncate(fd, len) {
    var stream = FS.getStreamChecked(
      fd);
    if ((stream.flags & 2097155) ===
      0) {
      throw new FS.ErrnoError(28)
    }
    FS.truncate(stream.node, len)
  }
  , utime(path, atime, mtime) {
    var lookup = FS.lookupPath(path, {
      follow: true
    });
    var node = lookup.node;
    node.node_ops.setattr(node, {
      timestamp: Math.max(atime,
        mtime)
    })
  }
  , open(path, flags, mode) {
    if (path === "") {
      throw new FS.ErrnoError(44)
    }
    flags = typeof flags == "string" ?
      FS_modeStringToFlags(flags) :
      flags;
    mode = typeof mode ==
      "undefined" ? 438 : mode;
    if (flags & 64) {
      mode = mode & 4095 | 32768
    } else {
      mode = 0
    }
    var node;
    if (typeof path == "object") {
      node = path
    } else {
      path = PATH.normalize(path);
      try {
        var lookup = FS.lookupPath(
          path, {
            follow: !(flags &
              131072)
          });
        node = lookup.node
      } catch (e) {}
    }
    var created = false;
    if (flags & 64) {
      if (node) {
        if (flags & 128) {
          throw new FS.ErrnoError(20)
        }
      } else {
        node = FS.mknod(path, mode,
        0);
        created = true
      }
    }
    if (!node) {
      throw new FS.ErrnoError(44)
    }
    if (FS.isChrdev(node.mode)) {
      flags &= ~512
    }
    if (flags & 65536 && !FS.isDir(
        node.mode)) {
      throw new FS.ErrnoError(54)
    }
    if (!created) {
      var errCode = FS.mayOpen(node,
        flags);
      if (errCode) {
        throw new FS.ErrnoError(
          errCode)
      }
    }
    if (flags & 512 && !created) {
      FS.truncate(node, 0)
    }
    flags &= ~(128 | 512 | 131072);
    var stream = FS.createStream({
      node: node
      , path: FS.getPath(node)
      , flags: flags
      , seekable: true
      , position: 0
      , stream_ops: node
        .stream_ops
      , ungotten: []
      , error: false
    });
    if (stream.stream_ops.open) {
      stream.stream_ops.open(stream)
    }
    if (Module["logReadFiles"] && !(
        flags & 1)) {
      if (!FS.readFiles) FS
        .readFiles = {};
      if (!(path in FS.readFiles)) {
        FS.readFiles[path] = 1
      }
    }
    return stream
  }
  , close(stream) {
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8)
    }
    if (stream.getdents) stream
      .getdents = null;
    try {
      if (stream.stream_ops.close) {
        stream.stream_ops.close(
          stream)
      }
    } catch (e) {
      throw e
    } finally {
      FS.closeStream(stream.fd)
    }
    stream.fd = null
  }
  , isClosed(stream) {
    return stream.fd === null
  }
  , llseek(stream, offset, whence) {
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8)
    }
    if (!stream.seekable || !stream
      .stream_ops.llseek) {
      throw new FS.ErrnoError(70)
    }
    if (whence != 0 && whence != 1 &&
      whence != 2) {
      throw new FS.ErrnoError(28)
    }
    stream.position = stream
      .stream_ops.llseek(stream,
        offset, whence);
    stream.ungotten = [];
    return stream.position
  }
  , read(stream, buffer, offset,
    length, position) {
    if (length < 0 || position < 0) {
      throw new FS.ErrnoError(28)
    }
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8)
    }
    if ((stream.flags & 2097155) ===
      1) {
      throw new FS.ErrnoError(8)
    }
    if (FS.isDir(stream.node.mode)) {
      throw new FS.ErrnoError(31)
    }
    if (!stream.stream_ops.read) {
      throw new FS.ErrnoError(28)
    }
    var seeking = typeof position !=
      "undefined";
    if (!seeking) {
      position = stream.position
    } else if (!stream.seekable) {
      throw new FS.ErrnoError(70)
    }
    var bytesRead = stream.stream_ops
      .read(stream, buffer, offset,
        length, position);
    if (!seeking) stream.position +=
      bytesRead;
    return bytesRead
  }
  , write(stream, buffer, offset,
    length, position, canOwn) {
    if (length < 0 || position < 0) {
      throw new FS.ErrnoError(28)
    }
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8)
    }
    if ((stream.flags & 2097155) ===
      0) {
      throw new FS.ErrnoError(8)
    }
    if (FS.isDir(stream.node.mode)) {
      throw new FS.ErrnoError(31)
    }
    if (!stream.stream_ops.write) {
      throw new FS.ErrnoError(28)
    }
    if (stream.seekable && stream
      .flags & 1024) {
      FS.llseek(stream, 0, 2)
    }
    var seeking = typeof position !=
      "undefined";
    if (!seeking) {
      position = stream.position
    } else if (!stream.seekable) {
      throw new FS.ErrnoError(70)
    }
    var bytesWritten = stream
      .stream_ops.write(stream,
        buffer, offset, length,
        position, canOwn);
    if (!seeking) stream.position +=
      bytesWritten;
    return bytesWritten
  }
  , allocate(stream, offset, length) {
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8)
    }
    if (offset < 0 || length <= 0) {
      throw new FS.ErrnoError(28)
    }
    if ((stream.flags & 2097155) ===
      0) {
      throw new FS.ErrnoError(8)
    }
    if (!FS.isFile(stream.node
      .mode) && !FS.isDir(stream.node
        .mode)) {
      throw new FS.ErrnoError(43)
    }
    if (!stream.stream_ops.allocate) {
      throw new FS.ErrnoError(138)
    }
    stream.stream_ops.allocate(stream,
      offset, length)
  }
  , mmap(stream, length, position,
    prot, flags) {
    if ((prot & 2) !== 0 && (flags &
        2) === 0 && (stream.flags &
        2097155) !== 2) {
      throw new FS.ErrnoError(2)
    }
    if ((stream.flags & 2097155) ===
      1) {
      throw new FS.ErrnoError(2)
    }
    if (!stream.stream_ops.mmap) {
      throw new FS.ErrnoError(43)
    }
    return stream.stream_ops.mmap(
      stream, length, position,
      prot, flags)
  }
  , msync(stream, buffer, offset,
    length, mmapFlags) {
    if (!stream.stream_ops.msync) {
      return 0
    }
    return stream.stream_ops.msync(
      stream, buffer, offset,
      length, mmapFlags)
  }
  , munmap: stream => 0
  , ioctl(stream, cmd, arg) {
    if (!stream.stream_ops.ioctl) {
      throw new FS.ErrnoError(59)
    }
    return stream.stream_ops.ioctl(
      stream, cmd, arg)
  }
  , readFile(path, opts = {}) {
    opts.flags = opts.flags || 0;
    opts.encoding = opts.encoding ||
      "binary";
    if (opts.encoding !== "utf8" &&
      opts.encoding !== "binary") {
      throw new Error(
        `Invalid encoding type "${opts.encoding}"`
        )
    }
    var ret;
    var stream = FS.open(path, opts
      .flags);
    var stat = FS.stat(path);
    var length = stat.size;
    var buf = new Uint8Array(length);
    FS.read(stream, buf, 0, length,
    0);
    if (opts.encoding === "utf8") {
      ret = UTF8ArrayToString(buf, 0)
    } else if (opts.encoding ===
      "binary") {
      ret = buf
    }
    FS.close(stream);
    return ret
  }
  , writeFile(path, data, opts = {}) {
    opts.flags = opts.flags || 577;
    var stream = FS.open(path, opts
      .flags, opts.mode);
    if (typeof data == "string") {
      var buf = new Uint8Array(
        lengthBytesUTF8(data) + 1);
      var actualNumBytes =
        stringToUTF8Array(data, buf,
          0, buf.length);
      FS.write(stream, buf, 0,
        actualNumBytes, undefined,
        opts.canOwn)
    } else if (ArrayBuffer.isView(
        data)) {
      FS.write(stream, data, 0, data
        .byteLength, undefined, opts
        .canOwn)
    } else {
      throw new Error(
        "Unsupported data type")
    }
    FS.close(stream)
  }
  , cwd: () => FS.currentPath
  , chdir(path) {
    var lookup = FS.lookupPath(path, {
      follow: true
    });
    if (lookup.node === null) {
      throw new FS.ErrnoError(44)
    }
    if (!FS.isDir(lookup.node.mode)) {
      throw new FS.ErrnoError(54)
    }
    var errCode = FS.nodePermissions(
      lookup.node, "x");
    if (errCode) {
      throw new FS.ErrnoError(errCode)
    }
    FS.currentPath = lookup.path
  }
  , createDefaultDirectories() {
    FS.mkdir("/tmp");
    FS.mkdir("/home");
    FS.mkdir("/home/web_user")
  }
  , createDefaultDevices() {
    FS.mkdir("/dev");
    FS.registerDevice(FS.makedev(1,
      3), {
        read: () => 0
        , write: (stream, buffer,
            offset, length, pos) =>
          length
      });
    FS.mkdev("/dev/null", FS.makedev(
      1, 3));
    TTY.register(FS.makedev(5, 0), TTY
      .default_tty_ops);
    TTY.register(FS.makedev(6, 0), TTY
      .default_tty1_ops);
    FS.mkdev("/dev/tty", FS.makedev(5,
      0));
    FS.mkdev("/dev/tty1", FS.makedev(
      6, 0));
    var randomBuffer = new Uint8Array(
        1024)
      , randomLeft = 0;
    var randomByte = () => {
      if (randomLeft === 0) {
        randomLeft = randomFill(
          randomBuffer).byteLength
      }
      return randomBuffer[--
        randomLeft]
    };
    FS.createDevice("/dev", "random",
      randomByte);
    FS.createDevice("/dev", "urandom",
      randomByte);
    FS.mkdir("/dev/shm");
    FS.mkdir("/dev/shm/tmp")
  }
  , createSpecialDirectories() {
    FS.mkdir("/proc");
    var proc_self = FS.mkdir(
      "/proc/self");
    FS.mkdir("/proc/self/fd");
    FS.mount({
      mount() {
        var node = FS.createNode(
          proc_self, "fd",
          16384 | 511, 73);
        node.node_ops = {
          lookup(parent, name) {
            var fd = +name;
            var stream = FS
              .getStreamChecked(
                fd);
            var ret = {
              parent: null
              , mount: {
                mountpoint: "fake"
              }
              , node_ops: {
                readlink: () =>
                  stream.path
              }
            };
            ret.parent = ret;
            return ret
          }
        };
        return node
      }
    }, {}, "/proc/self/fd")
  }
  , createStandardStreams() {
    if (Module["stdin"]) {
      FS.createDevice("/dev", "stdin",
        Module["stdin"])
    } else {
      FS.symlink("/dev/tty",
        "/dev/stdin")
    }
    if (Module["stdout"]) {
      FS.createDevice("/dev",
        "stdout", null, Module[
          "stdout"])
    } else {
      FS.symlink("/dev/tty",
        "/dev/stdout")
    }
    if (Module["stderr"]) {
      FS.createDevice("/dev",
        "stderr", null, Module[
          "stderr"])
    } else {
      FS.symlink("/dev/tty1",
        "/dev/stderr")
    }
    var stdin = FS.open("/dev/stdin",
      0);
    var stdout = FS.open(
      "/dev/stdout", 1);
    var stderr = FS.open(
      "/dev/stderr", 1)
  }
  , staticInit() {
    [44].forEach(code => {
      FS.genericErrors[code] =
        new FS.ErrnoError(code);
      FS.genericErrors[code]
        .stack =
        "<generic error, no stack>"
    });
    FS.nameTable = new Array(4096);
    FS.mount(MEMFS, {}, "/");
    FS.createDefaultDirectories();
    FS.createDefaultDevices();
    FS.createSpecialDirectories();
    FS.filesystems = {
      "MEMFS": MEMFS
      , "IDBFS": IDBFS
    }
  }
  , init(input, output, error) {
    FS.init.initialized = true;
    Module["stdin"] = input || Module[
      "stdin"];
    Module["stdout"] = output ||
      Module["stdout"];
    Module["stderr"] = error ||
      Module["stderr"];
    FS.createStandardStreams()
  }
  , quit() {
    FS.init.initialized = false;
    for (var i = 0; i < FS.streams
      .length; i++) {
      var stream = FS.streams[i];
      if (!stream) {
        continue
      }
      FS.close(stream)
    }
  }
  , findObject(path,
    dontResolveLastLink) {
    var ret = FS.analyzePath(path,
      dontResolveLastLink);
    if (!ret.exists) {
      return null
    }
    return ret.object
  }
  , analyzePath(path,
    dontResolveLastLink) {
    try {
      var lookup = FS.lookupPath(path,
      {
        follow: !
          dontResolveLastLink
      });
      path = lookup.path
    } catch (e) {}
    var ret = {
      isRoot: false
      , exists: false
      , error: 0
      , name: null
      , path: null
      , object: null
      , parentExists: false
      , parentPath: null
      , parentObject: null
    };
    try {
      var lookup = FS.lookupPath(path,
      {
        parent: true
      });
      ret.parentExists = true;
      ret.parentPath = lookup.path;
      ret.parentObject = lookup.node;
      ret.name = PATH.basename(path);
      lookup = FS.lookupPath(path, {
        follow: !
          dontResolveLastLink
      });
      ret.exists = true;
      ret.path = lookup.path;
      ret.object = lookup.node;
      ret.name = lookup.node.name;
      ret.isRoot = lookup.path === "/"
    } catch (e) {
      ret.error = e.errno
    }
    return ret
  }
  , createPath(parent, path, canRead,
    canWrite) {
    parent = typeof parent ==
      "string" ? parent : FS.getPath(
        parent);
    var parts = path.split("/")
      .reverse();
    while (parts.length) {
      var part = parts.pop();
      if (!part) continue;
      var current = PATH.join2(parent,
        part);
      try {
        FS.mkdir(current)
      } catch (e) {}
      parent = current
    }
    return current
  }
  , createFile(parent, name,
    properties, canRead, canWrite) {
    var path = PATH.join2(
      typeof parent == "string" ?
      parent : FS.getPath(parent),
      name);
    var mode = FS_getMode(canRead,
      canWrite);
    return FS.create(path, mode)
  }
  , createDataFile(parent, name, data,
    canRead, canWrite, canOwn) {
    var path = name;
    if (parent) {
      parent = typeof parent ==
        "string" ? parent : FS
        .getPath(parent);
      path = name ? PATH.join2(parent,
        name) : parent
    }
    var mode = FS_getMode(canRead,
      canWrite);
    var node = FS.create(path, mode);
    if (data) {
      if (typeof data == "string") {
        var arr = new Array(data
          .length);
        for (var i = 0, len = data
            .length; i < len; ++i)
          arr[i] = data.charCodeAt(i);
        data = arr
      }
      FS.chmod(node, mode | 146);
      var stream = FS.open(node, 577);
      FS.write(stream, data, 0, data
        .length, 0, canOwn);
      FS.close(stream);
      FS.chmod(node, mode)
    }
  }
  , createDevice(parent, name, input,
    output) {
    var path = PATH.join2(
      typeof parent == "string" ?
      parent : FS.getPath(parent),
      name);
    var mode = FS_getMode(!!input, !!
      output);
    if (!FS.createDevice.major) FS
      .createDevice.major = 64;
    var dev = FS.makedev(FS
      .createDevice.major++, 0);
    FS.registerDevice(dev, {
      open(stream) {
        stream.seekable = false
      }
      , close(stream) {
        if (output?.buffer
          ?.length) {
          output(10)
        }
      }
      , read(stream, buffer,
        offset, length, pos) {
        var bytesRead = 0;
        for (var i = 0; i <
          length; i++) {
          var result;
          try {
            result = input()
          } catch (e) {
            throw new FS
              .ErrnoError(29)
          }
          if (result ===
            undefined &&
            bytesRead === 0) {
            throw new FS
              .ErrnoError(6)
          }
          if (result === null ||
            result === undefined)
            break;
          bytesRead++;
          buffer[offset + i] =
            result
        }
        if (bytesRead) {
          stream.node.timestamp =
            Date.now()
        }
        return bytesRead
      }
      , write(stream, buffer,
        offset, length, pos) {
        for (var i = 0; i <
          length; i++) {
          try {
            output(buffer[offset +
              i])
          } catch (e) {
            throw new FS
              .ErrnoError(29)
          }
        }
        if (length) {
          stream.node.timestamp =
            Date.now()
        }
        return i
      }
    });
    return FS.mkdev(path, mode, dev)
  }
  , forceLoadFile(obj) {
    if (obj.isDevice || obj
      .isFolder || obj.link || obj
      .contents) return true;
    if (typeof XMLHttpRequest !=
      "undefined") {
      throw new Error(
        "Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread."
        )
    } else if (read_) {
      try {
        obj.contents =
          intArrayFromString(read_(obj
            .url), true);
        obj.usedBytes = obj.contents
          .length
      } catch (e) {
        throw new FS.ErrnoError(29)
      }
    } else {
      throw new Error(
        "Cannot load without read() or XMLHttpRequest."
        )
    }
  }
  , createLazyFile(parent, name, url,
    canRead, canWrite) {
    function LazyUint8Array() {
      this.lengthKnown = false;
      this.chunks = []
    }
    LazyUint8Array.prototype.get =
      function LazyUint8Array_get(
      idx) {
        if (idx > this.length - 1 ||
          idx < 0) {
          return undefined
        }
        var chunkOffset = idx % this
          .chunkSize;
        var chunkNum = idx / this
          .chunkSize | 0;
        return this.getter(chunkNum)[
          chunkOffset]
      };
    LazyUint8Array.prototype
      .setDataGetter =
      function LazyUint8Array_setDataGetter(
        getter) {
        this.getter = getter
      };
    LazyUint8Array.prototype
      .cacheLength =
      function LazyUint8Array_cacheLength() {
        var xhr = new XMLHttpRequest;
        xhr.open("HEAD", url, false);
        xhr.send(null);
        if (!(xhr.status >= 200 && xhr
            .status < 300 || xhr
            .status === 304))
        throw new Error(
            "Couldn't load " + url +
            ". Status: " + xhr
            .status);
        var datalength = Number(xhr
          .getResponseHeader(
            "Content-length"));
        var header;
        var hasByteServing = (header =
            xhr.getResponseHeader(
              "Accept-Ranges")) &&
          header === "bytes";
        var usesGzip = (header = xhr
            .getResponseHeader(
              "Content-Encoding")) &&
          header === "gzip";
        var chunkSize = 1024 * 1024;
        if (!hasByteServing)
          chunkSize = datalength;
        var doXHR = (from, to) => {
          if (from > to)
          throw new Error(
              "invalid range (" +
              from + ", " + to +
              ") or no bytes requested!"
              );
          if (to > datalength - 1)
            throw new Error(
              "only " +
              datalength +
              " bytes available! programmer error!"
              );
          var xhr =
            new XMLHttpRequest;
          xhr.open("GET", url,
            false);
          if (datalength !==
            chunkSize) xhr
            .setRequestHeader(
              "Range", "bytes=" +
              from + "-" + to);
          xhr.responseType =
            "arraybuffer";
          if (xhr
            .overrideMimeType) {
            xhr.overrideMimeType(
              "text/plain; charset=x-user-defined"
              )
          }
          xhr.send(null);
          if (!(xhr.status >= 200 &&
              xhr.status < 300 ||
              xhr.status === 304))
            throw new Error(
              "Couldn't load " +
              url + ". Status: " +
              xhr.status);
          if (xhr.response !==
            undefined) {
            return new Uint8Array(
              xhr.response || [])
          }
          return intArrayFromString(
            xhr.responseText ||
            "", true)
        };
        var lazyArray = this;
        lazyArray.setDataGetter(
          chunkNum => {
            var start = chunkNum *
              chunkSize;
            var end = (chunkNum +
              1) * chunkSize - 1;
            end = Math.min(end,
              datalength - 1);
            if (typeof lazyArray
              .chunks[chunkNum] ==
              "undefined") {
              lazyArray.chunks[
                chunkNum] = doXHR(
                start, end)
            }
            if (typeof lazyArray
              .chunks[chunkNum] ==
              "undefined")
            throw new Error(
                "doXHR failed!");
            return lazyArray.chunks[
              chunkNum]
          });
        if (usesGzip || !datalength) {
          chunkSize = datalength = 1;
          datalength = this.getter(0)
            .length;
          chunkSize = datalength;
          out(
            "LazyFiles on gzip forces download of the whole file when length is accessed")
        }
        this._length = datalength;
        this._chunkSize = chunkSize;
        this.lengthKnown = true
      };
    if (typeof XMLHttpRequest !=
      "undefined") {
      if (!ENVIRONMENT_IS_WORKER)
        throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
      var lazyArray =
        new LazyUint8Array;
      Object.defineProperties(
        lazyArray, {
          length: {
            get: function() {
              if (!this
                .lengthKnown) {
                this.cacheLength()
              }
              return this._length
            }
          }
          , chunkSize: {
            get: function() {
              if (!this
                .lengthKnown) {
                this.cacheLength()
              }
              return this
                ._chunkSize
            }
          }
        });
      var properties = {
        isDevice: false
        , contents: lazyArray
      }
    } else {
      var properties = {
        isDevice: false
        , url: url
      }
    }
    var node = FS.createFile(parent,
      name, properties, canRead,
      canWrite);
    if (properties.contents) {
      node.contents = properties
        .contents
    } else if (properties.url) {
      node.contents = null;
      node.url = properties.url
    }
    Object.defineProperties(node, {
      usedBytes: {
        get: function() {
          return this.contents
            .length
        }
      }
    });
    var stream_ops = {};
    var keys = Object.keys(node
      .stream_ops);
    keys.forEach(key => {
      var fn = node.stream_ops[
        key];
      stream_ops[key] = (...
        args) => {
          FS.forceLoadFile(node);
          return fn(...args)
        }
    });

    function writeChunks(stream,
      buffer, offset, length, position
      ) {
      var contents = stream.node
        .contents;
      if (position >= contents.length)
        return 0;
      var size = Math.min(contents
        .length - position, length);
      if (contents.slice) {
        for (var i = 0; i <
          size; i++) {
          buffer[offset + i] =
            contents[position + i]
        }
      } else {
        for (var i = 0; i <
          size; i++) {
          buffer[offset + i] =
            contents.get(position + i)
        }
      }
      return size
    }
    stream_ops.read = (stream, buffer,
      offset, length, position) => {
      FS.forceLoadFile(node);
      return writeChunks(stream,
        buffer, offset, length,
        position)
    };
    stream_ops.mmap = (stream, length,
      position, prot, flags) => {
      FS.forceLoadFile(node);
      var ptr = mmapAlloc(length);
      if (!ptr) {
        throw new FS.ErrnoError(48)
      }
      writeChunks(stream, HEAP8,
        ptr, length, position);
      return {
        ptr: ptr
        , allocated: true
      }
    };
    node.stream_ops = stream_ops;
    return node
  }
};
var SYSCALLS = {
  DEFAULT_POLLMASK: 5
  , calculateAt(dirfd, path,
    allowEmpty) {
    if (PATH.isAbs(path)) {
      return path
    }
    var dir;
    if (dirfd === -100) {
      dir = FS.cwd()
    } else {
      var dirstream = SYSCALLS
        .getStreamFromFD(dirfd);
      dir = dirstream.path
    }
    if (path.length == 0) {
      if (!allowEmpty) {
        throw new FS.ErrnoError(44)
      }
      return dir
    }
    return PATH.join2(dir, path)
  }
  , doStat(func, path, buf) {
    var stat = func(path);
    HEAP32[buf >> 2] = stat.dev;
    HEAP32[buf + 4 >> 2] = stat.mode;
    HEAPU32[buf + 8 >> 2] = stat
    .nlink;
    HEAP32[buf + 12 >> 2] = stat.uid;
    HEAP32[buf + 16 >> 2] = stat.gid;
    HEAP32[buf + 20 >> 2] = stat.rdev;
    tempI64 = [stat.size >>> 0, (
        tempDouble = stat.size, +
        Math.abs(tempDouble) >= 1 ?
        tempDouble > 0 ? +Math
        .floor(tempDouble /
          4294967296) >>> 0 : ~~+
        Math.ceil((tempDouble - +(~~
            tempDouble >>> 0)) /
          4294967296) >>> 0 : 0)],
      HEAP32[buf + 24 >> 2] = tempI64[
        0], HEAP32[buf + 28 >> 2] =
      tempI64[1];
    HEAP32[buf + 32 >> 2] = 4096;
    HEAP32[buf + 36 >> 2] = stat
      .blocks;
    var atime = stat.atime.getTime();
    var mtime = stat.mtime.getTime();
    var ctime = stat.ctime.getTime();
    tempI64 = [Math.floor(atime /
        1e3) >>> 0, (tempDouble = Math
          .floor(atime / 1e3), +Math
          .abs(tempDouble) >= 1 ?
          tempDouble > 0 ? +Math
          .floor(tempDouble /
            4294967296) >>> 0 : ~~+
          Math.ceil((tempDouble - +(~~
              tempDouble >>> 0)) /
            4294967296) >>> 0 : 0)
      ], HEAP32[buf + 40 >> 2] =
      tempI64[0], HEAP32[buf + 44 >>
        2] = tempI64[1];
    HEAPU32[buf + 48 >> 2] = atime %
      1e3 * 1e3;
    tempI64 = [Math.floor(mtime /
        1e3) >>> 0, (tempDouble = Math
          .floor(mtime / 1e3), +Math
          .abs(tempDouble) >= 1 ?
          tempDouble > 0 ? +Math
          .floor(tempDouble /
            4294967296) >>> 0 : ~~+
          Math.ceil((tempDouble - +(~~
              tempDouble >>> 0)) /
            4294967296) >>> 0 : 0)
      ], HEAP32[buf + 56 >> 2] =
      tempI64[0], HEAP32[buf + 60 >>
        2] = tempI64[1];
    HEAPU32[buf + 64 >> 2] = mtime %
      1e3 * 1e3;
    tempI64 = [Math.floor(ctime /
        1e3) >>> 0, (tempDouble = Math
          .floor(ctime / 1e3), +Math
          .abs(tempDouble) >= 1 ?
          tempDouble > 0 ? +Math
          .floor(tempDouble /
            4294967296) >>> 0 : ~~+
          Math.ceil((tempDouble - +(~~
              tempDouble >>> 0)) /
            4294967296) >>> 0 : 0)
      ], HEAP32[buf + 72 >> 2] =
      tempI64[0], HEAP32[buf + 76 >>
        2] = tempI64[1];
    HEAPU32[buf + 80 >> 2] = ctime %
      1e3 * 1e3;
    tempI64 = [stat.ino >>> 0, (
        tempDouble = stat.ino, +Math
        .abs(tempDouble) >= 1 ?
        tempDouble > 0 ? +Math
        .floor(tempDouble /
          4294967296) >>> 0 : ~~+
        Math.ceil((tempDouble - +(~~
            tempDouble >>> 0)) /
          4294967296) >>> 0 : 0)],
      HEAP32[buf + 88 >> 2] = tempI64[
        0], HEAP32[buf + 92 >> 2] =
      tempI64[1];
    return 0
  }
  , doMsync(addr, stream, len, flags,
    offset) {
    if (!FS.isFile(stream.node
      .mode)) {
      throw new FS.ErrnoError(43)
    }
    if (flags & 2) {
      return 0
    }
    var buffer = HEAPU8.slice(addr,
      addr + len);
    FS.msync(stream, buffer, offset,
      len, flags)
  }
  , varargs: undefined
  , get() {
    var ret = HEAP32[+SYSCALLS
      .varargs >> 2];
    SYSCALLS.varargs += 4;
    return ret
  }
  , getp() {
    return SYSCALLS.get()
  }
  , getStr(ptr) {
    var ret = UTF8ToString(ptr);
    return ret
  }
  , getStreamFromFD(fd) {
    var stream = FS.getStreamChecked(
      fd);
    return stream
  }
};

function ___syscall_fcntl64(fd, cmd,
  varargs) {
  SYSCALLS.varargs = varargs;
  try {
    var stream = SYSCALLS
      .getStreamFromFD(fd);
    switch (cmd) {
      case 0: {
        var arg = SYSCALLS.get();
        if (arg < 0) {
          return -28
        }
        while (FS.streams[arg]) {
          arg++
        }
        var newStream;
        newStream = FS.createStream(
          stream, arg);
        return newStream.fd
      }
      case 1:
      case 2:
        return 0;
      case 3:
        return stream.flags;
      case 4: {
        var arg = SYSCALLS.get();
        stream.flags |= arg;
        return 0
      }
      case 12: {
        var arg = SYSCALLS.getp();
        var offset = 0;
        HEAP16[arg + offset >> 1] = 2;
        return 0
      }
      case 13:
      case 14:
        return 0
    }
    return -28
  } catch (e) {
    if (typeof FS == "undefined" || !(e
        .name === "ErrnoError"))
  throw e;
    return -e.errno
  }
}
var convertI32PairToI53Checked = (lo,
    hi) => hi + 2097152 >>> 0 <
  4194305 - !!lo ? (lo >>> 0) + hi *
  4294967296 : NaN;

function ___syscall_ftruncate64(fd,
  length_low, length_high) {
  var length =
    convertI32PairToI53Checked(
      length_low, length_high);
  try {
    if (isNaN(length)) return 61;
    FS.ftruncate(fd, length);
    return 0
  } catch (e) {
    if (typeof FS == "undefined" || !(e
        .name === "ErrnoError"))
  throw e;
    return -e.errno
  }
}
var stringToUTF8 = (str, outPtr,
    maxBytesToWrite) =>
  stringToUTF8Array(str, HEAPU8, outPtr,
    maxBytesToWrite);

function ___syscall_getcwd(buf, size) {
  try {
    if (size === 0) return -28;
    var cwd = FS.cwd();
    var cwdLengthInBytes =
      lengthBytesUTF8(cwd) + 1;
    if (size < cwdLengthInBytes)
    return -68;
    stringToUTF8(cwd, buf, size);
    return cwdLengthInBytes
  } catch (e) {
    if (typeof FS == "undefined" || !(e
        .name === "ErrnoError"))
  throw e;
    return -e.errno
  }
}

function ___syscall_getdents64(fd, dirp,
  count) {
  try {
    var stream = SYSCALLS
      .getStreamFromFD(fd);
    stream.getdents ||= FS.readdir(
      stream.path);
    var struct_size = 280;
    var pos = 0;
    var off = FS.llseek(stream, 0, 1);
    var idx = Math.floor(off /
      struct_size);
    while (idx < stream.getdents
      .length && pos + struct_size <=
      count) {
      var id;
      var type;
      var name = stream.getdents[idx];
      if (name === ".") {
        id = stream.node.id;
        type = 4
      } else if (name === "..") {
        var lookup = FS.lookupPath(
          stream.path, {
            parent: true
          });
        id = lookup.node.id;
        type = 4
      } else {
        var child = FS.lookupNode(stream
          .node, name);
        id = child.id;
        type = FS.isChrdev(child.mode) ?
          2 : FS.isDir(child.mode) ? 4 :
          FS.isLink(child.mode) ? 10 : 8
      }
      tempI64 = [id >>> 0, (tempDouble =
          id, +Math.abs(tempDouble) >=
          1 ? tempDouble > 0 ? +Math
          .floor(tempDouble /
            4294967296) >>> 0 : ~~+
          Math.ceil((tempDouble - +(~~
              tempDouble >>> 0)) /
            4294967296) >>> 0 : 0)],
        HEAP32[dirp + pos >> 2] =
        tempI64[0], HEAP32[dirp + pos +
          4 >> 2] = tempI64[1];
      tempI64 = [(idx + 1) *
          struct_size >>> 0, (
            tempDouble = (idx + 1) *
            struct_size, +Math.abs(
              tempDouble) >= 1 ?
            tempDouble > 0 ? +Math
            .floor(tempDouble /
              4294967296) >>> 0 : ~~+
            Math.ceil((tempDouble - +(~~
                tempDouble >>> 0)) /
              4294967296) >>> 0 : 0)
        ], HEAP32[dirp + pos + 8 >> 2] =
        tempI64[0], HEAP32[dirp + pos +
          12 >> 2] = tempI64[1];
      HEAP16[dirp + pos + 16 >> 1] =
      280;
      HEAP8[dirp + pos + 18] = type;
      stringToUTF8(name, dirp + pos +
        19, 256);
      pos += struct_size;
      idx += 1
    }
    FS.llseek(stream, idx * struct_size,
      0);
    return pos
  } catch (e) {
    if (typeof FS == "undefined" || !(e
        .name === "ErrnoError"))
  throw e;
    return -e.errno
  }
}

function ___syscall_ioctl(fd, op,
  varargs) {
  SYSCALLS.varargs = varargs;
  try {
    var stream = SYSCALLS
      .getStreamFromFD(fd);
    switch (op) {
      case 21509: {
        if (!stream.tty) return -59;
        return 0
      }
      case 21505: {
        if (!stream.tty) return -59;
        if (stream.tty.ops
          .ioctl_tcgets) {
          var termios = stream.tty.ops
            .ioctl_tcgets(stream);
          var argp = SYSCALLS.getp();
          HEAP32[argp >> 2] = termios
            .c_iflag || 0;
          HEAP32[argp + 4 >> 2] =
            termios.c_oflag || 0;
          HEAP32[argp + 8 >> 2] =
            termios.c_cflag || 0;
          HEAP32[argp + 12 >> 2] =
            termios.c_lflag || 0;
          for (var i = 0; i < 32; i++) {
            HEAP8[argp + i + 17] =
              termios.c_cc[i] || 0
          }
          return 0
        }
        return 0
      }
      case 21510:
      case 21511:
      case 21512: {
        if (!stream.tty) return -59;
        return 0
      }
      case 21506:
      case 21507:
      case 21508: {
        if (!stream.tty) return -59;
        if (stream.tty.ops
          .ioctl_tcsets) {
          var argp = SYSCALLS.getp();
          var c_iflag = HEAP32[argp >>
            2];
          var c_oflag = HEAP32[argp +
            4 >> 2];
          var c_cflag = HEAP32[argp +
            8 >> 2];
          var c_lflag = HEAP32[argp +
            12 >> 2];
          var c_cc = [];
          for (var i = 0; i < 32; i++) {
            c_cc.push(HEAP8[argp + i +
              17])
          }
          return stream.tty.ops
            .ioctl_tcsets(stream.tty,
              op, {
                c_iflag: c_iflag
                , c_oflag: c_oflag
                , c_cflag: c_cflag
                , c_lflag: c_lflag
                , c_cc: c_cc
              })
        }
        return 0
      }
      case 21519: {
        if (!stream.tty) return -59;
        var argp = SYSCALLS.getp();
        HEAP32[argp >> 2] = 0;
        return 0
      }
      case 21520: {
        if (!stream.tty) return -59;
        return -28
      }
      case 21531: {
        var argp = SYSCALLS.getp();
        return FS.ioctl(stream, op,
          argp)
      }
      case 21523: {
        if (!stream.tty) return -59;
        if (stream.tty.ops
          .ioctl_tiocgwinsz) {
          var winsize = stream.tty.ops
            .ioctl_tiocgwinsz(stream
              .tty);
          var argp = SYSCALLS.getp();
          HEAP16[argp >> 1] = winsize[
          0];
          HEAP16[argp + 2 >> 1] =
            winsize[1]
        }
        return 0
      }
      case 21524: {
        if (!stream.tty) return -59;
        return 0
      }
      case 21515: {
        if (!stream.tty) return -59;
        return 0
      }
      default:
        return -28
    }
  } catch (e) {
    if (typeof FS == "undefined" || !(e
        .name === "ErrnoError"))
  throw e;
    return -e.errno
  }
}

function ___syscall_mkdirat(dirfd, path,
  mode) {
  try {
    path = SYSCALLS.getStr(path);
    path = SYSCALLS.calculateAt(dirfd,
      path);
    path = PATH.normalize(path);
    if (path[path.length - 1] === "/")
      path = path.substr(0, path
        .length - 1);
    FS.mkdir(path, mode, 0);
    return 0
  } catch (e) {
    if (typeof FS == "undefined" || !(e
        .name === "ErrnoError"))
  throw e;
    return -e.errno
  }
}

function ___syscall_openat(dirfd, path,
  flags, varargs) {
  SYSCALLS.varargs = varargs;
  try {
    path = SYSCALLS.getStr(path);
    path = SYSCALLS.calculateAt(dirfd,
      path);
    var mode = varargs ? SYSCALLS
    .get() : 0;
    return FS.open(path, flags, mode).fd
  } catch (e) {
    if (typeof FS == "undefined" || !(e
        .name === "ErrnoError"))
  throw e;
    return -e.errno
  }
}

function ___syscall_readlinkat(dirfd,
  path, buf, bufsize) {
  try {
    path = SYSCALLS.getStr(path);
    path = SYSCALLS.calculateAt(dirfd,
      path);
    if (bufsize <= 0) return -28;
    var ret = FS.readlink(path);
    var len = Math.min(bufsize,
      lengthBytesUTF8(ret));
    var endChar = HEAP8[buf + len];
    stringToUTF8(ret, buf, bufsize + 1);
    HEAP8[buf + len] = endChar;
    return len
  } catch (e) {
    if (typeof FS == "undefined" || !(e
        .name === "ErrnoError"))
  throw e;
    return -e.errno
  }
}

function ___syscall_renameat(olddirfd,
  oldpath, newdirfd, newpath) {
  try {
    oldpath = SYSCALLS.getStr(oldpath);
    newpath = SYSCALLS.getStr(newpath);
    oldpath = SYSCALLS.calculateAt(
      olddirfd, oldpath);
    newpath = SYSCALLS.calculateAt(
      newdirfd, newpath);
    FS.rename(oldpath, newpath);
    return 0
  } catch (e) {
    if (typeof FS == "undefined" || !(e
        .name === "ErrnoError"))
  throw e;
    return -e.errno
  }
}

function ___syscall_rmdir(path) {
  try {
    path = SYSCALLS.getStr(path);
    FS.rmdir(path);
    return 0
  } catch (e) {
    if (typeof FS == "undefined" || !(e
        .name === "ErrnoError"))
  throw e;
    return -e.errno
  }
}

function ___syscall_stat64(path, buf) {
  try {
    path = SYSCALLS.getStr(path);
    return SYSCALLS.doStat(FS.stat,
      path, buf)
  } catch (e) {
    if (typeof FS == "undefined" || !(e
        .name === "ErrnoError"))
  throw e;
    return -e.errno
  }
}

function ___syscall_unlinkat(dirfd,
  path, flags) {
  try {
    path = SYSCALLS.getStr(path);
    path = SYSCALLS.calculateAt(dirfd,
      path);
    if (flags === 0) {
      FS.unlink(path)
    } else if (flags === 512) {
      FS.rmdir(path)
    } else {
      abort(
        "Invalid flags passed to unlinkat"
        )
    }
    return 0
  } catch (e) {
    if (typeof FS == "undefined" || !(e
        .name === "ErrnoError"))
  throw e;
    return -e.errno
  }
}
var nowIsMonotonic = 1;
var __emscripten_get_now_is_monotonic =
  () => nowIsMonotonic;
var __emscripten_throw_longjmp = () => {
  throw Infinity
};
var isLeapYear = year => year % 4 ===
  0 && (year % 100 !== 0 || year %
    400 === 0);
var MONTH_DAYS_LEAP_CUMULATIVE = [0, 31,
  60, 91, 121, 152, 182, 213, 244,
  274, 305, 335
];
var MONTH_DAYS_REGULAR_CUMULATIVE = [0,
  31, 59, 90, 120, 151, 181, 212, 243,
  273, 304, 334
];
var ydayFromDate = date => {
  var leap = isLeapYear(date
    .getFullYear());
  var monthDaysCumulative = leap ?
    MONTH_DAYS_LEAP_CUMULATIVE :
    MONTH_DAYS_REGULAR_CUMULATIVE;
  var yday = monthDaysCumulative[date
      .getMonth()] + date.getDate() -
    1;
  return yday
};

function __localtime_js(time_low,
  time_high, tmPtr) {
  var time = convertI32PairToI53Checked(
    time_low, time_high);
  var date = new Date(time * 1e3);
  HEAP32[tmPtr >> 2] = date
.getSeconds();
  HEAP32[tmPtr + 4 >> 2] = date
    .getMinutes();
  HEAP32[tmPtr + 8 >> 2] = date
    .getHours();
  HEAP32[tmPtr + 12 >> 2] = date
    .getDate();
  HEAP32[tmPtr + 16 >> 2] = date
    .getMonth();
  HEAP32[tmPtr + 20 >> 2] = date
    .getFullYear() - 1900;
  HEAP32[tmPtr + 24 >> 2] = date
  .getDay();
  var yday = ydayFromDate(date) | 0;
  HEAP32[tmPtr + 28 >> 2] = yday;
  HEAP32[tmPtr + 36 >> 2] = -(date
    .getTimezoneOffset() * 60);
  var start = new Date(date
  .getFullYear(), 0, 1);
  var summerOffset = new Date(date
      .getFullYear(), 6, 1)
    .getTimezoneOffset();
  var winterOffset = start
    .getTimezoneOffset();
  var dst = (summerOffset !=
    winterOffset && date
    .getTimezoneOffset() == Math.min(
      winterOffset, summerOffset)) | 0;
  HEAP32[tmPtr + 32 >> 2] = dst
}
var __mktime_js = function(tmPtr) {
  var ret = (() => {
    var date = new Date(HEAP32[
        tmPtr + 20 >> 2] + 1900,
      HEAP32[tmPtr + 16 >> 2],
      HEAP32[tmPtr + 12 >> 2],
      HEAP32[tmPtr + 8 >> 2],
      HEAP32[tmPtr + 4 >> 2],
      HEAP32[tmPtr >> 2], 0);
    var dst = HEAP32[tmPtr + 32 >>
      2];
    var guessedOffset = date
      .getTimezoneOffset();
    var start = new Date(date
      .getFullYear(), 0, 1);
    var summerOffset = new Date(
        date.getFullYear(), 6, 1)
      .getTimezoneOffset();
    var winterOffset = start
      .getTimezoneOffset();
    var dstOffset = Math.min(
      winterOffset, summerOffset
      );
    if (dst < 0) {
      HEAP32[tmPtr + 32 >> 2] =
        Number(summerOffset !=
          winterOffset &&
          dstOffset ==
          guessedOffset)
    } else if (dst > 0 != (
        dstOffset == guessedOffset
        )) {
      var nonDstOffset = Math.max(
        winterOffset,
        summerOffset);
      var trueOffset = dst > 0 ?
        dstOffset : nonDstOffset;
      date.setTime(date
      .getTime() + (trueOffset -
          guessedOffset) * 6e4)
    }
    HEAP32[tmPtr + 24 >> 2] = date
      .getDay();
    var yday = ydayFromDate(
      date) | 0;
    HEAP32[tmPtr + 28 >> 2] =
    yday;
    HEAP32[tmPtr >> 2] = date
      .getSeconds();
    HEAP32[tmPtr + 4 >> 2] = date
      .getMinutes();
    HEAP32[tmPtr + 8 >> 2] = date
      .getHours();
    HEAP32[tmPtr + 12 >> 2] = date
      .getDate();
    HEAP32[tmPtr + 16 >> 2] = date
      .getMonth();
    HEAP32[tmPtr + 20 >> 2] = date
      .getYear();
    var timeMs = date.getTime();
    if (isNaN(timeMs)) {
      return -1
    }
    return timeMs / 1e3
  })();
  return setTempRet0((tempDouble =
      ret, +Math.abs(tempDouble) >=
      1 ? tempDouble > 0 ? +Math
      .floor(tempDouble /
        4294967296) >>> 0 : ~~+Math
      .ceil((tempDouble - +(~~
          tempDouble >>> 0)) /
        4294967296) >>> 0 : 0)),
    ret >>> 0
};
var stringToNewUTF8 = str => {
  var size = lengthBytesUTF8(str) + 1;
  var ret = _malloc(size);
  if (ret) stringToUTF8(str, ret,
    size);
  return ret
};
var __tzset_js = (timezone, daylight,
  tzname) => {
  var currentYear = (new Date)
    .getFullYear();
  var winter = new Date(currentYear,
    0, 1);
  var summer = new Date(currentYear,
    6, 1);
  var winterOffset = winter
    .getTimezoneOffset();
  var summerOffset = summer
    .getTimezoneOffset();
  var stdTimezoneOffset = Math.max(
    winterOffset, summerOffset);
  HEAPU32[timezone >> 2] =
    stdTimezoneOffset * 60;
  HEAP32[daylight >> 2] = Number(
    winterOffset != summerOffset);

  function extractZone(date) {
    var match = date.toTimeString()
      .match(/\(([A-Za-z ]+)\)$/);
    return match ? match[1] : "GMT"
  }
  var winterName = extractZone(
  winter);
  var summerName = extractZone(
  summer);
  var winterNamePtr = stringToNewUTF8(
    winterName);
  var summerNamePtr = stringToNewUTF8(
    summerName);
  if (summerOffset < winterOffset) {
    HEAPU32[tzname >> 2] =
      winterNamePtr;
    HEAPU32[tzname + 4 >> 2] =
      summerNamePtr
  } else {
    HEAPU32[tzname >> 2] =
      summerNamePtr;
    HEAPU32[tzname + 4 >> 2] =
      winterNamePtr
  }
};
var _abort = () => {
  abort("")
};
var _emscripten_set_main_loop_timing = (
  mode, value) => {
  Browser.mainLoop.timingMode = mode;
  Browser.mainLoop.timingValue =
  value;
  if (!Browser.mainLoop.func) {
    return 1
  }
  if (!Browser.mainLoop.running) {
    Browser.mainLoop.running = true
  }
  if (mode == 0) {
    Browser.mainLoop.scheduler =
      function Browser_mainLoop_scheduler_setTimeout() {
        var timeUntilNextTick = Math
          .max(0, Browser.mainLoop
            .tickStartTime + value -
            _emscripten_get_now()) |
          0;
        setTimeout(Browser.mainLoop
          .runner, timeUntilNextTick
          )
      };
    Browser.mainLoop.method =
      "timeout"
  } else if (mode == 1) {
    Browser.mainLoop.scheduler =
      function Browser_mainLoop_scheduler_rAF() {
        Browser.requestAnimationFrame(
          Browser.mainLoop.runner)
      };
    Browser.mainLoop.method = "rAF"
  } else if (mode == 2) {
    if (typeof Browser.setImmediate ==
      "undefined") {
      if (typeof setImmediate ==
        "undefined") {
        var setImmediates = [];
        var
          emscriptenMainLoopMessageId =
          "setimmediate";
        var
          Browser_setImmediate_messageHandler =
          event => {
            if (event.data ===
              emscriptenMainLoopMessageId ||
              event.data.target ===
              emscriptenMainLoopMessageId
              ) {
              event.stopPropagation();
              setImmediates.shift()()
            }
          };
        addEventListener("message",
          Browser_setImmediate_messageHandler,
          true);
        Browser.setImmediate =
          function Browser_emulated_setImmediate(
            func) {
            setImmediates.push(func);
            if (
              ENVIRONMENT_IS_WORKER) {
              if (Module[
                  "setImmediates"] ===
                undefined) Module[
                "setImmediates"
                ] = [];
              Module["setImmediates"]
                .push(func);
              postMessage({
                target: emscriptenMainLoopMessageId
              })
            } else postMessage(
              emscriptenMainLoopMessageId,
              "*")
          }
      } else {
        Browser.setImmediate =
          setImmediate
      }
    }
    Browser.mainLoop.scheduler =
      function Browser_mainLoop_scheduler_setImmediate() {
        Browser.setImmediate(Browser
          .mainLoop.runner)
      };
    Browser.mainLoop.method =
      "immediate"
  }
  return 0
};
var _emscripten_get_now;
_emscripten_get_now = () => performance
  .now();
var setMainLoop = (browserIterationFunc,
  fps, simulateInfiniteLoop, arg,
  noSetTiming) => {
  assert(!Browser.mainLoop.func,
    "emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters."
    );
  Browser.mainLoop.func =
    browserIterationFunc;
  Browser.mainLoop.arg = arg;
  var thisMainLoopId = Browser
    .mainLoop
    .currentlyRunningMainloop;

  function checkIsRunning() {
    if (thisMainLoopId < Browser
      .mainLoop
      .currentlyRunningMainloop) {
      return false
    }
    return true
  }
  Browser.mainLoop.running = false;
  Browser.mainLoop.runner =
    function Browser_mainLoop_runner() {
      if (ABORT) return;
      if (Browser.mainLoop.queue
        .length > 0) {
        var start = Date.now();
        var blocker = Browser.mainLoop
          .queue.shift();
        blocker.func(blocker.arg);
        if (Browser.mainLoop
          .remainingBlockers) {
          var remaining = Browser
            .mainLoop
            .remainingBlockers;
          var next = remaining % 1 ==
            0 ? remaining - 1 : Math
            .floor(remaining);
          if (blocker.counted) {
            Browser.mainLoop
              .remainingBlockers =
              next
          } else {
            next = next + .5;
            Browser.mainLoop
              .remainingBlockers = (
                8 * remaining + next
                ) / 9
          }
        }
        Browser.mainLoop
        .updateStatus();
        if (!checkIsRunning()) return;
        setTimeout(Browser.mainLoop
          .runner, 0);
        return
      }
      if (!checkIsRunning()) return;
      Browser.mainLoop
        .currentFrameNumber = Browser
        .mainLoop.currentFrameNumber +
        1 | 0;
      if (Browser.mainLoop
        .timingMode == 1 && Browser
        .mainLoop.timingValue > 1 &&
        Browser.mainLoop
        .currentFrameNumber % Browser
        .mainLoop.timingValue != 0) {
        Browser.mainLoop.scheduler();
        return
      } else if (Browser.mainLoop
        .timingMode == 0) {
        Browser.mainLoop
          .tickStartTime =
          _emscripten_get_now()
      }
      GL.newRenderingFrameStarted();
      Browser.mainLoop.runIter(
        browserIterationFunc);
      if (!checkIsRunning()) return;
      if (typeof SDL == "object") SDL
        .audio?.queueNewAudioData?.();
      Browser.mainLoop.scheduler()
    };
  if (!noSetTiming) {
    if (fps && fps > 0) {
      _emscripten_set_main_loop_timing
        (0, 1e3 / fps)
    } else {
      _emscripten_set_main_loop_timing
        (1, 1)
    }
    Browser.mainLoop.scheduler()
  }
  if (simulateInfiniteLoop) {
    throw "unwind"
  }
};
var handleException = e => {
  if (e instanceof ExitStatus || e ==
    "unwind") {
    return EXITSTATUS
  }
  quit_(1, e)
};
var runtimeKeepaliveCounter = 0;
var keepRuntimeAlive = () =>
  noExitRuntime ||
  runtimeKeepaliveCounter > 0;
var _proc_exit = code => {
  EXITSTATUS = code;
  if (!keepRuntimeAlive()) {
    Module["onExit"]?.(code);
    ABORT = true
  }
  quit_(code, new ExitStatus(code))
};
var exitJS = (status, implicit) => {
  EXITSTATUS = status;
  _proc_exit(status)
};
var _exit = exitJS;
var maybeExit = () => {
  if (!keepRuntimeAlive()) {
    try {
      _exit(EXITSTATUS)
    } catch (e) {
      handleException(e)
    }
  }
};
var callUserCallback = func => {
  if (ABORT) {
    return
  }
  try {
    func();
    maybeExit()
  } catch (e) {
    handleException(e)
  }
};
var safeSetTimeout = (func, timeout) =>
  setTimeout(() => {
    callUserCallback(func)
  }, timeout);
var warnOnce = text => {
  warnOnce.shown ||= {};
  if (!warnOnce.shown[text]) {
    warnOnce.shown[text] = 1;
    if (ENVIRONMENT_IS_NODE) text =
      "warning: " + text;
    err(text)
  }
};
var Browser = {
  mainLoop: {
    running: false
    , scheduler: null
    , method: ""
    , currentlyRunningMainloop: 0
    , func: null
    , arg: 0
    , timingMode: 0
    , timingValue: 0
    , currentFrameNumber: 0
    , queue: []
    , pause() {
      Browser.mainLoop.scheduler =
        null;
      Browser.mainLoop
        .currentlyRunningMainloop++
    }
    , resume() {
      Browser.mainLoop
        .currentlyRunningMainloop++;
      var timingMode = Browser
        .mainLoop.timingMode;
      var timingValue = Browser
        .mainLoop.timingValue;
      var func = Browser.mainLoop
      .func;
      Browser.mainLoop.func = null;
      setMainLoop(func, 0, false,
        Browser.mainLoop.arg, true);
      _emscripten_set_main_loop_timing
        (timingMode, timingValue);
      Browser.mainLoop.scheduler()
    }
    , updateStatus() {
      if (Module["setStatus"]) {
        var message = Module[
            "statusMessage"] ||
          "Please wait...";
        var remaining = Browser
          .mainLoop.remainingBlockers;
        var expected = Browser
          .mainLoop.expectedBlockers;
        if (remaining) {
          if (remaining < expected) {
            Module["setStatus"](
              `{message} ({expected - remaining}/{expected})`
              )
          } else {
            Module["setStatus"](
              message)
          }
        } else {
          Module["setStatus"]("")
        }
      }
    }
    , runIter(func) {
      if (ABORT) return;
      if (Module["preMainLoop"]) {
        var preRet = Module[
          "preMainLoop"]();
        if (preRet === false) {
          return
        }
      }
      callUserCallback(func);
      Module["postMainLoop"]?.()
    }
  }
  , isFullscreen: false
  , pointerLock: false
  , moduleContextCreatedCallbacks: []
  , workers: []
  , init() {
    if (Browser.initted) return;
    Browser.initted = true;
    var imagePlugin = {};
    imagePlugin["canHandle"] =
      function imagePlugin_canHandle(
        name) {
        return !Module
          .noImageDecoding &&
          /\.(jpg|jpeg|png|bmp)$/i
          .test(name)
      };
    imagePlugin["handle"] =
      function imagePlugin_handle(
        byteArray, name, onload,
        onerror) {
        var b = new Blob([byteArray],
        {
          type: Browser
            .getMimetype(name)
        });
        if (b.size !== byteArray
          .length) {
          b = new Blob([
            new Uint8Array(
              byteArray).buffer
          ], {
            type: Browser
              .getMimetype(name)
          })
        }
        var url = URL.createObjectURL(
          b);
        var img = new Image;
        img.onload = () => {
          assert(img.complete,
            `Image ${name} could not be decoded`
            );
          var canvas = document
            .createElement(
            "canvas");
          canvas.width = img.width;
          canvas.height = img
          .height;
          var ctx = canvas
            .getContext("2d");
          ctx.drawImage(img, 0, 0);
          preloadedImages[name] =
            canvas;
          URL.revokeObjectURL(url);
          onload?.(byteArray)
        };
        img.onerror = event => {
          err(
            `Image ${url} could not be decoded`);
          onerror?.()
        };
        img.src = url
      };
    preloadPlugins.push(imagePlugin);
    var audioPlugin = {};
    audioPlugin["canHandle"] =
      function audioPlugin_canHandle(
        name) {
        return !Module
          .noAudioDecoding && name
          .substr(-4) in {
            ".ogg": 1
            , ".wav": 1
            , ".mp3": 1
          }
      };
    audioPlugin["handle"] =
      function audioPlugin_handle(
        byteArray, name, onload,
        onerror) {
        var done = false;

        function finish(audio) {
          if (done) return;
          done = true;
          preloadedAudios[name] =
            audio;
          onload?.(byteArray)
        }
        var b = new Blob([byteArray],
        {
          type: Browser
            .getMimetype(name)
        });
        var url = URL.createObjectURL(
          b);
        var audio = new Audio;
        audio.addEventListener(
          "canplaythrough", () =>
          finish(audio), false);
        audio.onerror =
          function audio_onerror(
            event) {
            if (done) return;
            err(
              `warning: browser could not fully decode audio ${name}, trying slower base64 approach`);

            function encode64(data) {
              var BASE =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
              var PAD = "=";
              var ret = "";
              var leftchar = 0;
              var leftbits = 0;
              for (var i = 0; i < data
                .length; i++) {
                leftchar = leftchar <<
                  8 | data[i];
                leftbits += 8;
                while (leftbits >=
                  6) {
                  var curr =
                    leftchar >>
                    leftbits - 6 & 63;
                  leftbits -= 6;
                  ret += BASE[curr]
                }
              }
              if (leftbits == 2) {
                ret += BASE[(
                    leftchar & 3) <<
                  4];
                ret += PAD + PAD
              } else if (leftbits ==
                4) {
                ret += BASE[(
                    leftchar & 15
                    ) << 2];
                ret += PAD
              }
              return ret
            }
            audio.src =
              "data:audio/x-" + name
              .substr(-3) +
              ";base64," + encode64(
                byteArray);
            finish(audio)
          };
        audio.src = url;
        safeSetTimeout(() => {
          finish(audio)
        }, 1e4)
      };
    preloadPlugins.push(audioPlugin);

    function pointerLockChange() {
      Browser.pointerLock = document[
          "pointerLockElement"] ===
        Module["canvas"] || document[
          "mozPointerLockElement"] ===
        Module["canvas"] || document[
          "webkitPointerLockElement"
          ] === Module["canvas"] ||
        document[
          "msPointerLockElement"] ===
        Module["canvas"]
    }
    var canvas = Module["canvas"];
    if (canvas) {
      canvas.requestPointerLock =
        canvas[
        "requestPointerLock"] ||
        canvas[
          "mozRequestPointerLock"] ||
        canvas[
          "webkitRequestPointerLock"
          ] || canvas[
          "msRequestPointerLock"] || (
          () => {});
      canvas.exitPointerLock =
        document["exitPointerLock"] ||
        document[
        "mozExitPointerLock"] ||
        document[
          "webkitExitPointerLock"] ||
        document[
        "msExitPointerLock"] || (
      () => {});
      canvas.exitPointerLock = canvas
        .exitPointerLock.bind(
          document);
      document.addEventListener(
        "pointerlockchange",
        pointerLockChange, false);
      document.addEventListener(
        "mozpointerlockchange",
        pointerLockChange, false);
      document.addEventListener(
        "webkitpointerlockchange",
        pointerLockChange, false);
      document.addEventListener(
        "mspointerlockchange",
        pointerLockChange, false);
      if (Module[
        "elementPointerLock"]) {
        canvas.addEventListener(
          "click", ev => {
            if (!Browser
              .pointerLock &&
              Module["canvas"]
              .requestPointerLock) {
              Module["canvas"]
                .requestPointerLock();
              ev.preventDefault()
            }
          }, false)
      }
    }
  }
  , createContext(canvas, useWebGL,
    setInModule,
    webGLContextAttributes) {
    if (useWebGL && Module.ctx &&
      canvas == Module.canvas)
    return Module.ctx;
    var ctx;
    var contextHandle;
    if (useWebGL) {
      var contextAttributes = {
        antialias: false
        , alpha: false
        , majorVersion: 2
      };
      if (webGLContextAttributes) {
        for (var attribute in
            webGLContextAttributes) {
          contextAttributes[
            attribute] =
            webGLContextAttributes[
              attribute]
        }
      }
      if (typeof GL != "undefined") {
        contextHandle = GL
          .createContext(canvas,
            contextAttributes);
        if (contextHandle) {
          ctx = GL.getContext(
            contextHandle).GLctx
        }
      }
    } else {
      ctx = canvas.getContext("2d")
    }
    if (!ctx) return null;
    if (setInModule) {
      if (!useWebGL) assert(
        typeof GLctx == "undefined",
        "cannot set in module if GLctx is used, but we are a non-GL context that would replace it"
        );
      Module.ctx = ctx;
      if (useWebGL) GL
        .makeContextCurrent(
          contextHandle);
      Module.useWebGL = useWebGL;
      Browser
        .moduleContextCreatedCallbacks
        .forEach(callback =>
        callback());
      Browser.init()
    }
    return ctx
  }
  , destroyContext(canvas, useWebGL,
    setInModule) {}
  , fullscreenHandlersInstalled: false
  , lockPointer: undefined
  , resizeCanvas: undefined
  , requestFullscreen(lockPointer,
    resizeCanvas) {
    Browser.lockPointer = lockPointer;
    Browser.resizeCanvas =
      resizeCanvas;
    if (typeof Browser.lockPointer ==
      "undefined") Browser
      .lockPointer = true;
    if (typeof Browser.resizeCanvas ==
      "undefined") Browser
      .resizeCanvas = false;
    var canvas = Module["canvas"];

    function fullscreenChange() {
      Browser.isFullscreen = false;
      var canvasContainer = canvas
        .parentNode;
      if ((document[
            "fullscreenElement"] ||
          document[
            "mozFullScreenElement"] ||
          document[
            "msFullscreenElement"] ||
          document[
            "webkitFullscreenElement"
            ] || document[
            "webkitCurrentFullScreenElement"
            ]) === canvasContainer) {
        canvas.exitFullscreen =
          Browser.exitFullscreen;
        if (Browser.lockPointer)
          canvas.requestPointerLock();
        Browser.isFullscreen = true;
        if (Browser.resizeCanvas) {
          Browser
            .setFullscreenCanvasSize()
        } else {
          Browser
            .updateCanvasDimensions(
              canvas)
        }
      } else {
        canvasContainer.parentNode
          .insertBefore(canvas,
            canvasContainer);
        canvasContainer.parentNode
          .removeChild(
            canvasContainer);
        if (Browser.resizeCanvas) {
          Browser
            .setWindowedCanvasSize()
        } else {
          Browser
            .updateCanvasDimensions(
              canvas)
        }
      }
      Module["onFullScreen"]?.(Browser
        .isFullscreen);
      Module["onFullscreen"]?.(Browser
        .isFullscreen)
    }
    if (!Browser
      .fullscreenHandlersInstalled) {
      Browser
        .fullscreenHandlersInstalled =
        true;
      document.addEventListener(
        "fullscreenchange",
        fullscreenChange, false);
      document.addEventListener(
        "mozfullscreenchange",
        fullscreenChange, false);
      document.addEventListener(
        "webkitfullscreenchange",
        fullscreenChange, false);
      document.addEventListener(
        "MSFullscreenChange",
        fullscreenChange, false)
    }
    var canvasContainer = document
      .createElement("div");
    canvas.parentNode.insertBefore(
      canvasContainer, canvas);
    canvasContainer.appendChild(
      canvas);
    canvasContainer
      .requestFullscreen =
      canvasContainer[
        "requestFullscreen"] ||
      canvasContainer[
        "mozRequestFullScreen"] ||
      canvasContainer[
        "msRequestFullscreen"] || (
        canvasContainer[
          "webkitRequestFullscreen"] ?
        () => canvasContainer[
          "webkitRequestFullscreen"](
          Element[
            "ALLOW_KEYBOARD_INPUT"]) :
        null) || (canvasContainer[
          "webkitRequestFullScreen"] ?
        () => canvasContainer[
          "webkitRequestFullScreen"](
          Element[
            "ALLOW_KEYBOARD_INPUT"]) :
        null);
    canvasContainer
    .requestFullscreen()
  }
  , exitFullscreen() {
    if (!Browser.isFullscreen) {
      return false
    }
    var CFS = document[
        "exitFullscreen"] || document[
        "cancelFullScreen"] ||
      document[
      "mozCancelFullScreen"] ||
      document["msExitFullscreen"] ||
      document[
        "webkitCancelFullScreen"] || (
        () => {});
    CFS.apply(document, []);
    return true
  }
  , nextRAF: 0
  , fakeRequestAnimationFrame(func) {
    var now = Date.now();
    if (Browser.nextRAF === 0) {
      Browser.nextRAF = now + 1e3 / 60
    } else {
      while (now + 2 >= Browser
        .nextRAF) {
        Browser.nextRAF += 1e3 / 60
      }
    }
    var delay = Math.max(Browser
      .nextRAF - now, 0);
    setTimeout(func, delay)
  }
  , requestAnimationFrame(func) {
    if (
      typeof requestAnimationFrame ==
      "function") {
      requestAnimationFrame(func);
      return
    }
    var RAF = Browser
      .fakeRequestAnimationFrame;
    RAF(func)
  }
  , safeSetTimeout(func, timeout) {
    return safeSetTimeout(func,
      timeout)
  }
  , safeRequestAnimationFrame(func) {
    return Browser
      .requestAnimationFrame(() => {
        callUserCallback(func)
      })
  }
  , getMimetype(name) {
    return {
      "jpg": "image/jpeg"
      , "jpeg": "image/jpeg"
      , "png": "image/png"
      , "bmp": "image/bmp"
      , "ogg": "audio/ogg"
      , "wav": "audio/wav"
      , "mp3": "audio/mpeg"
    } [name.substr(name.lastIndexOf(
      ".") + 1)]
  }
  , getUserMedia(func) {
    window.getUserMedia ||= navigator[
      "getUserMedia"] || navigator[
      "mozGetUserMedia"];
    window.getUserMedia(func)
  }
  , getMovementX(event) {
    return event["movementX"] ||
      event["mozMovementX"] || event[
        "webkitMovementX"] || 0
  }
  , getMovementY(event) {
    return event["movementY"] ||
      event["mozMovementY"] || event[
        "webkitMovementY"] || 0
  }
  , getMouseWheelDelta(event) {
    var delta = 0;
    switch (event.type) {
      case "DOMMouseScroll":
        delta = event.detail / 3;
        break;
      case "mousewheel":
        delta = event.wheelDelta /
        120;
        break;
      case "wheel":
        delta = event.deltaY;
        switch (event.deltaMode) {
          case 0:
            delta /= 100;
            break;
          case 1:
            delta /= 3;
            break;
          case 2:
            delta *= 80;
            break;
          default:
            throw "unrecognized mouse wheel delta mode: " +
              event.deltaMode
        }
        break;
      default:
        throw "unrecognized mouse wheel event: " +
          event.type
    }
    return delta
  }
  , mouseX: 0
  , mouseY: 0
  , mouseMovementX: 0
  , mouseMovementY: 0
  , touches: {}
  , lastTouches: {}
  , calculateMouseCoords(pageX,
  pageY) {
    var rect = Module["canvas"]
      .getBoundingClientRect();
    var cw = Module["canvas"].width;
    var ch = Module["canvas"].height;
    var scrollX = typeof window
      .scrollX != "undefined" ? window
      .scrollX : window.pageXOffset;
    var scrollY = typeof window
      .scrollY != "undefined" ? window
      .scrollY : window.pageYOffset;
    var adjustedX = pageX - (scrollX +
      rect.left);
    var adjustedY = pageY - (scrollY +
      rect.top);
    adjustedX = adjustedX * (cw / rect
      .width);
    adjustedY = adjustedY * (ch / rect
      .height);
    return {
      x: adjustedX
      , y: adjustedY
    }
  }
  , setMouseCoords(pageX, pageY) {
    const {
      x: x
      , y: y
    } = Browser.calculateMouseCoords(
      pageX, pageY);
    Browser.mouseMovementX = x -
      Browser.mouseX;
    Browser.mouseMovementY = y -
      Browser.mouseY;
    Browser.mouseX = x;
    Browser.mouseY = y
  }
  , calculateMouseEvent(event) {
    if (Browser.pointerLock) {
      if (event.type != "mousemove" &&
        "mozMovementX" in event) {
        Browser.mouseMovementX =
          Browser.mouseMovementY = 0
      } else {
        Browser.mouseMovementX =
          Browser.getMovementX(event);
        Browser.mouseMovementY =
          Browser.getMovementY(event)
      }
      if (typeof SDL != "undefined") {
        Browser.mouseX = SDL.mouseX +
          Browser.mouseMovementX;
        Browser.mouseY = SDL.mouseY +
          Browser.mouseMovementY
      } else {
        Browser.mouseX += Browser
          .mouseMovementX;
        Browser.mouseY += Browser
          .mouseMovementY
      }
    } else {
      if (event.type ===
        "touchstart" || event.type ===
        "touchend" || event.type ===
        "touchmove") {
        var touch = event.touch;
        if (touch === undefined) {
          return
        }
        var coords = Browser
          .calculateMouseCoords(touch
            .pageX, touch.pageY);
        if (event.type ===
          "touchstart") {
          Browser.lastTouches[touch
            .identifier] = coords;
          Browser.touches[touch
            .identifier] = coords
        } else if (event.type ===
          "touchend" || event.type ===
          "touchmove") {
          var last = Browser.touches[
            touch.identifier];
          last ||= coords;
          Browser.lastTouches[touch
            .identifier] = last;
          Browser.touches[touch
            .identifier] = coords
        }
        return
      }
      Browser.setMouseCoords(event
        .pageX, event.pageY)
    }
  }
  , resizeListeners: []
  , updateResizeListeners() {
    var canvas = Module["canvas"];
    Browser.resizeListeners.forEach(
      listener => listener(canvas
        .width, canvas.height))
  }
  , setCanvasSize(width, height,
    noUpdates) {
    var canvas = Module["canvas"];
    Browser.updateCanvasDimensions(
      canvas, width, height);
    if (!noUpdates) Browser
      .updateResizeListeners()
  }
  , windowedWidth: 0
  , windowedHeight: 0
  , setFullscreenCanvasSize() {
    if (typeof SDL != "undefined") {
      var flags = HEAPU32[SDL
        .screen >> 2];
      flags = flags | 8388608;
      HEAP32[SDL.screen >> 2] = flags
    }
    Browser.updateCanvasDimensions(
      Module["canvas"]);
    Browser.updateResizeListeners()
  }
  , setWindowedCanvasSize() {
    if (typeof SDL != "undefined") {
      var flags = HEAPU32[SDL
        .screen >> 2];
      flags = flags & ~8388608;
      HEAP32[SDL.screen >> 2] = flags
    }
    Browser.updateCanvasDimensions(
      Module["canvas"]);
    Browser.updateResizeListeners()
  }
  , updateCanvasDimensions(canvas,
    wNative, hNative) {
    if (wNative && hNative) {
      canvas.widthNative = wNative;
      canvas.heightNative = hNative
    } else {
      wNative = canvas.widthNative;
      hNative = canvas.heightNative
    }
    var w = wNative;
    var h = hNative;
    if (Module["forcedAspectRatio"] &&
      Module["forcedAspectRatio"] > 0
      ) {
      if (w / h < Module[
          "forcedAspectRatio"]) {
        w = Math.round(h * Module[
          "forcedAspectRatio"])
      } else {
        h = Math.round(w / Module[
          "forcedAspectRatio"])
      }
    }
    if ((document[
        "fullscreenElement"] ||
        document[
          "mozFullScreenElement"] ||
        document[
          "msFullscreenElement"] ||
        document[
          "webkitFullscreenElement"
          ] || document[
          "webkitCurrentFullScreenElement"
          ]) === canvas.parentNode &&
      typeof screen != "undefined") {
      var factor = Math.min(screen
        .width / w, screen.height /
        h);
      w = Math.round(w * factor);
      h = Math.round(h * factor)
    }
    if (Browser.resizeCanvas) {
      if (canvas.width != w) canvas
        .width = w;
      if (canvas.height != h) canvas
        .height = h;
      if (typeof canvas.style !=
        "undefined") {
        canvas.style.removeProperty(
          "width");
        canvas.style.removeProperty(
          "height")
      }
    } else {
      if (canvas.width != wNative)
        canvas.width = wNative;
      if (canvas.height != hNative)
        canvas.height = hNative;
      if (typeof canvas.style !=
        "undefined") {
        if (w != wNative || h !=
          hNative) {
          canvas.style.setProperty(
            "width", w + "px",
            "important");
          canvas.style.setProperty(
            "height", h + "px",
            "important")
        } else {
          canvas.style.removeProperty(
            "width");
          canvas.style.removeProperty(
            "height")
        }
      }
    }
  }
};
var AL = {
  QUEUE_INTERVAL: 25
  , QUEUE_LOOKAHEAD: .1
  , DEVICE_NAME: "Emscripten OpenAL"
  , CAPTURE_DEVICE_NAME: "Emscripten OpenAL capture"
  , ALC_EXTENSIONS: {
    ALC_SOFT_pause_device: true
    , ALC_SOFT_HRTF: true
  }
  , AL_EXTENSIONS: {
    AL_EXT_float32: true
    , AL_SOFT_loop_points: true
    , AL_SOFT_source_length: true
    , AL_EXT_source_distance_model: true
    , AL_SOFT_source_spatialize: true
  }
  , _alcErr: 0
  , alcErr: 0
  , deviceRefCounts: {}
  , alcStringCache: {}
  , paused: false
  , stringCache: {}
  , contexts: {}
  , currentCtx: null
  , buffers: {
    0: {
      id: 0
      , refCount: 0
      , audioBuf: null
      , frequency: 0
      , bytesPerSample: 2
      , channels: 1
      , length: 0
    }
  }
  , paramArray: []
  , _nextId: 1
  , newId: () => AL.freeIds.length >
    0 ? AL.freeIds.pop() : AL
    ._nextId++
  , freeIds: []
  , scheduleContextAudio: ctx => {
    if (Browser.mainLoop
      .timingMode === 1 && document[
        "visibilityState"] !=
      "visible") {
      return
    }
    for (var i in ctx.sources) {
      AL.scheduleSourceAudio(ctx
        .sources[i])
    }
  }
  , scheduleSourceAudio: (src,
    lookahead) => {
    if (Browser.mainLoop
      .timingMode === 1 && document[
        "visibilityState"] !=
      "visible") {
      return
    }
    if (src.state !== 4114) {
      return
    }
    var currentTime = AL
      .updateSourceTime(src);
    var startTime = src
    .bufStartTime;
    var startOffset = src.bufOffset;
    var bufCursor = src
      .bufsProcessed;
    for (var i = 0; i < src
      .audioQueue.length; i++) {
      var audioSrc = src.audioQueue[
        i];
      startTime = audioSrc
        ._startTime + audioSrc
        ._duration;
      startOffset = 0;
      bufCursor += audioSrc
        ._skipCount + 1
    }
    if (!lookahead) {
      lookahead = AL.QUEUE_LOOKAHEAD
    }
    var lookaheadTime =
      currentTime + lookahead;
    var skipCount = 0;
    while (startTime <
      lookaheadTime) {
      if (bufCursor >= src.bufQueue
        .length) {
        if (src.looping) {
          bufCursor %= src.bufQueue
            .length
        } else {
          break
        }
      }
      var buf = src.bufQueue[
        bufCursor % src.bufQueue
        .length];
      if (buf.length === 0) {
        skipCount++;
        if (skipCount === src
          .bufQueue.length) {
          break
        }
      } else {
        var audioSrc = src.context
          .audioCtx
          .createBufferSource();
        audioSrc.buffer = buf
          .audioBuf;
        audioSrc.playbackRate
          .value = src.playbackRate;
        if (buf.audioBuf
          ._loopStart || buf
          .audioBuf._loopEnd) {
          audioSrc.loopStart = buf
            .audioBuf._loopStart;
          audioSrc.loopEnd = buf
            .audioBuf._loopEnd
        }
        var duration = 0;
        if (src.type === 4136 && src
          .looping) {
          duration = Number
            .POSITIVE_INFINITY;
          audioSrc.loop = true;
          if (buf.audioBuf
            ._loopStart) {
            audioSrc.loopStart = buf
              .audioBuf._loopStart
          }
          if (buf.audioBuf
            ._loopEnd) {
            audioSrc.loopEnd = buf
              .audioBuf._loopEnd
          }
        } else {
          duration = (buf.audioBuf
              .duration -
              startOffset) / src
            .playbackRate
        }
        audioSrc._startOffset =
          startOffset;
        audioSrc._duration =
          duration;
        audioSrc._skipCount =
          skipCount;
        skipCount = 0;
        audioSrc.connect(src.gain);
        if (typeof audioSrc.start !=
          "undefined") {
          startTime = Math.max(
            startTime, src.context
            .audioCtx.currentTime);
          audioSrc.start(startTime,
            startOffset)
        } else if (typeof audioSrc
          .noteOn != "undefined") {
          startTime = Math.max(
            startTime, src.context
            .audioCtx.currentTime);
          audioSrc.noteOn(startTime)
        }
        audioSrc._startTime =
          startTime;
        src.audioQueue.push(
          audioSrc);
        startTime += duration
      }
      startOffset = 0;
      bufCursor++
    }
  }
  , updateSourceTime: src => {
    var currentTime = src.context
      .audioCtx.currentTime;
    if (src.state !== 4114) {
      return currentTime
    }
    if (!isFinite(src
      .bufStartTime)) {
      src.bufStartTime =
        currentTime - src
        .bufOffset / src
        .playbackRate;
      src.bufOffset = 0
    }
    var nextStartTime = 0;
    while (src.audioQueue.length) {
      var audioSrc = src.audioQueue[
        0];
      src.bufsProcessed += audioSrc
        ._skipCount;
      nextStartTime = audioSrc
        ._startTime + audioSrc
        ._duration;
      if (currentTime <
        nextStartTime) {
        break
      }
      src.audioQueue.shift();
      src.bufStartTime =
        nextStartTime;
      src.bufOffset = 0;
      src.bufsProcessed++
    }
    if (src.bufsProcessed >= src
      .bufQueue.length && !src
      .looping) {
      AL.setSourceState(src, 4116)
    } else if (src.type === 4136 &&
      src.looping) {
      var buf = src.bufQueue[0];
      if (buf.length === 0) {
        src.bufOffset = 0
      } else {
        var delta = (currentTime -
            src.bufStartTime) * src
          .playbackRate;
        var loopStart = buf.audioBuf
          ._loopStart || 0;
        var loopEnd = buf.audioBuf
          ._loopEnd || buf.audioBuf
          .duration;
        if (loopEnd <= loopStart) {
          loopEnd = buf.audioBuf
            .duration
        }
        if (delta < loopEnd) {
          src.bufOffset = delta
        } else {
          src.bufOffset =
            loopStart + (delta -
              loopStart) % (
              loopEnd - loopStart)
        }
      }
    } else if (src.audioQueue[0]) {
      src.bufOffset = (currentTime -
          src.audioQueue[0]
          ._startTime) * src
        .playbackRate
    } else {
      if (src.type !== 4136 && src
        .looping) {
        var srcDuration = AL
          .sourceDuration(src) / src
          .playbackRate;
        if (srcDuration > 0) {
          src.bufStartTime += Math
            .floor((currentTime -
                src.bufStartTime) /
              srcDuration) *
            srcDuration
        }
      }
      for (var i = 0; i < src
        .bufQueue.length; i++) {
        if (src.bufsProcessed >= src
          .bufQueue.length) {
          if (src.looping) {
            src.bufsProcessed %= src
              .bufQueue.length
          } else {
            AL.setSourceState(src,
              4116);
            break
          }
        }
        var buf = src.bufQueue[src
          .bufsProcessed];
        if (buf.length > 0) {
          nextStartTime = src
            .bufStartTime + buf
            .audioBuf.duration / src
            .playbackRate;
          if (currentTime <
            nextStartTime) {
            src.bufOffset = (
                currentTime - src
                .bufStartTime) * src
              .playbackRate;
            break
          }
          src.bufStartTime =
            nextStartTime
        }
        src.bufOffset = 0;
        src.bufsProcessed++
      }
    }
    return currentTime
  }
  , cancelPendingSourceAudio: src => {
    AL.updateSourceTime(src);
    for (var i = 1; i < src
      .audioQueue.length; i++) {
      var audioSrc = src.audioQueue[
        i];
      audioSrc.stop()
    }
    if (src.audioQueue.length > 1) {
      src.audioQueue.length = 1
    }
  }
  , stopSourceAudio: src => {
    for (var i = 0; i < src
      .audioQueue.length; i++) {
      src.audioQueue[i].stop()
    }
    src.audioQueue.length = 0
  }
  , setSourceState: (src, state) => {
    if (state === 4114) {
      if (src.state === 4114 || src
        .state == 4116) {
        src.bufsProcessed = 0;
        src.bufOffset = 0
      } else {}
      AL.stopSourceAudio(src);
      src.state = 4114;
      src.bufStartTime = Number
        .NEGATIVE_INFINITY;
      AL.scheduleSourceAudio(src)
    } else if (state === 4115) {
      if (src.state === 4114) {
        AL.updateSourceTime(src);
        AL.stopSourceAudio(src);
        src.state = 4115
      }
    } else if (state === 4116) {
      if (src.state !== 4113) {
        src.state = 4116;
        src.bufsProcessed = src
          .bufQueue.length;
        src.bufStartTime = Number
          .NEGATIVE_INFINITY;
        src.bufOffset = 0;
        AL.stopSourceAudio(src)
      }
    } else if (state === 4113) {
      if (src.state !== 4113) {
        src.state = 4113;
        src.bufsProcessed = 0;
        src.bufStartTime = Number
          .NEGATIVE_INFINITY;
        src.bufOffset = 0;
        AL.stopSourceAudio(src)
      }
    }
  }
  , initSourcePanner: src => {
    if (src.type === 4144) {
      return
    }
    var templateBuf = AL.buffers[0];
    for (var i = 0; i < src.bufQueue
      .length; i++) {
      if (src.bufQueue[i].id !==
        0) {
        templateBuf = src.bufQueue[
          i];
        break
      }
    }
    if (src.spatialize === 1 || src
      .spatialize === 2 &&
      templateBuf.channels === 1) {
      if (src.panner) {
        return
      }
      src.panner = src.context
        .audioCtx.createPanner();
      AL.updateSourceGlobal(src);
      AL.updateSourceSpace(src);
      src.panner.connect(src.context
        .gain);
      src.gain.disconnect();
      src.gain.connect(src.panner)
    } else {
      if (!src.panner) {
        return
      }
      src.panner.disconnect();
      src.gain.disconnect();
      src.gain.connect(src.context
        .gain);
      src.panner = null
    }
  }
  , updateContextGlobal: ctx => {
    for (var i in ctx.sources) {
      AL.updateSourceGlobal(ctx
        .sources[i])
    }
  }
  , updateSourceGlobal: src => {
    var panner = src.panner;
    if (!panner) {
      return
    }
    panner.refDistance = src
      .refDistance;
    panner.maxDistance = src
      .maxDistance;
    panner.rolloffFactor = src
      .rolloffFactor;
    panner.panningModel = src
      .context.hrtf ? "HRTF" :
      "equalpower";
    var distanceModel = src.context
      .sourceDistanceModel ? src
      .distanceModel : src.context
      .distanceModel;
    switch (distanceModel) {
      case 0:
        panner.distanceModel =
          "inverse";
        panner.refDistance =
          340282e33;
        break;
      case 53249:
      case 53250:
        panner.distanceModel =
          "inverse";
        break;
      case 53251:
      case 53252:
        panner.distanceModel =
          "linear";
        break;
      case 53253:
      case 53254:
        panner.distanceModel =
          "exponential";
        break
    }
  }
  , updateListenerSpace: ctx => {
    var listener = ctx.audioCtx
      .listener;
    if (listener.positionX) {
      listener.positionX.value = ctx
        .listener.position[0];
      listener.positionY.value = ctx
        .listener.position[1];
      listener.positionZ.value = ctx
        .listener.position[2]
    } else {
      listener.setPosition(ctx
        .listener.position[0], ctx
        .listener.position[1], ctx
        .listener.position[2])
    }
    if (listener.forwardX) {
      listener.forwardX.value = ctx
        .listener.direction[0];
      listener.forwardY.value = ctx
        .listener.direction[1];
      listener.forwardZ.value = ctx
        .listener.direction[2];
      listener.upX.value = ctx
        .listener.up[0];
      listener.upY.value = ctx
        .listener.up[1];
      listener.upZ.value = ctx
        .listener.up[2]
    } else {
      listener.setOrientation(ctx
        .listener.direction[0],
        ctx.listener.direction[1],
        ctx.listener.direction[2],
        ctx.listener.up[0], ctx
        .listener.up[1], ctx
        .listener.up[2])
    }
    for (var i in ctx.sources) {
      AL.updateSourceSpace(ctx
        .sources[i])
    }
  }
  , updateSourceSpace: src => {
    if (!src.panner) {
      return
    }
    var panner = src.panner;
    var posX = src.position[0];
    var posY = src.position[1];
    var posZ = src.position[2];
    var dirX = src.direction[0];
    var dirY = src.direction[1];
    var dirZ = src.direction[2];
    var listener = src.context
      .listener;
    var lPosX = listener.position[
    0];
    var lPosY = listener.position[
    1];
    var lPosZ = listener.position[
    2];
    if (src.relative) {
      var lBackX = -listener
        .direction[0];
      var lBackY = -listener
        .direction[1];
      var lBackZ = -listener
        .direction[2];
      var lUpX = listener.up[0];
      var lUpY = listener.up[1];
      var lUpZ = listener.up[2];
      var inverseMagnitude = (x, y,
        z) => {
        var length = Math.sqrt(x *
          x + y * y + z * z);
        if (length < Number
          .EPSILON) {
          return 0
        }
        return 1 / length
      };
      var invMag = inverseMagnitude(
        lBackX, lBackY, lBackZ);
      lBackX *= invMag;
      lBackY *= invMag;
      lBackZ *= invMag;
      invMag = inverseMagnitude(
        lUpX, lUpY, lUpZ);
      lUpX *= invMag;
      lUpY *= invMag;
      lUpZ *= invMag;
      var lRightX = lUpY * lBackZ -
        lUpZ * lBackY;
      var lRightY = lUpZ * lBackX -
        lUpX * lBackZ;
      var lRightZ = lUpX * lBackY -
        lUpY * lBackX;
      invMag = inverseMagnitude(
        lRightX, lRightY, lRightZ);
      lRightX *= invMag;
      lRightY *= invMag;
      lRightZ *= invMag;
      lUpX = lBackY * lRightZ -
        lBackZ * lRightY;
      lUpY = lBackZ * lRightX -
        lBackX * lRightZ;
      lUpZ = lBackX * lRightY -
        lBackY * lRightX;
      var oldX = dirX;
      var oldY = dirY;
      var oldZ = dirZ;
      dirX = oldX * lRightX + oldY *
        lUpX + oldZ * lBackX;
      dirY = oldX * lRightY + oldY *
        lUpY + oldZ * lBackY;
      dirZ = oldX * lRightZ + oldY *
        lUpZ + oldZ * lBackZ;
      oldX = posX;
      oldY = posY;
      oldZ = posZ;
      posX = oldX * lRightX + oldY *
        lUpX + oldZ * lBackX;
      posY = oldX * lRightY + oldY *
        lUpY + oldZ * lBackY;
      posZ = oldX * lRightZ + oldY *
        lUpZ + oldZ * lBackZ;
      posX += lPosX;
      posY += lPosY;
      posZ += lPosZ
    }
    if (panner.positionX) {
      if (posX != panner.positionX
        .value) panner.positionX
        .value = posX;
      if (posY != panner.positionY
        .value) panner.positionY
        .value = posY;
      if (posZ != panner.positionZ
        .value) panner.positionZ
        .value = posZ
    } else {
      panner.setPosition(posX, posY,
        posZ)
    }
    if (panner.orientationX) {
      if (dirX != panner
        .orientationX.value) panner
        .orientationX.value = dirX;
      if (dirY != panner
        .orientationY.value) panner
        .orientationY.value = dirY;
      if (dirZ != panner
        .orientationZ.value) panner
        .orientationZ.value = dirZ
    } else {
      panner.setOrientation(dirX,
        dirY, dirZ)
    }
    var oldShift = src.dopplerShift;
    var velX = src.velocity[0];
    var velY = src.velocity[1];
    var velZ = src.velocity[2];
    var lVelX = listener.velocity[
    0];
    var lVelY = listener.velocity[
    1];
    var lVelZ = listener.velocity[
    2];
    if (posX === lPosX && posY ===
      lPosY && posZ === lPosZ ||
      velX === lVelX && velY ===
      lVelY && velZ === lVelZ) {
      src.dopplerShift = 1
    } else {
      var speedOfSound = src.context
        .speedOfSound;
      var dopplerFactor = src
        .context.dopplerFactor;
      var slX = lPosX - posX;
      var slY = lPosY - posY;
      var slZ = lPosZ - posZ;
      var magSl = Math.sqrt(slX *
        slX + slY * slY + slZ *
        slZ);
      var vls = (slX * lVelX + slY *
          lVelY + slZ * lVelZ) /
        magSl;
      var vss = (slX * velX + slY *
        velY + slZ * velZ) / magSl;
      vls = Math.min(vls,
        speedOfSound /
        dopplerFactor);
      vss = Math.min(vss,
        speedOfSound /
        dopplerFactor);
      src.dopplerShift = (
        speedOfSound -
        dopplerFactor * vls) / (
        speedOfSound -
        dopplerFactor * vss)
    }
    if (src.dopplerShift !==
      oldShift) {
      AL.updateSourceRate(src)
    }
  }
  , updateSourceRate: src => {
    if (src.state === 4114) {
      AL.cancelPendingSourceAudio(
        src);
      var audioSrc = src.audioQueue[
        0];
      if (!audioSrc) {
        return
      }
      var duration;
      if (src.type === 4136 && src
        .looping) {
        duration = Number
          .POSITIVE_INFINITY
      } else {
        duration = (audioSrc.buffer
            .duration - audioSrc
            ._startOffset) / src
          .playbackRate
      }
      audioSrc._duration = duration;
      audioSrc.playbackRate.value =
        src.playbackRate;
      AL.scheduleSourceAudio(src)
    }
  }
  , sourceDuration: src => {
    var length = 0;
    for (var i = 0; i < src.bufQueue
      .length; i++) {
      var audioBuf = src.bufQueue[i]
        .audioBuf;
      length += audioBuf ? audioBuf
        .duration : 0
    }
    return length
  }
  , sourceTell: src => {
    AL.updateSourceTime(src);
    var offset = 0;
    for (var i = 0; i < src
      .bufsProcessed; i++) {
      if (src.bufQueue[i]
        .audioBuf) {
        offset += src.bufQueue[i]
          .audioBuf.duration
      }
    }
    offset += src.bufOffset;
    return offset
  }
  , sourceSeek: (src, offset) => {
    var playing = src.state == 4114;
    if (playing) {
      AL.setSourceState(src, 4113)
    }
    if (src.bufQueue[src
        .bufsProcessed].audioBuf !==
      null) {
      src.bufsProcessed = 0;
      while (offset > src.bufQueue[
          src.bufsProcessed]
        .audioBuf.duration) {
        offset -= src.bufQueue[src
            .bufsProcessed].audiobuf
          .duration;
        src.bufsProcessed++
      }
      src.bufOffset = offset
    }
    if (playing) {
      AL.setSourceState(src, 4114)
    }
  }
  , getGlobalParam: (funcname,
    param) => {
      if (!AL.currentCtx) {
        return null
      }
      switch (param) {
        case 49152:
          return AL.currentCtx
            .dopplerFactor;
        case 49155:
          return AL.currentCtx
            .speedOfSound;
        case 53248:
          return AL.currentCtx
            .distanceModel;
        default:
          AL.currentCtx.err = 40962;
          return null
      }
    }
  , setGlobalParam: (funcname, param,
    value) => {
    if (!AL.currentCtx) {
      return
    }
    switch (param) {
      case 49152:
        if (!Number.isFinite(
          value) || value < 0) {
          AL.currentCtx.err = 40963;
          return
        }
        AL.currentCtx
          .dopplerFactor = value;
        AL.updateListenerSpace(AL
          .currentCtx);
        break;
      case 49155:
        if (!Number.isFinite(
          value) || value <= 0) {
          AL.currentCtx.err = 40963;
          return
        }
        AL.currentCtx.speedOfSound =
          value;
        AL.updateListenerSpace(AL
          .currentCtx);
        break;
      case 53248:
        switch (value) {
          case 0:
          case 53249:
          case 53250:
          case 53251:
          case 53252:
          case 53253:
          case 53254:
            AL.currentCtx
              .distanceModel =
              value;
            AL.updateContextGlobal(
              AL.currentCtx);
            break;
          default:
            AL.currentCtx.err =
              40963;
            return
        }
        break;
      default:
        AL.currentCtx.err = 40962;
        return
    }
  }
  , getListenerParam: (funcname,
    param) => {
    if (!AL.currentCtx) {
      return null
    }
    switch (param) {
      case 4100:
        return AL.currentCtx
          .listener.position;
      case 4102:
        return AL.currentCtx
          .listener.velocity;
      case 4111:
        return AL.currentCtx
          .listener.direction
          .concat(AL.currentCtx
            .listener.up);
      case 4106:
        return AL.currentCtx.gain
          .gain.value;
      default:
        AL.currentCtx.err = 40962;
        return null
    }
  }
  , setListenerParam: (funcname,
    param, value) => {
    if (!AL.currentCtx) {
      return
    }
    if (value === null) {
      AL.currentCtx.err = 40962;
      return
    }
    var listener = AL.currentCtx
      .listener;
    switch (param) {
      case 4100:
        if (!Number.isFinite(value[
            0]) || !Number.isFinite(
            value[1]) || !Number
          .isFinite(value[2])) {
          AL.currentCtx.err = 40963;
          return
        }
        listener.position[0] =
          value[0];
        listener.position[1] =
          value[1];
        listener.position[2] =
          value[2];
        AL.updateListenerSpace(AL
          .currentCtx);
        break;
      case 4102:
        if (!Number.isFinite(value[
            0]) || !Number.isFinite(
            value[1]) || !Number
          .isFinite(value[2])) {
          AL.currentCtx.err = 40963;
          return
        }
        listener.velocity[0] =
          value[0];
        listener.velocity[1] =
          value[1];
        listener.velocity[2] =
          value[2];
        AL.updateListenerSpace(AL
          .currentCtx);
        break;
      case 4106:
        if (!Number.isFinite(
          value) || value < 0) {
          AL.currentCtx.err = 40963;
          return
        }
        AL.currentCtx.gain.gain
          .value = value;
        break;
      case 4111:
        if (!Number.isFinite(value[
            0]) || !Number.isFinite(
            value[1]) || !Number
          .isFinite(value[2]) || !
          Number.isFinite(value[
          3]) || !Number.isFinite(
            value[4]) || !Number
          .isFinite(value[5])) {
          AL.currentCtx.err = 40963;
          return
        }
        listener.direction[0] =
          value[0];
        listener.direction[1] =
          value[1];
        listener.direction[2] =
          value[2];
        listener.up[0] = value[3];
        listener.up[1] = value[4];
        listener.up[2] = value[5];
        AL.updateListenerSpace(AL
          .currentCtx);
        break;
      default:
        AL.currentCtx.err = 40962;
        return
    }
  }
  , getBufferParam: (funcname,
    bufferId, param) => {
    if (!AL.currentCtx) {
      return
    }
    var buf = AL.buffers[bufferId];
    if (!buf || bufferId === 0) {
      AL.currentCtx.err = 40961;
      return
    }
    switch (param) {
      case 8193:
        return buf.frequency;
      case 8194:
        return buf.bytesPerSample *
          8;
      case 8195:
        return buf.channels;
      case 8196:
        return buf.length * buf
          .bytesPerSample * buf
          .channels;
      case 8213:
        if (buf.length === 0) {
          return [0, 0]
        }
        return [(buf.audioBuf
            ._loopStart || 0) *
          buf.frequency, (buf
            .audioBuf._loopEnd ||
            buf.length) * buf
          .frequency
        ];
      default:
        AL.currentCtx.err = 40962;
        return null
    }
  }
  , setBufferParam: (funcname,
    bufferId, param, value) => {
    if (!AL.currentCtx) {
      return
    }
    var buf = AL.buffers[bufferId];
    if (!buf || bufferId === 0) {
      AL.currentCtx.err = 40961;
      return
    }
    if (value === null) {
      AL.currentCtx.err = 40962;
      return
    }
    switch (param) {
      case 8196:
        if (value !== 0) {
          AL.currentCtx.err = 40963;
          return
        }
        break;
      case 8213:
        if (value[0] < 0 || value[
          0] > buf.length || value[
            1] < 0 || value[1] > buf
          .Length || value[0] >=
          value[1]) {
          AL.currentCtx.err = 40963;
          return
        }
        if (buf.refCount > 0) {
          AL.currentCtx.err = 40964;
          return
        }
        if (buf.audioBuf) {
          buf.audioBuf._loopStart =
            value[0] / buf
            .frequency;
          buf.audioBuf._loopEnd =
            value[1] / buf.frequency
        }
        break;
      default:
        AL.currentCtx.err = 40962;
        return
    }
  }
  , getSourceParam: (funcname,
    sourceId, param) => {
    if (!AL.currentCtx) {
      return null
    }
    var src = AL.currentCtx.sources[
      sourceId];
    if (!src) {
      AL.currentCtx.err = 40961;
      return null
    }
    switch (param) {
      case 514:
        return src.relative;
      case 4097:
        return src.coneInnerAngle;
      case 4098:
        return src.coneOuterAngle;
      case 4099:
        return src.pitch;
      case 4100:
        return src.position;
      case 4101:
        return src.direction;
      case 4102:
        return src.velocity;
      case 4103:
        return src.looping;
      case 4105:
        if (src.type === 4136) {
          return src.bufQueue[0].id
        }
        return 0;
      case 4106:
        return src.gain.gain.value;
      case 4109:
        return src.minGain;
      case 4110:
        return src.maxGain;
      case 4112:
        return src.state;
      case 4117:
        if (src.bufQueue.length ===
          1 && src.bufQueue[0]
          .id === 0) {
          return 0
        }
        return src.bufQueue.length;
      case 4118:
        if (src.bufQueue.length ===
          1 && src.bufQueue[0]
          .id === 0 || src.looping
          ) {
          return 0
        }
        return src.bufsProcessed;
      case 4128:
        return src.refDistance;
      case 4129:
        return src.rolloffFactor;
      case 4130:
        return src.coneOuterGain;
      case 4131:
        return src.maxDistance;
      case 4132:
        return AL.sourceTell(src);
      case 4133:
        var offset = AL.sourceTell(
          src);
        if (offset > 0) {
          offset *= src.bufQueue[0]
            .frequency
        }
        return offset;
      case 4134:
        var offset = AL.sourceTell(
          src);
        if (offset > 0) {
          offset *= src.bufQueue[0]
            .frequency * src
            .bufQueue[0]
            .bytesPerSample
        }
        return offset;
      case 4135:
        return src.type;
      case 4628:
        return src.spatialize;
      case 8201:
        var length = 0;
        var bytesPerFrame = 0;
        for (var i = 0; i < src
          .bufQueue.length; i++) {
          length += src.bufQueue[i]
            .length;
          if (src.bufQueue[i].id !==
            0) {
            bytesPerFrame = src
              .bufQueue[i]
              .bytesPerSample * src
              .bufQueue[i].channels
          }
        }
        return length *
          bytesPerFrame;
      case 8202:
        var length = 0;
        for (var i = 0; i < src
          .bufQueue.length; i++) {
          length += src.bufQueue[i]
            .length
        }
        return length;
      case 8203:
        return AL.sourceDuration(
          src);
      case 53248:
        return src.distanceModel;
      default:
        AL.currentCtx.err = 40962;
        return null
    }
  }
  , setSourceParam: (funcname,
    sourceId, param, value) => {
    if (!AL.currentCtx) {
      return
    }
    var src = AL.currentCtx.sources[
      sourceId];
    if (!src) {
      AL.currentCtx.err = 40961;
      return
    }
    if (value === null) {
      AL.currentCtx.err = 40962;
      return
    }
    switch (param) {
      case 514:
        if (value === 1) {
          src.relative = true;
          AL.updateSourceSpace(src)
        } else if (value === 0) {
          src.relative = false;
          AL.updateSourceSpace(src)
        } else {
          AL.currentCtx.err = 40963;
          return
        }
        break;
      case 4097:
        if (!Number.isFinite(
          value)) {
          AL.currentCtx.err = 40963;
          return
        }
        src.coneInnerAngle = value;
        if (src.panner) {
          src.panner
            .coneInnerAngle =
            value % 360
        }
        break;
      case 4098:
        if (!Number.isFinite(
          value)) {
          AL.currentCtx.err = 40963;
          return
        }
        src.coneOuterAngle = value;
        if (src.panner) {
          src.panner
            .coneOuterAngle =
            value % 360
        }
        break;
      case 4099:
        if (!Number.isFinite(
          value) || value <= 0) {
          AL.currentCtx.err = 40963;
          return
        }
        if (src.pitch === value) {
          break
        }
        src.pitch = value;
        AL.updateSourceRate(src);
        break;
      case 4100:
        if (!Number.isFinite(value[
            0]) || !Number.isFinite(
            value[1]) || !Number
          .isFinite(value[2])) {
          AL.currentCtx.err = 40963;
          return
        }
        src.position[0] = value[0];
        src.position[1] = value[1];
        src.position[2] = value[2];
        AL.updateSourceSpace(src);
        break;
      case 4101:
        if (!Number.isFinite(value[
            0]) || !Number.isFinite(
            value[1]) || !Number
          .isFinite(value[2])) {
          AL.currentCtx.err = 40963;
          return
        }
        src.direction[0] = value[0];
        src.direction[1] = value[1];
        src.direction[2] = value[2];
        AL.updateSourceSpace(src);
        break;
      case 4102:
        if (!Number.isFinite(value[
            0]) || !Number.isFinite(
            value[1]) || !Number
          .isFinite(value[2])) {
          AL.currentCtx.err = 40963;
          return
        }
        src.velocity[0] = value[0];
        src.velocity[1] = value[1];
        src.velocity[2] = value[2];
        AL.updateSourceSpace(src);
        break;
      case 4103:
        if (value === 1) {
          src.looping = true;
          AL.updateSourceTime(src);
          if (src.type === 4136 &&
            src.audioQueue.length >
            0) {
            var audioSrc = src
              .audioQueue[0];
            audioSrc.loop = true;
            audioSrc._duration =
              Number
              .POSITIVE_INFINITY
          }
        } else if (value === 0) {
          src.looping = false;
          var currentTime = AL
            .updateSourceTime(src);
          if (src.type === 4136 &&
            src.audioQueue.length >
            0) {
            var audioSrc = src
              .audioQueue[0];
            audioSrc.loop = false;
            audioSrc._duration = src
              .bufQueue[0].audioBuf
              .duration / src
              .playbackRate;
            audioSrc._startTime =
              currentTime - src
              .bufOffset / src
              .playbackRate
          }
        } else {
          AL.currentCtx.err = 40963;
          return
        }
        break;
      case 4105:
        if (src.state === 4114 ||
          src.state === 4115) {
          AL.currentCtx.err = 40964;
          return
        }
        if (value === 0) {
          for (var i in src
            .bufQueue) {
            src.bufQueue[i]
              .refCount--
          }
          src.bufQueue.length = 1;
          src.bufQueue[0] = AL
            .buffers[0];
          src.bufsProcessed = 0;
          src.type = 4144
        } else {
          var buf = AL.buffers[
            value];
          if (!buf) {
            AL.currentCtx.err =
              40963;
            return
          }
          for (var i in src
            .bufQueue) {
            src.bufQueue[i]
              .refCount--
          }
          src.bufQueue.length = 0;
          buf.refCount++;
          src.bufQueue = [buf];
          src.bufsProcessed = 0;
          src.type = 4136
        }
        AL.initSourcePanner(src);
        AL.scheduleSourceAudio(src);
        break;
      case 4106:
        if (!Number.isFinite(
          value) || value < 0) {
          AL.currentCtx.err = 40963;
          return
        }
        src.gain.gain.value = value;
        break;
      case 4109:
        if (!Number.isFinite(
          value) || value < 0 ||
          value > Math.min(src
            .maxGain, 1)) {
          AL.currentCtx.err = 40963;
          return
        }
        src.minGain = value;
        break;
      case 4110:
        if (!Number.isFinite(
          value) || value < Math
          .max(0, src.minGain) ||
          value > 1) {
          AL.currentCtx.err = 40963;
          return
        }
        src.maxGain = value;
        break;
      case 4128:
        if (!Number.isFinite(
          value) || value < 0) {
          AL.currentCtx.err = 40963;
          return
        }
        src.refDistance = value;
        if (src.panner) {
          src.panner.refDistance =
            value
        }
        break;
      case 4129:
        if (!Number.isFinite(
          value) || value < 0) {
          AL.currentCtx.err = 40963;
          return
        }
        src.rolloffFactor = value;
        if (src.panner) {
          src.panner.rolloffFactor =
            value
        }
        break;
      case 4130:
        if (!Number.isFinite(
          value) || value < 0 ||
          value > 1) {
          AL.currentCtx.err = 40963;
          return
        }
        src.coneOuterGain = value;
        if (src.panner) {
          src.panner.coneOuterGain =
            value
        }
        break;
      case 4131:
        if (!Number.isFinite(
          value) || value < 0) {
          AL.currentCtx.err = 40963;
          return
        }
        src.maxDistance = value;
        if (src.panner) {
          src.panner.maxDistance =
            value
        }
        break;
      case 4132:
        if (value < 0 || value > AL
          .sourceDuration(src)) {
          AL.currentCtx.err = 40963;
          return
        }
        AL.sourceSeek(src, value);
        break;
      case 4133:
        var srcLen = AL
          .sourceDuration(src);
        if (srcLen > 0) {
          var frequency;
          for (var bufId in src
              .bufQueue) {
            if (bufId) {
              frequency = src
                .bufQueue[bufId]
                .frequency;
              break
            }
          }
          value /= frequency
        }
        if (value < 0 || value >
          srcLen) {
          AL.currentCtx.err = 40963;
          return
        }
        AL.sourceSeek(src, value);
        break;
      case 4134:
        var srcLen = AL
          .sourceDuration(src);
        if (srcLen > 0) {
          var bytesPerSec;
          for (var bufId in src
              .bufQueue) {
            if (bufId) {
              var buf = src
                .bufQueue[bufId];
              bytesPerSec = buf
                .frequency * buf
                .bytesPerSample *
                buf.channels;
              break
            }
          }
          value /= bytesPerSec
        }
        if (value < 0 || value >
          srcLen) {
          AL.currentCtx.err = 40963;
          return
        }
        AL.sourceSeek(src, value);
        break;
      case 4628:
        if (value !== 0 && value !==
          1 && value !== 2) {
          AL.currentCtx.err = 40963;
          return
        }
        src.spatialize = value;
        AL.initSourcePanner(src);
        break;
      case 8201:
      case 8202:
      case 8203:
        AL.currentCtx.err = 40964;
        break;
      case 53248:
        switch (value) {
          case 0:
          case 53249:
          case 53250:
          case 53251:
          case 53252:
          case 53253:
          case 53254:
            src.distanceModel =
              value;
            if (AL.currentCtx
              .sourceDistanceModel
              ) {
              AL.updateContextGlobal(
                AL.currentCtx)
            }
            break;
          default:
            AL.currentCtx.err =
              40963;
            return
        }
        break;
      default:
        AL.currentCtx.err = 40962;
        return
    }
  }
  , captures: {}
  , sharedCaptureAudioCtx: null
  , requireValidCaptureDevice: (
    deviceId, funcname) => {
    if (deviceId === 0) {
      AL.alcErr = 40961;
      return null
    }
    var c = AL.captures[deviceId];
    if (!c) {
      AL.alcErr = 40961;
      return null
    }
    var err = c.mediaStreamError;
    if (err) {
      AL.alcErr = 40961;
      return null
    }
    return c
  }
};
var _alBufferData = (bufferId, format,
  pData, size, freq) => {
  if (!AL.currentCtx) {
    return
  }
  var buf = AL.buffers[bufferId];
  if (!buf) {
    AL.currentCtx.err = 40963;
    return
  }
  if (freq <= 0) {
    AL.currentCtx.err = 40963;
    return
  }
  var audioBuf = null;
  try {
    switch (format) {
      case 4352:
        if (size > 0) {
          audioBuf = AL.currentCtx
            .audioCtx.createBuffer(1,
              size, freq);
          var channel0 = audioBuf
            .getChannelData(0);
          for (var i = 0; i < size; ++
            i) {
            channel0[i] = HEAPU8[
                pData++] * .0078125 -
              1
          }
        }
        buf.bytesPerSample = 1;
        buf.channels = 1;
        buf.length = size;
        break;
      case 4353:
        if (size > 0) {
          audioBuf = AL.currentCtx
            .audioCtx.createBuffer(1,
              size >> 1, freq);
          var channel0 = audioBuf
            .getChannelData(0);
          pData >>= 1;
          for (var i = 0; i < size >>
            1; ++i) {
            channel0[i] = HEAP16[
                pData++] *
              30517578125e-15
          }
        }
        buf.bytesPerSample = 2;
        buf.channels = 1;
        buf.length = size >> 1;
        break;
      case 4354:
        if (size > 0) {
          audioBuf = AL.currentCtx
            .audioCtx.createBuffer(2,
              size >> 1, freq);
          var channel0 = audioBuf
            .getChannelData(0);
          var channel1 = audioBuf
            .getChannelData(1);
          for (var i = 0; i < size >>
            1; ++i) {
            channel0[i] = HEAPU8[
                pData++] * .0078125 -
              1;
            channel1[i] = HEAPU8[
                pData++] * .0078125 -
              1
          }
        }
        buf.bytesPerSample = 1;
        buf.channels = 2;
        buf.length = size >> 1;
        break;
      case 4355:
        if (size > 0) {
          audioBuf = AL.currentCtx
            .audioCtx.createBuffer(2,
              size >> 2, freq);
          var channel0 = audioBuf
            .getChannelData(0);
          var channel1 = audioBuf
            .getChannelData(1);
          pData >>= 1;
          for (var i = 0; i < size >>
            2; ++i) {
            channel0[i] = HEAP16[
                pData++] *
              30517578125e-15;
            channel1[i] = HEAP16[
                pData++] *
              30517578125e-15
          }
        }
        buf.bytesPerSample = 2;
        buf.channels = 2;
        buf.length = size >> 2;
        break;
      case 65552:
        if (size > 0) {
          audioBuf = AL.currentCtx
            .audioCtx.createBuffer(1,
              size >> 2, freq);
          var channel0 = audioBuf
            .getChannelData(0);
          pData >>= 2;
          for (var i = 0; i < size >>
            2; ++i) {
            channel0[i] = HEAPF32[
              pData++]
          }
        }
        buf.bytesPerSample = 4;
        buf.channels = 1;
        buf.length = size >> 2;
        break;
      case 65553:
        if (size > 0) {
          audioBuf = AL.currentCtx
            .audioCtx.createBuffer(2,
              size >> 3, freq);
          var channel0 = audioBuf
            .getChannelData(0);
          var channel1 = audioBuf
            .getChannelData(1);
          pData >>= 2;
          for (var i = 0; i < size >>
            3; ++i) {
            channel0[i] = HEAPF32[
              pData++];
            channel1[i] = HEAPF32[
              pData++]
          }
        }
        buf.bytesPerSample = 4;
        buf.channels = 2;
        buf.length = size >> 3;
        break;
      default:
        AL.currentCtx.err = 40963;
        return
    }
    buf.frequency = freq;
    buf.audioBuf = audioBuf
  } catch (e) {
    AL.currentCtx.err = 40963;
    return
  }
};
var _alDeleteBuffers = (count,
  pBufferIds) => {
  if (!AL.currentCtx) {
    return
  }
  for (var i = 0; i < count; ++i) {
    var bufId = HEAP32[pBufferIds +
      i * 4 >> 2];
    if (bufId === 0) {
      continue
    }
    if (!AL.buffers[bufId]) {
      AL.currentCtx.err = 40961;
      return
    }
    if (AL.buffers[bufId].refCount) {
      AL.currentCtx.err = 40964;
      return
    }
  }
  for (var i = 0; i < count; ++i) {
    var bufId = HEAP32[pBufferIds +
      i * 4 >> 2];
    if (bufId === 0) {
      continue
    }
    AL.deviceRefCounts[AL.buffers[
      bufId].deviceId]--;
    delete AL.buffers[bufId];
    AL.freeIds.push(bufId)
  }
};
var _alSourcei = (sourceId, param,
  value) => {
  switch (param) {
    case 514:
    case 4097:
    case 4098:
    case 4103:
    case 4105:
    case 4128:
    case 4129:
    case 4131:
    case 4132:
    case 4133:
    case 4134:
    case 4628:
    case 8201:
    case 8202:
    case 53248:
      AL.setSourceParam("alSourcei",
        sourceId, param, value);
      break;
    default:
      AL.setSourceParam("alSourcei",
        sourceId, param, null);
      break
  }
};
var _alDeleteSources = (count,
  pSourceIds) => {
  if (!AL.currentCtx) {
    return
  }
  for (var i = 0; i < count; ++i) {
    var srcId = HEAP32[pSourceIds +
      i * 4 >> 2];
    if (!AL.currentCtx.sources[
      srcId]) {
      AL.currentCtx.err = 40961;
      return
    }
  }
  for (var i = 0; i < count; ++i) {
    var srcId = HEAP32[pSourceIds +
      i * 4 >> 2];
    AL.setSourceState(AL.currentCtx
      .sources[srcId], 4116);
    _alSourcei(srcId, 4105, 0);
    delete AL.currentCtx.sources[
      srcId];
    AL.freeIds.push(srcId)
  }
};
var _alGenBuffers = (count,
  pBufferIds) => {
    if (!AL.currentCtx) {
      return
    }
    for (var i = 0; i < count; ++i) {
      var buf = {
        deviceId: AL.currentCtx
          .deviceId
        , id: AL.newId()
        , refCount: 0
        , audioBuf: null
        , frequency: 0
        , bytesPerSample: 2
        , channels: 1
        , length: 0
      };
      AL.deviceRefCounts[buf
      .deviceId]++;
      AL.buffers[buf.id] = buf;
      HEAP32[pBufferIds + i * 4 >> 2] =
        buf.id
    }
  };
var _alGenSources = (count,
  pSourceIds) => {
    if (!AL.currentCtx) {
      return
    }
    for (var i = 0; i < count; ++i) {
      var gain = AL.currentCtx.audioCtx
        .createGain();
      gain.connect(AL.currentCtx.gain);
      var src = {
        context: AL.currentCtx
        , id: AL.newId()
        , type: 4144
        , state: 4113
        , bufQueue: [AL.buffers[0]]
        , audioQueue: []
        , looping: false
        , pitch: 1
        , dopplerShift: 1
        , gain: gain
        , minGain: 0
        , maxGain: 1
        , panner: null
        , bufsProcessed: 0
        , bufStartTime: Number
          .NEGATIVE_INFINITY
        , bufOffset: 0
        , relative: false
        , refDistance: 1
        , maxDistance: 340282e33
        , rolloffFactor: 1
        , position: [0, 0, 0]
        , velocity: [0, 0, 0]
        , direction: [0, 0, 0]
        , coneOuterGain: 0
        , coneInnerAngle: 360
        , coneOuterAngle: 360
        , distanceModel: 53250
        , spatialize: 2
        , get playbackRate() {
          return this.pitch * this
            .dopplerShift
        }
      };
      AL.currentCtx.sources[src.id] =
        src;
      HEAP32[pSourceIds + i * 4 >> 2] =
        src.id
    }
  };
var _alGetError = () => {
  if (!AL.currentCtx) {
    return 40964
  }
  var err = AL.currentCtx.err;
  AL.currentCtx.err = 0;
  return err
};
var _alGetSourcei = (sourceId, param,
  pValue) => {
  var val = AL.getSourceParam(
    "alGetSourcei", sourceId, param);
  if (val === null) {
    return
  }
  if (!pValue) {
    AL.currentCtx.err = 40963;
    return
  }
  switch (param) {
    case 514:
    case 4097:
    case 4098:
    case 4103:
    case 4105:
    case 4112:
    case 4117:
    case 4118:
    case 4128:
    case 4129:
    case 4131:
    case 4132:
    case 4133:
    case 4134:
    case 4135:
    case 4628:
    case 8201:
    case 8202:
    case 53248:
      HEAP32[pValue >> 2] = val;
      break;
    default:
      AL.currentCtx.err = 40962;
      return
  }
};
var _alSourcePlay = sourceId => {
  if (!AL.currentCtx) {
    return
  }
  var src = AL.currentCtx.sources[
    sourceId];
  if (!src) {
    AL.currentCtx.err = 40961;
    return
  }
  AL.setSourceState(src, 4114)
};
var _alSourceQueueBuffers = (sourceId,
  count, pBufferIds) => {
  if (!AL.currentCtx) {
    return
  }
  var src = AL.currentCtx.sources[
    sourceId];
  if (!src) {
    AL.currentCtx.err = 40961;
    return
  }
  if (src.type === 4136) {
    AL.currentCtx.err = 40964;
    return
  }
  if (count === 0) {
    return
  }
  var templateBuf = AL.buffers[0];
  for (var i = 0; i < src.bufQueue
    .length; i++) {
    if (src.bufQueue[i].id !== 0) {
      templateBuf = src.bufQueue[i];
      break
    }
  }
  for (var i = 0; i < count; ++i) {
    var bufId = HEAP32[pBufferIds +
      i * 4 >> 2];
    var buf = AL.buffers[bufId];
    if (!buf) {
      AL.currentCtx.err = 40961;
      return
    }
    if (templateBuf.id !== 0 && (buf
        .frequency !== templateBuf
        .frequency || buf
        .bytesPerSample !==
        templateBuf.bytesPerSample ||
        buf.channels !== templateBuf
        .channels)) {
      AL.currentCtx.err = 40964
    }
  }
  if (src.bufQueue.length === 1 && src
    .bufQueue[0].id === 0) {
    src.bufQueue.length = 0
  }
  src.type = 4137;
  for (var i = 0; i < count; ++i) {
    var bufId = HEAP32[pBufferIds +
      i * 4 >> 2];
    var buf = AL.buffers[bufId];
    buf.refCount++;
    src.bufQueue.push(buf)
  }
  if (src.looping) {
    AL.cancelPendingSourceAudio(src)
  }
  AL.initSourcePanner(src);
  AL.scheduleSourceAudio(src)
};
var _alSourceStop = sourceId => {
  if (!AL.currentCtx) {
    return
  }
  var src = AL.currentCtx.sources[
    sourceId];
  if (!src) {
    AL.currentCtx.err = 40961;
    return
  }
  AL.setSourceState(src, 4116)
};
var _alSourceUnqueueBuffers = (sourceId,
  count, pBufferIds) => {
  if (!AL.currentCtx) {
    return
  }
  var src = AL.currentCtx.sources[
    sourceId];
  if (!src) {
    AL.currentCtx.err = 40961;
    return
  }
  if (count > (src.bufQueue.length ===
      1 && src.bufQueue[0].id === 0 ?
      0 : src.bufsProcessed)) {
    AL.currentCtx.err = 40963;
    return
  }
  if (count === 0) {
    return
  }
  for (var i = 0; i < count; i++) {
    var buf = src.bufQueue.shift();
    buf.refCount--;
    HEAP32[pBufferIds + i * 4 >> 2] =
      buf.id;
    src.bufsProcessed--
  }
  if (src.bufQueue.length === 0) {
    src.bufQueue.push(AL.buffers[0])
  }
  AL.initSourcePanner(src);
  AL.scheduleSourceAudio(src)
};
var _alcCloseDevice = deviceId => {
  if (!(deviceId in AL
      .deviceRefCounts) || AL
    .deviceRefCounts[deviceId] > 0) {
    return 0
  }
  delete AL.deviceRefCounts[deviceId];
  AL.freeIds.push(deviceId);
  return 1
};
var listenOnce = (object, event,
  func) => {
    object.addEventListener(event, func,
    {
      "once": true
    })
  };
var autoResumeAudioContext = (ctx,
  elements) => {
  if (!elements) {
    elements = [document, document
      .getElementById("canvas")
    ]
  } ["keydown", "mousedown",
    "touchstart"
  ].forEach(event => {
    elements.forEach(element => {
      if (element) {
        listenOnce(element,
          event, () => {
            if (ctx
              .state ===
              "suspended")
              ctx.resume()
          })
      }
    })
  })
};
var _alcCreateContext = (deviceId,
  pAttrList) => {
  if (!(deviceId in AL
      .deviceRefCounts)) {
    AL.alcErr = 40961;
    return 0
  }
  var options = null;
  var attrs = [];
  var hrtf = null;
  pAttrList >>= 2;
  if (pAttrList) {
    var attr = 0;
    var val = 0;
    while (true) {
      attr = HEAP32[pAttrList++];
      attrs.push(attr);
      if (attr === 0) {
        break
      }
      val = HEAP32[pAttrList++];
      attrs.push(val);
      switch (attr) {
        case 4103:
          if (!options) {
            options = {}
          }
          options.sampleRate = val;
          break;
        case 4112:
        case 4113:
          break;
        case 6546:
          switch (val) {
            case 0:
              hrtf = false;
              break;
            case 1:
              hrtf = true;
              break;
            case 2:
              break;
            default:
              AL.alcErr = 40964;
              return 0
          }
          break;
        case 6550:
          if (val !== 0) {
            AL.alcErr = 40964;
            return 0
          }
          break;
        default:
          AL.alcErr = 40964;
          return 0
      }
    }
  }
  var AudioContext = window
    .AudioContext || window
    .webkitAudioContext;
  var ac = null;
  try {
    if (options) {
      ac = new AudioContext(options)
    } else {
      ac = new AudioContext
    }
  } catch (e) {
    if (e.name ===
      "NotSupportedError") {
      AL.alcErr = 40964
    } else {
      AL.alcErr = 40961
    }
    return 0
  }
  autoResumeAudioContext(ac);
  if (typeof ac.createGain ==
    "undefined") {
    ac.createGain = ac.createGainNode
  }
  var gain = ac.createGain();
  gain.connect(ac.destination);
  var ctx = {
    deviceId: deviceId
    , id: AL.newId()
    , attrs: attrs
    , audioCtx: ac
    , listener: {
      position: [0, 0, 0]
      , velocity: [0, 0, 0]
      , direction: [0, 0, 0]
      , up: [0, 0, 0]
    }
    , sources: []
    , interval: setInterval(() => AL
      .scheduleContextAudio(ctx),
      AL.QUEUE_INTERVAL)
    , gain: gain
    , distanceModel: 53250
    , speedOfSound: 343.3
    , dopplerFactor: 1
    , sourceDistanceModel: false
    , hrtf: hrtf || false
    , _err: 0
    , get err() {
      return this._err
    }
    , set err(val) {
      if (this._err === 0 ||
        val === 0) {
        this._err = val
      }
    }
  };
  AL.deviceRefCounts[deviceId]++;
  AL.contexts[ctx.id] = ctx;
  if (hrtf !== null) {
    for (var ctxId in AL.contexts) {
      var c = AL.contexts[ctxId];
      if (c.deviceId === deviceId) {
        c.hrtf = hrtf;
        AL.updateContextGlobal(c)
      }
    }
  }
  return ctx.id
};
var _alcDestroyContext = contextId => {
  var ctx = AL.contexts[contextId];
  if (AL.currentCtx === ctx) {
    AL.alcErr = 40962;
    return
  }
  if (AL.contexts[contextId]
    .interval) {
    clearInterval(AL.contexts[
      contextId].interval)
  }
  AL.deviceRefCounts[ctx.deviceId]--;
  delete AL.contexts[contextId];
  AL.freeIds.push(contextId)
};
var _alcMakeContextCurrent =
  contextId => {
    if (contextId === 0) {
      AL.currentCtx = null
    } else {
      AL.currentCtx = AL.contexts[
        contextId]
    }
    return 1
  };
var _alcOpenDevice = pDeviceName => {
  if (pDeviceName) {
    var name = UTF8ToString(
      pDeviceName);
    if (name !== AL.DEVICE_NAME) {
      return 0
    }
  }
  if (typeof AudioContext !=
    "undefined" ||
    typeof webkitAudioContext !=
    "undefined") {
    var deviceId = AL.newId();
    AL.deviceRefCounts[deviceId] = 0;
    return deviceId
  }
  return 0
};
var ERRNO_CODES = {
  "EPERM": 63
  , "ENOENT": 44
  , "ESRCH": 71
  , "EINTR": 27
  , "EIO": 29
  , "ENXIO": 60
  , "E2BIG": 1
  , "ENOEXEC": 45
  , "EBADF": 8
  , "ECHILD": 12
  , "EAGAIN": 6
  , "EWOULDBLOCK": 6
  , "ENOMEM": 48
  , "EACCES": 2
  , "EFAULT": 21
  , "ENOTBLK": 105
  , "EBUSY": 10
  , "EEXIST": 20
  , "EXDEV": 75
  , "ENODEV": 43
  , "ENOTDIR": 54
  , "EISDIR": 31
  , "EINVAL": 28
  , "ENFILE": 41
  , "EMFILE": 33
  , "ENOTTY": 59
  , "ETXTBSY": 74
  , "EFBIG": 22
  , "ENOSPC": 51
  , "ESPIPE": 70
  , "EROFS": 69
  , "EMLINK": 34
  , "EPIPE": 64
  , "EDOM": 18
  , "ERANGE": 68
  , "ENOMSG": 49
  , "EIDRM": 24
  , "ECHRNG": 106
  , "EL2NSYNC": 156
  , "EL3HLT": 107
  , "EL3RST": 108
  , "ELNRNG": 109
  , "EUNATCH": 110
  , "ENOCSI": 111
  , "EL2HLT": 112
  , "EDEADLK": 16
  , "ENOLCK": 46
  , "EBADE": 113
  , "EBADR": 114
  , "EXFULL": 115
  , "ENOANO": 104
  , "EBADRQC": 103
  , "EBADSLT": 102
  , "EDEADLOCK": 16
  , "EBFONT": 101
  , "ENOSTR": 100
  , "ENODATA": 116
  , "ETIME": 117
  , "ENOSR": 118
  , "ENONET": 119
  , "ENOPKG": 120
  , "EREMOTE": 121
  , "ENOLINK": 47
  , "EADV": 122
  , "ESRMNT": 123
  , "ECOMM": 124
  , "EPROTO": 65
  , "EMULTIHOP": 36
  , "EDOTDOT": 125
  , "EBADMSG": 9
  , "ENOTUNIQ": 126
  , "EBADFD": 127
  , "EREMCHG": 128
  , "ELIBACC": 129
  , "ELIBBAD": 130
  , "ELIBSCN": 131
  , "ELIBMAX": 132
  , "ELIBEXEC": 133
  , "ENOSYS": 52
  , "ENOTEMPTY": 55
  , "ENAMETOOLONG": 37
  , "ELOOP": 32
  , "EOPNOTSUPP": 138
  , "EPFNOSUPPORT": 139
  , "ECONNRESET": 15
  , "ENOBUFS": 42
  , "EAFNOSUPPORT": 5
  , "EPROTOTYPE": 67
  , "ENOTSOCK": 57
  , "ENOPROTOOPT": 50
  , "ESHUTDOWN": 140
  , "ECONNREFUSED": 14
  , "EADDRINUSE": 3
  , "ECONNABORTED": 13
  , "ENETUNREACH": 40
  , "ENETDOWN": 38
  , "ETIMEDOUT": 73
  , "EHOSTDOWN": 142
  , "EHOSTUNREACH": 23
  , "EINPROGRESS": 26
  , "EALREADY": 7
  , "EDESTADDRREQ": 17
  , "EMSGSIZE": 35
  , "EPROTONOSUPPORT": 66
  , "ESOCKTNOSUPPORT": 137
  , "EADDRNOTAVAIL": 4
  , "ENETRESET": 39
  , "EISCONN": 30
  , "ENOTCONN": 53
  , "ETOOMANYREFS": 141
  , "EUSERS": 136
  , "EDQUOT": 19
  , "ESTALE": 72
  , "ENOTSUP": 138
  , "ENOMEDIUM": 148
  , "EILSEQ": 25
  , "EOVERFLOW": 61
  , "ECANCELED": 11
  , "ENOTRECOVERABLE": 56
  , "EOWNERDEAD": 62
  , "ESTRPIPE": 135
};

function _dummyErrnoCodes() {
  if (!ERRNO_CODES) {
    console.error(
      "ERRNO_CODES not imported!")
  }
}
var EGL = {
  errorCode: 12288
  , defaultDisplayInitialized: false
  , currentContext: 0
  , currentReadSurface: 0
  , currentDrawSurface: 0
  , contextAttributes: {
    alpha: false
    , depth: false
    , stencil: false
    , antialias: false
  }
  , stringCache: {}
  , setErrorCode(code) {
    EGL.errorCode = code
  }
  , chooseConfig(display, attribList,
    config, config_size, numConfigs) {
    if (display != 62e3) {
      EGL.setErrorCode(12296);
      return 0
    }
    if (attribList) {
      for (;;) {
        var param = HEAP32[
          attribList >> 2];
        if (param == 12321) {
          var alphaSize = HEAP32[
            attribList + 4 >> 2];
          EGL.contextAttributes
            .alpha = alphaSize > 0
        } else if (param == 12325) {
          var depthSize = HEAP32[
            attribList + 4 >> 2];
          EGL.contextAttributes
            .depth = depthSize > 0
        } else if (param == 12326) {
          var stencilSize = HEAP32[
            attribList + 4 >> 2];
          EGL.contextAttributes
            .stencil = stencilSize > 0
        } else if (param == 12337) {
          var samples = HEAP32[
            attribList + 4 >> 2];
          EGL.contextAttributes
            .antialias = samples > 0
        } else if (param == 12338) {
          var samples = HEAP32[
            attribList + 4 >> 2];
          EGL.contextAttributes
            .antialias = samples == 1
        } else if (param == 12544) {
          var requestedPriority =
            HEAP32[attribList + 4 >>
              2];
          EGL.contextAttributes
            .lowLatency =
            requestedPriority != 12547
        } else if (param == 12344) {
          break
        }
        attribList += 8
      }
    }
    if ((!config || !config_size) && !
      numConfigs) {
      EGL.setErrorCode(12300);
      return 0
    }
    if (numConfigs) {
      HEAP32[numConfigs >> 2] = 1
    }
    if (config && config_size > 0) {
      HEAPU32[config >> 2] = 62002
    }
    EGL.setErrorCode(12288);
    return 1
  }
};
var _eglBindAPI = api => {
  if (api == 12448) {
    EGL.setErrorCode(12288);
    return 1
  }
  EGL.setErrorCode(12300);
  return 0
};
var _eglChooseConfig = (display,
  attrib_list, configs, config_size,
  numConfigs) => EGL.chooseConfig(
  display, attrib_list, configs,
  config_size, numConfigs);
var _eglCreateContext = (display,
  config, hmm, contextAttribs) => {
  if (display != 62e3) {
    EGL.setErrorCode(12296);
    return 0
  }
  var glesContextVersion = 1;
  for (;;) {
    var param = HEAP32[
      contextAttribs >> 2];
    if (param == 12440) {
      glesContextVersion = HEAP32[
        contextAttribs + 4 >> 2]
    } else if (param == 12344) {
      break
    } else {
      EGL.setErrorCode(12292);
      return 0
    }
    contextAttribs += 8
  }
  if (glesContextVersion < 2 ||
    glesContextVersion > 3) {
    EGL.setErrorCode(12293);
    return 0
  }
  EGL.contextAttributes.majorVersion =
    glesContextVersion - 1;
  EGL.contextAttributes.minorVersion =
    0;
  EGL.context = GL.createContext(
    Module["canvas"], EGL
    .contextAttributes);
  if (EGL.context != 0) {
    EGL.setErrorCode(12288);
    GL.makeContextCurrent(EGL
    .context);
    Module.useWebGL = true;
    Browser
      .moduleContextCreatedCallbacks
      .forEach(function(callback) {
        callback()
      });
    GL.makeContextCurrent(null);
    return 62004
  } else {
    EGL.setErrorCode(12297);
    return 0
  }
};
var _eglCreateWindowSurface = (display,
  config, win, attrib_list) => {
  if (display != 62e3) {
    EGL.setErrorCode(12296);
    return 0
  }
  if (config != 62002) {
    EGL.setErrorCode(12293);
    return 0
  }
  EGL.setErrorCode(12288);
  return 62006
};
var _eglDestroyContext = (display,
  context) => {
  if (display != 62e3) {
    EGL.setErrorCode(12296);
    return 0
  }
  if (context != 62004) {
    EGL.setErrorCode(12294);
    return 0
  }
  GL.deleteContext(EGL.context);
  EGL.setErrorCode(12288);
  if (EGL.currentContext == context) {
    EGL.currentContext = 0
  }
  return 1
};
var _eglDestroySurface = (display,
  surface) => {
  if (display != 62e3) {
    EGL.setErrorCode(12296);
    return 0
  }
  if (surface != 62006) {
    EGL.setErrorCode(12301);
    return 1
  }
  if (EGL.currentReadSurface ==
    surface) {
    EGL.currentReadSurface = 0
  }
  if (EGL.currentDrawSurface ==
    surface) {
    EGL.currentDrawSurface = 0
  }
  EGL.setErrorCode(12288);
  return 1
};
var _eglGetConfigs = (display, configs,
    config_size, numConfigs) => EGL
  .chooseConfig(display, 0, configs,
    config_size, numConfigs);
var _eglGetCurrentContext = () => EGL
  .currentContext;
var _eglGetDisplay =
  nativeDisplayType => {
    EGL.setErrorCode(12288);
    if (nativeDisplayType != 0 &&
      nativeDisplayType != 1) {
      return 0
    }
    return 62e3
  };
var _eglGetError = () => EGL.errorCode;
var _eglInitialize = (display,
  majorVersion, minorVersion) => {
  if (display != 62e3) {
    EGL.setErrorCode(12296);
    return 0
  }
  if (majorVersion) {
    HEAP32[majorVersion >> 2] = 1
  }
  if (minorVersion) {
    HEAP32[minorVersion >> 2] = 4
  }
  EGL.defaultDisplayInitialized =
  true;
  EGL.setErrorCode(12288);
  return 1
};
var _eglMakeCurrent = (display, draw,
  read, context) => {
  if (display != 62e3) {
    EGL.setErrorCode(12296);
    return 0
  }
  if (context != 0 && context !=
    62004) {
    EGL.setErrorCode(12294);
    return 0
  }
  if (read != 0 && read != 62006 ||
    draw != 0 && draw != 62006) {
    EGL.setErrorCode(12301);
    return 0
  }
  GL.makeContextCurrent(context ? EGL
    .context : null);
  EGL.currentContext = context;
  EGL.currentDrawSurface = draw;
  EGL.currentReadSurface = read;
  EGL.setErrorCode(12288);
  return 1
};
var _eglQueryString = (display,
name) => {
  if (display != 62e3) {
    EGL.setErrorCode(12296);
    return 0
  }
  EGL.setErrorCode(12288);
  if (EGL.stringCache[name])
  return EGL.stringCache[name];
  var ret;
  switch (name) {
    case 12371:
      ret = stringToNewUTF8(
        "Emscripten");
      break;
    case 12372:
      ret = stringToNewUTF8(
        "1.4 Emscripten EGL");
      break;
    case 12373:
      ret = stringToNewUTF8("");
      break;
    case 12429:
      ret = stringToNewUTF8(
        "OpenGL_ES");
      break;
    default:
      EGL.setErrorCode(12300);
      return 0
  }
  EGL.stringCache[name] = ret;
  return ret
};
var _eglQuerySurface = (display,
  surface, attribute, value) => {
  if (display != 62e3) {
    EGL.setErrorCode(12296);
    return 0
  }
  if (surface != 62006) {
    EGL.setErrorCode(12301);
    return 0
  }
  if (!value) {
    EGL.setErrorCode(12300);
    return 0
  }
  EGL.setErrorCode(12288);
  switch (attribute) {
    case 12328:
      HEAP32[value >> 2] = 62002;
      return 1;
    case 12376:
      return 1;
    case 12375:
      HEAP32[value >> 2] = Module[
        "canvas"].width;
      return 1;
    case 12374:
      HEAP32[value >> 2] = Module[
        "canvas"].height;
      return 1;
    case 12432:
      HEAP32[value >> 2] = -1;
      return 1;
    case 12433:
      HEAP32[value >> 2] = -1;
      return 1;
    case 12434:
      HEAP32[value >> 2] = -1;
      return 1;
    case 12422:
      HEAP32[value >> 2] = 12420;
      return 1;
    case 12441:
      HEAP32[value >> 2] = 12442;
      return 1;
    case 12435:
      HEAP32[value >> 2] = 12437;
      return 1;
    case 12416:
    case 12417:
    case 12418:
    case 12419:
      return 1;
    default:
      EGL.setErrorCode(12292);
      return 0
  }
};
var _eglSwapBuffers = (dpy,
surface) => {
  if (!EGL
    .defaultDisplayInitialized) {
    EGL.setErrorCode(12289)
  } else if (!Module.ctx) {
    EGL.setErrorCode(12290)
  } else if (Module.ctx
    .isContextLost()) {
    EGL.setErrorCode(12302)
  } else {
    EGL.setErrorCode(12288);
    return 1
  }
  return 0
};
var _eglTerminate = display => {
  if (display != 62e3) {
    EGL.setErrorCode(12296);
    return 0
  }
  EGL.currentContext = 0;
  EGL.currentReadSurface = 0;
  EGL.currentDrawSurface = 0;
  EGL.defaultDisplayInitialized =
    false;
  EGL.setErrorCode(12288);
  return 1
};
var readEmAsmArgsArray = [];
var readEmAsmArgs = (sigPtr, buf) => {
  readEmAsmArgsArray.length = 0;
  var ch;
  while (ch = HEAPU8[sigPtr++]) {
    var wide = ch != 105;
    wide &= ch != 112;
    buf += wide && buf % 8 ? 4 : 0;
    readEmAsmArgsArray.push(ch ==
      112 ? HEAPU32[buf >> 2] :
      ch == 105 ? HEAP32[buf >> 2] :
      HEAPF64[buf >> 3]);
    buf += wide ? 8 : 4
  }
  return readEmAsmArgsArray
};
var runEmAsmFunction = (code, sigPtr,
  argbuf) => {
  var args = readEmAsmArgs(sigPtr,
    argbuf);
  return ASM_CONSTS[code](...args)
};
var _emscripten_asm_const_int = (code,
  sigPtr, argbuf) => runEmAsmFunction(
  code, sigPtr, argbuf);
var _emscripten_date_now = () => Date
  .now();
var runAndAbortIfError = func => {
  try {
    return func()
  } catch (e) {
    abort(e)
  }
};
var runtimeKeepalivePush = () => {
  runtimeKeepaliveCounter += 1
};
var runtimeKeepalivePop = () => {
  runtimeKeepaliveCounter -= 1
};
var Asyncify = {
  instrumentWasmImports(imports) {
    var importPattern =
      /^(invoke_.*|__asyncjs__.*)$/;
    for (let [x, original] of Object
      .entries(imports)) {
      let sig = original.sig;
      if (typeof original ==
        "function") {
        let isAsyncifyImport =
          original.isAsync ||
          importPattern.test(x)
      }
    }
  }
  , instrumentWasmExports(exports) {
    var ret = {};
    for (let [x, original] of Object
      .entries(exports)) {
      if (typeof original ==
        "function") {
        ret[x] = (...args) => {
          Asyncify.exportCallStack
            .push(x);
          try {
            return original(...args)
          } finally {
            if (!ABORT) {
              var y = Asyncify
                .exportCallStack
                .pop();
              Asyncify
                .maybeStopUnwind()
            }
          }
        }
      } else {
        ret[x] = original
      }
    }
    return ret
  }
  , State: {
    Normal: 0
    , Unwinding: 1
    , Rewinding: 2
    , Disabled: 3
  }
  , state: 0
  , StackSize: 131072
  , currData: null
  , handleSleepReturnValue: 0
  , exportCallStack: []
  , callStackNameToId: {}
  , callStackIdToName: {}
  , callStackId: 0
  , asyncPromiseHandlers: null
  , sleepCallbacks: []
  , getCallStackId(funcName) {
    var id = Asyncify
      .callStackNameToId[funcName];
    if (id === undefined) {
      id = Asyncify.callStackId++;
      Asyncify.callStackNameToId[
        funcName] = id;
      Asyncify.callStackIdToName[id] =
        funcName
    }
    return id
  }
  , maybeStopUnwind() {
    if (Asyncify.currData && Asyncify
      .state === Asyncify.State
      .Unwinding && Asyncify
      .exportCallStack.length === 0) {
      Asyncify.state = Asyncify.State
        .Normal;
      runAndAbortIfError(
        _asyncify_stop_unwind);
      if (typeof Fibers !=
        "undefined") {
        Fibers.trampoline()
      }
    }
  }
  , whenDone() {
    return new Promise((resolve,
      reject) => {
      Asyncify
        .asyncPromiseHandlers = {
          resolve: resolve
          , reject: reject
        }
    })
  }
  , allocateData() {
    var ptr = _malloc(12 + Asyncify
      .StackSize);
    Asyncify.setDataHeader(ptr, ptr +
      12, Asyncify.StackSize);
    Asyncify.setDataRewindFunc(ptr);
    return ptr
  }
  , setDataHeader(ptr, stack,
    stackSize) {
    HEAPU32[ptr >> 2] = stack;
    HEAPU32[ptr + 4 >> 2] = stack +
      stackSize
  }
  , setDataRewindFunc(ptr) {
    var bottomOfCallStack = Asyncify
      .exportCallStack[0];
    var rewindId = Asyncify
      .getCallStackId(
        bottomOfCallStack);
    HEAP32[ptr + 8 >> 2] = rewindId
  }
  , getDataRewindFunc(ptr) {
    var id = HEAP32[ptr + 8 >> 2];
    var name = Asyncify
      .callStackIdToName[id];
    var func = wasmExports[name];
    return func
  }
  , doRewind(ptr) {
    var start = Asyncify
      .getDataRewindFunc(ptr);
    return start()
  }
  , handleSleep(startAsync) {
    if (ABORT) return;
    if (Asyncify.state === Asyncify
      .State.Normal) {
      var reachedCallback = false;
      var reachedAfterCallback =
      false;
      startAsync((
        handleSleepReturnValue = 0
        ) => {
        if (ABORT) return;
        Asyncify
          .handleSleepReturnValue =
          handleSleepReturnValue;
        reachedCallback = true;
        if (!
          reachedAfterCallback) {
          return
        }
        Asyncify.state = Asyncify
          .State.Rewinding;
        runAndAbortIfError(() =>
          _asyncify_start_rewind(
            Asyncify.currData));
        if (typeof Browser !=
          "undefined" && Browser
          .mainLoop.func) {
          Browser.mainLoop
          .resume()
        }
        var asyncWasmReturnValue,
          isError = false;
        try {
          asyncWasmReturnValue =
            Asyncify.doRewind(
              Asyncify.currData)
        } catch (err) {
          asyncWasmReturnValue =
            err;
          isError = true
        }
        var handled = false;
        if (!Asyncify.currData) {
          var
            asyncPromiseHandlers =
            Asyncify
            .asyncPromiseHandlers;
          if (
            asyncPromiseHandlers) {
            Asyncify
              .asyncPromiseHandlers =
              null;
            (isError ?
              asyncPromiseHandlers
              .reject :
              asyncPromiseHandlers
              .resolve)(
              asyncWasmReturnValue
              );
            handled = true
          }
        }
        if (isError && !handled) {
          throw asyncWasmReturnValue
        }
      });
      reachedAfterCallback = true;
      if (!reachedCallback) {
        Asyncify.state = Asyncify
          .State.Unwinding;
        Asyncify.currData = Asyncify
          .allocateData();
        if (typeof Browser !=
          "undefined" && Browser
          .mainLoop.func) {
          Browser.mainLoop.pause()
        }
        runAndAbortIfError(() =>
          _asyncify_start_unwind(
            Asyncify.currData))
      }
    } else if (Asyncify.state ===
      Asyncify.State.Rewinding) {
      Asyncify.state = Asyncify.State
        .Normal;
      runAndAbortIfError(
        _asyncify_stop_rewind);
      _free(Asyncify.currData);
      Asyncify.currData = null;
      Asyncify.sleepCallbacks.forEach(
        callUserCallback)
    } else {
      abort(
        `invalid state: ${Asyncify.state}`
        )
    }
    return Asyncify
      .handleSleepReturnValue
  }
  , handleAsync(startAsync) {
    return Asyncify.handleSleep(
      wakeUp => {
        startAsync().then(wakeUp)
      })
  }
};
var Fibers = {
  nextFiber: 0
  , trampolineRunning: false
  , trampoline() {
    if (!Fibers.trampolineRunning &&
      Fibers.nextFiber) {
      Fibers.trampolineRunning = true;
      do {
        var fiber = Fibers.nextFiber;
        Fibers.nextFiber = 0;
        Fibers.finishContextSwitch(
          fiber)
      } while (Fibers.nextFiber);
      Fibers.trampolineRunning = false
    }
  }
  , finishContextSwitch(newFiber) {
    var stack_base = HEAPU32[
      newFiber >> 2];
    var stack_max = HEAPU32[newFiber +
      4 >> 2];
    _emscripten_stack_set_limits(
      stack_base, stack_max);
    stackRestore(HEAPU32[newFiber +
      8 >> 2]);
    var entryPoint = HEAPU32[
      newFiber + 12 >> 2];
    if (entryPoint !== 0) {
      Asyncify.currData = null;
      HEAPU32[newFiber + 12 >> 2] = 0;
      var userData = HEAPU32[
        newFiber + 16 >> 2];
      (a1 => dynCall_vi(entryPoint,
        a1))(userData)
    } else {
      var asyncifyData = newFiber +
      20;
      Asyncify.currData =
      asyncifyData;
      Asyncify.state = Asyncify.State
        .Rewinding;
      _asyncify_start_rewind(
        asyncifyData);
      Asyncify.doRewind(asyncifyData)
    }
  }
};
var _emscripten_fiber_swap = (oldFiber,
  newFiber) => {
  if (ABORT) return;
  if (Asyncify.state === Asyncify
    .State.Normal) {
    Asyncify.state = Asyncify.State
      .Unwinding;
    var asyncifyData = oldFiber + 20;
    Asyncify.setDataRewindFunc(
      asyncifyData);
    Asyncify.currData = asyncifyData;
    _asyncify_start_unwind(
      asyncifyData);
    var stackTop = stackSave();
    HEAPU32[oldFiber + 8 >> 2] =
      stackTop;
    Fibers.nextFiber = newFiber
  } else {
    Asyncify.state = Asyncify.State
      .Normal;
    _asyncify_stop_rewind();
    Asyncify.currData = null
  }
};
_emscripten_fiber_swap.isAsync = true;
var
  __emscripten_runtime_keepalive_clear =
  () => {
    noExitRuntime = false;
    runtimeKeepaliveCounter = 0
  };
var _emscripten_force_exit = status => {
  __emscripten_runtime_keepalive_clear
    ();
  _exit(status)
};
var JSEvents = {
  removeAllEventListeners() {
    while (JSEvents.eventHandlers
      .length) {
      JSEvents._removeHandler(JSEvents
        .eventHandlers.length - 1)
    }
    JSEvents.deferredCalls = []
  }
  , inEventHandler: 0
  , deferredCalls: []
  , deferCall(targetFunction,
    precedence, argsList) {
    function arraysHaveEqualContent(
      arrA, arrB) {
      if (arrA.length != arrB.length)
        return false;
      for (var i in arrA) {
        if (arrA[i] != arrB[i])
        return false
      }
      return true
    }
    for (var i in JSEvents
        .deferredCalls) {
      var call = JSEvents
        .deferredCalls[i];
      if (call.targetFunction ==
        targetFunction &&
        arraysHaveEqualContent(call
          .argsList, argsList)) {
        return
      }
    }
    JSEvents.deferredCalls.push({
      targetFunction: targetFunction
      , precedence: precedence
      , argsList: argsList
    });
    JSEvents.deferredCalls.sort((x,
      y) => x.precedence < y
      .precedence)
  }
  , removeDeferredCalls(
    targetFunction) {
    for (var i = 0; i < JSEvents
      .deferredCalls.length; ++i) {
      if (JSEvents.deferredCalls[i]
        .targetFunction ==
        targetFunction) {
        JSEvents.deferredCalls.splice(
          i, 1);
        --i
      }
    }
  }
  , canPerformEventHandlerRequests() {
    if (navigator.userActivation) {
      return navigator.userActivation
        .isActive
    }
    return JSEvents.inEventHandler &&
      JSEvents.currentEventHandler
      .allowsDeferredCalls
  }
  , runDeferredCalls() {
    if (!JSEvents
      .canPerformEventHandlerRequests()
      ) {
      return
    }
    for (var i = 0; i < JSEvents
      .deferredCalls.length; ++i) {
      var call = JSEvents
        .deferredCalls[i];
      JSEvents.deferredCalls.splice(i,
        1);
      --i;
      call.targetFunction(...call
        .argsList)
    }
  }
  , eventHandlers: []
  , removeAllHandlersOnTarget: (
    target, eventTypeString) => {
    for (var i = 0; i < JSEvents
      .eventHandlers.length; ++i) {
      if (JSEvents.eventHandlers[i]
        .target == target && (!
          eventTypeString ||
          eventTypeString ==
          JSEvents.eventHandlers[i]
          .eventTypeString)) {
        JSEvents._removeHandler(i--)
      }
    }
  }
  , _removeHandler(i) {
    var h = JSEvents.eventHandlers[i];
    h.target.removeEventListener(h
      .eventTypeString, h
      .eventListenerFunc, h
      .useCapture);
    JSEvents.eventHandlers.splice(i,
      1)
  }
  , registerOrRemoveHandler(
    eventHandler) {
    if (!eventHandler.target) {
      return -4
    }
    if (eventHandler.callbackfunc) {
      eventHandler.eventListenerFunc =
        function(event) {
          ++JSEvents.inEventHandler;
          JSEvents
            .currentEventHandler =
            eventHandler;
          JSEvents.runDeferredCalls();
          eventHandler.handlerFunc(
            event);
          JSEvents.runDeferredCalls();
          --JSEvents.inEventHandler
        };
      eventHandler.target
        .addEventListener(eventHandler
          .eventTypeString,
          eventHandler
          .eventListenerFunc,
          eventHandler.useCapture);
      JSEvents.eventHandlers.push(
        eventHandler)
    } else {
      for (var i = 0; i < JSEvents
        .eventHandlers.length; ++i) {
        if (JSEvents.eventHandlers[i]
          .target == eventHandler
          .target && JSEvents
          .eventHandlers[i]
          .eventTypeString ==
          eventHandler.eventTypeString
          ) {
          JSEvents._removeHandler(i--)
        }
      }
    }
    return 0
  }
  , getNodeNameForTarget(target) {
    if (!target) return "";
    if (target == window)
    return "#window";
    if (target == screen)
    return "#screen";
    return target?.nodeName || ""
  }
  , fullscreenEnabled() {
    return document
      .fullscreenEnabled || document
      .webkitFullscreenEnabled
  }
};
var maybeCStringToJsString = cString =>
  cString > 2 ? UTF8ToString(cString) :
  cString;
var specialHTMLTargets = [0,
  typeof document != "undefined" ?
  document : 0, typeof window !=
  "undefined" ? window : 0
];
var findEventTarget = target => {
  target = maybeCStringToJsString(
    target);
  var domElement = specialHTMLTargets[
    target] || (typeof document !=
    "undefined" ? document
    .querySelector(target) :
    undefined);
  return domElement
};
var findCanvasEventTarget =
  findEventTarget;
var
  _emscripten_get_canvas_element_size =
  (target, width, height) => {
    var canvas = findCanvasEventTarget(
      target);
    if (!canvas) return -4;
    HEAP32[width >> 2] = canvas.width;
    HEAP32[height >> 2] = canvas.height
  };
var _emscripten_get_device_pixel_ratio =
  () => typeof devicePixelRatio ==
  "number" && devicePixelRatio || 1;
var fillFullscreenChangeEventData =
  eventStruct => {
    var fullscreenElement = document
      .fullscreenElement || document
      .mozFullScreenElement || document
      .webkitFullscreenElement ||
      document.msFullscreenElement;
    var isFullscreen = !!
      fullscreenElement;
    HEAP32[eventStruct >> 2] =
      isFullscreen;
    HEAP32[eventStruct + 4 >> 2] =
      JSEvents.fullscreenEnabled();
    var reportedElement = isFullscreen ?
      fullscreenElement : JSEvents
      .previousFullscreenElement;
    var nodeName = JSEvents
      .getNodeNameForTarget(
        reportedElement);
    var id = reportedElement?.id || "";
    stringToUTF8(nodeName, eventStruct +
      8, 128);
    stringToUTF8(id, eventStruct + 136,
      128);
    HEAP32[eventStruct + 264 >> 2] =
      reportedElement ? reportedElement
      .clientWidth : 0;
    HEAP32[eventStruct + 268 >> 2] =
      reportedElement ? reportedElement
      .clientHeight : 0;
    HEAP32[eventStruct + 272 >> 2] =
      screen.width;
    HEAP32[eventStruct + 276 >> 2] =
      screen.height;
    if (isFullscreen) {
      JSEvents
        .previousFullscreenElement =
        fullscreenElement
    }
  };
var _emscripten_get_fullscreen_status =
  fullscreenStatus => {
    if (!JSEvents.fullscreenEnabled())
      return -1;
    fillFullscreenChangeEventData(
      fullscreenStatus);
    return 0
  };
var getHeapMax = () => 2147483648;
var _emscripten_get_heap_max = () =>
  getHeapMax();
var _glActiveTexture = x0 => GLctx
  .activeTexture(x0);
var _emscripten_glActiveTexture =
  _glActiveTexture;
var _glAttachShader = (program,
  shader) => {
    GLctx.attachShader(GL.programs[
      program], GL.shaders[shader])
  };
var _emscripten_glAttachShader =
  _glAttachShader;
var _glBeginQuery = (target, id) => {
  GLctx.beginQuery(target, GL.queries[
    id])
};
var _emscripten_glBeginQuery =
  _glBeginQuery;
var _glBeginQueryEXT = (target, id) => {
  GLctx.disjointTimerQueryExt[
    "beginQueryEXT"](target, GL
    .queries[id])
};
var _emscripten_glBeginQueryEXT =
  _glBeginQueryEXT;
var _glBeginTransformFeedback = x0 =>
  GLctx.beginTransformFeedback(x0);
var
  _emscripten_glBeginTransformFeedback =
  _glBeginTransformFeedback;
var _glBindAttribLocation = (program,
  index, name) => {
  GLctx.bindAttribLocation(GL
    .programs[program], index,
    UTF8ToString(name))
};
var _emscripten_glBindAttribLocation =
  _glBindAttribLocation;
var _glBindBuffer = (target,
buffer) => {
  if (target == 34962) {
    GLctx.currentArrayBufferBinding =
      buffer
  } else if (target == 34963) {
    GLctx
      .currentElementArrayBufferBinding =
      buffer
  }
  if (target == 35051) {
    GLctx
      .currentPixelPackBufferBinding =
      buffer
  } else if (target == 35052) {
    GLctx
      .currentPixelUnpackBufferBinding =
      buffer
  }
  GLctx.bindBuffer(target, GL.buffers[
    buffer])
};
var _emscripten_glBindBuffer =
  _glBindBuffer;
var _glBindBufferBase = (target, index,
  buffer) => {
  GLctx.bindBufferBase(target, index,
    GL.buffers[buffer])
};
var _emscripten_glBindBufferBase =
  _glBindBufferBase;
var _glBindBufferRange = (target, index,
  buffer, offset, ptrsize) => {
  GLctx.bindBufferRange(target, index,
    GL.buffers[buffer], offset,
    ptrsize)
};
var _emscripten_glBindBufferRange =
  _glBindBufferRange;
var _glBindFramebuffer = (target,
  framebuffer) => {
  GLctx.bindFramebuffer(target, GL
    .framebuffers[framebuffer])
};
var _emscripten_glBindFramebuffer =
  _glBindFramebuffer;
var _glBindRenderbuffer = (target,
  renderbuffer) => {
  GLctx.bindRenderbuffer(target, GL
    .renderbuffers[renderbuffer])
};
var _emscripten_glBindRenderbuffer =
  _glBindRenderbuffer;
var _glBindSampler = (unit,
sampler) => {
  GLctx.bindSampler(unit, GL.samplers[
    sampler])
};
var _emscripten_glBindSampler =
  _glBindSampler;
var _emscripten_glBindTexture =
  _glBindTexture;
var _glBindTransformFeedback = (target,
  id) => {
  GLctx.bindTransformFeedback(target,
    GL.transformFeedbacks[id])
};
var
  _emscripten_glBindTransformFeedback =
  _glBindTransformFeedback;
var _glBindVertexArray = vao => {
  GLctx.bindVertexArray(GL.vaos[vao]);
  var ibo = GLctx.getParameter(34965);
  GLctx
    .currentElementArrayBufferBinding =
    ibo ? ibo.name | 0 : 0
};
var _emscripten_glBindVertexArray =
  _glBindVertexArray;
var _glBindVertexArrayOES =
  _glBindVertexArray;
var _emscripten_glBindVertexArrayOES =
  _glBindVertexArrayOES;
var _glBlendColor = (x0, x1, x2, x3) =>
  GLctx.blendColor(x0, x1, x2, x3);
var _emscripten_glBlendColor =
  _glBlendColor;
var _glBlendEquation = x0 => GLctx
  .blendEquation(x0);
var _emscripten_glBlendEquation =
  _glBlendEquation;
var _glBlendEquationSeparate = (x0,
  x1) => GLctx.blendEquationSeparate(x0,
    x1);
var
  _emscripten_glBlendEquationSeparate =
  _glBlendEquationSeparate;
var _glBlendFunc = (x0, x1) => GLctx
  .blendFunc(x0, x1);
var _emscripten_glBlendFunc =
  _glBlendFunc;
var _glBlendFuncSeparate = (x0, x1, x2,
  x3) => GLctx.blendFuncSeparate(x0,
  x1, x2, x3);
var _emscripten_glBlendFuncSeparate =
  _glBlendFuncSeparate;
var _glBlitFramebuffer = (x0, x1, x2,
    x3, x4, x5, x6, x7, x8, x9) => GLctx
  .blitFramebuffer(x0, x1, x2, x3, x4,
    x5, x6, x7, x8, x9);
var _emscripten_glBlitFramebuffer =
  _glBlitFramebuffer;
var _glBufferData = (target, size, data,
  usage) => {
  if (true) {
    if (data && size) {
      GLctx.bufferData(target, HEAPU8,
        usage, data, size)
    } else {
      GLctx.bufferData(target, size,
        usage)
    }
  } else {
    GLctx.bufferData(target, data ?
      HEAPU8.subarray(data, data +
        size) : size, usage)
  }
};
var _emscripten_glBufferData =
  _glBufferData;
var _glBufferSubData = (target, offset,
  size, data) => {
  if (true) {
    size && GLctx.bufferSubData(
      target, offset, HEAPU8, data,
      size);
    return
  }
  GLctx.bufferSubData(target, offset,
    HEAPU8.subarray(data, data +
      size))
};
var _emscripten_glBufferSubData =
  _glBufferSubData;
var _glCheckFramebufferStatus = x0 =>
  GLctx.checkFramebufferStatus(x0);
var
  _emscripten_glCheckFramebufferStatus =
  _glCheckFramebufferStatus;
var _glClear = x0 => GLctx.clear(x0);
var _emscripten_glClear = _glClear;
var _glClearBufferfi = (x0, x1, x2,
  x3) => GLctx.clearBufferfi(x0, x1, x2,
    x3);
var _emscripten_glClearBufferfi =
  _glClearBufferfi;
var _glClearBufferfv = (buffer,
  drawbuffer, value) => {
  GLctx.clearBufferfv(buffer,
    drawbuffer, HEAPF32, value >> 2)
};
var _emscripten_glClearBufferfv =
  _glClearBufferfv;
var _glClearBufferiv = (buffer,
  drawbuffer, value) => {
  GLctx.clearBufferiv(buffer,
    drawbuffer, HEAP32, value >> 2)
};
var _emscripten_glClearBufferiv =
  _glClearBufferiv;
var _glClearBufferuiv = (buffer,
  drawbuffer, value) => {
  GLctx.clearBufferuiv(buffer,
    drawbuffer, HEAPU32, value >> 2)
};
var _emscripten_glClearBufferuiv =
  _glClearBufferuiv;
var _glClearColor = (x0, x1, x2, x3) =>
  GLctx.clearColor(x0, x1, x2, x3);
var _emscripten_glClearColor =
  _glClearColor;
var _glClearDepthf = x0 => GLctx
  .clearDepth(x0);
var _emscripten_glClearDepthf =
  _glClearDepthf;
var _glClearStencil = x0 => GLctx
  .clearStencil(x0);
var _emscripten_glClearStencil =
  _glClearStencil;
var convertI32PairToI53 = (lo, hi) => (
  lo >>> 0) + hi * 4294967296;
var _glClientWaitSync = (sync, flags,
  timeout_low, timeout_high) => {
  var timeout = convertI32PairToI53(
    timeout_low, timeout_high);
  return GLctx.clientWaitSync(GL
    .syncs[sync], flags, timeout)
};
var _emscripten_glClientWaitSync =
  _glClientWaitSync;
var _glColorMask = (red, green, blue,
  alpha) => {
  GLctx.colorMask(!!red, !!green, !!
    blue, !!alpha)
};
var _emscripten_glColorMask =
  _glColorMask;
var _glCompileShader = shader => {
  GLctx.compileShader(GL.shaders[
    shader])
};
var _emscripten_glCompileShader =
  _glCompileShader;
var _glCompressedTexImage2D = (target,
  level, internalFormat, width,
  height, border, imageSize, data
  ) => {
  if (true) {
    if (GLctx
      .currentPixelUnpackBufferBinding ||
      !imageSize) {
      GLctx.compressedTexImage2D(
        target, level,
        internalFormat, width,
        height, border, imageSize,
        data)
    } else {
      GLctx.compressedTexImage2D(
        target, level,
        internalFormat, width,
        height, border, HEAPU8,
        data, imageSize)
    }
    return
  }
  GLctx.compressedTexImage2D(target,
    level, internalFormat, width,
    height, border, data ? HEAPU8
    .subarray(data, data +
      imageSize) : null)
};
var _emscripten_glCompressedTexImage2D =
  _glCompressedTexImage2D;
var _glCompressedTexImage3D = (target,
  level, internalFormat, width,
  height, depth, border, imageSize,
  data) => {
  if (GLctx
    .currentPixelUnpackBufferBinding
    ) {
    GLctx.compressedTexImage3D(target,
      level, internalFormat, width,
      height, depth, border,
      imageSize, data)
  } else {
    GLctx.compressedTexImage3D(target,
      level, internalFormat, width,
      height, depth, border, HEAPU8,
      data, imageSize)
  }
};
var _emscripten_glCompressedTexImage3D =
  _glCompressedTexImage3D;
var _glCompressedTexSubImage2D = (
  target, level, xoffset, yoffset,
  width, height, format, imageSize,
  data) => {
  if (true) {
    if (GLctx
      .currentPixelUnpackBufferBinding ||
      !imageSize) {
      GLctx.compressedTexSubImage2D(
        target, level, xoffset,
        yoffset, width, height,
        format, imageSize, data)
    } else {
      GLctx.compressedTexSubImage2D(
        target, level, xoffset,
        yoffset, width, height,
        format, HEAPU8, data,
        imageSize)
    }
    return
  }
  GLctx.compressedTexSubImage2D(
    target, level, xoffset, yoffset,
    width, height, format, data ?
    HEAPU8.subarray(data, data +
      imageSize) : null)
};
var
  _emscripten_glCompressedTexSubImage2D =
  _glCompressedTexSubImage2D;
var _glCompressedTexSubImage3D = (
  target, level, xoffset, yoffset,
  zoffset, width, height, depth,
  format, imageSize, data) => {
  if (GLctx
    .currentPixelUnpackBufferBinding
    ) {
    GLctx.compressedTexSubImage3D(
      target, level, xoffset,
      yoffset, zoffset, width,
      height, depth, format,
      imageSize, data)
  } else {
    GLctx.compressedTexSubImage3D(
      target, level, xoffset,
      yoffset, zoffset, width,
      height, depth, format, HEAPU8,
      data, imageSize)
  }
};
var
  _emscripten_glCompressedTexSubImage3D =
  _glCompressedTexSubImage3D;
var _glCopyBufferSubData = (x0, x1, x2,
  x3, x4) => GLctx.copyBufferSubData(
  x0, x1, x2, x3, x4);
var _emscripten_glCopyBufferSubData =
  _glCopyBufferSubData;
var _glCopyTexImage2D = (x0, x1, x2, x3,
    x4, x5, x6, x7) => GLctx
  .copyTexImage2D(x0, x1, x2, x3, x4,
    x5, x6, x7);
var _emscripten_glCopyTexImage2D =
  _glCopyTexImage2D;
var _glCopyTexSubImage2D = (x0, x1, x2,
    x3, x4, x5, x6, x7) => GLctx
  .copyTexSubImage2D(x0, x1, x2, x3, x4,
    x5, x6, x7);
var _emscripten_glCopyTexSubImage2D =
  _glCopyTexSubImage2D;
var _glCopyTexSubImage3D = (x0, x1, x2,
    x3, x4, x5, x6, x7, x8) => GLctx
  .copyTexSubImage3D(x0, x1, x2, x3, x4,
    x5, x6, x7, x8);
var _emscripten_glCopyTexSubImage3D =
  _glCopyTexSubImage3D;
var _glCreateProgram = () => {
  var id = GL.getNewId(GL.programs);
  var program = GLctx.createProgram();
  program.name = id;
  program.maxUniformLength = program
    .maxAttributeLength = program
    .maxUniformBlockNameLength = 0;
  program.uniformIdCounter = 1;
  GL.programs[id] = program;
  return id
};
var _emscripten_glCreateProgram =
  _glCreateProgram;
var _glCreateShader = shaderType => {
  var id = GL.getNewId(GL.shaders);
  GL.shaders[id] = GLctx.createShader(
    shaderType);
  return id
};
var _emscripten_glCreateShader =
  _glCreateShader;
var _glCullFace = x0 => GLctx.cullFace(
  x0);
var _emscripten_glCullFace =
_glCullFace;
var _glDeleteBuffers = (n, buffers) => {
  for (var i = 0; i < n; i++) {
    var id = HEAP32[buffers + i * 4 >>
      2];
    var buffer = GL.buffers[id];
    if (!buffer) continue;
    GLctx.deleteBuffer(buffer);
    buffer.name = 0;
    GL.buffers[id] = null;
    if (id == GLctx
      .currentArrayBufferBinding)
      GLctx
      .currentArrayBufferBinding = 0;
    if (id == GLctx
      .currentElementArrayBufferBinding
      ) GLctx
      .currentElementArrayBufferBinding =
      0;
    if (id == GLctx
      .currentPixelPackBufferBinding)
      GLctx
      .currentPixelPackBufferBinding =
      0;
    if (id == GLctx
      .currentPixelUnpackBufferBinding
      ) GLctx
      .currentPixelUnpackBufferBinding =
      0
  }
};
var _emscripten_glDeleteBuffers =
  _glDeleteBuffers;
var _glDeleteFramebuffers = (n,
  framebuffers) => {
  for (var i = 0; i < n; ++i) {
    var id = HEAP32[framebuffers + i *
      4 >> 2];
    var framebuffer = GL.framebuffers[
      id];
    if (!framebuffer) continue;
    GLctx.deleteFramebuffer(
      framebuffer);
    framebuffer.name = 0;
    GL.framebuffers[id] = null
  }
};
var _emscripten_glDeleteFramebuffers =
  _glDeleteFramebuffers;
var _glDeleteProgram = id => {
  if (!id) return;
  var program = GL.programs[id];
  if (!program) {
    GL.recordError(1281);
    return
  }
  GLctx.deleteProgram(program);
  program.name = 0;
  GL.programs[id] = null
};
var _emscripten_glDeleteProgram =
  _glDeleteProgram;
var _glDeleteQueries = (n, ids) => {
  for (var i = 0; i < n; i++) {
    var id = HEAP32[ids + i * 4 >> 2];
    var query = GL.queries[id];
    if (!query) continue;
    GLctx.deleteQuery(query);
    GL.queries[id] = null
  }
};
var _emscripten_glDeleteQueries =
  _glDeleteQueries;
var _glDeleteQueriesEXT = (n, ids) => {
  for (var i = 0; i < n; i++) {
    var id = HEAP32[ids + i * 4 >> 2];
    var query = GL.queries[id];
    if (!query) continue;
    GLctx.disjointTimerQueryExt[
      "deleteQueryEXT"](query);
    GL.queries[id] = null
  }
};
var _emscripten_glDeleteQueriesEXT =
  _glDeleteQueriesEXT;
var _glDeleteRenderbuffers = (n,
  renderbuffers) => {
  for (var i = 0; i < n; i++) {
    var id = HEAP32[renderbuffers +
      i * 4 >> 2];
    var renderbuffer = GL
      .renderbuffers[id];
    if (!renderbuffer) continue;
    GLctx.deleteRenderbuffer(
      renderbuffer);
    renderbuffer.name = 0;
    GL.renderbuffers[id] = null
  }
};
var _emscripten_glDeleteRenderbuffers =
  _glDeleteRenderbuffers;
var _glDeleteSamplers = (n,
samplers) => {
  for (var i = 0; i < n; i++) {
    var id = HEAP32[samplers + i *
      4 >> 2];
    var sampler = GL.samplers[id];
    if (!sampler) continue;
    GLctx.deleteSampler(sampler);
    sampler.name = 0;
    GL.samplers[id] = null
  }
};
var _emscripten_glDeleteSamplers =
  _glDeleteSamplers;
var _glDeleteShader = id => {
  if (!id) return;
  var shader = GL.shaders[id];
  if (!shader) {
    GL.recordError(1281);
    return
  }
  GLctx.deleteShader(shader);
  GL.shaders[id] = null
};
var _emscripten_glDeleteShader =
  _glDeleteShader;
var _glDeleteSync = id => {
  if (!id) return;
  var sync = GL.syncs[id];
  if (!sync) {
    GL.recordError(1281);
    return
  }
  GLctx.deleteSync(sync);
  sync.name = 0;
  GL.syncs[id] = null
};
var _emscripten_glDeleteSync =
  _glDeleteSync;
var _emscripten_glDeleteTextures =
  _glDeleteTextures;
var _glDeleteTransformFeedbacks = (n,
  ids) => {
  for (var i = 0; i < n; i++) {
    var id = HEAP32[ids + i * 4 >> 2];
    var transformFeedback = GL
      .transformFeedbacks[id];
    if (!transformFeedback) continue;
    GLctx.deleteTransformFeedback(
      transformFeedback);
    transformFeedback.name = 0;
    GL.transformFeedbacks[id] = null
  }
};
var
  _emscripten_glDeleteTransformFeedbacks =
  _glDeleteTransformFeedbacks;
var _glDeleteVertexArrays = (n,
vaos) => {
  for (var i = 0; i < n; i++) {
    var id = HEAP32[vaos + i * 4 >>
    2];
    GLctx.deleteVertexArray(GL.vaos[
      id]);
    GL.vaos[id] = null
  }
};
var _emscripten_glDeleteVertexArrays =
  _glDeleteVertexArrays;
var _glDeleteVertexArraysOES =
  _glDeleteVertexArrays;
var
  _emscripten_glDeleteVertexArraysOES =
  _glDeleteVertexArraysOES;
var _glDepthFunc = x0 => GLctx
  .depthFunc(x0);
var _emscripten_glDepthFunc =
  _glDepthFunc;
var _glDepthMask = flag => {
  GLctx.depthMask(!!flag)
};
var _emscripten_glDepthMask =
  _glDepthMask;
var _glDepthRangef = (x0, x1) => GLctx
  .depthRange(x0, x1);
var _emscripten_glDepthRangef =
  _glDepthRangef;
var _glDetachShader = (program,
  shader) => {
    GLctx.detachShader(GL.programs[
      program], GL.shaders[shader])
  };
var _emscripten_glDetachShader =
  _glDetachShader;
var _glDisable = x0 => GLctx.disable(
x0);
var _emscripten_glDisable = _glDisable;
var _glDisableVertexAttribArray =
  index => {
    var cb = GL.currentContext
      .clientBuffers[index];
    cb.enabled = false;
    GLctx.disableVertexAttribArray(
      index)
  };
var
  _emscripten_glDisableVertexAttribArray =
  _glDisableVertexAttribArray;
var _glDrawArrays = (mode, first,
  count) => {
    GL.preDrawHandleClientVertexAttribBindings(
      first + count);
    GLctx.drawArrays(mode, first,
    count);
    GL.postDrawHandleClientVertexAttribBindings()
  };
var _emscripten_glDrawArrays =
  _glDrawArrays;
var _glDrawArraysInstanced = (mode,
  first, count, primcount) => {
  GLctx.drawArraysInstanced(mode,
    first, count, primcount)
};
var _emscripten_glDrawArraysInstanced =
  _glDrawArraysInstanced;
var _glDrawArraysInstancedANGLE =
  _glDrawArraysInstanced;
var
  _emscripten_glDrawArraysInstancedANGLE =
  _glDrawArraysInstancedANGLE;
var _glDrawArraysInstancedARB =
  _glDrawArraysInstanced;
var
  _emscripten_glDrawArraysInstancedARB =
  _glDrawArraysInstancedARB;
var _glDrawArraysInstancedEXT =
  _glDrawArraysInstanced;
var
  _emscripten_glDrawArraysInstancedEXT =
  _glDrawArraysInstancedEXT;
var _glDrawArraysInstancedNV =
  _glDrawArraysInstanced;
var
  _emscripten_glDrawArraysInstancedNV =
  _glDrawArraysInstancedNV;
var tempFixedLengthArray = [];
var _glDrawBuffers = (n, bufs) => {
  var bufArray = tempFixedLengthArray[
    n];
  for (var i = 0; i < n; i++) {
    bufArray[i] = HEAP32[bufs + i *
      4 >> 2]
  }
  GLctx.drawBuffers(bufArray)
};
var _emscripten_glDrawBuffers =
  _glDrawBuffers;
var _glDrawBuffersEXT = _glDrawBuffers;
var _emscripten_glDrawBuffersEXT =
  _glDrawBuffersEXT;
var _glDrawBuffersWEBGL =
_glDrawBuffers;
var _emscripten_glDrawBuffersWEBGL =
  _glDrawBuffersWEBGL;
var _glDrawElements = (mode, count,
  type, indices) => {
  var buf;
  var vertices = 0;
  if (!GLctx
    .currentElementArrayBufferBinding
    ) {
    var size = GL.calcBufLength(1,
      type, 0, count);
    buf = GL.getTempIndexBuffer(size);
    GLctx.bindBuffer(34963, buf);
    GLctx.bufferSubData(34963, 0,
      HEAPU8.subarray(indices,
        indices + size));
    var array_classes = {
      5121: Uint8Array
      , 5123: Uint16Array
      , 5125: Uint32Array
    };
    for (var i = 0; i < GL
      .currentContext
      .maxVertexAttribs; i++) {
      var cb = GL.currentContext
        .clientBuffers[i];
      if (cb.clientside && cb
        .enabled && array_classes[
          type]) {
        vertices = Math.max.apply(
          null, new array_classes[
            type](HEAPU8.buffer,
            indices, count)) + 1;
        break
      }
    }
    indices = 0
  }
  GL.preDrawHandleClientVertexAttribBindings(
    vertices);
  GLctx.drawElements(mode, count,
    type, indices);
  GL.postDrawHandleClientVertexAttribBindings(
    count);
  if (!GLctx
    .currentElementArrayBufferBinding
    ) {
    GLctx.bindBuffer(34963, null)
  }
};
var _emscripten_glDrawElements =
  _glDrawElements;
var _glDrawElementsInstanced = (mode,
  count, type, indices, primcount
  ) => {
  GLctx.drawElementsInstanced(mode,
    count, type, indices, primcount)
};
var
  _emscripten_glDrawElementsInstanced =
  _glDrawElementsInstanced;
var _glDrawElementsInstancedANGLE =
  _glDrawElementsInstanced;
var
  _emscripten_glDrawElementsInstancedANGLE =
  _glDrawElementsInstancedANGLE;
var _glDrawElementsInstancedARB =
  _glDrawElementsInstanced;
var
  _emscripten_glDrawElementsInstancedARB =
  _glDrawElementsInstancedARB;
var _glDrawElementsInstancedEXT =
  _glDrawElementsInstanced;
var
  _emscripten_glDrawElementsInstancedEXT =
  _glDrawElementsInstancedEXT;
var _glDrawElementsInstancedNV =
  _glDrawElementsInstanced;
var
  _emscripten_glDrawElementsInstancedNV =
  _glDrawElementsInstancedNV;
var _glDrawRangeElements = (mode, start,
  end, count, type, indices) => {
  _glDrawElements(mode, count, type,
    indices)
};
var _emscripten_glDrawRangeElements =
  _glDrawRangeElements;
var _glEnable = x0 => GLctx.enable(x0);
var _emscripten_glEnable = _glEnable;
var _glEnableVertexAttribArray =
  index => {
    var cb = GL.currentContext
      .clientBuffers[index];
    cb.enabled = true;
    GLctx.enableVertexAttribArray(index)
  };
var
  _emscripten_glEnableVertexAttribArray =
  _glEnableVertexAttribArray;
var _glEndQuery = x0 => GLctx.endQuery(
  x0);
var _emscripten_glEndQuery =
_glEndQuery;
var _glEndQueryEXT = target => {
  GLctx.disjointTimerQueryExt[
    "endQueryEXT"](target)
};
var _emscripten_glEndQueryEXT =
  _glEndQueryEXT;
var _glEndTransformFeedback = () =>
  GLctx.endTransformFeedback();
var _emscripten_glEndTransformFeedback =
  _glEndTransformFeedback;
var _glFenceSync = (condition,
flags) => {
  var sync = GLctx.fenceSync(
    condition, flags);
  if (sync) {
    var id = GL.getNewId(GL.syncs);
    sync.name = id;
    GL.syncs[id] = sync;
    return id
  }
  return 0
};
var _emscripten_glFenceSync =
  _glFenceSync;
var _glFinish = () => GLctx.finish();
var _emscripten_glFinish = _glFinish;
var _glFlush = () => GLctx.flush();
var _emscripten_glFlush = _glFlush;
var emscriptenWebGLGetBufferBinding =
  target => {
    switch (target) {
      case 34962:
        target = 34964;
        break;
      case 34963:
        target = 34965;
        break;
      case 35051:
        target = 35053;
        break;
      case 35052:
        target = 35055;
        break;
      case 35982:
        target = 35983;
        break;
      case 36662:
        target = 36662;
        break;
      case 36663:
        target = 36663;
        break;
      case 35345:
        target = 35368;
        break
    }
    var buffer = GLctx.getParameter(
      target);
    if (buffer) return buffer.name | 0;
    else return 0
  };
var
  emscriptenWebGLValidateMapBufferTarget =
  target => {
    switch (target) {
      case 34962:
      case 34963:
      case 36662:
      case 36663:
      case 35051:
      case 35052:
      case 35882:
      case 35982:
      case 35345:
        return true;
      default:
        return false
    }
  };
var _glFlushMappedBufferRange = (target,
  offset, length) => {
  if (!
    emscriptenWebGLValidateMapBufferTarget(
      target)) {
    GL.recordError(1280);
    err(
      "GL_INVALID_ENUM in glFlushMappedBufferRange");
    return
  }
  var mapping = GL.mappedBuffers[
    emscriptenWebGLGetBufferBinding(
      target)];
  if (!mapping) {
    GL.recordError(1282);
    err(
      "buffer was never mapped in glFlushMappedBufferRange");
    return
  }
  if (!(mapping.access & 16)) {
    GL.recordError(1282);
    err(
      "buffer was not mapped with GL_MAP_FLUSH_EXPLICIT_BIT in glFlushMappedBufferRange");
    return
  }
  if (offset < 0 || length < 0 ||
    offset + length > mapping.length
    ) {
    GL.recordError(1281);
    err(
      "invalid range in glFlushMappedBufferRange");
    return
  }
  GLctx.bufferSubData(target, mapping
    .offset, HEAPU8.subarray(mapping
      .mem + offset, mapping.mem +
      offset + length))
};
var
  _emscripten_glFlushMappedBufferRange =
  _glFlushMappedBufferRange;
var _glFramebufferRenderbuffer = (
  target, attachment,
  renderbuffertarget, renderbuffer
  ) => {
  GLctx.framebufferRenderbuffer(
    target, attachment,
    renderbuffertarget, GL
    .renderbuffers[renderbuffer])
};
var
  _emscripten_glFramebufferRenderbuffer =
  _glFramebufferRenderbuffer;
var _glFramebufferTexture2D = (target,
  attachment, textarget, texture,
  level) => {
  GLctx.framebufferTexture2D(target,
    attachment, textarget, GL
    .textures[texture], level)
};
var _emscripten_glFramebufferTexture2D =
  _glFramebufferTexture2D;
var _glFramebufferTextureLayer = (
  target, attachment, texture, level,
  layer) => {
  GLctx.framebufferTextureLayer(
    target, attachment, GL.textures[
      texture], level, layer)
};
var
  _emscripten_glFramebufferTextureLayer =
  _glFramebufferTextureLayer;
var _glFrontFace = x0 => GLctx
  .frontFace(x0);
var _emscripten_glFrontFace =
  _glFrontFace;
var _glGenBuffers = (n, buffers) => {
  GL.genObject(n, buffers,
    "createBuffer", GL.buffers)
};
var _emscripten_glGenBuffers =
  _glGenBuffers;
var _glGenFramebuffers = (n, ids) => {
  GL.genObject(n, ids,
    "createFramebuffer", GL
    .framebuffers)
};
var _emscripten_glGenFramebuffers =
  _glGenFramebuffers;
var _glGenQueries = (n, ids) => {
  GL.genObject(n, ids, "createQuery",
    GL.queries)
};
var _emscripten_glGenQueries =
  _glGenQueries;
var _glGenQueriesEXT = (n, ids) => {
  for (var i = 0; i < n; i++) {
    var query = GLctx
      .disjointTimerQueryExt[
        "createQueryEXT"]();
    if (!query) {
      GL.recordError(1282);
      while (i < n) HEAP32[ids + i++ *
        4 >> 2] = 0;
      return
    }
    var id = GL.getNewId(GL.queries);
    query.name = id;
    GL.queries[id] = query;
    HEAP32[ids + i * 4 >> 2] = id
  }
};
var _emscripten_glGenQueriesEXT =
  _glGenQueriesEXT;
var _glGenRenderbuffers = (n,
  renderbuffers) => {
  GL.genObject(n, renderbuffers,
    "createRenderbuffer", GL
    .renderbuffers)
};
var _emscripten_glGenRenderbuffers =
  _glGenRenderbuffers;
var _glGenSamplers = (n, samplers) => {
  GL.genObject(n, samplers,
    "createSampler", GL.samplers)
};
var _emscripten_glGenSamplers =
  _glGenSamplers;
var _emscripten_glGenTextures =
  _glGenTextures;
var _glGenTransformFeedbacks = (n,
  ids) => {
    GL.genObject(n, ids,
      "createTransformFeedback", GL
      .transformFeedbacks)
  };
var
  _emscripten_glGenTransformFeedbacks =
  _glGenTransformFeedbacks;
var _glGenVertexArrays = (n,
arrays) => {
  GL.genObject(n, arrays,
    "createVertexArray", GL.vaos)
};
var _emscripten_glGenVertexArrays =
  _glGenVertexArrays;
var _glGenVertexArraysOES =
  _glGenVertexArrays;
var _emscripten_glGenVertexArraysOES =
  _glGenVertexArraysOES;
var _glGenerateMipmap = x0 => GLctx
  .generateMipmap(x0);
var _emscripten_glGenerateMipmap =
  _glGenerateMipmap;
var __glGetActiveAttribOrUniform = (
  funcName, program, index, bufSize,
  length, size, type, name) => {
  program = GL.programs[program];
  var info = GLctx[funcName](program,
    index);
  if (info) {
    var numBytesWrittenExclNull =
      name && stringToUTF8(info.name,
        name, bufSize);
    if (length) HEAP32[length >> 2] =
      numBytesWrittenExclNull;
    if (size) HEAP32[size >> 2] = info
      .size;
    if (type) HEAP32[type >> 2] = info
      .type
  }
};
var _glGetActiveAttrib = (program,
  index, bufSize, length, size, type,
  name) => {
  __glGetActiveAttribOrUniform(
    "getActiveAttrib", program,
    index, bufSize, length, size,
    type, name)
};
var _emscripten_glGetActiveAttrib =
  _glGetActiveAttrib;
var _glGetActiveUniform = (program,
  index, bufSize, length, size, type,
  name) => {
  __glGetActiveAttribOrUniform(
    "getActiveUniform", program,
    index, bufSize, length, size,
    type, name)
};
var _emscripten_glGetActiveUniform =
  _glGetActiveUniform;
var _glGetActiveUniformBlockName = (
  program, uniformBlockIndex, bufSize,
  length, uniformBlockName) => {
  program = GL.programs[program];
  var result = GLctx
    .getActiveUniformBlockName(
      program, uniformBlockIndex);
  if (!result) return;
  if (uniformBlockName && bufSize >
    0) {
    var numBytesWrittenExclNull =
      stringToUTF8(result,
        uniformBlockName, bufSize);
    if (length) HEAP32[length >> 2] =
      numBytesWrittenExclNull
  } else {
    if (length) HEAP32[length >> 2] =
      0
  }
};
var
  _emscripten_glGetActiveUniformBlockName =
  _glGetActiveUniformBlockName;
var _glGetActiveUniformBlockiv = (
  program, uniformBlockIndex, pname,
  params) => {
  if (!params) {
    GL.recordError(1281);
    return
  }
  program = GL.programs[program];
  if (pname == 35393) {
    var name = GLctx
      .getActiveUniformBlockName(
        program, uniformBlockIndex);
    HEAP32[params >> 2] = name
      .length + 1;
    return
  }
  var result = GLctx
    .getActiveUniformBlockParameter(
      program, uniformBlockIndex,
      pname);
  if (result === null) return;
  if (pname == 35395) {
    for (var i = 0; i < result
      .length; i++) {
      HEAP32[params + i * 4 >> 2] =
        result[i]
    }
  } else {
    HEAP32[params >> 2] = result
  }
};
var
  _emscripten_glGetActiveUniformBlockiv =
  _glGetActiveUniformBlockiv;
var _glGetActiveUniformsiv = (program,
  uniformCount, uniformIndices, pname,
  params) => {
  if (!params) {
    GL.recordError(1281);
    return
  }
  if (uniformCount > 0 &&
    uniformIndices == 0) {
    GL.recordError(1281);
    return
  }
  program = GL.programs[program];
  var ids = [];
  for (var i = 0; i <
    uniformCount; i++) {
    ids.push(HEAP32[uniformIndices +
      i * 4 >> 2])
  }
  var result = GLctx
    .getActiveUniforms(program, ids,
      pname);
  if (!result) return;
  var len = result.length;
  for (var i = 0; i < len; i++) {
    HEAP32[params + i * 4 >> 2] =
      result[i]
  }
};
var _emscripten_glGetActiveUniformsiv =
  _glGetActiveUniformsiv;
var _glGetAttachedShaders = (program,
  maxCount, count, shaders) => {
  var result = GLctx
    .getAttachedShaders(GL.programs[
      program]);
  var len = result.length;
  if (len > maxCount) {
    len = maxCount
  }
  HEAP32[count >> 2] = len;
  for (var i = 0; i < len; ++i) {
    var id = GL.shaders.indexOf(
      result[i]);
    HEAP32[shaders + i * 4 >> 2] = id
  }
};
var _emscripten_glGetAttachedShaders =
  _glGetAttachedShaders;
var _glGetAttribLocation = (program,
  name) => GLctx.getAttribLocation(GL
  .programs[program], UTF8ToString(
    name));
var _emscripten_glGetAttribLocation =
  _glGetAttribLocation;
var _glGetBooleanv = (name_, p) =>
  emscriptenWebGLGet(name_, p, 4);
var _emscripten_glGetBooleanv =
  _glGetBooleanv;
var _glGetBufferParameteri64v = (target,
  value, data) => {
  if (!data) {
    GL.recordError(1281);
    return
  }
  writeI53ToI64(data, GLctx
    .getBufferParameter(target,
      value))
};
var
  _emscripten_glGetBufferParameteri64v =
  _glGetBufferParameteri64v;
var _glGetBufferParameteriv = (target,
  value, data) => {
  if (!data) {
    GL.recordError(1281);
    return
  }
  HEAP32[data >> 2] = GLctx
    .getBufferParameter(target, value)
};
var _emscripten_glGetBufferParameteriv =
  _glGetBufferParameteriv;
var _glGetBufferPointerv = (target,
  pname, params) => {
  if (pname == 35005) {
    var ptr = 0;
    var mappedBuffer = GL
      .mappedBuffers[
        emscriptenWebGLGetBufferBinding(
          target)];
    if (mappedBuffer) {
      ptr = mappedBuffer.mem
    }
    HEAP32[params >> 2] = ptr
  } else {
    GL.recordError(1280);
    err(
      "GL_INVALID_ENUM in glGetBufferPointerv")
  }
};
var _emscripten_glGetBufferPointerv =
  _glGetBufferPointerv;
var _glGetError = () => {
  var error = GLctx.getError() || GL
    .lastError;
  GL.lastError = 0;
  return error
};
var _emscripten_glGetError =
_glGetError;
var _glGetFloatv = (name_, p) =>
  emscriptenWebGLGet(name_, p, 2);
var _emscripten_glGetFloatv =
  _glGetFloatv;
var _glGetFragDataLocation = (program,
  name) => GLctx.getFragDataLocation(
  GL.programs[program], UTF8ToString(
    name));
var _emscripten_glGetFragDataLocation =
  _glGetFragDataLocation;
var
  _glGetFramebufferAttachmentParameteriv =
  (target, attachment, pname,
  params) => {
    var result = GLctx
      .getFramebufferAttachmentParameter(
        target, attachment, pname);
    if (
      result instanceof WebGLRenderbuffer ||
      result instanceof WebGLTexture) {
      result = result.name | 0
    }
    HEAP32[params >> 2] = result
  };
var
  _emscripten_glGetFramebufferAttachmentParameteriv =
  _glGetFramebufferAttachmentParameteriv;
var emscriptenWebGLGetIndexed = (target,
  index, data, type) => {
  if (!data) {
    GL.recordError(1281);
    return
  }
  var result = GLctx
    .getIndexedParameter(target,
      index);
  var ret;
  switch (typeof result) {
    case "boolean":
      ret = result ? 1 : 0;
      break;
    case "number":
      ret = result;
      break;
    case "object":
      if (result === null) {
        switch (target) {
          case 35983:
          case 35368:
            ret = 0;
            break;
          default: {
            GL.recordError(1280);
            return
          }
        }
      } else if (
        result instanceof WebGLBuffer
        ) {
        ret = result.name | 0
      } else {
        GL.recordError(1280);
        return
      }
      break;
    default:
      GL.recordError(1280);
      return
  }
  switch (type) {
    case 1:
      writeI53ToI64(data, ret);
      break;
    case 0:
      HEAP32[data >> 2] = ret;
      break;
    case 2:
      HEAPF32[data >> 2] = ret;
      break;
    case 4:
      HEAP8[data] = ret ? 1 : 0;
      break;
    default:
      throw "internal emscriptenWebGLGetIndexed() error, bad type: " +
        type
  }
};
var _glGetInteger64i_v = (target, index,
  data) => emscriptenWebGLGetIndexed(
  target, index, data, 1);
var _emscripten_glGetInteger64i_v =
  _glGetInteger64i_v;
var _glGetInteger64v = (name_, p) => {
  emscriptenWebGLGet(name_, p, 1)
};
var _emscripten_glGetInteger64v =
  _glGetInteger64v;
var _glGetIntegeri_v = (target, index,
  data) => emscriptenWebGLGetIndexed(
  target, index, data, 0);
var _emscripten_glGetIntegeri_v =
  _glGetIntegeri_v;
var _emscripten_glGetIntegerv =
  _glGetIntegerv;
var _glGetInternalformativ = (target,
  internalformat, pname, bufSize,
  params) => {
  if (bufSize < 0) {
    GL.recordError(1281);
    return
  }
  if (!params) {
    GL.recordError(1281);
    return
  }
  var ret = GLctx
    .getInternalformatParameter(
      target, internalformat, pname);
  if (ret === null) return;
  for (var i = 0; i < ret.length &&
    i < bufSize; ++i) {
    HEAP32[params + i * 4 >> 2] = ret[
      i]
  }
};
var _emscripten_glGetInternalformativ =
  _glGetInternalformativ;
var _glGetProgramBinary = (program,
  bufSize, length, binaryFormat,
  binary) => {
  GL.recordError(1282)
};
var _emscripten_glGetProgramBinary =
  _glGetProgramBinary;
var _glGetProgramInfoLog = (program,
  maxLength, length, infoLog) => {
  var log = GLctx.getProgramInfoLog(GL
    .programs[program]);
  if (log === null) log =
    "(unknown error)";
  var numBytesWrittenExclNull =
    maxLength > 0 && infoLog ?
    stringToUTF8(log, infoLog,
      maxLength) : 0;
  if (length) HEAP32[length >> 2] =
    numBytesWrittenExclNull
};
var _emscripten_glGetProgramInfoLog =
  _glGetProgramInfoLog;
var _glGetProgramiv = (program, pname,
  p) => {
  if (!p) {
    GL.recordError(1281);
    return
  }
  if (program >= GL.counter) {
    GL.recordError(1281);
    return
  }
  program = GL.programs[program];
  if (pname == 35716) {
    var log = GLctx.getProgramInfoLog(
      program);
    if (log === null) log =
      "(unknown error)";
    HEAP32[p >> 2] = log.length + 1
  } else if (pname == 35719) {
    if (!program.maxUniformLength) {
      for (var i = 0; i < GLctx
        .getProgramParameter(program,
          35718); ++i) {
        program.maxUniformLength =
          Math.max(program
            .maxUniformLength, GLctx
            .getActiveUniform(program,
              i).name.length + 1)
      }
    }
    HEAP32[p >> 2] = program
      .maxUniformLength
  } else if (pname == 35722) {
    if (!program.maxAttributeLength) {
      for (var i = 0; i < GLctx
        .getProgramParameter(program,
          35721); ++i) {
        program.maxAttributeLength =
          Math.max(program
            .maxAttributeLength, GLctx
            .getActiveAttrib(program,
              i).name.length + 1)
      }
    }
    HEAP32[p >> 2] = program
      .maxAttributeLength
  } else if (pname == 35381) {
    if (!program
      .maxUniformBlockNameLength) {
      for (var i = 0; i < GLctx
        .getProgramParameter(program,
          35382); ++i) {
        program
          .maxUniformBlockNameLength =
          Math.max(program
            .maxUniformBlockNameLength,
            GLctx
            .getActiveUniformBlockName(
              program, i).length + 1)
      }
    }
    HEAP32[p >> 2] = program
      .maxUniformBlockNameLength
  } else {
    HEAP32[p >> 2] = GLctx
      .getProgramParameter(program,
        pname)
  }
};
var _emscripten_glGetProgramiv =
  _glGetProgramiv;
var _glGetQueryObjecti64vEXT = (id,
  pname, params) => {
  if (!params) {
    GL.recordError(1281);
    return
  }
  var query = GL.queries[id];
  var param;
  if (GL.currentContext.version < 2) {
    param = GLctx
      .disjointTimerQueryExt[
        "getQueryObjectEXT"](query,
        pname)
  } else {
    param = GLctx.getQueryParameter(
      query, pname)
  }
  var ret;
  if (typeof param == "boolean") {
    ret = param ? 1 : 0
  } else {
    ret = param
  }
  writeI53ToI64(params, ret)
};
var
  _emscripten_glGetQueryObjecti64vEXT =
  _glGetQueryObjecti64vEXT;
var _glGetQueryObjectivEXT = (id, pname,
  params) => {
  if (!params) {
    GL.recordError(1281);
    return
  }
  var query = GL.queries[id];
  var param = GLctx
    .disjointTimerQueryExt[
      "getQueryObjectEXT"](query,
      pname);
  var ret;
  if (typeof param == "boolean") {
    ret = param ? 1 : 0
  } else {
    ret = param
  }
  HEAP32[params >> 2] = ret
};
var _emscripten_glGetQueryObjectivEXT =
  _glGetQueryObjectivEXT;
var _glGetQueryObjectui64vEXT =
  _glGetQueryObjecti64vEXT;
var
  _emscripten_glGetQueryObjectui64vEXT =
  _glGetQueryObjectui64vEXT;
var _glGetQueryObjectuiv = (id, pname,
  params) => {
  if (!params) {
    GL.recordError(1281);
    return
  }
  var query = GL.queries[id];
  var param = GLctx.getQueryParameter(
    query, pname);
  var ret;
  if (typeof param == "boolean") {
    ret = param ? 1 : 0
  } else {
    ret = param
  }
  HEAP32[params >> 2] = ret
};
var _emscripten_glGetQueryObjectuiv =
  _glGetQueryObjectuiv;
var _glGetQueryObjectuivEXT =
  _glGetQueryObjectivEXT;
var _emscripten_glGetQueryObjectuivEXT =
  _glGetQueryObjectuivEXT;
var _glGetQueryiv = (target, pname,
  params) => {
  if (!params) {
    GL.recordError(1281);
    return
  }
  HEAP32[params >> 2] = GLctx
    .getQuery(target, pname)
};
var _emscripten_glGetQueryiv =
  _glGetQueryiv;
var _glGetQueryivEXT = (target, pname,
  params) => {
  if (!params) {
    GL.recordError(1281);
    return
  }
  HEAP32[params >> 2] = GLctx
    .disjointTimerQueryExt[
      "getQueryEXT"](target, pname)
};
var _emscripten_glGetQueryivEXT =
  _glGetQueryivEXT;
var _glGetRenderbufferParameteriv = (
  target, pname, params) => {
  if (!params) {
    GL.recordError(1281);
    return
  }
  HEAP32[params >> 2] = GLctx
    .getRenderbufferParameter(target,
      pname)
};
var
  _emscripten_glGetRenderbufferParameteriv =
  _glGetRenderbufferParameteriv;
var _glGetSamplerParameterfv = (sampler,
  pname, params) => {
  if (!params) {
    GL.recordError(1281);
    return
  }
  HEAPF32[params >> 2] = GLctx
    .getSamplerParameter(GL.samplers[
      sampler], pname)
};
var
  _emscripten_glGetSamplerParameterfv =
  _glGetSamplerParameterfv;
var _glGetSamplerParameteriv = (sampler,
  pname, params) => {
  if (!params) {
    GL.recordError(1281);
    return
  }
  HEAP32[params >> 2] = GLctx
    .getSamplerParameter(GL.samplers[
      sampler], pname)
};
var
  _emscripten_glGetSamplerParameteriv =
  _glGetSamplerParameteriv;
var _glGetShaderInfoLog = (shader,
  maxLength, length, infoLog) => {
  var log = GLctx.getShaderInfoLog(GL
    .shaders[shader]);
  if (log === null) log =
    "(unknown error)";
  var numBytesWrittenExclNull =
    maxLength > 0 && infoLog ?
    stringToUTF8(log, infoLog,
      maxLength) : 0;
  if (length) HEAP32[length >> 2] =
    numBytesWrittenExclNull
};
var _emscripten_glGetShaderInfoLog =
  _glGetShaderInfoLog;
var _glGetShaderPrecisionFormat = (
  shaderType, precisionType, range,
  precision) => {
  var result = GLctx
    .getShaderPrecisionFormat(
      shaderType, precisionType);
  HEAP32[range >> 2] = result
  .rangeMin;
  HEAP32[range + 4 >> 2] = result
    .rangeMax;
  HEAP32[precision >> 2] = result
    .precision
};
var
  _emscripten_glGetShaderPrecisionFormat =
  _glGetShaderPrecisionFormat;
var _glGetShaderSource = (shader,
  bufSize, length, source) => {
  var result = GLctx.getShaderSource(
    GL.shaders[shader]);
  if (!result) return;
  var numBytesWrittenExclNull =
    bufSize > 0 && source ?
    stringToUTF8(result, source,
      bufSize) : 0;
  if (length) HEAP32[length >> 2] =
    numBytesWrittenExclNull
};
var _emscripten_glGetShaderSource =
  _glGetShaderSource;
var _glGetShaderiv = (shader, pname,
  p) => {
    if (!p) {
      GL.recordError(1281);
      return
    }
    if (pname == 35716) {
      var log = GLctx.getShaderInfoLog(
        GL.shaders[shader]);
      if (log === null) log =
        "(unknown error)";
      var logLength = log ? log.length +
        1 : 0;
      HEAP32[p >> 2] = logLength
    } else if (pname == 35720) {
      var source = GLctx
        .getShaderSource(GL.shaders[
          shader]);
      var sourceLength = source ? source
        .length + 1 : 0;
      HEAP32[p >> 2] = sourceLength
    } else {
      HEAP32[p >> 2] = GLctx
        .getShaderParameter(GL.shaders[
          shader], pname)
    }
  };
var _emscripten_glGetShaderiv =
  _glGetShaderiv;
var _glGetString = name_ => {
  var ret = GL.stringCache[name_];
  if (!ret) {
    switch (name_) {
      case 7939:
        ret = stringToNewUTF8(
          webglGetExtensions().join(
            " "));
        break;
      case 7936:
      case 7937:
      case 37445:
      case 37446:
        var s = GLctx.getParameter(
          name_);
        if (!s) {
          GL.recordError(1280)
        }
        ret = s ? stringToNewUTF8(s) :
          0;
        break;
      case 7938:
        var glVersion = GLctx
          .getParameter(7938);
        if (true) glVersion =
          `OpenGL ES 3.0 (${glVersion})`;
        else {
          glVersion =
            `OpenGL ES 2.0 (${glVersion})`
        }
        ret = stringToNewUTF8(
          glVersion);
        break;
      case 35724:
        var glslVersion = GLctx
          .getParameter(35724);
        var ver_re =
          /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
        var ver_num = glslVersion
          .match(ver_re);
        if (ver_num !== null) {
          if (ver_num[1].length == 3)
            ver_num[1] = ver_num[1] +
            "0";
          glslVersion =
            `OpenGL ES GLSL ES ${ver_num[1]} (${glslVersion})`
        }
        ret = stringToNewUTF8(
          glslVersion);
        break;
      default:
        GL.recordError(1280)
    }
    GL.stringCache[name_] = ret
  }
  return ret
};
var _emscripten_glGetString =
  _glGetString;
var _glGetStringi = (name, index) => {
  if (GL.currentContext.version < 2) {
    GL.recordError(1282);
    return 0
  }
  var stringiCache = GL.stringiCache[
    name];
  if (stringiCache) {
    if (index < 0 || index >=
      stringiCache.length) {
      GL.recordError(1281);
      return 0
    }
    return stringiCache[index]
  }
  switch (name) {
    case 7939:
      var exts = webglGetExtensions()
        .map(stringToNewUTF8);
      stringiCache = GL.stringiCache[
        name] = exts;
      if (index < 0 || index >=
        stringiCache.length) {
        GL.recordError(1281);
        return 0
      }
      return stringiCache[index];
    default:
      GL.recordError(1280);
      return 0
  }
};
var _emscripten_glGetStringi =
  _glGetStringi;
var _glGetSynciv = (sync, pname,
  bufSize, length, values) => {
  if (bufSize < 0) {
    GL.recordError(1281);
    return
  }
  if (!values) {
    GL.recordError(1281);
    return
  }
  var ret = GLctx.getSyncParameter(GL
    .syncs[sync], pname);
  if (ret !== null) {
    HEAP32[values >> 2] = ret;
    if (length) HEAP32[length >> 2] =
      1
  }
};
var _emscripten_glGetSynciv =
  _glGetSynciv;
var _glGetTexParameterfv = (target,
  pname, params) => {
  if (!params) {
    GL.recordError(1281);
    return
  }
  HEAPF32[params >> 2] = GLctx
    .getTexParameter(target, pname)
};
var _emscripten_glGetTexParameterfv =
  _glGetTexParameterfv;
var _glGetTexParameteriv = (target,
  pname, params) => {
  if (!params) {
    GL.recordError(1281);
    return
  }
  HEAP32[params >> 2] = GLctx
    .getTexParameter(target, pname)
};
var _emscripten_glGetTexParameteriv =
  _glGetTexParameteriv;
var _glGetTransformFeedbackVarying = (
  program, index, bufSize, length,
  size, type, name) => {
  program = GL.programs[program];
  var info = GLctx
    .getTransformFeedbackVarying(
      program, index);
  if (!info) return;
  if (name && bufSize > 0) {
    var numBytesWrittenExclNull =
      stringToUTF8(info.name, name,
        bufSize);
    if (length) HEAP32[length >> 2] =
      numBytesWrittenExclNull
  } else {
    if (length) HEAP32[length >> 2] =
      0
  }
  if (size) HEAP32[size >> 2] = info
    .size;
  if (type) HEAP32[type >> 2] = info
    .type
};
var
  _emscripten_glGetTransformFeedbackVarying =
  _glGetTransformFeedbackVarying;
var _glGetUniformBlockIndex = (program,
    uniformBlockName) => GLctx
  .getUniformBlockIndex(GL.programs[
    program], UTF8ToString(
    uniformBlockName));
var _emscripten_glGetUniformBlockIndex =
  _glGetUniformBlockIndex;
var _glGetUniformIndices = (program,
  uniformCount, uniformNames,
  uniformIndices) => {
  if (!uniformIndices) {
    GL.recordError(1281);
    return
  }
  if (uniformCount > 0 && (
      uniformNames == 0 ||
      uniformIndices == 0)) {
    GL.recordError(1281);
    return
  }
  program = GL.programs[program];
  var names = [];
  for (var i = 0; i <
    uniformCount; i++) names.push(
    UTF8ToString(HEAP32[
      uniformNames + i * 4 >> 2]));
  var result = GLctx
    .getUniformIndices(program,
    names);
  if (!result) return;
  var len = result.length;
  for (var i = 0; i < len; i++) {
    HEAP32[uniformIndices + i * 4 >>
      2] = result[i]
  }
};
var _emscripten_glGetUniformIndices =
  _glGetUniformIndices;
var jstoi_q = str => parseInt(str);
var webglGetLeftBracePos = name => name
  .slice(-1) == "]" && name.lastIndexOf(
    "[");
var
  webglPrepareUniformLocationsBeforeFirstUse =
  program => {
    var uniformLocsById = program
      .uniformLocsById
      , uniformSizeAndIdsByName =
      program.uniformSizeAndIdsByName
      , i, j;
    if (!uniformLocsById) {
      program.uniformLocsById =
        uniformLocsById = {};
      program
      .uniformArrayNamesById = {};
      for (i = 0; i < GLctx
        .getProgramParameter(program,
          35718); ++i) {
        var u = GLctx.getActiveUniform(
          program, i);
        var nm = u.name;
        var sz = u.size;
        var lb = webglGetLeftBracePos(
          nm);
        var arrayName = lb > 0 ? nm
          .slice(0, lb) : nm;
        var id = program
          .uniformIdCounter;
        program.uniformIdCounter += sz;
        uniformSizeAndIdsByName[
          arrayName] = [sz, id];
        for (j = 0; j < sz; ++j) {
          uniformLocsById[id] = j;
          program.uniformArrayNamesById[
            id++] = arrayName
        }
      }
    }
  };
var _glGetUniformLocation = (program,
  name) => {
  name = UTF8ToString(name);
  if (program = GL.programs[
    program]) {
    webglPrepareUniformLocationsBeforeFirstUse
      (program);
    var uniformLocsById = program
      .uniformLocsById;
    var arrayIndex = 0;
    var uniformBaseName = name;
    var leftBrace =
      webglGetLeftBracePos(name);
    if (leftBrace > 0) {
      arrayIndex = jstoi_q(name.slice(
        leftBrace + 1)) >>> 0;
      uniformBaseName = name.slice(0,
        leftBrace)
    }
    var sizeAndId = program
      .uniformSizeAndIdsByName[
        uniformBaseName];
    if (sizeAndId && arrayIndex <
      sizeAndId[0]) {
      arrayIndex += sizeAndId[1];
      if (uniformLocsById[
        arrayIndex] = uniformLocsById[
          arrayIndex] || GLctx
        .getUniformLocation(program,
          name)) {
        return arrayIndex
      }
    }
  } else {
    GL.recordError(1281)
  }
  return -1
};
var _emscripten_glGetUniformLocation =
  _glGetUniformLocation;
var webglGetUniformLocation =
  location => {
    var p = GLctx.currentProgram;
    if (p) {
      var webglLoc = p.uniformLocsById[
        location];
      if (typeof webglLoc == "number") {
        p.uniformLocsById[location] =
          webglLoc = GLctx
          .getUniformLocation(p, p
            .uniformArrayNamesById[
              location] + (webglLoc >
              0 ? `[${webglLoc}]` : ""))
      }
      return webglLoc
    } else {
      GL.recordError(1282)
    }
  };
var emscriptenWebGLGetUniform = (
  program, location, params, type
  ) => {
  if (!params) {
    GL.recordError(1281);
    return
  }
  program = GL.programs[program];
  webglPrepareUniformLocationsBeforeFirstUse
    (program);
  var data = GLctx.getUniform(program,
    webglGetUniformLocation(
      location));
  if (typeof data == "number" ||
    typeof data == "boolean") {
    switch (type) {
      case 0:
        HEAP32[params >> 2] = data;
        break;
      case 2:
        HEAPF32[params >> 2] = data;
        break
    }
  } else {
    for (var i = 0; i < data
      .length; i++) {
      switch (type) {
        case 0:
          HEAP32[params + i * 4 >>
            2] = data[i];
          break;
        case 2:
          HEAPF32[params + i * 4 >>
            2] = data[i];
          break
      }
    }
  }
};
var _glGetUniformfv = (program,
  location, params) => {
  emscriptenWebGLGetUniform(program,
    location, params, 2)
};
var _emscripten_glGetUniformfv =
  _glGetUniformfv;
var _glGetUniformiv = (program,
  location, params) => {
  emscriptenWebGLGetUniform(program,
    location, params, 0)
};
var _emscripten_glGetUniformiv =
  _glGetUniformiv;
var _glGetUniformuiv = (program,
    location, params) =>
  emscriptenWebGLGetUniform(program,
    location, params, 0);
var _emscripten_glGetUniformuiv =
  _glGetUniformuiv;
var emscriptenWebGLGetVertexAttrib = (
  index, pname, params, type) => {
  if (!params) {
    GL.recordError(1281);
    return
  }
  if (GL.currentContext.clientBuffers[
      index].enabled) {
    err(
      "glGetVertexAttrib*v on client-side array: not supported, bad data returned")
  }
  var data = GLctx.getVertexAttrib(
    index, pname);
  if (pname == 34975) {
    HEAP32[params >> 2] = data &&
      data["name"]
  } else if (typeof data ==
    "number" || typeof data ==
    "boolean") {
    switch (type) {
      case 0:
        HEAP32[params >> 2] = data;
        break;
      case 2:
        HEAPF32[params >> 2] = data;
        break;
      case 5:
        HEAP32[params >> 2] = Math
          .fround(data);
        break
    }
  } else {
    for (var i = 0; i < data
      .length; i++) {
      switch (type) {
        case 0:
          HEAP32[params + i * 4 >>
            2] = data[i];
          break;
        case 2:
          HEAPF32[params + i * 4 >>
            2] = data[i];
          break;
        case 5:
          HEAP32[params + i * 4 >>
            2] = Math.fround(data[i]);
          break
      }
    }
  }
};
var _glGetVertexAttribIiv = (index,
  pname, params) => {
  emscriptenWebGLGetVertexAttrib(
    index, pname, params, 0)
};
var _emscripten_glGetVertexAttribIiv =
  _glGetVertexAttribIiv;
var _glGetVertexAttribIuiv =
  _glGetVertexAttribIiv;
var _emscripten_glGetVertexAttribIuiv =
  _glGetVertexAttribIuiv;
var _glGetVertexAttribPointerv = (index,
  pname, pointer) => {
  if (!pointer) {
    GL.recordError(1281);
    return
  }
  if (GL.currentContext.clientBuffers[
      index].enabled) {
    err(
      "glGetVertexAttribPointer on client-side array: not supported, bad data returned")
  }
  HEAP32[pointer >> 2] = GLctx
    .getVertexAttribOffset(index,
      pname)
};
var
  _emscripten_glGetVertexAttribPointerv =
  _glGetVertexAttribPointerv;
var _glGetVertexAttribfv = (index,
  pname, params) => {
  emscriptenWebGLGetVertexAttrib(
    index, pname, params, 2)
};
var _emscripten_glGetVertexAttribfv =
  _glGetVertexAttribfv;
var _glGetVertexAttribiv = (index,
  pname, params) => {
  emscriptenWebGLGetVertexAttrib(
    index, pname, params, 5)
};
var _emscripten_glGetVertexAttribiv =
  _glGetVertexAttribiv;
var _glHint = (x0, x1) => GLctx.hint(x0,
  x1);
var _emscripten_glHint = _glHint;
var _glInvalidateFramebuffer = (target,
  numAttachments, attachments) => {
  var list = tempFixedLengthArray[
    numAttachments];
  for (var i = 0; i <
    numAttachments; i++) {
    list[i] = HEAP32[attachments + i *
      4 >> 2]
  }
  GLctx.invalidateFramebuffer(target,
    list)
};
var
  _emscripten_glInvalidateFramebuffer =
  _glInvalidateFramebuffer;
var _glInvalidateSubFramebuffer = (
  target, numAttachments, attachments,
  x, y, width, height) => {
  var list = tempFixedLengthArray[
    numAttachments];
  for (var i = 0; i <
    numAttachments; i++) {
    list[i] = HEAP32[attachments + i *
      4 >> 2]
  }
  GLctx.invalidateSubFramebuffer(
    target, list, x, y, width,
    height)
};
var
  _emscripten_glInvalidateSubFramebuffer =
  _glInvalidateSubFramebuffer;
var _glIsBuffer = buffer => {
  var b = GL.buffers[buffer];
  if (!b) return 0;
  return GLctx.isBuffer(b)
};
var _emscripten_glIsBuffer =
_glIsBuffer;
var _glIsEnabled = x0 => GLctx
  .isEnabled(x0);
var _emscripten_glIsEnabled =
  _glIsEnabled;
var _glIsFramebuffer = framebuffer => {
  var fb = GL.framebuffers[
    framebuffer];
  if (!fb) return 0;
  return GLctx.isFramebuffer(fb)
};
var _emscripten_glIsFramebuffer =
  _glIsFramebuffer;
var _glIsProgram = program => {
  program = GL.programs[program];
  if (!program) return 0;
  return GLctx.isProgram(program)
};
var _emscripten_glIsProgram =
  _glIsProgram;
var _glIsQuery = id => {
  var query = GL.queries[id];
  if (!query) return 0;
  return GLctx.isQuery(query)
};
var _emscripten_glIsQuery = _glIsQuery;
var _glIsQueryEXT = id => {
  var query = GL.queries[id];
  if (!query) return 0;
  return GLctx.disjointTimerQueryExt[
    "isQueryEXT"](query)
};
var _emscripten_glIsQueryEXT =
  _glIsQueryEXT;
var _glIsRenderbuffer =
renderbuffer => {
  var rb = GL.renderbuffers[
    renderbuffer];
  if (!rb) return 0;
  return GLctx.isRenderbuffer(rb)
};
var _emscripten_glIsRenderbuffer =
  _glIsRenderbuffer;
var _glIsSampler = id => {
  var sampler = GL.samplers[id];
  if (!sampler) return 0;
  return GLctx.isSampler(sampler)
};
var _emscripten_glIsSampler =
  _glIsSampler;
var _glIsShader = shader => {
  var s = GL.shaders[shader];
  if (!s) return 0;
  return GLctx.isShader(s)
};
var _emscripten_glIsShader =
_glIsShader;
var _glIsSync = sync => GLctx.isSync(GL
  .syncs[sync]);
var _emscripten_glIsSync = _glIsSync;
var _glIsTexture = id => {
  var texture = GL.textures[id];
  if (!texture) return 0;
  return GLctx.isTexture(texture)
};
var _emscripten_glIsTexture =
  _glIsTexture;
var _glIsTransformFeedback = id => GLctx
  .isTransformFeedback(GL
    .transformFeedbacks[id]);
var _emscripten_glIsTransformFeedback =
  _glIsTransformFeedback;
var _glIsVertexArray = array => {
  var vao = GL.vaos[array];
  if (!vao) return 0;
  return GLctx.isVertexArray(vao)
};
var _emscripten_glIsVertexArray =
  _glIsVertexArray;
var _glIsVertexArrayOES =
  _glIsVertexArray;
var _emscripten_glIsVertexArrayOES =
  _glIsVertexArrayOES;
var _glLineWidth = x0 => GLctx
  .lineWidth(x0);
var _emscripten_glLineWidth =
  _glLineWidth;
var _glLinkProgram = program => {
  program = GL.programs[program];
  GLctx.linkProgram(program);
  program.uniformLocsById = 0;
  program.uniformSizeAndIdsByName = {}
};
var _emscripten_glLinkProgram =
  _glLinkProgram;
var _glMapBufferRange = (target, offset,
  length, access) => {
  if ((access & (1 | 32)) != 0) {
    warnOnce(
      "glMapBufferRange access does not support MAP_READ or MAP_UNSYNCHRONIZED"
      );
    return 0
  }
  if ((access & 2) == 0) {
    err(
      "glMapBufferRange access must include MAP_WRITE");
    return 0
  }
  if ((access & (4 | 8)) == 0) {
    err(
      "glMapBufferRange access must include INVALIDATE_BUFFER or INVALIDATE_RANGE");
    return 0
  }
  if (!
    emscriptenWebGLValidateMapBufferTarget(
      target)) {
    GL.recordError(1280);
    err(
      "GL_INVALID_ENUM in glMapBufferRange");
    return 0
  }
  var mem = _malloc(length)
    , binding =
    emscriptenWebGLGetBufferBinding(
      target);
  if (!mem) return 0;
  if (!GL.mappedBuffers[binding]) GL
    .mappedBuffers[binding] = {};
  binding = GL.mappedBuffers[binding];
  binding.offset = offset;
  binding.length = length;
  binding.mem = mem;
  binding.access = access;
  return mem
};
var _emscripten_glMapBufferRange =
  _glMapBufferRange;
var _glPauseTransformFeedback = () =>
  GLctx.pauseTransformFeedback();
var
  _emscripten_glPauseTransformFeedback =
  _glPauseTransformFeedback;
var _glPixelStorei = (pname, param) => {
  if (pname == 3317) {
    GL.unpackAlignment = param
  }
  GLctx.pixelStorei(pname, param)
};
var _emscripten_glPixelStorei =
  _glPixelStorei;
var _glPolygonOffset = (x0, x1) => GLctx
  .polygonOffset(x0, x1);
var _emscripten_glPolygonOffset =
  _glPolygonOffset;
var _glProgramBinary = (program,
  binaryFormat, binary, length) => {
  GL.recordError(1280)
};
var _emscripten_glProgramBinary =
  _glProgramBinary;
var _glProgramParameteri = (program,
  pname, value) => {
  GL.recordError(1280)
};
var _emscripten_glProgramParameteri =
  _glProgramParameteri;
var _glQueryCounterEXT = (id,
target) => {
  GLctx.disjointTimerQueryExt[
    "queryCounterEXT"](GL.queries[
    id], target)
};
var _emscripten_glQueryCounterEXT =
  _glQueryCounterEXT;
var _glReadBuffer = x0 => GLctx
  .readBuffer(x0);
var _emscripten_glReadBuffer =
  _glReadBuffer;
var computeUnpackAlignedImageSize = (
  width, height, sizePerPixel,
  alignment) => {
  function roundedToNextMultipleOf(x,
    y) {
    return x + y - 1 & -y
  }
  var plainRowSize = width *
    sizePerPixel;
  var alignedRowSize =
    roundedToNextMultipleOf(
      plainRowSize, alignment);
  return height * alignedRowSize
};
var colorChannelsInGlTextureFormat =
  format => {
    var colorChannels = {
      5: 3
      , 6: 4
      , 8: 2
      , 29502: 3
      , 29504: 4
      , 26917: 2
      , 26918: 2
      , 29846: 3
      , 29847: 4
    };
    return colorChannels[format -
      6402] || 1
  };
var heapObjectForWebGLType = type => {
  type -= 5120;
  if (type == 0) return HEAP8;
  if (type == 1) return HEAPU8;
  if (type == 2) return HEAP16;
  if (type == 4) return HEAP32;
  if (type == 6) return HEAPF32;
  if (type == 5 || type == 28922 ||
    type == 28520 || type == 30779 ||
    type == 30782) return HEAPU32;
  return HEAPU16
};
var toTypedArrayIndex = (pointer,
  heap) => pointer >>> 31 - Math.clz32(
    heap.BYTES_PER_ELEMENT);
var emscriptenWebGLGetTexPixelData = (
  type, format, width, height, pixels,
  internalFormat) => {
  var heap = heapObjectForWebGLType(
    type);
  var sizePerPixel =
    colorChannelsInGlTextureFormat(
      format) * heap
    .BYTES_PER_ELEMENT;
  var bytes =
    computeUnpackAlignedImageSize(
      width, height, sizePerPixel, GL
      .unpackAlignment);
  return heap.subarray(
    toTypedArrayIndex(pixels, heap),
    toTypedArrayIndex(pixels +
      bytes, heap))
};
var _glReadPixels = (x, y, width,
  height, format, type, pixels) => {
  if (true) {
    if (GLctx
      .currentPixelPackBufferBinding
      ) {
      GLctx.readPixels(x, y, width,
        height, format, type, pixels
        )
    } else {
      var heap =
        heapObjectForWebGLType(type);
      var target = toTypedArrayIndex(
        pixels, heap);
      GLctx.readPixels(x, y, width,
        height, format, type, heap,
        target)
    }
    return
  }
  var pixelData =
    emscriptenWebGLGetTexPixelData(
      type, format, width, height,
      pixels, format);
  if (!pixelData) {
    GL.recordError(1280);
    return
  }
  GLctx.readPixels(x, y, width,
    height, format, type, pixelData)
};
var _emscripten_glReadPixels =
  _glReadPixels;
var _glReleaseShaderCompiler = () => {};
var
  _emscripten_glReleaseShaderCompiler =
  _glReleaseShaderCompiler;
var _glRenderbufferStorage = (x0, x1,
    x2, x3) => GLctx
  .renderbufferStorage(x0, x1, x2, x3);
var _emscripten_glRenderbufferStorage =
  _glRenderbufferStorage;
var _glRenderbufferStorageMultisample =
  (x0, x1, x2, x3, x4) => GLctx
  .renderbufferStorageMultisample(x0,
    x1, x2, x3, x4);
var
  _emscripten_glRenderbufferStorageMultisample =
  _glRenderbufferStorageMultisample;
var _glResumeTransformFeedback = () =>
  GLctx.resumeTransformFeedback();
var
  _emscripten_glResumeTransformFeedback =
  _glResumeTransformFeedback;
var _glSampleCoverage = (value,
  invert) => {
    GLctx.sampleCoverage(value, !!
      invert)
  };
var _emscripten_glSampleCoverage =
  _glSampleCoverage;
var _glSamplerParameterf = (sampler,
  pname, param) => {
  GLctx.samplerParameterf(GL.samplers[
    sampler], pname, param)
};
var _emscripten_glSamplerParameterf =
  _glSamplerParameterf;
var _glSamplerParameterfv = (sampler,
  pname, params) => {
  var param = HEAPF32[params >> 2];
  GLctx.samplerParameterf(GL.samplers[
    sampler], pname, param)
};
var _emscripten_glSamplerParameterfv =
  _glSamplerParameterfv;
var _glSamplerParameteri = (sampler,
  pname, param) => {
  GLctx.samplerParameteri(GL.samplers[
    sampler], pname, param)
};
var _emscripten_glSamplerParameteri =
  _glSamplerParameteri;
var _glSamplerParameteriv = (sampler,
  pname, params) => {
  var param = HEAP32[params >> 2];
  GLctx.samplerParameteri(GL.samplers[
    sampler], pname, param)
};
var _emscripten_glSamplerParameteriv =
  _glSamplerParameteriv;
var _glScissor = (x0, x1, x2, x3) =>
  GLctx.scissor(x0, x1, x2, x3);
var _emscripten_glScissor = _glScissor;
var _glShaderBinary = (count, shaders,
  binaryformat, binary, length) => {
  GL.recordError(1280)
};
var _emscripten_glShaderBinary =
  _glShaderBinary;
var _glShaderSource = (shader, count,
  string, length) => {
  var source = GL.getSource(shader,
    count, string, length);
  GLctx.shaderSource(GL.shaders[
    shader], source)
};
var _emscripten_glShaderSource =
  _glShaderSource;
var _glStencilFunc = (x0, x1, x2) =>
  GLctx.stencilFunc(x0, x1, x2);
var _emscripten_glStencilFunc =
  _glStencilFunc;
var _glStencilFuncSeparate = (x0, x1,
    x2, x3) => GLctx
  .stencilFuncSeparate(x0, x1, x2, x3);
var _emscripten_glStencilFuncSeparate =
  _glStencilFuncSeparate;
var _glStencilMask = x0 => GLctx
  .stencilMask(x0);
var _emscripten_glStencilMask =
  _glStencilMask;
var _glStencilMaskSeparate = (x0, x1) =>
  GLctx.stencilMaskSeparate(x0, x1);
var _emscripten_glStencilMaskSeparate =
  _glStencilMaskSeparate;
var _glStencilOp = (x0, x1, x2) => GLctx
  .stencilOp(x0, x1, x2);
var _emscripten_glStencilOp =
  _glStencilOp;
var _glStencilOpSeparate = (x0, x1, x2,
  x3) => GLctx.stencilOpSeparate(x0,
  x1, x2, x3);
var _emscripten_glStencilOpSeparate =
  _glStencilOpSeparate;
var _glTexImage2D = (target, level,
  internalFormat, width, height,
  border, format, type, pixels) => {
  if (true) {
    if (GLctx
      .currentPixelUnpackBufferBinding
      ) {
      GLctx.texImage2D(target, level,
        internalFormat, width,
        height, border, format,
        type, pixels)
    } else if (pixels) {
      var heap =
        heapObjectForWebGLType(type);
      GLctx.texImage2D(target, level,
        internalFormat, width,
        height, border, format,
        type, heap,
        toTypedArrayIndex(pixels,
          heap))
    } else {
      GLctx.texImage2D(target, level,
        internalFormat, width,
        height, border, format,
        type, null)
    }
    return
  }
  GLctx.texImage2D(target, level,
    internalFormat, width, height,
    border, format, type, pixels ?
    emscriptenWebGLGetTexPixelData(
      type, format, width, height,
      pixels, internalFormat) : null
    )
};
var _emscripten_glTexImage2D =
  _glTexImage2D;
var _glTexImage3D = (target, level,
    internalFormat, width, height,
    depth, border, format, type, pixels
    ) => {
    if (GLctx
      .currentPixelUnpackBufferBinding
      ) {
      GLctx.texImage3D(target, level,
        internalFormat, width, height,
        depth, border, format, type,
        pixels)
    } else if (pixels) {
      var heap = heapObjectForWebGLType(
        type);
      GLctx.texImage3D(target, level,
        internalFormat, width, height,
        depth, border, format, type,
        heap, toTypedArrayIndex(
          pixels, heap))
    } else {
      GLctx.texImage3D(target, level,
        internalFormat, width, height,
        depth, border, format, type,
        null)
    }
  };
var _emscripten_glTexImage3D =
  _glTexImage3D;
var _glTexParameterf = (x0, x1, x2) =>
  GLctx.texParameterf(x0, x1, x2);
var _emscripten_glTexParameterf =
  _glTexParameterf;
var _glTexParameterfv = (target, pname,
  params) => {
  var param = HEAPF32[params >> 2];
  GLctx.texParameterf(target, pname,
    param)
};
var _emscripten_glTexParameterfv =
  _glTexParameterfv;
var _emscripten_glTexParameteri =
  _glTexParameteri;
var _glTexParameteriv = (target, pname,
  params) => {
  var param = HEAP32[params >> 2];
  GLctx.texParameteri(target, pname,
    param)
};
var _emscripten_glTexParameteriv =
  _glTexParameteriv;
var _glTexStorage2D = (x0, x1, x2, x3,
  x4) => GLctx.texStorage2D(x0, x1,
  x2, x3, x4);
var _emscripten_glTexStorage2D =
  _glTexStorage2D;
var _glTexStorage3D = (x0, x1, x2, x3,
  x4, x5) => GLctx.texStorage3D(x0,
  x1, x2, x3, x4, x5);
var _emscripten_glTexStorage3D =
  _glTexStorage3D;
var _glTexSubImage2D = (target, level,
  xoffset, yoffset, width, height,
  format, type, pixels) => {
  if (true) {
    if (GLctx
      .currentPixelUnpackBufferBinding
      ) {
      GLctx.texSubImage2D(target,
        level, xoffset, yoffset,
        width, height, format, type,
        pixels)
    } else if (pixels) {
      var heap =
        heapObjectForWebGLType(type);
      GLctx.texSubImage2D(target,
        level, xoffset, yoffset,
        width, height, format, type,
        heap, toTypedArrayIndex(
          pixels, heap))
    } else {
      GLctx.texSubImage2D(target,
        level, xoffset, yoffset,
        width, height, format, type,
        null)
    }
    return
  }
  var pixelData = null;
  if (pixels) pixelData =
    emscriptenWebGLGetTexPixelData(
      type, format, width, height,
      pixels, 0);
  GLctx.texSubImage2D(target, level,
    xoffset, yoffset, width, height,
    format, type, pixelData)
};
var _emscripten_glTexSubImage2D =
  _glTexSubImage2D;
var _glTexSubImage3D = (target, level,
    xoffset, yoffset, zoffset, width,
    height, depth, format, type, pixels
    ) => {
    if (GLctx
      .currentPixelUnpackBufferBinding
      ) {
      GLctx.texSubImage3D(target, level,
        xoffset, yoffset, zoffset,
        width, height, depth, format,
        type, pixels)
    } else if (pixels) {
      var heap = heapObjectForWebGLType(
        type);
      GLctx.texSubImage3D(target, level,
        xoffset, yoffset, zoffset,
        width, height, depth, format,
        type, heap, toTypedArrayIndex(
          pixels, heap))
    } else {
      GLctx.texSubImage3D(target, level,
        xoffset, yoffset, zoffset,
        width, height, depth, format,
        type, null)
    }
  };
var _emscripten_glTexSubImage3D =
  _glTexSubImage3D;
var _glTransformFeedbackVaryings = (
  program, count, varyings, bufferMode
  ) => {
  program = GL.programs[program];
  var vars = [];
  for (var i = 0; i < count; i++) vars
    .push(UTF8ToString(HEAP32[
      varyings + i * 4 >> 2]));
  GLctx.transformFeedbackVaryings(
    program, vars, bufferMode)
};
var
  _emscripten_glTransformFeedbackVaryings =
  _glTransformFeedbackVaryings;
var _glUniform1f = (location, v0) => {
  GLctx.uniform1f(
    webglGetUniformLocation(
      location), v0)
};
var _emscripten_glUniform1f =
  _glUniform1f;
var _glUniform1fv = (location, count,
  value) => {
  count && GLctx.uniform1fv(
    webglGetUniformLocation(
      location), HEAPF32, value >>
    2, count)
};
var _emscripten_glUniform1fv =
  _glUniform1fv;
var _glUniform1i = (location, v0) => {
  GLctx.uniform1i(
    webglGetUniformLocation(
      location), v0)
};
var _emscripten_glUniform1i =
  _glUniform1i;
var _glUniform1iv = (location, count,
  value) => {
  count && GLctx.uniform1iv(
    webglGetUniformLocation(
      location), HEAP32, value >> 2,
    count)
};
var _emscripten_glUniform1iv =
  _glUniform1iv;
var _glUniform1ui = (location, v0) => {
  GLctx.uniform1ui(
    webglGetUniformLocation(
      location), v0)
};
var _emscripten_glUniform1ui =
  _glUniform1ui;
var _glUniform1uiv = (location, count,
  value) => {
  count && GLctx.uniform1uiv(
    webglGetUniformLocation(
      location), HEAPU32, value >>
    2, count)
};
var _emscripten_glUniform1uiv =
  _glUniform1uiv;
var _glUniform2f = (location, v0,
v1) => {
  GLctx.uniform2f(
    webglGetUniformLocation(
      location), v0, v1)
};
var _emscripten_glUniform2f =
  _glUniform2f;
var _glUniform2fv = (location, count,
  value) => {
  count && GLctx.uniform2fv(
    webglGetUniformLocation(
      location), HEAPF32, value >>
    2, count * 2)
};
var _emscripten_glUniform2fv =
  _glUniform2fv;
var _glUniform2i = (location, v0,
v1) => {
  GLctx.uniform2i(
    webglGetUniformLocation(
      location), v0, v1)
};
var _emscripten_glUniform2i =
  _glUniform2i;
var _glUniform2iv = (location, count,
  value) => {
  count && GLctx.uniform2iv(
    webglGetUniformLocation(
      location), HEAP32, value >> 2,
    count * 2)
};
var _emscripten_glUniform2iv =
  _glUniform2iv;
var _glUniform2ui = (location, v0,
  v1) => {
    GLctx.uniform2ui(
      webglGetUniformLocation(
        location), v0, v1)
  };
var _emscripten_glUniform2ui =
  _glUniform2ui;
var _glUniform2uiv = (location, count,
  value) => {
  count && GLctx.uniform2uiv(
    webglGetUniformLocation(
      location), HEAPU32, value >>
    2, count * 2)
};
var _emscripten_glUniform2uiv =
  _glUniform2uiv;
var _glUniform3f = (location, v0, v1,
  v2) => {
  GLctx.uniform3f(
    webglGetUniformLocation(
      location), v0, v1, v2)
};
var _emscripten_glUniform3f =
  _glUniform3f;
var _glUniform3fv = (location, count,
  value) => {
  count && GLctx.uniform3fv(
    webglGetUniformLocation(
      location), HEAPF32, value >>
    2, count * 3)
};
var _emscripten_glUniform3fv =
  _glUniform3fv;
var _glUniform3i = (location, v0, v1,
  v2) => {
  GLctx.uniform3i(
    webglGetUniformLocation(
      location), v0, v1, v2)
};
var _emscripten_glUniform3i =
  _glUniform3i;
var _glUniform3iv = (location, count,
  value) => {
  count && GLctx.uniform3iv(
    webglGetUniformLocation(
      location), HEAP32, value >> 2,
    count * 3)
};
var _emscripten_glUniform3iv =
  _glUniform3iv;
var _glUniform3ui = (location, v0, v1,
  v2) => {
  GLctx.uniform3ui(
    webglGetUniformLocation(
      location), v0, v1, v2)
};
var _emscripten_glUniform3ui =
  _glUniform3ui;
var _glUniform3uiv = (location, count,
  value) => {
  count && GLctx.uniform3uiv(
    webglGetUniformLocation(
      location), HEAPU32, value >>
    2, count * 3)
};
var _emscripten_glUniform3uiv =
  _glUniform3uiv;
var _glUniform4f = (location, v0, v1,
  v2, v3) => {
  GLctx.uniform4f(
    webglGetUniformLocation(
      location), v0, v1, v2, v3)
};
var _emscripten_glUniform4f =
  _glUniform4f;
var _glUniform4fv = (location, count,
  value) => {
  count && GLctx.uniform4fv(
    webglGetUniformLocation(
      location), HEAPF32, value >>
    2, count * 4)
};
var _emscripten_glUniform4fv =
  _glUniform4fv;
var _glUniform4i = (location, v0, v1,
  v2, v3) => {
  GLctx.uniform4i(
    webglGetUniformLocation(
      location), v0, v1, v2, v3)
};
var _emscripten_glUniform4i =
  _glUniform4i;
var _glUniform4iv = (location, count,
  value) => {
  count && GLctx.uniform4iv(
    webglGetUniformLocation(
      location), HEAP32, value >> 2,
    count * 4)
};
var _emscripten_glUniform4iv =
  _glUniform4iv;
var _glUniform4ui = (location, v0, v1,
  v2, v3) => {
  GLctx.uniform4ui(
    webglGetUniformLocation(
      location), v0, v1, v2, v3)
};
var _emscripten_glUniform4ui =
  _glUniform4ui;
var _glUniform4uiv = (location, count,
  value) => {
  count && GLctx.uniform4uiv(
    webglGetUniformLocation(
      location), HEAPU32, value >>
    2, count * 4)
};
var _emscripten_glUniform4uiv =
  _glUniform4uiv;
var _glUniformBlockBinding = (program,
  uniformBlockIndex,
  uniformBlockBinding) => {
  program = GL.programs[program];
  GLctx.uniformBlockBinding(program,
    uniformBlockIndex,
    uniformBlockBinding)
};
var _emscripten_glUniformBlockBinding =
  _glUniformBlockBinding;
var _glUniformMatrix2fv = (location,
  count, transpose, value) => {
  count && GLctx.uniformMatrix2fv(
    webglGetUniformLocation(
      location), !!transpose,
    HEAPF32, value >> 2, count * 4)
};
var _emscripten_glUniformMatrix2fv =
  _glUniformMatrix2fv;
var _glUniformMatrix2x3fv = (location,
  count, transpose, value) => {
  count && GLctx.uniformMatrix2x3fv(
    webglGetUniformLocation(
      location), !!transpose,
    HEAPF32, value >> 2, count * 6)
};
var _emscripten_glUniformMatrix2x3fv =
  _glUniformMatrix2x3fv;
var _glUniformMatrix2x4fv = (location,
  count, transpose, value) => {
  count && GLctx.uniformMatrix2x4fv(
    webglGetUniformLocation(
      location), !!transpose,
    HEAPF32, value >> 2, count * 8)
};
var _emscripten_glUniformMatrix2x4fv =
  _glUniformMatrix2x4fv;
var _glUniformMatrix3fv = (location,
  count, transpose, value) => {
  count && GLctx.uniformMatrix3fv(
    webglGetUniformLocation(
      location), !!transpose,
    HEAPF32, value >> 2, count * 9)
};
var _emscripten_glUniformMatrix3fv =
  _glUniformMatrix3fv;
var _glUniformMatrix3x2fv = (location,
  count, transpose, value) => {
  count && GLctx.uniformMatrix3x2fv(
    webglGetUniformLocation(
      location), !!transpose,
    HEAPF32, value >> 2, count * 6)
};
var _emscripten_glUniformMatrix3x2fv =
  _glUniformMatrix3x2fv;
var _glUniformMatrix3x4fv = (location,
  count, transpose, value) => {
  count && GLctx.uniformMatrix3x4fv(
    webglGetUniformLocation(
      location), !!transpose,
    HEAPF32, value >> 2, count * 12)
};
var _emscripten_glUniformMatrix3x4fv =
  _glUniformMatrix3x4fv;
var _glUniformMatrix4fv = (location,
  count, transpose, value) => {
  count && GLctx.uniformMatrix4fv(
    webglGetUniformLocation(
      location), !!transpose,
    HEAPF32, value >> 2, count * 16)
};
var _emscripten_glUniformMatrix4fv =
  _glUniformMatrix4fv;
var _glUniformMatrix4x2fv = (location,
  count, transpose, value) => {
  count && GLctx.uniformMatrix4x2fv(
    webglGetUniformLocation(
      location), !!transpose,
    HEAPF32, value >> 2, count * 8)
};
var _emscripten_glUniformMatrix4x2fv =
  _glUniformMatrix4x2fv;
var _glUniformMatrix4x3fv = (location,
  count, transpose, value) => {
  count && GLctx.uniformMatrix4x3fv(
    webglGetUniformLocation(
      location), !!transpose,
    HEAPF32, value >> 2, count * 12)
};
var _emscripten_glUniformMatrix4x3fv =
  _glUniformMatrix4x3fv;
var _glUnmapBuffer = target => {
  if (!
    emscriptenWebGLValidateMapBufferTarget(
      target)) {
    GL.recordError(1280);
    err(
      "GL_INVALID_ENUM in glUnmapBuffer");
    return 0
  }
  var buffer =
    emscriptenWebGLGetBufferBinding(
      target);
  var mapping = GL.mappedBuffers[
    buffer];
  if (!mapping || !mapping.mem) {
    GL.recordError(1282);
    err(
      "buffer was never mapped in glUnmapBuffer");
    return 0
  }
  if (!(mapping.access & 16))
    if (true) {
      GLctx.bufferSubData(target,
        mapping.offset, HEAPU8,
        mapping.mem, mapping.length)
    } else {
      GLctx.bufferSubData(target,
        mapping.offset, HEAPU8
        .subarray(mapping.mem,
          mapping.mem + mapping
          .length))
    } _free(mapping.mem);
  mapping.mem = 0;
  return 1
};
var _emscripten_glUnmapBuffer =
  _glUnmapBuffer;
var _glUseProgram = program => {
  program = GL.programs[program];
  GLctx.useProgram(program);
  GLctx.currentProgram = program
};
var _emscripten_glUseProgram =
  _glUseProgram;
var _glValidateProgram = program => {
  GLctx.validateProgram(GL.programs[
    program])
};
var _emscripten_glValidateProgram =
  _glValidateProgram;
var _glVertexAttrib1f = (x0, x1) =>
  GLctx.vertexAttrib1f(x0, x1);
var _emscripten_glVertexAttrib1f =
  _glVertexAttrib1f;
var _glVertexAttrib1fv = (index, v) => {
  GLctx.vertexAttrib1f(index, HEAPF32[
    v >> 2])
};
var _emscripten_glVertexAttrib1fv =
  _glVertexAttrib1fv;
var _glVertexAttrib2f = (x0, x1, x2) =>
  GLctx.vertexAttrib2f(x0, x1, x2);
var _emscripten_glVertexAttrib2f =
  _glVertexAttrib2f;
var _glVertexAttrib2fv = (index, v) => {
  GLctx.vertexAttrib2f(index, HEAPF32[
    v >> 2], HEAPF32[v + 4 >> 2])
};
var _emscripten_glVertexAttrib2fv =
  _glVertexAttrib2fv;
var _glVertexAttrib3f = (x0, x1, x2,
  x3) => GLctx.vertexAttrib3f(x0, x1,
    x2, x3);
var _emscripten_glVertexAttrib3f =
  _glVertexAttrib3f;
var _glVertexAttrib3fv = (index, v) => {
  GLctx.vertexAttrib3f(index, HEAPF32[
      v >> 2], HEAPF32[v + 4 >> 2],
    HEAPF32[v + 8 >> 2])
};
var _emscripten_glVertexAttrib3fv =
  _glVertexAttrib3fv;
var _glVertexAttrib4f = (x0, x1, x2, x3,
  x4) => GLctx.vertexAttrib4f(x0, x1,
  x2, x3, x4);
var _emscripten_glVertexAttrib4f =
  _glVertexAttrib4f;
var _glVertexAttrib4fv = (index, v) => {
  GLctx.vertexAttrib4f(index, HEAPF32[
      v >> 2], HEAPF32[v + 4 >> 2],
    HEAPF32[v + 8 >> 2], HEAPF32[v +
      12 >> 2])
};
var _emscripten_glVertexAttrib4fv =
  _glVertexAttrib4fv;
var _glVertexAttribDivisor = (index,
  divisor) => {
  GLctx.vertexAttribDivisor(index,
    divisor)
};
var _emscripten_glVertexAttribDivisor =
  _glVertexAttribDivisor;
var _glVertexAttribDivisorANGLE =
  _glVertexAttribDivisor;
var
  _emscripten_glVertexAttribDivisorANGLE =
  _glVertexAttribDivisorANGLE;
var _glVertexAttribDivisorARB =
  _glVertexAttribDivisor;
var
  _emscripten_glVertexAttribDivisorARB =
  _glVertexAttribDivisorARB;
var _glVertexAttribDivisorEXT =
  _glVertexAttribDivisor;
var
  _emscripten_glVertexAttribDivisorEXT =
  _glVertexAttribDivisorEXT;
var _glVertexAttribDivisorNV =
  _glVertexAttribDivisor;
var
  _emscripten_glVertexAttribDivisorNV =
  _glVertexAttribDivisorNV;
var _glVertexAttribI4i = (x0, x1, x2,
  x3, x4) => GLctx.vertexAttribI4i(x0,
  x1, x2, x3, x4);
var _emscripten_glVertexAttribI4i =
  _glVertexAttribI4i;
var _glVertexAttribI4iv = (index,
v) => {
  GLctx.vertexAttribI4i(index, HEAP32[
      v >> 2], HEAP32[v + 4 >> 2],
    HEAP32[v + 8 >> 2], HEAP32[v +
      12 >> 2])
};
var _emscripten_glVertexAttribI4iv =
  _glVertexAttribI4iv;
var _glVertexAttribI4ui = (x0, x1, x2,
  x3, x4) => GLctx.vertexAttribI4ui(
  x0, x1, x2, x3, x4);
var _emscripten_glVertexAttribI4ui =
  _glVertexAttribI4ui;
var _glVertexAttribI4uiv = (index,
v) => {
  GLctx.vertexAttribI4ui(index,
    HEAPU32[v >> 2], HEAPU32[v +
      4 >> 2], HEAPU32[v + 8 >> 2],
    HEAPU32[v + 12 >> 2])
};
var _emscripten_glVertexAttribI4uiv =
  _glVertexAttribI4uiv;
var _glVertexAttribIPointer = (index,
  size, type, stride, ptr) => {
  var cb = GL.currentContext
    .clientBuffers[index];
  if (!GLctx
    .currentArrayBufferBinding) {
    cb.size = size;
    cb.type = type;
    cb.normalized = false;
    cb.stride = stride;
    cb.ptr = ptr;
    cb.clientside = true;
    cb.vertexAttribPointerAdaptor =
      function(index, size, type,
        normalized, stride, ptr) {
        this.vertexAttribIPointer(
          index, size, type, stride,
          ptr)
      };
    return
  }
  cb.clientside = false;
  GLctx.vertexAttribIPointer(index,
    size, type, stride, ptr)
};
var _emscripten_glVertexAttribIPointer =
  _glVertexAttribIPointer;
var _glVertexAttribPointer = (index,
    size, type, normalized, stride, ptr
    ) => {
    var cb = GL.currentContext
      .clientBuffers[index];
    if (!GLctx
      .currentArrayBufferBinding) {
      cb.size = size;
      cb.type = type;
      cb.normalized = normalized;
      cb.stride = stride;
      cb.ptr = ptr;
      cb.clientside = true;
      cb.vertexAttribPointerAdaptor =
        function(index, size, type,
          normalized, stride, ptr) {
          this.vertexAttribPointer(
            index, size, type,
            normalized, stride, ptr)
        };
      return
    }
    cb.clientside = false;
    GLctx.vertexAttribPointer(index,
      size, type, !!normalized,
      stride, ptr)
  };
var _emscripten_glVertexAttribPointer =
  _glVertexAttribPointer;
var _glViewport = (x0, x1, x2, x3) =>
  GLctx.viewport(x0, x1, x2, x3);
var _emscripten_glViewport =
_glViewport;
var _glWaitSync = (sync, flags,
  timeout_low, timeout_high) => {
  var timeout = convertI32PairToI53(
    timeout_low, timeout_high);
  GLctx.waitSync(GL.syncs[sync],
    flags, timeout)
};
var _emscripten_glWaitSync =
_glWaitSync;
var
  _emscripten_html5_remove_all_event_listeners =
  () => JSEvents
  .removeAllEventListeners();
var _emscripten_memcpy_js = (dest, src,
  num) => HEAPU8.copyWithin(dest, src,
  src + num);
var _emscripten_pause_main_loop =
() => {
  Browser.mainLoop.pause()
};
var growMemory = size => {
  var b = wasmMemory.buffer;
  var pages = (size - b.byteLength +
    65535) / 65536;
  try {
    wasmMemory.grow(pages);
    updateMemoryViews();
    return 1
  } catch (e) {}
};
var _emscripten_resize_heap =
  requestedSize => {
    var oldSize = HEAPU8.length;
    requestedSize >>>= 0;
    var maxHeapSize = getHeapMax();
    if (requestedSize > maxHeapSize) {
      return false
    }
    var alignUp = (x, multiple) => x + (
        multiple - x % multiple) %
      multiple;
    for (var cutDown = 1; cutDown <=
      4; cutDown *= 2) {
      var overGrownHeapSize = oldSize *
        (1 + .2 / cutDown);
      overGrownHeapSize = Math.min(
        overGrownHeapSize,
        requestedSize + 100663296);
      var newSize = Math.min(
        maxHeapSize, alignUp(Math.max(
          requestedSize,
          overGrownHeapSize), 65536));
      var replacement = growMemory(
        newSize);
      if (replacement) {
        return true
      }
    }
    return false
  };
var _emscripten_resume_main_loop =
() => {
  Browser.mainLoop.resume()
};
var registerKeyEventCallback = (target,
  userData, useCapture, callbackfunc,
  eventTypeId, eventTypeString,
  targetThread) => {
  if (!JSEvents.keyEvent) JSEvents
    .keyEvent = _malloc(176);
  var keyEventHandlerFunc = e => {
    var keyEventData = JSEvents
      .keyEvent;
    HEAPF64[keyEventData >> 3] = e
      .timeStamp;
    var idx = keyEventData >> 2;
    HEAP32[idx + 2] = e.location;
    HEAP32[idx + 3] = e.ctrlKey;
    HEAP32[idx + 4] = e.shiftKey;
    HEAP32[idx + 5] = e.altKey;
    HEAP32[idx + 6] = e.metaKey;
    HEAP32[idx + 7] = e.repeat;
    HEAP32[idx + 8] = e.charCode;
    HEAP32[idx + 9] = e.keyCode;
    HEAP32[idx + 10] = e.which;
    stringToUTF8(e.key || "",
      keyEventData + 44, 32);
    stringToUTF8(e.code || "",
      keyEventData + 76, 32);
    stringToUTF8(e.char || "",
      keyEventData + 108, 32);
    stringToUTF8(e.locale || "",
      keyEventData + 140, 32);
    if (((a1, a2, a3) =>
        dynCall_iiii(callbackfunc,
          a1, a2, a3))(eventTypeId,
        keyEventData, userData)) e
      .preventDefault()
  };
  var eventHandler = {
    target: findEventTarget(target)
    , eventTypeString: eventTypeString
    , callbackfunc: callbackfunc
    , handlerFunc: keyEventHandlerFunc
    , useCapture: useCapture
  };
  return JSEvents
    .registerOrRemoveHandler(
      eventHandler)
};
var
  _emscripten_set_keydown_callback_on_thread =
  (target, userData, useCapture,
    callbackfunc, targetThread) =>
  registerKeyEventCallback(target,
    userData, useCapture, callbackfunc,
    2, "keydown", targetThread);
var
  _emscripten_set_keypress_callback_on_thread =
  (target, userData, useCapture,
    callbackfunc, targetThread) =>
  registerKeyEventCallback(target,
    userData, useCapture, callbackfunc,
    1, "keypress", targetThread);
var
  _emscripten_set_keyup_callback_on_thread =
  (target, userData, useCapture,
    callbackfunc, targetThread) =>
  registerKeyEventCallback(target,
    userData, useCapture, callbackfunc,
    3, "keyup", targetThread);
var _emscripten_set_main_loop = (func,
  fps, simulateInfiniteLoop) => {
  var browserIterationFunc = () =>
    dynCall_v(func);
  setMainLoop(browserIterationFunc,
    fps, simulateInfiniteLoop)
};
var getBoundingClientRect = e =>
  specialHTMLTargets.indexOf(e) < 0 ? e
  .getBoundingClientRect() : {
    "left": 0
    , "top": 0
  };
var fillMouseEventData = (eventStruct,
  e, target) => {
  HEAPF64[eventStruct >> 3] = e
    .timeStamp;
  var idx = eventStruct >> 2;
  HEAP32[idx + 2] = e.screenX;
  HEAP32[idx + 3] = e.screenY;
  HEAP32[idx + 4] = e.clientX;
  HEAP32[idx + 5] = e.clientY;
  HEAP32[idx + 6] = e.ctrlKey;
  HEAP32[idx + 7] = e.shiftKey;
  HEAP32[idx + 8] = e.altKey;
  HEAP32[idx + 9] = e.metaKey;
  HEAP16[idx * 2 + 20] = e.button;
  HEAP16[idx * 2 + 21] = e.buttons;
  HEAP32[idx + 11] = e["movementX"];
  HEAP32[idx + 12] = e["movementY"];
  var rect = getBoundingClientRect(
    target);
  HEAP32[idx + 13] = e.clientX - rect
    .left;
  HEAP32[idx + 14] = e.clientY - rect
    .top
};
var registerMouseEventCallback = (
  target, userData, useCapture,
  callbackfunc, eventTypeId,
  eventTypeString, targetThread) => {
  if (!JSEvents.mouseEvent) JSEvents
    .mouseEvent = _malloc(72);
  target = findEventTarget(target);
  var mouseEventHandlerFunc = (e =
    event) => {
    fillMouseEventData(JSEvents
      .mouseEvent, e, target);
    if (((a1, a2, a3) =>
        dynCall_iiii(callbackfunc,
          a1, a2, a3))(eventTypeId,
        JSEvents.mouseEvent,
        userData)) e
    .preventDefault()
  };
  var eventHandler = {
    target: target
    , allowsDeferredCalls: eventTypeString !=
      "mousemove" &&
      eventTypeString !=
      "mouseenter" &&
      eventTypeString !=
      "mouseleave"
    , eventTypeString: eventTypeString
    , callbackfunc: callbackfunc
    , handlerFunc: mouseEventHandlerFunc
    , useCapture: useCapture
  };
  return JSEvents
    .registerOrRemoveHandler(
      eventHandler)
};
var
  _emscripten_set_mousedown_callback_on_thread =
  (target, userData, useCapture,
    callbackfunc, targetThread) =>
  registerMouseEventCallback(target,
    userData, useCapture, callbackfunc,
    5, "mousedown", targetThread);
var
  _emscripten_set_mousemove_callback_on_thread =
  (target, userData, useCapture,
    callbackfunc, targetThread) =>
  registerMouseEventCallback(target,
    userData, useCapture, callbackfunc,
    8, "mousemove", targetThread);
var
  _emscripten_set_mouseup_callback_on_thread =
  (target, userData, useCapture,
    callbackfunc, targetThread) =>
  registerMouseEventCallback(target,
    userData, useCapture, callbackfunc,
    6, "mouseup", targetThread);
var registerTouchEventCallback = (
  target, userData, useCapture,
  callbackfunc, eventTypeId,
  eventTypeString, targetThread) => {
  if (!JSEvents.touchEvent) JSEvents
    .touchEvent = _malloc(1696);
  target = findEventTarget(target);
  var touchEventHandlerFunc = e => {
    var t, touches = {}
      , et = e.touches;
    for (var i = 0; i < et
      .length; ++i) {
      t = et[i];
      t.isChanged = t.onTarget = 0;
      touches[t.identifier] = t
    }
    for (var i = 0; i < e
      .changedTouches.length; ++i) {
      t = e.changedTouches[i];
      t.isChanged = 1;
      touches[t.identifier] = t
    }
    for (var i = 0; i < e
      .targetTouches.length; ++i) {
      touches[e.targetTouches[i]
        .identifier].onTarget = 1
    }
    var touchEvent = JSEvents
      .touchEvent;
    HEAPF64[touchEvent >> 3] = e
      .timeStamp;
    var idx = touchEvent >> 2;
    HEAP32[idx + 3] = e.ctrlKey;
    HEAP32[idx + 4] = e.shiftKey;
    HEAP32[idx + 5] = e.altKey;
    HEAP32[idx + 6] = e.metaKey;
    idx += 7;
    var targetRect =
      getBoundingClientRect(target);
    var numTouches = 0;
    for (var i in touches) {
      t = touches[i];
      HEAP32[idx + 0] = t
      .identifier;
      HEAP32[idx + 1] = t.screenX;
      HEAP32[idx + 2] = t.screenY;
      HEAP32[idx + 3] = t.clientX;
      HEAP32[idx + 4] = t.clientY;
      HEAP32[idx + 5] = t.pageX;
      HEAP32[idx + 6] = t.pageY;
      HEAP32[idx + 7] = t.isChanged;
      HEAP32[idx + 8] = t.onTarget;
      HEAP32[idx + 9] = t.clientX -
        targetRect.left;
      HEAP32[idx + 10] = t.clientY -
        targetRect.top;
      idx += 13;
      if (++numTouches > 31) {
        break
      }
    }
    HEAP32[touchEvent + 8 >> 2] =
      numTouches;
    if (((a1, a2, a3) =>
        dynCall_iiii(callbackfunc,
          a1, a2, a3))(eventTypeId,
        touchEvent, userData)) e
      .preventDefault()
  };
  var eventHandler = {
    target: target
    , allowsDeferredCalls: eventTypeString ==
      "touchstart" ||
      eventTypeString == "touchend"
    , eventTypeString: eventTypeString
    , callbackfunc: callbackfunc
    , handlerFunc: touchEventHandlerFunc
    , useCapture: useCapture
  };
  return JSEvents
    .registerOrRemoveHandler(
      eventHandler)
};
var
  _emscripten_set_touchcancel_callback_on_thread =
  (target, userData, useCapture,
    callbackfunc, targetThread) =>
  registerTouchEventCallback(target,
    userData, useCapture, callbackfunc,
    25, "touchcancel", targetThread);
var
  _emscripten_set_touchend_callback_on_thread =
  (target, userData, useCapture,
    callbackfunc, targetThread) =>
  registerTouchEventCallback(target,
    userData, useCapture, callbackfunc,
    23, "touchend", targetThread);
var
  _emscripten_set_touchmove_callback_on_thread =
  (target, userData, useCapture,
    callbackfunc, targetThread) =>
  registerTouchEventCallback(target,
    userData, useCapture, callbackfunc,
    24, "touchmove", targetThread);
var
  _emscripten_set_touchstart_callback_on_thread =
  (target, userData, useCapture,
    callbackfunc, targetThread) =>
  registerTouchEventCallback(target,
    userData, useCapture, callbackfunc,
    22, "touchstart", targetThread);
var registerWheelEventCallback = (
  target, userData, useCapture,
  callbackfunc, eventTypeId,
  eventTypeString, targetThread) => {
  if (!JSEvents.wheelEvent) JSEvents
    .wheelEvent = _malloc(104);
  var wheelHandlerFunc = (e =
    event) => {
      var wheelEvent = JSEvents
        .wheelEvent;
      fillMouseEventData(wheelEvent,
        e, target);
      HEAPF64[wheelEvent + 72 >> 3] =
        e["deltaX"];
      HEAPF64[wheelEvent + 80 >> 3] =
        e["deltaY"];
      HEAPF64[wheelEvent + 88 >> 3] =
        e["deltaZ"];
      HEAP32[wheelEvent + 96 >> 2] =
        e["deltaMode"];
      if (((a1, a2, a3) =>
          dynCall_iiii(callbackfunc,
            a1, a2, a3))(eventTypeId,
          wheelEvent, userData)) e
        .preventDefault()
    };
  var eventHandler = {
    target: target
    , allowsDeferredCalls: true
    , eventTypeString: eventTypeString
    , callbackfunc: callbackfunc
    , handlerFunc: wheelHandlerFunc
    , useCapture: useCapture
  };
  return JSEvents
    .registerOrRemoveHandler(
      eventHandler)
};
var
  _emscripten_set_wheel_callback_on_thread =
  (target, userData, useCapture,
    callbackfunc, targetThread) => {
    target = findEventTarget(target);
    if (!target) return -4;
    if (typeof target.onwheel !=
      "undefined") {
      return registerWheelEventCallback(
        target, userData, useCapture,
        callbackfunc, 9, "wheel",
        targetThread)
    } else {
      return -1
    }
  };
var _emscripten_sleep = ms => Asyncify
  .handleSleep(wakeUp => safeSetTimeout(
    wakeUp, ms));
_emscripten_sleep.isAsync = true;
var ENV = {};
var getExecutableName = () =>
  thisProgram || "./this.program";
var getEnvStrings = () => {
  if (!getEnvStrings.strings) {
    var lang = (typeof navigator ==
      "object" && navigator
      .languages && navigator
      .languages[0] || "C").replace(
      "-", "_") + ".UTF-8";
    var env = {
      "USER": "web_user"
      , "LOGNAME": "web_user"
      , "PATH": "/"
      , "PWD": "/"
      , "HOME": "/home/web_user"
      , "LANG": lang
      , "_": getExecutableName()
    };
    for (var x in ENV) {
      if (ENV[x] === undefined)
        delete env[x];
      else env[x] = ENV[x]
    }
    var strings = [];
    for (var x in env) {
      strings.push(`${x}=${env[x]}`)
    }
    getEnvStrings.strings = strings
  }
  return getEnvStrings.strings
};
var stringToAscii = (str, buffer) => {
  for (var i = 0; i < str.length; ++
    i) {
    HEAP8[buffer++] = str.charCodeAt(
      i)
  }
  HEAP8[buffer] = 0
};
var _environ_get = (__environ,
  environ_buf) => {
  var bufSize = 0;
  getEnvStrings().forEach((string,
    i) => {
      var ptr = environ_buf +
        bufSize;
      HEAPU32[__environ + i * 4 >>
        2] = ptr;
      stringToAscii(string, ptr);
      bufSize += string.length + 1
    });
  return 0
};
var _environ_sizes_get = (
    penviron_count, penviron_buf_size
    ) => {
    var strings = getEnvStrings();
    HEAPU32[penviron_count >> 2] =
      strings.length;
    var bufSize = 0;
    strings.forEach(string => bufSize +=
      string.length + 1);
    HEAPU32[penviron_buf_size >> 2] =
      bufSize;
    return 0
  };

function _fd_close(fd) {
  try {
    var stream = SYSCALLS
      .getStreamFromFD(fd);
    FS.close(stream);
    return 0
  } catch (e) {
    if (typeof FS == "undefined" || !(e
        .name === "ErrnoError"))
  throw e;
    return e.errno
  }
}
var doReadv = (stream, iov, iovcnt,
  offset) => {
  var ret = 0;
  for (var i = 0; i < iovcnt; i++) {
    var ptr = HEAPU32[iov >> 2];
    var len = HEAPU32[iov + 4 >> 2];
    iov += 8;
    var curr = FS.read(stream, HEAP8,
      ptr, len, offset);
    if (curr < 0) return -1;
    ret += curr;
    if (curr < len) break;
    if (typeof offset !==
      "undefined") {
      offset += curr
    }
  }
  return ret
};

function _fd_read(fd, iov, iovcnt,
pnum) {
  try {
    var stream = SYSCALLS
      .getStreamFromFD(fd);
    var num = doReadv(stream, iov,
      iovcnt);
    HEAPU32[pnum >> 2] = num;
    return 0
  } catch (e) {
    if (typeof FS == "undefined" || !(e
        .name === "ErrnoError"))
  throw e;
    return e.errno
  }
}

function _fd_seek(fd, offset_low,
  offset_high, whence, newOffset) {
  var offset =
    convertI32PairToI53Checked(
      offset_low, offset_high);
  try {
    if (isNaN(offset)) return 61;
    var stream = SYSCALLS
      .getStreamFromFD(fd);
    FS.llseek(stream, offset, whence);
    tempI64 = [stream.position >>> 0, (
        tempDouble = stream.position,
        +Math.abs(tempDouble) >= 1 ?
        tempDouble > 0 ? +Math.floor(
          tempDouble / 4294967296) >>>
        0 : ~~+Math.ceil((tempDouble -
            +(~~tempDouble >>> 0)) /
          4294967296) >>> 0 : 0)],
      HEAP32[newOffset >> 2] = tempI64[
        0], HEAP32[newOffset + 4 >> 2] =
      tempI64[1];
    if (stream.getdents && offset ===
      0 && whence === 0) stream
      .getdents = null;
    return 0
  } catch (e) {
    if (typeof FS == "undefined" || !(e
        .name === "ErrnoError"))
  throw e;
    return e.errno
  }
}
var doWritev = (stream, iov, iovcnt,
  offset) => {
  var ret = 0;
  for (var i = 0; i < iovcnt; i++) {
    var ptr = HEAPU32[iov >> 2];
    var len = HEAPU32[iov + 4 >> 2];
    iov += 8;
    var curr = FS.write(stream, HEAP8,
      ptr, len, offset);
    if (curr < 0) return -1;
    ret += curr;
    if (typeof offset !==
      "undefined") {
      offset += curr
    }
  }
  return ret
};

function _fd_write(fd, iov, iovcnt,
  pnum) {
  try {
    var stream = SYSCALLS
      .getStreamFromFD(fd);
    var num = doWritev(stream, iov,
      iovcnt);
    HEAPU32[pnum >> 2] = num;
    return 0
  } catch (e) {
    if (typeof FS == "undefined" || !(e
        .name === "ErrnoError"))
  throw e;
    return e.errno
  }
}
var arraySum = (array, index) => {
  var sum = 0;
  for (var i = 0; i <= index; sum +=
    array[i++]) {}
  return sum
};
var MONTH_DAYS_LEAP = [31, 29, 31, 30,
  31, 30, 31, 31, 30, 31, 30, 31
];
var MONTH_DAYS_REGULAR = [31, 28, 31,
  30, 31, 30, 31, 31, 30, 31, 30, 31
];
var addDays = (date, days) => {
  var newDate = new Date(date
  .getTime());
  while (days > 0) {
    var leap = isLeapYear(newDate
      .getFullYear());
    var currentMonth = newDate
      .getMonth();
    var daysInCurrentMonth = (leap ?
      MONTH_DAYS_LEAP :
      MONTH_DAYS_REGULAR)[
      currentMonth];
    if (days > daysInCurrentMonth -
      newDate.getDate()) {
      days -= daysInCurrentMonth -
        newDate.getDate() + 1;
      newDate.setDate(1);
      if (currentMonth < 11) {
        newDate.setMonth(
          currentMonth + 1)
      } else {
        newDate.setMonth(0);
        newDate.setFullYear(newDate
          .getFullYear() + 1)
      }
    } else {
      newDate.setDate(newDate
      .getDate() + days);
      return newDate
    }
  }
  return newDate
};
var writeArrayToMemory = (array,
  buffer) => {
    HEAP8.set(array, buffer)
  };
var _strftime = (s, maxsize, format,
  tm) => {
    var tm_zone = HEAPU32[tm + 40 >> 2];
    var date = {
      tm_sec: HEAP32[tm >> 2]
      , tm_min: HEAP32[tm + 4 >> 2]
      , tm_hour: HEAP32[tm + 8 >> 2]
      , tm_mday: HEAP32[tm + 12 >> 2]
      , tm_mon: HEAP32[tm + 16 >> 2]
      , tm_year: HEAP32[tm + 20 >> 2]
      , tm_wday: HEAP32[tm + 24 >> 2]
      , tm_yday: HEAP32[tm + 28 >> 2]
      , tm_isdst: HEAP32[tm + 32 >>
        2]
      , tm_gmtoff: HEAP32[tm + 36 >>
        2]
      , tm_zone: tm_zone ?
        UTF8ToString(tm_zone) : ""
    };
    var pattern = UTF8ToString(format);
    var EXPANSION_RULES_1 = {
      "%c": "%a %b %d %H:%M:%S %Y"
      , "%D": "%m/%d/%y"
      , "%F": "%Y-%m-%d"
      , "%h": "%b"
      , "%r": "%I:%M:%S %p"
      , "%R": "%H:%M"
      , "%T": "%H:%M:%S"
      , "%x": "%m/%d/%y"
      , "%X": "%H:%M:%S"
      , "%Ec": "%c"
      , "%EC": "%C"
      , "%Ex": "%m/%d/%y"
      , "%EX": "%H:%M:%S"
      , "%Ey": "%y"
      , "%EY": "%Y"
      , "%Od": "%d"
      , "%Oe": "%e"
      , "%OH": "%H"
      , "%OI": "%I"
      , "%Om": "%m"
      , "%OM": "%M"
      , "%OS": "%S"
      , "%Ou": "%u"
      , "%OU": "%U"
      , "%OV": "%V"
      , "%Ow": "%w"
      , "%OW": "%W"
      , "%Oy": "%y"
    };
    for (var rule in
      EXPANSION_RULES_1) {
      pattern = pattern.replace(
        new RegExp(rule, "g"),
        EXPANSION_RULES_1[rule])
    }
    var WEEKDAYS = ["Sunday", "Monday",
      "Tuesday", "Wednesday",
      "Thursday", "Friday", "Saturday"
    ];
    var MONTHS = ["January", "February",
      "March", "April", "May", "June",
      "July", "August", "September",
      "October", "November",
      "December"
    ];

    function leadingSomething(value,
      digits, character) {
      var str = typeof value ==
        "number" ? value.toString() :
        value || "";
      while (str.length < digits) {
        str = character[0] + str
      }
      return str
    }

    function leadingNulls(value,
    digits) {
      return leadingSomething(value,
        digits, "0")
    }

    function compareByDay(date1,
    date2) {
      function sgn(value) {
        return value < 0 ? -1 : value >
          0 ? 1 : 0
      }
      var compare;
      if ((compare = sgn(date1
          .getFullYear() - date2
          .getFullYear())) === 0) {
        if ((compare = sgn(date1
            .getMonth() - date2
            .getMonth())) === 0) {
          compare = sgn(date1
          .getDate() - date2.getDate()
            )
        }
      }
      return compare
    }

    function getFirstWeekStartDate(
      janFourth) {
      switch (janFourth.getDay()) {
        case 0:
          return new Date(janFourth
            .getFullYear() - 1, 11, 29
            );
        case 1:
          return janFourth;
        case 2:
          return new Date(janFourth
            .getFullYear(), 0, 3);
        case 3:
          return new Date(janFourth
            .getFullYear(), 0, 2);
        case 4:
          return new Date(janFourth
            .getFullYear(), 0, 1);
        case 5:
          return new Date(janFourth
            .getFullYear() - 1, 11, 31
            );
        case 6:
          return new Date(janFourth
            .getFullYear() - 1, 11, 30
            )
      }
    }

    function getWeekBasedYear(date) {
      var thisDate = addDays(new Date(
          date.tm_year + 1900, 0, 1),
        date.tm_yday);
      var janFourthThisYear = new Date(
        thisDate.getFullYear(), 0, 4);
      var janFourthNextYear = new Date(
        thisDate.getFullYear() + 1, 0,
        4);
      var firstWeekStartThisYear =
        getFirstWeekStartDate(
          janFourthThisYear);
      var firstWeekStartNextYear =
        getFirstWeekStartDate(
          janFourthNextYear);
      if (compareByDay(
          firstWeekStartThisYear,
          thisDate) <= 0) {
        if (compareByDay(
            firstWeekStartNextYear,
            thisDate) <= 0) {
          return thisDate
          .getFullYear() + 1
        }
        return thisDate.getFullYear()
      }
      return thisDate.getFullYear() - 1
    }
    var EXPANSION_RULES_2 = {
      "%a": date => WEEKDAYS[date
        .tm_wday].substring(0, 3)
      , "%A": date => WEEKDAYS[date
        .tm_wday]
      , "%b": date => MONTHS[date
        .tm_mon].substring(0, 3)
      , "%B": date => MONTHS[date
        .tm_mon]
      , "%C": date => {
        var year = date.tm_year +
          1900;
        return leadingNulls(year /
          100 | 0, 2)
      }
      , "%d": date => leadingNulls(
        date.tm_mday, 2)
      , "%e": date =>
        leadingSomething(date.tm_mday,
          2, " ")
      , "%g": date =>
        getWeekBasedYear(date)
        .toString().substring(2)
      , "%G": getWeekBasedYear
      , "%H": date => leadingNulls(
        date.tm_hour, 2)
      , "%I": date => {
        var twelveHour = date
          .tm_hour;
        if (twelveHour == 0)
          twelveHour = 12;
        else if (twelveHour > 12)
          twelveHour -= 12;
        return leadingNulls(
          twelveHour, 2)
      }
      , "%j": date => leadingNulls(
        date.tm_mday + arraySum(
          isLeapYear(date.tm_year +
            1900) ?
          MONTH_DAYS_LEAP :
          MONTH_DAYS_REGULAR, date
          .tm_mon - 1), 3)
      , "%m": date => leadingNulls(
        date.tm_mon + 1, 2)
      , "%M": date => leadingNulls(
        date.tm_min, 2)
      , "%n": () => "\n"
      , "%p": date => {
        if (date.tm_hour >= 0 &&
          date.tm_hour < 12) {
          return "AM"
        }
        return "PM"
      }
      , "%S": date => leadingNulls(
        date.tm_sec, 2)
      , "%t": () => "\t"
      , "%u": date => date.tm_wday ||
        7
      , "%U": date => {
        var days = date.tm_yday +
          7 - date.tm_wday;
        return leadingNulls(Math
          .floor(days / 7), 2)
      }
      , "%V": date => {
        var val = Math.floor((date
            .tm_yday + 7 - (date
              .tm_wday + 6) % 7) /
          7);
        if ((date.tm_wday + 371 -
            date.tm_yday - 2) % 7 <=
          2) {
          val++
        }
        if (!val) {
          val = 52;
          var dec31 = (date
            .tm_wday + 7 - date
            .tm_yday - 1) % 7;
          if (dec31 == 4 || dec31 ==
            5 && isLeapYear(date
              .tm_year % 400 - 1)) {
            val++
          }
        } else if (val == 53) {
          var jan1 = (date.tm_wday +
              371 - date.tm_yday) %
            7;
          if (jan1 != 4 && (jan1 !=
              3 || !isLeapYear(date
                .tm_year))) val = 1
        }
        return leadingNulls(val, 2)
      }
      , "%w": date => date.tm_wday
      , "%W": date => {
        var days = date.tm_yday +
          7 - (date.tm_wday + 6) %
          7;
        return leadingNulls(Math
          .floor(days / 7), 2)
      }
      , "%y": date => (date.tm_year +
        1900).toString().substring(
        2)
      , "%Y": date => date.tm_year +
        1900
      , "%z": date => {
        var off = date.tm_gmtoff;
        var ahead = off >= 0;
        off = Math.abs(off) / 60;
        off = off / 60 * 100 + off %
          60;
        return (ahead ? "+" : "-") +
          String("0000" + off)
          .slice(-4)
      }
      , "%Z": date => date.tm_zone
      , "%%": () => "%"
    };
    pattern = pattern.replace(/%%/g,
      "\0\0");
    for (var rule in
      EXPANSION_RULES_2) {
      if (pattern.includes(rule)) {
        pattern = pattern.replace(
          new RegExp(rule, "g"),
          EXPANSION_RULES_2[rule](
            date))
      }
    }
    pattern = pattern.replace(/\0\0/g,
      "%");
    var bytes = intArrayFromString(
      pattern, false);
    if (bytes.length > maxsize) {
      return 0
    }
    writeArrayToMemory(bytes, s);
    return bytes.length - 1
  };
var _strftime_l = (s, maxsize, format,
  tm, loc) => _strftime(s, maxsize,
  format, tm);
var stringToUTF8OnStack = str => {
  var size = lengthBytesUTF8(str) + 1;
  var ret = stackAlloc(size);
  stringToUTF8(str, ret, size);
  return ret
};
var wasmTable;
var getCFunc = ident => {
  var func = Module["_" + ident];
  return func
};
var ccall = (ident, returnType,
  argTypes, args, opts) => {
  var toC = {
    "string": str => {
      var ret = 0;
      if (str !== null && str !==
        undefined && str !== 0) {
        ret = stringToUTF8OnStack(
          str)
      }
      return ret
    }
    , "array": arr => {
      var ret = stackAlloc(arr
        .length);
      writeArrayToMemory(arr,
      ret);
      return ret
    }
  };

  function convertReturnValue(ret) {
    if (returnType === "string") {
      return UTF8ToString(ret)
    }
    if (returnType === "boolean")
      return Boolean(ret);
    return ret
  }
  var func = getCFunc(ident);
  var cArgs = [];
  var stack = 0;
  if (args) {
    for (var i = 0; i < args
      .length; i++) {
      var converter = toC[argTypes[
      i]];
      if (converter) {
        if (stack === 0) stack =
          stackSave();
        cArgs[i] = converter(args[i])
      } else {
        cArgs[i] = args[i]
      }
    }
  }
  var previousAsync = Asyncify
    .currData;
  var ret = func(...cArgs);

  function onDone(ret) {
    runtimeKeepalivePop();
    if (stack !== 0) stackRestore(
      stack);
    return convertReturnValue(ret)
  }
  var asyncMode = opts?.async;
  runtimeKeepalivePush();
  if (Asyncify.currData !=
    previousAsync) {
    return Asyncify.whenDone().then(
      onDone)
  }
  ret = onDone(ret);
  if (asyncMode) return Promise
    .resolve(ret);
  return ret
};
var cwrap = (ident, returnType,
  argTypes, opts) => {
  var numericArgs = !argTypes ||
    argTypes.every(type => type ===
      "number" || type === "boolean");
  var numericRet = returnType !==
    "string";
  if (numericRet && numericArgs && !
    opts) {
    return getCFunc(ident)
  }
  return (...args) => ccall(ident,
    returnType, argTypes, args, opts
    )
};
var GLctx;
var FSNode = function(parent, name,
  mode, rdev) {
  if (!parent) {
    parent = this
  }
  this.parent = parent;
  this.mount = parent.mount;
  this.mounted = null;
  this.id = FS.nextInode++;
  this.name = name;
  this.mode = mode;
  this.node_ops = {};
  this.stream_ops = {};
  this.rdev = rdev
};
var readMode = 292 | 73;
var writeMode = 146;
Object.defineProperties(FSNode
  .prototype, {
    read: {
      get: function() {
        return (this.mode &
          readMode) === readMode
      }
      , set: function(val) {
        val ? this.mode |=
          readMode : this.mode &= ~
          readMode
      }
    }
    , write: {
      get: function() {
        return (this.mode &
          writeMode) === writeMode
      }
      , set: function(val) {
        val ? this.mode |=
          writeMode : this.mode &= ~
          writeMode
      }
    }
    , isFolder: {
      get: function() {
        return FS.isDir(this.mode)
      }
    }
    , isDevice: {
      get: function() {
        return FS.isChrdev(this
          .mode)
      }
    }
  });
FS.FSNode = FSNode;
FS.createPreloadedFile =
  FS_createPreloadedFile;
FS.staticInit();
Module["requestFullscreen"] = Browser
  .requestFullscreen;
Module["requestAnimationFrame"] =
  Browser.requestAnimationFrame;
Module["setCanvasSize"] = Browser
  .setCanvasSize;
Module["pauseMainLoop"] = Browser
  .mainLoop.pause;
Module["resumeMainLoop"] = Browser
  .mainLoop.resume;
Module["getUserMedia"] = Browser
  .getUserMedia;
Module["createContext"] = Browser
  .createContext;
var preloadedImages = {};
var preloadedAudios = {};
for (var i = 0; i < 32; ++i)
  tempFixedLengthArray.push(new Array(
    i));
var wasmImports = {
  cf: _RWebCamFree
  , ub: _RWebCamInit
  , xe: _RWebCamPoll
  , Te: _RWebCamStart
  , Ie: _RWebCamStop
  , K: ___assert_fail
  , g: ___cxa_throw
  , Ea: ___syscall_fcntl64
  , rb: ___syscall_ftruncate64
  , Kb: ___syscall_getcwd
  , Gb: ___syscall_getdents64
  , Lb: ___syscall_ioctl
  , Hb: ___syscall_mkdirat
  , Fa: ___syscall_openat
  , Fb: ___syscall_readlinkat
  , Cb: ___syscall_renameat
  , Db: ___syscall_rmdir
  , Bb: ___syscall_stat64
  , Eb: ___syscall_unlinkat
  , Ob: __emscripten_get_now_is_monotonic
  , xb: __emscripten_throw_longjmp
  , ob: __localtime_js
  , pb: __mktime_js
  , zb: __tzset_js
  , j: _abort
  , Ub: _alBufferData
  , lb: _alDeleteBuffers
  , mb: _alDeleteSources
  , xc: _alGenBuffers
  , Ic: _alGenSources
  , Ca: _alGetError
  , $: _alGetSourcei
  , tb: _alSourcePlay
  , Mb: _alSourceQueueBuffers
  , nb: _alSourceStop
  , Ga: _alSourceUnqueueBuffers
  , jb: _alcCloseDevice
  , bd: _alcCreateContext
  , kb: _alcDestroyContext
  , Ha: _alcMakeContextCurrent
  , md: _alcOpenDevice
  , rh: _dummyErrnoCodes
  , fi: _eglBindAPI
  , ai: _eglChooseConfig
  , ab: _eglCreateContext
  , _h: _eglCreateWindowSurface
  , cb: _eglDestroyContext
  , ei: _eglDestroySurface
  , bi: _eglGetConfigs
  , ci: _eglGetCurrentContext
  , va: _eglGetDisplay
  , hi: _eglGetError
  , db: _eglInitialize
  , wa: _eglMakeCurrent
  , $h: _eglQueryString
  , bb: _eglQuerySurface
  , di: _eglSwapBuffers
  , gi: _eglTerminate
  , fh: _emscripten_asm_const_int
  , Pb: _emscripten_date_now
  , uh: _emscripten_fiber_swap
  , ii: _emscripten_force_exit
  , xa: _emscripten_get_canvas_element_size
  , aa: _emscripten_get_device_pixel_ratio
  , eb: _emscripten_get_fullscreen_status
  , Ab: _emscripten_get_heap_max
  , Nb: _emscripten_get_now
  , Zg: _emscripten_glActiveTexture
  , Yg: _emscripten_glAttachShader
  , Od: _emscripten_glBeginQuery
  , ph: _emscripten_glBeginQueryEXT
  , qd: _emscripten_glBeginTransformFeedback
  , Xg: _emscripten_glBindAttribLocation
  , Vg: _emscripten_glBindBuffer
  , nd: _emscripten_glBindBufferBase
  , od: _emscripten_glBindBufferRange
  , Ug: _emscripten_glBindFramebuffer
  , Tg: _emscripten_glBindRenderbuffer
  , rc: _emscripten_glBindSampler
  , Sg: _emscripten_glBindTexture
  , jc: _emscripten_glBindTransformFeedback
  , vd: _emscripten_glBindVertexArray
  , hh: _emscripten_glBindVertexArrayOES
  , Rg: _emscripten_glBlendColor
  , Qg: _emscripten_glBlendEquation
  , Pg: _emscripten_glBlendEquationSeparate
  , Og: _emscripten_glBlendFunc
  , Ng: _emscripten_glBlendFuncSeparate
  , Ad: _emscripten_glBlitFramebuffer
  , Mg: _emscripten_glBufferData
  , Kg: _emscripten_glBufferSubData
  , Jg: _emscripten_glCheckFramebufferStatus
  , Ig: _emscripten_glClear
  , Qc: _emscripten_glClearBufferfi
  , Rc: _emscripten_glClearBufferfv
  , Tc: _emscripten_glClearBufferiv
  , Sc: _emscripten_glClearBufferuiv
  , Hg: _emscripten_glClearColor
  , Gg: _emscripten_glClearDepthf
  , Fg: _emscripten_glClearStencil
  , Bc: _emscripten_glClientWaitSync
  , Eg: _emscripten_glColorMask
  , Dg: _emscripten_glCompileShader
  , Cg: _emscripten_glCompressedTexImage2D
  , Ud: _emscripten_glCompressedTexImage3D
  , Bg: _emscripten_glCompressedTexSubImage2D
  , Td: _emscripten_glCompressedTexSubImage3D
  , Oc: _emscripten_glCopyBufferSubData
  , zg: _emscripten_glCopyTexImage2D
  , yg: _emscripten_glCopyTexSubImage2D
  , Vd: _emscripten_glCopyTexSubImage3D
  , xg: _emscripten_glCreateProgram
  , wg: _emscripten_glCreateShader
  , vg: _emscripten_glCullFace
  , ug: _emscripten_glDeleteBuffers
  , tg: _emscripten_glDeleteFramebuffers
  , sg: _emscripten_glDeleteProgram
  , Qd: _emscripten_glDeleteQueries
  , sh: _emscripten_glDeleteQueriesEXT
  , rg: _emscripten_glDeleteRenderbuffers
  , tc: _emscripten_glDeleteSamplers
  , qg: _emscripten_glDeleteShader
  , Cc: _emscripten_glDeleteSync
  , og: _emscripten_glDeleteTextures
  , ic: _emscripten_glDeleteTransformFeedbacks
  , ud: _emscripten_glDeleteVertexArrays
  , eh: _emscripten_glDeleteVertexArraysOES
  , ng: _emscripten_glDepthFunc
  , mg: _emscripten_glDepthMask
  , lg: _emscripten_glDepthRangef
  , kg: _emscripten_glDetachShader
  , jg: _emscripten_glDisable
  , ig: _emscripten_glDisableVertexAttribArray
  , hg: _emscripten_glDrawArrays
  , Gc: _emscripten_glDrawArraysInstanced
  , ah: _emscripten_glDrawArraysInstancedANGLE
  , Tb: _emscripten_glDrawArraysInstancedARB
  , ae: _emscripten_glDrawArraysInstancedEXT
  , Vb: _emscripten_glDrawArraysInstancedNV
  , Id: _emscripten_glDrawBuffers
  , _d: _emscripten_glDrawBuffersEXT
  , bh: _emscripten_glDrawBuffersWEBGL
  , gg: _emscripten_glDrawElements
  , Fc: _emscripten_glDrawElementsInstanced
  , $g: _emscripten_glDrawElementsInstancedANGLE
  , Rb: _emscripten_glDrawElementsInstancedARB
  , Sb: _emscripten_glDrawElementsInstancedEXT
  , $d: _emscripten_glDrawElementsInstancedNV
  , Yd: _emscripten_glDrawRangeElements
  , fg: _emscripten_glEnable
  , dg: _emscripten_glEnableVertexAttribArray
  , Nd: _emscripten_glEndQuery
  , oh: _emscripten_glEndQueryEXT
  , pd: _emscripten_glEndTransformFeedback
  , Ec: _emscripten_glFenceSync
  , cg: _emscripten_glFinish
  , bg: _emscripten_glFlush
  , wd: _emscripten_glFlushMappedBufferRange
  , ag: _emscripten_glFramebufferRenderbuffer
  , $f: _emscripten_glFramebufferTexture2D
  , yd: _emscripten_glFramebufferTextureLayer
  , _f: _emscripten_glFrontFace
  , Zf: _emscripten_glGenBuffers
  , Xf: _emscripten_glGenFramebuffers
  , Rd: _emscripten_glGenQueries
  , th: _emscripten_glGenQueriesEXT
  , Wf: _emscripten_glGenRenderbuffers
  , uc: _emscripten_glGenSamplers
  , Uf: _emscripten_glGenTextures
  , hc: _emscripten_glGenTransformFeedbacks
  , td: _emscripten_glGenVertexArrays
  , dh: _emscripten_glGenVertexArraysOES
  , Yf: _emscripten_glGenerateMipmap
  , Tf: _emscripten_glGetActiveAttrib
  , Sf: _emscripten_glGetActiveUniform
  , Jc: _emscripten_glGetActiveUniformBlockName
  , Kc: _emscripten_glGetActiveUniformBlockiv
  , Mc: _emscripten_glGetActiveUniformsiv
  , Rf: _emscripten_glGetAttachedShaders
  , Qf: _emscripten_glGetAttribLocation
  , Pf: _emscripten_glGetBooleanv
  , vc: _emscripten_glGetBufferParameteri64v
  , Of: _emscripten_glGetBufferParameteriv
  , Jd: _emscripten_glGetBufferPointerv
  , Nf: _emscripten_glGetError
  , Mf: _emscripten_glGetFloatv
  , ad: _emscripten_glGetFragDataLocation
  , Lf: _emscripten_glGetFramebufferAttachmentParameteriv
  , wc: _emscripten_glGetInteger64i_v
  , zc: _emscripten_glGetInteger64v
  , rd: _emscripten_glGetIntegeri_v
  , Jf: _emscripten_glGetIntegerv
  , Yb: _emscripten_glGetInternalformativ
  , dc: _emscripten_glGetProgramBinary
  , Hf: _emscripten_glGetProgramInfoLog
  , If: _emscripten_glGetProgramiv
  , jh: _emscripten_glGetQueryObjecti64vEXT
  , lh: _emscripten_glGetQueryObjectivEXT
  , ih: _emscripten_glGetQueryObjectui64vEXT
  , Ld: _emscripten_glGetQueryObjectuiv
  , kh: _emscripten_glGetQueryObjectuivEXT
  , Md: _emscripten_glGetQueryiv
  , mh: _emscripten_glGetQueryivEXT
  , Gf: _emscripten_glGetRenderbufferParameteriv
  , lc: _emscripten_glGetSamplerParameterfv
  , mc: _emscripten_glGetSamplerParameteriv
  , Ef: _emscripten_glGetShaderInfoLog
  , Df: _emscripten_glGetShaderPrecisionFormat
  , Cf: _emscripten_glGetShaderSource
  , Ff: _emscripten_glGetShaderiv
  , Bf: _emscripten_glGetString
  , Pc: _emscripten_glGetStringi
  , yc: _emscripten_glGetSynciv
  , Af: _emscripten_glGetTexParameterfv
  , yf: _emscripten_glGetTexParameteriv
  , kd: _emscripten_glGetTransformFeedbackVarying
  , Lc: _emscripten_glGetUniformBlockIndex
  , Nc: _emscripten_glGetUniformIndices
  , vf: _emscripten_glGetUniformLocation
  , xf: _emscripten_glGetUniformfv
  , wf: _emscripten_glGetUniformiv
  , cd: _emscripten_glGetUniformuiv
  , id: _emscripten_glGetVertexAttribIiv
  , hd: _emscripten_glGetVertexAttribIuiv
  , sf: _emscripten_glGetVertexAttribPointerv
  , uf: _emscripten_glGetVertexAttribfv
  , tf: _emscripten_glGetVertexAttribiv
  , rf: _emscripten_glHint
  , ac: _emscripten_glInvalidateFramebuffer
  , $b: _emscripten_glInvalidateSubFramebuffer
  , qf: _emscripten_glIsBuffer
  , pf: _emscripten_glIsEnabled
  , nf: _emscripten_glIsFramebuffer
  , mf: _emscripten_glIsProgram
  , Pd: _emscripten_glIsQuery
  , qh: _emscripten_glIsQueryEXT
  , lf: _emscripten_glIsRenderbuffer
  , sc: _emscripten_glIsSampler
  , kf: _emscripten_glIsShader
  , Dc: _emscripten_glIsSync
  , jf: _emscripten_glIsTexture
  , gc: _emscripten_glIsTransformFeedback
  , sd: _emscripten_glIsVertexArray
  , ch: _emscripten_glIsVertexArrayOES
  , hf: _emscripten_glLineWidth
  , gf: _emscripten_glLinkProgram
  , xd: _emscripten_glMapBufferRange
  , fc: _emscripten_glPauseTransformFeedback
  , ff: _emscripten_glPixelStorei
  , ef: _emscripten_glPolygonOffset
  , cc: _emscripten_glProgramBinary
  , bc: _emscripten_glProgramParameteri
  , nh: _emscripten_glQueryCounterEXT
  , Zd: _emscripten_glReadBuffer
  , df: _emscripten_glReadPixels
  , bf: _emscripten_glReleaseShaderCompiler
  , af: _emscripten_glRenderbufferStorage
  , zd: _emscripten_glRenderbufferStorageMultisample
  , ec: _emscripten_glResumeTransformFeedback
  , $e: _emscripten_glSampleCoverage
  , oc: _emscripten_glSamplerParameterf
  , nc: _emscripten_glSamplerParameterfv
  , qc: _emscripten_glSamplerParameteri
  , pc: _emscripten_glSamplerParameteriv
  , _e: _emscripten_glScissor
  , Ze: _emscripten_glShaderBinary
  , Ye: _emscripten_glShaderSource
  , Xe: _emscripten_glStencilFunc
  , We: _emscripten_glStencilFuncSeparate
  , Ve: _emscripten_glStencilMask
  , Ue: _emscripten_glStencilMaskSeparate
  , Se: _emscripten_glStencilOp
  , Re: _emscripten_glStencilOpSeparate
  , Qe: _emscripten_glTexImage2D
  , Xd: _emscripten_glTexImage3D
  , Pe: _emscripten_glTexParameterf
  , Oe: _emscripten_glTexParameterfv
  , Ne: _emscripten_glTexParameteri
  , Me: _emscripten_glTexParameteriv
  , _b: _emscripten_glTexStorage2D
  , Zb: _emscripten_glTexStorage3D
  , Le: _emscripten_glTexSubImage2D
  , Wd: _emscripten_glTexSubImage3D
  , ld: _emscripten_glTransformFeedbackVaryings
  , Ke: _emscripten_glUniform1f
  , Je: _emscripten_glUniform1fv
  , He: _emscripten_glUniform1i
  , Ge: _emscripten_glUniform1iv
  , $c: _emscripten_glUniform1ui
  , Xc: _emscripten_glUniform1uiv
  , Fe: _emscripten_glUniform2f
  , Ee: _emscripten_glUniform2fv
  , De: _emscripten_glUniform2i
  , Ce: _emscripten_glUniform2iv
  , _c: _emscripten_glUniform2ui
  , Wc: _emscripten_glUniform2uiv
  , Be: _emscripten_glUniform3f
  , Ae: _emscripten_glUniform3fv
  , ze: _emscripten_glUniform3i
  , ye: _emscripten_glUniform3iv
  , Zc: _emscripten_glUniform3ui
  , Vc: _emscripten_glUniform3uiv
  , we: _emscripten_glUniform4f
  , ve: _emscripten_glUniform4fv
  , ue: _emscripten_glUniform4i
  , te: _emscripten_glUniform4iv
  , Yc: _emscripten_glUniform4ui
  , Uc: _emscripten_glUniform4uiv
  , Hc: _emscripten_glUniformBlockBinding
  , se: _emscripten_glUniformMatrix2fv
  , Gd: _emscripten_glUniformMatrix2x3fv
  , Ed: _emscripten_glUniformMatrix2x4fv
  , re: _emscripten_glUniformMatrix3fv
  , Fd: _emscripten_glUniformMatrix3x2fv
  , Cd: _emscripten_glUniformMatrix3x4fv
  , qe: _emscripten_glUniformMatrix4fv
  , Dd: _emscripten_glUniformMatrix4x2fv
  , Bd: _emscripten_glUniformMatrix4x3fv
  , Kd: _emscripten_glUnmapBuffer
  , pe: _emscripten_glUseProgram
  , oe: _emscripten_glValidateProgram
  , ne: _emscripten_glVertexAttrib1f
  , le: _emscripten_glVertexAttrib1fv
  , ke: _emscripten_glVertexAttrib2f
  , je: _emscripten_glVertexAttrib2fv
  , ie: _emscripten_glVertexAttrib3f
  , he: _emscripten_glVertexAttrib3fv
  , ge: _emscripten_glVertexAttrib4f
  , fe: _emscripten_glVertexAttrib4fv
  , kc: _emscripten_glVertexAttribDivisor
  , _g: _emscripten_glVertexAttribDivisorANGLE
  , Wb: _emscripten_glVertexAttribDivisorARB
  , ce: _emscripten_glVertexAttribDivisorEXT
  , Xb: _emscripten_glVertexAttribDivisorNV
  , gd: _emscripten_glVertexAttribI4i
  , ed: _emscripten_glVertexAttribI4iv
  , fd: _emscripten_glVertexAttribI4ui
  , dd: _emscripten_glVertexAttribI4uiv
  , jd: _emscripten_glVertexAttribIPointer
  , ee: _emscripten_glVertexAttribPointer
  , de: _emscripten_glViewport
  , Ac: _emscripten_glWaitSync
  , of: _emscripten_html5_remove_all_event_listeners
  , Qb: _emscripten_memcpy_js
  , ji: _emscripten_pause_main_loop
  , yb: _emscripten_resize_heap
  , gh: _emscripten_resume_main_loop
  , Lg: _emscripten_set_keydown_callback_on_thread
  , pg: _emscripten_set_keypress_callback_on_thread
  , Ag: _emscripten_set_keyup_callback_on_thread
  , Wg: _emscripten_set_main_loop
  , T: _emscripten_set_main_loop_timing
  , eg: _emscripten_set_mousedown_callback_on_thread
  , Kf: _emscripten_set_mousemove_callback_on_thread
  , Vf: _emscripten_set_mouseup_callback_on_thread
  , Hd: _emscripten_set_touchcancel_callback_on_thread
  , be: _emscripten_set_touchend_callback_on_thread
  , Sd: _emscripten_set_touchmove_callback_on_thread
  , me: _emscripten_set_touchstart_callback_on_thread
  , zf: _emscripten_set_wheel_callback_on_thread
  , S: _emscripten_sleep
  , Ib: _environ_get
  , Jb: _environ_sizes_get
  , fb: _exit
  , _: _fd_close
  , Da: _fd_read
  , qb: _fd_seek
  , ha: _fd_write
  , F: _glActiveTexture
  , sa: _glAttachShader
  , Hh: _glBindAttribLocation
  , m: _glBindBuffer
  , Lh: _glBindBufferBase
  , b: _glBindFramebuffer
  , P: _glBindRenderbuffer
  , c: _glBindTexture
  , na: _glBindVertexArray
  , Bh: _glBlendColor
  , R: _glBlendEquation
  , r: _glBlendFunc
  , ma: _glBlendFuncSeparate
  , Ah: _glBlitFramebuffer
  , M: _glBufferData
  , Rh: _glBufferSubData
  , J: _glCheckFramebufferStatus
  , G: _glClear
  , N: _glClearColor
  , sb: _glClientWaitSync
  , Pa: _glColorMask
  , Ra: _glCompileShader
  , Xa: _glCreateProgram
  , ta: _glCreateShader
  , ka: _glCullFace
  , X: _glDeleteBuffers
  , D: _glDeleteFramebuffers
  , pa: _glDeleteProgram
  , Aa: _glDeleteRenderbuffers
  , qa: _glDeleteShader
  , wh: _glDeleteSync
  , i: _glDeleteTextures
  , yh: _glDeleteVertexArrays
  , la: _glDepthFunc
  , ja: _glDepthMask
  , Sh: _glDepthRangef
  , Ih: _glDetachShader
  , d: _glDisable
  , p: _glDisableVertexAttribArray
  , s: _glDrawArrays
  , Ka: _glDrawBuffers
  , Qh: _glDrawElements
  , f: _glEnable
  , y: _glEnableVertexAttribArray
  , xh: _glFenceSync
  , hb: _glFinish
  , ib: _glFlush
  , vh: _glFlushMappedBufferRange
  , O: _glFramebufferRenderbuffer
  , C: _glFramebufferTexture2D
  , Oa: _glFrontFace
  , U: _glGenBuffers
  , V: _glGenFramebuffers
  , ya: _glGenRenderbuffers
  , w: _glGenTextures
  , zh: _glGenVertexArrays
  , Y: _glGenerateMipmap
  , Oh: _glGetActiveUniformBlockiv
  , Nh: _glGetActiveUniformsiv
  , Ta: _glGetAttribLocation
  , ga: _glGetError
  , Ja: _glGetFramebufferAttachmentParameteriv
  , B: _glGetIntegerv
  , Ch: _glGetProgramBinary
  , Va: _glGetProgramInfoLog
  , ra: _glGetProgramiv
  , Qa: _glGetShaderInfoLog
  , oa: _glGetShaderiv
  , v: _glGetString
  , da: _glGetStringi
  , Kh: _glGetUniformBlockIndex
  , Mh: _glGetUniformIndices
  , H: _glGetUniformLocation
  , Ua: _glIsProgram
  , Vh: _glLineWidth
  , Wa: _glLinkProgram
  , za: _glMapBufferRange
  , k: _glPixelStorei
  , ia: _glPolygonOffset
  , Ph: _glProgramParameteri
  , Uh: _glReadBuffer
  , fa: _glReadPixels
  , ea: _glRenderbufferStorage
  , Z: _glScissor
  , Sa: _glShaderSource
  , La: _glStencilFunc
  , Na: _glStencilMask
  , Ma: _glStencilOp
  , E: _glTexImage2D
  , e: _glTexParameteri
  , W: _glTexStorage2D
  , Q: _glTexSubImage2D
  , ua: _glUniform1f
  , Yh: _glUniform1fv
  , u: _glUniform1i
  , $a: _glUniform2f
  , l: _glUniform2fv
  , Eh: _glUniform2i
  , Zh: _glUniform3f
  , Za: _glUniform3fv
  , _a: _glUniform4f
  , Ya: _glUniform4fv
  , Dh: _glUniform4i
  , Jh: _glUniformBlockBinding
  , Xh: _glUniformMatrix4fv
  , gb: _glUnmapBuffer
  , z: _glUseProgram
  , Gh: _glVertexAttrib4f
  , Fh: _glVertexAttrib4fv
  , x: _glVertexAttribPointer
  , t: _glViewport
  , Ia: invoke_i
  , o: invoke_ii
  , A: invoke_iii
  , n: invoke_iiii
  , ca: invoke_iiiii
  , Ba: invoke_iiiiii
  , Th: invoke_iiiiiii
  , vb: invoke_j
  , q: invoke_v
  , h: invoke_vi
  , a: invoke_vii
  , I: invoke_viii
  , ba: invoke_viiii
  , Wh: invoke_viiiiiiiii
  , L: _strftime
  , wb: _strftime_l
};
var wasmExports = createWasm();
var ___wasm_call_ctors = () => (
  ___wasm_call_ctors = wasmExports[
    "li"])();
var _free = a0 => (_free = wasmExports[
  "ni"])(a0);
var _cmd_take_screenshot = Module[
  "_cmd_take_screenshot"] = () => (
  _cmd_take_screenshot = Module[
    "_cmd_take_screenshot"] =
  wasmExports["oi"])();
var _get_current_frame_count = Module[
    "_get_current_frame_count"] = () =>
  (_get_current_frame_count = Module[
      "_get_current_frame_count"] =
    wasmExports["pi"])();
var _save_file_path = Module[
  "_save_file_path"] = () => (
  _save_file_path = Module[
    "_save_file_path"] = wasmExports[
    "qi"])();
var _toggleMainLoop = Module[
  "_toggleMainLoop"] = a0 => (
  _toggleMainLoop = Module[
    "_toggleMainLoop"] = wasmExports[
    "ri"])(a0);
var _load_state = Module[
  "_load_state"] = (a0, a1) => (
    _load_state = Module[
    "_load_state"] = wasmExports["si"])(
    a0, a1);
var _system_restart = Module[
  "_system_restart"] = () => (
  _system_restart = Module[
    "_system_restart"] = wasmExports[
    "ti"])();
var _get_disk_count = Module[
  "_get_disk_count"] = () => (
  _get_disk_count = Module[
    "_get_disk_count"] = wasmExports[
    "ui"])();
var _set_current_disk = Module[
  "_set_current_disk"] = a0 => (
  _set_current_disk = Module[
    "_set_current_disk"] =
  wasmExports["vi"])(a0);
var _get_current_disk = Module[
  "_get_current_disk"] = () => (
  _get_current_disk = Module[
    "_get_current_disk"] =
  wasmExports["wi"])();
var _toggle_fastforward = Module[
  "_toggle_fastforward"] = a0 => (
  _toggle_fastforward = Module[
    "_toggle_fastforward"] =
  wasmExports["xi"])(a0);
var _set_ff_ratio = Module[
  "_set_ff_ratio"] = a0 => (
  _set_ff_ratio = Module[
    "_set_ff_ratio"] = wasmExports[
    "yi"])(a0);
var _toggle_slow_motion = Module[
  "_toggle_slow_motion"] = a0 => (
  _toggle_slow_motion = Module[
    "_toggle_slow_motion"] =
  wasmExports["zi"])(a0);
var _set_sm_ratio = Module[
  "_set_sm_ratio"] = a0 => (
  _set_sm_ratio = Module[
    "_set_sm_ratio"] = wasmExports[
    "Ai"])(a0);
var _toggle_rewind = Module[
  "_toggle_rewind"] = a0 => (
  _toggle_rewind = Module[
    "_toggle_rewind"] = wasmExports[
    "Bi"])(a0);
var _set_rewind_granularity = Module[
  "_set_rewind_granularity"] = a0 => (
  _set_rewind_granularity = Module[
    "_set_rewind_granularity"] =
  wasmExports["Ci"])(a0);
var _malloc = Module["_malloc"] = a0 =>
  (_malloc = Module["_malloc"] =
    wasmExports["Di"])(a0);
var setTempRet0 = a0 => (setTempRet0 =
  wasmExports["Ei"])(a0);
var _ejs_set_variable = Module[
  "_ejs_set_variable"] = (a0, a1) => (
  _ejs_set_variable = Module[
    "_ejs_set_variable"] =
  wasmExports["Fi"])(a0, a1);
var _get_core_options = Module[
  "_get_core_options"] = () => (
  _get_core_options = Module[
    "_get_core_options"] =
  wasmExports["Gi"])();
var _shader_enable = Module[
  "_shader_enable"] = a0 => (
  _shader_enable = Module[
    "_shader_enable"] = wasmExports[
    "Hi"])(a0);
var _save_state_info = Module[
  "_save_state_info"] = () => (
  _save_state_info = Module[
    "_save_state_info"] = wasmExports[
    "Ii"])();
var _supports_states = Module[
  "_supports_states"] = () => (
  _supports_states = Module[
    "_supports_states"] = wasmExports[
    "Ji"])();
var _refresh_save_files = Module[
  "_refresh_save_files"] = () => (
  _refresh_save_files = Module[
    "_refresh_save_files"] =
  wasmExports["Ki"])();
var _cmd_savefiles = Module[
  "_cmd_savefiles"] = () => (
  _cmd_savefiles = Module[
    "_cmd_savefiles"] = wasmExports[
    "Li"])();
var _cmd_save_state = Module[
  "_cmd_save_state"] = () => (
  _cmd_save_state = Module[
    "_cmd_save_state"] = wasmExports[
    "Mi"])();
var _set_cheat = Module["_set_cheat"] =
  (a0, a1, a2) => (_set_cheat = Module[
    "_set_cheat"] = wasmExports["Ni"])(
    a0, a1, a2);
var _reset_cheat = Module[
  "_reset_cheat"] = () => (
  _reset_cheat = Module[
    "_reset_cheat"] = wasmExports[
    "Oi"])();
var _main = Module["_main"] = (a0,
  a1) => (_main = Module["_main"] =
    wasmExports["Pi"])(a0, a1);
var _ejs_set_keyboard_enabled = Module[
    "_ejs_set_keyboard_enabled"] = a0 =>
  (_ejs_set_keyboard_enabled = Module[
      "_ejs_set_keyboard_enabled"] =
    wasmExports["Qi"])(a0);
var _simulate_input = Module[
    "_simulate_input"] = (a0, a1, a2) =>
  (_simulate_input = Module[
    "_simulate_input"] = wasmExports[
    "Ri"])(a0, a1, a2);
var _set_vsync = Module["_set_vsync"] =
  a0 => (_set_vsync = Module[
    "_set_vsync"] = wasmExports["Si"])(
    a0);
var _setThrew = (a0, a1) => (_setThrew =
  wasmExports["Ti"])(a0, a1);
var _emscripten_stack_set_limits = (a0,
  a1) => (
  _emscripten_stack_set_limits =
  wasmExports["Ui"])(a0, a1);
var stackSave = () => (stackSave =
  wasmExports["Vi"])();
var stackRestore = a0 => (stackRestore =
  wasmExports["Wi"])(a0);
var stackAlloc = a0 => (stackAlloc =
  wasmExports["Xi"])(a0);
var ___cxa_is_pointer_type = a0 => (
  ___cxa_is_pointer_type =
  wasmExports["Yi"])(a0);
var dynCall_v = Module["dynCall_v"] =
  a0 => (dynCall_v = Module[
    "dynCall_v"] = wasmExports["Zi"])(
    a0);
var dynCall_viiii = Module[
  "dynCall_viiii"] = (a0, a1, a2, a3,
  a4) => (dynCall_viiii = Module[
  "dynCall_viiii"] = wasmExports[
  "_i"])(a0, a1, a2, a3, a4);
var dynCall_i = Module["dynCall_i"] =
  a0 => (dynCall_i = Module[
    "dynCall_i"] = wasmExports["$i"])(
    a0);
var dynCall_ii = Module["dynCall_ii"] =
  (a0, a1) => (dynCall_ii = Module[
    "dynCall_ii"] = wasmExports["aj"])(
    a0, a1);
var dynCall_vii = Module[
  "dynCall_vii"] = (a0, a1, a2) => (
    dynCall_vii = Module[
    "dynCall_vii"] = wasmExports["bj"])(
    a0, a1, a2);
var dynCall_iiii = Module[
    "dynCall_iiii"] = (a0, a1, a2,
  a3) => (dynCall_iiii = Module[
    "dynCall_iiii"] = wasmExports[
    "cj"])(a0, a1, a2, a3);
var dynCall_iiiiii = Module[
  "dynCall_iiiiii"] = (a0, a1, a2, a3,
  a4, a5) => (dynCall_iiiiii = Module[
  "dynCall_iiiiii"] = wasmExports[
  "dj"])(a0, a1, a2, a3, a4, a5);
var dynCall_vi = Module["dynCall_vi"] =
  (a0, a1) => (dynCall_vi = Module[
    "dynCall_vi"] = wasmExports["ej"])(
    a0, a1);
var dynCall_viii = Module[
    "dynCall_viii"] = (a0, a1, a2,
  a3) => (dynCall_viii = Module[
    "dynCall_viii"] = wasmExports[
    "fj"])(a0, a1, a2, a3);
var dynCall_iii = Module[
  "dynCall_iii"] = (a0, a1, a2) => (
    dynCall_iii = Module[
    "dynCall_iii"] = wasmExports["gj"])(
    a0, a1, a2);
var dynCall_iiiii = Module[
  "dynCall_iiiii"] = (a0, a1, a2, a3,
  a4) => (dynCall_iiiii = Module[
  "dynCall_iiiii"] = wasmExports[
  "hj"])(a0, a1, a2, a3, a4);
var dynCall_iiiiiii = Module[
  "dynCall_iiiiiii"] = (a0, a1, a2,
  a3, a4, a5, a6) => (
  dynCall_iiiiiii = Module[
    "dynCall_iiiiiii"] = wasmExports[
    "ij"])(a0, a1, a2, a3, a4, a5, a6);
var dynCall_j = Module["dynCall_j"] =
  a0 => (dynCall_j = Module[
    "dynCall_j"] = wasmExports["jj"])(
    a0);
var dynCall_viiiiiiiii = Module[
  "dynCall_viiiiiiiii"] = (a0, a1, a2,
  a3, a4, a5, a6, a7, a8, a9) => (
  dynCall_viiiiiiiii = Module[
    "dynCall_viiiiiiiii"] =
  wasmExports["kj"])(a0, a1, a2, a3,
  a4, a5, a6, a7, a8, a9);
var _asyncify_start_unwind = a0 => (
  _asyncify_start_unwind =
  wasmExports["lj"])(a0);
var _asyncify_stop_unwind = () => (
  _asyncify_stop_unwind = wasmExports[
    "mj"])();
var _asyncify_start_rewind = a0 => (
  _asyncify_start_rewind =
  wasmExports["nj"])(a0);
var _asyncify_stop_rewind = () => (
  _asyncify_stop_rewind = wasmExports[
    "oj"])();

function invoke_i(index) {
  var sp = stackSave();
  try {
    return dynCall_i(index)
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0) throw e;
    _setThrew(1, 0)
  }
}

function invoke_ii(index, a1) {
  var sp = stackSave();
  try {
    return dynCall_ii(index, a1)
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0) throw e;
    _setThrew(1, 0)
  }
}

function invoke_vii(index, a1, a2) {
  var sp = stackSave();
  try {
    dynCall_vii(index, a1, a2)
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0) throw e;
    _setThrew(1, 0)
  }
}

function invoke_iiii(index, a1, a2,
a3) {
  var sp = stackSave();
  try {
    return dynCall_iiii(index, a1, a2,
      a3)
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0) throw e;
    _setThrew(1, 0)
  }
}

function invoke_v(index) {
  var sp = stackSave();
  try {
    dynCall_v(index)
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0) throw e;
    _setThrew(1, 0)
  }
}

function invoke_iiiiii(index, a1, a2,
  a3, a4, a5) {
  var sp = stackSave();
  try {
    return dynCall_iiiiii(index, a1, a2,
      a3, a4, a5)
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0) throw e;
    _setThrew(1, 0)
  }
}

function invoke_vi(index, a1) {
  var sp = stackSave();
  try {
    dynCall_vi(index, a1)
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0) throw e;
    _setThrew(1, 0)
  }
}

function invoke_viii(index, a1, a2,
a3) {
  var sp = stackSave();
  try {
    dynCall_viii(index, a1, a2, a3)
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0) throw e;
    _setThrew(1, 0)
  }
}

function invoke_iii(index, a1, a2) {
  var sp = stackSave();
  try {
    return dynCall_iii(index, a1, a2)
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0) throw e;
    _setThrew(1, 0)
  }
}

function invoke_iiiii(index, a1, a2, a3,
  a4) {
  var sp = stackSave();
  try {
    return dynCall_iiiii(index, a1, a2,
      a3, a4)
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0) throw e;
    _setThrew(1, 0)
  }
}

function invoke_viiii(index, a1, a2, a3,
  a4) {
  var sp = stackSave();
  try {
    dynCall_viiii(index, a1, a2, a3, a4)
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0) throw e;
    _setThrew(1, 0)
  }
}

function invoke_iiiiiii(index, a1, a2,
  a3, a4, a5, a6) {
  var sp = stackSave();
  try {
    return dynCall_iiiiiii(index, a1,
      a2, a3, a4, a5, a6)
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0) throw e;
    _setThrew(1, 0)
  }
}

function invoke_viiiiiiiii(index, a1,
  a2, a3, a4, a5, a6, a7, a8, a9) {
  var sp = stackSave();
  try {
    dynCall_viiiiiiiii(index, a1, a2,
      a3, a4, a5, a6, a7, a8, a9)
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0) throw e;
    _setThrew(1, 0)
  }
}

function invoke_j(index) {
  var sp = stackSave();
  try {
    return dynCall_j(index)
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0) throw e;
    _setThrew(1, 0)
  }
}
Module["callMain"] = callMain;
Module["ERRNO_CODES"] = ERRNO_CODES;
Module["cwrap"] = cwrap;
Module["getValue"] = getValue;
Module["PATH"] = PATH;
Module["FS"] = FS;
var calledRun;
dependenciesFulfilled =
  function runCaller() {
    if (!calledRun) run();
    if (!calledRun)
      dependenciesFulfilled = runCaller
  };

function callMain(args = []) {
  var entryFunction = _main;
  args.unshift(thisProgram);
  var argc = args.length;
  var argv = stackAlloc((argc + 1) * 4);
  var argv_ptr = argv;
  args.forEach(arg => {
    HEAPU32[argv_ptr >> 2] =
      stringToUTF8OnStack(arg);
    argv_ptr += 4
  });
  HEAPU32[argv_ptr >> 2] = 0;
  try {
    var ret = entryFunction(argc, argv);
    exitJS(ret, true);
    return ret
  } catch (e) {
    return handleException(e)
  }
}

function run(args = arguments_) {
  if (runDependencies > 0) {
    return
  }
  preRun();
  if (runDependencies > 0) {
    return
  }

  function doRun() {
    if (calledRun) return;
    calledRun = true;
    Module["calledRun"] = true;
    if (ABORT) return;
    initRuntime();
    preMain();
    if (Module["onRuntimeInitialized"])
      Module["onRuntimeInitialized"]();
    if (shouldRunNow) callMain(args);
    postRun()
  }
  if (Module["setStatus"]) {
    Module["setStatus"]("Running...");
    setTimeout(function() {
      setTimeout(function() {
        Module["setStatus"]("")
      }, 1);
      doRun()
    }, 1)
  } else {
    doRun()
  }
}
if (Module["preInit"]) {
  if (typeof Module["preInit"] ==
    "function") Module["preInit"] = [
    Module["preInit"]
  ];
  while (Module["preInit"].length > 0) {
    Module["preInit"].pop()()
  }
}
var shouldRunNow = true;
if (Module["noInitialRun"])
  shouldRunNow = false;
run();