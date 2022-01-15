# To Run tests on local machine

## Pre - requisites
- node > 12.22.7
- npm > 6.14.15
- copy .dotenv file(sent separately) to the root of project

## How to run
From project root run next commands:
1. Install dependencies
``npm install``
2. Run tests 
``npx playwright test``

# To Run tests in docker image

## Pre - requisites
- docker installed
- copy .dotenv file(sent separately) to the root of project

## How to run
From project root run next commands:
1. Build Docker image
``docker build . -f .Dockerfile -t e2e``
2. Run Docker image
``docker run --rm e2e``

# General information on framework structure
- ``data/`` contains static data sets, and other constants required for tests
- ``helpers/`` contains helper classes to work with email service provider API, to work with test app API, to perform general login before all tests, and other utility functions
- ``page-objects/`` contains classes of pages and page fragments to work with application under test
- ``tests/`` - spec files (test scripts itself)
- ``manual-tests/`` - includes xls document with tests for p.1 of task (there are several tabs in document)

General authentication between all test is performed in ``global-setup.ts``, API of APP is used to receive email and API of MailSac is used to retrieve url with token, open it and save session state to ``state.json`` file, which is than shared across all test workers. This normally should be done just through APP API, but since I don't have access to it, it was done this way.

Sign in through Google is ``skipped`` from default test run, since google policy stands against using any kind of automation tools on their sign in flow, and does a lot to prevent it - from time to time page view is changed, page view is different in headed vs headless browser mode etc. So I added test which works only in headed mode for demonstration, but normally sign-in in through Google via UI should be omitted in test automation solutions.


