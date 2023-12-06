import { useSDK } from "@metamask/sdk-react"; //메타마스크 연결
import { useEffect, useState } from "react";
import Web3 from "web3";
import TokenCard from "./components/TokenCard";
import contractAddress from "./contractAddress.json";
import "animate.css";

const App = () => {
  const [account, setAccount] = useState("");
  const [web3, setWeb3] = useState();

  const { sdk, provider } = useSDK(); //메마 연결

  const onClickMetaMask = async () => {
    try {
      const accounts = await sdk?.connect();

      setAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!provider) return;

    setWeb3(new Web3(provider));
  }, [provider]);

  return (
    <div className=" min-h-screen flex flex-col justify-center items-center font-jj ">
      <img
        src="./images/pepe2.png"
        className="opacity-20 absolute top-0 left-0 w-screen h-screen object-cover -z-10"
        alt="Background"
      />

      {account ? (
        <>
          <div>
            Hello, {account.substring(0, 7)}...
            {account.substring(account.length - 5)}
          </div>
          {contractAddress.map((v, i) => (
            <TokenCard
              key={i}
              account={account}
              web3={web3}
              address={v.address}
              owner={v.owner}
              walletAccount={v.walletAccount}
            />
          ))}
          <button onClick={() => setAccount("")}>
            🦊
            <br />
            MetaMask Logout
          </button>
        </>
      ) : (
        <button onClick={onClickMetaMask}>
          <img
            className="w-96 h-96  animate__animated animate__pulse __zoomIn animate__verySlow animate__infinite"
            src="./images/fox.png"
            alt="fox"
          />
        </button>
      )}
    </div>
  );
};

export default App;
