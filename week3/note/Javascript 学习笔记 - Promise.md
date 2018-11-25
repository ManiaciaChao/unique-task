# JavaScript 学习笔记 - Promise

## 写在前面

对于我这样的小菜鸟来说，本次任务量还是不小的。不过没有掌握的东西迟早还是要去试图掌握的。比如<del>微积分</del>。

在学习`Promise`之前，首先需要了解一下什么是回调函数。根据定义：

> 被作为实参传入另一函数，并在**该外部函数内被调用，用以来完成某些任务**的函数，称为回调函数。 

多说无益，立刻写一段：

```javascript
function isString(str) {
    return (typeof str === "string") ? true : false;
}

function inputProcessor(callback) {
    let input = prompt("Input Something...");
    if (callback(input) === true) { return true; }
}

inputProcessor(isString);
```

这段代码为**同步回调**，它是**立即执行**的。

不过，回调函数经常被用于继续执行一个异步（例如AJAX）完成后的操作，它们被称为**异步回调**。

关于回调函数的部分不多赘述，看书去了。

## Promise

**Promise** 对象用于表示一个异步操作的最终状态（完成或失败），以及其返回的值。`Promise `本质上是一个**绑定了回调**的对象，而不是将回调传进函数内部。

### 为什么要使用 Promise

**`Promise `最直接的好处就是链式调用。**它可以让代码更简洁。

MDN上提供了一个简单的例子：

```javascript
// 传统的回调函数写法

// 成功的回调函数
function successCallback(result) {
  console.log("声音文件创建成功: " + result);
}

// 失败的回调函数
function failureCallback(error) {
  console.log("声音文件创建失败: " + error);
}

createAudioFileAsync(audioSettings, successCallback, failureCallback)
```

```javascript
// 新式函数返回一个你可以直接绑定回调函数的 Promise 对象，来代替旧式的函数形式
const promise = createAudioFileAsync(audioSettings); 
promise.then(successCallback, failureCallback);
```

```javascript
// 或者更简单的形式
createAudioFileAsync(audioSettings).then(successCallback, failureCallback);
```

链式调用提供了许多不可思议的用法。基于 Promise 链，连续执行多个异步操作的可以这样写：

```javascript
// 写法一
const promise = doSomething();
const promise2 = promise.then(successCallback, failureCallback);
// 写法二
const promise2 = doSomething().then(successCallback, failureCallback);
```

原因在于`then()`函数会返回一个新的`Promise`对象，每一个 `Promise `对应 Promise 链中另一个异步过程的完成。

## Promise 对象

### 属性

#### `Promise.length`

length属性，其值总是为 1 (构造器参数的数目)。

#### `Promise.prototype`

表示 `Promise` 构造器的原型。

### 方法

`Promise.all(iterable)`

`Promise.race(iterable)`

`Promise.reject(reason)`

`Promise.resolve(value)`

### 原型

#### 属性

`Promise.prototype.constructor`

#### 方法

`Promise.prototype.catch(onRejected)`

`Promise.prototype.then(onFulfilled, onRejected)`

`Promise.prototype.finally(onFinally)`