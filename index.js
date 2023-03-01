 const express = require('express')
const { SourceMap } = require("module");
const { type } = require("os");
const { mainModule } = require("process");
const puppeteer = require("puppeteer");
const bodyParser = require('body-parser');
// var cons = require('consolidate');
// const graphamzn = require("./AmazonScrap/Amazon/amzngraph");
const fs = require("fs");
const { parse } = require("csv-parse");

const scrapAmzn = require("./AmazonScrap/amazonmain");
const scrapFlipkart = require("./FlipkartScrap/flipkartmain");
const port = 3000

const app = express()
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/images', express.static(__dirname + 'public/images'))
app.use('/charts', express.static(__dirname + 'charts'))

app.use('/js', express.static(__dirname + 'public/js'))
app.use(bodyParser.urlencoded({ extended: true }))

app.set('views', 'src/views')
app.set('view engine', 'ejs');
// app.engine('html', cons.swig); 
// app.set('view engine', 'html');

let productName;
app.get('/', (req, res) => {
    res.render('index')
  })
  
  
  app.post("/search", function(req,res){
       
     productName = req.body.searchProduct ;
     
     major(productName);

     res.render('secondary1');
    // res.sendFile(__dirname + '/charts/chartamzn.html');
        
    
  });
 
//   app.get('/search1', (req, res) => {
    
//     productName = "Apple Iphone 13" ;
     
//      major(productName);

//      res.render('secondary1.ejs');
    
//   })
//   app.get('/search2', (req, res) => {
    
//     productName = "Apple Macbook Pro" ;
     
//      major(productName);

//      res.render('secondary1.ejs');
    
//   })
//   app.get('/search3', (req, res) => {
    
//     productName = "Apple Iphone 13 Pro" ;
     
//      major(productName);

//      res.render('secondary1.ejs');
    
//   }) 
//   app.get('/search4', (req, res) => {
    
//     productName = "Redmi Tv 32 Inches" ;
     
//      major(productName);

//      res.render('secondary1.ejs');
    
//   })
//    app.get('/search5', (req, res) => {
    
//     productName = "Redmi Note 11" ;
     
//      major(productName);

//      res.render('secondary1.ejs');
    
//   })
//    app.get('/search6', (req, res) => {
    
//     productName = "Canon EOS 1500D" ;
     
//      major(productName);

//      res.render('secondary1.ejs');
    
//   })

  app.get('/viewamzn', (req, res) => {
        let prodNameLabel = [];
        const oldPriceLabel = [];
        const newPriceLabel = [];
        const ratingLabel = [];

        fillAmzn();
        
        async function fillAmzn(){
            let flag = false;
            const response = await fs.createReadStream("./public/Amazon/amzngraph.csv")
            .pipe(parse({ delimiter: ",", from_line: 1}))
            .on("data", function (column) {
                if(flag){
                    //console.log(column[0])
                    const name = column[0];
                    const oldPrice = parseInt(column[1]);
                    const newPrice = parseInt(column[2]);
                    const rating = column[3];
                    prodNameLabel.push(name);
                    oldPriceLabel.push(oldPrice);
                    newPriceLabel.push(newPrice);
                    ratingLabel.push(rating);

                    //console.log(name);
                    // console.log(prodNameLabel.length);
                }
                flag = true;
            });
        }

        setTimeout(greet,3000);
        
        function greet(){
            //console.log(prodNameLabel + oldPriceLabel);

            res.render('chartamzn', {
                prodName : prodNameLabel,
                oldPrice : oldPriceLabel,
                newPrice : newPriceLabel
            });
        }
    });

  
    app.get('/viewflip', (req, res) => {
        let prodNameLabel = [];
        const oldPriceLabel = [];
        const newPriceLabel = [];
        const ratingLabel = [];

        fillkart();
        
        async function fillkart(){
            let flag = false;
            const response = await fs.createReadStream("./public/Flipkart/flipgraph.csv")
            .pipe(parse({ delimiter: ",", from_line: 1}))
            .on("data", function (column) {
                if(flag){
                    //console.log(column[0])
                    const name = column[0];
                    const oldPrice = parseInt(column[1]);
                    const newPrice = parseInt(column[2]);
                    const rating = column[3];
                    prodNameLabel.push(name);
                    oldPriceLabel.push(oldPrice);
                    newPriceLabel.push(newPrice);
                    ratingLabel.push(rating);
                }
                flag = true;
            });
        }

        setTimeout(greet,2000);
        
        function greet(){
            //console.log(prodNameLabel + oldPriceLabel);

            res.render('chartflip', {
                prodName : prodNameLabel,
                oldPrice : oldPriceLabel,
                newPrice : newPriceLabel
            });
        }
    });

function major(prodName) {

const amazonLink = "https://www.amazon.in";
const flipkartLink = "https://www.flipkart.com";

// const productName = "Poco X4 pro";
const checkName = productName.split(" ");

let page1, page2, page3;

let browserOpen = puppeteer.launch({
    headless: true,
    slowMo: false,
    defaultViewport: null,
    args: ["--start-maximized"],
});


browserOpen
    .then(function (browserObj) {
        let browserOpenPromise = browserObj.newPage();
        return browserOpenPromise;
    }).then(function (newTab) {
        // open amazon on new page
        page1 = newTab;
        let openAmazon = newTab.goto(amazonLink);
        return openAmazon;
    }).then(function () {
        return page1.bringToFront();
    }).then(function () {
        let productEntered = page1.type("input[id='twotabsearchtextbox']", productName, { delay: 50 });
        return productEntered;
    }).then(function () {
        return waitAndClick("input[type='submit']", page1);
    }).then(function () {
        let waitFor0Seconds = page1.waitForTimeout(300);
        return waitFor0Seconds;
    }).then(function () {
        scrapAmzn(page1.url(), checkName);
    }).then(function () {
        scrapFlipkart(`https://www.flipkart.com/search?q=${productName}`, checkName);
    }).then(function () {
        return page1.close();
    })

function waitAndClick(selector, cPage) {
    return new Promise(function (resolve, reject) {
        let waitPromise = cPage.waitForSelector(selector);
        waitPromise.then(function () {
            let clickModal = cPage.click(selector, { delay: 50 });
            return clickModal;
        }).then(function () {
            resolve();
        }).catch(function (err) {
            reject();
        })
    })
}
  }

app.listen(process.env.PORT || port, () => console.log(`Listening on port ${port}`))