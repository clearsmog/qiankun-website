---
title: Rates and FX Desk Analytics
description: A daily desk run for a synthetic GBP and USD rates and FX derivatives book — delta ladder by par quote, vega, a P&L explain that predicts each day from the prior close's risk, and a fixings check against the published SONIA and SOFR indices, replayed over 38 business days of real market moves
date: 2026-11-11
lastUpdated: true
head:
  - - meta
    - property: og:title
      content: Rates and FX Desk Analytics
  - - meta
    - property: og:description
      content: Delta ladder, daily P&L explain and fixings checks for a synthetic SONIA/SOFR swap, swaption and FX book, replayed over 38 business days of real rate and FX moves
---

<script setup>
import d from './data/rates-fx-desk.json'

const BLUE = '#0071e3'
const k = (v) => Math.round(v / 100) / 10
const num = (v) => Math.round(v).toLocaleString('en-GB')
const r = d.replay

const metrics = [
  { label: 'Business days replayed', value: String(r.days), hint: '20 Aug – 15 Oct 2026 · real rate and FX moves' },
  { label: 'Daily P&L left unexplained by risk', value: `${(r.grossUnexplained / r.grossPnl * 100).toFixed(1)}%`, hint: `${num(r.grossUnexplained)} of ${num(r.grossPnl)} USD, absolute sums` },
  { label: 'Trade-days over the threshold', value: String(r.flaggedTradeDays), hint: `each traced to a measured cause · at most ${r.largestRemaining} USD left` },
  { label: 'Accrual periods matching the published index', value: `${d.fixings.length}/${d.fixings.length}`, hint: 'compounded SONIA and SOFR within 0.001bp' },
]

const ladderSeries = (ccy) => [
  { name: 'Prior close (14 Oct)', color: 'muted', data: d.ladder[ccy].prior.map(k) },
  { name: '15 Oct', color: BLUE, data: d.ladder[ccy].today.map(k) },
]

const scatter = r.predicted.map((p, i) => [k(p), k(r.revalued[i]), Math.abs(k(r.unexplained[i]))])
const unexplainedSeries = [{ name: 'Unexplained', color: BLUE, data: r.unexplained.map(k) }]
const causeSubs = {
  'Rate convexity': 'swaptions, and swaps on the largest rate moves',
  'FX gamma': 'FX options',
  'Rates-FX cross': "the day's GBP P&L translated at the new spot",
  'Curve basis': 'rolled curve vs the curve its par quotes rebuild',
  'Remaining': 'third-order terms on FX options',
}
const causeItems = r.causes.map((c, i) => ({ label: c.label === 'Left after the four causes' ? 'Remaining' : c.label, value: k(c.value), sub: causeSubs[c.label === 'Left after the four causes' ? 'Remaining' : c.label], color: i === r.causes.length - 1 ? 'muted' : BLUE }))
const PRODUCT = { SWPTN: 'Swaptions', FXOPT: 'FX options', OIS: 'OIS swaps', FXFWD: 'FX forward' }
const byCause = [...r.byCause].sort((a, b) => b.tradeDays - a.tradeDays)
const LINE = { 'carry (revalued)': 'Carry (revalued)', 'vols': 'Vols (synthetic, static)', 'new trades (day-one value)': 'New trades, day-one value', 'total': 'Total' }
</script>

# Rates and FX Desk Analytics

Personal build with AI coding agents · Python, QuantLib, Excel VBA · November 2026

A trading desk's support team answers the same questions every morning: what is the risk, did yesterday's risk explain today's P&L, and did the fixings come through correctly. This project runs those checks on a synthetic 26-trade book of SONIA and SOFR swaps, swaptions, cross-currency swaps and GBP/USD forwards and options, valued on real Bank of England, New York Fed and ECB data. Over 38 business days, **the prior close's risk predicted all but 2.8% of the daily P&L, and each of the 68 trade-days that missed by more than 1,000 USD was traced to one of four measured causes.**

