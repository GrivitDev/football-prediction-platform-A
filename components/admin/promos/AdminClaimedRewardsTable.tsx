'use client';


import {
 useQuery,
} from '@tanstack/react-query';


import {
 Card,
 CardContent,
 CardHeader,
 CardTitle,
} from '@/components/ui/card';


import {
 Badge,
} from '@/components/ui/badge';


import {
 getAllClaimedRewards,
} from '@/services/admin-promo-rewards.service';



export default function AdminClaimedRewardsTable(){


const {
 data:rewards=[],
 isLoading,
}=useQuery({

 queryKey:[
  'claimed-rewards'
 ],

 queryFn:getAllClaimedRewards

});



if(isLoading){

 return (
  <p>
   Loading rewards...
  </p>
 )

}



return (

<Card>


<CardHeader className="px-4 py-3">

<CardTitle>

All Claimed Rewards

</CardTitle>

</CardHeader>


<CardContent className="px-4 pb-4 pt-0">


<div className="overflow-x-auto">


<table className="w-full text-sm">


<thead>

<tr className="border-b">

<th className="p-2 text-left">
User
</th>


<th className="p-2">
Campaign
</th>


<th className="p-2">
Reward
</th>


<th className="p-2">
Claim
</th>


<th className="p-2">
Status
</th>


</tr>

</thead>



<tbody>


{
rewards.map(
(reward:any)=>(


<tr
key={reward._id}
className="border-b"
>


<td className="p-2">

<div>

<p className="font-medium">

{
reward.userId?.fullName ||
reward.userId?.username
}

</p>


<p className="text-muted-foreground">

{
reward.userId?.email
}

</p>


</div>

</td>

<td className="p-2">

{
reward.promoId?.campaignType

}

</td>                 





<td className="p-2">


{
reward.type==='subscription'

?

`${reward.plan} ${reward.durationDays} days`

:

`₦${reward.amount}`

}


</td>




<td className="p-2">

#
{reward.claimNumber}

</td>




<td className="p-2">


<Badge>

{
reward.status
}

</Badge>


</td>



</tr>


)
)
}



</tbody>


</table>


</div>


</CardContent>


</Card>


)

}
