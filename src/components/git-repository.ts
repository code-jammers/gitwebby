import { css, customElement, html, LitElement, property } from 'lit-element';
import { Repository } from '../types/Repository';

import dayjs from 'dayjs/esm';
import allStyles from '../styles/all-styles';
import loadScript from '../services/script-loader';

import '@material/mwc-select';
import '@material/mwc-list/mwc-list-item';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let COMMITS: any;

@customElement('git-repository')
export default class GitRepositoryElement extends LitElement {
  @property({ type: Object }) repository: Repository | null;
  @property({ type: Array }) branches: Array<string> = [];
  @property({ type: String }) selectedBranch: string | null = null;

  static styles = [
    allStyles,
    css`
      :host {
        display: block;
        padding: 24px;
      }

      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      h3 {
        margin-bottom: 0;
      }

      p {
        color: var(--app-primary-color);
        font-weight: 600;
        font-size: 13px;
      }
      p span {
        font-weight: 500;
        color: var(--app-light-text-color);
        margin-bottom: 4px;
        display: inline-block;
      }
    `,
  ];

  render() {
    return html`
      <script src="${this.repository?.normname + '.' + this.selectedBranch + '.commits.js'}"></script>
      <header>
        <h3>${this.repository?.name}</h3>
        <mwc-select
          outlined
          label="Branch"
          .value=${this.selectedBranch ?? ''}
          @change=${async event => {
            this.selectedBranch = event.target.value;
            try {
              await loadScript(`/data/${this.repository?.normname}.${this.selectedBranch}.commits.js`);
              if (this.repository) {
                this.repository.last_mod = COMMITS[this.repository?.normname].timestamp;
              }
            } catch (error) {
              console.error(error);
            }
          }}
        >
          ${this.branches?.map((branch: string) => html` <mwc-list-item value=${branch}><span>${branch}</span> </mwc-list-item> `)}
        </mwc-select>
      </header>

      <p>
        Description: <span>${this.repository?.descr}</span>
        <br />
        Modified on:
        <span title=${this.repository?.last_mod ? dayjs(this.repository.last_mod) : ''}> ${dayjs(this.repository?.last_mod).format('MMM DD, YYYY')}</span>
        <br />
        Authors: <span>${this.repository?.authors.join(', ')}</span>
      </p>
    `;
  }
}
