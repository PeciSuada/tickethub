# Research: similar ticketing applications

Screenshots of existing ticket sales applications, collected for TicketHub (issue #2). Personal data was not captured.

## Ticketmaster (US)

| File | What it shows |
|---|---|
| `ticketmaster-event-list.png` | Browsing by category (Concerts, Sports, Arts) and by genre, plus a Cities menu |
| `ticketmaster-event-card.png` | Event card: title, date, time and venue |
| `ticketmaster-seat-selection.png` | Venue map with sections, filters (number of tickets, price, ticket types) and a price list that includes fees |
| `ticketmaster-checkout.png` | Checkout with a countdown ("Time left") that holds the tickets |
| `ticketmaster-ticket-sample.png` | Sample digital ticket: section, row, seat, gate, price and QR code. Source: <https://ticketmaster.ph/mobile-tickets> |

## Eventim (UK)

| File | What it shows |
|---|---|
| `eventim-home-page.png` | Home page with search, location menu and featured events |
| `eventim-event-page.png` | Event page: date, venue and availability |
| `eventim-seat-selection.png` | Ticket type and quantity selection with automatic seat allocation ("Best Available"), promo code field and fees |
| `eventim-checkout.png` | Checkout with "Your tickets are held for" countdown and a Release Tickets button |
| `eventim-ticket-sample.png` | Sample ticket: venue, date, zone, row, seat, price and fee shown separately, barcode. Source: <https://eventimb2b.no/fanticket/> |

## What I will reuse in TicketHub

- Seat map and price list per seat category (issues #9, #12, #14).
- Reservation with a visible countdown and the option to release seats (issues #16, #17, #18).
- Price and fees shown separately, plus a promo code field (issues #20, #21).
- Ticket with section, row, seat, gate and a QR code that is scanned at the entrance (issues #23, #27).
- Refund option at checkout (issue #25).

## What I would do differently

- Ticketmaster shows availability on a venue map by color; TicketHub will show a grid of seats per sector, with the color set by the seat category.
- Eventim assigns seats automatically; TicketHub lets the buyer pick exact seats and holds them for a limited time.
- Neither site shows prices in two currencies; TicketHub will show a quote in KM and EUR (issue #20).

## Notes

- Eventim does not show a venue map in the screenshots; it allocates seats automatically. The seat map is taken from Ticketmaster.
- The sample tickets are not real purchases. They contain no personal data.