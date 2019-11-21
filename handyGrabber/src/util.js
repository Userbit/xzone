import childProcess from "child_process";
import debugModule from "debug";
import callsites from "callsites";
import url from "url";
import packageJson from "../../package.json";

function getPackageName() {
  return packageJson.name;
}

function getRootDir() {
  return `/${getPackageName()}/`;
}

const rootdir = getRootDir();

function getNamespace(externalModule, rootDir) {
  const { filename } = externalModule;
  const namespace = filename.slice(filename.indexOf(rootDir) + rootDir.length);
  return `${namespace}`; // such as: 'path/to/file.js'
}

function getDebug(externalModule) {
  return debugModule(`${getNamespace(externalModule, rootdir)}:`);
}

function sleep(externalModule) {
  const debug = getDebug(externalModule);
  return (delayInSec) => {
    // eslint-disable-next-line no-unused-expressions
    debug && debug(`Sleep on ${delayInSec} sec...`);
    childProcess.execSync(`sleep ${delayInSec}`);
  };
}

function getObjectForKeys(keys, fromObject) {
  return keys.reduce((obj, key) => {
    if (fromObject[key]) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = fromObject[key];
    }

    return obj;
  }, {});
}

function getPath(urlOrPath) {
  const protocol = "file://";
  if (urlOrPath.includes(protocol)) return url.fileURLToPath(urlOrPath);

  return urlOrPath;
}

function getStackFrameInfo(stackFrameNum = 0) {
  const callsite = callsites()[stackFrameNum];
  const info = {
    // When ES Modules .getFileName() return url such as "file:///path/to/file.js"
    filename: getPath(callsite.getFileName()),
    function: callsite.getFunctionName(),
    line: callsite.getLineNumber(),
    column: callsite.getColumnNumber(),
  };

  return info;
}

export default () => {
  const externalModule = getStackFrameInfo(2);

  return {
    thisFile: externalModule.filename,
    debug: getDebug(externalModule),
    sleep: sleep(externalModule),
    getNamespace,
    getObjectForKeys,
    getStackFrameInfo,
    getPackageName,
    getRootDir,
    getPath,
  };
};
