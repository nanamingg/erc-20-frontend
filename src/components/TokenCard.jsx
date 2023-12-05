import { useEffect, useState } from "react";

import mintTokenAbi from "../mintTokenAbi.json";

const TokenCard = ({ account, web3, address, owner, walletAccount }) => {
  const [name, setName] = useState("TOKEN");
  const [symbol, setSymbol] = useState("TOKEN");
  const [balance, setBalance] = useState(0);
  const [contract, setContract] = useState();
  const [inputAccount, setInputAccount] = useState("");
  const [inputValue, setInputValue] = useState("0");

  const getName = async () => {
    try {
      const response = await contract.methods.name().call();

      setName(response);
    } catch (error) {
      console.error(error);
    }
  };

  const getSymbol = async () => {
    try {
      const response = await contract.methods.symbol().call();

      setSymbol(response);
    } catch (error) {
      console.error(error);
    }
  };

  const getBalanceOf = async () => {
    try {
      const response = await contract.methods.balanceOf(account).call();

      console.log(typeof web3.utils.fromWei(response, "ether"));

      setBalance(Number(web3.utils.fromWei(response, "ether")));
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmitSend = async (e) => {
    try {
      e.preventDefault();

      await contract.methods
        .transfer(inputAccount, web3.utils.toWei(inputValue, "ether"))
        .send({
          from: account,
        });

      getBalanceOf(); // 잔액갱신

      setInputAccount("");
      setInputValue("0");
      alert("성공적으로 토큰을 전송하였습니다.");
    } catch (error) {
      console.log(error);
    }
  };

  const onClickClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(walletAccount);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!contract || !account) return;

    getName();
    getSymbol();
    getBalanceOf();
  }, [contract, account]);

  useEffect(() => {
    if (!web3) return;

    setContract(new web3.eth.Contract(mintTokenAbi, address));
  }, [web3]);

  return (
    <li className="flex flex-col gap-1 mt-4">
      <div>
        <button className="text-blue-500 underline" onClick={onClickClipBoard}>
          {owner}
        </button>
        님이 발행한 코인입니다.
      </div>
      <div className="bg-blue-100 w-96 flex">
        <span className=" bg-gray-100">{name}</span>
        <br></br>
        <span className=" bg-gray-300">{balance.toFixed(4)}</span>
        <span className=" bg-gray-100">{symbol}</span>
        <form className="flex" onSubmit={onSubmitSend}>
          <input
            className="bg-red-100"
            type="text"
            value={inputAccount}
            onChange={(e) => setInputAccount(e.target.value)}
          />
          <input
            className="bg-blue-100"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </li>
  );
};

export default TokenCard;
