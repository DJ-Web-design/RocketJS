const Menu = ()=>(<header>
		<div id="tools">
			<span></span>
			<span></span>
		</div>
	</header>);

class Editor extends React.Component {
	constructor(){
		super();
		this.state = {
			html:"",
			js:"",
			css:""
		}
	}
	componentDidMount(){
		let cssTextArea = document.getElementById('text-css');
		let jsTextArea = document.getElementById("text-js");
		let htmlTextArea = document.getElementById("text-html");

		this.jsCodeMirror = CodeMirror.fromTextArea(jsTextArea,{
			value: cssTextArea.value,
			lineNumbers:true,
    		matchBrackets: true,
    		mode:"javascript",
    		theme:"darcula"
		}).setValue("//Insert Javascript Code Here");
		this.htmlCodeMirror = CodeMirror.fromTextArea(htmlTextArea,{
			value: htmlTextArea.value,
			lineNumbers:true,
    		matchBrackets: true,
    		mode:"text/xml",
    		theme:"darcula"
		}).setValue("<!--Insert HTML Here-->")
		this.cssCodeMirror = CodeMirror.fromTextArea(cssTextArea,{
			value: cssTextArea.value,
			lineNumbers:true,
    		matchBrackets: true,
    		mode:"text/css",
    		theme:"darcula"
		}).setValue("/*Insert CSS Here*/")
	}
	getValues(){
		document.getElementById("js-value").value = this.jsCodeMirror.getValue();
		document.getElementById("css-value").value = this.cssCodeMirror.getValue();
		document.getElementById("html-value").value = this.htmlCodeMirror.getValue();
	}
	render(){
		return (
			<div>
				<form 
				 onSubmit={this.getValues.bind(this)} 
				 action="/compiler" 
				 method="POST" 
				 encType="application/x-www-form-urlencoded"
				>
					<textarea id="text-html"></textarea>

					<textarea id="text-js"></textarea>

					<textarea id="text-css"></textarea>
					<input type="hidden" name="js" id="js-value"/>
					<input type="hidden" name="css" id="css-value"/>
					<input type="hidden" name="html" id="html-value"/>

					<input type="submit" name="compiler" value="React"/>
					<input type="submit" name="compiler" value="Vue"/>
				</form>
			</div>
		)
	}
}

var App = () => {
	return (
		<div>
			<Menu />
			<Editor />
		</div>
	)
}