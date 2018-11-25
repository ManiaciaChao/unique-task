/**
 * @description Try to define a constant in es5
 * @param {string} name Property Name
 * @param {*} value Property Value
 */
function defConst(pName, pValue) {
    Object.defineProperty(this, pName, { writable: false, configurable: false, value: pValue });
}

defConst("PENDING", 0);
defConst("FULFILLED", 1);
defConst("REJECTED", 2);

function myPromise(fn) {
    this._state = PENDING;
    this._value = null;
    this._reason = null;
    this._successHandlers = [];
    this._failHandlers = [];
    fn(this.resolve.bind(this), this.reject.bind(this));

}

myPromise.prototype.reject = function (error) {
    var self = this;
    if (this._state == PENDING) {
        console.log("Rejecting;")
        this._state = REJECTED;
        this._value = error;
        setTimeout(function () {
            console.log(self._failHandlers);
            var tmp = self._failHandlers.pop();
            tmp(self._value);
        }, 0);
    }
}
myPromise.prototype.resolve = function (result) {
    var self = this;
    if (this._state == PENDING) {
        console.log("Resolving;")
        this._state = FULFILLED;
        this._value = result;
        setTimeout(function () {
            console.log(self._successHandlers);
            var tmp = self._successHandlers.pop();
            tmp(self._value);
        }, 0);
    }
}
myPromise.prototype.then = function (successHandler, failHandler) {
    var self = this;
    return new myPromise(function (_successHandler, _failHandler) {
        function _resolve() {
            self.value = successHandler(self.value);
            _successHandler(this._value);
        }
        function _reject() {
            self.value = failHandler(self.value);
            _failHandler(this._value);
        }
        console.log(_resolve);
        self._successHandlers.push(_resolve);
        self._failHandlers.push(_reject);
    })
}

var fn = function (resolve, reject) {
    console.log('testing');
    var number = Math.random();
    if (number <= 0.5) {
        resolve('< 0.5');
    } else {
        reject('> 0.5');
    }
}

var p = new myPromise(fn);
p.then(function (data) {
    console.log('resolve: ', data);
}, function (data) {
    console.log('reject: ', data);
});