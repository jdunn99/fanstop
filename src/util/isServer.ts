/*
 * @desc: Checks if server
 * @params:
 * @returns: boolean
 */
export const isServer = () => typeof window === 'undefined';
