import { css, customElement, html, LitElement, state } from 'lit-element';
import { ChangePathEvent, PendingStateEvent, SiteErrorEvent } from './events';
import navaid from 'navaid';
import { Repository } from './types/Repository';
import { Branch } from './types/Branch';
declare let REPOS: any;
declare let BRANCHES: any;

@customElement('my-app')
export class MyAppElement extends LitElement {
  @state() private page: string | undefined;
  @state() private repositories: Array<Repository> = [];
  @state() private branches: Array<Branch> = [];

  async firstUpdated() {
    this.addEventListener(ChangePathEvent.eventName, (event: ChangePathEvent) => {
      this.#changePage(event.detail.path);
    });

    this.addEventListener(SiteErrorEvent.eventName, () => {
      this.#changePage('error');
    });

    const router = navaid();

    router.on('/', () => {
      this.#changePage('main');
    });

    router.on('/repositories', () => {
      this.#changePage('repositories', () => import('./components/git-repositories.js'));
    });

    router.on('/branches', () => {
      this.#changePage('branches', () => import('./components/git-branches.js'));
    });

    router.listen();
  }

  async #lazyLoadExtraComponents() {
    try {
      await import('../data/repos.js');
      await import('../data/branches.js');
      console.log(REPOS);
      console.log(BRANCHES);
      this.repositories = JSON.parse(JSON.stringify(REPOS));
      this.branches = JSON.parse(JSON.stringify(BRANCHES));
    } catch (error) {
      console.warn('One or more components failed to load', error);
    }
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
    return html`
      <toolbar> </toolbar>
      <git-repositories .repositories=${this.repositories} ?hidden=${this.page !== 'repositories'} ?active=${this.page === 'repositories'}></git-repositories>
      <git-branches .branches=${this.branches} ?hidden=${this.page !== 'branches'} ?active=${this.page === 'branches'}></git-branches>
    `;
  }
}
