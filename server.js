var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var bodyParser     =        require("body-parser");
var app            =        express();
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));


app.use(bodyParser.json())
app.use(bodyParser.json({ type: 'application/*+json' }))
var jsonParser = bodyParser.json()
// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();
app.get("/hello", function(req, res){
  console.log("HELL");
  res.send("WHY HELO THERE");
})

app.post('/en_to_ie',function(req,res){
  var user_name=req.body.user;
  var password=req.body.password;
  var query=req.body.query;
  if (query){
    query=query.toLowerCase();
  }
   var match=req.body.match;
   if (match){
    match=match.toLowerCase();
   }


   var matches="";

  	// The Irish dictionary URL
    url = 'http://www.focloir.ie/ga/dictionary/ei/'+query;

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            var title;
           

            var dictionary=[];
            $(".entry .sense").each(function(){
            	var number=$(this).find(".span_sensenum").html()
            	var word_type=$(this).find("span.pos").html();
            	var meaning=$(this).find("span.EDMEANING").html();
                
            	var translations=$(this).find(".cit_translation");
            	var examples=$(this).find(".cit_example");
            	var dict_translations=[];
            	var dict_examples=[];

              console.log($(translations).html());

            	$(translations).each(function(){
            			var irish=$(this).find(".quote").html();
                      
            			var sounds=$(this).find(".dialect");
            			var munster="";
		            	var connacht="";
		            	var ulster="";
            			$(sounds).each(function(){
							v=this;
		            		var dialect=$(v).html();
		            		if (dialect){
		            			dialect=dialect.trim();
		            			switch (dialect){
		            				case "m": munster=$(v).attr("data-src-mp3");
		            				break;
		            				case "c": connacht=$(v).attr("data-src-mp3");
		            				break;
		            				case "u": ulster=$(v).attr("data-src-mp3");
		            				break;
		            			}
		            		}
                          
		            	})
               

                          if (irish==match){
                              
                              matches={"irish":irish, "munster": munster, "connacht":connacht, "ulster":ulster};
                           }


            			dict_translations.push({"irish":irish, "munster": munster, "connacht":connacht, "ulster":ulster});
            	})


            	$(examples).each(function(){
            		var english_quote=$(this).find(".quote").first().html();
            		var irish_quote=$(this).find(".cit_translation_noline .quote").html();


            		dict_examples.push({"ex_en":english_quote, "ex_ie":irish_quote});
            	});


            	
            	
        

            	dictionary.push({"examples":dict_examples, "translations":dict_translations, "number":number, "word_type": word_type, "meaning":meaning});


            });
           if (matches){
            //console.dir(matches);
            res.send(matches);
           }
           else{
           res.send(dictionary);
       }

           
        }
    })

});
app.post('/ie_to_en',function(req,res){

  var query=req.body.query;
 

  console.log(query);

    // The Irish dictionary URL
    url = 'http://www.teanglann.ie/en/fgb/'+query;

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            var title;
             var suggestions=$(".suggestions");
             var suggestions_arr=[];
             $(suggestions).find("a").each(function(){
                suggestions_arr.push($(this).html());
             })
                

            var dictionary={"suggestions":[], "results":[]};
            $(".entry").each(function(){
               
                var irish_match=$(this).find(".title").html();
                var word_type=$(this).find(".g").html();
                var meaning=$(this).find(".trans").html();
                var examples=$(this).find(".example");
     
                var dict_examples=[];
                //Each example contains with a .b and .r a number of spans that must be summed for their definition
                $(examples).each(function(){
                        var separate_irish=$(this).find(".b");
                        var example_irish=$(separate_irish).html();
                       

                        var separate_english=$(this).find(".r");
                        var example_english=$(separate_english).html();
                       
                        

                        dict_examples.push({"irish":example_irish, "english":example_english});

                       
                })

                dictionary["results"].push({"irish_match": irish_match,  "word_type":word_type, "examples":dict_examples, "meaning":meaning});

            });
dictionary["suggestions"]=suggestions_arr;

           console.dir(dictionary);
           res.send(dictionary);

           
        }
    })

});
// start server on the specified port and binding host
app.listen(appEnv.port, appEnv.bind, function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});






exports = module.exports = app;