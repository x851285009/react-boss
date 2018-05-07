/*
选择用户头像的UI组件
 */

import React, {Component} from 'react'
import {List, Grid} from 'antd-mobile'
import PropTypes from 'prop-types'

export default class HeaderSelector extends Component {
	static propTypes = {
		setHeader: PropTypes.func.isRequired 
	}
	state = {
		icon: null
	} 

	constructor(props){
		super(props);
		this.headerList = []
		for (let i = 0; i < 20; i++) {
			this.headerList.push({
				text: '头像' + (i + 1),
				icon: require(`../../assets/images/头像${i+1}.png`)
			})
		}
	}
	handleClick = ({text, icon}) => {
		 // 更新当前组件状态
		 this.setState({icon})
		 // 调用函数更新父组件状态
		this.props.setHeader(text)
	}
	render () {
		const {icon} = this.state;
		const listHeader = !icon ? '请选择头像' : (<div>以选择的头像:<img src={icon} alt='头像' /></div>)
		return (
			<List renderHeader={() => listHeader}>
				<Grid data={this.headerList} columnNum={5} onClick={this.handleClick}></Grid>
			</List>
		)
	}
}