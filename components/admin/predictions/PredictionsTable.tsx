'use client';


import Image from 'next/image';


import type {
  AdminPrediction,
} from '@/types/prediction.types';


import {
  getLeagueName,
} from '@/constants/leagues';


import {
  getMatchStatus,
  getPredictionLabel,
  formatPredictionDate,
} from '@/utils/prediction.utils';





interface Props {

  predictions:AdminPrediction[];

  onSelect:(prediction:AdminPrediction)=>void;

}





export default function PredictionsTable({

  predictions,

  onSelect,

}:Props){



  const statusOrder = {

    'In Play':0,

    'Upcoming':1,

    'Needs Settlement':2,

    'Settled':3,

  };




  const sortedPredictions =
    [...predictions].sort(
      (a,b)=>{


        return (

          statusOrder[
            getMatchStatus(a)
          ]

          -

          statusOrder[
            getMatchStatus(b)
          ]

        );


      },
    );

const formatAdminDate = (date:string)=>{

const d = new Date(date);


return {

day:d.toLocaleDateString(
'en-US',
{
weekday:'long'
}
),

date:d.toLocaleDateString(
'en-US',
{
day:'numeric',
month:'short',
year:'2-digit'
}
),

time:d.toLocaleTimeString(
'en-US',
{
hour:'numeric',
minute:'2-digit',
hour12:true,
}
)

};

};



  return (


<div
  className="
    w-full
    rounded-2xl
    border
    border-border
    bg-card
    shadow-sm
  "
>


<div>


<table
  className="
    w-full
    table-fixed
    border-collapse
    text-left
  "
>

<thead

className="
border-b
border-border
bg-muted/40
"

>

<tr>


<th className="px-4 py-2 text-l font-semibold">
Date
</th>


<th className="px-2 py-2 text-l font-semibold">
League
</th>


<th className="px-2 py-2 text-l font-semibold">
Match
</th>


<th className="px-2 py-2 text-l font-semibold">
Prediction
</th>


<th className="px-2 py-2 text-l font-semibold">
Access
</th>


<th className="px-2 py-2 text-l font-semibold">
Status
</th>



</tr>


</thead>






<tbody>


{
sortedPredictions.map(
(prediction)=>(


<tr

key={
prediction._id
}

onClick={
()=>onSelect(prediction)
}

className="
cursor-pointer
border-b
border-border
transition
hover:bg-muted/50
"


>



<td

className="
px-4
py-2
whitespace-nowrap
text-sm
"

>

{

(()=>{

const date = formatAdminDate(
prediction.matchDate
);


return (

<div
className="
leading-tight
text-xs
"
>

<div className="font-medium">
{date.day}
</div>

<div>
{date.date}
</div>

<div className="text-muted-foreground">
{date.time}
</div>


</div>

)

})()

}

</td>







<td

className="
px-2
py-2
whitespace-nowrap
text-xs
"

>


<div

className="
flex
items-center
gap-2
"

>


{
prediction.league?.emblem && (

<Image

src={
prediction.league.emblem
}

alt={
prediction.league.name
}

width={24}

height={24}

/>

)

}


<span>

{
prediction.league?.name
||
getLeagueName(
prediction.leagueCode,
)

}

</span>


</div>


</td>









<td
className="
px-2
py-2
text-l
"
>

<div
className="
flex
flex-col
items-start
gap-1
text-xs
"
>

<div
className="
flex
items-center
gap-2
min-w-0
"
>

{
prediction.homeTeamBadge && (

<Image
src={prediction.homeTeamBadge}
alt={prediction.homeTeam}
width={20}
height={20}
/>

)

}

<span
className="
truncate
"
>

{prediction.homeTeam}

</span>

</div>


<span
className="
ml-7
text-[10px]
font-medium
text-muted-foreground
"
>
vs
</span>


<div
className="
flex
items-center
gap-2
min-w-0
"
>

{
prediction.awayTeamBadge && (

<Image
src={prediction.awayTeamBadge}
alt={prediction.awayTeam}
width={20}
height={20}
/>

)

}

<span
className="
truncate
"
>

{prediction.awayTeam}

</span>

</div>

</div>

</td>









<td

className="
px-2
py-2
font-semibold
text-primary
whitespace-nowrap
text-xs
"

>

{
getPredictionLabel(
prediction,
)
}

</td>








<td

className="
px-2
py-2
text-xs
"

>


<span

className={`
rounded-full
px-3
py-1
text-xs
font-medium

${
prediction.accessType==='vip'

?

'bg-yellow-500/20 text-yellow-600'

:

prediction.accessType==='regular'

?

'bg-blue-500/20 text-blue-600'

:

'bg-green-500/20 text-green-600'

}

`}

>


{
prediction.accessType
}


</span>


</td>









<td

className="
px-2
py-2
text-sm
"

>


{

(() => {


const status =
getMatchStatus(
prediction,
);



return (

<span

className={`
rounded-full
px-3
py-1
text-xs
font-medium

${
status==='Settled'

?

'bg-green-500/10 text-green-600'

:

status==='In Play'

?

'bg-blue-500/10 text-blue-600 animate-pulse'

:

status==='Needs Settlement'

?

'bg-yellow-500/10 text-yellow-600'

:

'bg-muted text-muted-foreground'

}

`}

>

{status}

</span>

);


})()

}



</td>







</tr>


)

)

}



</tbody>



</table>


</div>


</div>


  );


}