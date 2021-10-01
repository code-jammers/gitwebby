import { css, customElement, html, LitElement, state } from 'lit-element';
import { ChangePathEvent, PendingStateEvent, SiteErrorEvent } from './events';
import navaid from 'navaid';

@customElement('my-app')
export class MyAppElement extends LitElement {
  @state() private page: string | undefined;

  async firstUpdated() {
    this.addEventListener(ChangePathEvent.eventName, (event: ChangePathEvent) => {
      this.#changePage(event.detail.path);
    });

    this.addEventListener(SiteErrorEvent.eventName, () => {
      this.#changePage('error');
    });

    const router = navaid();

    router.on('/', () => {
      this.#changePage('');
    });

    router.on('/commits', () => {
      this.#changePage('commits');
    });

    router.listen();
  }

  async #lazyLoadExtraComponents() {
    // try {
    // } catch (error) {
    //   console.warn('One or more components failed to load', error);
    // }
  }

  #changePage(mainPage: string, importFunction?: () => void) {
    const handlePageChange = new Promise<void>(async res => {
      this.page = mainPage;
      try {
        await importFunction?.();

        setTimeout(() => this.#lazyLoadExtraComponents(), 500);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } catch (error) {
        console.warn(error);
        this.page = 'error';
      }
      res();
    });
    this.dispatchEvent(new PendingStateEvent(handlePageChange));
  }

  static styles = [
    css`
      :host {
        display: flex;
        flex-direction: column;
        --app-primary-color: #ff4438;
      }

      [hidden] {
        display: none;
      }
    `,
  ];

  render() {
    return html` Web components go here ${this.page}`;
  }
}
