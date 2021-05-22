import React, {Component} from 'react';
import {Card, Icon, List,} from "antd";
import LinkButton from "../../components/link-button";
import {BASE_IMG_URL} from "../../utils/constants";
import {reqCategory} from "../../api";

const Item = List.Item

class ProductDetail extends Component {
    state = {
        cName1: '',
        cName2: '',
    }

    async componentDidMount() {
        const {pCategoryId, categoryId} = this.props.location.state.product
        if (pCategoryId === '0') {
            const result = await reqCategory(categoryId)
            const cName1 = result.data.name
            this.setState({cName1})
        } else {
            const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
            const cName1 = results[0].data.name
            const cName2 = results[1].data.name
            this.setState({
                cName1,
                cName2
            })
        }
    }

    render() {
        const {name, desc, price, detail, imgs} = this.props.location.state.product
        const {cName1, cName2} = this.state
        const title = (
            <span>
                <LinkButton>
                    <Icon type='arrow-left' style={{marginRight: 10, fontSize: 20}}
                          onClick={() => this.props.history.goBack()}/>
                </LinkButton>
                <span>Product Detail</span>
            </span>
        )
        return (
            <Card title={title} className='product-detail'>
                <List>
                    <Item className='left'>
                        <span>Product Name:</span>
                        <span>{name}</span>
                    </Item>
                    <Item className='left'>
                        <span>Product Description:</span>
                        <span>{desc}</span>
                    </Item>
                    <Item className='left'>
                        <span>Product Price:</span>
                        <span>{price}元</span>
                    </Item>
                    <Item className='left'>
                        <span>Classification:</span>
                        <span>{cName1} {cName2 ? ' -->' + cName2 : ''}</span>
                    </Item>
                    <Item className='left'>
                        <span>Product Picture:</span>
                        <span>
                          {
                              imgs.map(img => (
                                  <img key={img} src={BASE_IMG_URL + img} className="product-img" alt="img"/>
                              ))
                          }
                        </span>
                    </Item>
                    <Item className='left'>
                        <span>Product Detail:</span>
                        <span dangerouslySetInnerHTML={{__html: detail}}></span>
                    </Item>
                </List>
            </Card>
        );
    }
}

export default ProductDetail;
