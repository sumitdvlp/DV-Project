var pageIndex = 0;
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
            data_list.push(json_parser["_source"]["imUrl"]);

            // Create the UI elements according to clicked heatmap
            /*if(json_parser["_source"]["title"]){
            var txt1 =
                "<div class='panel panel-default animated bounceInRight'><div class='panel-heading'>"
                +json_parser["_source"]["title"]
                +"</div><div class='panel-body'>"
                +"<div class='row'><div class='col-sm-2'>"
                +"<img src="+json_parser["_source"]["imUrl"]+" class='img-rounded' height='200' width='150'>"
                +"<p>"
                +"<span class='glyphicon glyphicon-usd' style='height:40px'></span>"+ json_parser["_source"]["price"]
                +"</p>"
                +"</div><div class='col-sm-5'>"
                +"<div id="+json_parser["_source"]["asin"]+"></div>"
                +"</div>"
                +"<div class='col-sm-5' style='max-height: 100px'>"
                +"<p class='text=primary'>"+json_parser["_source"]["description"]+"</p>"
                +"</div>"
                +"</div>"
                +"</div></div>";// Create text with DOM
            $("#bookPanel").append(txt1);

            var temp = [];
            temp.push(json_parser["_source"]["review_pos"]);
            temp.push(json_parser["_source"]["review_neu"]);
            temp.push(json_parser["_source"]["review_neg"]);
            //console.log(i);
            //Add graph to the books panel
            loadColumnChart(json_parser["_source"]["asin"], temp);
            }*/
        }

        $("#TestCollapse").empty();
        var delaycounter = 0;
        var id_array = [];
        var temp = "<div class='container'><div class='row'>";
        for(var i=0; i<5;i++)
        {
            json_data = JSON.stringify(parsed_data[i]);
            json_parser = JSON.parse(json_data);
            var content = "<div>jkjkhkj</div>";
            delaycounter += 0.1;
            temp = temp + "<div class='col-sm-2'><img src="+data_list[i]+" data-toggle='modal' data-target='#myModal' style='animation-delay: "+delaycounter+"s;' " +
            "class='img-rounded animated bounceInRight bookpopover' data-content='"+content+"' data-placement='top' title='"+json_parser["_source"]["title"]+"' height='100' width='100'></div>";
            id_array.push(json_parser["_source"]["asin"]);
        }

        temp = temp  + "<div class='col-sm-12 shelf'></div>";
        for(var i=5; i<10;i++)
        {
            json_data = JSON.stringify(parsed_data[i]);
            json_parser = JSON.parse(json_data);
            delaycounter += 0.1;
            temp = temp + "<div class='col-sm-2'><img src="+data_list[i]+" data-toggle='modal' data-target='#myModal' style='animation-delay: "+delaycounter+"s;' " +
                "class='img-rounded animated bounceInRight bookpopover' data-content='<div id="+json_parser["_source"]["asin"]+"></div>' data-placement='top' title='"+json_parser["_source"]["title"]+"' height='100' width='100'></div>";
            id_array.push(json_parser["_source"]["asin"]);
        }
        temp = temp + "<div class='col-sm-12 shelf'></div></div></div>";
        console.log(temp);
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
            console.log(id_array[i]);
            //Add graph to the books panel
            try{
                console.log('THere');
                loadColumnChart(12, temp2);}
            catch(err){console.log(err);}
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