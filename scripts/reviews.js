/**
 * Created by laveeshrohra on 14/04/18.
 */

function getReviewData(query, callback) {
    reviewClient.search({'q': query})
        .then(callback, console.error);
}


function getReviewDataByAsin(asin, callback) {

    let searchParams = {
        index: REVIEW_INDEX,
        type: REVIEW_TYPE,
        size: 0,
        body: {
            "query": {
                "term": {
                    "asin.keyword": {
                        "value": asin
                    }
                }
            },
            "aggs": {
                "polarities": {
                    "terms": {
                        "field": "polarity"
                    }
                }
            }
        }
    };

    return reviewClient.search(searchParams)
        .then(callback, console.error);
}
