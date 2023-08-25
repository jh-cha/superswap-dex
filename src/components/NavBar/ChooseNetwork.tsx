import React from "react";
import { useTranslation } from "react-i18next";
import ethLogo from "../../assets/images/eth.png";
import bscLogo from "../../assets/images/bsc.png";
import maticLogo from "../../assets/images/matic.svg";
import { ExternalLinkIcon } from "@heroicons/react/outline";
import { Chain } from "../../types";
import ChainContext from "../../context/chain-context";

type ChooseNetworkProps = {
  isChoosing(val: boolean): void;
  activeChain: Chain;
  chooseChain(val: Chain): void;
};

const ChooseNetwork = ({
  isChoosing,
  activeChain,
  chooseChain,
}: ChooseNetworkProps): JSX.Element => {
  const { t } = useTranslation();
  const chainCtx = React.useContext(ChainContext);

  const handleChoice = (val: Chain) => {
    return (event: React.MouseEvent) => {
      event.preventDefault();
      chooseChain(val);
      chainCtx.changeChain(val);
      isChoosing(false);
    };
  };

  return (
    <div
      className="absolute top-16 bg-white rounded-2xl min-w-[250px] min-h-40 p-4"
      onMouseLeave={() => isChoosing(false)}
    >
      {/* Header */}
      <div className="w-full h-8 text-base text-gray-500">
        {t("choose-network.select")}
      </div>

      {/* Ethereum */}
      <div
        className={`w-full cursor-pointer rounded-lg ${
          activeChain === "eth" ? "mb-3 p-4 bg-gray-100" : "mb-4 p-2"
        }`}
      >
        <div
          className={`w-full flex items-center justify-between ${
            activeChain === "eth" ? "mb-3" : ""
          }`}
          onClick={handleChoice("eth")}
        >
          <div className="flex items-center">
            <img src={ethLogo} alt="eth" className="h-5 w-5 mr-3" />
            <span>{t("choose-network.networks.eth")}</span>
          </div>
          {activeChain === "eth" && (
            <span className="w-2 h-2 bg-green-800 rounded-full"></span>
          )}
        </div>
        {activeChain === "eth" && (
          <a
            href="https://ropsten.etherscan.io"
            target="_blank"
            rel="noreferrer"
            className="flex justify-between items-center w-full pl-1 hover:underline cursor-pointer"
          >
            <span className="text-gray-500 text-xs font-semibold  underline-offset-1 mr-1">
              {t("choose-network.scans.eth")}
            </span>
            <ExternalLinkIcon className="w-4 h-4 text-gray-500" />
          </a>
        )}
      </div>

      {/* Polygon
      <div
        className={`w-full cursor-pointer rounded-lg ${
          activeChain === "polygon" ? "mb-3 p-4 bg-gray-100" : "mb-4 p-2"
        }`}
      >
        <div
          className={`w-full flex items-center justify-between ${
            activeChain === "polygon" ? "mb-3" : ""
          }`}
          onClick={handleChoice("polygon")}
        >
          <div className="flex items-center">
            <img src={maticLogo} alt="matic" className="h-5 w-5 mr-3" />
            <span>{t("choose-network.networks.matic")}</span>
          </div>
          {activeChain === "polygon" && (
            <span className="w-2 h-2 bg-green-800 rounded-full"></span>
          )}
        </div>
        {activeChain === "polygon" && (
          <a
            href="https://mumbai.polygonscan.com/"
            target="_blank"
            rel="noreferrer"
            className="flex justify-between items-center w-full pl-1 hover:underline cursor-pointer"
          >
            <span className="text-gray-500 text-xs font-semibold  underline-offset-1 mr-1">
              {t("choose-network.scans.matic")}
            </span>
            <ExternalLinkIcon className="w-4 h-4 text-gray-500" />
          </a>
        )}
      </div>

      {/* Bsc */}
      {/* <div
        className={`w-full cursor-pointer rounded-lg ${
          activeChain === "bsc" ? "mb-3 p-4 bg-gray-100" : "p-2"
        }`}
      >
        <div
          className={`w-full flex items-center justify-between ${
            activeChain === "bsc" ? "mb-3" : ""
          }`}
          onClick={handleChoice("bsc")}
        >
          <div className="flex items-center">
            <img src={bscLogo} alt="bsc" className="h-5 w-5 mr-3" />
            <span>{t("choose-network.networks.bsc")}</span>
          </div>
          {activeChain === "bsc" && (
            <span className="w-2 h-2 bg-green-800 rounded-full"></span>
          )}
        </div>
        {activeChain === "bsc" && (
          <a
            href="https://testnet.bscscan.com/"
            target="_blank"
            rel="noreferrer"
            className="flex justify-between items-center w-full pl-1 hover:underline cursor-pointer"
          >
            <span className="text-gray-500 text-xs font-semibold  underline-offset-1 mr-1">
              {t("choose-network.scans.bsc")}
            </span>
            <ExternalLinkIcon className="w-4 h-4 text-gray-500" />
          </a>
        )}
      </div> */}
    </div>
  );
};

export default ChooseNetwork;
