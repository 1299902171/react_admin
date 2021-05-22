import React, {Component} from 'react';
import {Switch,Route,Redirect} from "react-router-dom";
import ProductAddUpdate from "./add-update";
import ProductHome from "./home";
import ProductDetail from "./detail";
import './product.less'


class Product extends Component {
    render() {
        return (
            <Switch>
                <Route exact path='/product' component={ProductHome}/>
                <Route path='/product/addUpdate' component={ProductAddUpdate}/>
                <Route path='/product/detail' component={ProductDetail}/>
                <Redirect to='/product'/>
            </Switch>
        );
    }
}

export default Product;
