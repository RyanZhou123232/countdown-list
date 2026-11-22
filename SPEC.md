# Countdown List

## Goal

Countdown List helps users keep track of dates they are looking forward to, such as trips, concerts, and school breaks. Users can add an event and see how many calendar days remain whenever they open the app.

## Screens

### Countdowns

The home screen lists each saved event with its name, date, and countdown. New entries appear first. If the list is empty, the screen explains how to add a first countdown. **Add countdown** opens the form.

The countdown uses the device's local calendar date. Future events show how many days are left, events happening today show **Today**, and past events show how many days ago they happened.

### New countdown

The form has an **Event name** field, an **Event date** picker, and a **Save countdown** button. The name must contain at least one non-whitespace character, and a date must be selected. If either is missing, the form displays a message and remains open so the user can complete it.

A successful save returns the user to the home screen and shows the new entry at the top. The user can also go back without saving. If saving fails, the form stays open with the entered values and a message to try again.

## Data and scope

Each event stores a name and a calendar date on the device. Saved events survive closing and reopening the app. The first version supports adding and viewing countdowns. Editing, deletion, reminders, and account sync are outside its scope.

## Acceptance criteria

1. On a fresh install, the home screen shows **No countdowns yet** and an **Add countdown** button. Tapping the button opens **New countdown**.
2. Enter a name, select a date, and tap **Save countdown**. The app returns to the home screen and displays the new event's name and date. Add a second event and verify that it appears above the first.
3. With a date selected, leave the name blank or enter only spaces and tap **Save countdown**. The app shows a name error, stays on the form, and creates no entry.
4. Enter a name without selecting a date and tap **Save countdown**. The app shows a date error, stays on the form, and creates no entry.
5. Set up an event on the form and go back before saving. The home screen shows the same saved entries as before.
6. Add events dated tomorrow, today, and yesterday. The list shows **1 day left**, **Today**, and **1 day ago** for those entries, respectively.
7. Save an event, fully close Expo Go, and reopen the project. The same event name and date are still visible.
