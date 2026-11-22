# TicketHub



Web application for selling event tickets. Built on the RS1 2026/27 starter

(ASP.NET Core, Clean Architecture, CQRS, Angular).



## What it does

Organizers publish events with sectors, seats and a price list per seat category.

Buyers browse events, reserve seats, pay in BAM or EUR and receive a ticket with a QR code.

Scanners validate tickets at the entrance.



## Roles

Admin, Organizer, Buyer, Scanner.



## Main flow (buyer)

Browse events, select seats, reserve with expiry, choose currency and pay,

receive ticket with QR code, cancel and refund.



## Tech stack

- Backend: .NET 10, EF Core, SQL Server, MediatR, FluentValidation, JWT

- Frontend: Angular 21, Angular Material



## Running locally

1. Backend (from Market.Backend):

&#x20;  `dotnet run --project Market.API --launch-profile https`

2. Frontend (from Market.Frontend): `npm install`, then `npm start`

3. The database connection string is read from appsettings.json. To use a different

&#x20;  database locally, set it with user-secrets instead of editing the file:

&#x20;  `dotnet user-secrets set "ConnectionStrings:Main" "<your connection string>" --project Market.API`



## Project organization

Work is tracked with GitHub issues and the public GitHub Project; every change goes

through a branch and a pull request.

