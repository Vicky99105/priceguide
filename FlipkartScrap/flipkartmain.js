const cheerio = require("cheerio");
const request = require("request");
const fs = require("fs");

const getDetails = require("./flipkartfile");

function scrapFlipkart(url,productName){
    //console.log(url);
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
        // console.log(productName.length);

        let $ = cheerio.load(html);
        let prodNameArr=[],pricesArr=[],ratingArr=[],orgPriceArr=[];
        let container = $("._13oc-S");
        // 
        // console.log(container.length)
        for(let i=0;i<container.length;i++){
            $ = cheerio.load(container[i]);
            if($("._30jeq3._1_WHN1").text() && $("._3I9_wc._27UcVY").text()){
                //console.log($(".a-price.a-text-price .a-offscreen").text());
                prodNameArr.push($("._4rR01T").text());
                pricesArr.push($("._30jeq3._1_WHN1").text());
                ratingArr.push($("._3LWZlK").text());
                orgPriceArr.push($("._3I9_wc._27UcVY").text());
                // console.log($("._3LWZlK").text());
            }
            
        }

        getDetails(prodNameArr,pricesArr,ratingArr,orgPriceArr,productName);
        
    }
    
}

module.exports = scrapFlipkart;

