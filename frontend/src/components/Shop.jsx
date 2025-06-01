import React, { useEffect, useState } from "react";
import Section from "./Section.jsx";
import Heading from "./Heading.jsx";
import AxiosInstance from "./AxiosInstance.jsx";
import { Link } from "react-router-dom";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const resp = await AxiosInstance.get(`/products/`);
        setProducts(resp.data);
        console.log(resp.data);
      } catch (err) {
        console.error("blad podczas ladowania produktow: ", err);
        setError("Nie udało się pobrac produktów");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Section>
      <Heading title={"Zakup nasz plany treningowe!"} />
      <div className={"flex flex-col"}>
        {products.map((item) => (
          <Link
            className={"border-2 border-n-5"}
            key={item.id}
            to={`/product/${item.id}`}
          >
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </Section>
  );
};
export default Shop;
