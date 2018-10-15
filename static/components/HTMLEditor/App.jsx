var Menu = ()=>{
	return (
		<header>
			<div id="tools">
				<span>Compile</span>
				<span>HTML Editor</span>
			</div>
		</header>
	)
}
class Out extends React.Component {
	constructor(props){
		super(props);
	}
	render(){
		return (
			<div id="html-out">
				<style>
				{this.props.style}
				</style>
				<div dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(this.props.html)}}>
				
				</div>
			</div>
		)
	}
}
class HTMLEditor extends React.Component {
	constructor(){
		super();
		this.state = {
			html:"",
			style:""
		}
	}
	componentDidMount(){
		let htmlTextArea = document.getElementById("text-html");
		var htmlCodeMirror = CodeMirror.fromTextArea(htmlTextArea,{
			value: htmlTextArea.value,
			lineNumbers:true,
    		matchBrackets: true,
    		htmlMode:true,
    		mode:"text/xml",
    		theme:"darcula"
		})
		htmlCodeMirror.on("change", (e)=>{
			this.setState({
				html:e.getValue()
			})
		})
		htmlCodeMirror.setValue("<!--Init to Write Code Here-->");

		let cssTextArea = document.getElementById("text-css");
		var cssCodeMirror = CodeMirror.fromTextArea(cssTextArea,{
			value: cssTextArea.value,
			lineNumbers:true,
    		mode:"text/css",
    		theme:"darcula"
		})
		cssCodeMirror.on("change", (e)=>{
			let value = e.getValue();
			let arr = [
				"#html-out ", 
				value
					.replace(/(\}(\n|\r))(?=(\w*)*)/g, `}
					#html-out `)
			]
			this.setState({
				style:arr.join("")
			}) 
		})
		cssCodeMirror.setValue("/*Start Coding here*/");
	}
	render(){
		return(
			<div>
				<Out style={this.state.style} html={this.state.html}/>
				<div id="code-html">
					<textarea id="text-html"></textarea>
				</div>
				<div id="code-css">
					<textarea id="text-css"></textarea>
				</div>
			</div>
	)
	}
}
const App = ()=>{
	return (
		<div>
			<Menu/>
			<HTMLEditor/>
		</div>
	)
}