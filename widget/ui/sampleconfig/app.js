/** @jsx React.DOM */
var Mynav = require('samplemis:widget/ui/commonComponent/nav/nav.js');
var ValueRegist = require('samplemis:widget/ui/sampleconfig/component/valueregist.js');
var RuleConfig = require('samplemis:widget/ui/sampleconfig/component/ruleconfig.js');
var TrafficManager = require('samplemis:widget/ui/sampleconfig/component/trafficmanager.js');
var Schemeconfig = require('samplemis:widget/ui/sampleconfig/component/schemeconfig.js');
var SubmitConfig = require('samplemis:widget/ui/sampleconfig/component/submitconfig.js');
var Button = ReactBootstrap.Button;
var TabbedArea = ReactBootstrap.TabbedArea;
var TabPane = ReactBootstrap.TabPane;
var BaseMixin = require('samplemis:widget/ui/commonComponent/baseMixin/baseMixin.js');

var SampleConfigApp = React.createClass({
	mixins: [BaseMixin],
	getInitialState: function(){
		return {
			strategylist: [],
			allocatedlist: []
		}
	},
	componentWillMount: function(){
		var that = this;
		var strategyurl = that.host + '/querystrategy?task_id=' + that.props.taskid;
		that.doStategyListService(strategyurl);
		var sampleurl = that.host + '/querysample?task_id=' + that.props.taskid; 
		that.doAllocatedListService(sampleurl);
	},
	doStategyListService: function(strategyurl){
		var that = this;
		this.doService(strategyurl,function(data){
			that.setState({
				strategylist: data
			});
		});
	},
	doAllocatedListService: function(sampleurl){
		var that = this;
		this.doService(sampleurl,function(data){
			that.setState({
				allocatedlist: data
			});
		});
	},
	handleSample: function(){
		var that = this;
		var url = that.host + '/submittask?id=' + that.props.taskid;
		$.ajax({
			url: url,
			type: 'POST',
			dataType: 'json'
		})
		.done(function(res) {
			if(res.status == 0){
				location.reload();
			}else{
				alert(res.err_msg);
			}
		})
		.fail(function() {

		})
		.always(function() {

		});
	},
	render: function() {
		var paneStyle = {
			padding: "10px"
		};
		return (
		  <TabbedArea defaultActiveKey={1}>
		    <TabPane style={paneStyle} eventKey={1} tab='step1:新变量注册'><ValueRegist status={this.props.status}/></TabPane>
		    <TabPane style={paneStyle} eventKey={2} tab='step2:抽样规则配置'><RuleConfig status={this.props.status} taskid={this.props.taskid} strategylist={this.state.strategylist} doStategyListService={this.doStategyListService}/></TabPane>
		    <TabPane style={paneStyle} eventKey={3} tab='step3:流量管理'><TrafficManager status={this.props.status} taskid={this.props.taskid} allocatedlist={this.state.allocatedlist} doAllocatedListService={this.doAllocatedListService}/></TabPane>
		    <TabPane style={paneStyle} eventKey={4} tab='step4:方案配置'><Schemeconfig status={this.props.status} taskid={this.props.taskid} allocatedlist={this.state.allocatedlist} strategylist={this.state.strategylist} doStategyListService={this.doStategyListService}/></TabPane>
		    <TabPane style={paneStyle} eventKey={5} tab='step5:提交抽样配置'><SubmitConfig handleSample={this.handleSample} status={this.props.status}/></TabPane>
		  </TabbedArea>
		);
	}

});

module.exports = SampleConfigApp;