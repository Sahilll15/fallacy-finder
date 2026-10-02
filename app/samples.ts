export type Sample = { id: string; label: string; kind: string; text: string };

export const SAMPLES: Sample[] = [
  {
    id: 'bikes',
    label: 'bike lanes debate',
    kind: 'two speakers',
    text: `A: The city should add protected bike lanes on Main Street. After Portland added them on Broadway, a 2019 city report found cycling injuries on that corridor fell by 40 percent.
B: You only care about this because you sold your car and want everyone else to suffer too.
A: My car has nothing to do with it. The report is public and the numbers are on page 12.
B: So you want to ban cars from downtown entirely and let every shop on Main Street go under.
A: I want one lane on one street. Shops on Broadway saw sales rise 8 percent in the year after, according to the same report.
B: If we give cyclists Main Street, next it will be every street, and soon nobody will be able to drive anywhere in this town.
A: Each street would get its own vote, so that chain does not follow.
B: Either we keep the parking or the downtown dies. Those are the choices.
A: Studies of retail streets in Toronto found most shoppers arrive on foot or by transit, not by car, so parking is not the only lifeline.
B: What about the potholes on Elm Street? Fix those before you start painting bike lanes.`,
  },
  {
    id: 'oped',
    label: 'op-ed on remote work',
    kind: 'one voice',
    text: `Remote work is destroying the modern company, and anyone who says otherwise has never managed a real team. I talked to three founders last month and all of them said productivity collapsed after they went remote, so the verdict is in. A Nobel prize winning economist told an interviewer he prefers the office, which should settle the matter for the rest of us. If we let people work from home on Fridays, next they will want Mondays, and within a year nobody will come in at all. You are either in the office building the culture or you are a freelancer in all but name. Offices create culture because culture is what happens in offices. Critics point to surveys about happier employees, but what about the managers who are burning out trying to keep remote teams aligned? A 2023 Stanford study did find that hybrid schedules cut resignations by a third with no measurable drop in output, which is worth taking seriously.`,
  },
  {
    id: 'thread',
    label: 'reply thread on nuclear power',
    kind: 'two speakers',
    text: `A: Nuclear has one of the lowest death rates per unit of energy of any source, lower than coal by a factor of several hundred according to Our World in Data.
B: Sure, and Chernobyl and Fukushima were just fine, right? Nuclear is basically a bomb waiting to go off.
A: Both were serious, but the death toll per terawatt hour across the whole industry is still tiny compared to fossil fuels, which kill millions a year through air pollution.
B: Every scientist I follow says renewables are the only real answer, so the debate is over.
A: Plenty of climate scientists, including the IPCC pathways, include nuclear alongside renewables. It is not one or the other.
B: Nuclear is unsafe because it is dangerous.
A: France gets about 70 percent of its electricity from nuclear and has some of the lowest grid emissions in Europe.`,
  },
];
