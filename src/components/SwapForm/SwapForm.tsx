import React from "react";
import SwapFormHeader from "./SwapFormHeader";
import SwapFormInput from "./SwapFormInput";
import SwapButton from "./SwapButton";
import ThemeContext from "../../context/theme-context";
import type { TokenList } from "../../types";
import type { SelectedToken } from "../../types";
import ChainContext from "../../context/chain-context";
import { useTranslation } from "react-i18next";
import {ethers} from "ethers";
import {uniswapUtils, utils} from "../../utils/utils";

type SwapFormProps = {
  tokenList: TokenList;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  
  setLoginModalOpen(val: boolean): void;
  openTransactionModal(val: boolean): void;
  getTxHash(hash: string): void;
  getErrorMessage(message: string): void;
  setMadeTx(val: boolean): void;
  setisAuthenticated(val: boolean): void;
  setisAuthenticating(val: boolean): void;
};

const SwapForm = ({
  tokenList,
  isAuthenticated,
  isAuthenticating,
  setLoginModalOpen,
  openTransactionModal,
  getTxHash,
  getErrorMessage,
  setMadeTx,
  setisAuthenticated,
  setisAuthenticating,
}: SwapFormProps): JSX.Element => {
  const { isLight } = React.useContext(ThemeContext);
  const { chain } = React.useContext(ChainContext);
  const { t } = useTranslation();
  const [firstToken, setFirstToken] = React.useState<SelectedToken>({name:"Anemo Token", symbol:"ANM", address:process.env.REACT_APP_ANM_ADDRESS, decimals: 0});
  const [secondToken, setSecondToken] = React.useState<SelectedToken>({name:"Jhcha Token", symbol:"JHC", address:process.env.REACT_APP_JHC_ADDRESS, decimals: 0});
  
  const [firstAmount, setFirstAmount] = React.useState<number | undefined | string | object>();
  const [secondAmount, setSecondAmount] = React.useState<number | undefined | string | object>();
  const [firstBalance, setFirstBalance] = React.useState<number | undefined | string>();
  const [secondBalance, setSecondBalance] = React.useState<number | undefined | string>();
  const [gas, setGas] = React.useState<number | undefined | string>();

  const [provider, setProvider] = React.useState<any>();
  const [signer, setSigner] = React.useState<any>();
  const [signerAddress, setSignerAddress] = React.useState("");
  const [transaction, setTransaction] = React.useState<any>();
  const [ratio, setRatio] = React.useState<any>();
  
  const position = ["From", "To"];
  
  React.useEffect(() => {
    if(isAuthenticated){
      onInitializeSwapForm();
    }
  }, [isAuthenticated]);

  const onInitializeSwapForm = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    const signer = provider.getSigner();
    setSigner(signer);

    signer.getAddress()
        .then(address => {
            setSignerAddress(address);
        })
    const firstBalance = await uniswapUtils.getTokenBalance(signer, firstToken.address);
    setFirstBalance(utils.formatString(firstBalance));
    const secondBalance = await uniswapUtils.getTokenBalance(signer, secondToken.address);
    setSecondBalance(utils.formatString(secondBalance));
    // provider.estimateGas({});
  };
  
  const getQuoteFirst = async (val: string) => {
    setFirstAmount(val);

    try {
        await uniswapUtils.getQuote(
            firstToken.symbol,
            secondToken.symbol,
            val,
            10, //slippageAmount
            Math.floor(Date.now() / 1000 + (5 * 60)), //deadline
            signerAddress,
            signer
        ).then(data => {
          setTransaction(data.transaction);
          setGas(data.transaction.gasLimit.toString());
          setSecondAmount(data.quoteAmountOut);
          setRatio(data.ratio);
        })
    } catch (error) {
        let message;
        if (error instanceof Error) message = error.message;
        else message = String((error as Error).message);
        getErrorMessage(message);
    }

};

