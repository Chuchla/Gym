import React, { useEffect, useState } from "react";
import AxiosInstance from "./AxiosInstance.jsx";
import { useParams } from "react-router-dom";

const CertainProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const [quantity, setQuantity] = useState(1); // domyślna ilość

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

  const handleAddToCart = async () => {
    try {
      const resp = await AxiosInstance.post("/cart/items/", {
        product_id: parseInt(id),
        quantity: parseInt(quantity),
      });
      setCartMessage("Dodano do koszyka!");
    } catch (err) {
      console.error("Nie udało się dodać do koszyka:", err);
      setCartMessage("Błąd podczas dodawania do koszyka.");
    }
  };

  if (loading) return <div>Ładowanie...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold">{product.name}</h2>
      <p>{product.description}</p>
      <p>Cena: {product.price} zł</p>

      <div className="mt-4">
        <label className="block mb-2">
          Ilość:
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="ml-2 border px-2 py-1 w-16 text-black"
          />
        </label>
        <button
          onClick={handleAddToCart}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Dodaj do koszyka
        </button>
      </div>

      {cartMessage && <p className="mt-2">{cartMessage}</p>}
    </div>
  );
};

export default CertainProduct;
