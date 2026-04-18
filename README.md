# React + TypeScript + Vite

Name: Huseyin Yurekli

I’ll describe every change step by step.

1- The project was set up using Vite.
2- After setting up the project, I configured the endpoint in the .env file, implemented a service layer to fetch data using Axios, and handled state management with TanStack Query.
3- I partially developed the UI, organized the layout and component structure, and used Bootstrap along with pure CSS for styling.
4- The UI was enhanced by adding a search input for filtering data, and a modal was introduced for the detail view.”
5- I set up the routing structure using TanStack File-Based Routing.












## Local Setup

To run the project on your local machine, first clone the repository and navigate to the project directory:

```bash
git clone <repo-url>
cd <project-folder>
npm install

Create a .env file in the root directory of the project and add the following variables:”

VITE_JOTFORM_API_BASE_URL=https://api.jotform.com
VITE_JOTFORM_API_KEY=YOUR_JOTFORM_API_KEY

VITE_JOTFORM_CHECKINS_FORM_ID=261065067494966
VITE_JOTFORM_MESSAGES_FORM_ID=261065765723966
VITE_JOTFORM_SIGHTINGS_FORM_ID=261065244786967
VITE_JOTFORM_PERSONAL_NOTES_FORM_ID=261065509008958
VITE_JOTFORM_ANONYMOUS_TIPS_FORM_ID=261065875889981

npm run dev
http://localhost:5173/
