var baseUrl='https://digitalops.services.wso2.com:9092/';
//var baseUrl='https://localhost:9092/';

var sonarStartDate;
var sonarEndDate;

var sonarHistoryTitle;

var currentSonarMainChartData;

var currentSonarMainChartTitle;

var currentAreaId;
var currentProductId;
var currentCategoryId;
var currentCategory;
var sameAreaIsSelected;

var sonarMainChart;
var currentData;

function initPage() {

    var sidePaneDetails;
    $.ajax({
        type: "GET",
        url: baseUrl+'internal/product-quality/v1.0/issues/all',
        async: false,
        success: function(data){
            sidePaneDetails = data.data.items;
            currentData = data.data;
        }
    });

    currentCategory = "all";
    currentCategoryId = 0;

    sameAreaIsSelected = 0;

    loadSidePane(sidePaneDetails);

    initSonarChart();


}

function resetSonarCharts() {

    $.ajax({
        type: "GET",
        url: baseUrl+'internal/product-quality/v1.0/sonar/issues/issuetype/'+0+'/severity/'+0,
        async: false,
        data:{
            category: currentCategory,
            categoryId: currentCategoryId
        },
        success: function(data){
            currentData = data.data;
        }
    });

    initSonarChart();

}

function loadSidePane(sidePaneDetails) {

    var totalProducts = sidePaneDetails.length;

    for (var x = 0; x < totalProducts; x++) {
        document.getElementById('area').innerHTML += "<div class='panel' style='margin-top:0px; margin-bottom:-4px; font-size: 100%;'><button onclick='clickArea("+sidePaneDetails[x].id+")' data-parent='#area' href='#collapseArea"+(sidePaneDetails[x].id)+"' data-toggle='collapse' id='a"+(sidePaneDetails[x].id)+"' class='list-group-item'>"
            + sidePaneDetails[x].name        +
            "<span id='sonarCount"+(parseInt(x)+1)+"' class='badge' style='width:2.7vw; font-size: 0.75vw; background-color:#206898;padding:3px 6px;'></span>" +
            "<span id='issueCount"+(parseInt(x)+1)+"' class='badge' style='width:2.2vw; font-size: 0.75vw; background-color:#FF9933; padding:3px 6px;'></span></button>" +
            "<div id='collapseArea"+(sidePaneDetails[x].id)+"'  style='transition: all .8s ease;' class='panel-collapse collapse' role='tabpanel' aria-labelledby='headingOne'>" +
            "<div class='sidebarInside'>" +
            "<ul id='product"+(sidePaneDetails[x].id)+"' >"+
            ""+
            "</ul>"+
            "</div>" +
            "</div>" +
            "</div>"

        document.getElementById('issueCount'+(parseInt(x)+1)).innerHTML = sidePaneDetails[x].issues;
        document.getElementById('sonarCount'+(parseInt(x)+1)).innerHTML = sidePaneDetails[x].sonar;
    }
}


function resetDashboardView() {

    var sidePaneDetails;
    $.ajax({
        type: "GET",
        url: baseUrl+'internal/product-quality/v1.0/issues/all',
        async: false,
        success: function(data){

            sidePaneDetails = data.data.items;
            currentData = data.data;
        }
    });

    currentCategory = "all";
    currentCategoryId = 0;

    sameAreaIsSelected = 0;


    loadSidePane(sidePaneDetails);
    initSonarChart();
}

function clickArea(areaId){
    if(currentAreaId === areaId){
        sameAreaIsSelected = sameAreaIsSelected + 1;

        if(sameAreaIsSelected === 3){
            sameAreaIsSelected = 1;
        }

    }else{
        sameAreaIsSelected = 1;
    }

    currentCategoryId = areaId;
    currentCategory = "area";
    currentAreaId = areaId;

    var sidePaneDetails;

    if(sameAreaIsSelected === 2){
        currentCategoryId = 0;
        currentCategory = "all";

        $.ajax({
            type: "GET",
            url: baseUrl+'internal/product-quality/v1.0/issues/all/',
            async: false,
            success: function(data){
                currentData = data.data;
            }
        });

    }else{
        $.ajax({
            type: "GET",
            url: baseUrl+'internal/product-quality/v1.0/issues/area/'+ areaId,
            async: false,
            success: function(data){

                sidePaneDetails = data.data.items;
                currentData = data.data;
            }
        });


        var totalProducts = sidePaneDetails.length;

        for(var y=0;y<totalProducts;y++){
            issuecount = sidePaneDetails[y].issues;
            sonarCount = sidePaneDetails[y].sonar;

            document.getElementById('product'+(areaId)).innerHTML +=
                "<button class='btn-product list-group-item list-group-item-info' onclick='clickProduct("+(sidePaneDetails[y].id)+")' style='width:100%;text-align: left;' id='" + sidePaneDetails[y].id + "'>"+
                sidePaneDetails[y].name +
                "<span id='sonarProductCount"+areaId+(parseInt(y))+"' class='badge' style='min-width:2.7vw; font-size: 0.75vw; background-color:#206898;padding:3px 6px;'></span>" +
                "<span id='issueProductCount"+areaId+(parseInt (y))+"' class='badge' style='min-width:2.2vw; font-size: 0.75vw; background-color:#FF9933; padding:3px 6px;'></span></button>";

            document.getElementById('issueProductCount'+areaId+(parseInt(y))).innerHTML = issuecount;
            document.getElementById('sonarProductCount'+areaId+(parseInt(y))).innerHTML = sonarCount;

        }
    }
    initSonarChart();
}

