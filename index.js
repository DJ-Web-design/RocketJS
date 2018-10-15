//Server

const express = require("express"),
	  server = express(),

	  bodyParser = require("body-parser"),
	  urlencodedParser = bodyParser.urlencoded({ extended: false }),
	  
	  {join} = require("path"),

	  {write, remove} = require("./writeFile"),
	  {VueCompiler, ReactCompiler} = require("./compiler"),
	  port = process.env.PORT || 8080,
	  public = join(__dirname, "static");
	  
server
	.get("/", (req, res)=>{
		res.setHeader("Content-Type", "text/html");
		res.sendFile(join(public, "index.html"));
	})
	.get("/editor", (req, res)=>{
		res.sendFile(join(public, "compiler.html"));
	})
	.get("*.html", ({url}, res)=>{
		res.setHeader("Content-Type","text/html");
		res.sendFile(join(public, url));
	})
	.get("*.js", ({url}, res)=>{
		res.setHeader("Content-Type","text/javascript")
		res.sendFile(join(public, url));
	})
	.get("*.css", ({url}, res)=>{
		res.setHeader("Content-Type","text/css");
		res.sendFile(join(public, url));
	})
	.get("*.jsx", ({url}, res)=>{
		res.setHeader("Content-Type","text/babel")
		res.sendFile(join(public, url));
	})
	.get("*.png",({url}, res)=>{
		res.setHeader("Content-Type", "image/png");
		res.sendFile(join(public, url))
	})
	.post("/compiler", urlencodedParser, ({body},res)=>{
		let html = body.html;
		let js = body.js;
		let css = body.css;
		let filename = body.name
		if (body.compiler === "React") {
			res.setHeader("Content-Type", "text/javascript; charset=utf-8")
			res.send(ReactCompiler(filename, html, css, js))
			/*write(filename+".js", reactCompiler(html, css))
			res.download(`./tmp/${filename}.js`,(err)=>{
				remove(filename+".js")
			})*/
		} else {
			res.setHeader("Content-Type", "text/plain; charset=utf-8")			
			res.send(VueCompiler(html, css, js))
			/*write(filename+".vue", vueCompiler(html, css))
			res.download(`./tmp/${filename}.vue`,err=>{
				remove(filename+".vue")
			})*/
		}
	})


server.listen(port, console.log(`Listen on http://localhost:${port}`))