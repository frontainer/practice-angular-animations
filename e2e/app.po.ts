import { browser, by, element } from 'protractor';

export class AnimationWorkshopPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('et-root h1')).getText();
  }
}
