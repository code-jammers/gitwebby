import { html, LitElement, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Repository } from '../types/Repository';
import '@material/mwc-button';
import '@material/mwc-textfield';
import '@material/mwc-circular-progress-four-color';
import loadScript from '../services/script-loader';
import allStyles from '../styles/all-styles';
import dayjs from 'dayjs/esm';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let REPO_LIST: any;

@customElement('git-repositories')
export default class GitRepositoriesElement extends LitElement {
  @property({ type: String }) repoListName: string = '?';
  @property({ type: Array }) repositories: Array<Repository> = [];
  @state() filteredRepositories: Array<Repository> = [];
  @state() isLoading: boolean = false;

  async loadTitle() {
    await loadScript('/data/repo-list.js');
    this.repoListName = REPO_LIST['name'];
  }

  updated(changedProperties) {
    this.loadTitle();
    if (changedProperties.has('repositories')) {
      this.filteredRepositories = this.repositories;
    }
  }

  static styles = [
    allStyles,
    css`
      :host {
        display: block;
        padding: 24px;
        max-width: var(--app-max-width);
        margin: 0 auto;
      }

      th,
      td {
        font-size: 14px;
        color: var(--app-light-text-color);
        padding: 0px;
        min-width: 150px;
        padding: 12px;
      }

      td[name] {
        font-size: 22px;
        color: var(--app-primary-color);
      }

      mwc-textfield {
        margin-right: 12px;
      }

      search-container {
        display: flex;
        align-items: center;
        margin-bottom: 2rem;
      }
    `,
  ];

  render() {
    return html`
      <h3>Repositories: ${this.repoListName}</h3>
      <search-container>
        <mwc-textfield
          outlined
          label="Search"
          @input=${event => {
            this.isLoading = true;
            const searchTerm = event.target.value;
            setTimeout(() => {
              this.isLoading = false;
            }, 300);
            if (searchTerm.trim() === '') {
              this.filteredRepositories = this.repositories;
            } else {
              this.filteredRepositories = this.repositories.filter(r => r.name?.toLowerCase().includes(searchTerm?.toLowerCase()));
            }
          }}
        ></mwc-textfield>
        <mwc-circular-progress-four-color ?hidden=${!this.isLoading} indeterminate></mwc-circular-progress-four-color>
      </search-container>
      <table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Description</td>
            <td>Modified Date</td>
            <td>Authors</td>
            <td>Actions</td>
          </tr>
        </thead>
        ${this.filteredRepositories?.map(
          repository => html`
            <tr>
              <td title=${repository.name} name>${repository.name}</td>
              <td title=${repository.descr}>${repository.descr}</td>
              <td title=${repository.last_mod ? dayjs(repository.last_mod) : ''}>${dayjs(repository.last_mod).format('MM/DD/YYYY')}</td>
              <td title=${repository.authors ? repository.authors?.join(', ') : ''}>${repository.authors?.length} Authors</td>
              <td>
                <a href="/repository/${repository.normname}"><mwc-button outlined>Browse</mwc-button></a>
              </td>
            </tr>
          `
        )}
      </table>
    `;
  }
}
