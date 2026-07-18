import {
 Badge,
} from '@/components/ui/badge';



import {
 TrendingUp,
} from 'lucide-react';



import {
 AnalyticsDashboardResponse,
} from '@/types/analytics.types';



interface Props{

 data:
 AnalyticsDashboardResponse;

}



export default function AnalyticsHeader({
data,
}:Props){


return (

<div
className="
flex
items-center
justify-between
"
>


<div>

<h1
className="
text-3xl
font-bold
tracking-tight
"
>

Admin Analytics

</h1>


<p
className="
text-muted-foreground
"
>

Platform performance overview

</p>


</div>



<Badge
className="
flex
gap-2
"
>

<TrendingUp
size={16}
/>

Live Metrics

</Badge>



</div>

);


}