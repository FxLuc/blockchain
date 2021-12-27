import React from 'react';

class NextStep extends React.Component {
  render() {
    return (
      <td className="NextStep d-flex justify-content-between">
        {covertStep(this.props.step)}
        <button className="btn btn-info py-0" type="button" onClick={this.nextStep}>Next step &#x276F;&#x276F;</button>
      </td>
    )
  }
}

function covertStep(step) {
  if (step === '0') return 'Created'
  else if (step === '1') return 'Paid'
  else return 'Delivered'
}

export default NextStep;