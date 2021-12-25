import React, { Component } from "react";
import ItemManagerContract from "./contracts/ItemManager.json";
import ItemContract from "./contracts/Item.json";
import getWeb3 from "./getWeb3";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
  state = { loaded: false, cost: 0, itemName: "item_01" };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      
      this.itemManager = new this.web3.eth.Contract(
        ItemManagerContract.abi,
        ItemManagerContract.networks[this.networkId]&& ItemManagerContract.networks[this.networkId].address,
      );

      this.Item = new this.web3.eth.Contract(
        ItemContract.abi,
        ItemContract.networks[this.networkId]&& ItemContract.networks[this.networkId].address,
      );

      this.setState({ loaded: true });
    
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox"? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
  }

  handleSubmit = async() => {
    const { cost, itemName } = this.state;
    let result = await this.itemManager.methods.createItem(itemName, cost).send({from: this.accounts[0]});
    console.log(result);
    alert(`Send ${cost} Wei to ${result.events.SupplyChainStep.returnValues._itemAddress}`);
  }

  listenToPaymentEvent = () => {
    let self = this;
    this.itemManager.events.SupplyChainStep().on("message", async evt => {
      console.log(evt);
      let itemObject = await self.itemManager.methods.items(evt.returnValues._itemIndex).call();
      alert(`Item ${itemObject._identifier} was paid, deliver it now`);
    });
  };

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App container text-left">
        <h1><strong>SUPPLY CHAIN</strong></h1>
        <h2>Items</h2>
        <h4>Add Items</h4>
        <p>
          <strong>Cost in Wei: </strong>
          <input className="form-control" type="number" name="cost" value={this.state.cost} onChange={this.handleInputChange}></input>
        </p>
        <p>
          <strong>Item Indetifier: </strong>
          <input className="form-control" type="text" name="itemName" value={this.state.itemName} onChange={this.handleInputChange}></input>
        </p>
        <button className="btn btn-info" type="button" onClick={this.handleSubmit}>Create new Item</button>
      </div>
    );
  }
}

export default App;
