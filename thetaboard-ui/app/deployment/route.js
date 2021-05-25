import Route from '@ember/routing/route';
import thetajs from "@thetalabs/theta-js";
import web_utils from 'web3-utils';
import ThetaWalletConnect from '@thetalabs/theta-wallet-connect';

export default class DashboardRoute extends Route {

  async model() {
    const LTD = 'theta';
    const LTD_hash = ethers.utils.namehash(LTD)

    const provider = new thetajs.providers.HttpProvider(thetajs.networks.ChainIds.Privatenet);
    const wallet = new thetajs.Wallet("0xa6c2a7Db246E02789B111343Fc5A4E84d5A8FF69", provider);
    const _deploy_contract = async (ABI, BC, args) => {
      const contract_args = args ? args : [];
      await ThetaWalletConnect.connect();
      const contract_deploy = new thetajs.ContractFactory(ABI, BC, wallet);
      const contract_deploy_tx = await contract_deploy.populateDeployTransaction(...contract_args);
      const contract_deployed = await ThetaWalletConnect.sendTransaction(contract_deploy_tx);
      const tx_receipt = await provider.getTransaction(contract_deployed.hash);
      return new thetajs.Contract(tx_receipt.receipt.ContractAddress, ABI, wallet);
    }

    const load_contracts = async () => {
      let abi = await fetch('build/ENSRegistry.ABI');
      let bc = await fetch('build/ENSRegistry.BC');
      const ENS_ABI = await abi.json();
      const ENS_BC = await bc.json();
      abi = await fetch('build/PublicResolver.ABI');
      bc = await fetch('build/PublicResolver.BC');
      const PUBLICRESOLVER_ABI = await abi.json();
      const PUBLICRESOLVER_BC = await bc.json();
      abi = await fetch('build/BaseRegistrarImplementation.ABI');
      bc = await fetch('build/BaseRegistrarImplementation.BC');
      const BaseRegistrarImplementation_ABI = await abi.json();
      const BaseRegistrarImplementation_BC = await bc.json();
      abi = await fetch('build/DummyOracle.ABI');
      bc = await fetch('build/DummyOracle.BC');
      const DummyOracle_ABI = await abi.json();
      const DummyOracle_BC = await bc.json()
      abi = await fetch('build/StablePriceOracle.ABI');
      bc = await fetch('build/StablePriceOracle.BC');
      const StablePriceOracle_ABI = await abi.json();
      const StablePriceOracle_BC = await bc.json()
      abi = await fetch('build/ETHRegistrarController.ABI');
      bc = await fetch('build/ETHRegistrarController.BC');
      const ETHRegistrarController_ABI = await abi.json();
      const ETHRegistrarController_BC = await bc.json()


      const ens_contract = await _deploy_contract(ENS_ABI, ENS_BC);
      const public_resolver_contract = await _deploy_contract(PUBLICRESOLVER_ABI, PUBLICRESOLVER_BC, [ens_contract.address]);
      const base_registrar_contract = await _deploy_contract(BaseRegistrarImplementation_ABI, BaseRegistrarImplementation_BC, [ens_contract.address, LTD_hash])
      const transaction = await ens_contract.populateTransaction.setSubnodeOwner('0x0000000000000000000000000000000000000000000000000000000000000000', web_utils.sha3(LTD), base_registrar_contract.address);
      await ThetaWalletConnect.sendTransaction(transaction);
      const dummy_oracle_contract = await _deploy_contract(DummyOracle_ABI, DummyOracle_BC, [thetajs.utils.bnFromString('100000000')]);
      const price_oracle_contract = await _deploy_contract(StablePriceOracle_ABI, StablePriceOracle_BC,
        [dummy_oracle_contract.address, [100, 50, 30, 5]]);

      const registrar_controller_contract = await _deploy_contract(ETHRegistrarController_ABI, ETHRegistrarController_BC, [base_registrar_contract.address, price_oracle_contract.address, 600, 86400]);

      const addCtrl_tx = await base_registrar_contract.populateTransaction.addController(registrar_controller_contract.address);
      await ThetaWalletConnect.sendTransaction(addCtrl_tx);
      const setPrice_tx = await registrar_controller_contract.populateTransaction.setPriceOracle(price_oracle_contract.address);
      await ThetaWalletConnect.sendTransaction(setPrice_tx);
      console.log(`ens_contract:${ens_contract.address} \n
      public_resolver_contract:${public_resolver_contract.address} \n
      base_registrar_contract:${base_registrar_contract.address} \n
      dummy_oracle_contract:${dummy_oracle_contract.address} \n
      price_oracle_contract:${price_oracle_contract.address} \n
      registrar_controller_contract:${registrar_controller_contract.address} \n
      ens_contract:${ens_contract.address} \n
      `)
    }
    load_contracts();
    return {};
  }
}




