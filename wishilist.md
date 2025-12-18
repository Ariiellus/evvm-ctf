# Wishlist

## Gasless Apps

Fishers pay the gas, users just sign. Fisher gets paid through priority fees + staking rewards.

### Videogames

**The problem:** Players need to own native tokens (ETH) to play. Most gamers don't have wallets set up. Even on L2s, onboarding is friction.

**What to build:**
- Batching mechanisms for player actions into one transaction using `payMultiple`
- Move items between game servers via Treasury (Server A = EVVM #1001, Server B = EVVM #1002)
- Player + game server both sign to prevent cheating
- Distribute boss loot to 20 players in one `dispersePay` call

### Social Media

**The problem:** Users need to own native tokens just to post. New users have to buy crypto before they can even try the app. Friction kills growth.

**What to build:**
- Post and tip using @usernames via NameService
- Batch thousands of tips when posts go viral
- Stakers and fishers vote to reject spam (3+ flags = fisher ignores it)

## Lending Fishers

**The problem:** You have a $10k loan. Price drops, you're about to get liquidated and lose everything. You're asleep or at work, can't close the position in time.

**What to build:**
- Fisher monitors your loan 24/7 across multiple EVVMs
- You pre-sign escape hatches: "close 25% at 75% LTV", "close 50% at 90% LTV"
- Fisher closes just enough to save you, earns 1% fee ($100 on a $10k position)
- Fisher can pull collateral from your other EVVM accounts to save one position

**Some questions around:**
- Why would fisher help you? Answer: 1% fee beats gas costs
- How to prevent fishers from manipulating oracles?
- A presigned threshold could reduce the risk?
- How to handle when funds are in multiple EVVMs?

## Multi-EVVM Bridges

### Same Chain Bridge (3+ EVVMs on Ethereum)

**The problem:** Three different apps deployed three different EVVMs on Ethereum. Users can't move tokens between them easily.

**What to build:**
- Atomic swaps between EVVMs using HTLCs (hash locks)
- Fisher arbitrage: Buy MATE at 0.99 USDC on EVVM #1002, sell at 1.01 on #1001, profit 0.02 + rewards
- One liquidity pool that works across all three EVVMs
- Use Registry contract to find all EVVMs automatically

**Hard parts:**
- Making swaps atomic (fisher reveals secret to claim both sides, or timeout refunds)
- Liquidity split across multiple EVVMs (fishers arbitrage to balance prices)
- What if swap fails halfway? Need timeout refunds

### Cross-Chain Bridge (3+ EVVMs on different chains)

**The problem:** EVVM #1 on Ethereum, EVVM #2 on Arbitrum, EVVM #3 on Base. Can't use them together.

**What to build:**
- Send messages between EVVMs, not just tokens
- Fisher watches Chain A events, builds signatures for Chain B
- Proof that Chain B executed gets sent back to Chain A
- Lock tokens in Treasury on Chain A, mint on Chain B

**Hard parts:**
- Fisher needs to watch multiple chains simultaneously
- Proving execution happened on Chain B
- Example: Earn item on Ethereum game, unlock it on Arbitrum game
- Fisher picks when to execute based on gas prices

## Subscription Automation

**The problem:** Crypto has no auto-pay. You have to manually send payment every month. Miss one payment, lose access.

**What to build:**
- Sign 12 payments upfront (one per month, each with different async nonce)
- Fisher checks daily, executes payment on day 30
- Fisher gets 0.5 MATE per execution + staking rewards
- To cancel: sign a cancellation transaction

**Hard parts:**
- User runs out of money (fisher retries 3x over 72 hours, then gives up)
- Price increases (user pre-signs 15 MATE max, service only claims 10 MATE actual)
- Pausing (user signs "skip next 3 months" transaction)
- Refunding everyone at once (use `dispersePay`)

**Use cases:**
- Netflix-style SaaS subscriptions
- DAO membership renewals
- Monthly donations to creators
- DCA buying crypto every month

## Escrow Marketplace

**The problem:** Hiring a freelancer? Buying from a stranger? You need a trusted middleman. Escrow.com charges 3.25% and holds your money for 2 weeks.

**What to build:**
- Buyer signs "release 100 MATE if delivered"
- Seller signs "refund 100 MATE if I fail"
- Fisher watches delivery tracking API, releases payment automatically
- If disputed: 5 stakers vote, majority decides
- Fisher fee: 1% (you save 2.25% vs Escrow.com)

**Hard parts:**
- Partial delivery (ordered 10 items, got 7): Fisher splits payment 70/30
- Item broken/wrong: Stakers review photo evidence, vote
- Seller wants money early: Buyer can sign early release for 5% discount
- Buyer and seller on different EVVMs: Fisher coordinates Treasury bridge
- Freelance milestones: 3 separate async nonces (design 30%, frontend 40%, backend 30%)
- Reputation: Track success rate in NameService metadata
- Scam insurance: 10% of fees go to insurance pool, bad fishers get slashed

**Where this works:**
- Hiring devs/designers
- Buying stuff online from strangers
- High-value NFT trades
- Anything where you need trust

## Prediction Markets

**The problem:** Want to bet with friends on anything: sports, elections, "will this PR get merged", "will it rain tomorrow". Current platforms are complex or restricted by region.

**What to build:**
- Create a bet: "ETH hits $4000 before Dec 31"
- Both sides pre-sign with async nonces: @alice signs "pay @bob if YES", @bob signs "pay @alice if NO"
- Stake goes into pool (both put in 50 MATE, winner gets 100)
- Fisher monitors price feeds/APIs, executes winning signature when outcome is clear
- If disputed: 5 stakers vote on what actually happened

**Examples:**
- Sports: "Team A wins the game" - 100 people bet YES, 50 bet NO, winner-takes-all pool
- Peer bets: "@alice bets @bob 20 MATE that ETH > $4000 by Friday"
- Crowd predictions: "Will this tweet get 10k likes in 24h?" - everyone pre-signs their bet
- Project milestones: "Will we ship v2.0 by Q2?" - team members bet on their own deadline

**Hard parts:**
- Fisher needs reliable outcome data (Chainlink for prices, APIs for events)
- Disputed outcomes (stakers vote, majority wins, voters earn fee)
- What if outcome is unclear? Refund both sides after timeout
- Front-running: Fisher sees big bet, tries to bet same side (solution: commit-reveal scheme)
- Multiple fishers race to execute first (first wins, others get reverted tx)

**Why fishers love this:**
- Every resolved bet = fee for fisher who called it correctly
- High priority fees on big bets (winner pays 2%, goes to fisher)
- Stakers who vote on disputes earn portion of loser's stake

**Async nonce magic:**
- Sign "pay @alice if YES" with nonce 100
- Sign "pay @bob if NO" with nonce 101
- Only one can ever execute (outcomes are mutually exclusive)
- Fisher picks the right nonce based on real outcome

## Dev Tooling

Create a better dev tooling for the EVVM. Focus on UX/UI. Make it easier to build and deploy EVVM applications. Mandatory requirement: Make commits at least every six hours, work on branches, make PRs inside your repo. Comment every PR / commit accordingly.

**What ideas could you build:**

### Signature Builder
- Drag and drop UI for EIP-191 signatures (stop doing string concatenation manually)
- Templates: payment, username registration, staking, deposits
- Shows you the signature before you sign it
- Export as JSON for fishers

### Fisher Testing Tool
- Test locally before deploying
- Simulate fishing spots and fisher behavior
- Try different priority fees to see what works
- Better error messages when signatures fail

### EVVM Dashboard
- See all EVVMs from Registry contract in one place
- Watch transactions across all your EVVMs
- Check total balance across all EVVMs
- Fisher stats: how many transactions processed, how much earned
- Alerts for loan liquidations, subscription renewals, disputes

### Starter Kits
- Template contracts for common stuff
- React/Vue/Next.js examples
- Fisher bot with configs you can tweak
- Testing helpers