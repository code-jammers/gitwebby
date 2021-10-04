import { css, customElement, html, LitElement, property, state } from 'lit-element';
import { Repository } from '../types/Repository';

import dayjs from 'dayjs/esm';
import allStyles from '../styles/all-styles';
import loadScript from '../services/script-loader';
import appEvents from '../services/app-events';

import '@material/mwc-icon';
import '@material/mwc-select';
import '@material/mwc-list/mwc-list-item';
import { Commit } from '../types/Commit';
import { nothing } from 'lit-html';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let COMMITS: any;

@customElement('git-repository')
export default class GitRepositoryElement extends LitElement {
  @property({ type: Object }) repository: Repository | null;
  @property({ type: Array }) branches: Array<string> = [];
  @property({ type: String }) selectedBranch: string | null = null;
  @state() commits: Array<Commit> = [];
  @state() selectedCommit: Commit | null = null;

  updated(changedProps) {
    if (changedProps.has('repository')) {
      if (this.repository?.normname) {
        this.commits = COMMITS[this.repository?.normname] ?? [];
        console.log(this.commits);
      }
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

      mwc-select {
        min-width: 380px;
      }

      mwc-select[commit] {
        margin-bottom: 2rem;
      }

      file-explorer {
        border: 1px solid var(--app-border-color);
        min-height: 300px;
        display: block;
        border-radius: 8px;
        overflow: auto;
      }

      mwc-icon {
        color: var(--app-primary-color);
      }

      explorer-folder,
      explorer-file {
        padding: 8px;
        border-bottom: 1px solid #eee;
        display: flex;
        align-items: center;
      }

      explorer-folder:hover,
      explorer-file:hover {
        background-color: var(--app-hover-color);
        transition: 0.3 ease;
        cursor: pointer;
        border-bottom: 1px solid #ddd;
      }

      explorer-folder span,
      explorer-file span {
        font-size: 13px;
        color: var(--app-light-text-color);
        margin-left: 8px;
      }

      explorer-folder[header] {
        font-size: 12px;
        color: #eee;
        pointer-events: none;
        padding: 16px 8px;
      }

      flex-spacer {
        display: flex;
        flex: 1 1 auto;
      }

      h5 {
        display: flex;
        align-items: center;
      }

      h5 span {
        color: var(--app-light-text-color);
        font-size: 18px;
        margin-left: 8px;
      }

      span[default-branch] {
        color: var(--app-primary-color);
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
          @change=${async event => {
            this.selectedBranch = event.target.value;
            try {
              await loadScript(`/data/${this.repository?.normname}.${this.selectedBranch}.commits.js`);
              if (this.repository) {
                const repository = {
                  ...this.repository,
                  last_mod: COMMITS[this.repository?.normname][0].timestamp,
                };
                appEvents.dispatch('Repository', 'Update', repository);

                // Reset commits && selected commit because branch has changed
                this.selectedCommit = null;
                this.commits = COMMITS[this.repository?.normname] ?? [];
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

      <h5>Commits <span>(${this.commits?.length})</span></h5>

      <mwc-select
        commit
        outlined
        label="Commit"
        .value=${this.selectedCommit?.hash ?? ''}
        @change=${async event => {
          this.selectedCommit = this.commits.find(c => c.hash === event.target.value) ?? null;
        }}
      >
        ${this.commits?.map(
          (commit: Commit, idx) => html`
            <mwc-list-item title=${commit.timestamp ? dayjs(commit.timestamp) : ''} twoline value=${commit.hash}
              ><span>${commit.subject} ${idx === 0 ? html`<span default-branch>(${this.selectedBranch})</span>` : ''}</span>
              <span slot="secondary"> Commit: ${commit.hash.substr(0, 5)}</span>
            </mwc-list-item>
          `
        )}
      </mwc-select>

      ${!this.selectedCommit
        ? nothing
        : html`
            <p>
              Subject: <span>${this.selectedCommit?.subject}</span>
              <br />
              Timestamp:
              <span title=${this.selectedCommit?.timestamp ? dayjs(this.selectedCommit.timestamp) : ''}>
                ${dayjs(this.selectedCommit?.timestamp).format('MMM DD, YYYY')}</span
              >
              <br />
              Author: <span>${this.selectedCommit?.author}</span>
              <br />
              Hash: <span>${this.selectedCommit?.hash}</span>
            </p>

            <file-explorer>
              <explorer-folder header>
                <mwc-icon>code</mwc-icon>
                <span>${this.repository?.name}:/</span>
                <flex-spacer></flex-spacer>
                <span>Last Updated: ${dayjs(this.selectedCommit?.timestamp).format('MMM DD, YYYY')}</span>
              </explorer-folder>
              <explorer-folder>
                <mwc-icon>folder</mwc-icon>
                <span>src</span>
              </explorer-folder>
              <explorer-folder>
                <mwc-icon>folder</mwc-icon>
                <span>dist</span>
              </explorer-folder>
              <explorer-file>
                <mwc-icon>insert_drive_file</mwc-icon>
                <span>index.html</span>
              </explorer-file>
              <explorer-file>
                <mwc-icon>insert_drive_file</mwc-icon>
                <span>package.json</span>
              </explorer-file>
            </file-explorer>
          `}
    `;
  }
}
