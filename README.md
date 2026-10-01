# Book Reviewer

Book Reviewer är en app för att recensera böcker. Man kan lägga till,
visa, redigera, ta bort och söka recensioner. En recension har ett
användarnamn, en boktitel och ett betyg (1–10).

Projektet består av två repon:

- **Backend** — ett REST-API i Java Spring Boot ([book-reviewer-BE](https://github.com/JonerSvensson/book-reviewer)).
- **Frontend** (detta repo) — HTML, CSS och JavaScript

## Köra applikationen lokalt

### Backend

Krav: JDK 25

```bash
git clone https://github.com/JonerSvensson/bookreviewer.git
cd bookreviewer
./mvnw spring-boot:run
```

Backend startar på `http://localhost:8080`.

Kör testerna så här:

```bash
./mvnw test
```

### Frontend

Klona [book-reviewer-FE](https://github.com/JonerSvensson/book-reviewer-FE)
och öppna `index.html` med t.ex. live server eller direkt från utforskaren.

Kör E2E testerna så här:

```bash
cd e2e
npm install
npx playwright install chromium
npx playwright test
```

## CI/CD-arbetsflöde

### Backend

Vid push till `dev` körs alla tester automatiskt. Sedan byggs en
Docker-image som pushas till DockerHub. Appen driftsätts till
devmiljön på Render.

Vid push till `main` körs alla tester automatiskt. Sedan byggs en
Docker-image som pushas till DockerHub. Appen driftsätts till
prodmiljön på Render.

### Frontend

Vid pull request körs E2E tester automatiskt, både mot
dev backend och mot main backend.

Vid push till `main` driftsätts frontend också till GitHub Pages.
Vid detta steget byter även workflowet "deploy_gh_pages.yml" ut url från `dev` till `main` för render.


## Live applikation

- Frontend: https://jonersvensson.github.io/book-reviewer-FE/
- Backend (produktion): https://book-reviewer-main.onrender.com/api/reviews
- Backend (utveckling): https://book-reviewer-dev.onrender.com/api/reviews
