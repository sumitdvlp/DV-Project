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
        // Convert data into json and parse information
        for(var i in data){
            json_data = JSON.stringify(data[i]);
            json_parser = JSON.parse(json_data);
            data_list.push(json_parser["_source"]["title"]);
            // Create the UI elements according to clicked heatmap
            if(json_parser["_source"]["title"]){
            var txt1 = "<div class='panel panel-default animated bounceInRight'><div class='panel-heading'>"
                +json_parser["_source"]["title"]
                +"</div><div class='panel-body'>"
                +"<img src="+json_parser["_source"]["imUrl"]+" class='img-rounded' height='100' width='100'>"
                +"</div></div>";// Create text with DOM
            $("#bookPanel").append(txt1);
            }
        }
    //console.log(data_list);
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