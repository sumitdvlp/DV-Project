/**
 * Created by laveeshrohra on 18/04/18.
 */

function getFullMetaDataByAsins(asins, callback, from=0) {

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
            }
        }
    };

    return reviewClient.search(searchParams)
        .then(callback, console.error);
}
