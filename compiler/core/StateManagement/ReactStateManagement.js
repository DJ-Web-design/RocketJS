const StateManagement = require("./StateManagement")

/**
 * Class React State Management
 * @extends StateManagement
 */
class ReactStateManagement extends StateManagement {
	constructor(){
		super();
	}
	/**
	 * Set React Components
	 * @description Set Components Imports to String Template
	 * @public
	 * @return {string}
	 */
	setReactComponents(){
		let components = "";
		if (this.components.length > 0) {
			this.components.forEach(e=>{
				components += `import ${e} from "~/components/${e}"\n`; //Add Import for each Component Value
			})
		}
		return components;
	}
	setReactStateToTemplate(){
		let states = "";
		let computed = "";
		let methods = "";
		let bindMethods = "";
		let bindComputeds = "";
		let props = "";
		let watchers = "";
		let inputHandler = "";

		//States
		if (this.states.length > 0) {
			var _mappedStates = {};
			this.states.forEach(e=>{
				if (typeof e === "object") {
					_mappedStates[e.key] = e.value;
				} else if (typeof e === "string"){
					_mappedStates[e.replace(/(\"|\')/g, "")] = "";
				}
			})
			states = `\n\t\tthis.state = ${this._JSONPrettify(_mappedStates)};`;
		}
		//Computed
		if (this.computed.length > 0) {
			let mappedComputed = this.computed.map(e=>{
				return `${e.name}()${e.content}`;
			});
			computed = "\n\t"+mappedComputed.join("\n\t");

			let mappedBindComputeds = this.computed.map(e=>{
				let sliced = e.name.replace("()", "");
				return `this.${sliced} = this.${sliced}.bind(this);`;
			})
			bindComputeds = "\n\t\t"+mappedBindComputeds.join("\n\t\t");
		}
		//Methods
		if(this.methods.length > 0){
			let mappedMethods = this.methods.map(e=>{
				return e.name+e.content;
			})
			methods = "\n\t"+mappedMethods.join("\n\t");

			let mappedBindMethods = this.methods.map(e=>{
				let sliced = e.name.replace("()", "");
				return `this.${sliced} = this.${sliced}.bind(this);`;
			})
			bindMethods = "\n\t\t"+mappedBindMethods.join("\n\t\t");
		}
		if (this.watchers.length > 0) {
			let mappedWatchers = this._filterJS(this.watchers, "r").map((e,i)=>{
				let isState = false;
				let isProp = false;

				this.states.forEach(state=>{
					if (e.name === state || e.name === state.key) {
						isState = true;
					}
				})
				if (!isState) {
					this.props.forEach(prop=>{
						if (prop === e.name) {
							isProp = true;
						}
					})
				}

				let bifurcacion = "";
				if (i === 0) {
					bifurcacion = "if";
				} else {
					bifurcacion = "else if";
				}
				let stateOrProp = "";
				if (isState) {
					stateOrProp = "state.";
				} else if (isProp) {
					stateOrProp = "prop.";
				}
				let final = `${bifurcacion} (${stateOrProp + e.name}) ${e.content.split(/\n/).join("\n\t").replace(/^{/, "{\n\t\t\tlet "+ e.params+" = "+stateOrProp+e.name+";").replace(/}$/, "}")}`;
				return final;
			})
			watchers = `\n\tcomponentDidUpdate(prop, state){\n\t\t${mappedWatchers.join(" ")}\n\t}`;
		}
		if (this.inputs) {
			inputHandler = `
	inputHandler(event){
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
		this.setState({
			[name]: value
		})
	}`;
		}


		let mainTemplate = 	
	`constructor(${this.props.length > 0 ? "props": ""}) {
		super(${this.props.length > 0 ? "props": ""});${states}${bindMethods}${watchers ? "\n\t\tthis.componentDidUpdate = this.componentDidUpdate.bind(this);" : ""}${bindComputeds}
	}${computed}${methods}${inputHandler}${watchers}`;
		if (!states && !computed && !methods && !watchers) {
			 mainTemplate = "";
		}
		return mainTemplate
	}
	setReactFilterHTMLState(html){

		return html
			.replace(/"/g, "'")
			.split(/\{(?=\w*)/g)
			.map((e, i)=>{
				if (e) {
					let str;
					if (i === 0) {
						str = e;
					} else if (e.match(/prop/)) { 
						str = "{this.props."+e.replace(/(\s-.*\})/g, "}");
					}else if (e.match(/computed/)) {
						str = "{this."+e.replace(/(\s-.*\})/g, "()}");
					} else {
						str = "{this.state."+e.replace(/(\s-.*\})/g, "}");
					}
					return str;
				}
			})
			.join("")			
			.split(/:(?=\w*='\w*)/g)
			.map((e, i)=>{
				if (i !== 0) {
					return e.replace(/'(?=\w*)/, "{this.state.").replace(/('|\s\-.*')(?=\s|\/)/, "}")
				} else {
					return e
				}
			})
			.join("")
			.replace(/\s\-\s.*'/g, "}")
			.split(/on(?=\w*='\w*\(\)')/)
			.map((e, index)=>{
				if (index === 0) {
					return e;
				} else {
					
					return "on" + e[0].toUpperCase() + e.slice(1)
						.replace(/'(?=\w*)/, "{this.")
						.replace(/\(\)'(?=\s|\/|\>)/, "}");
				} 
			})
			.join("")
			.split(/<(?=input|textarea|select)/g)
			.map(e=>{
				let name = e.match(/name=("|')\w*("|')/);
				let newName = "";
				if (name) {
					newName = `onChange={this.inputHandler.bind(this)}`;
				}
				let replaced;
				if (e.match(/input/)) {
					replaced = e.replace("input", `input ${newName}`);
				} else if (e.match(/textarea/)) {
					replaced = e.replace("textarea", `textarea ${newName}`);
				} else if (e.match(/select/)) {
					replaced = e.replace("select", `select ${newName}`);
				} 
				return replaced;
			})
			.join("<");
	}
}

module.exports = ReactStateManagement