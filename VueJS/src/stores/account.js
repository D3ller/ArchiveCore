import { defineStore } from 'pinia'

export const useAccount = defineStore('account', {
    state: () => {
        return { connected: false}
    },
    actions: {
        toggle() {
            this.connected = !this.connected
        },
        set(value) {
            this.connected = value
        },
    },
})

export const Player = defineStore('player', {
    state: () => {
        return {currentSong: null, queue: [], prev: [], volume: 0.5}
    },

    actions: {
        setSong(song) {
            console.log('setSong', song)
            this.currentSong = song
        },

        addToQueueFirst(song) {
            this.queue.unshift(song)
        },

        bulkSetSongs(songs) {
            this.addToQueueFirst(songs)
        },

        addToQueue(song) {
            this.queue.push(song)
        },

        addToPrevious(song) {
            this.prev.push(song)
        },

        setVolume(volume) {
            this.volume = volume
        }

    },
})