window.onload = () => {
    const maxValueGraph = 50, lengthGraph = 12;
    const labelGraph = 'label', graphId = '#chartContainer', graphType = 'bars';
    const graphLabelsX = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
    const maxValuePie = 50, lengthPie = 3;
    const pieName = 'name', pieId = '#pieContainer', pieType = 'pie';
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
    
    $('#graph').click(function() {
        $('#pie').removeClass('chart-active');
        $('#chartContainer').removeClass('inactive');
        $('#pieContainer').addClass('inactive');
        $(this).addClass('chart-active');

        $(graphId).CanvasJSChart().render();
    });

    $('#pie').click(function() {
        $('#graph').removeClass('chart-active');
        $('#pieContainer').removeClass('inactive');
        $('#chartContainer').addClass('inactive');
        $(this).addClass('chart-active');

        $(pieId).CanvasJSChart().render();
    });

    let isLoadingData = false;

    $('#random-btn').click((el) => {
        randomBtnClick(el);
    });

    $('#server-btn').click((el) => {
        serverBtnClick(el);
    });

    $('#node-btn').click((el) => {
        nodeBtnClick(el);
    });

    serverBtnClick = async (el) => {
        await updateChartsByNodeAndExternalServer(el.currentTarget, pathGetServerData);
    }

    nodeBtnClick = async (el) => {
        await updateChartsByNodeAndExternalServer(el.currentTarget, pathGetData); 
    }

    randomBtnClick = (el) => {
        updateChartsByRandom(el.currentTarget);
    }
 
    updateChartsByNodeAndExternalServer = async (el, path) => {
        if (isLoadingData) return;
        isLoadingData = true;
        $(el).addClass('disable-btn');

        try {
            await $.ajax({
                url:`http://localhost:3002/diagramData/${path}`,
                type:"GET",
                dataType:"json",   
                contentType:"application/json; charset=utf-8",    
                success: (res) => {

                    updateDiagramWithServerData(graphOptions, labelGraph, graphId, res, graphType);

                    updateDiagramWithServerData(pieOptions, pieName, pieId, res, pieType);

                },
                error: (errorThrown) => {
                    console.log(errorThrown);
                    alert("You can not send Cross Domain AJAX requests");
                }
            });
        } catch (err) {
            console.log(err);
        }

        isLoadingData = false;
        $(el).removeClass('disable-btn');
    }

    updateChartsByRandom = (el) => {
        if (isLoadingData) return;
        isLoadingData = true;
        
        $(el).addClass('disable-btn');

        try {

            updateDiagramWithLocalData(lengthGraph, labelGraph, graphLabelsX, maxValueGraph, graphId, graphOptions, graphType);

            updateDiagramWithLocalData(lengthPie, pieName, pieNamesX, maxValuePie, pieId, pieOptions, pieType);
            
        } catch (err) {
            console.log(err);
        }

        isLoadingData = false;
        $(el).removeClass('disable-btn');
    }
    
    generateRandomValues = (lengthDiagram, maxValueDiagram) => {
        return Array.from({length: lengthDiagram}, () => Math.floor(Math.random() * maxValueDiagram));
    }
    
    updateDiagramWithLocalData = (lengthDiagram, diagramXName, diagramX, maxValueDiagram, diagramId, diagramOptions, diagramType) => {
        let diagramValues = generateRandomValues(lengthDiagram, maxValueDiagram);

        addRandomValues(diagramValues, diagramXName, diagramX, diagramOptions, diagramType);

        $(diagramId).CanvasJSChart().render();
    }

    updateDiagramWithServerData = (diagramOptions, diagramXName, diagramId, res, diagramType) => {
        let diagramResData = res.data[diagramType];

        addValuesFromServerObject(diagramResData, diagramXName, diagramOptions, diagramType);

        $(diagramId).CanvasJSChart().render();
    }

    addRandomValues = (diagramValues, diagramXName, diagramX, diagramOptions, diagramType) => {
        diagramOptions.data[0].dataPoints = [];

        diagramValues.forEach((value, index) => {
            let obj = {};
            obj[`${diagramXName}`] = diagramX[index];
            if (diagramType === pieType) {
                obj.color = pieColors[index];
            }
               
            obj.y = value;
            diagramOptions.data[0].dataPoints.push(obj);
        });
    }
    
    addValuesFromServerObject = (objectResData, diagramXName, diagramOptions, diagramType) => {
        diagramOptions.data[0].dataPoints = [];

        let index = 0;
        for (let key in objectResData) {
            let obj = {};
            obj[`${diagramXName}`] = key;
            if (diagramType === pieType)
                obj.color = pieColors[index];
            obj.y = objectResData[key];
            diagramOptions.data[0].dataPoints.push(obj);
            index++;
        }
    }

    $(graphId).CanvasJSChart(graphOptions);
    $(pieId).CanvasJSChart(pieOptions);
    updateChartsByRandom();

}