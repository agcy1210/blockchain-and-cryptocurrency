const Block = require('./block');

class Blockchain {
    constructor() {
        // creates a chain in the form of list
        this.chain = [Block.genesis()];
    }

    addBlock(data) {
        // as chain is a list we can get the last block by index one less than current
        const lastBlock = this.chain[this.chain.length - 1];
        const block = Block.mineBlock(lastBlock, data);
        this.chain.push(block);

        return block;
    }

    isValidChain(chain) {
        // check if the incominng chain contains the proper genesis block
        // here element is stringified is used because in JS two objects referring to same original object can't be equal.
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const lastBlock = chain[i - 1];

            if (block.lastHash !== lastBlock.hash || block.hash !== Block.blockHash(block)) {
                return false;
            }
        }

        return true;
    }

    replaceChain(newChain) {
        if (newChain.length <= this.chain.length) {
            console.log('Recieved chain is not longer than the current chain');
            return;
        } else if (!this.isValidChain(newChain)) {
            console.log('Recieved chain is not valid');
            return;
        }

        console.log('Replacing the blockchain with the new chain');
        this.chain = newChain;
    }
}

module.exports = Blockchain;