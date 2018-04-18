/**
 * Created by laveeshrohra on 14/04/18.
 */

function getMetaDataCategories(callback, query, from=0) {

    let queryParam = {
        'match_all': {}
    };
    if(query){
        queryParam = {
            "multi_match": {
                "query": query,
                "fields": ["brand", "categories", "description", "categories"]
            }
        }
    }

    let searchParams = {
        index: META_INDEX,
        type: META_TYPE,
        from: from,
        size: 0,
        body: {
            "query": queryParam,
            "aggs": {
                "categories": {
                    "terms": {
                        "field": "categories.keyword",
                        "size": 500
                    }
                }
            }
        }
    };

    metaClient.search(searchParams)
        .then(callback, console.error);
}


function getAggPriceHistogram(callback, query) {

    let queryParam = {
        "range": {
            "price": {
                "lte": 100
            }
        }
    };
    if(query){
        queryParam = {
            "bool": {
                "must": [
                    {
                        "multi_match": {
                            "query": query,
                            "fields": ["brand", "categories", "description", "categories"]
                        }
                    },
                    {
                        "range": {
                            "price": {
                                "lte": 100
                            }
                        }
                    }
                ]
            }
        }
    }

    let searchParams = {
        index: META_INDEX,
        type: META_TYPE,
        size: 0,
        body: {
            "query": queryParam,
            "aggs": {
                "prices": {
                    "histogram": {
                        "field": "price",
                        "interval": 20
                    },
                    "aggs": {
                        "drill_prices": {
                            "histogram": {
                                "field": "price",
                                "interval": 5
                            }
                        }
                    }
                }
            }
        }
    };

    metaClient.search(searchParams)
        .then(callback, console.error);
}


function searchMetaData(callback, query, price, from=0) {
    let queryParam = {
        'match_all': {}
    };
    if(query){
        queryParam = {
            "multi_match": {
                "query": query,
                "fields": ["brand", "categories", "description", "categories"]
            }
        }
    }

    let body = {
        "query": queryParam
    };

    if(price){
        body = {
            "query": {
                "bool": {
                    "must": [
                        queryParam,
                        {
                            "range": {
                                "price": {
                                    "gte": price[0],
                                    "lte": price[1]
                                }
                            }
                        }
                    ]
                }
            }
        }
    }

    let searchParams = {
        index: META_INDEX,
        type: META_TYPE,
        from: from,
        body: body
    };

    metaClient.search(searchParams)
        .then(callback, console.error);
}


function updateMetaData(data, callback) {
    let promises = data.map(row => {
       let source = row['_source'];
       let asin = source['asin'];

       const modifySource = reviewData => {
           reviewData = reviewData.aggregations.polarities.buckets;
           let source = {
               pos: 0,
               neg: 0,
               neu: 0
           };

           reviewData.forEach(r => {
               switch(r['key']){
                   case 1: source['pos'] = r['doc_count'];
                   break;
                   case -1: source['neg'] = r['doc_count'];
                   break;
                   case 0: source['neu'] = r['doc_count'];
                   break;
               }
           });

           return source;
       };

       return getReviewDataByAsin(asin, modifySource);
       // return source;
    });

    Promise.all(promises)
        .then(res => {
            res.forEach((r,i) => {
                data[i]['_source']['pos'] = r['pos'];
                data[i]['_source']['neg'] = r['neg'];
                data[i]['_source']['neu'] = r['neu'];
            });
            callback(data);
        })
}