import React from "react";
import SwapForm from "../components/SwapForm/SwapForm";
import { TokenList } from "../types";

type SwapProps = {
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

const Swap = ({
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
}: SwapProps): JSX.Element => {
  return (
    <>
      <div className={styles.container}>
        <SwapForm
          tokenList={tokenList}
          isAuthenticated={isAuthenticated}
          isAuthenticating={isAuthenticating}
          setLoginModalOpen={setLoginModalOpen}
          openTransactionModal={openTransactionModal}
          getTxHash={getTxHash}
          getErrorMessage={getErrorMessage}
          setMadeTx={setMadeTx}
          setisAuthenticated={setisAuthenticated}
          setisAuthenticating={setisAuthenticating}
        />
      </div>
    </>
  );
};

export default Swap;

const styles = {
  container: "flex items-center justify-center flex-grow",
};
