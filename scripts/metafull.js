/**
 * Created by laveeshrohra on 18/04/18.
 */

function getFullMetaDataByAsins(selectedTab, container, callback) {

    const related = selectedTab['related'];

    let allAsins = [];
    let legend = [];
    for(let obj in related){
        allAsins = allAsins.concat(related[obj]);
        legend.push(obj);
    }

    let searchParams = {
        index: META_FULL,
        type: META_FULL,
        size: allAsins.length,
        body: {
            "query": {
                "terms": {
                    "asin.keyword": allAsins
                }
            }
        }
    };

    return reviewClient.search(searchParams)
        .then(res => {
            let nodes = [];
            let links = [];
            let title = selectedTab['title'];

            nodes.push({
                id: title,
                source: selectedTab
            });

            res.hits.hits.forEach(row => {
                let source = row['_source'];
                let group = 0;

                if(!source['title']){
                    return;
                }

                legend.forEach((l, i) => {
                    if(related[l].includes(source['asin'])){
                        group = i;
                    }
                });

                nodes.push({
                    id: source['title'],
                    source: source
                });

                links.push({
                    source: title,
                    target: source['title'],
                    group: group
                });
            });

            let finData = {
                nodes: nodes,
                links: links
            };

            createNetworkGraph(container, finData, legend.map(l => l.toUpperCase().split("_").join(" ")));
        }, console.error);
}