*The trades, trade dates and volatilities are synthetic; the curves, fixings, compounded indices and FX spot are public data. The USD curve is the US Treasury par curve, used as a proxy for SOFR swap rates. Code, tests and reports: [github.com/clearsmog/rates-fx-desk-analytics](https://github.com/clearsmog/rates-fx-desk-analytics).*

## Snapshot

<HeroMetrics :items="metrics" />

## The risk, read in hedge instruments

The delta ladder raises each par swap quote on the curve by 1bp in turn, bootstraps the curve again and revalues the book. The result reads in the instruments a desk would hedge with. As a check, the buckets add up to all quotes moved together within 3 USD per bp.

<VizPanel
  badge="GBP · 15 Oct 2026"
  title="GBP delta by par quote"
  subtitle="USD thousands per +1bp on each SONIA swap quote. Little changed on the day: the book's GBP risk sits at 2 to 5 years and 10 years."
  source="Bank of England OIS curve; own calculation"
  as-of="15 Oct 2026 vs prior close"
>
  <EGroupBar :categories="d.ladder.GBP.tenors" :series="ladderSeries('GBP')" unit="k" y-name="USD per +1bp" :value-labels="false" :height="300" />
</VizPanel>

<VizPanel
  badge="USD · 15 Oct 2026"
  title="USD delta by par quote"
  subtitle="Two swaps booked on the day moved the 2-year bucket by −6.4k and the 7-year bucket by +11.9k. Almost all of the day's change in the ladder is those two trades."
  source="US Treasury par curve (SOFR proxy); own calculation"
  as-of="15 Oct 2026 vs prior close"
>
  <EGroupBar :categories="d.ladder.USD.tenors" :series="ladderSeries('USD')" unit="k" y-name="USD per +1bp" :value-labels="false" :height="300" />
</VizPanel>

Vega is reported per trade for a parallel move in the volatility input and grouped by expiry and underlying tenor: nine live options on 15 October. The volatilities themselves are synthetic.

## One day's P&L, explained from the prior close

On 15 October GBP swap quotes fell by up to 5bp, USD by up to 9bp, and GBP/USD fell 0.15%. The predicted column multiplies the prior close's ladder by the move in each quote, and the FX delta by the move in spot. The revalued column reprices every trade.

<table>
  <thead><tr><th>Line (USD)</th><th>Predicted from risk</th><th>Revalued</th><th>Unexplained</th></tr></thead>
  <tbody>
    <tr v-for="row in d.pnlSummary" :key="row.line">
      <td>{{ LINE[row.line] || row.line }}</td><td>{{ num(row.predicted_from_risk) }}</td><td>{{ num(row.revalued) }}</td><td>{{ num(row.unexplained) }}</td>
    </tr>
  </tbody>
</table>

Every swap, forward and cross-currency swap was explained to within 1,000 USD. Two USD swaptions were not (+4,768 and −3,653). Applying all the quote moves together, instead of one at a time, shows that rate convexity is 98% and 99.8% of those two amounts: a first-order ladder cannot see an option's delta changing as rates move.

## The same check over 38 business days

<VizPanel
  badge="Replay · 38 days"
  title="Predicted against revalued daily P&L"
  subtitle="One point per day, USD thousands, existing book. Points on the diagonal are days the prior close's risk explained in full; shading is the size of the miss."
  source="Bank of England, US Treasury, ECB; own calculation"
  as-of="20 Aug – 15 Oct 2026"
>
  <EScatter :points="scatter" x-name="Predicted from risk" y-name="Revalued" color-name="Unexplained" x-unit="k" y-unit="k" color-unit="k" />
</VizPanel>

<VizPanel
  badge="Replay · 38 days"
  title="Daily unexplained P&L"
  subtitle="USD thousands, whole book. The largest miss, 6.5k on 23 September, came on the largest move of the window: GBP 5-year +15bp, USD 5-year +16bp, GBP/USD −0.7%."
  source="Own calculation"
  as-of="20 Aug – 15 Oct 2026"
>
  <EGroupBar :categories="r.dates" :series="unexplainedSeries" unit="k" y-name="USD" :value-labels="false" :height="300" />
</VizPanel>

The window was chosen because no coupon, delivery or expiry falls in it, so no cash leaves the book. A new trade's day-one value is left out of both columns: it is mostly premium, and the model does not carry premium cash.

## Where the misses came from

A trade-day is flagged when its unexplained P&L exceeds 1,000 USD. Each flagged amount is then split into four causes that can be measured by repricing, and whatever is left is reported.

<VizPanel
  badge="68 flagged trade-days"
  title="What the flagged amounts were made of"
  subtitle="Sum of absolute amounts, USD thousands. After the four measured causes, 0.3k is left in total, and no single trade-day keeps more than 205 USD."
  source="Own calculation"
  as-of="20 Aug – 15 Oct 2026"
>
  <EBar :items="causeItems" unit="k" x-name="USD" :max="140" :height="300" />
</VizPanel>

<table>
  <thead><tr><th>Product</th><th>Main cause</th><th>Trade-days</th><th>Largest unexplained (USD)</th></tr></thead>
  <tbody>
    <tr v-for="row in byCause" :key="row.product + row.main">
      <td>{{ PRODUCT[row.product] }}</td><td>{{ row.main }}</td><td>{{ row.tradeDays }}</td><td>{{ num(row.largest) }}</td>
    </tr>
  </tbody>
</table>

Options missing a first-order explain is expected. Two findings were not:

- **Two plain GBP swaps breached the threshold on three days.** On the days GBP rates moved 12 to 17bp, the swap's own convexity was about half of the miss. The other half is a cross term: the swap's P&L is in GBP and reported in USD, and the day's GBP P&L translated at the new spot sits in neither the rates ladder nor the FX delta.
- **One FX forward breached it on a Monday.** Yesterday's curve rolled over a weekend is not exactly the curve that its own par quotes rebuild at the standard tenors. The 1,071 USD on a four-month forward is that difference and nothing else: a model artefact, not a market effect.

## Fixings against the published indices

A compounded overnight coupon is only as good as the daily fixings behind it. For each accrual period that last settled, is accruing, or pays within five business days, the compounded rate from the daily fixings is set beside the rate implied by the Bank of England's SONIA Compounded Index and the New York Fed's SOFR Index.

<table>
  <thead><tr><th>Trade</th><th>Index</th><th>Period</th><th>Status</th><th>Compounded (%)</th><th>From index (%)</th><th>Difference (bp)</th></tr></thead>
  <tbody>
    <tr v-for="f in d.fixings" :key="f.trade_id + f.index + f.period_start">
      <td>{{ f.trade_id.replace('NBM-', '') }}</td><td>{{ f.index }}</td><td>{{ f.period_start }} → {{ f.period_end }}</td><td>{{ f.status }}</td><td>{{ f.compounded_rate_pct.toFixed(6) }}</td><td>{{ f.index_rate_pct.toFixed(6) }}</td><td>{{ f.diff_bp.toFixed(6) }}</td>
    </tr>
  </tbody>
</table>

All 14 periods agree within 0.001bp. Two of the SOFR periods span Good Friday, when no rate is published and the previous day's rate is carried.

## Valuation and price challenge

The same curves and pricers drive a second run, modelled on a third-party valuation service: every trade is valued twice (own pricers and an independent QuantLib rebuild, which agree to under 1 USD on swaps and swaptions), then compared with synthetic dealer marks. Of 26 marks, 15 carry a planted break and 11 are clean; the attribution finds all 15 and clears the 11. An Excel VBA macro builds the exception log, ranked by size against tolerance. The answer key is self-generated, so this tests the logic, not real-world accuracy.

## Method

- **Curves**: par OIS quotes, sequential bootstrap, log-linear discount factors; one curve per currency for projection and discounting.
- **Pricers**: OIS with realised compounding for the current period; Bachelier swaptions; cross-currency swaps with notional exchanges; FX forwards by covered interest parity; Garman-Kohlhagen FX options off a vanna-volga smile.
- **Delta ladder**: each par quote +1bp, curve bootstrapped again, book revalued.
- **Daily explain**: the risk is measured on the prior close's curves rolled one day, so roll-down sits in carry and the quote moves are the market's own.
- **Measured causes**: rate convexity (all quote moves together, less the linear sum); FX gamma (the spot move alone, less the delta term); rates-FX cross (the rest of the revalued spot step); curve basis (rolled curve against its re-bootstrap).

## Honest boundaries

- A personal build on a synthetic book: no desk used it, and the P&L figures show the method, not a trading record.
- The volatilities are synthetic and static, so the vega line of the explain is zero by construction. Vega is a parallel move of the vol input, not per grid node.
- The USD curve is a Treasury proxy, so USD values are illustrative. There is no cross-currency basis curve.
- Fixings use a zero-day lookback; SONIA swaps commonly use five days. Cash leaving the book is flagged, not modelled.
- "Fixings check" means the overnight fixings that set each coupon. Repos, collateral bonds and reset-risk compression runs are not modelled.

## Stack

Python · pandas · NumPy · SciPy · QuantLib (reference valuation only) · openpyxl · Excel VBA · pytest (35 tests) · uv

## Competencies

Interest-rate and FX derivatives valuation · delta and vega risk reporting · daily P&L explain and investigation of unexplained amounts · overnight-index compounding and fixings · price challenge against counterparty marks · process automation in Python and VBA

---

[← All projects](/projects/)
