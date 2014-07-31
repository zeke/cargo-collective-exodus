"use strict"

require("dotenv").load()

var util = require("util")
var fs = require("fs")
var superagent = require("superagent")
var cheerio = require("cheerio")
var host = "http://cargocollective.com"
var user = "zeke"
var base = util.format("%s/%s/", host, user)

superagent
  .get(base)
  .end(function(res) {
    var $ = cheerio.load(res.text)
    $('.project_link a').each(function(i, el) {
      var path = $(el).attr("href")
      var project_url = util.format("%s%s", host, path)
      console.log(project_url)
      superagent
       .get(project_url)
       .end(function(res){
          var $ = cheerio.load(res.text)
          $('.project_content img').map(function(i, el) {
            var image_url = $(el).attr("src_o")
            var filename = image_url.substring(image_url.lastIndexOf('/')+1)
            console.log(image_url, filename, "\n")
            superagent.get(image_url)
              .pipe(fs.createWriteStream(__dirname + "/" + filename))

          })
       })

    })
  })
