export type SnapManifest = Array<SnapManifestFile>;

export interface SnapManifestFile {
  fhash: string;
  fnm: string;
}
