'use client';


import {
  Input,
} from '@/components/ui/input';


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';





interface Props {


  search:string;

  setSearch:(value:string)=>void;



  status:string;

  setStatus:(value:string)=>void;



  access:string;

  setAccess:(value:string)=>void;



  league:string;

  setLeague:(value:string)=>void;



  leagues:{
    code:string;
    name:string;
  }[];

}





export default function PredictionsFilters({

  search,

  setSearch,

  status,

  setStatus,

  access,

  setAccess,

  league,

  setLeague,

  leagues,

}:Props){



return (


<div
className="
grid
gap-4
md:grid-cols-4
"
>



<Input

placeholder="Search teams..."

value={search}

onChange={
(e)=>
setSearch(
e.target.value,
)
}

/>





<Select

value={status}

onValueChange={
setStatus
}

>


<SelectTrigger>

<SelectValue
placeholder="Status"
/>

</SelectTrigger>



<SelectContent>


<SelectItem value="all">

All Status

</SelectItem>



<SelectItem value="Upcoming">

Upcoming

</SelectItem>



<SelectItem value="In Play">

In Play

</SelectItem>



<SelectItem value="Needs Settlement">

Needs Settlement

</SelectItem>



<SelectItem value="Settled">

Settled

</SelectItem>



</SelectContent>


</Select>








<Select

value={access}

onValueChange={
setAccess
}

>


<SelectTrigger>

<SelectValue
placeholder="Access"
/>

</SelectTrigger>



<SelectContent>


<SelectItem value="all">

All Access

</SelectItem>




<SelectItem value="free">

Free

</SelectItem>




<SelectItem value="regular">

Regular

</SelectItem>




<SelectItem value="vip">

VIP

</SelectItem>



</SelectContent>


</Select>










<Select

value={league}

onValueChange={
setLeague
}

>


<SelectTrigger>

<SelectValue
placeholder="League"
/>

</SelectTrigger>



<SelectContent>


<SelectItem value="all">

All Leagues

</SelectItem>



{
leagues.map(
(item)=>(
<SelectItem

key={
item.code
}

value={
item.code
}

>

{item.name}

</SelectItem>
)
)
}



</SelectContent>


</Select>



</div>


);


}