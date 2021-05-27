import Route from '@ember/routing/route';
import namehash from 'eth-ens-namehash';
import * as thetajs from "@thetalabs/theta-js";
import ThetaWalletConnect from "@thetalabs/theta-wallet-connect";


export default class Domain_v2Route extends Route {

  async initContract() {
    const ABI_controller = await fetch('build/ETHRegistrarController.ABI');
    const ABI_registry = await fetch('build/ENSRegistry.ABI');

    const provider = new thetajs.providers.HttpProvider(
      thetajs.networks.ChainIds.Privatenet
    );
    this.registry = new thetajs.Contract(
      "0xffe9136e2fc7ad4287fa6c9172d95b028ddff52b",
      await ABI_registry.json(),
      provider
    );

    this.controller = new thetajs.Contract(
      "0x9c7c0f4d3be402ee7109471d74746e900e065e74",
      await ABI_controller.json(),
      provider
    );


  }

  async initResolver(resolver_addr) {
    const provider = new thetajs.providers.HttpProvider(
      thetajs.networks.ChainIds.Privatenet
    );
    const ABI_resolver = await fetch('build/PublicResolver.ABI');
    return new thetajs.Contract(
      resolver_addr,
      await ABI_resolver.json(),
      provider
    )
  }

  async model() {
    await ThetaWalletConnect.connect();
    await this.initContract();

    const public_resolver_contract_addr = "0xa959e309d6df778dba3c699adb186e3aa4964436";

    const duration = 366 * 24 * 60 * 60; // in secs
    const wallet_owner = "0xa6c2a7Db246E02789B111343Fc5A4E84d5A8FF69";
    const domain_name = 'momo3'; // calling this controller will be ".theta"
    const hash_domain_name = namehash.hash(domain_name + '.theta');

    const exists = await this.registry.recordExists(hash_domain_name);
    if (exists) {
      //  exemple on how to get info about existing node
      const resolver_addr = await this.registry.resolver(hash_domain_name);
      const resolver = await this.initResolver(resolver_addr);
      const resolving_addr = await resolver.callStatic["addr(bytes32)"](hash_domain_name);
      console.log("resolved addr", resolving_addr);
    } else {
      //  go get it !

      // a secret for this instance: TODO need to do something better 0x000...
      const random = new Uint8Array(32);
      const salt = "0x" + Array.from(random).map(b => b.toString(16).padStart(2, "0")).join("");


      // const hash = namehash.hash('momo.theta');
      debugger
      const available = await this.controller.available(domain_name);
      console.log('is domain available:', available);

      const price = (await this.controller.rentPrice(domain_name, duration));
      console.log('price :', thetajs.utils.fromWei(price));

      const commitment = await this.controller.makeCommitmentWithConfig(domain_name, wallet_owner, salt, public_resolver_contract_addr, wallet_owner);
      const tx = await this.controller.populateTransaction.commit(commitment);
      const result = await ThetaWalletConnect.sendTransaction(tx);
      debugger

      // Wait 60 seconds before registering
      setTimeout(async () => {
        // Submit our registration request
        try {
          const tx = await this.controller.populateTransaction.registerWithConfig(domain_name, wallet_owner, duration, salt, public_resolver_contract_addr, wallet_owner, {value: price});
          const result = await ThetaWalletConnect.sendTransaction(tx);


          debugger
        } catch (e) {
          console.log(e);
          debugger
        }
      }, 60000);

    }

    debugger

    return {};
  }
}




