exports.compareKeys = function (incomingObject, interfaceObject) {
    const incomingObjectKeys = Object.keys(incomingObject).sort();
    const interfaceObjectKeys = Object.keys(interfaceObject).sort();
    console.log(JSON.stringify(incomingObjectKeys), JSON.stringify(interfaceObjectKeys));
    return JSON.stringify(incomingObjectKeys) === JSON.stringify(interfaceObjectKeys);
}