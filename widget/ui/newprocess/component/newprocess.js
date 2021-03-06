/** @jsx React.DOM */
var TabbedArea = ReactBootstrap.TabbedArea;
var TabPane = ReactBootstrap.TabPane;
var Table = ReactBootstrap.Table;
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;
var ButtonInput = ReactBootstrap.ButtonInput;
var BaseMixin = require('samplemis:widget/ui/commonComponent/baseMixin/baseMixin.js');

var NewProcess = React.createClass({
	mixins: [BaseMixin],
	getInitialState: function(){
		return {
			processid: "",
			uilist: [],
			strategylist: [],
			managerlist: [],
			rdlist: []
		};
	},
	componentWillMount: function(){
		var that = this;
		var url = that.host + '/querytasktype';
		this.doService(url,function(data){
			for(var i = 0; i < data.length; i++){
				if(data[i].id == 1){
					that.setState({
						uilist: data[i].data
					});
				}else if(data[i].id == 2){
					that.setState({
						strategylist: data[i].data
					});
				}
			}	
		});

		var approverUrl = that.host + '/queryapprover';
		this.doService(approverUrl,function(data){
			for(var i = 0; i < data.length; i++){
				if(data[i].type == "manager"){
					that.setState({
						managerlist: data[i].members
					});
				}else if(data[i].type == "rd"){
					that.setState({
						rdlist: data[i].members
					});
				}
			}
		});

		var Request = new Object();
		Request = that.getRequest();
		id = Request['project_id'];
		that.setState({
			processid: id
		});
	},

	handleSubmit: function(e){
		e.preventDefault();
		var that = this;
		var inputType = $("#newProcess input[name=type]:checked");
		var inputName = $("#newProcess input[name=name]").val();
		var inputTime = $("#newProcess input[name=duration]").val();
		var inputRd = $("#newProcess input[name=rd]:checked");
		var inputManager = $("#newProcess input[name=manager]:checked");
		var reg = /^\+?[1-9][0-9]*$/;
		if(inputType.length == 0){
			alert("请选择抽样类型！");
			return;
		}else if(inputName == ""){
			alert("请输入抽样名称！");
			return;
		}else if(!reg.test(inputTime)){
			alert("线上运行时间不能为空且必须为正整数！");
			return;
		}else if(inputRd.length == 0){
			alert("请选择评估rd!");
			return;
		}else if(inputManager.length == 0){
			alert("请选择发起者上级！");
			return;
		}else{
			var url = that.host + '/addtask?'+ $("#newProcess .newprocess_form").serialize();
			this.doService(url, function(data){
				window.location.href = '/sample/viewprocess?taskid=' + data;
			});			
		}
	},

	render: function(){

		var uiNodes = this.state.uilist.map(function(value,key){
			return (
				<li key={key} className="type_li">
					<input type="radio" value={value.type} name="type"/><span>{value.name}</span><span>{value.desc || ""}</span>
				</li>
			);
		});
		var strategyNodes = this.state.strategylist.map(function(value,key){
			return (
				<li key={key} className="type_li">
					<input type="radio" value={value.type} name="type"/><span>{value.name}</span><span>{value.desc || ""}</span>
				</li>
			);
		});
		var rdNodes = this.state.rdlist.map(function(value, key){
			return(
				<Input key={key} className="checkbox_name" type='radio' label={value} name="rd" value={value}/>
			);
		});
		var managerNodes = this.state.managerlist.map(function(value, key){
			return(
				<Input key={key} className="checkbox_name" type='radio' label={value} name="manager" value={value}/>
			);
		});		
		return (
			<div id="newProcess">
				<form className="newprocess_form" action="" method="get">
					<Table>
						<tbody>
					      <tr>
					        <td width="24%">1.选择抽样类型<span className="red">*(必选)</span>:</td>
					        <td>
							    <TabbedArea defaultActiveKey={1}>
									<TabPane eventKey={1} tab='UI类抽样'><ul>{uiNodes}</ul></TabPane>
									<TabPane eventKey={2} tab='策略类'><ul>{strategyNodes}</ul></TabPane>
								</TabbedArea>	
					        </td>
					      </tr>
					      <tr>
					        <td width="24%">2.填写抽样名称<span className="red">*(必填)</span>:</td>
					        <td><Input type='text' placeholder='填写抽样名称' name="name"/></td>
					      </tr>
					      <tr>
					        <td width="24%">3.填写抽样收益/效果描述</td>
					        <td><Input name="desc" type="textarea" placeholder="填写抽样收益描述"/></td>
					      </tr>
					      <tr>
					        <td width="24%">4.线上运行时间<span className="red">*(必填)</span>:</td>
					        <td><Input type='text' placeholder='线上运行时间' name="duration"/>小时(必须为整数)</td>
					      </tr>
					      <tr>
					        <td width="24%">5.选择评估RD<span className="red">*(必选，单选)</span>:</td>
					        <td>{this.state.rdlist? rdNodes : 'loading'}</td>
					      </tr>	
						  <tr>
					        <td width="24%">6.选择发起者上级<span className="red">*(必选，单选)</span>:</td>
					        <td>{this.state.managerlist? managerNodes : 'loading'}</td>
					      </tr>						
						</tbody>
					</Table>
					<Input type="hidden" name="project_id" defaultValue={this.state.processid}/>
					<ButtonInput type='submit' bsStyle='primary' value='下一步' onClick={this.handleSubmit}/>						
				</form>
			</div>	
		);
	}
});

module.exports = NewProcess;