var pageIndex = 0;

function updateAndPopulateList(data) {
    populateList(data);
    // updateMetaData(data.hits.hits, populateList);
}

//Abhishek
function executeSearch(query) {
    getAggPriceHistogram(createColumnChart, query);
    searchMetaData(updateAndPopulateList, query);
}

//Pranav
function populateList(data) {
    //For debugging
    console.log(data);
    $("#bookPanel").empty();
    data_list = [];
    json_data = JSON.stringify(data);
    json_parser = JSON.parse(json_data);
    //console.log(json_parser["hits"]["hits"]);
    parsed_data = json_parser["hits"]["hits"];
        // Convert data into json and parse information
        for(var i in parsed_data){
            //console.log(parsed_data[i]);
            json_data = JSON.stringify(parsed_data[i]);
            json_parser = JSON.parse(json_data);

            // Create the UI elements according to clicked heatmap
            if(json_parser["_source"]["title"]){
            var txt1 =
                "<div class='panel panel-default animated bounceInRight'><div class='panel-heading'>"
                +json_parser["_source"]["title"]
                +"</div><div class='panel-body'>"
                +"<div class='row'><div class='col-sm-2'>"
                +"<img src="+json_parser["_source"]["imUrl"]+" class='img-rounded' height='100' width='100'>"
                +"</div><div class='col-sm-5'>"
                +"<p class='text-success'>Positive : "+json_parser["_source"]["review_pos"]+"</p>\n" +
                " <p class='text-info'>Neutral : "+json_parser["_source"]["review_neu"]+"</p>\n" +
                " <p class='text-warning'>Negative : "+json_parser["_source"]["review_neg"]+"</p>"
                +"</div>"
                +"<div class='col-sm-5' style='max-height: 100px'>"
                +"<p class='text=primary'>"+json_parser["_source"]["description"]+"</p>"
                +"</div>"
                +"</div>"
                +"</div></div>";// Create text with DOM
            $("#bookPanel").append(txt1);
            }
        }

}

//Abhishek
function getQuery() {
    return "books" || null;
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