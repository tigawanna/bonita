export async function getNpmPackageVersion(packageName: string,old_version: string){
    try {
        let headersList = {
            "Accept": "application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)"
        }

        let response = await fetch("https://registry.npmjs.org/" + packageName, {
            method: "GET",
            headers: headersList
        });
        let data = await response.json() as unknown as NpmPackageInfo
        return {name:data.name,version:data['dist-tags'],curr_version:old_version}
    } catch (error) {
        console.log("error getting latest vesruon", error);
    }
}





export interface NpmPackageInfo {
    name: string;
    "dist-tags": DistTags;
    versions: { [key: string]: Version };
    modified: Date;
}

export interface DistTags {
    latest: string;
    next: string;
    experimental: string;
    beta: string;
    rc?: string;
    canary?: string;
    alpha?: string;
}

export interface Version {
    name: string;
    version: string;
    dist: Dist;
    engines: Engines;
    dependencies?: Dependencies;
    devDependencies?: DevDependencies;
    deprecated?: string;
    peerDependencies?: PeerDependencies;
}

export interface Dependencies {
    [key: string]: string;
}
export interface DevDependencies {
    [key: string]: string;
}

export interface Dist {
    shasum: string;
    tarball: string;
    integrity: string;
    signatures: Signature[];
    fileCount?: number;
    unpackedSize?: number;
    "npm-signature"?: string;
}

export interface Signature {
    keyid: string;
    sig: string;
}

export interface Engines {
    node: string;
}

export interface PeerDependencies {
    envify: string;
}
