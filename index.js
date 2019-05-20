/**
 * @param {Array} collection
 * @params {Function[]} – Функции для запроса
 * @returns {Array}
 */
function query(collection) {
    var args = [].slice.call(arguments, 1);
    var collectionCopy = cloneCollection(collection);

    if (args.lenght === 0) {
        return collectionCopy;
    }

    args.sort(function(_1, _2) { return _1.name > _2.name; });

    return args.reduce(function(result, operation) {
        return operation(result);
    }, collectionCopy);
}

/**
 * @params {String[]}
 */
function select() {
    // Несколько операций 'select' должны отработать как одна с пересечёнными аргументами. 
    // Например, если мы выбираем поля a и b, а затем b и c, 
    // то в результате должно выбраться только поле b.
    var fileds = [].slice.call(arguments);

    return function selectOper(collection) {
        return collection.map(function(item) {
            return cloneItem(item, fileds);
        });
    }
}

/**
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Массив разрешённых значений
 */
function filterIn(property, values) {
    // return ['filterIn', values];
    return function filterOper(collection) {
        return collection.filter(function(item) {
            var value = item[property];
            return values.indexOf(value) > -1;
        });
    };
}

function cloneCollection(collection) {
    return collection.map(function(item) {
        var properties = Object.keys(item);
        return cloneItem(item, properties);
    });
}

function cloneItem(item, properties) {
    var newItem = {};

    // Копируем каждый ключ элемента в новый элемент
    for (var i = 0; i < properties.length; i++) {
        var property = properties[i];

        if (item.hasOwnProperty(property)) {
            newItem[property] = item[property];
        }
    }
    return newItem;
}

module.exports = {
    query: query,
    select: select,
    filterIn: filterIn
};