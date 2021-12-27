import React from 'react';

class NextStep extends React.Component {
  render() {
    return (
      <td className="NextStep d-flex justify-content-between">
        {covertStep(this.props.step)}
        <CovertNextStep step={this.props.step}/>
      </td>
    )
  }
}

function covertStep(step) {
  if (step === '0') return 'Created'
  else if (step === '1') return 'Paid'
  else return 'Delivered'
}

function CovertNextStep(data) {
  if (data.step === '0') return(
    <button className="btn btn-info py-0" type="button">Buy &#x276F;&#x276F;</button>
  )
  else if (data.step === '1') return(<button className="btn btn-warning py-0" type="button">Delivery &#x276F;&#x276F;</button>)
  else return(<button className="btn btn-secondary py-0" type="button" disabled>Not available</button>)
}

export default NextStep;