import React from "react";
import { useTranslation } from "react-i18next";
import { ChevronDownIcon, DotsHorizontalIcon } from "@heroicons/react/solid";
import ethLogo from "../../assets/images/eth.png";
import NavLogo from "./NavLogo";
import NavTabSwitcher from "./NavTabSwitcher";
import useWindowWidth from "../../hooks/useWindowWidth";
import MoreOptionsDropDown from "./MoreOptionsDropDown";
import ThemeContext from "../../context/theme-context";
import ChooseNetwork from "./ChooseNetwork";
import type { Chain } from "../../types";
import LoginMethodModal from "../UI/LoginMethodModal";
import Web3 from 'web3';

type NavBarProps = {
  loginModalOpen: boolean;
  isAuthenticated: boolean;
  isAuthenticating: boolean;

  setLoginModalOpen(val: boolean): void;
  setisAuthenticated(val: boolean): void;
  setisAuthenticating(val: boolean): void;
};

const NavBar = ({loginModalOpen, isAuthenticated, isAuthenticating, setLoginModalOpen, setisAuthenticated, setisAuthenticating}: NavBarProps): JSX.Element => {
  const { t } = useTranslation();
  const windowWidth = useWindowWidth();
  const isDesktop = windowWidth >= 920;
  const isBigDesktop = windowWidth >= 1250;
  const [address, setAddress] = React.useState("");
  const [balance, setBalance] = React.useState<string | null>("");
  const { isLight } = React.useContext(ThemeContext);
  const [chooseNetwork, setChooseNetwork] = React.useState(false);
  const [activeChain, setActiveChain] = React.useState<Chain>("eth");
  const [showOptions, setShowOptions] = React.useState(false);
  
  React.useEffect(() => {
    getAccount();
    getBalance();
  }, [isAuthenticated]);
  
  const getAccount = async () => {
    if (typeof(window.ethereum) === "undefined") {
      console.log("window.ethereum is undefined");
    }
    else{
      const web3 = new Web3(window.ethereum);
      await web3
        .eth
        .getAccounts((error, result) => {
          if (error) console.log(error);
          else {
              if (result[0] !== undefined) {
                  setAddress(result[0]);
              } else {
                  setAddress("");
              }
          } 
        });
    }
  };
  
  const getBalance = async () => {
    if (typeof(window.ethereum) === "undefined") {
      console.log("window.ethereum is undefined");
    }else if (address) {
      const web3 = new Web3(window.ethereum);
      const balance = await web3.eth.getBalance(address);
      let ethBalance = Number(web3.utils.fromWei(balance, "ether"));
      setBalance(ethBalance.toFixed(3));
    }
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      getAccount();
      getBalance();
    }
  }, [isAuthenticated, address, balance]);

  return (
    <>
      {loginModalOpen && <LoginMethodModal 
        isAuthenticated={isAuthenticated}
        isAuthenticating={isAuthenticating}
        setisAuthenticated={setisAuthenticated}
        setisAuthenticating={setisAuthenticating}
        close={setLoginModalOpen}
      />}
      <nav className="w-screen h-20 bg-transparent p-3 mb-28">
        <div
          className={`w-full h-full flex items-center ${!isDesktop && "justify-between"}`}
        >
          <NavLogo />
          {isDesktop && <NavTabSwitcher />}
          <div
            className={`flex justify-end ${
              isDesktop ? "basis-1/4" : "basis-3/4"
            } space-x-2 h-12`}
          >
            <div
              className={`flex items-center rounded-2xl ${
                isLight ? "bg-white" : "bg-blue-600"
              } p-2 select-none relative`}
              onMouseEnter={() => setChooseNetwork(true)}
            >
              {activeChain === "eth" && (
                <img src={ethLogo} alt="token logo" className="h-6 w-6 mr-1" />
              )}
              {/* {activeChain === "polygon" && (
                <img src={maticLogo} alt="token logo" className="h-6 w-6 mr-1" />
              )}
              {activeChain === "bsc" && (
                <img src={bscLogo} alt="token logo" className="h-6 w-6 mr-1" />
              )} */}
              {isBigDesktop && (
                <span
                  className={`flex items-center mr-1 text-sm select-none ${
                    isLight ? "text-black" : "text-white"
                  }`}
                >
                  {activeChain === "eth" && t("choose-network.networks.eth")}
                  {/* {activeChain === "polygon" && t("choose-network.networks.matic")}
                  {activeChain === "bsc" && t("choose-network.networks.bsc")} */}
                </span>
              )}
              <ChevronDownIcon
                className={`h-4 w-4 ${isLight ? "text-black" : "text-white"}`}
              />
              {chooseNetwork && (
                <ChooseNetwork
                  isChoosing={setChooseNetwork}
                  activeChain={activeChain}
                  chooseChain={setActiveChain}
                />
              )}
            </div>

            {!isAuthenticated && (
              <div
                className={isLight ? styles.lightButton : styles.darkButton}
                onClick={() => setLoginModalOpen(true)}
              >
                {t("nav.connect")}
              </div>
            )}

            {/* Trigger logout */}
            {isAuthenticated && (
              <div
                className={isLight ? styles.connectLight : styles.connectDark}
                onClick={() => setLoginModalOpen(true)}
              >
                <span className="p-1 text-xs">value: {balance}</span>
                <span className={isLight ? styles.addressLight : styles.addressDark}>
                  {address.slice(0, 6) + "..." + address.slice(-4)}
                </span>
              </div>
            )}

            <div
              className={`flex items-center justify-center rounded-2xl py-2 px-3 ${
                isLight ? "bg-white" : "bg-blue-600"
              }`}
            >
              <span
                className="h-full w-full flex items-center cursor-pointer"
                onClick={() => setShowOptions(!showOptions)}
              >
                <DotsHorizontalIcon
                  className={`h-5 w-5 ${isLight ? ["fill-black"] : "fill-white"}`}
                />
              </span>
              {showOptions && <MoreOptionsDropDown showOptions={setShowOptions} />}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;

const styles = {
  lightButton:
    "bg-orange-300 rounded-2xl p-2 border-2 border-white text-white text-light text-sm md:w-40 cursor-pointer select-none flex justify-center items-center",
  darkButton:
    "bg-blue-500 rounded-2xl p-2 border-2 border-blue-400 text-white text-light text-sm md:w-40 cursor-pointer select-none flex justify-center items-center",
  connectLight:
    "rounded-2xl bg-white flex justify-between items-center flex-1 max-w-[220px] p-1 font-bold md:max-w-[220px] cursor-pointer",
  connectDark:
    "rounded-2xl bg-blue-600 flex justify-between items-center flex-1 max-w-[220px] text-white p-1 font-bold md:max-w-[220px] cursor-pointer",
  addressLight:
    "text-sm flex-1 rounded-2xl h-full bg-gray-200 flex items-center justify-center",
  addressDark:
    "text-sm flex-1 rounded-2xl h-full bg-blue-500 flex items-center justify-center",
};
