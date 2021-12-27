import React from 'react';

const Row = ({ data }) => (
  <tr>
    <td>{data._item}</td>
    <td>{data._identifier}</td>
    <td>{data._itemPrice}</td>
    <td>{data._state}</td>
  </tr>
)

class ItemTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }

  componentDidMount = async () => {
    this.setState({ itemList: this.props.itemList})
    console.log();
  }

  appendChild = () => {
    let { data } = this.state;
    data.push({
      _item: "2",
      _identifier: "2",
      _itemPrice: "500",
      _state: "2",
    });
    this.setState({ data });
  };

  render() {
    return (
      <div className="ItemTable py-5">
        <div className="py-3 ">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>identifier</th>
                  <th>Price</th>
                  <th>State</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>_</td>
                  <td>_</td>
                  <td>_</td>
                  <td>_</td>
                </tr>
                {this.state.data.map(data => <Row data={data} key={data.address} />)}
              </tbody>
            </table>
            <button className="btn btn-info" type="button" onClick={this.appendChild}>Create</button>
          </div>
        </div>
      </div>
    )
  }
}

export default ItemTable;