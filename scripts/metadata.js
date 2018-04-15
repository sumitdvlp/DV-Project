/**
 * Created by laveeshrohra on 14/04/18.
 */

function getMetaData(callback, query, from=0) {

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


function searchMetaData(callback, query, category, from=0) {
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

    if(category){
        body = {
            "query": {
                "bool": {
                    "must": [
                        queryParam,
                        {
                            "term": {
                                "categories.keyword": {
                                    "value": category
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