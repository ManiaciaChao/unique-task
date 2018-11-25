let curLineInput = null;
let keyHandler, caret;
const consoleLog = document.querySelector(".console__log-container");
window.onload = () => {
    initialize();
    pfsInit();
};

class IOHandler {
    constructor() {
        this.input = new Array();
        this.output = new Array();
    }
    fetchInput() {
        return this.input.pop();
    }
    doInput(i) {
        this.input.push(i);
    }
    fetchOutput() {
        return this.output.pop();
    }
}

class KeyHandler {
    constructor() {
        this.inputCount = 0;
    }
    add() {
        this.inputCount += 1;
    }
    del() {
        if (this.inputCount > 0) { this.inputCount -= 1; }
    }
}

class Caret {
    constructor(caretDiv) {
        this.caretPos = null;
        this.node = caretDiv;
        this.init();
    }
    init() {
        this.node.innerText = "_";
        this.caretPos = 0;
        this.historyIndex = pfsParser.commandHistory.length - 1;
    }
    left() {
        if (this.caretPos > 0) {
            this.caretPos -= 1;
            this.node.innerText = this.node.innerText.slice(1);

        }
    }
    right(keyH) {
        if (this.caretPos < keyH.inputCount) {
            this.caretPos += 1;
            this.node.innerText = ' '.concat(this.node.innerText);
        }
    }
    up() {
        if (this.historyIndex > 0) {
            curLineInput.innerHTML = pfsParser.commandHistory[this.historyIndex--];
        } else if (this.historyIndex === 0) {
            curLineInput.innerHTML = pfsParser.commandHistory[this.historyIndex];
        }
    }
    down() {
        if (this.historyIndex < pfsParser.commandHistory.length - 1) {
            curLineInput.innerHTML = pfsParser.commandHistory[this.historyIndex++];
        } else if (this.historyIndex === pfsParser.commandHistory.length - 1) {
            curLineInput.innerHTML = pfsParser.commandHistory[this.historyIndex];
        }
    }
    enter() {
        pfsParser.parseCmd(curLineInput.innerHTML);
        setTimeout(function () { console.warn(curLineInput.innerHTML); }, 0);
        setTimeout(function () { curLineInput.innerHTML = ''; }, 0); //wtf

        this.init();
    }
}

function initialize() {
    console.warn("Initializing...");
    keyHandler = new KeyHandler();
    caret = new Caret(document.querySelector(".console__current-line--caret"));
    curLineInput = document.querySelector(".console__current-line--input");
    curLineInput.focus();
    // event registers
    window.addEventListener('click', () => { curLineInput.focus() });
    window.addEventListener('keydown', (event) => {
        parseKey(event);
        //console.log(event.key);
    });
}

function parseKey(event) {
    var key = event.key
    if (key === "Backspace") {
        keyHandler.del();
        caret.left();
    } else if (key === "ArrowLeft") {
        caret.left();
    } else if (key === "ArrowRight") {
        caret.right(keyHandler);
    } else if (key === "ArrowUp") {
        caret.up();
    } else if (key === "ArrowDown") {
        caret.down(keyHandler);
    } else if (key === "Enter") {
        event.preventDefault();
        caret.enter();
    } else if (key === "Tab") {
        event.preventDefault();
    } else if (/^[\x20-\x7e]$/g.test(key)) {
        keyHandler.add();
        caret.right(keyHandler);
    }
}

function createLog(str) {
    var logDiv = document.createElement("div");
    var logContent = document.createTextNode(str);
    logDiv.appendChild(logContent);
    logDiv.classList.add("console__log-line");
    consoleLog.appendChild(logDiv);
}

console.logOrigin = console.log;
console.log = function (str) {
    console.logOrigin(str);
    createLog(str);
};