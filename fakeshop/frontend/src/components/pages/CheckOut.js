// หน้าสั่งซื้อ /checkout มีเวลาแต่งaddress
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputAddress from '../home/InputAddress'
// function

import {
  getUserCart,
  saveAddress,
  saveOrder,
  emptyCart,
} from "../functions/users";
import { useNavigate } from 'react-router-dom'

import ReactQuill from "react-quill"; // ES6
import "react-quill/dist/quill.snow.css"; // ES6 css
import { toast } from "react-toastify";

const CheckOut = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const navigate = useNavigate()


  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);
  useEffect(() => {
    getUserCart(user.token).then((res) => {
      console.log(res.data);
      setProducts(res.data.products);
      setTotal(res.data.cartTotal);
    });
  }, []);

  const handleSaveAddress = () => {
    console.log(address);
    saveAddress(user.token, address).then((res) => {
      console.log(res.data);
      if (res.data.ok) {
        toast.success("บันทึกข้อมูล");
        setAddressSaved(true);
      }
    });
  };

  const handleCreateOrder = () => {
      //path /user/order
    saveOrder(user.token).then((res) => {
      // console.log(res.data);
      // clear DB
      emptyCart(user.token);
      // clear store
      dispatch({
        type: "ADD_TO_CART",
        payload: [],
      });
      // clear local localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("cart");
      }

      toast.success("Save Order Success");
      //สั่งซื้อเสจ ส่งค่าไป
      navigate('/user/history')
    });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-6">
          <h4>กรอกข้อมูลสั่งซื้อ</h4>
          <br />
          {/* <ReactQuill value={address} onChange={setAddress} /> */}
          <InputAddress value={address} onChange={setAddress} />
          <button className="btn btn-primary m-2" onClick={handleSaveAddress}>
            Save Address
          </button>
        </div>  

        <div className="col-md-6">
          <h4>Order </h4>
          <hr />
          <p>
            Product <b>{products.length}</b>
          </p>
          <hr />
          <p>List of product</p>
          {products.map((item, i) => (
            <div key={i}>
              <p>
                {item.product.title} x {item.count} = {item.price * item.count}
              </p>
            </div>
          ))}
          <hr />
          Total : <b>{total}</b>
          <br />
          <button
            onClick={handleCreateOrder}
            disabled={!addressSaved || !products.length}
            className="btn btn-primary mt-3"
          >
            สั่งสินค้า
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
