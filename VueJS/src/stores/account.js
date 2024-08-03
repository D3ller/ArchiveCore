import { defineStore } from 'pinia'

export const useAccount = defineStore('account', {
    state: () => {
        return { connected: false}
    },
    // could also be defined as
    // state: () => ({ count: 0 })
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
        return {currentSong: null, queue: [], prev: []}
    },

    actions: {
        setSong(song) {
            console.log('setSong', song)
            this.currentSong = song
        },

        addToQueue(song) {
            this.queue.push(song)
        },

        addToPrevious(song) {
            this.prev.push(song)
        },

    },
})