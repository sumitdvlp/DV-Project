var pageIndex = 0;
var currentJSON ;

function searchData() {
    let queryItem = $("#txtSearchItem").val();
    executeSearch(queryItem);
}

function updateAndPopulateList(data) {
    populateList(data);
    // updateMetaData(data.hits.hits, populateList);
}

//Abhishek
function executeSearch(query) {
    getAggPriceHistogram(createColumnChart, query);
    searchMetaData(updateAndPopulateList, query);
    clearPrice();
}

//Pranav
function populateList(data) {
    //For debugging
    console.log(data);
    $("#bookPanel").empty();
    data_list = [];
    json_data = JSON.stringify(data);
    json_parser = JSON.parse(json_data);
    parsed_data = json_parser["hits"]["hits"];
    currentJSON = parsed_data;
        // Convert data into json and parse information
        for(var i in parsed_data){
            json_data = JSON.stringify(parsed_data[i]);
            json_parser = JSON.parse(json_data);
            data_list.push(json_parser["_source"]["imUrl"]);
        }

        $("#TestCollapse").empty();
        var delaycounter = 0;
        var id_array = [];
        var temp = "<div class='container'><div class='row'><div class='col-sm-1'></div>";
        for(var i=0; i<5;i++)
        {
            json_data = JSON.stringify(parsed_data[i]);
            json_parser = JSON.parse(json_data);
            delaycounter += 0.1;
            temp = temp + "<div class='col-sm-2'><img src="+data_list[i]+" data-json="+json_parser["_source"]["asin"]+" data-toggle='modal' data-target='#myModal' style='animation-delay: "+delaycounter+"s;' " +
            "class='img-rounded animated bounceInRight bookpopover ModalBook' data-title='"+json_parser["_source"]["title"]+"'  data-placement='top' title='"+json_parser["_source"]["title"]+"' height='100' width='100'></div>";
            id_array.push(json_parser["_source"]["asin"]);
        }

        temp = temp  + "<div class='col-sm-12 shelf' style='margin-bottom: 30px'></div><div class='col-sm-1'></div>";
        for(var i=5; i<10;i++)
        {
            json_data = JSON.stringify(parsed_data[i]);
            json_parser = JSON.parse(json_data);
            delaycounter += 0.1;
            temp = temp + "<div class='col-sm-2'><img src="+data_list[i]+" data-json="+json_parser["_source"]["asin"]+" data-toggle='modal' data-target='#myModal' style='animation-delay: "+delaycounter+"s;' " +
            "class='img-rounded animated bounceInRight bookpopover ModalBook' data-title='"+json_parser["_source"]["title"]+"'  data-placement='top' title='"+json_parser["_source"]["title"]+"' height='100' width='100'></div>";
            id_array.push(json_parser["_source"]["asin"]);
        }
        temp = temp + "<div class='col-sm-12 shelf'></div></div></div>";
        $("#TestCollapse").append(temp);

        $('.bookpopover').popover({ html: true, trigger: "hover" });

        for(var i in id_array)
        {
            var temp2 = [];
            json_data = JSON.stringify(parsed_data[i]);
            json_parser = JSON.parse(json_data);
            temp2.push(json_parser["_source"]["review_pos"]);
            temp2.push(json_parser["_source"]["review_neu"]);
            temp2.push(json_parser["_source"]["review_neg"]);
            //Add graph to the books panel
            try{
                //loadColumnChart(12, temp2);
                //createPieChart(id_array[i], [0.62, 0.12, 0.26]);
            }
            catch(err){console.log(err);}
        }

    $(".ModalBook").click(getModalData);

}

function getModalData(){

    var test = $(this).attr("data-json");
    let selected;
    // Get the current JSON source
    for(var i in currentJSON)
    {
        json_data = JSON.stringify(currentJSON[i]);
        json_parser = JSON.parse(json_data);
        if(String(json_parser["_source"]["asin"]) === test)
        {
            selected = json_parser["_source"];
            break;
        }
    }

    populateModal(selected);
}

function populateModal(selected) {
    try{
        getFullMetaDataByAsins(selected, '#networkGraph');
        getReviewDataByAsin(selected["asin"], populateReviewTab);
    }
    catch(err){console.log(err);}
    $(".modal-header #BookTitle").text(selected['title']);
}

//Abhishek
function getQuery() {
    return $("#txtSearchItem").val() || null;
}

//Laveesh
function getPrice() {
    let price = $('#priceState').val() || null;
    return price ? price.split(",") : null;
}


function getNext() {
    pageIndex += 10;
    searchMetaData(updateAndPopulateList, getQuery(), getPrice(), pageIndex);
}

function getPrev() {
    if (pageIndex != 0) {
        pageIndex -= 10;
        searchMetaData(updateAndPopulateList, getQuery(), getPrice(), pageIndex);
    }
}

function clearPrice() {
    $('#priceState').val("");
}

function populateReviewTab(data) {
    $("#wordCloud").empty();

    if(data.hits.total === 0){
        //Do not show review tab in
        $('#pieChart').hide();

        //Add description

        return;
    }

    let buckets = data.aggregations.polarities.buckets;
    let sum = 0;
    let aggs = {};

    buckets.forEach(row => {
        sum += row['doc_count'];
        aggs[row['key']] = row['doc_count'];
    });
    createPieChart('pieChart', [aggs[1]/sum*100, aggs[0]/sum*100, aggs[-1]/sum*100]);

    let words = new Set();
    data.hits.hits.forEach(row => {
        let source = row['_source'];
        source['summary'].removeStopWords().split(" ").forEach(word => words.add(word));
    });

    createWordCloud('#wordCloud', Array.from(words).map(word => {return {word: word}}));
}