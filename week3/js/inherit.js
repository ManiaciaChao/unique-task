function inheritPrototype(subType, superType) {
    let prototype = Object.create(superType.prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
}

function Father(name, age, sex) {
    this.name = name;
    this.age = age;
    this.sex = sex;
    if (typeof this.sayName !== "function") {
        arguments.callee.prototype.sayName = function () {
            alert(Father.name);
        }
    }
}

function Son(name, age, sex, SuperType) {
    Father.call(this, name, age, sex); //仅调用一次
    this.father = father;
}



inheritPrototype(Son, Father);