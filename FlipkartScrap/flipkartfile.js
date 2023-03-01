const fs = require("fs");
const path = require("path");
const { Parser } = require("json2csv");


let data = [];




function getDetailsflip(prodNameArr,pricesArr,ratingArr,orgPriceArr,productName) {
    //getIssueLink(prodName,price,rating,reviews,orginalPrice);
    // console.log(`${pricesArr.length} + ${orgPriceArr.length}`);

    for (let i = 0; i < prodNameArr.length; i++) {
        let prodName = prodNameArr[i];
        let price = pricesArr[i];
        let rating = ratingArr[i];
        let orgPrice = orgPriceArr[i];
        // console.log(prodName + price + rating + orgPrice)
        let flag = true;
        for(let j=0;j<productName.length;j++){
            if((prodName.toLowerCase()).search(productName[j].toLowerCase()) == -1){
                flag = false;
                break;
            }
        }
        
        if(flag){
            
            prodName = prodName.slice(0,prodName.search("-"));
            prodName = prodName.replaceAll(","," ");
            // console.log(rating)
            // rating = rating.slice(0,rating.search("out")-1);
            if(price == ""){
                price = orgPrice;
            }
            if(orgPrice.search("₹") != -1){
                orgPrice = orgPrice.slice(1);
            }
            if(price.search("₹") != -1){
                price = price.slice(1);
            }

            if(price != ""){
                price = price.replaceAll(",","");
                orgPrice = orgPrice.replaceAll(",","");
                //console.log(`${i} + ${price} + ${orgPrice}`);
                data.push({"Product Name" : prodName,"OrgPrice" : parseInt(orgPrice) ,"Price" : parseInt(price), "Rating" : rating});
            }
            
            //console.log(`Product : ${prodName}  Price : ${price}  Rating : ${rating} Reviews : ${reviews} Original Price : ${orginalPrice}`);
        }       
    }
    
    saveData(data);


    function saveData(data) {
        
        let folderpath = path.join(__dirname,"..","public","Flipkart");

        dirCreator(folderpath);
        let filepath = path.join(folderpath, "flipgraph.csv");
        
        let text = new Parser({fields: ["Product Name", "OrgPrice", "Price", "Rating"]}).parse(data);
        fs.writeFileSync(filepath,text);
        while (data.length > 0) {
            data.pop();
        }
    }

}

module.exports = getDetailsflip


function dirCreator(folderpath) {
    if (fs.statSync(folderpath) == false) {
        fs.mkdirSync(folderpath);
    }
    
}

