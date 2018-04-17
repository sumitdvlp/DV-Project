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
    console.log(data);
}

//Abhishek
function getQuery() {
    return "books" || null;
}

//Laveesh
function getPrice() {
    return [10, 20] || null;
}