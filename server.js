const express = require('express');
const {parseString}   = require('xml2js');
const fs = require('fs');
const moment  = require('moment');
const db = require("./models");
const xmlModel = db.xmlModel;
// const Op = db.Sequelize.Op;

const app = express(),
      bodyParser = require("body-parser");
      port = process.env.PORT || '3002';

app.use(bodyParser.json());

// Data Constants as of know we can make these as dynamic values too.
const records = [];
let sql =[];
let final_query ,final_result;
const req_payload ={
    "title" : "",
    "post_name" :"",
    "content_encoded" : "",
    "post_status" : "import",
    "GUID" :"",
    "post_type" : "blog",
    "site_id" : 14,
    "created_date": "",
    "updated_date": "",
    "created_by": "system",
    "updated_by": "system",   
}
const post_content = {
        "rows":[
            {"colspan":12,
            "columns":[
                {"colspan":12,
                  "content":[
                        {
                            "type":"text",
                            "color":"black",
                            "intro":false,
                            "bgcolor":"white",
                            "spacing":"none",
                            "topspacing":"none",
                            "bottomspacing":"none",
                            "showSideMargins":true,
                            "value":"<p><span class=\"text-style-5\">Hello World</span></p>"
                        }
                    ]
                }
            ]
        }
    ]
}
// Data Constants as of know we can make these as dynamic values too.

// Basic Route 
app.get('/', (req,res) => {
    res.send("Rendering the file");
});
// Basic Route 

// Data fetching Route 
app.post('/data', async(req, res)=> {
    try {
            fs.readFile("./data.xml", {encoding: 'utf-8'}, async(error, response, body)=> {
                parseString(response, async(err, resp)=> {
                    if (err) console.log(err);
                    body = resp;
                    let data = getReqPayload(body);
                    let responseObj = await createRecord(data);
                    if(responseObj){
                        res.send(responseObj);
                    }
                    else{
                        res.send("data updated successfully");
                    }
                });
            });
    } catch(e){
        res.send(e)
    }
})

function getReqPayload (req){
    let body = req;
    let obj = {};
    const reqArr = ['title','content:encoded','wp:status','wp:post_date']
    if(body.rss.channel[0].item.length > 0){
        body.rss.channel[0].item.forEach((element,i) => {
            if(Object.keys(element).includes(reqArr[0]) || Object.keys(element).includes(reqArr[1]) || Object.keys(element).includes(reqArr[2])){
                obj.title = element[reqArr[0]][0];
                obj.description = element[reqArr[1]][0];
                obj.wpStatus = element[reqArr[2]][0];
                obj.wpPostDate = element[reqArr[3]][0];
            }
            if(obj.wpStatus === 'publish'){
                    let post_title = (obj.title.replace(/[^a-zA-Z ]/g, '').split(/\s/).join(''));
                    let value = `<h1> ${obj.title} </h1> \n <p> ${obj.description}</p>`
                    post_content.rows[0].columns[0].content[0].value = value ;
                    req_payload.title = obj.title;
                    req_payload.post_name = post_title;
                    req_payload.content_encoded = post_content;
                    req_payload.GUID =  `https://dv-staff-pfrw.ttgtpmg.net/tools/${req_payload.post_name}`,
                    req_payload.created_date = obj.wpPostDate;
                    req_payload.updated_date = moment().format("yyyy-MM-DD hh:mm:ss");
                    records.push(req_payload)
                    
            }
        });
        return records;
    }
}

async function createRecord(req){
const error = {message: "There is a an error"};
try {
    req.forEach((res) =>{
        if (!res.title) {
            return error;
        }
        xmlModel.create(res)
    })
}
catch (e){
    return error;
}
};
//  Port listen
app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});
//  Port listen
