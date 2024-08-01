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