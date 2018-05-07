import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {TabBar} from 'antd-mobile';
import {withRouter} from 'react-router-dom';

const Item = TabBar.Item;
class NavFooter extends Component {
    static propTypes = {
        navList: PropTypes.array.isRequired,
        unReadCount: PropTypes.number.isRequired
    }
    render () {
        let {navList, unReadCount} = this.props;
        navList = navList.filter(nav => !nav.hide);
        const path = this.props.location.pathname; //请求的 path
        return (
            <TabBar tintColor='#fa594d' unselectedTintColor='#666'>
                {
                    navList.map((nav) => (
                        <Item key={nav.path}
                              title={nav.text}
                              badge={nav.path==='/message' ? unReadCount : 0}
                              icon={{uri: require(`./imgs/${nav.icon}.png`)}}
                              selectedIcon={{uri: require(`./imgs/${nav.icon}-selected.png`)}}
                              selected={path === nav.path}
                              onPress={() => this.props.history.replace(nav.path)}/>
                    ))
                }
            </TabBar>
        )
    }
}
// 向外暴露withRouter()包装产生的组件
// 内部会向组件中传入一些路由组件特有的属性: history/location/math
export default withRouter(NavFooter)