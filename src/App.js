import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Navigation from "./components/Navigation";
import Section from "./components/Section";
import Product from "./components/Product";

// ABIs
import ShoppingMart from "./abis/ShoppingMart.json";

// Config
import config from "./config.json";

function App() {
  const [provider, setProvider] = useState(null);
  const [shoppingMart, setShoppingMart] = useState(null);

  const [account, setAccount] = useState(null);

  const [electronics, setElectronics] = useState(null);
  const [clothing, setClothing] = useState(null);
  const [toys, setToys] = useState(null);

  const [item, setItem] = useState({});
  const [toggle, setToggle] = useState(false);

  const togglePop = (item) => {
    setItem(item);
    toggle ? setToggle(false) : setToggle(true);
  };

  const loadBlockchainData = async () => {
    //connect to blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    window.ethereum.on("accountsChanged", async () => {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);
    });

    const network = await provider.getNetwork();
    console.log(network);
    // connect to smart contract (create JS version)
    const shoppingMart = new ethers.Contract(
      config[network.chainId].shoppingMart.address,
      ShoppingMart,
      provider
    );

    // here we create smart contract in js and now save in state
    setShoppingMart(shoppingMart);

    // load products
    const item1 = [];

    for (var i = 0; i < 9; i++) {
      const item = await shoppingMart.items(i + 1);
      item1.push(item);
    }

    const electronics = item1.filter((item) => item.category === "electronics");
    const clothing = item1.filter((item) => item.category === "clothing");
    const toys = item1.filter((item) => item.category === "toys");

    setElectronics(electronics);
    setClothing(clothing);
    setToys(toys);
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <h2>ShoppingMart Best Seller</h2>

      {electronics && clothing && toys && (
        <>
          <Section
            title={"Clothing & Jewellery"}
            items={clothing}
            togglePop={togglePop}
          />
          <Section
            title={"Electronics & Gadgets"}
            items={electronics}
            togglePop={togglePop}
          />
          <Section title={"Toys & Gaming"} items={toys} togglePop={togglePop} />
        </>
      )}
      {toggle && (
        <Product
          item={item}
          provider={provider}
          account={account}
          shopspingMart={shoppingMart}
          togglePop={togglePop}
        />
      )}
    </div>
  );
}

export default App;
