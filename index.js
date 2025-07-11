const axios = require('axios');

class VibeSync {
    /**
     * @param {Client} BotDevu 
     */
    constructor(BotDevu) {
        this.BotDevu = BotDevu;
    }

    /**
     * @param {String} ChannelId 
     * @param {String} status
     * @returns {Promise<{success: boolean, message: string}>}
     */
    async setVoiceStatus(ChannelId, status) {
        try {
            const response = await axios.put(
                `https://discord.com/api/v10/channels/${ChannelId}/voice-status`,
                {status: (typeof status === 'string' && status.length > 0) ? status : ''},
                { headers: { Authorization: `Bot ${this.BotDevu.token}` } }
            );

            if (response.status !== 204) {
                return {
                    success: false,
                    message: `Failed to update voice channel status. Status code: ${response.status}`,
                };
            }

            return {
                success: true,
                message: 'Voice channel status updated successfully.',
            };
        } catch (error) {
            if (error.response) {
                return {
                    success: false,
                    message: `API Error: ${error.response.data.message}`,
                };
            } else if (error.request) {
                return {
                    success: false,
                    message: 'No response received from API.',
                };
            } else {
                return {
                    success: false,
                    message: `Request Setup Error: ${error.message}`,
                };
            }
        }
    }

    async resetVoiceStatus(ChannelId) {
        return await this.setVoiceStatus(ChannelId, '');
    }
}

module.exports = { VibeSync };
