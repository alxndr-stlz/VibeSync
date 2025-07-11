// noinspection ExceptionCaughtLocallyJS

const axios = require('axios');

class VibeSync {
    /**
     * @param {Client} Client
     */
    constructor(Client) {
        this.Client = Client;
        this.api = axios.create({
            baseURL: 'https://discord.com/api/v10',
            headers: {Authorization: `Bot ${Client.token}`},
            timeout: 5000
        });
    }

    /**
     * Checks if the bot has the required permissions to manage the voice channel.
     * @private
     * @param {String} channelId
     */
    async _checkPermissions(channelId) {
        const channel = this.Client.channels.cache.get(channelId);
        if (!channel) throw new Error(`Channel ${channelId} not found.`);
        if (channel.type !== 'GUILD_VOICE') throw new Error(`Channel ${channelId} is not a voice channel.`);
        const permissions = channel.permissionsFor(this.Client.user);
        if (!permissions?.has('MANAGE_CHANNELS')) throw new Error('Missing MANAGE_CHANNELS permission.');
    }

    /**
     * Sets the voice status of a channel.
     * @param {String} channelId
     * @param {String} status
     * @returns {Promise<{success: boolean}>}
     */
    async setVoiceStatus(channelId, status = '') {
        await this._checkPermissions(channelId);
        try {
            const response = await this.api.put(`/channels/${channelId}/voice-status`, { status });
            if (response.status !== 204) throw new Error(`Unexpected status code: ${response.status}`);
            return { success: true };
        } catch (error) {
            throw new Error(
              error.response?.data?.message
                ? `API Error: ${error.response.data.message}`
                : error.request
                  ? 'No response from API.'
                  : `Request Error: ${error.message}`
            );
        }
    }

    /**
     * Resets the voice status of a channel.
     * @param {String} channelId
     * @returns {Promise<{success: boolean}>}
     */
    async resetVoiceStatus(channelId) {
        return await this.setVoiceStatus(channelId, '');
    }
}

module.exports = { VibeSync };
