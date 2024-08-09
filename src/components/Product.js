import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Rating from "./Rating";

import close from "../assets/close.svg";

const Product = ({ item, provider, account, shopspingMart, togglePop }) => {
  const [order, setOrder] = useState(null);
  const [hasBought, setHasBought] = useState(false);

  const fetchDetails = async () => {
    const events = await shopspingMart.queryFilter("Buy");
    const orders = events.filter(
      (event) =>
        event.args.buyer === account &&
        event.args.itemId.toString() === item.id.toString()
    );

    if (orders.length === 0) return;

    const order = await shopspingMart.orders(account, orders[0].args.orderId);
    setOrder(order);
  };

  const buyHandler = async () => {
    const signer = await provider.getSigner();
    let transaction = await shopspingMart
      .connect(signer)
      .buy(item.id, { value: item.cost });
    await transaction.wait();

    setHasBought(true);
  };

  useEffect(() => {
    fetchDetails();
  }, [hasBought]);

  return (
    <div className="product">
      <div className="product__details">
        <div className="product__image">
          <img src={item.image} alt="Product" />
        </div>
        <div className="product__overview">
          <h1>{item.name}</h1>
          <Rating value={item.rating} />
          <hr />
          <p>{item.address}</p>
          <h2>{ethers.utils.formatUnits(item.cost.toString(), "ether")} ETH</h2>
          <hr />
          <h2>Overview</h2>
          <p>
            {item.description}
            Tushar joshi sabka baap hai mein wo sab hasil kr rha hu jo krna
            chahta hu or bade sapne bhi dekhte jaa rha hu saath hi saath taaki
            unko bhi samay se pura kr saku.......... see me aroud if, you are
            around!
          </p>
        </div>
        <div className="product__order">
          <h2>{ethers.utils.formatUnits(item.cost.toString(), "ether")} ETH</h2>
          <p>
            Free Delivery <br />
            <strong>
              {new Date(Date.now() + 345600000).toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </strong>
          </p>
          {item.stock > 0 ? <p>In Stock.</p> : <p>Out Of Stock.</p>}

          <button className="product__buy" onClick={buyHandler}>
            Buy Now
          </button>
          <p>
            <small>Ship From </small>Crevaaz
          </p>
          <p>
            <small>Sold By </small>Crevaaz
          </p>
          {order && (
            <div className="product__bought">
              Item Bought On <br />
              <strong>
                {new Date(
                  Number(order.time.toString() + "000")
                ).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                })}
              </strong>
            </div>
          )}
        </div>

        <button className="product__close" onClick={togglePop}>
          <img src={close} alt="Close" />
        </button>
      </div>
    </div>
  );
};

export default Product;
