const fs = require('fs');
const http = require('http');
const url = require('url');

////////////////////////////
////////FILES


// // Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}.\Created on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('file written!');

//Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if(err) return console.log('ERROR!');

//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);

//             fs.writeFile('.txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('Your file has been written');
//             })
//         });
//     });
// });
// console.log('Will read file!');

/////////////////////////////////
//SERVER
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTIOM%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);
    //this contains all of the data to orcgnize on the cards. by placing the place holder (productname, image, price, etc) in / /g,
    //that ensures that all of the the productnames are pulled and not just the first one in the data.json

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
//array of objects to loop through

const server = http.createServer((req, res) => {
    const pathName = req.url;
//Overview page
    if(pathName === '/' || pathName === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'});

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        //loop through data with a .map which will be saved into a new array(cardsHtml) map gets an argument
        //el (the current element) which will then return data for our new cardsHtml array
        //create a function to replace the placeholders in each iteration called replaceTemplate which will take in "tempCard" and 
        //the element "el" which holds the data
        //by placing .join('') into an empty string, this will join all of the elements into a string
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        //tempOverview is the string that holds the html
        res.end(output);

//Product page
    } else if (pathName === '/product'){
        res.end('This is the PRODUCT');

// API
    } else if (pathName === '/api') {
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(data);

// Not found
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to request on port 8000');
});

