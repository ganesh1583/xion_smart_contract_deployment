import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { StargateClient,GasPrice, coin } from "@cosmjs/stargate";

import {
    CosmWasmClient,
    SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";

import fs from "fs";

const rpc = "https://rpc.xion-testnet-1.burnt.com:443";
const mnemonic =
  "road wheel quick abstract dolphin hotel brush raise equip notice shield door typical amount always bronze staff old own story company sketch decrease brisk";

const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: "xion",
});

const [account] = await wallet.getAccounts();

console.log("account is : ",account.address);

const client = await SigningCosmWasmClient.connectWithSigner(rpc,wallet, {
    gasPrice: GasPrice.fromString("0.001uxion"),
});

async function storeCode() {
    const wasmFile = fs.readFileSync("./cw_counter.wasm");
    const wasmBytes = new Uint8Array(wasmFile);

    const uploadCounter = await client.upload(account.address, wasmBytes, "auto");
    let contractId = uploadCounter.codeId;
    console.log("Contract ID : ",contractId);
}

const contractId = 1426;

async function instantiate() {
    const ins_msg = {};

    let ins_reply = await client.instantiate(account.address, contractId, ins_msg, "ganesh's-contract","auto");
    console.log("Contract Address is : ",ins_reply.contractAddress);
    return ins_reply.contractAddress;
}

instantiate();

/*
let counter_contract = "xion1l7q87h7pjrk0ent8tr6ujyknzw9n8ek2am7zl2304r7mdjukqj4s3htd3t";

async function increment() {
    const inc_msg = {
        increment_counter: {},
    };

    const inc_reply = await client.execute(account.address, counter_contract, inc_msg, "auto");

    console.log("Counter Incremented Successfully and hash of transaction : ",inc_reply.transactionHash);

}
increment();

async function decrement() {
    const inc_msg = {
        dicrement_counter: {},
    };

    const inc_reply = await client.execute(account.address, counter_contract, inc_msg, "auto");

    console.log("Counter Decremented Successfully and hash of transaction : ",inc_reply.transactionHash);

}

//decrement();

*/