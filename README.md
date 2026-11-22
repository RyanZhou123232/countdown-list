# Countdown List

Countdown List shows how many days are left until dates worth looking forward to, such as trips, concerts, or breaks. I chose a countdown list because I wanted to make something simple enough to use at a glance.

## Screens

- **Countdowns** shows each saved event, its date, and the number of days left or days since it happened. Events happening today are marked **Today**. Tap **Add countdown** to open the form.
- **New countdown** lets you name an event and pick a date. Tap **Save countdown** to return to the list with the new event at the top. Saved events stay on the device after the app closes.

## Setup and run

This project uses **Expo SDK 58** and Expo Router. Install Node.js 22.13 or later, then run these commands from the project folder.

```sh
npm install
npx expo login
npx expo start
```

Sign into the same Expo account in Expo Go and scan the QR code with your phone. Keep the phone and computer on the same Wi-Fi network. If the phone cannot connect over Wi-Fi, try `npx expo start --tunnel`. Press `w` for a browser preview.

## Demo device

The two-screen flow and persistence have been verified in a browser. The phone model will be recorded after the Expo Go demo.

## What I learned

A countdown uses calendar days on the device. Counting elapsed hours and dividing by 24 can give the wrong result around daylight saving time, when a local calendar day can be shorter or longer than 24 hours.
