import React from "react";
import { useTranslation } from "react-i18next";
import { XIcon } from "@heroicons/react/solid";
import {
  DuplicateIcon,
  ExternalLinkIcon,
  CheckCircleIcon,
} from "@heroicons/react/outline";
import wc from "../../assets/images/wc.svg";
import metamask from "../../assets/images/metamask.png";
import ThemeContext from "../../context/theme-context";
import { useMoralis } from "react-moralis";
import { Oval } from "react-loader-spinner";
import ChainContext from "../../context/chain-context";
import { useState, useEffect } from "react";
import Web3 from "web3";

declare global {
  interface Window {
    ethereum: any;
  }
}

type LoginMethodModalProps = {
  isAuthenticated: boolean;
  isAuthenticating: boolean;

  setisAuthenticated(val: boolean): void;
  setisAuthenticating(val: boolean): void;
  close(val: boolean): void;
};

const LoginMethodModal = ({ isAuthenticated, isAuthenticating, setisAuthenticated, setisAuthenticating, close }: LoginMethodModalProps): JSX.Element => {
  const { t } = useTranslation();
  const themeCtx = React.useContext(ThemeContext);
  const chainCtx = React.useContext(ChainContext);
  const [isCopying, setisCopying] = React.useState(false);
  const [account, setAccount] = useState("");
  const [shortAddress, setShortAddress] = useState("");
  const infuraGoerliNetwork = process.env.REACT_APP_INFURA_URL!;

  const loginMetamask = async () => {
    console.log("loginMetamask");
  
    try{
      const accounts = await window.ethereum.request({
        // MetaMask에서 지원하는 account 연결 메소드
        method: "eth_requestAccounts",
      });
      setAccount(accounts);
      setShortAddress(String(accounts).slice(0, 4) + "..." + String(accounts).slice(-2));
  
      setisAuthenticated(true);
      setisAuthenticating(false);
    }catch (error) {
      console.error("loginMetamask Error", error);
    }
  };

  const logoutMetamask = async () => {
    await window.ethereum.request({
      // MetaMask에서 지원하는 연결 해제 메소드
      method: "wallet_requestPermissions",
      params: [{ eth_accounts: {} }],
    });

    setAccount("");
    setShortAddress("");
    setisAuthenticated(false);
    setisAuthenticating(false);
  }

  const handleCopy = () => {
    setisCopying(true);
    navigator.clipboard.writeText(account);
    setTimeout(() => {
      setisCopying(false);
    }, 1000);
  };

  return (
    <>
      <div
        className="absolute w-screen h-screen bg-gray-500 z-40 opacity-30"
        onClick={() => close(false)}
      ></div>
      {/* Header */}
      <div className={themeCtx.isLight ? styles.lightContainer : styles.darkContainer}>
        <div className="h-10 w-full flex flex-row justify-between items-center px-5">
          {!isAuthenticated && (
            <span className="font-semibold text-lg">{t("login.connect")}</span>
          )}
          {isAuthenticated && (
            <span className="font-semibold text-lg">{t("login.account")}</span>
          )}
          <XIcon className="h-6 w-6 cursor-pointer" onClick={() => close(false)} />
        </div>

        {/* Login choices */}
        {!isAuthenticating && !isAuthenticated && (
          <div className="flex-1 rounded-2xl p-2 flex flex-col justify-between">
            <div
              className={`w-full h-[73px] flex justify-between items-center py-2 px-4 rounded-2xl ${
                themeCtx.isLight ? "bg-gray-100" : "bg-blue-800"
              }  cursor-pointer`}
              onClick={loginMetamask}
            >
              <span>{t("login.metamask")}</span>
              <img src={metamask} alt="metamask" className="h-8 w-8" />
            </div>
          </div>
        )}

        {/* Copy and address */}
        {isAuthenticating && (
          <div className="flex flex-1 justify-center items-center">
            <div className="flex flex-col justify-center items-center">
              <Oval
                ariaLabel="loading-indicator"
                height={50}
                width={50}
                strokeWidth={5}
                color="black"
                secondaryColor="grey"
              />
              <span>{t("login.authenticate")}</span>
            </div>
          </div>
        )}
        {isAuthenticated && (
          <div className="flex flex-1 p-5 rounded-2xl">
            <div className="flex flex-1 flex-col border rounded-2xl">
              <div className="px-2 pt-3 flex items-center justify-between w-full">
                <span
                  className={`${
                    themeCtx.isLight ? "text-gray-500" : " text-white"
                  } p-2 font-medium text-xs md:text-base w-2/3`}
                >
                  {t("login.connected", { wallet: "metamask" })}
                </span>
                <span
                  className={`w-1/3 h-9 text-sm flex items-center justify-center rounded-2xl ${
                    themeCtx.isLight
                      ? "border border-orange-400 text-orange-400"
                      : "bg-gray-600 text-white"
                  } cursor-pointer`}
                  onClick={logoutMetamask}
                >
                  {t("login.disconnect")}
                </span>
              </div>

              <div className="px-4 py-2 text-xl font-semibold">{shortAddress}</div>

              <div
                className={`p-4 text-xl font-semibold flex justify-between ${
                  themeCtx.isLight ? " text-gray-500" : " text-white"
                }`}
              >
                {!isCopying && (
                  <span
                    className="flex items-center text-sm cursor-copy"
                    onClick={handleCopy}
                  >
                    <DuplicateIcon className="h-4 w-4 mr-1" />
                    {t("login.copy")}
                  </span>
                )}
                {isCopying && (
                  <span className=" flex items-center text-sm" onClick={handleCopy}>
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    {t("login.copied")}
                  </span>
                )}
                {chainCtx.chain === "eth" && (
                  <a
                    href={`https://etherscan.io/address/${account}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm flex "
                  >
                    <ExternalLinkIcon className="h-4 w-4" />
                    {t("login.view")}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const styles = {
  lightContainer: `absolute w-[350px] h-[260px] bottom-0 left-0 top-0 right-0 m-auto bg-white rounded-t-2xl z-40 py-5 flex flex-col md:w-[450px] md:h-[220px] md:pb-2 rounded-xl md:py-2 md:pb-0`,
  darkContainer:
    "absolute w-[350px] h-[260px] bottom-0 left-0 top-0 right-0 m-auto bg-blue-900 rounded-t-2xl z-40 py-5 flex flex-col md:w-[450px] md:h-[220px] md:pb-2 rounded-xl md:py-2 md:pb-0 text-gray-200",
};

export default LoginMethodModal;
