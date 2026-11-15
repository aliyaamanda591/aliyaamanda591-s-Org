import type { PortfolioState } from './state-validation';

// Compatibility for the old six-card, zero-balance starter shell only.
// User-selected cards have company metadata; any transactions, units, values,
// manual prices, archived cards, or changed symbols keep the entire state intact.
const starter = [
  ['BMRI','stock','BMRI.JK','lembar'],['BUMI','stock','BUMI.JK','lembar'],
  ['BTC INDODAX','crypto','bitcoin','BTC'],['BBCA','stock','BBCA.JK','lembar'],
  ['EMAS K24','gold24','XAU','gram'],['EMAS K15','gold15','XAU','gram'],
];
export function withoutUnusedStarterCards(state:PortfolioState):PortfolioState {
  if(state.transactions.length||state.assets.length!==starter.length)return state;
  const unused=starter.every(([name,kind,symbol,unit])=>state.assets.some(a=>
    a.name===name&&a.kind===kind&&a.symbol===symbol&&a.unit===unit&&
    a.quantity===0&&a.valueSnapshot===0&&(a.manualPrice==null||a.manualPrice===0)&&
    !a.archived&&!a.company));
  return unused?{...state,assets:[]}:state;
}
