# NextChapter AI

A personal project

A book tracking application utilising artificial intelligence to give you your next
read suggestions

This app will allow you to save books to read later, tracking currently reading and view recent reads.

## Installing and Running API
Node 22.10.0 is recommended currently

`cd api`

`npm i`

`npm run start`

This runs the server on port 3001

## Installing and Running frontend
Node 22.10.0 is recommended currently

`cd frontend`

`npm i`

`npm run dev` or `npm run dev -- -o`

## Running on ios & android

XCode needed for IOS and all android/java dependencies installed for android.

One terminal needs to be running the following:
`npm run dev -- -o`

In a new terminal, we need to sync the build:

`npx @ionic/cli capacitor sync ios --no-build`

`npx @ionic/cli capacitor sync android --no-build`

then we can launch:

`npx @ionic/cli capacitor run ios --livereload-url=http://127.0.0.1:3000  --external --mode development`

`npx @ionic/cli capacitor run android --livereload-url=http://127.0.0.1:3000  --external --mode development`
