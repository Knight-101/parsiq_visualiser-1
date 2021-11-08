<h1>Parsiq Trigger Code</h1>
<hr>
stream TransactionSurveillance<br>
from Transfers<br>
where @from in InterestAddresses<br>
process<br>
  let txInfo = { txHash: @tx_hash }<br>
  emit { @from, @to, @value, txInfo }<br>
end
<hr>
This app is deployed at https://parsiq-visualiser.netlify.app/
<hr>
