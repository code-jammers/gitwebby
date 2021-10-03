import { customElement, html, LitElement, property } from 'lit-element';
import { Repository } from '../types/Repository';

@customElement('git-repositories')
export default class GitRepositoriesElement extends LitElement {
  @property({ type: Array }) repositories: Array<Repository> = [];
  render() {
    return html`
      <h1>Repositories</h1>
      ${this.repositories?.map(repository => html` ${repository.name}`)}
    `;
  }
}
