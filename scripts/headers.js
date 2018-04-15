/**
 * Created by laveeshrohra on 14/04/18.
 */

const metaClient = new $.es.Client({
    hosts: 'http://search-dv-project-kar7oxav7hzii3odd6uca7kuza.us-east-2.es.amazonaws.com:80'
});

const reviewClient = new $.es.Client({
    hosts: 'http://search-dv-project-waappfwokty6xjrb4n3lc5vt44.us-east-2.es.amazonaws.com:80'
});

const META_INDEX = "metadata";
const META_TYPE = "metadata";

const REVIEW_INDEX = "reviews";
const REVIEW_TYPE = "reviews";