function clickProduct(productId) {


    $('.btn-product').removeClass('btn-product-active').addClass('btn-product-inactive');
    $('#'+productId).removeClass('btn-product-inactive').addClass('btn-product-active');


    currentCategoryId = productId;
    currentProductId = productId;
    currentCategory = "product";

    var sidePaneDetails;
    $.ajax({
        type: "GET",
        url: baseUrl+'internal/product-quality/v1.0/issues/product/'+productId ,
        async: false,
        success: function(data){

            sidePaneDetails = data.data.items;
            currentData = data.data;
        }
    });

    initSonarChart();
}

function initSonarChart() {
    productData = currentData.items;
    mainSeriesData = [];
    totalMainIssues = 0;

    if (currentCategory !== "component"){
        if(productData.length !== 0){

            for(var i = 0; i < productData.length; i++){
                name = productData[i].name;
                id = productData[i].id;
                y = productData[i].sonar;
                totalMainIssues += y;

                mainSeriesData.push({name: name, id:id, y: y});
            }
        }


        currentSonarMainChartTitle = "Total : " + totalMainIssues;
        currentSonarMainChartData = [{
            name: "Product",
            colorByPoint: true, data: mainSeriesData
        }]



    }

    if (currentCategory === "component"){
        if(productData.length !== 0){

            for(var i = 0; i < productData.length; i++){
                name = productData[i].name;
                id = productData[i].id;
                y = productData[i].sonar;
                totalMainIssues += y;

                if (id === currentCategoryId){
                    mainSeriesData.push({name: name, id:id, y: y, color: '#118983'});
                }else{
                    mainSeriesData.push({name: name, id:id, y: y, color: '#a2a3a3'});
                }
            }

        }
        currentSonarMainChartTitle = "Total : " + totalMainIssues;
        currentSonarMainChartData = [{
            name: "Component",
            colorByPoint: true, data: mainSeriesData
        }]

    }
    createLineCoverageBar();
    createFunctionalCoverageBar();
    createLineCoverageChart();
    createFunctionalCoverageChart();
    var dateFrom = moment().subtract(29, 'days');
    var dateTo= moment();
    sonarStartDate = dateFrom.format('YYYY-MM-DD');
    sonarEndDate = dateTo.format('YYYY-MM-DD');
    getSonarTrendLineHistory("day");
}

function getSonarTrendLineHistory(period) {

    var history;
    $.ajax({
        type: "GET",
        url: baseUrl+'internal/product-quality/v1.0/sonar/issues/history/'+ currentCategory + '/' + currentCategoryId,
        data:{
            dateFrom : this.startDate,
            dateTo : this.endDate,
            period: period
        },
        async: false,
        success: function(data){
            history = data.data;
        }
    });

    historySeriesData = [];

    for(var i = 0; i < history.length; i++){
        time = history[i].date.split("+");
        name = time[0];
        y = history[i].count;
        historySeriesData.push({name: name, y: y});
    }

    createSonarTrendChart(historySeriesData);

}

function createLineCoverageBar(){
    Highcharts.chart('line-coverage-bar', {
        title: {
            text: 'Highcharts Progress Bar',
            align: 'left',
            margin: 0,
        },
        chart: {
            type: 'bar',
            height: 70,
        },
        credits: false,
        tooltip: false,
        legend: false,
        navigation: {
        buttonOptions: {
          enabled: false
        }
        },
        xAxis: {
            visible: false,
        },
        yAxis: {
            visible: false,
            min: 0,
            max: 100,
        },
        series: [{
            data: [100],
            grouping: false,
            animation: false,
            enableMouseTracking: false,
            showInLegend: false,
            color: 'red',
            pointWidth: 25,
            borderWidth: 0,
            borderRadiusTopLeft: '4px',
            borderRadiusTopRight: '4px',
            borderRadiusBottomLeft: '4px',
            borderRadiusBottomRight: '4px',
            dataLabels: {
              className: 'highlight',
              format: '150 / 600',
              enabled: true,
              align: 'right',
              style: {
                color: 'white',
                textOutline: false,
              }
            }
            }, {
            enableMouseTracking: false,
            data: [25],
            borderRadiusBottomLeft: '4px',
            borderRadiusBottomRight: '4px',
            color: 'navy',
            borderWidth: 0,
            pointWidth: 25,
            animation: {
              duration: 250,
            },
            dataLabels: {
              enabled: true,
              inside: true,
              align: 'left',
              format: '{point.y}%',
              style: {
                color: 'white',
                textOutline: false,
              }
            }
        }]
    });
}

