# Market Dapp Tests

Add test documentation here

<b>Testnet</b>

<code> geth --rpc --networkid=39318 --maxpeers=0 --datadir=~/.ethereum/DevChain/ --mine --minerthreads 2 --genesis /home/nathan/gen.json --etherbase 'fdff6d471a57e0fc4175a1ecd478372f8e6698ef' --unlock fdff6d471a57e0fc4175a1ecd478372f8e6698ef console
</code>  

Genesis file
<code>
{
    "nonce": "0x0000000000000042",
    "difficulty": "0x40000",
    "alloc": {
            "fdff6d471a57e0fc4175a1ecd478372f8e6698ef": {
            "balance": "10015200000000000000000"
        }
    },
    "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "coinbase": "0x0000000000000000000000000000000000000000",
    "timestamp": "0x00",
    "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "extraData": "0x",
    "gasLimit": "0x4c4b40"
}
</code>
