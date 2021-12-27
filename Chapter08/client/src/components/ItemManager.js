import React, { Component } from "react"
import ItemManagerContract from "../contracts/ItemManager.json"
import ItemContract from "../contracts/Item.json"
import getWeb3 from "../getWeb3"
import NextStep from "./NextStep"

class ItemManager extends Component {
  state = { loaded: false, cost: 0, itemName: "item_01", unit: 'Wei', itemList: [] }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3()

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts()

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId()

      this.itemManager = await new this.web3.eth.Contract(
        ItemManagerContract.abi,
        ItemManagerContract.networks[this.networkId] && ItemManagerContract.networks[this.networkId].address,
      )

      this.Item = await new this.web3.eth.Contract(
        ItemContract.abi,
        ItemContract.networks[this.networkId] && ItemContract.networks[this.networkId].address,
      )

      this.listenToPaymentEvent();

      // load items to table
      this.itemIndex = await this.itemManager.methods.getItemIndex().call()
      for (let i = this.itemIndex - 1; i >= 0; i--) {
        this.setState({ itemList: [...this.state.itemList, await this.itemManager.methods.items(i).call()] })
      }

      this.setState({ loaded: true })

    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      )
      console.error(error)
    }
  }

  handleInputChange = event => {
    const target = event.target
    const value = target.type === "checkbox" ? target.checked : target.value
    const name = target.name
    this.setState({ [name]: value })
  }

  handleSubmit = async () => {
    const { cost, itemName, unit, itemList } = this.state
    let value = 0
    if (unit === 'Ether') {
      value = this.web3.utils.toWei(cost, 'ether')
    } else if (unit === 'Gwei') {
      value = this.web3.utils.toWei(cost, 'gwei')
    }
    await this.itemManager.methods.createItem(itemName, value).send({ from: this.accounts[0] })

    // add new item to table
    const itemIndex = await this.itemManager.methods.getItemIndex().call()
    itemList.unshift(await this.itemManager.methods.items(itemIndex - 1).call())
    this.setState({ itemList })
  }

  listenToPaymentEvent = () => {
    this.itemManager.events.SupplyChainStep().on("data", async event => {
      const itemObject = await this.itemManager.methods.items(event.returnValues._itemIndex).call()
      const { itemList } = this.state
      itemList[await itemList.indexOf(itemList.find(item => item._item === itemObject._item))] = itemObject
      this.setState({ itemList })
    })
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>
    }
    return (
      <div className="container">
        <div className="ItemManager">
          <h1><strong>SUPPLY CHAIN</strong></h1>
          <h4>Add Items</h4>

          <div className="form-group">
            <label htmlFor="itemName">Idetifier:</label>
            <input name="itemName" value={this.state.itemName} onChange={this.handleInputChange} type="text" className="form-control" />
          </div>

          <div className="row">
            <div className="col">
              <div className="form-group">
                <label htmlFor="cost">Price:</label>
                <input name="cost" onChange={this.handleInputChange} type="number" className="form-control" value={this.state.cost} />
              </div>
            </div>
            <div className="col-3">
              <div className="form-group">
                <label htmlFor="unit">In:</label>
                <select className="form-control" onChange={this.handleInputChange} name="unit" defaultValue="Wei">
                  <option>Wei</option>
                  <option>Gwei</option>
                  <option>Ether</option>
                </select>
              </div>
            </div>
          </div>

          <button className="btn btn-info" type="button" onClick={this.handleSubmit}>Create</button>
        </div>
        <div className="ItemTable py-5">
          <div className="py-3 ">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>Identifier</th>
                    <th>Price</th>
                    <th>State</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.itemList.map(itemList => <Row data={itemList} key={itemList._item} />)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const Row = ({ data }) => (
  <tr>
    <td>{data._item}</td>
    <td>{data._identifier}</td>
    <td>{data._itemPrice}</td>
    <NextStep step={data._state} />
  </tr>
)

export default ItemManager