function createFunctionalCoverageBar(){
    Highcharts.chart('functional-coverage-bar', {
        title: {
            text: 'Highcharts Progress Bar',
            align: 'left',
            margin: 0,
        },
        chart: {
            type: 'bar',
            height: 70,
        },
        credits: false,
        tooltip: false,
        legend: false,
        navigation: {
        buttonOptions: {
          enabled: false
        }
        },
        xAxis: {
            visible: false,
        },
        yAxis: {
            visible: false,
            min: 0,
            max: 100,
        },
        series: [{
            data: [100],
            grouping: false,
            animation: false,
            enableMouseTracking: false,
            showInLegend: false,
            color: 'red',
            pointWidth: 25,
            borderWidth: 0,
            borderRadiusTopLeft: '4px',
            borderRadiusTopRight: '4px',
            borderRadiusBottomLeft: '4px',
            borderRadiusBottomRight: '4px',
            dataLabels: {
              className: 'highlight',
              format: '150 / 600',
              enabled: true,
              align: 'right',
              style: {
                color: 'white',
                textOutline: false,
              }
            }
            }, {
            enableMouseTracking: false,
            data: [25],
            borderRadiusBottomLeft: '4px',
            borderRadiusBottomRight: '4px',
            color: 'navy',
            borderWidth: 0,
            pointWidth: 25,
            animation: {
              duration: 250,
            },
            dataLabels: {
              enabled: true,
              inside: true,
              align: 'left',
              format: '{point.y}%',
              style: {
                color: 'white',
                textOutline: false,
              }
            }
        }]
    });
}

function createLineCoverageChart(){
    Highcharts.chart('line-coverage-container', {
        chart: {
            type: 'bar',
            marginLeft: 150
        },
        title: {
            text: 'Most popular ideas by April 2016'
        },
        subtitle: {
            text: 'Source: <a href="https://highcharts.uservoice.com/forums/55896-highcharts-javascript-api">UserVoice</a>'
        },
        xAxis: {
            type: 'category',
            title: {
                text: null
            },
            min: 0,
            max: 4,
            scrollbar: {
                enabled: true
            },
            tickLength: 0
        },
        yAxis: {
            min: 0,
            max: 100,
            title: {
                text: 'Votes',
                align: 'high'
            }
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        series: [{
        data: [["Asha",100],
        				["Na",100],
                ["B",100],
                ["C",100],
                ["D",100],["E",100],["F",100],["G",100],["H",100]],
        grouping: false,
        animation: false,
        enableMouseTracking: false,
        showInLegend: false,
        color: 'red',
        pointWidth: 25,
        borderWidth: 0,

        dataLabels: {
          className: 'highlight',
          format: '',
          enabled: true,
          align: 'right',
          style: {
            color: 'white',
            textOutline: false,
          }
        }
      }, {
      	name:"Line-Coverage",
        enableMouseTracking: true,
        data: [["Asha",90],
        				["Na",20],
                ["B",40],["C",20],["D",30],["E",40],["F",50],["G",30],["H",10]],
        color: 'navy',
        borderWidth: 0,
        pointWidth: 25,
        animation: {
          duration: 250,
        },
        dataLabels: {
          enabled: true,
          inside: true,
          align: 'left',
          format: '{point.y}%',
          style: {
            color: 'white',
            textOutline: false,
          }
        }
      }]
    });
}

function createFunctionalCoverageChart(){
    Highcharts.chart('functional-coverage-container', {
        chart: {
            type: 'bar',
            marginLeft: 150
        },
        title: {
            text: 'Most popular ideas by April 2016'
        },
        subtitle: {
            text: 'Source: <a href="https://highcharts.uservoice.com/forums/55896-highcharts-javascript-api">UserVoice</a>'
        },
        xAxis: {
            type: 'category',
            title: {
                text: null
            },
            min: 0,
            max: 4,
            scrollbar: {
                enabled: true
            },
            tickLength: 0
        },
        yAxis: {
            min: 0,
            max: 100,
            title: {
                text: 'Votes',
                align: 'high'
            }
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        series: [{
        data: [["Asha",100],
        				["Na",100],
                ["B",100],
                ["C",100],
                ["D",100],["E",100],["F",100],["G",100],["H",100]],
        grouping: false,
        animation: false,
        enableMouseTracking: false,
        showInLegend: false,
        color: 'red',
        pointWidth: 25,
        borderWidth: 0,

        dataLabels: {
          className: 'highlight',
          format: '',
          enabled: true,
          align: 'right',
          style: {
            color: 'white',
            textOutline: false,
          }
        }
      }, {
      	name:"Line-Coverage",
        enableMouseTracking: true,
        data: [["Asha",90],
        				["Na",20],
                ["B",40],["C",20],["D",30],["E",40],["F",50],["G",30],["H",10]],
        color: 'navy',
        borderWidth: 0,
        pointWidth: 25,
        animation: {
          duration: 250,
        },
        dataLabels: {
          enabled: true,
          inside: true,
          align: 'left',
          format: '{point.y}%',
          style: {
            color: 'white',
            textOutline: false,
          }
        }
      }]
    });
}

function createSonarTrendChart(data){

    Highcharts.chart('trend-chart-container-sonar', {
        chart: {
            zoomType: 'x'
        },
        title: {
            text: ""
        },
        credits: {
            enabled: false
        },
        legend: {
                enabled: false
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            title: {
                text: 'Number of Issues'
            }
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.y}'
                }
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:0.7387508394895903vw">Sonar</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
        },
        series: [{
            type: 'line',
            data: data
        }]

    });

}