const getQuoteSecond = async (val: string) => {
    setSecondAmount(val);
    try {
        await uniswapUtils.getQuote(
            secondToken.symbol,
            firstToken.symbol,
            val,
            10, //slippageAmount
            Math.floor(Date.now() / 1000 + (5 * 60)), //deadline
            signerAddress,
        ).then(data => {
          setTransaction(data.transaction);
          setGas(data.transaction.gasLimit.toString());
          setSecondAmount(data.quoteAmountOut);
          setRatio(data.ratio);
        })
    } catch (error) {
        let message;
        if (error instanceof Error) message = error.message;
        else message = String((error as Error).message);
        getErrorMessage(message);
    }
  }

  const makeSwap = async () => {
    try{
        const txHash = await uniswapUtils.executeSwap(transaction, signer, firstToken.address, firstAmount);
        openTransactionModal(true);
        getTxHash(txHash.hash);
        setMadeTx(true);

        const firstBalance = await uniswapUtils.getTokenBalance(signer, firstToken.address);
        setFirstBalance(utils.formatString(firstBalance));
        const secondBalance = await uniswapUtils.getTokenBalance(signer, secondToken.address);
        setSecondBalance(utils.formatString(secondBalance));
    } catch (error) {
        let message;
        if (error instanceof Error) message = error.message;
        else message = String((error as Error).message);
        getErrorMessage(message);
    }
    setFirstAmount("");
    setSecondAmount("");
    setGas("");
    setRatio("");
  };

  const getEstimateGasFee = async () => {
    try{
        const txHash = await uniswapUtils.executeSwap(transaction, signer, firstToken.address, firstAmount);
        openTransactionModal(true);
        getTxHash(txHash.hash);
        setMadeTx(true);

        const firstBalance = await uniswapUtils.getTokenBalance(signer, firstToken.address);
        setFirstBalance(utils.formatString(firstBalance));
        const secondBalance = await uniswapUtils.getTokenBalance(signer, secondToken.address);
        setSecondBalance(utils.formatString(secondBalance));
    } catch (error) {
        let message;
        if (error instanceof Error) message = error.message;
        else message = String((error as Error).message);
        getErrorMessage(message);
    }
    setFirstAmount("");
    setSecondAmount("");
    setGas("");
    setRatio("");
  };

  return (
    <form className={isLight ? styles.light : styles.dark}>
      <div className="w-full rounded-3xl p-2 select-none">
        <SwapFormHeader />
        <SwapFormInput
          initial={true}
          tokenList={tokenList}
          choose={setFirstToken}
          selected={firstToken}
          getQuote={getQuoteFirst}
          value={firstAmount}
          changeValue={setFirstAmount}
          changeCounterValue={setSecondAmount}
          position={position[0]}
          balance={firstBalance}
        />
        <SwapFormInput
          tokenList={tokenList}
          choose={setSecondToken}
          selected={secondToken}
          getQuote={getQuoteSecond}
          value={secondAmount}
          changeValue={setFirstAmount}
          changeCounterValue={setFirstAmount}
          position={position[1]}
          balance={secondBalance}
        />
        {gas && (
          <div className="w-full h-3 flex items-center justify-center py-4">
            <div className="w-[95%] h-full flex items-center justify-end text-sm text-white font-semibold">
              {t("swap_form.estimatedGasFee")}
              {`${gas} Gwei`}
            </div>
          </div>
        )}
        {ratio && (
          <div className="w-full h-3 flex items-center justify-center py-4">
            <div className="w-[95%] h-full flex items-center justify-end text-sm text-white font-semibold">
              {t("swap_form.estimatedRatio")}
              {`1 ${secondToken.symbol} = ${ratio} ${firstToken.symbol}`}
            </div>
          </div>
        )}
        <SwapButton 
          isAuthenticated={isAuthenticated}
          setLoginModalOpen={setLoginModalOpen} 
          trySwap={makeSwap}
        />
      </div>
    </form>
  );
};

const styles = {
  light: "border-2 border-orange-400 bg-orange-400 rounded-3xl h-90 w-11/12 sm:w-[500px]",
  dark: "border-2 border-blue-700 bg-blue-700 rounded-3xl h-90 w-11/12 sm:w-[500px]",
};

export default SwapForm;
