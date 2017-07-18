import { AnimationWorkshopPage } from './app.po';

describe('animation-workshop App', () => {
  let page: AnimationWorkshopPage;

  beforeEach(() => {
    page = new AnimationWorkshopPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to et!');
  });
});
