import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
.then(() => {
  function setRandomBackgrounds() {
    const elements = document.querySelectorAll('.initials-circle');
    elements.forEach(el => {
      const randomColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
      (el as HTMLElement).style.backgroundColor = randomColor;
    });
  }

  setRandomBackgrounds();

  const observer = new MutationObserver(setRandomBackgrounds);
  observer.observe(document.body, { childList: true, subtree: true });
})
  .catch((err) => console.error(err));
