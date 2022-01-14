window.onload = function () {
    const maxValueGraph = 50, lengthGraph = 12;
    const labelGraph = 'label', idGraph = '#chartContainer';
    const graphLabelsX = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
    const maxValuePie = 50, lengthPie = 3;
    const namePie = 'name', idPie = '#pieContainer';
    const pieNamesX = ["Data1", "Data2", "Data3"];

    let graphOptions = {
        animationEnabled: true,
        data: [{
                // Change type to "doughnut", "line", "splineArea", etc.
                type: "column",
                dataPoints: []
        }]
    };

    
    let pieOptions = {
        animationEnabled: true,
        legend:{
            horizontalAlign: "right",
            verticalAlign: "center"
        },
        data: [{
            type: "pie",
            showInLegend: true,
            toolTipContent: "<b>{name}</b>: ${y} (#percent%)",
            indexLabel: "{name}",
            legendText: "{name} (#percent%)",
            indexLabelPlacement: "inside",
            dataPoints: []
        }]
    };

    let isGraphSelected = true;

    $('#graph').click(function(el) {
        isGraphSelected = true;
        
        $('#pie').removeClass('chart-active');
        $('#chartContainer').removeClass('inactive');
        $('#pieContainer').addClass('inactive');
        $(this).addClass('chart-active');
    });

    $('#pie').click(function(el) {
        isGraphSelected = false;

        $('#graph').removeClass('chart-active');
        $('#pieContainer').removeClass('inactive');
        $('#chartContainer').addClass('inactive');
        $(this).addClass('chart-active');
    });

    let randomBtn = document.getElementById("random-btn");
    randomBtn.addEventListener("click", randomBtnClick, false);

    let isRandomBtnClicked = false;

    function randomBtnClick() {
        if (isRandomBtnClicked) return;
        isRandomBtnClicked = true;

        updateCharts();

        isRandomBtnClicked = false;
    }

    function updateCharts() {
        let lengthDiagram, maxValueDiagram, diagramOptions, diagramX, diagramXName, idDiagram;
        if (isGraphSelected) {
            lengthDiagram = lengthGraph;
            maxValueDiagram = maxValueGraph;
            diagramOptions = graphOptions;
            diagramX = graphLabelsX;
            diagramXName = labelGraph;
            idDiagram = idGraph;
        } else {
            lengthDiagram = lengthPie;
            maxValueDiagram = maxValuePie;
            diagramOptions = pieOptions;
            diagramX = pieNamesX;
            diagramXName = namePie;
            idDiagram = idPie;
        }

        let arrValues = Array.from({length: lengthDiagram}, () => Math.floor(Math.random() * maxValueDiagram));

        diagramOptions.data[0].dataPoints = [];
        arrValues.forEach((value, index) => {
            diagramOptions.data[0].dataPoints.push({ diagramXName: diagramX[index],  y: value  });
        });

        $(idDiagram).CanvasJSChart().render();
    }
    
    $(idGraph).CanvasJSChart(graphOptions);
    $(idPie).CanvasJSChart(pieOptions);
    updateCharts();
}