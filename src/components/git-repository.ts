import dayjs from 'dayjs/esm';
import { css, customElement, html, LitElement, property, state } from 'lit-element';
import allStyles from '../styles/all-styles';
import { Repository } from '../types/Repository';

import '@material/mwc-select';
import '@material/mwc-list/mwc-list-item';

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
      <header>
        <h3>${this.repository?.name}</h3>
        <mwc-select
          outlined
          label="Branch"
          .value=${this.selectedBranch ?? ''}
          @change=${event => {
            this.selectedBranch = event.target.value;
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
