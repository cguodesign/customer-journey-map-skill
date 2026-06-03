---
journey: Food Delivery — Placing an Order
created: 2026-06-02
last-modified: 2026-06-02
personas:
  - name: Customer
    role: Hungry person ordering food via the app
    type: primary
  - name: Order-Router
    role: Service that routes new orders to the right restaurant endpoint
    type: system
  - name: Restaurant-Tablet
    role: In-store device where staff receive and accept orders
    type: system
  - name: Kitchen-Staff
    role: Restaurant cooks who accept and prepare the order
    type: backstage
  - name: Dispatch-System
    role: Engine that matches orders to nearby available drivers
    type: system
  - name: Payment-Gateway
    role: Service that authorizes and holds funds on the card
    type: system
active-categories: [service-layers, systems, actions, failure, temporal]
---

## Milestone: place-order

- title: Place Order
- description: The customer commits to their cart by tapping "Place Order." A single visible tap fans out into four backstage processes the customer never sees — order routing, kitchen acceptance, driver dispatch, and payment authorization.
- backstageSummary: When a customer taps "Place Order," the app instantly routes the order to the restaurant's tablet for the kitchen to accept and cook, finds and assigns a nearby driver timed to the food being ready, and authorizes and holds the payment on their card — all automatically and out of sight.

### Step: tap-place-order

- persona: [Customer]
- description: Reviews the cart, confirms address and payment, and taps "Place Order." Sees a spinner, then a confirmation screen.

- doing: Taps the "Place Order" button on the checkout screen
- channel: Mobile app — checkout screen
- frontstage: Customer taps "Place Order" and waits on a spinner; receives an order-confirmation screen with an estimated delivery time
- lineOfVisibility: Everything past the tap is invisible to the customer — routing, kitchen acceptance, driver match, and payment hold all happen backstage
- duration: ~2-5 sec perceived (until confirmation appears)
- valueExchange: Customer commits money (authorized hold) and time in exchange for a promised meal and delivery
- momentOfTruth: The confirmation screen is the trust anchor — if it stalls or fails here, the customer doubts the whole transaction
- parallelPath: → route-to-restaurant, → authorize-payment (kick off concurrently on tap)
- next: → route-to-restaurant

### Step: route-to-restaurant

- persona: [Order-Router, Restaurant-Tablet]
- description: The order payload is routed to the correct restaurant's in-store tablet and surfaced as a new incoming order.

- backstageAction: Order-Router resolves the restaurant's active endpoint and pushes the order to its tablet
- systems: [Order-Router, Restaurant-Tablet, Push-notification service]
- dataFlow: Cart contents, customer notes, item modifiers, and order ID flow from the app backend to the restaurant tablet
- automation: Fully automated routing; no human involved until the tablet rings
- notification: Tablet plays an audible alert and shows the new order card
- duration: ~1-3 sec to land on the tablet
- failureMode: Tablet is offline, asleep, out of paper, or the restaurant has silenced alerts — order goes unseen
- failureImpact: high
- recoveryPath: Auto-retry / fallback to phone-confirmation call to the restaurant; eventual cancellation if unreachable
- next: → kitchen-accepts

### Step: kitchen-accepts

- persona: [Kitchen-Staff, Restaurant-Tablet]
- description: Restaurant staff see the incoming order on the tablet, accept it, and begin cooking. Acceptance sets the prep-time clock.

- doing: Staff tap "Accept" and enter or confirm an estimated prep time, then start cooking
- backstageStaff: Kitchen-Staff
- frontstageAction: Tablet displays the order ticket; staff tap Accept
- backstageAction: Kitchen begins food preparation against the ticket
- systems: [Restaurant-Tablet]
- trigger: New-order alert from the routing step
- duration: Acceptance in seconds-to-minutes; cooking ~10-25 min depending on items
- waitTime: Time between order landing and staff tapping Accept is dead time the customer is waiting through
- failureMode: Staff reject the order (item out of stock, kitchen slammed) or never respond during a rush
- failureProbability: medium
- recoveryPath: Order reassigned, customer notified of delay/cancellation, or substituted item offered
- bottleneck: Kitchen capacity during peak hours caps how fast orders can be accepted and cooked
- next: → dispatch-driver

### Step: dispatch-driver

- persona: [Dispatch-System]
- description: The dispatch engine searches for a nearby available driver and assigns them to pick up the order, timed against the kitchen's prep estimate.

- backstageAction: Dispatch-System scores nearby drivers by proximity, availability, and direction, then offers/assigns the trip
- systems: [Dispatch-System, Driver app, Geolocation service]
- automation: Automated matching; driver may still accept or decline the offer
- dataFlow: Restaurant location, prep ETA, and driver GPS positions feed the matching algorithm
- trigger: Fires around kitchen acceptance so the driver arrives near food-ready time
- duration: Seconds to minutes to find and confirm a driver
- orchestration: Timed against the kitchen prep estimate so the driver and the food are ready at the same moment
- failureMode: No driver available in range, or drivers decline repeatedly — order sits cooked and waiting
- failureProbability: medium
- failureImpact: high
- bottleneck: Driver supply in the area, especially during weather events or peak demand
- recoveryPath: Widen search radius, increase driver incentive, or hold/notify customer of delay
- next: → authorize-payment

### Step: authorize-payment

- persona: [Payment-Gateway]
- description: The customer's payment method is authorized and the order amount is held (not yet captured) the moment the order is placed.

- backstageAction: Payment-Gateway runs an authorization and places a hold on the customer's card for the order total
- systems: [Payment-Gateway, Card network, App backend]
- dataFlow: Order total, tokenized payment method, and customer/merchant IDs sent to the gateway; auth result returned
- automation: Fully automated; runs concurrently with routing the instant the customer taps Place Order
- valueExchange: Funds are reserved (held) but not captured until the order is fulfilled
- policy: Authorize-and-hold now, capture on delivery/fulfillment — protects against charging for an order that never gets accepted
- duration: ~1-2 sec for the auth response
- trigger: Fires immediately on the customer's tap, in parallel with routing
- failureMode: Card declined, insufficient funds, expired card, or fraud-hold on the authorization
- failureProbability: medium
- failureImpact: high
- recoveryPath: Customer prompted to fix or switch payment method before the order is allowed to proceed; order blocked until auth succeeds
- parallelPath: Runs alongside → route-to-restaurant
