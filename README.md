<h1>Parsiq Trigger Code</h1>

```
stream TransactionSurveillance
from Transfers
where @from in InterestAddresses
process
  let txInfo = { txHash: @tx_hash }

  emit { @from, @to, @value, txInfo }
end
```
Project - https://staging.parsiq.net/monitoring/projects/5ecdca23-a866-4b08-a626-1db6ccaf6057
Video Demo - https://youtu.be/w2YV3RyuXiM
<hr>
This app is deployed at https://parsiq-visualiser.netlify.app/
<hr>
<img width="1435" alt="Screenshot 2021-11-09 at 2 17 14 AM" src="https://user-images.githubusercontent.com/75176954/140815960-9e68e0d7-05cc-4153-8a24-713335cbe293.png">
Table view
<hr>
<img width="1435" alt="Screenshot 2021-11-09 at 2 17 45 AM" src="https://user-images.githubusercontent.com/75176954/140816061-8bc094fa-a2bf-4164-9067-fac33ca597eb.png">
Default view, address on hover
<hr>
<img width="1435" alt="Screenshot 2021-11-09 at 2 18 27 AM" src="https://user-images.githubusercontent.com/75176954/140816069-17ebef98-ee87-4185-82d8-91f5df5a5f14.png">
Draggable nodes
<hr>
