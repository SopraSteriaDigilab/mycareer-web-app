# MyCareer Web App

This project hold the my career web app. This application uses the [MyCareer Web Service](http://slnxlrgceglab01.edin.uk.sopra/mycareer/mycareer-rest-api).

## Prerequisites

1. [JDK 1.8+](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
2. [Gradle 2.3+](https://gradle.org/gradle-download/)
3. [NodeJS v4.6.0+](https://nodejs.org/en/download/)

## Getting Started Locally

1. Clone the repository using `git clone git@slnxlrgceglab01:mycareer/mycareer-web-app.git`
2. `cd mycareer-web-app`
3. `gradle bootRun`
4. The web app will now be available at [localhost:8000](http://localhost:8000/)

### Notes:
- You can build this project using `gradle build`
	- This will build an executable file in the `/build/libs` directory.
- You can use `npm install` to install the node dependencies.
	- You then use the gulp tasks with npm or gradle. e.g:
		`gradle minify` or
		`gulp minifiy`