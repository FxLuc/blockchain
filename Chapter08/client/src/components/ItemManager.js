import React, { Component } from "react"
import ItemManagerContract from "../contracts/ItemManager.json"
import ItemContract from "../contracts/Item.json"
import getWeb3 from "../getWeb3"

class ItemManager extends Component {
  state = { loaded: false, cost: 0, itemName: "item_01", itemList: [] }

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
    const { cost, itemName, itemList } = this.state
    await this.itemManager.methods.createItem(itemName, cost).send({ from: this.accounts[0] })
    const itemIndex = await this.itemManager.methods.getItemIndex().call()
    itemList.push(await this.itemManager.methods.items(itemIndex-1).call())
    this.setState({ itemList })
  }

  listenToPaymentEvent = () => {
    let self = this
    this.itemManager.events.SupplyChainStep().on("message", async event => {
      console.log(event)
      let itemObject = await self.itemManager.methods.items(event.returnValues._itemIndex).call()
      alert(`Item ${itemObject._identifier} was paid, deliver it now`)
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
            <label htmlFor="tienVay">Price (wei):</label>
            <input name="cost" onChange={this.handleInputChange} type="number" className="form-control" value={this.state.cost} />
          </div>
          <div className="form-group">
            <label htmlFor="tienVay">Idetifier:</label>
            <input name="itemName" value={this.state.itemName} onChange={this.handleInputChange} type="text" className="form-control" />
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
    <td>{data._state}</td>
  </tr>
)

export default ItemManager