/* eslint-disable @typescript-eslint/no-explicit-any */
import { css, customElement, html, LitElement, property, state } from 'lit-element';
import { Repository } from '../types/Repository';

import dayjs from 'dayjs/esm';
import allStyles from '../styles/all-styles';
import loadScript from '../services/script-loader';
import appEvents from '../services/app-events';
import delve from 'dlv';

import '@material/mwc-icon';
import '@material/mwc-select';
import '@material/mwc-list/mwc-list-item';
import './git-codemirror';
import { Commit } from '../types/Commit';
import { nothing } from 'lit-html';
import { SnapManifest } from '../types/SnapManifest';
import { SelectedFile } from '../types/SelectedFile';

declare let COMMITS: any;
declare let SNAP_MANIF: any;
declare let FILES: any;

@customElement('git-repository')
export default class GitRepositoryElement extends LitElement {
  @property({ type: Object }) repository: Repository | null;
  @property({ type: Array }) branches: Array<string> = [];
  @property({ type: String }) selectedBranch: string | null = null;
  @state() commits: Array<Commit> = [];
  @state() selectedCommit: Commit | null = null;
  @state() snapManifest: SnapManifest | null = null;
  @state() files;
  @state() selectedFolder;
  @state() folderHistory: Array<string> = [];
  @state() loadedFiles = {};
  @state() renderCodeMirror;
  @state() selectedFile: SelectedFile | null;

  updated(changedProps) {
    if (changedProps.has('repository')) {
      if (this.repository?.normname) {
        this.commits = COMMITS[this.repository?.normname] ?? [];
      }
    }
  }

  createFileStructure() {
    const paths = this.snapManifest?.map(sn => sn.fnm) ?? [];

    const treePath = {};
    paths.forEach(path => {
      const levels = path.split('/');
      const file = levels.pop();

      let prevLevel = treePath;
      let prevProp = levels.shift();

      levels.forEach(prop => {
        prevLevel[`${prevProp}`] = prevLevel[`${prevProp}`] || {};
        prevLevel = prevLevel[`${prevProp}`];
        prevProp = prop;
      });

      prevLevel[`${prevProp}`] = (prevLevel[`${prevProp}`] || [])?.concat?.([file]);
    });

    const files = treePath['undefined'];
    const filesAndFolders = {};
    for (const prop in treePath) {
      if (prop !== 'undefined') {
        filesAndFolders[prop] = treePath[prop];
      } else {
        filesAndFolders['undefined'] = files;
      }
    }
    this.files = filesAndFolders;
    this.selectedFolder = filesAndFolders;
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
        overflow: auto;
        max-height: 400px;
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

      explorer-folder:not([header]):hover,
      explorer-file:hover {
        background-color: var(--app-hover-color);
        transition: 0.3 ease;
        cursor: pointer;
        border-bottom: 1px solid #ddd;
      }

      explorer-file[selected] {
        background-color: var(--app-hover-color);
        transition: 0.3 ease;
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

      h5[selected-file] {
        margin: 1rem 0;
      }
    `,
  ];

  async loadFileContents(file) {
    this.renderCodeMirror = false;
    const fileView = this.snapManifest?.find(f => `${this.folderHistory.join('/')}${this.folderHistory?.length > 0 ? '/' : ''}${file}` === f.fnm);
    if (!fileView) {
      return;
    }

    await loadScript(`data/f_${fileView.fhash}.js`);
    this.loadedFiles[fileView.fhash] = FILES[fileView.fhash];
    this.selectedFile = {
      name: file,
      view: this.loadedFiles[fileView.fhash],
      hash: fileView.fhash,
    } as SelectedFile;

    setTimeout(() => {
      this.renderCodeMirror = true;
    }, 500);
  }

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
                this.renderCodeMirror = false;
                this.selectedFile = null;
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
          if (this.selectedCommit) {
            this.selectedFile = null;
            this.renderCodeMirror = false;
            await loadScript(`/data/c_${this.selectedCommit.hash}.snapmanifest.js`);
            this.snapManifest = SNAP_MANIF[this.selectedCommit.hash];
            this.createFileStructure();
          }
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
                <span
                  ><a
                    @click=${e => {
                      e.preventDefault();
                      this.selectedFolder = this.files;
                      this.folderHistory = [];
                    }}
                    href="#"
                    >${this.repository?.name}${this.folderHistory?.length > 0 ? '/' : ''}</a
                  >${this.folderHistory.map(
                    (f, idx) =>
                      html`<a
                          @click=${e => {
                            e.preventDefault();
                            let hasFoundFolder = false;
                            const newFolderHistory = this.folderHistory.map(ff => {
                              if (ff === f) {
                                hasFoundFolder = true;
                                return ff;
                              }
                              if (!hasFoundFolder) {
                                return ff;
                              }
                              return null;
                            });
                            this.folderHistory = newFolderHistory.filter(ff => Boolean(ff)) as Array<string>;
                            this.selectedFolder = delve(this.files, this.folderHistory);
                          }}
                          href="#"
                          >${f}</a
                        >${idx !== this.folderHistory?.length - 1 ? '/' : ''}`
                  )}</span
                >
                <flex-spacer></flex-spacer>
                <span>Last Updated: ${dayjs(this.selectedCommit?.timestamp).format('MMM DD, YYYY')}</span>
              </explorer-folder>
              ${Object.keys(this.selectedFolder ?? {})
                ?.filter(f => f !== 'undefined')
                ?.map(folder => {
                  if (typeof this.selectedFolder?.[folder] === 'string') {
                    return html`
                      <explorer-file
                        ?selected=${this.selectedFile?.name === folder}
                        @click=${async () => {
                          this.loadFileContents(this.selectedFolder?.[folder]);
                        }}
                      >
                        <mwc-icon>insert_drive_file</mwc-icon>
                        <span>${this.selectedFolder?.[folder]}</span>
                      </explorer-file>
                    `;
                  } else {
                    return html`
                      <explorer-folder
                        @click=${() => {
                          this.folderHistory = [...this.folderHistory, folder];
                          this.selectedFolder = this.selectedFolder[folder];
                        }}
                      >
                        <mwc-icon>folder</mwc-icon>
                        <span>${folder}</span>
                      </explorer-folder>
                    `;
                  }
                })}
              ${this.selectedFolder?.['undefined']?.map(
                file => html`
                  <explorer-file
                    ?selected=${this.selectedFile?.name === file}
                    @click=${async () => {
                      this.loadFileContents(file);
                    }}
                  >
                    <mwc-icon>insert_drive_file</mwc-icon>
                    <span>${file}</span>
                  </explorer-file>
                `
              )}
            </file-explorer>
          `}

      <h5 selected-file>${this.selectedFile?.name}</h5>
      ${!this.renderCodeMirror ? nothing : html`<git-codemirror .selectedFile=${this.selectedFile}></git-codemirror> `}
    `;
  }
}
