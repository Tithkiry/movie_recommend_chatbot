const userState = new Map();

/**
 * Store user state.
 */
function setState(chatId, state) {
    userState.set(chatId, state);
}

/**
 * Retrieve user state.
 */
function getState(chatId) {
    return userState.get(chatId);
}

/**
 * Clear user state.
 */
function clearState(chatId) {
    userState.delete(chatId);
}

module.exports = {
    setState,
    getState,
    clearState
};