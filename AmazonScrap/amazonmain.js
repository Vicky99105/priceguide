const cheerio = require("cheerio");
const request = require("request");
const fs = require("fs");

const getDetails = require("./amazonfile");

function scrapping(url,productName){

    request(url, cb);

    function cb(error, response, html) {
        if (error) {
            console.log(error);
        }
        else {
            getTopicLinks(html,productName);
        }
    }

    function getTopicLinks(html,productName) {
        let $ = cheerio.load(html);
        let prodNameArr=[],pricesArr=[],ratingArr=[],orgPriceArr=[];
        let container = $(".s-card-container.s-overflow-hidden.aok-relative.puis-include-content-margin.puis.s-latency-cf-section.s-card-border");
        //console.log(container.length);
        for(let i=0;i<container.length;i++){
            $ = cheerio.load(container[i]);
            if($(".a-price-whole").text() && $(".a-price.a-text-price .a-offscreen").text()){
                //console.log($(".a-price.a-text-price .a-offscreen").text());
                prodNameArr.push($(".a-size-medium.a-color-base.a-text-normal").text());
                pricesArr.push($($(".a-price-whole")[0]).text());
                ratingArr.push($(".a-icon-alt").text());
                orgPriceArr.push($($(".a-price.a-text-price .a-offscreen")[0]).text());
                // console.log($($(".a-price-whole")[0]).text());
            }
            
        }
        console.log(prodNameArr.length + "+" + pricesArr.length + "+" + ratingArr.length + "+" + orgPriceArr.length);
        getDetails(prodNameArr,pricesArr,ratingArr,orgPriceArr,productName);

    }
    
}

module.exports = scrapping;

