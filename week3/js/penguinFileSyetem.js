// Constant List

defConst("FILE_ID_LENGTH", 64);
defConst("DEFAULT_WORKING_DIR", "/");
defConst("USER_PREFIX", "xxx@tql> ")

var pfsInMem = [];
var pfsMemBuffer = [];
var workingDir = DEFAULT_WORKING_DIR;
var regIsDir = new RegExp('("fileType":"Directory")', "g");
var regUrlFilename = new RegExp('[^/]+(?!.)$', "g");
var regUrlPath = new RegExp('^.+(?=[/])', "g");
var regUrlDot1 = new RegExp('(!?[.])[/]', "g");
var regUrlDot2 = new RegExp('[.][.][/]', '');

var allowedCmd = ["cd", "ls", "touch", "mkdir", "pwd", "rm", "mv", "cp", "cat", "ln", "echo"];

// Compulsory Helper Functions

/**
 * @description Try to define a constant in es5
 * @param {string} name Property Name
 * @param {*} value Property Value
 */
function defConst(pName, pValue, toWindow) {
    if (!toWindow)
        Object.defineProperty(this, pName, { writable: false, configurable: false, value: pValue });
}

function inheritPrototype(subType, superType) {
    var prototype = Object.create(superType.prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
}

function fill(str, n, filler) {
    var len = str.length;
    while (len < n) {
        str = str + filler;
        len++;
    }
    return str;
}

function pfsEncode(source) {
    var code = window.btoa(source).replace("=", "");
    if (code.length < FILE_ID_LENGTH) {
        code = fill(code, FILE_ID_LENGTH - code.length, "0");
    }
    return code.slice(0, FILE_ID_LENGTH - 1);
}

function PfsParser() {
    this.commandHistory = [];
    this.previousCommand = null;
    this.currentDir = null;
}

PfsParser.prototype.parseObj = function (key) {
    var tmp = JSON.parse(PenguinStorage.getItem(key));
    tmp.prototype = PenguinFile.prototype;
    tmp.__proto__ = tmp.prototype;
    //console.log(tmp);
    return tmp;
}

PfsParser.prototype.reset = function () { }

PfsParser.prototype.parsePath = function (path) {
    //if (path.match(regUrlDot1)) {
    //    path = path.replace(regUrlDot1, ""); // parse ./
    //}


    return path;
}

PfsParser.prototype.logCmd = function (cmd) {
    this.previousCommand = cmd;
    this.commandHistory.push(this.previousCommand);

}

PfsParser.prototype.parseCmd = function (cmd) {
    //check || && << >>

    this.logCmd(cmd);
    var cmdS = cmd.split(" ");
    var exec = cmdS.shift();
    console.log(" ");
    console.log(USER_PREFIX + cmd);
    if (!allowedCmd.includes(exec)) {
        throw "wtf are you typing? I've to say \"hzytql\"!"
    }
    var execFunction = "penguin_" + exec;
    eval(execFunction + ".apply(this, cmdS);")


}

PfsParser.prototype.pfsValid = function (targetPath, targetName) {
    if (!targetName) {
        return (!PenguinStorage.getItem(targetPath) ||
            !PenguinStorage.getItem(targetPath).match(regIsDir))
            ? false : true;
    } else {
        if (!PenguinStorage.getItem(targetPath) ||
            !PenguinStorage.getItem(targetPath).match(regIsDir)) {
            return false;
        } else {
            if (targetPath !== "/") {
                return (PenguinStorage.getItem(targetPath + "/" + targetName)) ? true : false;
            } else {
                return (PenguinStorage.getItem(targetPath + targetName)) ? true : false;
            }
        }
    }
}

function pfsRmFromSuperDir(path, filename) {
    var superDir = pfsParser.parseObj(path);
    var index = superDir.fileContent.indexOf(filename);
    if (index >= 0) {
        superDir.fileContent.splice(index, 1);
        superDir.pfsUpdate();
    }
}


function PfsLog() {

}

/**
 * Constructor
 * @param {*} fileId 
 * @param {*} filePath 
 * @param {*} fileName 
 * @param {*} fileType 
 * @param {*} createTime 
 * @param {*} belongTo 
 * @param {*} permisson 
 */
function PenguinFile(
    filePath, fileName, fileType, belongTo, permisson) {

    this.fileContent = null;
    this.filePath = filePath;
    this.fileName = fileName;
    this.fileType = fileType;
    this.createTime = Date.now();
    this.modifiedTime = this.createTime;
    this.belongTo = belongTo;
    this.permisson = permisson;
    if (filePath !== "/") {
        this.fileId = this.filePath + "/" + this.fileName;
    } else {
        this.fileId = this.filePath + this.fileName;
    }

}
/**
 * @param {String} propertyName
 */
PenguinFile.prototype.getProperty = function (propertyName) {
    return this[propertyName];
}
PenguinFile.prototype.getName = function () {
    return this.fileName;
}
PenguinFile.prototype.getPrefixName = function () {
    return this.fileName.split(".")[0];
}
PenguinFile.prototype.getSuffixName = function (num) {
    if (!arguments[0]) {
        id = -1;
    } else {
        id = num;
    }
    var x = this.fileName.split(".");
    return x[x.length + id];
}
PenguinFile.prototype.pfsUpdate = function () {
    if (!PenguinStorage.getItem(this.fileId)) {
        PenguinStorage.setItem(this.fileId, JSON.stringify(this));
    } else {
        PenguinStorage.setItem(this.fileId, JSON.stringify(this));
        this.modifiedTime = Date.now();
    }
}


function PenguinDir(
    filePath, fileName,
    belongTo, permisson) {
    PenguinFile.call(this, filePath, fileName);
    this.fileType = "Directory";
    this.superDir = filePath;
    this.fileContent = [];
}
inheritPrototype(PenguinDir, PenguinFile);

function PenguinLink(
    filePath, fileName,
    belongTo, permisson) {
    PenguinFile.call(this, filePath, fileName);
    this, linkTo = null;
    this.fileType = "Link";
    this.superDir = filePath;
    this.fileContent = [];
}
inheritPrototype(PenguinLink, PenguinFile);



/**
 * Commands
 */

function penguin_touch(url) {
    var fileName = url.match(regUrlFilename)[0];
    var targetPath = (url.match(regUrlPath)) ? pfsParser.parsePath(url.match(regUrlPath)[0]) : null;
    targetPath = pfsParser.parsePath(targetPath);
    if (!targetPath) {
        targetPath = workingDir;
    }
    if (!PenguinStorage.getItem(targetPath) || !PenguinStorage.getItem(targetPath).match(regIsDir)) {
        throw "touch: cannot touch ‘" + targetPath + fileName + "’: No such file or directory";
    }
    if (!PenguinStorage.getItem(targetPath + fileName)) {
        if (pfsMemBuffer.length === 0) {
            pfsMemBuffer[0] = new PenguinFile(targetPath, fileName, "text");
        } else {
            pfsMemBuffer[pfsMemBuffer.length] = new PenguinFile(targetPath, fileName, "text");
        }
        pfsMemBuffer[pfsMemBuffer.length - 1].pfsUpdate();
        var superDir = pfsParser.parseObj(targetPath);
        superDir.fileContent.push(fileName);
        superDir.pfsUpdate();
    }
}

function penguin_mkdir(url) {
    var dirName = url.match(regUrlFilename)[0];
    var targetPath = (url.match(regUrlPath)) ? pfsParser.parsePath(url.match(regUrlPath)[0]) : null;
    if (!targetPath) {
        targetPath = workingDir;
    }
    if (!PenguinStorage.getItem(targetPath) || !PenguinStorage.getItem(targetPath).match(regIsDir)) {
        throw "mkdir: cannot create directory ‘" + targetPath + dirName + "’: No such file or directory";
    }
    if (!PenguinStorage.getItem(targetPath + dirName)) {
        if (pfsMemBuffer.length === 0) {
            pfsMemBuffer[0] = new PenguinDir(targetPath, dirName);
        } else {
            pfsMemBuffer[pfsMemBuffer.length] = new PenguinDir(targetPath, dirName);
        }
        pfsMemBuffer[pfsMemBuffer.length - 1].pfsUpdate();
        var superDir = pfsParser.parseObj(targetPath);
        superDir.fileContent.push(dirName);
        superDir.pfsUpdate();
    }
}

function penguin_ls(targetPath) {
    targetPath = pfsParser.parsePath(targetPath);
    if (!targetPath) {
        targetPath = workingDir;
    }
    if (!PenguinStorage.getItem(targetPath) || !PenguinStorage.getItem(targetPath).match(regIsDir)) {
        throw "ls: cannot access ‘" + targetPath + "’: No such file or directory";
    } else {
        var dir = pfsParser.parseObj(targetPath);
        if (dir.fileContent.length !== 0) {
            var i = 0, temp = [];
            dir.fileContent.forEach(function (value, index) {
                if (workingDir !== "/") {
                    temp[i++] = pfsParser.parseObj(targetPath + "/" + value);
                } else {
                    temp[i++] = pfsParser.parseObj(targetPath + value);
                }
                if (temp[i - 1]) {
                    console.log(temp[i - 1].fileName);
                }

            })

            return temp;
        }
    }
}

function penguin_cd(targetPath) {
    targetPath = pfsParser.parsePath(targetPath);
    if (!targetPath) {
        targetPath = workingDir;
    }
    if (targetPath[0] !== "/") {
        if (workingDir !== "/") {
            targetPath = workingDir + "/" + targetPath;
        } else {
            targetPath = workingDir + targetPath;
        }
    }
    //if (!PenguinStorage.getItem(targetPath) || !PenguinStorage.getItem(targetPath).match(regIsDir)) {
    if (!pfsParser.pfsValid(targetPath)) {
        throw "cd: cannot access ‘" + targetPath + "’: No such file or directory";
    } else {
        workingDir = targetPath;
    }
}

function penguin_pwd() {
    console.log(workingDir);
    return workingDir;
}

function penguin_cat(url) {
    var fileName = url.match(regUrlFilename)[0];
    var targetPath = (url.match(regUrlPath)) ? pfsParser.parsePath(url.match(regUrlPath)[0]) : null;
    if (!targetPath) {
        targetPath = workingDir;
    }
    if (!pfsParser.pfsValid(targetPath, fileName)) {
        throw "cat: cannot access ‘" + targetPath + "’: No such file or dircetory";
    }

    var file;
    if (targetPath !== "/") {
        file = pfsParser.parseObj(targetPath + "/" + fileName);
    } else {
        file = pfsParser.parseObj(targetPath + fileName);
    }

    if (file.fileType === "Directory") {
        throw "cat: " + file.fileName + ": Is a directory";
    }

    if (file.fileContent === null) {
        return "";
    } else {
        console.log(file.fileContent);
        return file.fileContent;
    }
}

function penguin_rm(url, parameter) {
    var fileName = url.match(regUrlFilename)[0];
    var targetPath = (url.match(regUrlPath)) ? pfsParser.parsePath(url.match(regUrlPath)[0]) : null;
    targetPath = pfsParser.parsePath(targetPath);
    if (!targetPath) {
        targetPath = workingDir;
    }
    if (!pfsParser.pfsValid(targetPath, fileName)) {
        throw "rm: cannot access ‘" + targetPath + "’: No such file or dircetory";
    }

    var item, file;
    if (targetPath !== "/") {
        item = targetPath + "/" + fileName;
    } else {
        item = targetPath + fileName;
    }

    file = pfsParser.parseObj(item);

    if (arguments[1] == "-r") {
        if (file.fileType === "Directory" && file.fileContent) {
            file.fileContent.forEach(function (value, index) {
                var childItem = item + "/" + value;
                var childObj = pfsParser.parseObj(childItem);
                penguin_rm(childItem, "-r");
            });
        }
        console.log(item);
        PenguinStorage.removeItem(item);
        pfsRmFromSuperDir(targetPath, fileName);

    } else if (!arguments[1]) {
        if (file.fileType === "Directory" && file.fileContent.length !== 0) {
            console.log("rm: " + file.fileName + ": Directory is not empty");
        } else {
            PenguinStorage.removeItem(item);
            pfsRmFromSuperDir(targetPath, fileName);
        }
    }


}

function penguin_echo(str) {
    console.log(str);
    return str;
}

function penguin_mv(urlSource, urlTarget, para) {
    var sourceName = urlSource.match(regUrlFilename)[0];
    var sourcePath = (urlSource.match(regUrlPath)) ? pfsParser.parsePath(urlSource.match(regUrlPath)[0]) : null;
    var targetName = urlTarget.match(regUrlFilename)[0];
    var targetPath = (urlTarget.match(regUrlPath)) ? pfsParser.parsePath(urlTarget.match(regUrlPath)[0]) : null;

    if (!sourcePath) { sourcePath = workingDir };
    if (!targetPath) { targetPath = workingDir };

    if (!pfsParser.pfsValid(sourcePath, sourceName)) {
        throw "mv: cannot access ‘" + sourcePath + "’: No such file or directory";
    }
    if (!pfsParser.pfsValid(targetPath)) {
        throw "mv: cannot access ‘" + targetPath + "’: No such file or directory";
    }

    var item, file;
    var fileName = (targetName) ? targetName : sourceName;
    if (sourcePath !== "/") {
        item = sourcePath + "/" + sourceName;
    } else {
        item = sourcePath + sourceName;
    }
    file = pfsParser.parseObj(item);
    file.fileName = fileName;

    file.filePath = targetPath;
    var superDir = pfsParser.parseObj(sourcePath);
    var index = superDir.fileContent.indexOf(sourceName);
    superDir.fileContent.splice(index);
    superDir.pfsUpdate();
    var superDir = pfsParser.parseObj(targetPath);
    superDir.fileContent.push(fileName);
    superDir.pfsUpdate();

    file.pfsIdGen();
    file.pfsUpdate();
    PenguinStorage.removeItem(item);
}

function penguin_cp(urlSource, urlTarget, para) {
    var sourceName = urlSource.match(regUrlFilename)[0];
    var sourcePath = (urlSource.match(regUrlPath)) ? pfsParser.parsePath(urlSource.match(regUrlPath)[0]) : null;
    var targetName = urlTarget.match(regUrlFilename)[0];
    var targetPath = (urlTarget.match(regUrlPath)) ? pfsParser.parsePath(urlTarget.match(regUrlPath)[0]) : null;
    targetPath = pfsParser.parsePath(targetPath);

    if (!sourcePath) { sourcePath = workingDir };
    if (!targetPath) { targetPath = workingDir };

    if (!pfsParser.pfsValid(sourcePath, sourceName)) {
        throw "mv: cannot access ‘" + sourcePath + "’: No such file or directory";
    }
    if (!pfsParser.pfsValid(targetPath)) {
        throw "mv: cannot access ‘" + targetPath + "’: No such file or directory";
    }
    var item, file;
    var fileName = (targetName) ? targetName : sourceName;
    if (sourcePath !== "/") {
        item = sourcePath + "/" + sourceName;
    } else {
        item = sourcePath + sourceName;
    }
    file = pfsParser.parseObj(item);
    file.fileName = fileName;

    file.filePath = targetPath;
    var superDir = pfsParser.parseObj(targetPath);
    superDir.fileContent.push(fileName);
    superDir.pfsUpdate();

    file.pfsIdGen();
    file.pfsUpdate();
}

// Initalize LocalStorage
var PenguinStorage = localStorage;
var pfsParser = new PfsParser();
function pfsInit() {
    //PenguinStorage.clear();
    if (PenguinStorage.length !== 0) {
        console.log("A LocalStorage exists.");
    } else {
        var tempRoot = new PenguinDir("/", "");
        tempRoot.pfsUpdate();
        penguin_mkdir(workingDir + "bin");
        penguin_mkdir(workingDir + "usr");
        penguin_mkdir(workingDir + "dev");
        penguin_mkdir("/usr/share");
        penguin_touch("/usr/lhx.tql");
        penguin_touch("/usr/share/hzy.tql");

    }

    console.log("Initalizing...");



    console.log("Loading Obejects From System...");
    for (var i = 0; i < PenguinStorage.length; i++) {
        //pfsInMem[i] = JSON.parse(PenguinStorage.getItem(PenguinStorage.key(i)));
        pfsInMem[i] = pfsParser.parseObj(PenguinStorage.key(i));
    }
    console.log("Obejects Loaded");
}





/**
 * testing code
 */