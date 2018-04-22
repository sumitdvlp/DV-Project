/**
 * Created by laveeshrohra on 14/04/18.
 */

function getReviewDataByAsin(asin, callback, from=0) {

    let searchParams = {
        index: REVIEW_INDEX,
        type: REVIEW_TYPE,
        from: from,
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
