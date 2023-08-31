import {ethers, BigNumber} from 'ethers'

const {AlphaRouter, SwapType} = require("@uniswap/smart-order-router");
const Erc20ABI = require("../abi/ERC20.json").abi;
const {Token, CurrencyAmount, TradeType, Percent} = require("@uniswap/sdk-core");
const JSBI = require("jsbi");
const V3_SWAP_ROUTER_02_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";

const web3Provider = new ethers.providers.JsonRpcProvider(
    process.env.REACT_APP_INFURA_URL
);
const chainId = 5;
const router = new AlphaRouter({
    chainId: chainId, 
    provider: web3Provider
});

const wethAddress = process.env.REACT_APP_WETH_ADDRESS;
const anmAddress = process.env.REACT_APP_ANM_ADDRESS;
const jhcAddress = process.env.REACT_APP_JHC_ADDRESS;

const wethToken = new Token(chainId, wethAddress, 18, "WETH", "Wrapped Ether");
const anmToken = new Token(chainId, anmAddress, 18, "ANM", "Anemo Token");
const jhcToken = new Token(chainId, jhcAddress, 18, "JHC", "Jhcha Token");

let tokenMap = new Map();
tokenMap.set("WETH",wethToken)
tokenMap.set("ANM",anmToken)
tokenMap.set("JHC",jhcToken)

export const uniswapUtils = {
    getTokenBalance: async (signer, contractAddress) => {
        const contract = new ethers.Contract(contractAddress, Erc20ABI, signer)
        const bigNumberBalanace = await contract.balanceOf(signer.getAddress());
        return ethers.utils.formatEther(bigNumberBalanace);
    },

    getQuote: async (inputToken, outputToken, inputAmount, slippageAmount, deadline, walletAddress) => {
        const percentSlippage = new Percent(slippageAmount, 100);
        const wei = ethers.utils.parseUnits(inputAmount.toString(), 18);
        const currencyAmount = CurrencyAmount.fromRawAmount(tokenMap.get(inputToken), JSBI.BigInt(wei));

        const options = {
            recipient: walletAddress,
            slippageTolerance: percentSlippage,
            deadline: deadline,
            type: SwapType.SWAP_ROUTER_02,
        }

        const route = await router.route(
            currencyAmount,
            tokenMap.get(outputToken), 
            TradeType.EXACT_INPUT, 
            options
        );
        
        const transaction = {
            from: walletAddress,
            to: V3_SWAP_ROUTER_02_ADDRESS,
            value: BigNumber.from(route.methodParameters.value),
            data: route.methodParameters.calldata,
            gasPrice: BigNumber.from(route.gasPriceWei),
            gasLimit: ethers.utils.hexlify(100000),
        };

        const quoteAmountOut = route.quote.toFixed(6);
        const ratio = (inputAmount / quoteAmountOut).toFixed(3);
        return {transaction, quoteAmountOut, ratio};
    },

    executeSwap: async (transaction, signer, contractAddress, inputAmount) => {
        const contract = new ethers.Contract(contractAddress, Erc20ABI, signer);
        const approvalAmount = ethers.utils.parseUnits("10", 18);
        const allowance = await contract.allowance(await signer.getAddress(), V3_SWAP_ROUTER_02_ADDRESS);

        if (allowance < (inputAmount * ethers.utils.parseUnits("10", 18))) {
            const approveTx = await contract.connect(signer).approve(V3_SWAP_ROUTER_02_ADDRESS, approvalAmount);
            await approveTx.wait();
        }

        const tx = await signer.sendTransaction(transaction);
        await tx.wait();
        return tx;
    }
}

export const utils = {
    formatString: (inputString) => {
        const parts = inputString.split('.');
        
        if (parts.length === 2) {
            const integerPart = parts[0];
            const decimalPart = parts[1];
            const truncatedDecimal = decimalPart.substr(0, 3); // 최대 3자리까지 표시
            return `${integerPart}.${truncatedDecimal}...`;
        } else {
            return inputString;
        }
    }
}