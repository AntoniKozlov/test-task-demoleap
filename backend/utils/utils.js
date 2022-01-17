
generateRandomValues = (lengthDiagram, maxValueDiagram) => {
    return Array.from({length: lengthDiagram}, () => Math.floor(Math.random() * maxValueDiagram));
}

addRandomValues = (data, diagramLabelsX, arrValues) => {
    diagramLabelsX.forEach((value, index) => {
        data[value] = arrValues[index];
    });
    return data;
}

module.exports = { generateRandomValues, addRandomValues }