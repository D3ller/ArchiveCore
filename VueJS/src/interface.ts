export interface Artist {
    id?: number;
    name: string;
    avatarURL: string;
    slug: string;
    listener: number;
    songs: Song[];
    recentSongs: Song[];
    Album: Album[];
    feat: { song: Song }[];
    _count: {
        subscription: number;
    };
    subscribed: boolean;
}


export interface Album {
    id?: number;
    title: string;
    artist: Artist;
    coverURL: string;
    slug: string;
}

export interface Song {
    id?: number;
    title: string;
    artist: Artist[];
    album: Album;
    songURL: string;
    coverURL: string;
    slug: string;
    featurings?: Artist[];
    duration:string|number;
    songs?: Song[];
}

export interface Playlist {
    id?: number;
    title: string;
    songs: Song[];
    coverURL: string;
    slug: string;
}