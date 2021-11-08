<h1>Parsiq Trigger Code</h1>
<hr>
stream TransactionSurveillance
from Transfers
where @from in InterestAddresses
process
  let txInfo = { txHash: @tx_hash }
  emit { @from, @to, @value, txInfo }
end
<hr>
This app is deployed at https://parsiq-visualiser.netlify.app/
<hr>
