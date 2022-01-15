window.onload = function () {
    const maxValueGraph = 50, lengthGraph = 12;
    const labelGraph = 'label', idGraph = '#chartContainer', typeGraph = 'bars';
    const graphLabelsX = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
    const maxValuePie = 50, lengthPie = 3;
    const namePie = 'name', idPie = '#pieContainer', typePie = 'pie';
    const pieNamesX = ["Data1", "Data2", "Data3"];
    const pieColors = ["#186AA5", "#0FA8E2", "#98E3FE"]

    const pathGetData = 'getData', pathGetServerData = 'getServerData';
    let graphOptions = {
        animationEnabled: true,
        theme: "light2",
        axisY: {		       
			gridDashType: "dot",
			gridThickness: 2,
            gridColor: "#186AA5",
            labelFontColor: "#186AA5"
		},
        axisX: {		       
			lineDashType: "dot",
			lineThickness: 2,
            gridColor: "#186AA5",
            labelFontColor: "#186AA5"
		},

        data: [{
                // Change type to "doughnut", "line", "splineArea", etc.
                color: "#186AA5",
               
                type: "column",
                dataPoints: []
        }]
    };

    
    let pieOptions = {
        animationEnabled: true,
        legend:{
            horizontalAlign: "left",
            verticalAlign: "center"
        },
        data: [{
            type: "pie",
            showInLegend: true,
            toolTipContent: "<b>{name}</b>: ${y} (#percent%)",
            indexLabel: "{name}",
            legendText: "{name}",
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

    let isBtnClicked = false;

    let randomBtn = document.getElementById("random-btn");
    randomBtn.addEventListener("click", randomBtnClick, false);

    let serverBtn = document.getElementById("server-btn");
    serverBtn.addEventListener("click", serverBtnClick, false);

    let nodeBtn = document.getElementById("node-btn");
    nodeBtn.addEventListener("click", nodeBtnClick, false);

 

    async function serverBtnClick() {
        if (isBtnClicked) return;
        isBtnClicked = true;

        await updateChartsByNodeAndExternalServer(pathGetServerData);

        isBtnClicked = false;
    }

    async function nodeBtnClick() {
        if (isBtnClicked) return;
        isBtnClicked = true;

        await updateChartsByNodeAndExternalServer(pathGetData);

        isBtnClicked = false;
    }

    function randomBtnClick() {
        if (isBtnClicked) return;
        isBtnClicked = true;

        updateChartsByRandom();

        isBtnClicked = false;
    }
 
    async function updateChartsByNodeAndExternalServer(path) {
        await $.ajax({
            url:`http://localhost:3002/diagramData/${path}`,
            type:"GET",
            dataType:"json",   
            contentType:"application/json; charset=utf-8",    
            success: function(res) {
                let typeDiagram, diagramOptions, diagramXName, idDiagram;
                if (isGraphSelected) {
                    typeDiagram = typeGraph;
                    diagramOptions = graphOptions;
                    diagramXName = labelGraph;
                    idDiagram = idGraph;
                } else {
                    typeDiagram = typePie;
                    diagramOptions = pieOptions;
                    diagramXName = namePie;
                    idDiagram = idPie;
                }
                diagramOptions.data[0].dataPoints = [];

                let objectResData = res.data[typeDiagram];
                let index = 0;
                for (let key in objectResData) {
                    let obj = {};
                    obj[`${diagramXName}`] = key;
                    if (!isGraphSelected)
                        obj.color = pieColors[index];
                    obj.y = objectResData[key];
                    diagramOptions.data[0].dataPoints.push(obj);
                    index++;
                }

                $(idDiagram).CanvasJSChart().render();
            },
            error: function(jqXHR,textStatus,errorThrown) {
               alert("You can not send Cross Domain AJAX requests: " + errorThrown);
            }
        });
    }

    function updateChartsByRandom() {
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
            let obj = {};
            obj[`${diagramXName}`] = diagramX[index];
            if (!isGraphSelected)
                obj.color = pieColors[index];
            obj.y = value;
            diagramOptions.data[0].dataPoints.push(obj);
        });

        $(idDiagram).CanvasJSChart().render();
    }
    
    $(idGraph).CanvasJSChart(graphOptions);
    $(idPie).CanvasJSChart(pieOptions);
    updateChartsByRandom();

}