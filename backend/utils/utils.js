
function generateRandomValues(lengthDiagram, maxValueDiagram) {
    return Array.from({length: lengthDiagram}, () => Math.floor(Math.random() * maxValueDiagram));
}

function addRandomValues(data, graphLabelsX, arrGraphValues) {
    graphLabelsX.forEach((value, index) => {
        data[value] = arrGraphValues[index];
    });
    return data;
}

module.exports = { generateRandomValues, addRandomValues }