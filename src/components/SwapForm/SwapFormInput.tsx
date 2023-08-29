import React from "react";
import { useTranslation } from "react-i18next";
import SwapFormChangeTokenButton from "./SwapFormChangeTokenButton";
import TokenSelectModal from "../UI/TokenSelectModal";
import { TokenList } from "../../types";
import type { SelectedToken } from "../../types";
import { DebounceInput } from "react-debounce-input";

type SwapFormInputProps = {
  initial?: boolean;
  tokenList: TokenList;
  choose(val: SelectedToken): void;
  selected: SelectedToken;
  getQuote(val: string): void;
  value: number | undefined | string | object;
  changeValue(val: number | undefined | string): void;
  changeCounterValue(val: number | undefined | string): void;
  position: string;
  balance: number | undefined | string;
};

const SwapFormInput = ({
  initial,
  tokenList,
  choose,
  selected,
  value,
  getQuote,
  changeValue,
  changeCounterValue,
  position,
  balance,
}: SwapFormInputProps): JSX.Element => {
  const [isSelecting, setIsSelecting] = React.useState(false);
  const { t } = useTranslation();
  const [inputValue, setInputValue] = React.useState<number | undefined | string | object>();

  React.useEffect(() => {
    if (value === 0 || value === "") {
      setInputValue("");
      changeCounterValue("");
    }
    setInputValue(value);
  }, [value, setInputValue, changeCounterValue]);

  return (
    <div className="w-full h-20 rounded-2xl mb-2 bg-gray-100 flex flex-col items-center p-2">
      <div className="flex h-2/5 items-center w-full ">
        {
          <span className="w-4/6 font-semibold bg-gray-100 text-slate-500 text-base focus:outline-none px-1 rounded-2xl ">
            {position}
          </span>
        }
        {
          balance && 
          <span className="w-2/6 font-semibold text-slate-500 text-base rounded-2xl ">{`balance: ${balance}`}</span>
        }
          
      </div>
      <div className="flex h-3/5 items-center w-full ">
        <DebounceInput
          className="min-w-0 h-full rounded-2xl bg-gray-100 text-3xl font-medium font-inc focus:outline-none px-1"
          placeholder={t("swap_form.placeholder")}
          type="number"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => getQuote(e.target.value)}
          value={inputValue}
        />
        <SwapFormChangeTokenButton
          initial={initial}
          select={setIsSelecting}
          selected={selected}
        />
        {isSelecting && (
          <TokenSelectModal
            tokenList={tokenList}
            select={setIsSelecting}
            choose={choose}
            isSelecting={setIsSelecting}
          />
        )}
      </div>
    </div>
  );
};

export default SwapFormInput;
