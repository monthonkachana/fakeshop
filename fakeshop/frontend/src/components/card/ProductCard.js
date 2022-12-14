//ที่เก็บสินค้าเข้าดู
import React from "react";
import { Card } from "antd";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux'
import { SearchOutlined ,createFromIconfontCN  } from '@ant-design/icons';
// lodash
import _ from 'lodash'
import TextArea from "antd/lib/input/TextArea";

const { Meta } = Card;

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  

  const MyIcon = createFromIconfontCN
  
  const { _id, title, description, images,price } = product;
  // console.log(product);
  const handleAddToCart = () => {
    let cart = []
    if (localStorage.getItem('cart')) {
      cart = JSON.parse(localStorage.getItem('cart'))
    }
    cart.push({
      ...product,
      count: 1
    })
    // unique ข้อมูลที่ไม่ซ้ำกัน
    let unique = _.uniqWith(cart, _.isEqual)

    localStorage.setItem("cart", JSON.stringify(unique))


    dispatch({
      type: "ADD_TO_CART",
      payload: unique
    })
    dispatch({
      //เรียกใช้ drawer app to cart
      type: 'SET_VISIBLE',
      payload: true
    })

  }

  return (
    <Card
      hoverable
      cover={
        <img
          className="p-1"
          style={{ height: "150px", objectFit: "cover" }}
          alt="example"
          src={images && images.length ? images[0].url : ""}
        />
      }
      actions={[
        <Link to={'/product/' + _id}>
          <EyeOutlined className="text-warning" />
        </Link>
        ,
        <ShoppingCartOutlined
          onClick={handleAddToCart}
          className="text-danger"
        />,
        
      ]}
    >
      <Meta title={title} description={description} style={{float:"left"}}  />
      <Meta title={price} style={{float:"right" }} />
      
    </Card>
  );
};

export default ProductCard;