function setSonarDate(start, end) {
    sonarStartDate = start;
    sonarEndDate = end;
    sonarHistoryTitle =  startDate + " - " + endDate;
}





function loadComponentDropdown(sidePaneDetails) {
//
//    document.getElementById('componentChoice').innerHTML = "";
//    var item = document.getElementById('componentChoice');
//    var div1 = document.createElement('div');
//    div1.setAttribute("class","col-xs-2 col-md-2");
//    var headingTag = document.createElement("h5");
//    var heading = document.createTextNode("Component:");
//    headingTag.appendChild(heading);
//    div1.appendChild(headingTag);
//    item.appendChild(div1);
//
//    var div2 = document.createElement('div');
//    div2.setAttribute("class","col-xs-3 col-md-3 form-group");
//    div2.setAttribute("style","text-align: left;font-size: 0.8vw;margin:0");
//
//    var select = document.createElement('select');
//    select.setAttribute("class","form-control");
//    select.setAttribute("id","sel1");
//    select.setAttribute("style","width:20.1vw;font-size: 0.8vw;");
//
//
//    if(sidePaneDetails.length !== 0){
//        var optionAll =  document.createElement('option');
//        var all = 0;
//        var nameAll =  "All";
//
//        optionAll.setAttribute("value",all);
//        optionAll.appendChild(document.createTextNode(nameAll));
//        select.appendChild(optionAll);
//
//        var  totalComponents = sidePaneDetails.length;
//        for(var a=0; a<totalComponents; a++) {
//            var option = document.createElement('option');
//            var id =  sidePaneDetails[a].id;
//            var name =  sidePaneDetails[a].name;
//
//            option.setAttribute("value",id);
//            option.appendChild(document.createTextNode(name));
//            select.appendChild(option);
//        }
//    }
//
//
//    div2.appendChild(select);
//    item.appendChild(div2);
//
//
//    select.addEventListener('change',function(){
//        var e = document.getElementById("sel1");
//        var strUser = e.options[e.selectedIndex].value;
//
//        if(parseInt(strUser) > 0){
//            loadComponentDetails(parseInt(strUser));
//        }else{
//            clickProduct(currentProductId);
//        }
//    });


}

function loadComponentDetails(componentId) {
//
//    currentCategoryId = componentId;
//    currentCategory = "component";
//
//    $.ajax({
//        type: "GET",
//        url: baseUrl+'internal/product-quality/v1.0/issues/component/' + componentId,
//        async: false,
//        success: function(data){
//            currentData = data.data;
//        }
//    });
//
//    initSonarChart();
}

function createSonarMainChart(){
//    sonarMainChart = Highcharts.chart('main-chart-container-sonar', {
//        chart: {
//            type: 'column'
//        },
//        title: {
//            text: currentSonarMainChartTitle
//        },
//        credits: {
//            enabled: false
//        },
//        xAxis: {
//            type: 'category'
//        },
//        yAxis: {
//            title: {
//                text: 'Total Open Issues'
//            }
//        },
//        legend: {
//            enabled: false
//        },
//        plotOptions: {
//            series: {
//                borderWidth: 0,
//                dataLabels: {
//                    enabled: true,
//                    format: '{point.y}'
//                }
//            }, column: {
//                maxPointWidth: 100
//            }
//        },
//
//        tooltip: {
//            headerFormat: '<span style="font-size:0.7387508394895903vw">{series.name}</span><br>',
//            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b>'
//        },
//
//        series: currentSonarMainChartData,
//
//        exporting: {
//            enabled: true
//        }
//    });

}
