# BidMaster - Documentation for Beginners

Welcome to BidMaster! This guide explains how the system works for developers and users.

## 1. System Modules
The app is split into two main sections:
- **User Module**: For regular people to browse, bid on, and list their own items.
- **Admin Module**: For staff to verify (approve/reject) items and monitor all bidding activity.

## 2. The Lifecycle of an Auction
1. **Listing**: A logged-in User goes to "List Item" and fills the form. The item is saved with a `PENDING` status.
2. **Verification**: Because the item is `PENDING`, it is **hidden** from the public Home page. Only an Admin can see it in their "Verification Queue".
3. **Approval**: The Admin logs in and clicks "Approve". The item status changes to `ACTIVE`.
4. **Bidding**: Now, the item appears on the Home page for **every user**. Any logged-in user (except the seller) can place a bid higher than the current price.
5. **Winning**: When the timer runs out, the system automatically marks the item as `SOLD` and identifies the highest bidder as the winner.

## 3. How to access the Admin Module
Use these credentials on the Login page:
- **Email**: `admin@bidmaster.com`
- **Password**: (Anything - the mock system currently only checks the email)

## 4. Technology Stack (The "Database")
- **Frontend**: React with Tailwind CSS for styling.
- **Database**: This app uses `LocalStorage`. It saves data directly in your browser. If you refresh the page, your items and bids stay there! If you clear your browser cache, the "database" resets.
- **Types**: We use TypeScript to make sure the data (like `Product` and `User`) always follows a strict structure.

## 5. File Structure
- `App.tsx`: The "Brain". Handles page navigation.
- `services/dbService.ts`: The "Manager". Handles saving and loading data to LocalStorage.
- `pages/`: Contains the screens for Home, Login, Dashboards, etc.
- `types.ts`: The "Rules". Defines what a Product or User looks like.
