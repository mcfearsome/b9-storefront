/* global web3:true */

import contract from 'truffle-contract'

// import artifacts
import metacoinArtifacts from '../../../build/contracts/MetaCoin.json'
import storefrontArtifiacts from '../../../build/contracts/StoreFront.json'
import catalogArtifacts from '../../../build/contracts/Catalog.json'

// create contracts
const MetaCoin = contract(metacoinArtifacts)
MetaCoin.setProvider(web3.currentProvider)
const StoreFront = contract(storefrontArtifiacts)
const Catalog = contract(catalogArtifacts)
StoreFront.setProvider(web3.currentProvider)
Catalog.setProvider(web3.currentProvider)

export {
  MetaCoin,
  StoreFront,
  Catalog
}
