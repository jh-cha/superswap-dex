import React, { useContext } from "react";
import "./App.css";
import Swap from "./pages/Swap";
import NavBar from "./components/NavBar/NavBar";
import ThemeContext from "./context/theme-context";
import { TokenList } from "./types";
import ChainContext from "./context/chain-context";
import SwapResultModal from "./components/SwapForm/SwapResultModal";
import { useLocation } from "react-router-dom";
import Transactions from "./pages/Transactions";
import useWindowWidth from "./hooks/useWindowWidth";
import NavTabSwitcher from "./components/NavBar/NavTabSwitcher";
import ethers from "ethers";

function App(): JSX.Element {
  const chainCtx = useContext(ChainContext);
  const { isLight } = React.useContext(ThemeContext);
  const windowWidth = useWindowWidth();
  const isDesktop = windowWidth >= 920;
  const [tokenList, setTokenList] = React.useState<TokenList | []>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);
  const [showTransactionModal, setShowTransactionModal] = React.useState(false);
  const [txHash, setTxHash] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [madeTx, setMadeTx] = React.useState(false);
  const [isAuthenticated, setisAuthenticated] = React.useState(false);
  const [isAuthenticating, setisAuthenticating] = React.useState(false);
  const location = useLocation();
  const pathName = location.pathname;

  const closeModal = () => {
    setShowTransactionModal(false);
    setTxHash("");
    setErrorMessage("");
  };

  const onLoad = async () => {
    // const provider = await new ethers.providers.Web3Provider(window.ethereum);
    // setProvider(provider);
    // const signer = provider.getSigner();
    // setSigner(signer);
  }

  return (
    <div className={isLight ? styles.containerLight : styles.containerDark}>
      {showTransactionModal && (
        <SwapResultModal
          closeModal={closeModal}
          txHash={txHash}
          errorMessage={errorMessage}
        />
      )}
      <NavBar 
        loginModalOpen={isLoginModalOpen} 
        isAuthenticated={isAuthenticated}
        isAuthenticating={isAuthenticating}
        
        setLoginModalOpen={setIsLoginModalOpen}
        setisAuthenticated={setisAuthenticated}
        setisAuthenticating={setisAuthenticating}
      />
      {pathName === "/" && (
        <Swap
          tokenList={tokenList}
          isAuthenticated={isAuthenticated}
          isAuthenticating={isAuthenticating}

          setLoginModalOpen={setIsLoginModalOpen}
          openTransactionModal={setShowTransactionModal}
          getTxHash={setTxHash}
          getErrorMessage={setErrorMessage}
          setMadeTx={setMadeTx}
          setisAuthenticated={setisAuthenticated}
          setisAuthenticating={setisAuthenticating}
        />
      )}

      {pathName === "/transactions" && (
        <Transactions
          setLoginModalOpen={setIsLoginModalOpen}
          madeTx={madeTx}
          setMadeTx={setMadeTx}
        />
      )}
      {!isDesktop && (
        <div className="absolute bottom-0 w-screen h-20 bg-transparent p-3 mb-6">
          <NavTabSwitcher />
        </div>
      )}
    </div>
  );
}

export default App;

const styles = {
  containerLight:
    "w-screen h-screen bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 overflow-hidden relative",
  containerDark:
    "w-screen h-screen bg-gradient-to-r from-indigo-800 via-blue-900 to-zinc-800",
};
