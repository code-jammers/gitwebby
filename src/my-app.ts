/* eslint-disable @typescript-eslint/no-explicit-any */
import { css, customElement, html, LitElement, state } from 'lit-element';
import { PendingStateEvent, SiteErrorEvent } from './events';
import navaid from 'navaid';
import './components/git-toolbar';
import { Repository } from './types/Repository';
import { Branch } from './types/Branch';
import allStyles from './styles/all-styles';

declare let REPOS: any;
declare let BRANCHES: any;

@customElement('my-app')
export class MyAppElement extends LitElement {
  @state() private page: string | undefined;
  @state() private repositories: Array<Repository> = [];
  @state() private branches: Array<Branch> = [];
  @state() private repository: Repository | null;

  async firstUpdated() {
    await import('../data/repos.js');
    await import('../data/branches.js');
    this.repositories = JSON.parse(JSON.stringify(REPOS)).map(repo => ({ ...repo, authors: repo.authors.split(',') , normname: repo.name.replaceAll("/","__") }));
    this.branches = Object.entries(JSON.parse(JSON.stringify(BRANCHES))).map((b: any) => ({ repo: b[0], main: b[1].main, branches: b[1].branches }));
    console.log('repositories', this.repositories);
    console.log('branches', this.branches);

    this.addEventListener(SiteErrorEvent.eventName, () => {
      this.#changePage('error');
    });

    const router = navaid();

    router.on('/', () => {
      window.location.href = '/repositories';
    });

    router.on('/repositories', () => {
      this.#changePage('repositories', () => import('./components/git-repositories.js'));
    });

    router.on('/repository/:name', ctx => {
      const repositoryName = ctx?.name;
      this.repository = this.repositories.find(repo => repo.normname === repositoryName) ?? null;
      this.#changePage('repository', () => import('./components/git-repository.js'));
    });

    router.on('/branches', () => {
      this.#changePage('branches', () => import('./components/git-branches.js'));
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
    ...allStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        --app-primary-color: #9b4dca;
        --app-light-text-color: #606c76;
      }

      .wrapper {
        display: block;
        overflow: hidden;
        position: relative;
        width: 100%;
      }

      [hidden] {
        display: none;
      }
    `,
  ];

  render() {
    return html`
      <git-toolbar .selectedPage=${this.page ?? ''}></git-toolbar>
      <main class="wrapper">
        <git-repositories .repositories=${this.repositories} ?hidden=${this.page !== 'repositories'} ?active=${this.page === 'repositories'}></git-repositories>
        <git-repository
          .branches=${this.branches.find(b => b.repo === this.repository?.normname)?.branches ?? []}
          .selectedBranch=${this.branches.find(b => b.repo === this.repository?.normname)?.main ?? null}
          .repository=${this.repository}
          ?hidden=${this.page !== 'repository'}
          ?active=${this.page === 'repository'}
        ></git-repository>
        <git-branches .branches=${this.branches} ?hidden=${this.page !== 'branches'} ?active=${this.page === 'branches'}></git-branches>
      </main>
    `;
  }
}
