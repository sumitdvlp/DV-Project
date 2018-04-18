$('document').ready(function () {
    executeSearch();
});


$("#btnSearch").click(function () {
    debugger;
    let queryItem = $("#txtSearchItem").val();
    executeSearch(queryItem);

});


//Abhishek
function executeSearch(query) {
    getAggPriceHistogram(createColumnChart, query);
    searchMetaData(updateAndPopulateList, query);
}

function updateAndPopulateList(data) {
    populateList(data);
    // updateMetaData(data.hits.hits, populateList);
}

//Pranav
//modified by Abhishek -- to render the search results in SearchResults accordion
function populateList(data) {
    //For debugging
    //debugger;

    let resultsList = data.hits.hits;

    $("#searchResultsCount").text(resultsList.length);
    $("#searchResultsBody").empty(); // clear all current cards
    for(result in resultsList)
    {
        let booktitle = resultsList[result]._source.title; //string
        let description = resultsList[result]._source.description; //string
        let imgUrl = resultsList[result]._source.imUrl; //string
        let price = resultsList[result]._source.price; //int
        let review_neg = resultsList[result]._source.review_neg; //int 
        let review_neu = resultsList[result]._source.review_neu; //int 
        let review_pos = resultsList[result]._source.review_pos; //int 
        
        let bool_aria_expanded = (result > 0)?"false":"true";
        let class_body_show = (result>0)?"collapse":"collapse show";
        let htmlCardHeader = "<div class='card handpointer'> <div class='card-header text-white bg-dark' id='"+result+"'><h5 class='mb-0' data-toggle='collapse' data-target='#collapse"+result+"' aria-expanded='"+bool_aria_expanded+"' aria-controls='collapse"+result+"' >"+booktitle+" </h5></div>";
        let htmlCardBody = "<div id='collapse"+result+"' class='"+class_body_show+"' aria-labelledby='heading"+result+"' data-parent='#accordion'><div class='card-body'>"+description+"</div></div></div>";
                                   
        $("#searchResultsBody").append(htmlCardHeader+htmlCardBody);
    }

}

//Abhishek
function getQuery() {
    let query = $('#queryState').val() || null;
    return query ? query.split(",") : "books";
}

//Laveesh
function getPrice() {
    let price = $('#priceState').val() || null;
    return price ? price.split(",") : null;
}