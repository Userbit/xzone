import childProcess from "child_process";
import debugModule from "debug";
import callsites from "callsites";
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
  return `${namespace}`; // such as: path/to/file.js
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

function getStackFrameInfo(stackFrameNum = 0) {
  const callsite = callsites()[stackFrameNum];
  const info = {
    filename: callsite.getFileName(),
    function: callsite.getFunctionName(),
    line: callsite.getLineNumber(),
    column: callsite.getColumnNumber(),
  };

  return info;
}

export default (externalModule) => {
  if (!(externalModule instanceof module.constructor)) {
    const errMsg = "require('path/to/util')(module) should be passed Module object of caller";
    throw Error(errMsg);
  }

  externalModule = getStackFrameInfo(2);

  return {
    debug: getDebug(externalModule),
    sleep: sleep(externalModule),
    getNamespace,
    getObjectForKeys,
    getStackFrameInfo,
    getPackageName,
    getRootDir,
  };
};
