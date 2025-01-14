import { writable } from "svelte/store";

export let isOpenLogin = writable(false);
export let isOpenSignUp = writable(false);
export let isOpenDescription = writable(false);
export let isOpenContact = writable(false);
export let isNavBarChange = writable(false);