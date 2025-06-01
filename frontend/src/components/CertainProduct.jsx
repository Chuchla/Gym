import React, { useEffect, useState } from "react";
import AxiosInstance from "./AxiosInstance.jsx";
import { useParams } from "react-router-dom";

const CertainProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const resp = await AxiosInstance.get(`/products/${id}`);
        setProduct(resp.data);
        console.log(resp.data);
      } catch (err) {
        console.error("Nie udalo sie pobrac produktu: ", err);
        setError("Nie udalo sie wczytac produktu");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  return <div>CertainProduct</div>;
};
export default CertainProduct;
