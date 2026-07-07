interface Props {

  leagueCode:string;

}



export default function LeagueHeader(
{
  leagueCode
}:Props
){


return (

<section className="
 rounded-2xl
 border
 border-border
 bg-card
 p-6
">


<h1 className="
 text-3xl
 font-bold
">

{leagueCode}

</h1>


<p className="
 mt-2
 text-muted-foreground
">

Live matches, standings and results

</p>


</section>

);

}