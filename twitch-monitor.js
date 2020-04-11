const auth = require('./auth.json');
const TwitchApi = require('twitch-api');


class TwitchMonitor {
    static start() {
        this.client = new TwitchApi({
            clientId: auth.twitch_client_id,
            clientSecret: auth.twitch_client_secret
        });

        // Check interval
        let checkIntervalMs = parseInt(auth.twitch_check_interval_ms);

        if (isNaN(checkIntervalMs) || checkIntervalMs < TwitchMonitor.MIN_POLL_INTERVAL_MS) {
            // Enforce minimum poll interval. We need to avoid hitting any rate limits, but there's no point in updating
            // > approx. every minute because the Twitch API keeps its data and/or responses cached for a while anyway.
            checkIntervalMs = TwitchMonitor.MIN_POLL_INTERVAL_MS;
        }

        setInterval(() => {
            this.refresh();
        }, checkIntervalMs);

        // OK
        console.log('[TwitchMonitor]', `Configured stream status polling [${checkIntervalMs}ms] for channels [${auth.twitch_channels}].`);

        // Immediate refresh after startup (allow voice etc to settle)
        setTimeout(() => {
            this.refresh();
        }, 10000);
    }

    static refresh() {
        if (!auth.twitch_channels) {
            console.warn('[TwitchMonitor]', 'No channels configured');
            return;
        }

        // Check buffer: are we waiting?
        if (this.eventBufferStartTime) {
            let now = Date.now();
            let timeSinceMs = now - this.eventBufferStartTime;

            if (timeSinceMs >= TwitchMonitor.EVENT_BUFFER_MS) {
                // Buffer is done
                this.eventBufferStartTime = null;
            } else {
                // We're in the buffer zone, do nothing
                return;
            }
        }

        let params = {
            "channel": auth.twitch_channels
        };

        this.client.getStreams(params, (idk, data) => {
            if (data && data.streams) {
                this.handleStreamList(data);
            } else {
                console.warn('[TwitchMonitor]', 'Did not receive a response from the server with stream info.')
            }
        });
    }

    static handleStreamList(data) {
        // Index channel data & build list of stream IDs now online
        let nextOnlineList = [];

        for (let i = 0; i < data.streams.length; i++) {
            let _stream = data.streams[i];
            let channelName = _stream.channel.name;

            this.channelData[channelName] = _stream.channel;
            this.streamData[channelName] = _stream;

            nextOnlineList.push(_stream.channel.name);
        }

        // Find channels that are now online, but were not before
        let notifyFailed = false;
        let anyChanges = false;

        for (let i = 0; i < nextOnlineList.length; i++) {
            let _chanName = nextOnlineList[i];

            if (this.activeStreams.indexOf(_chanName) === -1) {
                // Stream was not in the list before
                console.log('[TwitchMonitor]', 'Stream channel has gone online:', _chanName);
                anyChanges = true;
            }

            if (!this.handleChannelLiveUpdate(this.channelData[_chanName], this.streamData[_chanName], true)) {
                notifyFailed = true;
            }
        }

        // Find channels that are now offline, but were online before
        for (let i = 0; i < this.activeStreams.length; i++) {
            let _chanName = this.activeStreams[i];

            if (nextOnlineList.indexOf(_chanName) === -1) {
                // Stream was in the list before, but no longer
                console.log('[TwitchMonitor]', 'Stream channel has gone offline:', _chanName);
                this.handleChannelOffline(this.channelData[_chanName], this.streamData[_chanName]);
                anyChanges = true;
            }
        }

        if (!notifyFailed) {
            // Notify OK, update list
            this.activeStreams = nextOnlineList;

            if (anyChanges) {
                // Twitch has a weird caching problem where channels seem to quickly alternate between on<->off<->on<->off
                // To avoid spamming, we'll create a buffer time-out whenever this happens
                // During the buffer time (see EVENT_BUFFER_MS) no Twitch API requests will be made
                this.eventBufferStartTime = Date.now();
            }
        } else {
            console.log('[TwitchMonitor]', 'Could not notify channel, will try again next update.');
        }
    }

    static handleChannelLiveUpdate(channelObj, streamObj, isOnline) {
        for (let i = 0; i < this.channelLiveCallbacks.length; i++) {
            let _callback = this.channelLiveCallbacks[i];

            if (_callback) {
                if (_callback(channelObj, streamObj, isOnline) === false) {
                    return false;
                }
            }
        }

        return true;
    }

    static handleChannelOffline(channelObj, streamObj) {
        this.handleChannelLiveUpdate(channelObj, streamObj, false);

        for (let i = 0; i < this.channelOfflineCallbacks.length; i++) {
            let _callback = this.channelOfflineCallbacks[i];

            if (_callback) {
                if (_callback(channelObj) === false) {
                    return false;
                }
            }
        }

        return true;
    }

    static onChannelLiveUpdate(callback) {
        this.channelLiveCallbacks.push(callback);
    }

    static onChannelOffline(callback) {
        this.channelOfflineCallbacks.push(callback);
    }
}





TwitchMonitor.eventBufferStartTime = 0;
TwitchMonitor.activeStreams = [];
TwitchMonitor.channelData = { };
TwitchMonitor.streamData = { };

TwitchMonitor.channelLiveCallbacks = [];
TwitchMonitor.channelOfflineCallbacks = [];

TwitchMonitor.EVENT_BUFFER_MS = 2 * 60 * 1000;
TwitchMonitor.MIN_POLL_INTERVAL_MS = 1 * 60 * 1000;

module.exports = TwitchMonitor;